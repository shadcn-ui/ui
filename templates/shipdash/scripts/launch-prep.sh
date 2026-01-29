#!/bin/bash

# ShipDash Launch Preparation Script
# Run this the day before launch

set -e

echo "=========================================="
echo "  ShipDash Launch Preparation"
echo "=========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Step 1: Test build
echo "[1/4] Testing build..."
cd "$PROJECT_DIR"
./scripts/test-build.sh > /dev/null 2>&1
echo "  ✓ Build test passed"

# Step 2: Create package
echo "[2/4] Creating distribution package..."
./scripts/package.sh > /dev/null 2>&1
echo "  ✓ Package created: release/shipdash.zip"

# Step 3: Show marketing files
echo "[3/4] Marketing materials ready:"
echo "  ✓ marketing/TWITTER.md - Twitter launch copy"
echo "  ✓ marketing/REDDIT.md - Reddit posts"
echo "  ✓ marketing/PRODUCTHUNT.md - Product Hunt copy"
echo "  ✓ marketing/LINKEDIN.md - LinkedIn posts"
echo "  ✓ marketing/EMAIL.md - Email templates"
echo "  ✓ marketing/INDIE_HACKERS.md - Indie Hackers posts"
echo "  ✓ marketing/LAUNCH_CHECKLIST.md - Launch checklist"

# Step 4: Show Gumroad files
echo "[4/4] Gumroad materials ready:"
echo "  ✓ GUMROAD-COPY.md - Product description"
echo "  ✓ SCREENSHOTS.md - Screenshot checklist"
echo "  ✓ release/shipdash.zip - Product file"

echo ""
echo "=========================================="
echo "  Launch Preparation Complete!"
echo "=========================================="
echo ""
echo "  NEXT STEPS:"
echo ""
echo "  1. Take screenshots (follow SCREENSHOTS.md)"
echo "  2. Upload to Gumroad:"
echo "     - File: release/shipdash.zip"
echo "     - Description: Copy from GUMROAD-COPY.md"
echo "     - Price: \$29"
echo "  3. Schedule launch posts from marketing/ folder"
echo ""
echo "  Good luck with your launch! 🚀"
echo ""
