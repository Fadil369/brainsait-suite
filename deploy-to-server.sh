#!/bin/bash

# BrainSAIT Suite - Server Deployment Script
# Deploys the new brainsait-suite to remote server via SSH

set -e  # Exit on error

# Configuration
REMOTE_USER="root"
REMOTE_HOST="82.25.101.65"
REMOTE_DIR="/opt/brainsait-suite"
LOCAL_DIR="/Users/fadil369/AFHAM/brainsait-suite"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  BrainSAIT Suite Server Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in the correct directory
if [ ! -f "$LOCAL_DIR/package.json" ]; then
    echo -e "${RED}Error: Not in brainsait-suite directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Testing SSH connection...${NC}"
if ssh -o ConnectTimeout=5 ${REMOTE_USER}@${REMOTE_HOST} "echo 'Connection successful'" 2>/dev/null; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ SSH connection failed${NC}"
    echo "Please check:"
    echo "  1. Server is accessible: ping ${REMOTE_HOST}"
    echo "  2. SSH key is configured: ssh-copy-id ${REMOTE_USER}@${REMOTE_HOST}"
    echo "  3. Port 22 is open"
    exit 1
fi
echo ""

echo -e "${YELLOW}Step 2: Creating remote directory...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir -p ${REMOTE_DIR}"
echo -e "${GREEN}✓ Remote directory created: ${REMOTE_DIR}${NC}"
echo ""

echo -e "${YELLOW}Step 3: Syncing files to server...${NC}"
echo "This will transfer:"
echo "  - Source code (TypeScript, Python)"
echo "  - Configuration files"
echo "  - Docker setup"
echo "  - Documentation"
echo ""

rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '*.log' \
    --exclude '.env.local' \
    --exclude '.DS_Store' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude 'venv' \
    --exclude '.turbo' \
    "${LOCAL_DIR}/" \
    "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo ""
echo -e "${GREEN}✓ Files synced successfully${NC}"
echo ""

echo -e "${YELLOW}Step 4: Setting up environment on server...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
    set -e
    cd /opt/brainsait-suite
    
    echo "Setting file permissions..."
    chmod +x deploy-to-server.sh || true
    chmod 644 .env.example
    
    echo "Creating .env file if it doesn't exist..."
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️  Please update .env with your actual configuration"
    fi
    
    echo "✓ Environment setup complete"
ENDSSH
echo -e "${GREEN}✓ Server environment configured${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Deployment Complete! 🎉${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Next steps on the server:"
echo ""
echo "1. SSH into the server:"
echo "   ${YELLOW}ssh ${REMOTE_USER}@${REMOTE_HOST}${NC}"
echo ""
echo "2. Navigate to the project:"
echo "   ${YELLOW}cd ${REMOTE_DIR}${NC}"
echo ""
echo "3. Update environment variables:"
echo "   ${YELLOW}nano .env${NC}"
echo "   Add your GEMINI_API_KEY and other credentials"
echo ""
echo "4. Install Docker and Docker Compose (if not installed):"
echo "   ${YELLOW}curl -fsSL https://get.docker.com -o get-docker.sh${NC}"
echo "   ${YELLOW}sh get-docker.sh${NC}"
echo "   ${YELLOW}apt-get install docker-compose-plugin${NC}"
echo ""
echo "5. Start the services:"
echo "   ${YELLOW}docker compose up -d${NC}"
echo ""
echo "6. Check service status:"
echo "   ${YELLOW}docker compose ps${NC}"
echo "   ${YELLOW}docker compose logs -f api${NC}"
echo ""
echo "7. Access the API:"
echo "   ${YELLOW}http://${REMOTE_HOST}:8000${NC}"
echo "   ${YELLOW}http://${REMOTE_HOST}:8000/docs${NC}"
echo ""
echo "Project location: ${REMOTE_DIR}"
echo "Repository: https://github.com/Fadil369/brainsait-suite"
echo ""
