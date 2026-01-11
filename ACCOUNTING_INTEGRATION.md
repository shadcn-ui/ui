# Accounting Integration - Sales Order to Journal Entry

## Overview

The Ocean ERP system now includes **automatic accounting integration** that creates journal entries whenever sales orders are created or updated. This ensures that your accounting records are always synchronized with your sales transactions.

## How It Works

### 1. Sales Order Creation with "Confirmed" Status

When you create a new sales order with status = `"Confirmed"`:

**Accounting Entry Created:**
```
Debit:  1300 - Accounts Receivable     IDR 1,000,000
Credit: 4100 - Sales Revenue           IDR 1,000,000
```

**What this means:**
- Your customer now owes you money (Accounts Receivable increases)
- Your revenue is recognized (Sales Revenue increases)
- This follows the **accrual accounting** principle

### 2. Sales Order Status Update to "Confirmed"

When you update an existing order from `"Pending"` → `"Confirmed"`:

Same journal entry as above is created automatically.

### 3. Payment Received

When you update the payment status from `"Unpaid"` → `"Paid"`:

**Accounting Entry Created:**
```
Debit:  1110 - Cash (or 1210 - Bank)   IDR 1,000,000
Credit: 1300 - Accounts Receivable     IDR 1,000,000
```

**What this means:**
- Cash/Bank balance increases
- Accounts Receivable decreases (customer paid their debt)
- The revenue was already recognized when order was confirmed

## API Endpoints with Accounting Integration

### POST `/api/sales-orders`

Create a new sales order. If `status: "Confirmed"`, journal entry is automatically created.

**Example Request:**
```json
{
  "customer": "PT Mandiri Sejahtera",
  "customer_email": "finance@mandiri.com",
  "customer_phone": "021-1234567",
  "status": "Confirmed",
  "payment_status": "Unpaid",
  "total_amount": 5000000,
  "order_date": "2025-01-15"
}
```

**Result:**
- ✅ Sales order created with Order Number (e.g., `SO-000123`)
- ✅ Journal entry created automatically:
  - Entry Number: `JE000001`
  - Debit: Accounts Receivable IDR 5,000,000
  - Credit: Sales Revenue IDR 5,000,000

### PATCH `/api/sales-orders/[id]`

Update an existing sales order.

**Case 1: Confirm Order**
```json
{
  "status": "Confirmed"
}
```
→ Creates AR/Revenue journal entry

**Case 2: Record Payment**
```json
{
  "payment_status": "Paid",
  "payment_method": "Bank Transfer"
}
```
→ Creates Cash/AR journal entry

## Account Codes Used

| Account Code | Account Name | Type | Purpose |
|-------------|-------------|------|---------|
| 1110 | Cash and Cash Equivalents | Asset | Cash payments |
| 1210 | Bank BCA - Operating | Asset | Bank transfers |
| 1300 | Accounts Receivable | Asset | Customer invoices |
| 4100 | Sales Revenue | Revenue | Product/service sales |
| 5100 | Cost of Goods Sold | Expense | Product costs (future) |
| 1400 | Inventory | Asset | Stock value (future) |

## Viewing Journal Entries

After creating/updating a sales order, you can view the automatically created journal entries in:

1. **Accounting Dashboard**: `/erp/accounting`
   - See recent transactions
   - View summary statistics

2. **Journal Entries Page**: `/erp/accounting/journal-entries`
   - Filter by date range
   - Search by reference (e.g., `SO-000123`)
   - View all entry lines (debits & credits)

## Transaction Flow Example

### Complete Sales Cycle

**Step 1: Customer Places Order**
```bash
POST /api/sales-orders
{
  "customer": "PT Jaya Abadi",
  "total_amount": 10000000,
  "status": "Confirmed"
}
```

**Accounting Impact:**
```
Debit:  Accounts Receivable  IDR 10,000,000
Credit: Sales Revenue        IDR 10,000,000
```

**Step 2: Customer Pays**
```bash
PATCH /api/sales-orders/11
{
  "payment_status": "Paid",
  "payment_method": "Bank Transfer"
}
```

**Accounting Impact:**
```
Debit:  Bank BCA            IDR 10,000,000
Credit: Accounts Receivable IDR 10,000,000
```

**Final Result:**
- ✅ Cash increased by IDR 10,000,000
- ✅ Revenue recognized IDR 10,000,000
- ✅ Accounts Receivable is zero (paid in full)
- ✅ All transactions automatically recorded in journal entries

## Error Handling

The system is designed to be **resilient**:

- ✅ If journal entry creation fails, the sales order is still created
- ⚠️ A warning is logged to the console
- ✅ You can manually create the journal entry later if needed
- ✅ The system validates that debits = credits before posting

## Checking Logs

When running the development server, you'll see logs like:

```
✓ Journal entry created: JE for order SO-000123
✓ Payment journal entry created: SO-000123
```

Or warnings if something went wrong:

```
Warning: Failed to create journal entry: Account with code 1300 not found
```

## Future Enhancements

### Coming Soon:
1. **COGS Recognition** - When order is shipped, automatically record:
   - Debit: Cost of Goods Sold
   - Credit: Inventory

2. **Partial Payments** - Support multiple payment entries for the same order

3. **Sales Returns** - Reverse entries for returned orders

4. **Tax Handling** - Separate VAT/PPN entries

5. **Invoice Generation** - Create formal invoices linked to journal entries

## Technical Details

### Helper Functions Location
`/apps/v4/lib/accounting-integration.ts`

### Key Functions:
- `createJournalEntry()` - Core function for creating journal entries
- `createSalesOrderJournalEntry()` - AR/Revenue entry
- `createPaymentJournalEntry()` - Cash/AR entry
- `createCOGSJournalEntry()` - COGS/Inventory entry (future)

### Database Tables:
- `sales_orders` - Sales order data
- `journal_entries` - Journal entry headers
- `journal_entry_lines` - Individual debit/credit lines
- `chart_of_accounts` - Account master data

## Testing the Integration

### 1. Create a Test Order

Visit: `http://localhost:4000/erp/sales/orders`

Or use API:
```bash
curl -X POST http://localhost:4000/api/sales-orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": "Test Customer",
    "customer_email": "test@example.com",
    "total_amount": 1000000,
    "status": "Confirmed",
    "payment_status": "Unpaid"
  }'
```

### 2. Check Journal Entries

Visit: `http://localhost:4000/erp/accounting/journal-entries`

You should see a new entry with:
- Reference: `SO-[order number]`
- Two lines: Debit AR, Credit Revenue

### 3. Mark as Paid

```bash
curl -X PATCH http://localhost:4000/api/sales-orders/[id] \
  -H "Content-Type: application/json" \
  -d '{
    "payment_status": "Paid",
    "payment_method": "Cash"
  }'
```

### 4. Verify Payment Entry

Check journal entries again - you should see:
- Reference: `PMT-[order number]`
- Two lines: Debit Cash, Credit AR

## Summary

✅ **Automatic** - No manual journal entry creation needed
✅ **Accurate** - Always balanced (debits = credits)
✅ **Transparent** - All entries visible in accounting module
✅ **Auditable** - Complete trail from order to accounting
✅ **Real-time** - Financial reports always up-to-date

This integration ensures your accounting is always accurate and up-to-date with your business operations!
