# Accounting Integration Fix - Sales Orders

## Issue
When creating sales orders, journal entries were not being created automatically. The accounting system showed "null" or no entries.

## Root Cause
The previous implementation only created journal entries when:
- Sales order status was explicitly set to **'Confirmed'**
- Default status was **'Pending'**, so no journal entry was created

## Solution Implemented

### 1. **Changed POST `/api/sales-orders` endpoint**
- **Before**: Only created journal entries for `status === 'Confirmed'`
- **After**: Creates journal entries for **ALL** orders with `total_amount > 0`, regardless of status

```typescript
// OLD Logic (line 108)
if (status === 'Confirmed' && parseFloat(total_amount) > 0) {
  // Create journal entry
}

// NEW Logic
if (parseFloat(total_amount) > 0) {
  // Create journal entry immediately
}
```

### 2. **Enhanced PATCH `/api/sales-orders/[id]` endpoint**
- Added duplicate check before creating journal entries
- Prevents creating multiple journal entries for the same order
- Only creates journal entry if one doesn't already exist

```typescript
// Check if journal entry already exists
const existingEntry = await client.query(
  `SELECT id FROM journal_entries WHERE reference_type = 'Sales Order' AND reference_id = $1 LIMIT 1`,
  [updatedOrder.id]
)

if (existingEntry.rows.length === 0) {
  // Create journal entry
}
```

### 3. **Fixed Next.js 15 Async Params**
Updated all route handlers in `/api/sales-orders/[id]/route.ts` to use async params:

```typescript
// Before
{ params }: { params: { id: string } }
const id = params.id

// After
{ params }: { params: Promise<{ id: string }> }
const { id } = await params
```

## Accounting Entries Created

When a sales order is created with amount > 0:

### Journal Entry Type: "Sales Order"
**Entry Date**: Order date  
**Reference**: Sales Order #[order_number]  
**Description**: Sales order for [customer]

| Account | Account Name | Debit | Credit |
|---------|-------------|-------|--------|
| 1300 | Accounts Receivable | Total Amount | - |
| 4100 | Sales Revenue | - | Total Amount |

## Payment Tracking

When payment status changes to 'Paid':

### Journal Entry Type: "Payment Receipt"
**Entry Date**: Payment date  
**Reference**: Payment for #[order_number]  
**Description**: Payment received from [customer]

| Account | Account Name | Debit | Credit |
|---------|-------------|-------|--------|
| 1110 or 1210 | Cash/Bank | Total Amount | - |
| 1300 | Accounts Receivable | - | Total Amount |

## Testing Instructions

### Test 1: Create New Sales Order
1. Go to http://localhost:4000/erp/sales/orders/new
2. Fill in customer details
3. Add order items
4. Set any status (Pending, Confirmed, etc.)
5. Save order
6. **Expected Result**: Journal entry created immediately

### Test 2: Check Journal Entries
1. Go to http://localhost:4000/erp/accounting/journal-entries
2. Look for entry with reference "Sales Order #[order_number]"
3. Click to view details
4. **Expected Result**: 
   - Debit: Accounts Receivable (1300)
   - Credit: Sales Revenue (4100)
   - Total debit = Total credit

### Test 3: Payment Processing
1. Go to existing sales order
2. Change payment status to 'Paid'
3. Save changes
4. **Expected Result**: Second journal entry created for payment

### Test 4: Verify No Duplicates
1. Update the same sales order multiple times
2. Change status from Pending to Confirmed
3. **Expected Result**: Only ONE journal entry exists (no duplicates)

## Database Verification

Check journal entries in database:

```sql
-- View all sales order journal entries
SELECT 
  je.entry_number,
  je.entry_date,
  je.reference_type,
  je.description,
  je.total_debit,
  je.total_credit,
  je.status
FROM journal_entries je
WHERE reference_type = 'Sales Order'
ORDER BY created_at DESC;

-- View detailed lines for a specific entry
SELECT 
  jel.line_number,
  coa.account_code,
  coa.account_name,
  jel.debit_amount,
  jel.credit_amount,
  jel.description
FROM journal_entry_lines jel
JOIN chart_of_accounts coa ON jel.account_id = coa.id
WHERE jel.journal_entry_id = [ENTRY_ID]
ORDER BY jel.line_number;
```

## Related Files Modified

1. `/apps/v4/app/api/sales-orders/route.ts`
   - Line 108-127: Updated POST logic to create journal entries for all orders

2. `/apps/v4/app/api/sales-orders/[id]/route.ts`
   - Line 13-35: Fixed async params for GET, PATCH, DELETE
   - Line 94-135: Added duplicate check for journal entries

## Benefits

✅ **Immediate Accounting**: All sales orders tracked in accounting from creation  
✅ **No Manual Entries**: Automated double-entry bookkeeping  
✅ **Accurate Revenue**: Revenue recognized when order is created  
✅ **Cash Flow Tracking**: Payment receipts properly recorded  
✅ **No Duplicates**: Smart duplicate detection prevents errors  
✅ **Next.js 15 Compatible**: All async params properly handled

## Notes

- Journal entries are created with status 'Draft' initially
- Can be posted manually from accounting module
- Supports both Cash and Bank payment methods
- Works with any sales order status (Pending, Confirmed, Completed)
- Failed journal entry creation doesn't block order creation (logs warning only)

## Future Enhancements

- [ ] Auto-post journal entries when order is confirmed
- [ ] Create COGS entries when order is completed
- [ ] Support partial payments
- [ ] Add discount and tax line items
- [ ] Support for multiple payment methods per order

---

**Last Updated**: November 26, 2025  
**Status**: ✅ Implemented and Tested
