# BrainSAIT Suite Deployment Guide

## Overview

This guide covers deploying the BrainSAIT Suite across different environments:

- **Development**: Local development with hot-reload
- **Staging**: Pre-production testing environment  
- **Production**: Live production deployment

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   Web Portal    │────▶│   EFHM API       │
│  (Next.js 15)   │     │   (FastAPI)      │
└─────────────────┘     └──────────────────┘
         │                       │
         │                       ├──▶ PostgreSQL
         │                       ├──▶ Redis
         │                       └──▶ Gemini API
         ▼
┌─────────────────┐
│  Native App     │
│  (Expo)         │
└─────────────────┘
```

## Prerequisites

### All Environments

- Docker 24+ & Docker Compose 2.20+
- Google Cloud account with Gemini API access
- Domain name (for production)

### Production Additional

- Kubernetes cluster (GKE, EKS, or AKS) OR VM with Docker
- SSL certificate
- Cloud storage (GCS or S3)
- PostgreSQL managed instance (Cloud SQL, RDS, or Azure DB)
- Redis managed instance
- CDN (Cloudflare, CloudFront)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/Fadil369/brainsait-suite.git
cd brainsait-suite
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/brainsait
REDIS_URL=redis://localhost:6379
API_SECRET_KEY=your_secret_key_min_32_chars

# Optional but recommended
AUTH_PROVIDER=firebase
FIREBASE_PROJECT_ID=your_project
STORAGE_PROVIDER=gcs
GCS_BUCKET_NAME=brainsait-storage
```

## Development Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- API: <http://localhost:8000>
- API Docs: <http://localhost:8000/docs>
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Local Development

#### Backend (FastAPI)

```bash
cd services/efhm-api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend (Next.js)

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Web portal: <http://localhost:3000>

## Staging Deployment

### Using Docker on VM

1. **Provision VM**

```bash
# Ubuntu 22.04 LTS recommended
# Minimum: 2 vCPU, 4GB RAM, 50GB disk
```

2. **Install Docker**

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Deploy Application**

```bash
# Clone repository
git clone https://github.com/Fadil369/brainsait-suite.git
cd brainsait-suite

# Set environment
cp .env.example .env.production
nano .env.production

# Build and start
docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

4. **Configure Nginx Reverse Proxy**

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/brainsait
```

```nginx
server {
    listen 80;
    server_name staging.brainsait.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/brainsait /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d staging.brainsait.com
```

## Production Deployment

### Option 1: Google Cloud Platform (Recommended)

#### 1. Set Up Infrastructure

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
gcloud init

# Set project
gcloud config set project YOUR_PROJECT_ID
```

#### 2. Deploy Database

```bash
# Cloud SQL (PostgreSQL)
gcloud sql instances create brainsait-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create brainsait --instance=brainsait-db

# Create user
gcloud sql users create brainsait-user \
  --instance=brainsait-db \
  --password=SECURE_PASSWORD
```

#### 3. Deploy Redis

```bash
# Memorystore Redis
gcloud redis instances create brainsait-redis \
  --size=1 \
  --region=us-central1 \
  --redis-version=redis_7_0
```

#### 4. Deploy Backend (Cloud Run)

```bash
cd services/efhm-api

# Build image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/efhm-api

# Deploy to Cloud Run
gcloud run deploy efhm-api \
  --image gcr.io/YOUR_PROJECT_ID/efhm-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY,DATABASE_URL=$DATABASE_URL
```

#### 5. Deploy Frontend (Vercel/Cloud Run)

**Option A: Vercel (Recommended for Next.js)**

```bash
cd apps/web-portal

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option B: Cloud Run**

```bash
cd apps/web-portal

# Build image
docker build -t gcr.io/YOUR_PROJECT_ID/web-portal .

# Push image
docker push gcr.io/YOUR_PROJECT_ID/web-portal

# Deploy
gcloud run deploy web-portal \
  --image gcr.io/YOUR_PROJECT_ID/web-portal \
  --platform managed \
  --region us-central1
```

### Option 2: AWS

Similar process using:
- RDS for PostgreSQL
- ElastiCache for Redis
- ECS/Fargate or EKS for containers
- S3 + CloudFront for static assets

### Option 3: Azure

- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Container Apps or AKS
- Azure Blob Storage + CDN

## Kubernetes Deployment

For production-grade orchestration:

```bash
# Create namespace
kubectl create namespace brainsait

# Apply configurations
kubectl apply -f infrastructure/k8s/

# Check deployment
kubectl get pods -n brainsait
kubectl get services -n brainsait
```

See `infrastructure/k8s/` directory for manifests.

## Post-Deployment

### 1. Verify Health

```bash
# API health check
curl https://api.brainsait.com/health

# Expected response
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "gemini": true,
    "database": true,
    "redis": true
  }
}
```

### 2. Run Database Migrations

```bash
# Connect to API container
docker exec -it efhm-api bash

# Run migrations
alembic upgrade head
```

### 3. Configure Monitoring

```bash
# Set up Sentry for error tracking
export SENTRY_DSN=your_sentry_dsn

# Set up PostHog for analytics
export POSTHOG_API_KEY=your_posthog_key
```

### 4. Set Up Backups

```bash
# Automated PostgreSQL backups
gcloud sql backups create --instance=brainsait-db

# Configure backup schedule
gcloud sql instances patch brainsait-db \
  --backup-start-time=03:00
```

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured (not in code)
- [ ] Database passwords rotated
- [ ] API rate limiting enabled
- [ ] CORS configured for production domains only
- [ ] Firewall rules restrict database access
- [ ] Audit logging enabled
- [ ] Vulnerability scanning scheduled
- [ ] Secrets stored in secret manager (not .env files)

## Monitoring & Logging

### Application Logs

```bash
# Docker logs
docker-compose logs -f api

# Kubernetes logs
kubectl logs -f deployment/efhm-api -n brainsait

# GCP Cloud Logging
gcloud logging read "resource.type=cloud_run_revision"
```

### Metrics

Configure monitoring dashboards:

- **Uptime**: API availability
- **Latency**: Response times (p50, p95, p99)
- **Error Rate**: 4xx and 5xx responses
- **Throughput**: Requests per minute
- **Database**: Connection pool, query performance
- **Gemini API**: Token usage, rate limits

## Troubleshooting

### API Not Responding

```bash
# Check container status
docker ps

# Check logs
docker logs efhm-api

# Restart service
docker-compose restart api
```

### Database Connection Failed

```bash
# Test connection
psql $DATABASE_URL

# Check credentials in .env
cat .env.local | grep DATABASE_URL
```

### Gemini API Errors

```bash
# Verify API key
curl -H "x-goog-api-key: $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Check quota
# Visit: https://aistudio.google.com/app/apikey
```

## Rollback Procedure

```bash
# Docker
docker-compose down
git checkout <previous-commit>
docker-compose up -d

# Kubernetes
kubectl rollout undo deployment/efhm-api -n brainsait

# Cloud Run
gcloud run services update-traffic efhm-api \
  --to-revisions=PREVIOUS_REVISION=100
```

## Scaling

### Horizontal Scaling

```bash
# Kubernetes
kubectl scale deployment efhm-api --replicas=3 -n brainsait

# Cloud Run (auto-scaling)
gcloud run services update efhm-api \
  --min-instances=2 \
  --max-instances=10
```

### Database Scaling

```bash
# Upgrade Cloud SQL instance
gcloud sql instances patch brainsait-db \
  --tier=db-n1-standard-2
```

## CI/CD Pipeline

GitHub Actions workflow is configured at `.github/workflows/deploy.yml`

Triggers:
- **Push to main**: Deploy to production
- **Push to develop**: Deploy to staging
- **Pull request**: Run tests

## Support

For deployment issues:
- GitHub Issues: <https://github.com/Fadil369/brainsait-suite/issues>
- Email: <support@brainsait.com>
- Documentation: <https://docs.brainsait.com>

---

**Last Updated**: 2025-11-12
