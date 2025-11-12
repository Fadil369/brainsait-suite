# 🚀 BrainSAIT Suite - Complete Setup Instructions

## What Has Been Built

The BrainSAIT Suite foundation is complete with:

1. **Monorepo Structure** - Turborepo with PNPM workspaces
2. **GenAI Services Package** - Full Gemini API integration (text, image, video, speech, RAG)
3. **FastAPI Backend** - RESTful API with health checks, workspace management, and chat endpoints
4. **Docker Setup** - Complete containerization with PostgreSQL and Redis
5. **Documentation** - Getting started, deployment, and API guides

## Current Location

All files have been created in:

```text
/Users/fadil369/AFHAM/brainsait-suite/
```

## Directory Structure

```text
brainsait-suite/
├── apps/
│   ├── web-portal/          (placeholder for Phase 2)
│   └── native/              (placeholder for Phase 3)
├── packages/
│   ├── ui-components/       (placeholder for Phase 2)
│   ├── genai-services/      ✅ COMPLETE
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── text.ts
│   │   │   ├── image.ts
│   │   │   ├── video.ts
│   │   │   ├── speech.ts
│   │   │   ├── rag.ts
│   │   │   ├── types.ts
│   │   │   ├── utils.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── README.md
│   ├── data-access/         (placeholder)
│   └── compliance/          (placeholder)
├── services/
│   └── efhm-api/            ✅ COMPLETE
│       ├── main.py
│       ├── requirements.txt
│       ├── Dockerfile
│       └── README.md
├── infrastructure/          (placeholder)
├── docs/                    ✅ COMPLETE
│   ├── GETTING_STARTED.md
│   ├── DEPLOYMENT.md
│   └── (more to come)
├── package.json             ✅
├── turbo.json               ✅
├── pnpm-workspace.yaml      ✅
├── tsconfig.json            ✅
├── docker-compose.yml       ✅
├── .gitignore               ✅
├── .env.example             ✅
├── README.md                ✅
└── PROJECT_STATUS.md        ✅
```

## 🎯 Immediate Next Steps (DO THIS NOW)

### Step 1: Navigate to the Project

```bash
cd /Users/fadil369/AFHAM/brainsait-suite
```

### Step 2: Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your Gemini API key
nano .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: <https://aistudio.google.com/app/apikey>

### Step 3: Install Dependencies

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install all package dependencies
pnpm install
```

### Step 4: Start the Backend

**Option A: Using Docker (Recommended)**

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

**Option B: Manual Python Setup**

```bash
cd services/efhm-api

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API
uvicorn main:app --reload
```

### Step 5: Test the API

Open your browser to:

- API Documentation: <http://localhost:8000/docs>
- Health Check: <http://localhost:8000/health>

Or use curl:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-12T...",
  "services": {
    "gemini": true,
    "database": false,
    "redis": false
  }
}
```

### Step 6: Test the GenAI Services Package

The `@brainsait/genai-services` package is ready to use but needs to be built first:

```bash
# Build the package
cd packages/genai-services
pnpm build

# Or build all packages from root
cd ../..
pnpm build
```

## 📚 What to Read Next

1. **Getting Started Guide**: `docs/GETTING_STARTED.md`
   - Detailed setup instructions
   - API testing examples
   - Common troubleshooting

2. **Project Status**: `PROJECT_STATUS.md`
   - Current phase completion
   - What's working now
   - Next phases roadmap

3. **Deployment Guide**: `docs/DEPLOYMENT.md`
   - Production deployment steps
   - Cloud platform options
   - Kubernetes setup

4. **Original Plan**: `../planComprehensiveReview.prompt.md`
   - Full project vision
   - Architecture overview
   - Compliance requirements

## 🛠️ Development Workflow

### Working on the GenAI Package

```bash
cd packages/genai-services

# Watch mode (auto-rebuild on changes)
pnpm dev

# Type check
pnpm type-check

# Build
pnpm build
```

### Working on the Backend API

```bash
cd services/efhm-api

# Start with hot reload
uvicorn main:app --reload

# Or use Docker with volume mount
docker-compose up api
```

### Adding New Packages

```bash
# Create new package directory
mkdir -p packages/new-package/src

# Create package.json
cd packages/new-package
pnpm init

# Add to workspace (already configured in pnpm-workspace.yaml)
```

## 🧪 Testing the Current Implementation

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "query": "What are the symptoms of diabetes?",
    "workspace_id": "ws_test_123",
    "language": "en",
    "cultural_context": "saudi",
    "use_rag": false
  }'
```

### Test Health Check

```bash
curl http://localhost:8000/health
```

### Test Create Workspace

```bash
curl -X POST http://localhost:8000/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "name": "Test Workspace",
    "description": "Testing workspace creation",
    "language": "ar",
    "cultural_context": "saudi"
  }'
```

## 📦 Package Usage Examples

### Using GenAI Services in Your Code

```typescript
// First, build the package
// cd packages/genai-services && pnpm build

import { 
  initializeGenAI, 
  generateText,
  generateImage,
  generateRAGResponse,
  chunkDocument
} from '@brainsait/genai-services';

// Initialize once at app startup
initializeGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  language: 'ar',
  culturalContext: 'saudi',
});

// Generate text
const response = await generateText('ما هي أعراض السكري؟');

// Generate image
const imageUrl = await generateImage('Modern hospital', '16:9');

// RAG query
const document = 'Your long document text...';
const chunks = chunkDocument(document);
const ragResponse = await generateRAGResponse(
  'What are the key findings?',
  chunks
);
```

## 🔧 Common Commands

```bash
# From project root
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages
pnpm clean            # Clean all build artifacts
pnpm type-check       # Type check all packages

# Docker
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f api     # View API logs
docker-compose restart api     # Restart API

# Backend (if running manually)
cd services/efhm-api
source venv/bin/activate
uvicorn main:app --reload

# Package development
cd packages/genai-services
pnpm dev              # Watch mode
pnpm build            # Build once
pnpm type-check       # Type check
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Directory exists at `/Users/fadil369/AFHAM/brainsait-suite/`
- [ ] `.env.local` created with your Gemini API key
- [ ] `pnpm install` ran successfully
- [ ] Docker Compose starts without errors
- [ ] API responds at <http://localhost:8000/health>
- [ ] API docs accessible at <http://localhost:8000/docs>
- [ ] Health check shows `"gemini": true`

## 🚨 Troubleshooting

### "Command not found: pnpm"

```bash
npm install -g pnpm
```

### "Port 8000 already in use"

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### "Gemini API key invalid"

1. Verify your key at <https://aistudio.google.com/app/apikey>
2. Ensure no extra spaces in `.env.local`
3. Check the key starts with `AI...` (for API keys)

### "Docker permission denied"

```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### "Module not found" errors in genai-services

The package needs to be built first:

```bash
cd packages/genai-services
pnpm install
pnpm build
```

## 📈 What's Next?

### Phase 2: Web Portal (Recommended Next Step)

1. Initialize Next.js 15 app in `apps/web-portal/`
2. Create UI components package in `packages/ui-components/`
3. Integrate with EFHM API
4. Implement bilingual routing and RTL support
5. Build chat, image, video, and voice interfaces

### Phase 3: Backend Enhancement

1. Connect PostgreSQL database
2. Implement SQLAlchemy models
3. Set up Alembic migrations
4. Add actual file upload to GCS/S3
5. Integrate Gemini File Search for RAG

### Phase 4: Native App

1. Initialize Expo project in `apps/native/`
2. Share components with web portal
3. Implement offline support
4. Add biometric authentication
5. Build for iOS and Android

## 🆘 Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: <https://github.com/Fadil369/brainsait-suite/issues>
- **Email**: <support@brainsait.com>

## 🎉 Congratulations!

You now have a solid foundation for the BrainSAIT Suite! The monorepo is structured, the GenAI services are comprehensive, and the backend API is operational.

**Your next command should be:**

```bash
cd /Users/fadil369/AFHAM/brainsait-suite
docker-compose up -d
open http://localhost:8000/docs
```

---

**Built with ❤️ for healthcare professionals in Saudi Arabia and Sudan**
