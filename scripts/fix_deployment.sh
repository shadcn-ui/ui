#!/usr/bin/env bash
set -euo pipefail

# Diagnose and fix deployment issues
# Run on server: sudo bash scripts/fix_deployment.sh

echo "🔍 Ocean ERP Deployment Diagnostics & Fix"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found"
    echo "Please run this script from /opt/ocean-erp"
    exit 1
fi

echo "✅ In correct directory: $(pwd)"
echo ""

# Check Docker installation
echo "1️⃣  Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not installed. Installing now..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release
    
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    systemctl enable --now docker
    echo "✅ Docker installed!"
else
    echo "✅ Docker installed: $(docker --version)"
fi
echo ""

# Check .env file
echo "2️⃣  Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file missing. Creating now..."
    DB_PASS=$(openssl rand -hex 16)
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    
    cat > .env <<EOF
DB_USER=ocean_erp
DB_PASSWORD=$DB_PASS
DB_NAME=ocean_erp

NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=http://103.168.135.110:4000

POS_BASE_URL=http://103.168.135.110:4000
EOF
    echo "✅ .env file created with secure random passwords"
else
    echo "✅ .env file exists"
fi
echo ""

# Create required directories
echo "3️⃣  Creating required directories..."
mkdir -p apps/v4/public/uploads
mkdir -p ssl
echo "✅ Directories ready"
echo ""

# Check if containers are running
echo "4️⃣  Checking container status..."
if docker compose ps | grep -q "Up"; then
    echo "⚠️  Some containers already running. Restarting..."
    docker compose down
fi
echo ""

# Build and start
echo "5️⃣  Building Docker images..."
echo "   (This may take 5-10 minutes on first run)"
echo ""
echo "   If build fails with network errors, press Ctrl+C and run:"
echo "   sudo bash scripts/fix_network.sh"
echo ""
docker compose build || {
    echo ""
    echo "❌ Build failed! This is usually a network issue."
    echo ""
    echo "Run these commands to fix:"
    echo "  sudo bash scripts/fix_network.sh"
    echo "  sudo bash scripts/fix_deployment.sh"
    exit 1
}
echo "✅ Build complete!"
echo ""

echo "6️⃣  Starting services..."
docker compose up -d
echo "✅ Services started!"
echo ""

# Wait for services
echo "7️⃣  Waiting for services to be ready..."
sleep 10

# Check status
echo ""
echo "=========================================="
echo "📊 Current Status:"
echo "=========================================="
docker compose ps
echo ""

# Test connectivity
echo "8️⃣  Testing connectivity..."
sleep 5

if curl -sf http://localhost:4000 > /dev/null 2>&1; then
    echo "✅ App is responding on port 4000"
elif curl -sf http://localhost > /dev/null 2>&1; then
    echo "✅ Nginx is responding on port 80"
else
    echo "⚠️  Services starting up (this is normal, wait 30 seconds and try again)"
fi
echo ""

echo "=========================================="
echo "✅ Deployment Fix Complete!"
echo "=========================================="
echo ""
echo "🌐 Access your application at:"
echo "   http://103.168.135.110"
echo "   http://103.168.135.110:4000"
echo ""
echo "📋 Useful commands:"
echo "   docker compose logs -f        # View all logs"
echo "   docker compose logs -f app    # View app logs only"
echo "   docker compose ps             # Check status"
echo "   docker compose restart        # Restart all services"
echo ""
echo "If you still see errors, run:"
echo "   docker compose logs -f"
echo ""
