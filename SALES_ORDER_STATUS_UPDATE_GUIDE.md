# How to Update Sales Order Status & Payment

## Location
**Sales Order Detail Page**: `/erp/sales/orders/[id]`

Example: http://localhost:4000/erp/sales/orders/29

## Step-by-Step Guide

### 1. **Navigate to Sales Order**
- Go to **Sales** → **Orders**
- Click on any order to view details

### 2. **Click "Edit Status" Button**
The button is located in the **Order Information** card header (top-right of the card)

### 3. **Update Fields**

When in edit mode, you can update:

#### **Status** (Dropdown)
- Pending
- Confirmed *(Creates journal entry if not exists)*
- Processing
- Shipped
- Delivered
- Cancelled
- Refunded

#### **Payment Status** (Dropdown)
- Unpaid
- Partial
- Paid *(Creates payment journal entry)*
- Refunded

#### **Payment Method** (Dropdown)
- Cash
- Bank Transfer
- Credit Card
- Debit Card
- E-Wallet
- Check

### 4. **Save Changes**
Click the **"Save"** button to apply changes, or **"Cancel"** to discard.

---

## Accounting Integration Impact

### When Status Changes to "Confirmed"
**Automatic Journal Entry Created:**
```
Date: Order date
Reference: Sales Order #[order_number]
Description: Sales order for [customer]

Debit:  Accounts Receivable (1300) - Amount
Credit: Sales Revenue (4100)        - Amount
```

### When Payment Status Changes to "Paid"
**Automatic Payment Journal Entry Created:**
```
Date: Today
Reference: Payment for #[order_number]
Description: Payment received from [customer]

Debit:  Cash/Bank (1110 or 1210)      - Amount
Credit: Accounts Receivable (1300)    - Amount
```

---

## Visual Guide

### Before Edit Mode
```
┌────────────────────────────────────────────┐
│ Order Information         [Edit Status]    │
├────────────────────────────────────────────┤
│ Status:          [Pending Badge]           │
│ Payment Status:  [Unpaid Badge]            │
│ Order Date:      Nov 26, 2025              │
│ Payment Method:  Cash                      │
└────────────────────────────────────────────┘
```

### In Edit Mode
```
┌────────────────────────────────────────────┐
│ Order Information    [Cancel] [Save]       │
├────────────────────────────────────────────┤
│ Status:          [Dropdown ▼]              │
│ Payment Status:  [Dropdown ▼]              │
│ Payment Method:  [Dropdown ▼]              │
│ Order Date:      Nov 26, 2025              │
└────────────────────────────────────────────┘
```

---

## Important Notes

1. **Journal Entry Prevention**: 
   - System checks if journal entry already exists
   - Won't create duplicates even if you change status multiple times

2. **Status Flow Recommendation**:
   ```
   Pending → Confirmed → Processing → Shipped → Delivered
   ```

3. **Payment Flow Recommendation**:
   ```
   Unpaid → Partial (optional) → Paid
   ```

4. **Accounting Records**:
   - View all journal entries at: `/erp/accounting/journal-entries`
   - Each entry shows order reference for easy tracking

5. **Success Confirmation**:
   - Alert message appears after successful update
   - Page automatically refreshes with new data

---

## Testing the Feature

### Test 1: Change Status to Confirmed
1. Open any order with status "Pending"
2. Click "Edit Status"
3. Change Status to "Confirmed"
4. Click "Save"
5. ✅ Check journal entries - should see new AR/Revenue entry

### Test 2: Mark Order as Paid
1. Open any confirmed order
2. Click "Edit Status"
3. Change Payment Status to "Paid"
4. Select Payment Method (e.g., "Cash")
5. Click "Save"
6. ✅ Check journal entries - should see new Cash/AR entry

### Test 3: Verify No Duplicates
1. Edit the same order again
2. Change status back and forth
3. ✅ Check journal entries - should only have one entry per event

---

## Troubleshooting

### Issue: "Edit Status" button not visible
**Solution**: Refresh the page or clear browser cache

### Issue: Changes not saving
**Solution**: 
- Check console for errors
- Verify database connection
- Ensure valid values selected in dropdowns

### Issue: Journal entry not created
**Solution**:
- Verify order has total_amount > 0
- Check `/api/sales-orders/[id]` API logs
- Look for console messages starting with "✓ Journal entry created"

---

## API Endpoint

**PATCH** `/api/sales-orders/[id]`

**Request Body:**
```json
{
  "status": "Confirmed",
  "payment_status": "Paid",
  "payment_method": "Cash"
}
```

**Response:**
```json
{
  "message": "Sales order updated",
  "order": { /* updated order object */ }
}
```

---

**Last Updated**: November 26, 2025  
**Feature Status**: ✅ Active and Working
