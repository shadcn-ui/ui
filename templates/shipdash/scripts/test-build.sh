#!/bin/bash

# ShipDash Build Test Script
# Verifies the project builds successfully

set -e

echo "=========================================="
echo "  ShipDash Build Test"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[1/3] Installing dependencies..."
    npm install --legacy-peer-deps
else
    echo "[1/3] Dependencies already installed"
fi

echo "[2/3] Running TypeScript check..."
npx tsc --noEmit
echo "  ✓ TypeScript OK"

echo "[3/3] Building for production..."
npm run build
echo "  ✓ Build OK"

echo ""
echo "=========================================="
echo "  All checks passed!"
echo "=========================================="
echo ""
echo "  Build output: ./dist"
echo "  Size: $(du -sh dist | cut -f1)"
echo ""
