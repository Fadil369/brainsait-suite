# Getting Started with BrainSAIT Suite

Complete guide to set up and run the BrainSAIT Suite locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 9+ (`npm install -g pnpm`)
- **Python** 3.11+ ([Download](https://www.python.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/Fadil369/brainsait-suite.git
cd brainsait-suite
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Start with Docker (Easiest)

```bash
docker-compose up -d
```

That's it! Services are now running:

- **API**: <http://localhost:8000>
- **API Docs**: <http://localhost:8000/docs>
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 5. Access the API

Open your browser to <http://localhost:8000/docs> to see the interactive API documentation.

Try the health check:

```bash
curl http://localhost:8000/health
```

## Manual Setup (Alternative)

If you prefer not to use Docker:

### Backend Setup

```bash
# Navigate to API directory
cd services/efhm-api

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Backend will run at <http://localhost:8000>

### Frontend Setup (Coming in Phase 2)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Project Structure

```text
brainsait-suite/
├── apps/
│   ├── web-portal/          # Next.js web app (Phase 2)
│   └── native/              # React Native app (Phase 3)
├── packages/
│   ├── ui-components/       # Shared UI components
│   ├── genai-services/      # ✅ Gemini AI services
│   ├── data-access/         # API client
│   └── compliance/          # Security & compliance
├── services/
│   └── efhm-api/            # ✅ FastAPI backend
├── infrastructure/          # Docker, K8s configs
└── docs/                    # Documentation
```

## What's Available Now

### ✅ Completed (Phase 0-1)

- [x] Monorepo structure with Turborepo
- [x] GenAI Services package (`@brainsait/genai-services`)
  - Text generation (Chat, Grounding, Thinking)
  - Image generation & editing (Imagen 4.0)
  - Video generation (Veo 3.1)
  - Speech synthesis (TTS)
  - RAG with document chunks
- [x] FastAPI backend (`efhm-api`)
  - Health check endpoints
  - Workspace management
  - Document upload (placeholder)
  - Chat/Query endpoint
  - Docker support

### 🚧 In Progress (Phase 2)

- [ ] Next.js web portal
- [ ] UI components library
- [ ] Database models & migrations
- [ ] Authentication integration
- [ ] File Search RAG implementation

### 📋 Planned (Phase 3+)

- [ ] React Native mobile app
- [ ] CI/CD pipeline
- [ ] Compliance package
- [ ] Documentation site

## Testing the API

### 1. Health Check

```bash
curl http://localhost:8000/health
```

Response:

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

### 2. Create Workspace (Requires Auth Token)

```bash
curl -X POST http://localhost:8000/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "name": "My Healthcare Workspace",
    "description": "Patient documents",
    "language": "ar",
    "cultural_context": "saudi"
  }'
```

### 3. Query with Gemini

```bash
curl -X POST http://localhost:8000/chat/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{
    "query": "What are the symptoms of diabetes?",
    "workspace_id": "ws_123",
    "language": "en",
    "use_rag": false
  }'
```

## Using the GenAI Services Package

The `@brainsait/genai-services` package can be used independently:

```typescript
import { initializeGenAI, generateText } from '@brainsait/genai-services';

// Initialize once
initializeGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  language: 'ar',
  culturalContext: 'saudi',
});

// Generate text
const response = await generateText('ما هي أعراض السكري؟');
console.log(response);
```

See [packages/genai-services/README.md](../packages/genai-services/README.md) for full documentation.

## Common Issues

### Port Already in Use

```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Docker Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
```

### Python Module Not Found

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Gemini API Key Invalid

1. Verify your key at [AI Studio](https://aistudio.google.com/app/apikey)
2. Check if API is enabled: <https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com>
3. Ensure no extra spaces in `.env.local`

## Next Steps

1. **Explore the API**: Visit <http://localhost:8000/docs>
2. **Read the Plan**: Check [planComprehensiveReview.prompt.md](../planComprehensiveReview.prompt.md)
3. **Review Documentation**:
   - [Architecture](./ARCHITECTURE.md)
   - [Deployment](./DEPLOYMENT.md)
   - [API Reference](./API_REFERENCE.md)

## Development Workflow

1. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test locally:

```bash
pnpm test
pnpm lint
```

4. Commit and push:

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

5. Open a Pull Request

## Getting Help

- **Documentation**: [docs.brainsait.com](https://docs.brainsait.com)
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/Fadil369/brainsait-suite/issues)
- **Email**: <support@brainsait.com>

## Useful Commands

```bash
# Monorepo commands
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm clean            # Clean all build artifacts

# Docker commands
docker-compose up -d           # Start services
docker-compose logs -f api     # View API logs
docker-compose down            # Stop services
docker-compose restart api     # Restart API

# Database commands (when configured)
docker exec -it brainsait-db psql -U brainsait
```

---

**Welcome to BrainSAIT Suite!** 🎉

You're now ready to build the future of healthcare AI in Saudi Arabia and Sudan.
