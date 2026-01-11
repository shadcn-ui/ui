#!/usr/bin/env bash
set -euo pipefail

# Upload Ocean ERP to server using rsync
# Usage: ./scripts/upload_to_server.sh [user@]host [destination]
#
# Example:
#   ./scripts/upload_to_server.sh root@103.168.135.110 /opt/ocean-erp

if [ $# -lt 1 ]; then
    echo "Usage: $0 [user@]host [destination]"
    echo "Example: $0 root@103.168.135.110 /opt/ocean-erp"
    exit 1
fi

SERVER="$1"
DEST="${2:-/opt/ocean-erp}"

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

echo "Uploading Ocean ERP to $SERVER:$DEST"
echo ""

# Create destination directory on server
ssh "$SERVER" "mkdir -p $DEST"

# Upload files excluding node_modules, .next, etc
rsync -avz --progress \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    --exclude='tmp' \
    --exclude='.env' \
    --exclude='*.log' \
    ./ "$SERVER:$DEST/"

echo ""
echo "Upload complete!"
echo ""
echo "Next steps:"
echo "1. SSH into server: ssh $SERVER"
echo "2. Navigate to directory: cd $DEST"
echo "3. Run deployment: sudo bash scripts/deploy_to_server.sh"
