#!/usr/bin/env bash
set -euo pipefail

# FRESH DEPLOYMENT TO NEW SERVER
# One command to deploy everything from scratch
# Usage: ./scripts/fresh_deploy.sh root@103.168.135.169

SERVER="${1:-root@103.168.135.169}"
DEST="/opt/ocean-erp"

echo "╔════════════════════════════════════════╗"
echo "║  Ocean ERP - Fresh Server Deployment  ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🎯 Target Server: $SERVER"
echo "📁 Install Path: $DEST"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

# Step 1: Upload files
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 Step 1/4: Uploading files..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

ssh "$SERVER" "mkdir -p $DEST" 2>/dev/null || true

rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='tmp' \
    --exclude='.env' \
    --exclude='*.log' \
    ./ "$SERVER:$DEST/"

echo ""
echo "✅ Files uploaded successfully!"
echo ""

# Step 2: Fix network if needed
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Step 2/4: Configuring network..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ssh "$SERVER" "cd $DEST && sudo bash scripts/fix_network.sh" || {
    echo "⚠️  Network fix skipped (might not be needed)"
}

echo ""

# Step 3: Deploy
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Step 3/4: Installing and deploying..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will:"
echo "  • Install Docker & Docker Compose"
echo "  • Generate secure passwords"
echo "  • Build application images (5-10 mins)"
echo "  • Start all services"
echo ""

ssh "$SERVER" "cd $DEST && sudo bash scripts/deploy_to_server.sh"

echo ""

# Step 4: Verify
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Step 4/4: Verifying deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sleep 5

ssh "$SERVER" "cd $DEST && bash scripts/verify_deployment.sh http://103.168.135.169" || {
    echo ""
    echo "⚠️  Initial verification incomplete - services may still be starting"
    echo "Wait 30 seconds and check manually"
}

echo ""
echo "╔════════════════════════════════════════╗"
echo "║          ✅ DEPLOYMENT COMPLETE!       ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "🌐 Your application is now available at:"
echo ""
echo "   🔗 http://103.168.135.169"
echo "   🔗 http://103.168.135.169:4000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Quick Commands:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "View logs:"
echo "  ssh $SERVER 'cd $DEST && docker compose logs -f'"
echo ""
echo "Check status:"
echo "  ssh $SERVER 'cd $DEST && docker compose ps'"
echo ""
echo "Restart services:"
echo "  ssh $SERVER 'cd $DEST && docker compose restart'"
echo ""
echo "SSH to server:"
echo "  ssh $SERVER"
echo ""
