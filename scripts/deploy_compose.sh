sudo ./scripts/server_install_docker.sh
# re-login so docker group applies#!/usr/bin/env bash
set -euo pipefail

# Builds (or pulls) and starts the stack defined in docker-compose.yml.
# Usage: ./scripts/deploy_compose.sh

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo ".env file not found. Create it before deploying (see .env.example)." >&2
  exit 1
fi

# Ensure upload dir exists for bind mount
mkdir -p apps/v4/public/uploads

# Try to pull prebuilt images if available; fall back to local build
if docker compose pull; then
  echo "Pulled images from registry (if configured)."
else
  echo "Pull failed or images not present; proceeding with local build." >&2
fi

docker compose build

docker compose up -d

echo "Deployment started. Services:"
docker compose ps
