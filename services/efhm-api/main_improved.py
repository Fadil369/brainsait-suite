"""
EFHM (إفهم) API - BrainSAIT Healthcare RAG Backend
FastAPI service with Gemini File Search integration
IMPROVED VERSION with Security Enhancements
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, validator, constr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import logging
import google.generativeai as genai
import os
import jwt
import html
from functools import wraps
import json

# Configure logging with audit support
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("efhm")
audit_logger = logging.getLogger("audit")

# Initialize FastAPI
app = FastAPI(
    title="EFHM API",
    description="BrainSAIT Healthcare RAG System powered by Gemini File Search",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration - FIXED: No longer allows all origins
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=600,
)

# Security
security = HTTPBearer()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# JWT Configuration (for demo - replace with Firebase/Auth0)
JWT_SECRET = os.getenv("API_SECRET_KEY", "your_secret_key_min_32_chars")
JWT_ALGORITHM = "HS256"

# ============================================================================
# MODELS WITH ENHANCED VALIDATION
# ============================================================================

class LanguageCode(str, Enum):
    AR = "ar"
    EN = "en"

class CulturalContext(str, Enum):
    SAUDI = "saudi"
    SUDAN = "sudan"
    GULF = "gulf"
    LEVANT = "levant"

class DocumentType(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    XLSX = "xlsx"
    TXT = "txt"
    JSON = "json"

class ComplianceLevel(str, Enum):
    STANDARD = "standard"
    HIPAA = "hipaa"
    PDPL = "pdpl"
    PHI = "phi"

class DocumentMetadata(BaseModel):
    filename: constr(min_length=1, max_length=255, strip_whitespace=True)
    document_type: DocumentType
    language: LanguageCode = LanguageCode.EN
    domain: str = "healthcare"
    tags: List[str] = Field(default_factory=list)
    compliance_level: ComplianceLevel = ComplianceLevel.STANDARD

    @validator('filename')
    def sanitize_filename(cls, v):
        # Remove potentially dangerous characters
        return html.escape(v)

class ChatQuery(BaseModel):
    query: constr(min_length=1, max_length=4000, strip_whitespace=True)
    workspace_id: constr(regex=r'^ws_[a-zA-Z0-9_-]+$')
    language: LanguageCode = LanguageCode.AR
    cultural_context: CulturalContext = CulturalContext.SAUDI
    use_rag: bool = True
    include_citations: bool = True

    @validator('query')
    def sanitize_query(cls, v):
        # Sanitize input to prevent XSS
        return html.escape(v)

class ChatResponse(BaseModel):
    answer: str
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    confidence: float
    language: LanguageCode
    model_used: str
    timestamp: str

class WorkspaceCreate(BaseModel):
    name: constr(min_length=1, max_length=100, strip_whitespace=True)
    description: Optional[str] = None
    language: LanguageCode = LanguageCode.AR
    cultural_context: CulturalContext = CulturalContext.SAUDI

    @validator('name', 'description')
    def sanitize_strings(cls, v):
        if v:
            return html.escape(v)
        return v

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    services: Dict[str, bool]

# ============================================================================
# AUDIT LOGGING
# ============================================================================

async def audit_log(
    user_id: str,
    action: str,
    resource: str,
    details: dict,
    request: Request,
    success: bool = True
):
    """Log security-relevant actions for compliance"""
    audit_logger.info({
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": user_id,
        "action": action,
        "resource": resource,
        "details": details,
        "ip": request.client.host if request.client else "unknown",
        "user_agent": request.headers.get("user-agent", "unknown"),
        "success": success
    })

# ============================================================================
# RATE LIMITING (Simple in-memory - use Redis in production)
# ============================================================================

from collections import defaultdict
from time import time

rate_limit_store = defaultdict(list)
RATE_LIMIT_CALLS = 10
RATE_LIMIT_PERIOD = 60  # seconds

def check_rate_limit(identifier: str) -> bool:
    """Simple rate limiting - replace with Redis-based solution"""
    now = time()
    # Clean old entries
    rate_limit_store[identifier] = [
        timestamp for timestamp in rate_limit_store[identifier]
        if now - timestamp < RATE_LIMIT_PERIOD
    ]
    
    if len(rate_limit_store[identifier]) >= RATE_LIMIT_CALLS:
        return False
    
    rate_limit_store[identifier].append(now)
    return True

# ============================================================================
# DEPENDENCIES WITH IMPROVED SECURITY
# ============================================================================

async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    Verify JWT token
    TODO: Replace with Firebase/Auth0 verification in production
    """
    token = credentials.credentials
    
    try:
        # For demo purposes - use simple JWT
        # In production, use Firebase Admin SDK or Auth0
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    token_payload: Dict = Depends(verify_token)
) -> Dict[str, Any]:
    """Get current user from verified token"""
    # TODO: Fetch user from database
    return {
        "user_id": token_payload.get("sub", "user_unknown"),
        "email": token_payload.get("email", "unknown@brainsait.com"),
        "role": token_payload.get("role", "user")
    }

async def check_user_rate_limit(user: Dict = Depends(get_current_user)):
    """Check rate limit for user"""
    if not check_rate_limit(user["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )
    return user

# ============================================================================
# ROUTES WITH ENHANCED SECURITY
# ============================================================================

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint - No authentication required"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
        services={
            "gemini": GEMINI_API_KEY is not None,
            "database": False,  # TODO: Check DB connection
            "redis": False,  # TODO: Check Redis connection
        }
    )

@app.get("/health", response_model=HealthResponse)
async def health():
    """Detailed health check"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
        services={
            "gemini": GEMINI_API_KEY is not None,
            "database": False,
            "redis": False,
        }
    )

@app.post("/workspaces", status_code=201)
async def create_workspace(
    workspace: WorkspaceCreate,
    request: Request,
    user: Dict = Depends(check_user_rate_limit)
):
    """Create a new workspace for document storage"""
    workspace_id = f"ws_{int(datetime.utcnow().timestamp() * 1000)}"
    
    logger.info(f"Creating workspace {workspace_id} for user {user['user_id']}")
    
    # Audit log
    await audit_log(
        user_id=user["user_id"],
        action="workspace.create",
        resource=workspace_id,
        details={"name": workspace.name},
        request=request
    )
    
    # TODO: Save to database
    
    return {
        "workspace_id": workspace_id,
        "name": workspace.name,
        "description": workspace.description,
        "language": workspace.language,
        "cultural_context": workspace.cultural_context,
        "created_at": datetime.utcnow().isoformat(),
        "user_id": user["user_id"]
    }

@app.get("/workspaces")
async def list_workspaces(
    user: Dict = Depends(check_user_rate_limit)
):
    """List all workspaces for the current user"""
    # TODO: Implement workspace listing from database
    return {
        "workspaces": [],
        "total": 0,
        "user_id": user["user_id"]
    }

@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    workspace_id: str = Field(...),
    metadata: str = Field(...),  # JSON string
    request: Request = None,
    user: Dict = Depends(check_user_rate_limit)
):
    """Upload and index a document for RAG"""
    
    # Validate file type
    allowed_types = ["application/pdf", "text/plain", "application/json"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not allowed"
        )
    
    # Validate file size (10MB max)
    max_size = 10 * 1024 * 1024
    contents = await file.read()
    if len(contents) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds 10MB limit"
        )
    
    logger.info(f"Uploading document {file.filename} to workspace {workspace_id}")
    
    # Audit log
    await audit_log(
        user_id=user["user_id"],
        action="document.upload",
        resource=workspace_id,
        details={"filename": file.filename, "size": len(contents)},
        request=request
    )
    
    # TODO: Implement document upload and indexing
    # 1. Save file to storage (GCS/S3)
    # 2. Extract text content
    # 3. Chunk document
    # 4. Index with Gemini File Search or vector DB
    # 5. Store metadata in database
    
    return {
        "document_id": f"doc_{int(datetime.utcnow().timestamp() * 1000)}",
        "filename": file.filename,
        "workspace_id": workspace_id,
        "status": "indexed",
        "uploaded_at": datetime.utcnow().isoformat()
    }

@app.post("/chat/query", response_model=ChatResponse)
async def chat_query(
    query: ChatQuery,
    request: Request,
    user: Dict = Depends(check_user_rate_limit)
):
    """Query documents using RAG with rate limiting"""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Gemini API not configured"
        )
    
    try:
        logger.info(f"Processing query for workspace {query.workspace_id}")
        
        # Audit log
        await audit_log(
            user_id=user["user_id"],
            action="chat.query",
            resource=query.workspace_id,
            details={"language": query.language},
            request=request
        )
        
        # TODO: Implement actual RAG pipeline
        # 1. Retrieve relevant documents from workspace
        # 2. Use Gemini File Search or vector search
        # 3. Generate response with citations
        
        # Placeholder response using Gemini
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        prompt = f"""You are a helpful assistant for BrainSAIT healthcare platform.
Cultural context: {query.cultural_context}
Language: {query.language}

User query: {query.query}

Provide a helpful, accurate response in {query.language} language."""

        response = model.generate_content(prompt)
        
        return ChatResponse(
            answer=response.text,
            citations=[],
            confidence=0.85,
            language=query.language,
            model_used="gemini-2.0-flash-exp",
            timestamp=datetime.utcnow().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        
        # Audit failed attempt
        await audit_log(
            user_id=user["user_id"],
            action="chat.query",
            resource=query.workspace_id,
            details={"error": str(e)},
            request=request,
            success=False
        )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Query processing failed: {str(e)}"
        )

@app.get("/documents")
async def list_documents(
    workspace_id: str,
    user: Dict = Depends(check_user_rate_limit)
):
    """List all documents in a workspace"""
    # TODO: Implement document listing from database
    return {
        "documents": [],
        "total": 0,
        "workspace_id": workspace_id
    }

@app.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    request: Request,
    user: Dict = Depends(check_user_rate_limit)
):
    """Delete a document and its index"""
    logger.info(f"Deleting document {document_id}")
    
    # Audit log
    await audit_log(
        user_id=user["user_id"],
        action="document.delete",
        resource=document_id,
        details={},
        request=request
    )
    
    # TODO: Implement document deletion
    return {"status": "deleted", "document_id": document_id}

# ============================================================================
# DEMO: Generate JWT Token (Remove in production)
# ============================================================================

@app.post("/auth/demo-token")
async def generate_demo_token(email: str = "demo@brainsait.com"):
    """
    DEMO ONLY: Generate a JWT token for testing
    Remove this endpoint in production and use Firebase/Auth0
    """
    payload = {
        "sub": "user_demo_123",
        "email": email,
        "role": "healthcare_professional",
        "exp": datetime.utcnow().timestamp() + 3600  # 1 hour
    }
    
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

# ============================================================================
# STARTUP/SHUTDOWN
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize connections on startup"""
    logger.info("Starting EFHM API (Improved Version)...")
    logger.info(f"Gemini API configured: {GEMINI_API_KEY is not None}")
    logger.info(f"Allowed CORS origins: {ALLOWED_ORIGINS}")
    # TODO: Initialize database connections
    # TODO: Initialize Redis connection
    # TODO: Verify Gemini API access

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down EFHM API...")
    # TODO: Close database connections
    # TODO: Close Redis connection

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
