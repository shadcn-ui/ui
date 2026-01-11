#!/usr/bin/env bash
set -euo pipefail

# Run Ocean ERP locally for testing
# Usage: ./scripts/run_local.sh

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "🚀 Ocean ERP - Local Development Setup"
echo "======================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm not found. Installing..."
    if command -v corepack &> /dev/null; then
        corepack enable
        corepack prepare pnpm@9.0.6 --activate
    else
        npm install -g pnpm@9.0.6
    fi
fi
echo "✅ pnpm: $(pnpm --version)"

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local..."
    cat > .env.local <<'EOF'
# Local Development Environment
DATABASE_URL=postgresql://ocean_erp:ocean_erp@localhost:5432/ocean_erp

# NextAuth
NEXTAUTH_URL=http://localhost:4000
NEXTAUTH_SECRET=local-dev-secret-change-in-production

# App
NODE_ENV=development
PORT=4000
EOF
    echo "✅ .env.local created"
fi

# Check PostgreSQL
echo ""
echo "Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL not running on localhost:5432"
    echo ""
    echo "Start PostgreSQL using Docker:"
    echo "  docker run -d \\"
    echo "    --name ocean-erp-postgres \\"
    echo "    -e POSTGRES_USER=ocean_erp \\"
    echo "    -e POSTGRES_PASSWORD=ocean_erp \\"
    echo "    -e POSTGRES_DB=ocean_erp \\"
    echo "    -p 5432:5432 \\"
    echo "    postgres:16-alpine"
    echo ""
    read -p "Start PostgreSQL now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker run -d \
            --name ocean-erp-postgres \
            -e POSTGRES_USER=ocean_erp \
            -e POSTGRES_PASSWORD=ocean_erp \
            -e POSTGRES_DB=ocean_erp \
            -p 5432:5432 \
            postgres:16-alpine
        echo "Waiting for PostgreSQL to start..."
        sleep 5
        echo "✅ PostgreSQL started"
    else
        echo "Please start PostgreSQL and run this script again"
        exit 1
    fi
else
    echo "✅ PostgreSQL running"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Run database migrations if they exist
if [ -d "db/migrations" ] || [ -f "init-db/00-init.sql" ]; then
    echo ""
    echo "🗄️  Setting up database..."
    if [ -f "init-db/00-init.sql" ]; then
        PGPASSWORD=ocean_erp psql -h localhost -U ocean_erp -d ocean_erp -f init-db/00-init.sql 2>/dev/null || {
            echo "⚠️  Database schema might already exist (this is OK)"
        }
    fi
fi

# Start development server
echo ""
echo "======================================="
echo "🎯 Starting development server..."
echo "======================================="
echo ""
echo "📱 App will be available at:"
echo "   http://localhost:4000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd apps/v4
pnpm dev
