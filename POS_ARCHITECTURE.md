# 🏪 Ocean ERP - Point of Sales (POS) System Architecture

**Version:** 1.0  
**Date:** November 12, 2025  
**Status:** Architecture Design Phase

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current System Analysis](#current-system-analysis)
3. [POS Architecture Overview](#pos-architecture-overview)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [UI/UX Design](#uiux-design)
7. [Integration Points](#integration-points)
8. [Security & Compliance](#security--compliance)
9. [Performance & Scalability](#performance--scalability)
10. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Executive Summary

### 🎯 Objective
Build a **fully-integrated Point of Sales (POS) system** within Ocean ERP that provides:
- Fast, touch-friendly checkout interface
- Real-time inventory management
- Multi-location support (retail stores, warehouses)
- Cash drawer and shift management
- Seamless integration with existing ERP modules

### 💡 Key Benefits
- ✅ **Unified Data** - Single source of truth for products, inventory, and customers
- ✅ **Real-time Sync** - POS sales instantly update inventory and accounting
- ✅ **Multi-channel** - Track online and retail sales together
- ✅ **Cost Effective** - No need for separate POS software
- ✅ **Scalable** - Support multiple retail locations from one system

---

## 2. Current System Analysis

### ✅ Existing Infrastructure (Ready to Use)

#### **Products Module** ✅
```
✓ products table with SKU, pricing, images
✓ categories table for product organization
✓ Product search and filtering APIs
✓ Barcode support ready (SKU field)
✓ Product UI pages built
```

#### **Inventory Module** ✅
```
✓ inventory table with multi-warehouse support
✓ stock_movements table for audit trail
✓ Real-time stock level tracking
✓ Automatic quantity calculations
✓ Low stock alerts
```

#### **Customers Module** ✅
```
✓ customers table with full contact info
✓ Customer types (Business/Individual)
✓ Payment terms and credit limits
✓ Customer API endpoints
```

#### **Sales Module** ✅
```
✓ sales_orders table
✓ sales_order_items table
✓ Order status workflow
✓ Sales order API
```

#### **Accounting Module** ✅
```
✓ invoices table
✓ invoice_items table
✓ payments table with multiple methods
✓ Payment tracking (cash, card, bank transfer)
```

#### **Warehouses** ✅
```
✓ warehouses table with locations
✓ Multi-warehouse inventory tracking
✓ Stock transfers between warehouses
```

### 🔧 What Needs to Be Built

1. **POS Sessions** - Cash drawer management
2. **POS Terminals** - Register/device tracking
3. **POS Transactions** - Fast checkout records
4. **POS Payments** - Split payments, cash management
5. **POS UI** - Touch-friendly checkout interface
6. **Receipt System** - Print/email receipts
7. **POS Reports** - Daily sales, cash reconciliation

---

## 3. POS Architecture Overview

### 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Ocean ERP System                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Products   │  │  Inventory   │  │  Customers   │     │
│  │   Module     │  │   Module     │  │   Module     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                       │
│                   │   POS Module    │ ◄── NEW              │
│                   │   (Core Layer)  │                       │
│                   └────────┬────────┘                       │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐     │
│  │ POS Sessions │  │POS Terminals │  │ POS Receipts │     │
│  │  & Shifts    │  │  & Devices   │  │  & Printing  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐     │
│  │Sales Orders  │  │   Invoices   │  │   Payments   │     │
│  │  (Auto)      │  │   (Auto)     │  │   (Auto)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Transaction Flow

```
Customer Checkout Process:
┌─────────────────────────────────────────────────────────┐
│ 1. Cashier Opens POS Session                            │
│    └─> pos_sessions.status = 'open'                    │
│    └─> Records opening_cash amount                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Add Products to Cart (Scan/Search)                   │
│    └─> Real-time product lookup                        │
│    └─> Check inventory availability                    │
│    └─> Calculate totals (subtotal, tax, discounts)    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Customer Selection (Optional)                        │
│    └─> Search existing customer                        │
│    └─> Quick create walk-in customer                   │
│    └─> Apply loyalty discounts                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Process Payment                                       │
│    └─> Select payment method (cash/card/split)         │
│    └─> Record tender amount & change                   │
│    └─> Create payment record                           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Create Transaction Records (Atomic)                  │
│    ├─> sales_orders (order details)                    │
│    ├─> sales_order_items (line items)                  │
│    ├─> invoices (invoice for order)                    │
│    ├─> invoice_items (invoice line items)              │
│    ├─> payments (payment record)                       │
│    ├─> pos_transactions (POS-specific data)            │
│    └─> stock_movements (inventory deduction)           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Generate Receipt                                      │
│    └─> Print thermal receipt                           │
│    └─> Email receipt (if customer provided email)      │
│    └─> SMS receipt (optional)                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Close POS Session (End of Shift)                     │
│    └─> Count cash drawer                               │
│    └─> Reconcile expected vs actual cash               │
│    └─> Generate shift report                           │
│    └─> pos_sessions.status = 'closed'                  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Database Design

### 🗄️ New Tables Required

#### **1. POS Terminals**
Tracks physical or virtual POS devices/registers.

```sql
CREATE TABLE pos_terminals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    terminal_code VARCHAR(50) UNIQUE NOT NULL,
    terminal_name VARCHAR(255) NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    device_type VARCHAR(50) DEFAULT 'standard', -- standard, mobile, kiosk, self_checkout
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, maintenance
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    last_online_at TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}', -- printer config, display settings, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_terminals_warehouse ON pos_terminals(warehouse_id);
CREATE INDEX idx_pos_terminals_status ON pos_terminals(status);
```

#### **2. POS Sessions**
Manages cash drawer sessions and shift tracking.

```sql
CREATE TABLE pos_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_number VARCHAR(50) UNIQUE NOT NULL,
    terminal_id UUID NOT NULL REFERENCES pos_terminals(id),
    user_id UUID NOT NULL REFERENCES users(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    
    -- Cash Management
    opening_cash DECIMAL(15,2) NOT NULL DEFAULT 0,
    closing_cash DECIMAL(15,2),
    expected_cash DECIMAL(15,2),
    cash_difference DECIMAL(15,2),
    
    -- Session Totals
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    total_refunds DECIMAL(15,2) DEFAULT 0,
    total_discounts DECIMAL(15,2) DEFAULT 0,
    
    -- Payment Method Breakdown
    cash_sales DECIMAL(15,2) DEFAULT 0,
    card_sales DECIMAL(15,2) DEFAULT 0,
    other_sales DECIMAL(15,2) DEFAULT 0,
    
    status VARCHAR(20) DEFAULT 'open', -- open, closed, suspended
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_sessions_terminal ON pos_sessions(terminal_id);
CREATE INDEX idx_pos_sessions_user ON pos_sessions(user_id);
CREATE INDEX idx_pos_sessions_status ON pos_sessions(status);
CREATE INDEX idx_pos_sessions_opened_at ON pos_sessions(opened_at);
```

#### **3. POS Transactions**
POS-specific transaction data (extends sales_orders).

```sql
CREATE TABLE pos_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Links to core ERP tables
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    customer_id UUID REFERENCES customers(id),
    
    -- POS Context
    pos_session_id UUID NOT NULL REFERENCES pos_sessions(id),
    terminal_id UUID NOT NULL REFERENCES pos_terminals(id),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    cashier_id UUID NOT NULL REFERENCES users(id),
    
    -- Transaction Details
    transaction_type VARCHAR(20) NOT NULL, -- sale, return, exchange, void
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Amounts
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Payment Details
    payment_method VARCHAR(50) NOT NULL, -- cash, credit_card, debit_card, mobile_payment, split
    tender_amount DECIMAL(15,2),
    change_amount DECIMAL(15,2),
    
    -- Additional Data
    customer_display_name VARCHAR(255), -- For walk-in customers
    items_count INTEGER DEFAULT 0,
    receipt_number VARCHAR(50),
    receipt_printed BOOLEAN DEFAULT false,
    receipt_emailed BOOLEAN DEFAULT false,
    
    status VARCHAR(20) DEFAULT 'completed', -- pending, completed, voided, refunded
    notes TEXT,
    metadata JSONB DEFAULT '{}', -- Flexible storage for custom data
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_transactions_session ON pos_transactions(pos_session_id);
CREATE INDEX idx_pos_transactions_terminal ON pos_transactions(terminal_id);
CREATE INDEX idx_pos_transactions_customer ON pos_transactions(customer_id);
CREATE INDEX idx_pos_transactions_cashier ON pos_transactions(cashier_id);
CREATE INDEX idx_pos_transactions_date ON pos_transactions(transaction_date);
CREATE INDEX idx_pos_transactions_status ON pos_transactions(status);
CREATE INDEX idx_pos_transactions_type ON pos_transactions(transaction_type);
```

#### **4. POS Payments**
Detailed payment information for split payments.

```sql
CREATE TABLE pos_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id), -- Link to core payments table
    
    payment_method VARCHAR(50) NOT NULL, -- cash, credit_card, debit_card, mobile_payment, gift_card
    amount DECIMAL(15,2) NOT NULL,
    
    -- Card Payment Details (if applicable)
    card_type VARCHAR(50), -- visa, mastercard, amex, etc.
    card_last_four VARCHAR(4),
    card_holder_name VARCHAR(255),
    authorization_code VARCHAR(100),
    transaction_id VARCHAR(100),
    
    -- Cash Payment Details
    tender_amount DECIMAL(15,2),
    change_amount DECIMAL(15,2),
    
    status VARCHAR(20) DEFAULT 'approved', -- pending, approved, declined, refunded
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_payments_transaction ON pos_payments(pos_transaction_id);
CREATE INDEX idx_pos_payments_method ON pos_payments(payment_method);
```

#### **5. POS Receipts**
Receipt generation and tracking.

```sql
CREATE TABLE pos_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    pos_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
    
    receipt_type VARCHAR(20) NOT NULL, -- sale, return, exchange, reprint
    
    -- Delivery Methods
    printed BOOLEAN DEFAULT false,
    printed_at TIMESTAMP WITH TIME ZONE,
    emailed BOOLEAN DEFAULT false,
    emailed_to VARCHAR(255),
    emailed_at TIMESTAMP WITH TIME ZONE,
    sms_sent BOOLEAN DEFAULT false,
    sms_to VARCHAR(20),
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Receipt Data
    receipt_data JSONB NOT NULL, -- Complete receipt content for reprinting
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_receipts_transaction ON pos_receipts(pos_transaction_id);
CREATE INDEX idx_pos_receipts_number ON pos_receipts(receipt_number);
```

#### **6. POS Cash Movements**
Track cash in/out during session (beyond sales).

```sql
CREATE TABLE pos_cash_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pos_session_id UUID NOT NULL REFERENCES pos_sessions(id),
    
    movement_type VARCHAR(20) NOT NULL, -- cash_in, cash_out, opening_float, payout
    amount DECIMAL(15,2) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    
    performed_by UUID NOT NULL REFERENCES users(id),
    authorized_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pos_cash_movements_session ON pos_cash_movements(pos_session_id);
CREATE INDEX idx_pos_cash_movements_type ON pos_cash_movements(movement_type);
```

---

### 🔗 Database Relationships

```
pos_terminals (1) ──────< (N) pos_sessions
pos_sessions (1) ───────< (N) pos_transactions
pos_sessions (1) ───────< (N) pos_cash_movements
pos_transactions (1) ───< (N) pos_payments
pos_transactions (1) ───< (1) pos_receipts

pos_transactions (N) ───> (1) sales_orders
pos_transactions (N) ───> (1) invoices
pos_transactions (N) ───> (1) customers
pos_transactions (N) ───> (1) warehouses
pos_transactions (N) ───> (1) users (cashier)

sales_orders (1) ───────< (N) sales_order_items
sales_order_items (N) ──> (1) products
invoices (1) ───────────< (N) invoice_items
```

---

### 📊 Database Views

#### **POS Session Summary View**
```sql
CREATE VIEW pos_session_summary AS
SELECT 
    s.id,
    s.session_number,
    s.terminal_id,
    t.terminal_name,
    s.user_id,
    u.name as cashier_name,
    s.warehouse_id,
    w.name as warehouse_name,
    s.opening_cash,
    s.closing_cash,
    s.expected_cash,
    s.cash_difference,
    s.total_sales,
    s.total_transactions,
    s.total_refunds,
    s.total_discounts,
    s.cash_sales,
    s.card_sales,
    s.other_sales,
    s.status,
    s.opened_at,
    s.closed_at,
    EXTRACT(EPOCH FROM (COALESCE(s.closed_at, NOW()) - s.opened_at))/3600 as hours_open
FROM pos_sessions s
JOIN pos_terminals t ON s.terminal_id = t.id
JOIN users u ON s.user_id = u.id
JOIN warehouses w ON s.warehouse_id = w.id;
```

#### **POS Sales Summary View**
```sql
CREATE VIEW pos_sales_summary AS
SELECT 
    DATE(pt.transaction_date) as sale_date,
    pt.warehouse_id,
    w.name as warehouse_name,
    pt.terminal_id,
    t.terminal_name,
    COUNT(DISTINCT pt.id) as total_transactions,
    SUM(pt.items_count) as total_items_sold,
    SUM(pt.subtotal) as total_subtotal,
    SUM(pt.tax_amount) as total_tax,
    SUM(pt.discount_amount) as total_discounts,
    SUM(pt.total_amount) as total_sales,
    SUM(CASE WHEN pt.payment_method = 'cash' THEN pt.total_amount ELSE 0 END) as cash_sales,
    SUM(CASE WHEN pt.payment_method IN ('credit_card', 'debit_card') THEN pt.total_amount ELSE 0 END) as card_sales,
    AVG(pt.total_amount) as average_transaction_value
FROM pos_transactions pt
JOIN pos_terminals t ON pt.terminal_id = t.id
JOIN warehouses w ON pt.warehouse_id = w.id
WHERE pt.status = 'completed'
GROUP BY DATE(pt.transaction_date), pt.warehouse_id, w.name, pt.terminal_id, t.terminal_name;
```

---

## 5. API Design

### 🔌 API Endpoints Structure

```
/api/pos/
├── terminals/
│   ├── GET    /api/pos/terminals              # List all terminals
│   ├── POST   /api/pos/terminals              # Create terminal
│   ├── GET    /api/pos/terminals/:id          # Get terminal details
│   ├── PATCH  /api/pos/terminals/:id          # Update terminal
│   └── DELETE /api/pos/terminals/:id          # Delete terminal
│
├── sessions/
│   ├── GET    /api/pos/sessions               # List sessions (with filters)
│   ├── POST   /api/pos/sessions/open          # Open new session
│   ├── POST   /api/pos/sessions/:id/close     # Close session
│   ├── GET    /api/pos/sessions/:id           # Get session details
│   ├── GET    /api/pos/sessions/:id/summary   # Get session summary
│   └── GET    /api/pos/sessions/current       # Get current open session
│
├── transactions/
│   ├── GET    /api/pos/transactions           # List transactions
│   ├── POST   /api/pos/transactions           # Create transaction (checkout)
│   ├── GET    /api/pos/transactions/:id       # Get transaction details
│   ├── POST   /api/pos/transactions/:id/void  # Void transaction
│   ├── POST   /api/pos/transactions/:id/refund # Process refund
│   └── POST   /api/pos/transactions/:id/print # Reprint receipt
│
├── products/
│   ├── GET    /api/pos/products/search        # Fast product search
│   ├── GET    /api/pos/products/barcode/:code # Lookup by barcode
│   └── GET    /api/pos/products/:id/stock     # Check stock at current location
│
├── customers/
│   ├── GET    /api/pos/customers/search       # Quick customer lookup
│   ├── POST   /api/pos/customers/quick        # Quick customer creation
│   └── GET    /api/pos/customers/:id/history  # Purchase history
│
├── cash/
│   ├── POST   /api/pos/cash/in                # Record cash in
│   ├── POST   /api/pos/cash/out               # Record cash out
│   └── GET    /api/pos/cash/movements         # List movements
│
└── reports/
    ├── GET    /api/pos/reports/daily          # Daily sales report
    ├── GET    /api/pos/reports/session/:id    # Session report
    ├── GET    /api/pos/reports/cashier        # Cashier performance
    └── GET    /api/pos/reports/products       # Product sales report
```

### 📝 API Request/Response Examples

#### **1. Open POS Session**
```typescript
POST /api/pos/sessions/open

Request:
{
  "terminal_id": "uuid-terminal-1",
  "opening_cash": 500.00,
  "notes": "Morning shift"
}

Response:
{
  "session": {
    "id": "uuid-session-1",
    "session_number": "POS-2025-11-12-001",
    "terminal_id": "uuid-terminal-1",
    "terminal_name": "Register 1",
    "user_id": "uuid-user-1",
    "cashier_name": "John Doe",
    "warehouse_id": "uuid-warehouse-1",
    "warehouse_name": "Main Store",
    "opening_cash": 500.00,
    "status": "open",
    "opened_at": "2025-11-12T08:00:00Z"
  }
}
```

#### **2. Create Transaction (Checkout)**
```typescript
POST /api/pos/transactions

Request:
{
  "session_id": "uuid-session-1",
  "customer_id": "uuid-customer-1", // Optional, null for walk-in
  "customer_display_name": "Walk-in Customer", // For walk-ins
  "items": [
    {
      "product_id": "uuid-product-1",
      "quantity": 2,
      "unit_price": 29.99
    },
    {
      "product_id": "uuid-product-2",
      "quantity": 1,
      "unit_price": 49.99
    }
  ],
  "payment": {
    "method": "cash",
    "tender_amount": 150.00
  },
  "tax_rate": 0.08,
  "discount_amount": 0,
  "notes": ""
}

Response:
{
  "transaction": {
    "id": "uuid-transaction-1",
    "transaction_number": "TXN-2025-11-12-0001",
    "sales_order_id": "uuid-order-1",
    "invoice_id": "uuid-invoice-1",
    "receipt_number": "RCP-2025-11-12-0001",
    "subtotal": 109.97,
    "tax_amount": 8.80,
    "total_amount": 118.77,
    "payment_method": "cash",
    "tender_amount": 150.00,
    "change_amount": 31.23,
    "status": "completed",
    "transaction_date": "2025-11-12T10:30:00Z"
  },
  "receipt": {
    "receipt_number": "RCP-2025-11-12-0001",
    "print_ready": true,
    "receipt_url": "/api/pos/receipts/uuid-receipt-1/pdf"
  }
}
```

#### **3. Close POS Session**
```typescript
POST /api/pos/sessions/:id/close

Request:
{
  "closing_cash": 1850.75,
  "notes": "End of shift, all sales processed"
}

Response:
{
  "session": {
    "id": "uuid-session-1",
    "session_number": "POS-2025-11-12-001",
    "status": "closed",
    "opened_at": "2025-11-12T08:00:00Z",
    "closed_at": "2025-11-12T17:00:00Z",
    "opening_cash": 500.00,
    "closing_cash": 1850.75,
    "expected_cash": 1860.50,
    "cash_difference": -9.75,
    "total_sales": 2350.50,
    "total_transactions": 47,
    "cash_sales": 1360.50,
    "card_sales": 990.00,
    "hours_open": 9.0
  },
  "variance_report": {
    "is_balanced": false,
    "variance_amount": -9.75,
    "requires_review": true
  }
}
```

---

## 6. UI/UX Design

### 🎨 User Interface Pages

```
POS Module Structure:
/erp/pos/
├── dashboard           # POS Overview & Session Status
├── checkout            # Main POS Checkout Interface ⭐ MAIN SCREEN
├── sessions/
│   ├── current         # Current session details
│   ├── history         # Past sessions
│   └── open            # Open new session
├── transactions/
│   ├── list            # Transaction history
│   ├── [id]            # Transaction details
│   └── returns         # Returns/refunds processing
├── terminals/
│   ├── list            # Manage terminals
│   └── configure       # Terminal settings
└── reports/
    ├── daily           # Daily sales report
    ├── cashier         # Cashier performance
    └── products        # Product sales analysis
```

### 🖥️ Main POS Checkout Interface (Wireframe)

```
┌──────────────────────────────────────────────────────────────────┐
│  Ocean ERP POS                    Register 1    │    Session: #001│
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐  │
│  │   Product Search / Scan     │  │     Customer Info        │  │
│  │  ┌────────────────────────┐ │  │  Walk-in Customer   [🔍] │  │
│  │  │ [Barcode/Name/SKU]  🔍 │ │  │                          │  │
│  │  └────────────────────────┘ │  │  Phone: _______________  │  │
│  │                              │  │  Email: _______________  │  │
│  │  Quick Access Categories:    │  │                          │  │
│  │  [Electronics] [Clothing]    │  │  [Clear]  [New Customer] │  │
│  │  [Food] [Books] [Home]       │  └──────────────────────────┘  │
│  └─────────────────────────────┘                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                  Shopping Cart                               ││
│  ├──────┬────────────────────┬─────┬──────────┬───────────────┤│
│  │ QTY  │ Product            │ SKU │ Price    │ Total         ││
│  ├──────┼────────────────────┼─────┼──────────┼───────────────┤│
│  │  2   │ USB Cable 6ft      │U001 │ $9.99    │ $19.98    [×] ││
│  │  1   │ Wireless Mouse     │M205 │ $29.99   │ $29.99    [×] ││
│  │  3   │ AA Batteries (4pk) │B104 │ $4.99    │ $14.97    [×] ││
│  │      │                    │     │          │               ││
│  │      │                    │     │          │               ││
│  └──────┴────────────────────┴─────┴──────────┴───────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Subtotal:                                        $64.94    ││
│  │  Tax (8%):                                        $5.20     ││
│  │  Discount:                          [Apply] [-]   $0.00     ││
│  │  ────────────────────────────────────────────────────────  ││
│  │  TOTAL:                                          $70.14     ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐│
│  │  [CASH]  │ │  [CARD]  │ │ [SPLIT]  │ │  [HOLD] [CLEAR CART] ││
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘│
│                                                                   │
│  Cashier: John Doe     │  Shift: 9h 30m   │  Sales: 47 / $2,340 │
└──────────────────────────────────────────────────────────────────┘
```

### 🔲 Key UI Features

#### **1. Touch-Friendly Design**
- Large buttons (min 48px height)
- Clear touch targets
- Swipe gestures for cart management
- Numeric keypad for quantities
- Quick access product grid

#### **2. Speed Optimizations**
- Barcode scanner integration
- Keyboard shortcuts (F-keys for common actions)
- Recent products quick access
- Search-as-you-type with instant results
- One-click favorites

#### **3. Visual Feedback**
- Real-time total calculations
- Stock availability indicators
- Success/error notifications
- Transaction progress indicators
- Receipt print status

#### **4. Payment Modal**
```
┌──────────────────────────────────────┐
│     Process Payment                  │
├──────────────────────────────────────┤
│                                      │
│  Total Amount:          $70.14       │
│                                      │
│  Payment Method:                     │
│  ┌──────────┐ ┌──────────┐         │
│  │  💵 Cash │ │ 💳 Card  │         │
│  └──────────┘ └──────────┘         │
│                                      │
│  ┌──────────┐ ┌──────────┐         │
│  │  📱 Mobile│ │ ⚡ Split │         │
│  └──────────┘ └──────────┘         │
│                                      │
│  ────────────────────────────────   │
│                                      │
│  For Cash Payment:                   │
│  Tender Amount: [___________]        │
│                                      │
│  Quick Amounts:                      │
│  [$50] [$100] [$150] [$200]         │
│                                      │
│  Change Due:           $29.86        │
│                                      │
│  ┌────────────┐  ┌───────────────┐  │
│  │   Cancel   │  │ Complete Sale │  │
│  └────────────┘  └───────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

---

## 7. Integration Points

### 🔗 Module Integrations

#### **1. Products Module**
```typescript
Integration Points:
✓ Real-time product search
✓ Product pricing and images
✓ SKU/barcode lookup
✓ Category browsing
✓ Product availability check

Data Flow:
POS → products table (READ)
```

#### **2. Inventory Module**
```typescript
Integration Points:
✓ Stock level checking before sale
✓ Automatic inventory deduction
✓ Stock movement recording
✓ Multi-warehouse stock lookup
✓ Low stock alerts

Data Flow:
POS → inventory table (READ/UPDATE)
POS → stock_movements table (INSERT)

Transaction Example:
BEGIN;
  -- Deduct inventory
  UPDATE inventory 
  SET quantity_on_hand = quantity_on_hand - 2
  WHERE product_id = 'uuid-prod' 
    AND warehouse_id = 'uuid-wh';
  
  -- Record movement
  INSERT INTO stock_movements (
    product_id, warehouse_id, movement_type, 
    quantity, reference_number
  ) VALUES (
    'uuid-prod', 'uuid-wh', 'Sale', 
    -2, 'TXN-2025-11-12-0001'
  );
COMMIT;
```

#### **3. Sales Module**
```typescript
Integration Points:
✓ Create sales_order for each transaction
✓ Create sales_order_items for line items
✓ Order status = 'completed' immediately
✓ Link to customer (if provided)

Data Flow:
POS → sales_orders table (INSERT)
POS → sales_order_items table (INSERT)
```

#### **4. Accounting Module**
```typescript
Integration Points:
✓ Auto-create invoice for each sale
✓ Invoice status = 'paid' immediately
✓ Create payment record
✓ Journal entries (future enhancement)

Data Flow:
POS → invoices table (INSERT)
POS → invoice_items table (INSERT)
POS → payments table (INSERT)
```

#### **5. Customer Module**
```typescript
Integration Points:
✓ Quick customer lookup
✓ Walk-in customer handling
✓ Customer purchase history
✓ Loyalty points (future)

Data Flow:
POS → customers table (READ/INSERT)
```

---

### 🔄 Synchronization Strategy

#### **Real-time Updates**
```typescript
// WebSocket or polling for live updates
interface POSUpdate {
  type: 'inventory' | 'price' | 'product' | 'session';
  action: 'update' | 'delete' | 'create';
  data: any;
}

// When inventory changes elsewhere, notify POS
onInventoryChange((change) => {
  broadcastToPOSTerminals({
    type: 'inventory',
    action: 'update',
    data: {
      product_id: change.product_id,
      new_quantity: change.quantity_available
    }
  });
});
```

---

## 8. Security & Compliance

### 🔒 Security Measures

#### **1. Session Security**
```typescript
✓ Sessions tied to specific user + terminal
✓ Auto-logout after inactivity (configurable)
✓ Session suspension for breaks
✓ Supervisor override for sensitive actions
✓ Audit log for all POS actions
```

#### **2. Payment Security**
```typescript
✓ PCI DSS compliance for card payments
✓ No card numbers stored (tokenization)
✓ Secure payment gateway integration
✓ Transaction encryption
✓ Receipt masking of sensitive data
```

#### **3. Access Control**
```typescript
Permissions Required:
- pos.access            # Basic POS access
- pos.session.open      # Open session
- pos.session.close     # Close session
- pos.transaction.void  # Void transactions
- pos.refund.process    # Process refunds
- pos.discount.apply    # Apply discounts
- pos.cash.manage       # Cash in/out
- pos.reports.view      # View reports
- pos.terminal.configure # Configure terminals
```

#### **4. Audit Trail**
```sql
-- All POS actions logged
CREATE TABLE pos_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    terminal_id UUID REFERENCES pos_terminals(id),
    session_id UUID REFERENCES pos_sessions(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Performance & Scalability

### ⚡ Performance Optimizations

#### **1. Database Indexing**
```sql
-- Already defined in schema
✓ Indexed all foreign keys
✓ Indexed status columns
✓ Indexed date columns for reports
✓ Composite indexes for common queries
```

#### **2. Caching Strategy**
```typescript
// Redis caching for frequently accessed data
Cache Layers:
1. Product catalog (15 min TTL)
2. Customer quick lookup (5 min TTL)
3. Session data (in-memory during session)
4. Price lists (30 min TTL)
5. Terminal configuration (1 hour TTL)
```

#### **3. Query Optimization**
```sql
-- Use materialized views for reports
CREATE MATERIALIZED VIEW pos_daily_summary AS
SELECT 
    DATE(transaction_date) as sale_date,
    warehouse_id,
    COUNT(*) as transaction_count,
    SUM(total_amount) as total_sales
FROM pos_transactions
WHERE status = 'completed'
GROUP BY DATE(transaction_date), warehouse_id;

-- Refresh every hour
CREATE INDEX idx_pos_daily_summary_date ON pos_daily_summary(sale_date);
```

#### **4. Offline Support**
```typescript
// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  // Cache POS interface
  // Store transactions locally when offline
  // Sync when connection restored
}

Offline Capabilities:
✓ View cached product catalog
✓ Process sales (queued)
✓ Print receipts
✓ Auto-sync when online
```

---

### 📈 Scalability Considerations

```
Capacity Planning:
┌─────────────────────────────────────────────┐
│ Single Terminal:                            │
│ - 100+ transactions/hour                    │
│ - 1000+ products searchable                 │
│ - <2s transaction completion                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Multi-Terminal Support:                     │
│ - 50+ concurrent terminals                  │
│ - 10+ warehouse locations                   │
│ - 100,000+ transactions/day                 │
│ - Real-time inventory sync                  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Database Partitioning:                      │
│ - Partition transactions by month           │
│ - Archive old sessions quarterly            │
│ - Separate read replicas for reports        │
└─────────────────────────────────────────────┘
```

---

## 10. Implementation Roadmap

### 🗓️ Phase-by-Phase Development

#### **Phase 1: Foundation (Week 1-2)** 🏗️
```
□ Create database migration (all 6 new tables)
□ Create database views and indexes
□ Set up base API structure
□ Implement terminal management API
□ Implement session management API
□ Create POS sidebar navigation
□ Build POS dashboard page

Deliverables:
✓ Database schema complete
✓ Basic API endpoints working
✓ Navigation structure in place
```

#### **Phase 2: Core POS (Week 3-4)** 🎯
```
□ Build main checkout interface
□ Implement product search/lookup
□ Create shopping cart functionality
□ Build payment processing
□ Create transaction API
□ Implement inventory deduction
□ Create sales order integration
□ Build receipt generation

Deliverables:
✓ Functional POS checkout
✓ Complete transaction flow
✓ Receipt printing ready
```

#### **Phase 3: Session Management (Week 5)** 💰
```
□ Open/close session UI
□ Cash drawer management
□ Cash in/out functionality
□ Session reconciliation
□ Shift reports
□ Session history view

Deliverables:
✓ Complete session workflow
✓ Cash management tools
✓ End-of-day reports
```

#### **Phase 4: Customer Features (Week 6)** 👥
```
□ Customer search integration
□ Quick customer creation
□ Purchase history display
□ Customer analytics
□ Walk-in customer handling

Deliverables:
✓ Customer integration complete
✓ Fast customer lookup
✓ Purchase tracking
```

#### **Phase 5: Advanced Features (Week 7-8)** ⚡
```
□ Split payment support
□ Returns/refunds processing
□ Void transactions
□ Discount management
□ Product favorites
□ Barcode scanner integration
□ Receipt email/SMS
□ Keyboard shortcuts

Deliverables:
✓ Advanced payment options
✓ Returns workflow
✓ Enhanced UX features
```

#### **Phase 6: Reports & Analytics (Week 9)** 📊
```
□ Daily sales report
□ Session report
□ Cashier performance report
□ Product sales analysis
□ Payment method breakdown
□ Hourly sales trends
□ Export functionality

Deliverables:
✓ Comprehensive reporting
✓ Analytics dashboard
✓ Export capabilities
```

#### **Phase 7: Polish & Testing (Week 10)** 🎨
```
□ UI/UX refinements
□ Performance optimization
□ Mobile responsiveness
□ Error handling improvements
□ User training documentation
□ API documentation
□ Integration testing
□ Load testing

Deliverables:
✓ Production-ready POS
✓ Complete documentation
✓ Tested and optimized
```

---

### 📋 Success Criteria

```
✅ Functional Requirements Met:
□ Complete transaction in <30 seconds
□ Support 100+ products in catalog
□ Handle 50+ transactions per hour
□ Accurate inventory updates
□ Reliable session tracking
□ Multi-payment method support
□ Receipt generation working

✅ Non-Functional Requirements:
□ 99.9% uptime during business hours
□ <2s page load times
□ <500ms search response
□ Mobile-responsive design
□ Offline capability (basic)
□ PCI compliance ready

✅ User Acceptance:
□ Cashier training completed
□ Positive user feedback
□ No critical bugs
□ Documentation complete
```

---

## 🎯 Next Steps

### Immediate Actions:

1. **Review & Approve Architecture** ✋
   - Stakeholder sign-off
   - Technical review
   - Budget approval

2. **Start Development** 🚀
   - Create database migration
   - Build API endpoints
   - Design UI components

3. **Parallel Workstreams** 🔀
   - Backend: Database + API
   - Frontend: UI components
   - Integration: Testing

---

## 📚 Additional Considerations

### Future Enhancements
```
□ Customer loyalty program
□ Gift card support
□ Employee discounts
□ Time-based pricing
□ Bundle promotions
□ Inventory reservations
□ Multi-currency support
□ Kitchen display system (for restaurants)
□ Table management (for restaurants)
□ Appointment scheduling (for services)
□ Barcode label printing
□ Self-checkout kiosks
□ Mobile POS (tablet/phone)
□ Integration with scales (for weighted items)
□ Age verification prompts
□ Tip management
□ Commission tracking
```

### Hardware Recommendations
```
Essential:
□ Touchscreen monitor (15" minimum)
□ Thermal receipt printer (USB/Network)
□ Cash drawer (connects to printer)
□ Barcode scanner (USB/Bluetooth)

Optional:
□ Customer display
□ Payment terminal (card reader)
□ Label printer
□ Handheld scanner
□ Kitchen printer
□ Weighing scale
```

---

## 📞 Questions to Address

Before implementation begins:

1. **How many POS terminals do you need initially?**
2. **Will you use barcode scanners?**
3. **What payment methods are required?** (Cash, Card, Mobile, etc.)
4. **Do you need offline support?**
5. **Receipt format requirements?** (Thermal vs. A4, Logo, etc.)
6. **Tax calculation rules?** (Single rate, multiple rates, tax-exempt items)
7. **Discount policies?** (Percentage, fixed amount, employee discounts)
8. **Return/refund policies?**
9. **Multi-currency support needed?**
10. **Integration with payment processors?** (Stripe, Square, etc.)

---

## ✅ Architecture Review Complete

This architecture provides:
- ✅ **Complete database design** with all tables, indexes, and views
- ✅ **Comprehensive API structure** with detailed endpoints
- ✅ **User interface wireframes** and UX considerations
- ✅ **Integration strategy** with existing ERP modules
- ✅ **Security and compliance** measures
- ✅ **Performance optimizations** and scalability plan
- ✅ **10-week implementation roadmap** with clear phases
- ✅ **Success criteria** and testing requirements

**Ready to proceed with implementation?** 🚀

---

*Last Updated: November 12, 2025*  
*Version: 1.0*  
*Author: Ocean ERP Development Team*

