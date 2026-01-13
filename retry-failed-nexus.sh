#!/bin/bash

# Script to retry failed package uploads using Nexus REST API
# Usage: ./retry-failed-nexus.sh [failed-packages-file] [nexus-url] [parallel-jobs] [repository]
# 
# Authentication options (set as environment variables):
#   NEXUS_COOKIES=/path/to/cookies.txt  - Use cookies file
#   NEXUS_USER=admin NEXUS_PASS=password - Use basic auth
#   Or rely on npm login credentials

FAILED_FILE="${1:-failed-packages-20260110-182053.txt}"
NEXUS_URL="${2:-http://localhost:8081}"
PARALLEL_JOBS="${3:-40}"
REPOSITORY="${4:-my-npm}"

TGZ_DIR="$HOME/projects/tgz-files-a98b169a-80dc-4f45-a13d-d167a627fe1d"

# Authentication (optional - can use npm credentials or set env vars)
NEXUS_COOKIES="${NEXUS_COOKIES:-}"
NEXUS_USER="${NEXUS_USER:-}"
NEXUS_PASS="${NEXUS_PASS:-}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if failed packages file exists
if [ ! -f "$FAILED_FILE" ]; then
    echo -e "${RED}Error: Failed packages file '$FAILED_FILE' not found${NC}"
    exit 1
fi

# Count total packages to retry
TOTAL=$(wc -l < "$FAILED_FILE" | tr -d ' ')

if [ "$TOTAL" -eq 0 ]; then
    echo -e "${YELLOW}No packages to retry${NC}"
    exit 0
fi

echo "Found $TOTAL packages to retry"
echo "Uploading with $PARALLEL_JOBS parallel jobs..."
echo ""

# Create temp file for results
RESULTS_FILE=$(mktemp)
trap "rm -f $RESULTS_FILE" EXIT

# Function to upload a single package via Nexus REST API
upload_package() {
    local pkg_name="$1"
    local current="$2"
    local total="$3"
    local tgz_file="$TGZ_DIR/$pkg_name"
    
    if [ ! -f "$tgz_file" ]; then
        echo -e "${RED}✗ File not found: $pkg_name${NC}"
        echo "FAILED:$pkg_name" >> "$RESULTS_FILE"
        return 1
    fi
    
    echo -n "Uploading $pkg_name ($current / $total)... "
    
    # Build curl command with optional authentication
    CURL_CMD="curl -s -w \"\n%{http_code}\" -X POST"
    
    # Add authentication if cookies file exists or use npm credentials
    if [ -n "$NEXUS_COOKIES" ] && [ -f "$NEXUS_COOKIES" ]; then
        # Use cookies file if provided
        CURL_CMD="$CURL_CMD -b \"$NEXUS_COOKIES\""
    elif [ -n "$NEXUS_USER" ] && [ -n "$NEXUS_PASS" ]; then
        # Use basic auth
        CURL_CMD="$CURL_CMD -u \"$NEXUS_USER:$NEXUS_PASS\""
    fi
    
    # Upload using Nexus REST API
    OUTPUT=$(eval "$CURL_CMD \
        \"$NEXUS_URL/service/rest/v1/components?repository=$REPOSITORY\" \
        -H \"accept: application/json\" \
        -H \"X-Nexus-UI: true\" \
        -F \"npm.asset=@$tgz_file\" \
        2>&1")
    
    HTTP_CODE=$(echo "$OUTPUT" | tail -n1)
    RESPONSE=$(echo "$OUTPUT" | sed '$d')
    
    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
        echo -e "${GREEN}✓${NC}"
        echo "SUCCESS:$pkg_name" >> "$RESULTS_FILE"
        return 0
    elif [ "$HTTP_CODE" = "409" ] || echo "$RESPONSE" | grep -qi "already exists\|duplicate"; then
        echo -e "${YELLOW}⚠ (already exists)${NC}"
        echo "ALREADY_EXISTS:$pkg_name" >> "$RESULTS_FILE"
        return 0
    elif [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
        echo -e "${RED}✗ (auth failed - HTTP $HTTP_CODE)${NC}"
        echo "FAILED:$pkg_name" >> "$RESULTS_FILE"
        return 1
    else
        echo -e "${RED}✗ (HTTP $HTTP_CODE)${NC}"
        echo "FAILED:$pkg_name" >> "$RESULTS_FILE"
        return 1
    fi
}

# Export function and variables for parallel execution
export -f upload_package
export TGZ_DIR NEXUS_URL REPOSITORY GREEN RED YELLOW NC RESULTS_FILE
export NEXUS_COOKIES NEXUS_USER NEXUS_PASS

# Upload packages in parallel
CURRENT=0
cat "$FAILED_FILE" | while read pkg_name; do
    [ -z "$pkg_name" ] && continue
    ((CURRENT++))
    echo "$pkg_name|$CURRENT|$TOTAL"
done | xargs -P "$PARALLEL_JOBS" -n 1 -I {} bash -c '
    IFS="|" read -r pkg_name current total <<< "{}"
    upload_package "$pkg_name" "$current" "$total"
'

# Wait for all jobs
wait

# Process results
SUCCESS=0
FAILED=0
ALREADY_EXISTS=0
ACTUAL_FAILURES=()

while IFS=: read -r status pkg_name; do
    case "$status" in
        SUCCESS)
            ((SUCCESS++))
            ;;
        ALREADY_EXISTS)
            ((ALREADY_EXISTS++))
            ;;
        FAILED)
            ((FAILED++))
            ACTUAL_FAILURES+=("$pkg_name")
            ;;
    esac
done < "$RESULTS_FILE"

echo ""
echo "=========================================="
echo -e "${GREEN}Successfully uploaded: $SUCCESS / $TOTAL${NC}"
echo -e "${YELLOW}Already exists (skipped): $ALREADY_EXISTS / $TOTAL${NC}"
echo -e "${RED}Failed: $FAILED / $TOTAL${NC}"
echo "=========================================="

if [ ${#ACTUAL_FAILURES[@]} -gt 0 ]; then
    NEW_FAILED_FILE="failed-packages-retry-$(date +%Y%m%d-%H%M%S).txt"
    
    echo ""
    echo -e "${RED}Packages that still failed (${#ACTUAL_FAILURES[@]} total):${NC}"
    echo ""
    for pkg in "${ACTUAL_FAILURES[@]}"; do
        echo "  - $pkg"
        echo "$pkg" >> "$NEW_FAILED_FILE"
    done
    
    echo ""
    echo -e "${YELLOW}Still-failed packages saved to: $NEW_FAILED_FILE${NC}"
fi
