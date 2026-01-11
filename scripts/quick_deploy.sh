#!/usr/bin/env bash
set -euo pipefail

# ONE-COMMAND DEPLOYMENT
# Run from your local machine: ./scripts/quick_deploy.sh root@103.168.135.110

if [ $# -lt 1 ]; then
    echo "Usage: $0 [user@]server_ip"
    echo "Example: $0 root@103.168.135.110"
    exit 1
fi

SERVER="$1"
DEST="/opt/ocean-erp"

echo "🚀 Ocean ERP - One-Command Deployment"
echo "======================================"
echo "Target: $SERVER"
echo "Destination: $DEST"
echo ""

# Step 1: Upload files
echo "📤 Step 1/3: Uploading files..."
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

ssh "$SERVER" "mkdir -p $DEST"

rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='tmp' \
    --exclude='.env' \
    --exclude='*.log' \
    ./ "$SERVER:$DEST/"

echo "✅ Upload complete!"
echo ""

# Step 2: Deploy on server
echo "🔧 Step 2/3: Installing Docker and deploying..."
ssh "$SERVER" "cd $DEST && sudo bash scripts/deploy_to_server.sh"

echo ""
echo "✅ Deployment complete!"
echo ""

# Step 3: Verify
echo "🔍 Step 3/3: Verifying deployment..."
ssh "$SERVER" "cd $DEST && bash scripts/verify_deployment.sh http://103.168.135.110"

echo ""
echo "======================================"
echo "✅ ALL DONE!"
echo "======================================"
echo ""
echo "🌐 Access your application:"
echo "   http://103.168.135.110"
echo "   http://103.168.135.110:4000"
echo ""
echo "📋 Useful commands (run on server):"
echo "   ssh $SERVER"
echo "   cd $DEST"
echo "   docker compose logs -f        # View logs"
echo "   docker compose ps             # Check status"
echo "   docker compose restart        # Restart all"
echo ""
