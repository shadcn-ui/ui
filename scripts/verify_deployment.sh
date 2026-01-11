#!/usr/bin/env bash
set -euo pipefail

# Verify Ocean ERP deployment
# Usage: ./scripts/verify_deployment.sh [base_url]

BASE_URL="${1:-http://localhost}"

echo "========================================="
echo "Ocean ERP Deployment Verification"
echo "========================================="
echo ""

# Check Docker
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    exit 1
fi
echo "✓ Docker installed: $(docker --version)"
echo ""

# Check containers
echo "Checking containers..."
CONTAINERS=$(docker compose ps --format json 2>/dev/null || echo "[]")
if [ "$CONTAINERS" = "[]" ] || [ -z "$CONTAINERS" ]; then
    echo "❌ No containers running"
    echo "Run: docker compose up -d"
    exit 1
fi

echo "Container Status:"
docker compose ps
echo ""

# Check individual services
echo "Checking services..."

# PostgreSQL
if docker compose exec -T postgres pg_isready -U ocean_erp &>/dev/null; then
    echo "✓ PostgreSQL is ready"
else
    echo "❌ PostgreSQL not ready"
fi

# App
if curl -sf "$BASE_URL:4000/health" &>/dev/null || curl -sf "$BASE_URL:4000" &>/dev/null; then
    echo "✓ App is responding"
else
    echo "⚠ App might not be ready yet (this is normal during first startup)"
fi

# Nginx
if curl -sf "$BASE_URL/health" &>/dev/null || curl -sf "$BASE_URL" &>/dev/null; then
    echo "✓ Nginx is responding"
else
    echo "⚠ Nginx might not be ready yet"
fi

echo ""
echo "========================================="
echo "Access Points:"
echo "========================================="
echo "Direct App:  $BASE_URL:4000"
echo "Via Nginx:   $BASE_URL"
echo ""
echo "To view logs:"
echo "  All services:    docker compose logs -f"
echo "  App only:        docker compose logs -f app"
echo "  Database only:   docker compose logs -f postgres"
echo ""
