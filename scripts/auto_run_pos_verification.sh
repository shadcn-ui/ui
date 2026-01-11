#!/usr/bin/env bash
set -euo pipefail

# auto_run_pos_verification.sh
# Installs pnpm (if needed), installs puppeteer locally and runs the verification script.
# Usage:
#  COOKIE='session=abc; other=def' ./scripts/auto_run_pos_verification.sh
# or
#  EMAIL='umar@yopmail.com' PASSWORD='P@ssw0rd' ./scripts/auto_run_pos_verification.sh

BASE_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$BASE_DIR"

# Ensure corepack/pnpm available (pnpm is package manager for this repo)
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm not found — trying to enable via corepack"
  if command -v corepack >/dev/null 2>&1; then
    corepack enable
    corepack prepare pnpm@9.0.6 --activate || true
  else
    echo "corepack not found — installing pnpm via npm (may require sudo)"
    if command -v npm >/dev/null 2>&1; then
      npm install -g pnpm@9.0.6
    else
      echo "npm not available — please install pnpm or run the Docker runner instead." >&2
      exit 1
    fi
  fi
fi

# Install only puppeteer into project temporarily using pnpm (no workspace install)
echo "Installing puppeteer (local)..."
pnpm add -w puppeteer@23.6.0 --silent || pnpm add puppeteer@23.6.0 --silent

# Make sure the CommonJS script exists
SCRIPT="scripts/pos_verification.cjs"
if [ ! -f "$SCRIPT" ]; then
  echo "$SCRIPT not found" >&2
  exit 1
fi

# Create output dir
OUTPUT_DIR="tmp/pos-verification"
mkdir -p "$OUTPUT_DIR"

# Run the verifier with whatever env vars are provided
echo "Running verifier (outputs to $OUTPUT_DIR)"
node "$SCRIPT"

echo "Done. Artifacts are in $OUTPUT_DIR"