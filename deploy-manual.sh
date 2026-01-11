#!/bin/bash

# Manual deployment script - Deploy from local to server
# Usage: ./deploy-manual.sh

set -e

# Configuration
SERVER_IP="103.168.135.110"
SERVER_USER="root"
REMOTE_DIR="/opt/ocean-erp"
LOCAL_DIR="$(pwd)"

echo "🚀 Ocean ERP Manual Deployment"
echo "=============================="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Remote directory: $REMOTE_DIR"
echo ""

# Check if SSH connection works
echo "🔐 Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'" 2>/dev/null; then
    echo "❌ Cannot connect to server. Please check:"
    echo "   - Server IP: $SERVER_IP"
    echo "   - SSH access"
    echo "   - Root password or SSH key"
    exit 1
fi
echo "✅ SSH connection successful"
echo ""

# Create remote directory
echo "📁 Creating remote directory..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# Sync files to server (excluding unnecessary files)
echo "📤 Transferring files to server..."
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '.env.development' \
  --exclude '*.log' \
  --exclude '.DS_Store' \
  --exclude 'tmp' \
  --exclude 'temp' \
  --exclude '.turbo' \
  --exclude 'coverage' \
  --exclude 'dist' \
  --exclude 'build' \
  --exclude '.cache' \
  $LOCAL_DIR/ $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

echo "✅ Files transferred successfully"
echo ""

# Run deployment on server
echo "🏗️  Running deployment on server..."
ssh $SERVER_USER@$SERVER_IP "bash -s" << 'ENDSSH'
cd /opt/ocean-erp

echo "📦 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker already installed"
fi

if ! command -v docker compose &> /dev/null; then
    echo "Installing Docker Compose..."
    apt-get update
    apt-get install -y docker-compose-plugin
else
    echo "✅ Docker Compose already installed"
fi

echo ""
echo "⚙️  Setting up environment..."
if [ ! -f .env.production ]; then
    cp .env.production.example .env.production
    
    # Generate secure secrets
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 16 | tr -d "=+/" | cut -c1-20)
    
    sed -i "s/generate_a_random_secret_key_here_minimum_32_characters/$NEXTAUTH_SECRET/" .env.production
    sed -i "s/change_this_to_a_secure_password/$DB_PASSWORD/g" .env.production
    
    echo "✅ Environment configured with secure passwords"
else
    echo "✅ Using existing .env.production"
fi

echo ""
echo "📁 Creating required directories..."
mkdir -p apps/v4/public/uploads/profiles
mkdir -p init-db
chmod -R 755 apps/v4/public/uploads

echo ""
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

echo ""
echo "🏗️  Building Docker containers..."
docker compose build --no-cache

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 15

echo ""
echo "📊 Service Status:"
docker compose ps

echo ""
if docker compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Application is available at:"
    echo "   - HTTP: http://103.168.135.110"
    echo "   - Direct: http://103.168.135.110:4000"
else
    echo "⚠️  Some services may not be running. Check logs:"
    echo "   docker compose logs"
fi
ENDSSH

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Useful commands to run on server:"
echo "   ssh root@$SERVER_IP"
echo "   cd $REMOTE_DIR"
echo "   docker compose logs -f app        # View logs"
echo "   docker compose ps                 # Check status"
echo "   docker compose restart app        # Restart app"
echo ""
