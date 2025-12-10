#!/usr/bin/env bash
set -euo pipefail

# End-to-end smoke test for sales order -> journal entries
# Requires: PGPASSWORD, PGHOST, PGUSER, PGDATABASE or DATABASE_URL in env

API_BASE="http://localhost:4000"
TEST_CUSTOMER_ID=$(psql -Atc "SELECT id FROM customers LIMIT 1;" "$DATABASE_URL")
if [ -z "$TEST_CUSTOMER_ID" ]; then
  echo "No customer found in DB"
  exit 1
fi

echo "Using customer: $TEST_CUSTOMER_ID"

# Create Confirmed+Paid order (cash sale)
CASH_ORDER_JSON=$(mktemp)
cat > "$CASH_ORDER_JSON" <<JSON
{
  "customer_id": "${TEST_CUSTOMER_ID}",
  "order_number": "E2E-CASH-$(date +%s)",
  "order_date": "$(date +%F)",
  "subtotal": 100000,
  "tax": 0,
  "total_amount": 100000,
  "status": "Confirmed",
  "payment_status": "Paid",
  "items": [ { "product_id": null, "description": "E2E cash item", "quantity": 1, "unit_price": 100000, "total": 100000 } ]
}
JSON

echo "Posting cash sale order..."
resp=$(curl -sS -X POST "$API_BASE/api/sales-orders" -H "Content-Type: application/json" -d @$CASH_ORDER_JSON -w "\nHTTP_STATUS:%{http_code}\n")
echo "$resp"

# Create Confirmed+Pending order (credit sale)
CREDIT_ORDER_JSON=$(mktemp)
cat > "$CREDIT_ORDER_JSON" <<JSON
{
  "customer_id": "${TEST_CUSTOMER_ID}",
  "order_number": "E2E-CREDIT-$(date +%s)",
  "order_date": "$(date +%F)",
  "subtotal": 50000,
  "tax": 0,
  "total_amount": 50000,
  "status": "Confirmed",
  "payment_status": "Pending",
  "items": [ { "product_id": null, "description": "E2E credit item", "quantity": 1, "unit_price": 50000, "total": 50000 } ]
}
JSON

echo "Posting credit sale order..."
resp2=$(curl -sS -X POST "$API_BASE/api/sales-orders" -H "Content-Type: application/json" -d @$CREDIT_ORDER_JSON -w "\nHTTP_STATUS:%{http_code}\n")
echo "$resp2"

# Query recent journal entries created in last 5 minutes
echo "Checking journal entries created in last 5 minutes..."
psql -Atc "SELECT entry_number||'|'||reference||'|'||total_debit||'|'||total_credit FROM journal_entries WHERE created_at >= (NOW() - INTERVAL '10 minutes') ORDER BY created_at DESC;" "$DATABASE_URL"

echo "E2E test complete"
