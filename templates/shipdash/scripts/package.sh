#!/bin/bash

# ShipDash Packaging Script
# Run this to create a distribution ZIP file

set -e

echo "=========================================="
echo "  ShipDash Packaging Script"
echo "=========================================="
echo ""

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/release"

# Clean up previous builds
echo "[1/5] Cleaning up..."
rm -rf "$PROJECT_DIR/dist"
rm -rf "$PROJECT_DIR/node_modules"
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Create a clean copy for distribution
echo "[2/5] Creating distribution copy..."
TEMP_DIR=$(mktemp -d)
DIST_DIR="$TEMP_DIR/shipdash"
mkdir -p "$DIST_DIR"

# Copy source files (excluding dev files)
cp -r "$PROJECT_DIR/src" "$DIST_DIR/"
cp -r "$PROJECT_DIR/public" "$DIST_DIR/"
cp "$PROJECT_DIR/package.json" "$DIST_DIR/"
cp "$PROJECT_DIR/tsconfig.json" "$DIST_DIR/"
cp "$PROJECT_DIR/tsconfig.app.json" "$DIST_DIR/"
cp "$PROJECT_DIR/tsconfig.node.json" "$DIST_DIR/"
cp "$PROJECT_DIR/vite.config.ts" "$DIST_DIR/"
cp "$PROJECT_DIR/eslint.config.js" "$DIST_DIR/"
cp "$PROJECT_DIR/index.html" "$DIST_DIR/"
cp "$PROJECT_DIR/.gitignore" "$DIST_DIR/"
cp "$PROJECT_DIR/README.md" "$DIST_DIR/"
cp "$PROJECT_DIR/LICENSE" "$DIST_DIR/"

# Remove marketing/internal files from distribution
echo "[3/5] Removing internal files..."
rm -f "$DIST_DIR/PRICING.md" 2>/dev/null || true
rm -f "$DIST_DIR/GUMROAD-COPY.md" 2>/dev/null || true
rm -f "$DIST_DIR/LAUNCH-PLAN.md" 2>/dev/null || true
rm -f "$DIST_DIR/SCREENSHOTS.md" 2>/dev/null || true
rm -rf "$DIST_DIR/scripts" 2>/dev/null || true

# Create ZIP
echo "[4/5] Creating ZIP file..."
cd "$TEMP_DIR"
zip -r "$OUTPUT_DIR/shipdash.zip" shipdash -x "*.DS_Store" -x "*__MACOSX*"

# Calculate size
SIZE=$(du -h "$OUTPUT_DIR/shipdash.zip" | cut -f1)

# Cleanup
rm -rf "$TEMP_DIR"

echo "[5/5] Done!"
echo ""
echo "=========================================="
echo "  Package created successfully!"
echo "=========================================="
echo ""
echo "  File: $OUTPUT_DIR/shipdash.zip"
echo "  Size: $SIZE"
echo ""
echo "  Next steps:"
echo "  1. Upload to Gumroad"
echo "  2. Set price to \$29 (launch) or \$49 (regular)"
echo "  3. Publish and share!"
echo ""
