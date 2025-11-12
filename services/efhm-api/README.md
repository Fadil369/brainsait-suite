# EFHM API

FastAPI backend service for BrainSAIT Suite with Gemini File Search RAG.

## Features

- RESTful API for document management
- Gemini File Search RAG integration
- Workspace management
- Authentication & authorization
- PDPL/HIPAA compliance logging
- Bilingual support (Arabic/English)
- PostgreSQL database
- Redis caching

## Development

### Prerequisites

- Python 3.11+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload
```

### Docker Setup

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## API Documentation

Once running, visit:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Health Check

```bash
GET /health
```

### Workspaces

```bash
# Create workspace
POST /workspaces
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "My Workspace",
  "description": "Healthcare documents",
  "language": "ar",
  "cultural_context": "saudi"
}

# List workspaces
GET /workspaces
Authorization: Bearer <token>
```

### Documents

```bash
# Upload document
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
workspace_id: ws_123
metadata: {"document_type": "pdf", "language": "ar"}

# List documents
GET /documents?workspace_id=ws_123
Authorization: Bearer <token>

# Delete document
DELETE /documents/{document_id}
Authorization: Bearer <token>
```

### Chat/Query

```bash
POST /chat/query
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "ما هي متطلبات NPHIES؟",
  "workspace_id": "ws_123",
  "language": "ar",
  "cultural_context": "saudi",
  "use_rag": true,
  "include_citations": true
}
```

## Configuration

Environment variables:

- `GEMINI_API_KEY`: Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `API_SECRET_KEY`: JWT secret key
- `AUTH_PROVIDER`: Authentication provider (firebase/auth0)

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=. --cov-report=html
```

## Deployment

See [Deployment Guide](../../docs/deployment.md) for production deployment instructions.

## License

Proprietary - Copyright © 2025 BrainSAIT
