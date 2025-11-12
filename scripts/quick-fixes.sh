#!/bin/bash
echo "🔒 Generating secure credentials..."
echo ""
echo "API_SECRET_KEY=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)"
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)"
echo ""
echo "✅ Add these to your .env file!"
