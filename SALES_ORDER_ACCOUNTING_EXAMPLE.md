# Sales Order to Accounting Integration - Complete Example

## Overview
This document shows real examples of how sales orders are automatically recorded in the accounting system using double-entry bookkeeping.

---

## Example Scenario

### Business Transaction
**ABC Company** sells products to **PT. Sejahtera Indonesia**

**Order Details:**
- Order Number: SO-2025-001
- Customer: PT. Sejahtera Indonesia
- Order Date: November 26, 2025
- Products:
  - Laptop Dell Inspiron 15 (Qty: 2) @ Rp 8,500,000 = Rp 17,000,000
  - Mouse Logitech MX Master (Qty: 5) @ Rp 1,200,000 = Rp 6,000,000
- Subtotal: Rp 23,000,000
- Tax (11%): Rp 2,530,000
- **Total Amount: Rp 25,530,000**
- Status: Confirmed
- Payment Status: Unpaid
- Payment Method: Bank Transfer
- Payment Terms: Net 30 Days

---

## Step 1: Create Sales Order

### Action in System
1. Navigate to: `/erp/sales/orders/new`
2. Fill in customer details
3. Add order items
4. Set status to "Confirmed" or "Pending"
5. Click "Save Order"

### What Happens in Backend

**API Call:**
```http
POST /api/sales-orders
Content-Type: application/json

{
  "customer": "PT. Sejahtera Indonesia",
  "customer_email": "purchasing@sejahtera.co.id",
  "customer_phone": "+62 21 1234 5678",
  "order_date": "2025-11-26",
  "status": "Confirmed",
  "payment_status": "Unpaid",
  "payment_method": "Bank Transfer",
  "payment_terms": "Net 30",
  "subtotal": 23000000,
  "tax_amount": 2530000,
  "discount_amount": 0,
  "total_amount": 25530000,
  "notes": "Please deliver to Jakarta office"
}
```

**Response:**
```json
{
  "message": "Sales order created",
  "order": {
    "id": 30,
    "order_number": "SO-2025-001",
    "customer": "PT. Sejahtera Indonesia",
    "total_amount": 25530000,
    "status": "Confirmed",
    "payment_status": "Unpaid",
    "created_at": "2025-11-26T10:30:00Z"
  }
}
```

### Console Log Output
```
✓ Journal entry created: JE for order SO-2025-001 (Status: Confirmed)
```

---

## Step 2: Automatic Journal Entry Creation

### Journal Entry Generated

**Entry Details:**
```
Entry Number: JE000003
Entry Type: Sales Order
Entry Date: November 26, 2025
Reference Type: Sales Order
Reference ID: 30
Description: Sales order for PT. Sejahtera Indonesia
Status: Draft
Total Debit: Rp 25,530,000
Total Credit: Rp 25,530,000
```

### Journal Entry Lines

| Line | Account Code | Account Name | Description | Debit | Credit |
|------|--------------|--------------|-------------|-------|--------|
| 1 | 1300 | Accounts Receivable | Sales order for PT. Sejahtera Indonesia | Rp 25,530,000 | - |
| 2 | 4100 | Sales Revenue | Sales order for PT. Sejahtera Indonesia | - | Rp 25,530,000 |

### Database Records Created

**Table: `journal_entries`**
```sql
INSERT INTO journal_entries (
  entry_number, entry_type, entry_date, reference_type, reference_id,
  description, status, total_debit, total_credit, created_at
) VALUES (
  'JE000003', 'Sales Order', '2025-11-26', 'Sales Order', 30,
  'Sales order for PT. Sejahtera Indonesia', 'Draft', 25530000, 25530000, NOW()
);
```

**Table: `journal_entry_lines`**
```sql
-- Line 1: Debit Accounts Receivable
INSERT INTO journal_entry_lines (
  journal_entry_id, line_number, account_id, debit_amount, credit_amount, description
) VALUES (
  [entry_id], 1, [account_1300_id], 25530000, 0, 'Sales order for PT. Sejahtera Indonesia'
);

-- Line 2: Credit Sales Revenue
INSERT INTO journal_entry_lines (
  journal_entry_id, line_number, account_id, debit_amount, credit_amount, description
) VALUES (
  [entry_id], 2, [account_4100_id], 0, 25530000, 'Sales order for PT. Sejahtera Indonesia'
);
```

---

## Step 3: View in Accounting Module

### Navigate to Journal Entries
Go to: `/erp/accounting/journal-entries`

### What You'll See

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Journal Entries                                                             │
├──────────────┬─────────┬─────────────┬──────────────────────┬──────────────┤
│ Entry Number │ Type    │ Date        │ Description          │ Total Amount │
├──────────────┼─────────┼─────────────┼──────────────────────┼──────────────┤
│ JE000003     │ Sales   │ Nov 26 2025 │ Sales order for PT.  │ Rp 25.53 M   │
│              │ Order   │             │ Sejahtera Indonesia  │              │
│ [Draft]      │         │             │                      │              │
└──────────────┴─────────┴─────────────┴──────────────────────┴──────────────┘
```

### Click to View Details

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Journal Entry: JE000003                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Entry Date: November 26, 2025                                               │
│ Reference: Sales Order #SO-2025-001                                         │
│ Status: Draft                                                               │
│ Description: Sales order for PT. Sejahtera Indonesia                        │
├──────┬──────────────┬───────────────────────┬──────────────┬──────────────┤
│ Line │ Account Code │ Account Name          │ Debit        │ Credit       │
├──────┼──────────────┼───────────────────────┼──────────────┼──────────────┤
│ 1    │ 1300         │ Accounts Receivable   │ Rp 25.53 M   │ -            │
│ 2    │ 4100         │ Sales Revenue         │ -            │ Rp 25.53 M   │
├──────┴──────────────┴───────────────────────┼──────────────┼──────────────┤
│                                       TOTAL: │ Rp 25.53 M   │ Rp 25.53 M   │
└──────────────────────────────────────────────┴──────────────┴──────────────┘
```

---

## Step 4: Customer Makes Payment

### Action in System
1. Navigate to order: `/erp/sales/orders/30`
2. Click "Edit Status" button
3. Change Payment Status to "Paid"
4. Confirm Payment Method: "Bank Transfer"
5. Click "Save"

### What Happens in Backend

**API Call:**
```http
PATCH /api/sales-orders/30
Content-Type: application/json

{
  "payment_status": "Paid",
  "payment_method": "Bank Transfer"
}
```

### Second Journal Entry Generated

**Entry Details:**
```
Entry Number: JE000004
Entry Type: Payment Receipt
Entry Date: November 26, 2025
Reference Type: Sales Order
Reference ID: 30
Description: Payment received from PT. Sejahtera Indonesia
Status: Draft
Total Debit: Rp 25,530,000
Total Credit: Rp 25,530,000
```

### Journal Entry Lines

| Line | Account Code | Account Name | Description | Debit | Credit |
|------|--------------|--------------|-------------|-------|--------|
| 1 | 1210 | Bank Account | Payment for SO-2025-001 | Rp 25,530,000 | - |
| 2 | 1300 | Accounts Receivable | Payment for SO-2025-001 | - | Rp 25,530,000 |

### Console Log Output
```
✓ Payment journal entry created: SO-2025-001
```

---

## Step 5: Complete Accounting Records

### All Journal Entries for This Transaction

#### Entry 1: Sales Order (AR/Revenue)
```
Date: Nov 26, 2025
JE000003 - Sales Order

  1300 Accounts Receivable    Dr  Rp 25,530,000
  4100 Sales Revenue              Cr  Rp 25,530,000
```

#### Entry 2: Payment Receipt (Bank/AR)
```
Date: Nov 26, 2025
JE000004 - Payment Receipt

  1210 Bank Account           Dr  Rp 25,530,000
  1300 Accounts Receivable        Cr  Rp 25,530,000
```

---

## Impact on Financial Statements

### Chart of Accounts - Account Balances

**Before Transaction:**
```
1210 Bank Account              Rp 100,000,000
1300 Accounts Receivable       Rp  50,000,000
4100 Sales Revenue             Rp 200,000,000
```

**After Sales Order Created (JE000003):**
```
1210 Bank Account              Rp 100,000,000  (no change)
1300 Accounts Receivable       Rp  75,530,000  (+25,530,000)
4100 Sales Revenue             Rp 225,530,000  (+25,530,000)
```

**After Payment Received (JE000004):**
```
1210 Bank Account              Rp 125,530,000  (+25,530,000)
1300 Accounts Receivable       Rp  50,000,000  (-25,530,000, back to original)
4100 Sales Revenue             Rp 225,530,000  (no change)
```

---

## SQL Queries to Verify

### Query 1: View Journal Entries for Order
```sql
SELECT 
  je.entry_number,
  je.entry_type,
  je.entry_date,
  je.description,
  je.total_debit,
  je.total_credit,
  je.status
FROM journal_entries je
WHERE je.reference_type = 'Sales Order' 
  AND je.reference_id = 30
ORDER BY je.entry_date;
```

**Result:**
```
entry_number | entry_type        | entry_date | description                          | total_debit | total_credit | status
-------------+-------------------+------------+--------------------------------------+-------------+--------------+-------
JE000003     | Sales Order       | 2025-11-26 | Sales order for PT. Sejahtera...     | 25530000    | 25530000     | Draft
JE000004     | Payment Receipt   | 2025-11-26 | Payment received from PT. Sejahtera  | 25530000    | 25530000     | Draft
```

### Query 2: View Journal Entry Lines
```sql
SELECT 
  jel.line_number,
  coa.account_code,
  coa.account_name,
  jel.debit_amount,
  jel.credit_amount,
  jel.description
FROM journal_entry_lines jel
JOIN chart_of_accounts coa ON jel.account_id = coa.id
WHERE jel.journal_entry_id IN (
  SELECT id FROM journal_entries WHERE reference_id = 30
)
ORDER BY jel.journal_entry_id, jel.line_number;
```

**Result:**
```
line_number | account_code | account_name           | debit_amount | credit_amount | description
------------+--------------+------------------------+--------------+---------------+---------------------------
1           | 1300         | Accounts Receivable    | 25530000     | 0             | Sales order for PT...
2           | 4100         | Sales Revenue          | 0            | 25530000      | Sales order for PT...
1           | 1210         | Bank Account           | 25530000     | 0             | Payment for SO-2025-001
2           | 1300         | Accounts Receivable    | 0            | 25530000      | Payment for SO-2025-001
```

### Query 3: Check Account Balance Changes
```sql
SELECT 
  coa.account_code,
  coa.account_name,
  coa.current_balance,
  SUM(jel.debit_amount) as total_debits,
  SUM(jel.credit_amount) as total_credits
FROM chart_of_accounts coa
LEFT JOIN journal_entry_lines jel ON coa.id = jel.account_id
WHERE coa.account_code IN ('1210', '1300', '4100')
GROUP BY coa.id, coa.account_code, coa.account_name, coa.current_balance;
```

---

## Testing Instructions

### Test Case 1: Create Order and Verify Journal Entry

**Steps:**
1. Go to: http://localhost:4000/erp/sales/orders/new
2. Fill in:
   - Customer: "Test Customer ABC"
   - Order Date: Today
   - Status: "Confirmed"
   - Payment Status: "Unpaid"
3. Add an item:
   - Product: Any product
   - Quantity: 1
   - Unit Price: 1000000
4. Save order
5. Note the Order Number (e.g., SO-2025-XXX)

**Verify:**
1. Go to: http://localhost:4000/erp/accounting/journal-entries
2. Look for newest entry with "Sales Order" type
3. Click to view details
4. Verify:
   - ✅ Debit: Accounts Receivable (1300) = 1,000,000
   - ✅ Credit: Sales Revenue (4100) = 1,000,000
   - ✅ Description mentions your customer name
   - ✅ Reference shows order number

### Test Case 2: Record Payment and Verify Entry

**Steps:**
1. Go to the order you just created
2. Click "Edit Status"
3. Change Payment Status to "Paid"
4. Select Payment Method: "Bank Transfer"
5. Click "Save"

**Verify:**
1. Go to: http://localhost:4000/erp/accounting/journal-entries
2. Look for new entry with "Payment Receipt" type
3. Click to view details
4. Verify:
   - ✅ Debit: Bank Account (1210) = 1,000,000
   - ✅ Credit: Accounts Receivable (1300) = 1,000,000
   - ✅ Description mentions "Payment for SO-..."
   - ✅ Total debits = Total credits

---

## Accounting Flow Diagram

```
┌──────────────────────┐
│  Create Sales Order  │
│  Status: Confirmed   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Automatic Journal Entry (JE000003)      │
│  ────────────────────────────────────    │
│  DR: Accounts Receivable    Rp 25.53 M   │
│  CR: Sales Revenue          Rp 25.53 M   │
└──────────┬───────────────────────────────┘
           │
           │ (Customer pays)
           │
           ▼
┌──────────────────────┐
│  Update Order        │
│  Payment: Paid       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  Automatic Journal Entry (JE000004)      │
│  ────────────────────────────────────    │
│  DR: Bank Account           Rp 25.53 M   │
│  CR: Accounts Receivable    Rp 25.53 M   │
└──────────────────────────────────────────┘
```

---

## Accounting Principles Applied

### Double-Entry Bookkeeping
✅ Every transaction has equal debits and credits  
✅ Accounting equation stays balanced: Assets = Liabilities + Equity

### Accrual Accounting
✅ Revenue recognized when order is confirmed (not when cash received)  
✅ Accounts Receivable tracks amounts owed by customers

### Audit Trail
✅ Every entry linked to source document (Sales Order)  
✅ Reference numbers for easy tracking  
✅ Timestamps for all transactions

---

## Key Points

1. **Automatic Creation**: Journal entries are created automatically when you save a sales order
2. **No Manual Entry**: You don't need to manually create accounting records
3. **Real-time Integration**: Changes in sales orders immediately reflect in accounting
4. **Duplicate Prevention**: System prevents creating duplicate journal entries
5. **Draft Status**: All entries start as "Draft" and can be posted later
6. **Full Audit Trail**: Every entry is linked back to the original sales order

---

## Related Documentation

- **Main Guide**: `ACCOUNTING_INTEGRATION_FIX.md`
- **Status Update Guide**: `SALES_ORDER_STATUS_UPDATE_GUIDE.md`
- **API Documentation**: See `/api/sales-orders` endpoints

---

**Last Updated**: November 26, 2025  
**Example Status**: ✅ Working in Production
