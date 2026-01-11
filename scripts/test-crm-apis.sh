#!/bin/bash
# Phase 7 Task 1: CRM API Test Script
# Tests all 8 API endpoints

echo "🧪 Testing CRM Foundation APIs..."
echo "=================================="
echo ""

BASE_URL="http://localhost:4000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_count=0
pass_count=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    test_count=$((test_count + 1))
    echo -n "Test $test_count: $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$url" \
            -H "Content-Type: application/json" \
            -d "$data" 2>/dev/null)
    fi
    
    if [ "$response" = "200" ] || [ "$response" = "201" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($response)"
        pass_count=$((pass_count + 1))
    else
        echo -e "${RED}✗ FAIL${NC} ($response)"
    fi
}

echo "1️⃣  Account Management APIs"
echo "----------------------------"
test_endpoint "List accounts" "GET" "/api/crm/accounts"
test_endpoint "Search accounts" "GET" "/api/crm/accounts?search=acme"
test_endpoint "Filter by type" "GET" "/api/crm/accounts?account_type=customer"
test_endpoint "Create account" "POST" "/api/crm/accounts" \
    '{"account_name":"Test Company","account_type":"customer","industry":"Technology"}'
echo ""

echo "2️⃣  Contact Management APIs"
echo "----------------------------"
test_endpoint "List contacts" "GET" "/api/crm/contacts"
test_endpoint "Filter contacts" "GET" "/api/crm/contacts?account_id=1"
test_endpoint "Create contact" "POST" "/api/crm/contacts" \
    '{"account_id":1,"first_name":"Test","last_name":"User","job_title":"Manager"}'
echo ""

echo "3️⃣  Relationship APIs"
echo "---------------------"
test_endpoint "Account contacts" "GET" "/api/crm/accounts/1/contacts"
test_endpoint "Account history" "GET" "/api/crm/accounts/1/history"
test_endpoint "Account hierarchy" "GET" "/api/crm/accounts/1/hierarchy"
echo ""

echo "4️⃣  Communication APIs"
echo "----------------------"
test_endpoint "List communications" "GET" "/api/crm/communications"
test_endpoint "Log communication" "POST" "/api/crm/communications" \
    '{"account_id":1,"communication_type_id":1,"subject":"Test Call","communication_date":"2025-12-04T10:00:00"}'
echo ""

echo "5️⃣  Search & Analytics APIs"
echo "----------------------------"
test_endpoint "Customer search" "GET" "/api/crm/customers/search?q=acme"
test_endpoint "CRM dashboard" "GET" "/api/crm/customers/dashboard"
echo ""

echo "=================================="
echo -e "Results: ${GREEN}$pass_count/$test_count passed${NC}"
echo ""

if [ $pass_count -eq $test_count ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Check if server is running on port 4000.${NC}"
    exit 1
fi
