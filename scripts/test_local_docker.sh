#!/usr/bin/env bash
set -euo pipefail

# Test Ocean ERP locally using Docker Compose
# This mimics the production environment

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "🐳 Ocean ERP - Local Docker Test"
echo "================================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not installed"
    echo "Install from: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

echo "✅ Docker: $(docker --version)"
echo ""

# Create local .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env for local testing..."
    cat > .env <<'EOF'
DB_USER=ocean_erp
DB_PASSWORD=local_test_password
DB_NAME=ocean_erp

NEXTAUTH_SECRET=local-test-secret-change-in-production
NEXTAUTH_URL=http://localhost:4000

POS_BASE_URL=http://localhost:4000
EOF
    echo "✅ .env created"
    echo ""
fi

# Stop existing containers if running
if docker compose ps | grep -q "Up"; then
    echo "🛑 Stopping existing containers..."
    docker compose down
    echo ""
fi

# Create required directories
mkdir -p apps/v4/public/uploads
mkdir -p ssl

# Build and start
echo "🔨 Building Docker images..."
echo "(This may take 5-10 minutes on first run)"
echo ""
docker compose build

echo ""
echo "🚀 Starting services..."
docker compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check status
echo ""
echo "================================="
echo "📊 Service Status:"
echo "================================="
docker compose ps

echo ""
echo "================================="
echo "✅ Local Test Environment Ready!"
echo "================================="
echo ""
echo "🌐 Access your application:"
echo "   http://localhost"
echo "   http://localhost:4000"
echo ""
echo "📋 Useful commands:"
echo "   View logs:    docker compose logs -f"
echo "   Stop:         docker compose down"
echo "   Restart:      docker compose restart"
echo ""
echo "To stop the test environment:"
echo "   docker compose down"
echo ""
