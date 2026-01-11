# Ocean ERP - Point of Sale (POS) URL Guide

## Main POS Application

### **Primary POS Checkout**
- **URL**: `http://localhost:4000/erp/pos/checkout`
- **File**: `apps/v4/app/(erp)/erp/pos/checkout/page.tsx`
- **Description**: Main POS checkout interface with cart, product search, and payment processing

## Related POS Pages

### **POS Dashboard** (Alternative Location)
- **URL**: `http://localhost:4000/erp/pos/dashboard`
- **File**: `apps/v4/app/(app)/erp/pos/dashboard/page.tsx`
- **Features**: Overview, quick access to sessions and checkout

### **POS Sessions Management**
- **URL**: `http://localhost:4000/erp/pos/sessions`
- **File**: `apps/v4/app/(app)/erp/pos/sessions/page.tsx`
- **Features**: Open/close cash register sessions, view session history

### **Enhanced Checkout**
- **URL**: `http://localhost:4000/erp/pos/checkout-enhanced`
- **File**: `apps/v4/app/(app)/erp/pos/checkout-enhanced/page.tsx`
- **Features**: Advanced POS features with enhanced UI

### **Customer Display**
- **URL**: `http://localhost:4000/erp/pos/customer-display`
- **File**: `apps/v4/app/(app)/erp/pos/customer-display/page.tsx`
- **Features**: External display for customers to see their purchase

## POS API Endpoints

### Session Management
- `GET /api/pos/sessions/current` - Get current active session
- `POST /api/pos/sessions` - Create new session
- `PATCH /api/pos/sessions/:id` - Update session
- `POST /api/pos/sessions/:id/close` - Close session

### Product Search
- `GET /api/pos/products/search?q={query}&limit={n}&include_batches={true|false}`
- Returns products with SKU, name, price, stock availability

### Customer Management
- `GET /api/pos/customers/quick?q={query}&limit={n}`
- Quick customer search for POS transactions

### Transactions
- `POST /api/pos/transactions` - Create new POS transaction
- `GET /api/pos/transactions` - List transactions
- `GET /api/pos/transactions/:id` - Get transaction details

## POS Components

### Reusable Components
- **Multi-Payment Split**: `components/pos/multi-payment-split-enhanced.tsx`
- **Thermal Receipt**: `components/pos/thermal-receipt-enhanced.tsx`
- **Hold/Retrieve Transaction**: `components/pos/hold-retrieve-transaction.tsx`

## Quick Access

For quick access to POS, navigate to:
```
http://localhost:4000/erp/pos/checkout
```

Or from the main dashboard:
```
Dashboard → Sales Management → Point of Sale
```

## Features Available in POS

✅ Product search and barcode scanning
✅ Cart management (add, remove, update quantities)
✅ Customer selection
✅ Multiple payment methods
✅ Payment split (partial payments)
✅ Discount application
✅ Tax calculation (11% PPN Indonesia)
✅ Receipt printing (thermal printer compatible)
✅ Transaction hold/retrieve
✅ Session management
✅ Cash drawer tracking

## Currency Format

All prices displayed in **Indonesian Rupiah (Rp)**
- Format: `Rp 150,000`
- Tax: 11% PPN (Value Added Tax)

## Session Workflow

1. **Open Session** - Start with opening amount
2. **Process Sales** - Multiple transactions
3. **Close Session** - Count cash, reconcile, close out
4. **View Reports** - Session summary and transaction history

---

Last Updated: December 9, 2025
