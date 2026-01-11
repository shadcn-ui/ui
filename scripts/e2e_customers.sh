#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:4000"

echo "Creating customer..."
CREATE=$(curl -s -X POST "$BASE/api/customers" -H 'Content-Type: application/json' -d '{"company_name":"E2E Co","contact_first_name":"E2E","contact_last_name":"Runner","contact_email":"e2e@example.com","credit_limit":1000000}')
echo "$CREATE"

ID=$(echo "$CREATE" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
echo "Created ID: $ID"

echo "Fetching customers page..."
curl -s "$BASE/api/customers?limit=5" | head -c 1000

echo "Updating customer..."
curl -s -X PATCH "$BASE/api/customers/$ID" -H 'Content-Type: application/json' -d '{"company_name":"E2E Co Updated","contact_person":"E2E Runner"}'

echo "Deleting customer..."
curl -s -X DELETE "$BASE/api/customers/$ID"

echo "E2E script completed"
