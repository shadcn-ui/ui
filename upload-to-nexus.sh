#!/bin/bash

# Simple script to upload all .tgz packages to Nexus
# Usage: ./upload-to-nexus.sh [directory] [registry-url] [parallel-jobs]

# TGZ_DIR="${1:-$/projects/tgz-files-a98b169a-80dc-4f45-a13d-d167a627fe1d}"
REGISTRY_URL="${2:-http://localhost:8081/repository/my-npm/}"
PARALLEL_JOBS="${3:-40}"

TGZ_DIR="$HOME/projects/tgz-files-a98b169a-80dc-4f45-a13d-d167a627fe1d"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create temp file for results
RESULTS_FILE=$(mktemp)
trap "rm -f $RESULTS_FILE" EXIT

# Function to upload a single file
upload_file() {
    local tgz_file="$1"
    local current="$2"
    local total="$3"
    local filename=$(basename "$tgz_file")
    
    echo -n "Uploading $filename ($current / $total)... "
    
    # Capture output to check for specific errors
    OUTPUT=$(npm publish "$tgz_file" --registry "$REGISTRY_URL" --no-provenance 2>&1)
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
        echo "SUCCESS:$filename" >> "$RESULTS_FILE"
    elif echo "$OUTPUT" | grep -qi "cannot publish over the previously published versions"; then
        echo -e "${YELLOW}⚠ (already published)${NC}"
        echo "ALREADY_PUBLISHED:$filename" >> "$RESULTS_FILE"
    else
        echo -e "${RED}✗${NC}"
        echo "FAILED:$filename" >> "$RESULTS_FILE"
    fi
}

# Export function and variables for parallel execution
export -f upload_file
export REGISTRY_URL GREEN RED YELLOW NC RESULTS_FILE

# Count total files first
TOTAL=0
FILES=()
while IFS= read -r -d '' tgz_file; do
    if [ -f "$tgz_file" ]; then
        FILES+=("$tgz_file")
        ((TOTAL++))
    fi
done < <(find "$TGZ_DIR" -name "*.tgz" -type f -print0)

echo "Found $TOTAL .tgz files"
echo "Uploading with $PARALLEL_JOBS parallel jobs..."
echo ""

# Upload files in parallel using xargs
CURRENT=0
for tgz_file in "${FILES[@]}"; do
    ((CURRENT++))
    echo "$tgz_file|$CURRENT|$TOTAL"
done | xargs -P "$PARALLEL_JOBS" -n 1 -I {} bash -c '
    IFS="|" read -r tgz_file current total <<< "{}"
    upload_file "$tgz_file" "$current" "$total"
'

# Wait for all background jobs
wait

# Process results
SUCCESS=0
FAILED=0
ALREADY_PUBLISHED=0
ACTUAL_FAILURES=()

while IFS=: read -r status filename; do
    case "$status" in
        SUCCESS)
            ((SUCCESS++))
            ;;
        ALREADY_PUBLISHED)
            ((ALREADY_PUBLISHED++))
            ;;
        FAILED)
            ((FAILED++))
            ACTUAL_FAILURES+=("$filename")
            ;;
    esac
done < "$RESULTS_FILE"

echo ""
echo "=========================================="
echo -e "${GREEN}Successfully uploaded: $SUCCESS / $TOTAL${NC}"
echo -e "${YELLOW}Already published (skipped): $ALREADY_PUBLISHED / $TOTAL${NC}"
echo -e "${RED}Failed: $FAILED / $TOTAL${NC}"
echo "=========================================="

if [ ${#ACTUAL_FAILURES[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Packages that failed to upload (${#ACTUAL_FAILURES[@]} total):${NC}"
    echo ""
    FAILED_LIST_FILE="failed-packages-$(date +%Y%m%d-%H%M%S).txt"
    
    for pkg in "${ACTUAL_FAILURES[@]}"; do
        echo "  - $pkg"
        echo "$pkg" >> "$FAILED_LIST_FILE"
    done
    
    echo ""
    echo -e "${YELLOW}Failed packages list saved to: $FAILED_LIST_FILE${NC}"
    echo ""
    echo -e "${YELLOW}To retry failed packages, run:${NC}"
    echo "  while read pkg; do"
    echo "    npm publish \"$TGZ_DIR/\$pkg\" --registry \"$REGISTRY_URL\""
    echo "  done < $FAILED_LIST_FILE"
fi
