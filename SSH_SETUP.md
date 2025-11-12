# SSH Key Setup Instructions

## Quick Setup (Recommended)

If you want to avoid entering passwords, set up SSH key authentication:

### 1. Generate SSH key (if you don't have one):

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter for no passphrase (or add one for extra security)
```

### 2. Copy your SSH key to the server:

```bash
ssh-copy-id root@82.25.101.65
# Enter your password one last time
```

### 3. Test the connection:

```bash
ssh root@82.25.101.65
# Should connect without asking for password
```

### 4. Run the deployment script again:

```bash
cd /Users/fadil369/AFHAM/brainsait-suite
./deploy-to-server.sh
```

## Alternative: Manual Deployment

If you prefer to deploy manually without the script:

### Using rsync with password:

```bash
cd /Users/fadil369/AFHAM/brainsait-suite

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
    ./ root@82.25.101.65:/opt/brainsait-suite/
```

### Using scp:

```bash
cd /Users/fadil369/AFHAM
scp -r brainsait-suite root@82.25.101.65:/opt/
```

## After Deployment

Once files are on the server, SSH in and set up:

```bash
# SSH to server
ssh root@82.25.101.65

# Navigate to project
cd /opt/brainsait-suite

# Copy environment file
cp .env.example .env

# Edit with your API keys
nano .env

# Install Docker (if not installed)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt-get install docker-compose-plugin

# Start services
docker compose up -d

# Check logs
docker compose logs -f api

# Access API
# http://82.25.101.65:8000
# http://82.25.101.65:8000/docs
```

## Firewall Configuration

Make sure ports are open:

```bash
# On the server
ufw allow 8000/tcp    # API
ufw allow 5432/tcp    # PostgreSQL (if exposing)
ufw allow 6379/tcp    # Redis (if exposing)
ufw status
```
