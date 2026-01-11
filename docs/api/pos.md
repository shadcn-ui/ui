# Ocean ERP POS API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:4000/api` (Development)  
**Authentication:** Session-based (required for all endpoints)  
**Last Updated:** November 12, 2025

---

## Table of Contents

1. [POS Sessions API](#pos-sessions-api)
2. [Product Search API](#product-search-api)
3. [Customer Quick Lookup API](#customer-quick-lookup-api)
4. [POS Transactions API](#pos-transactions-api)
5. [Loyalty Points API](#loyalty-points-api)
6. [Error Codes](#error-codes)
7. [Data Models](#data-models)

---

## POS Sessions API

### List All Sessions

Retrieve all POS sessions with optional filters.

**Endpoint:** `GET /api/pos/sessions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `terminal_id` | number | No | Filter by specific terminal |
| `warehouse_id` | number | No | Filter by warehouse/outlet |
| `status` | string | No | Filter by status (`open` or `closed`) |
| `limit` | number | No | Maximum results (default: 50) |

**Request Example:**

```bash
curl -X GET "http://localhost:4000/api/pos/sessions?status=open&warehouse_id=1" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "session_number": "SES-20241112-00001",
      "terminal_id": 1,
      "terminal_name": "Terminal 1 - Main Counter",
      "warehouse_id": 1,
      "warehouse_name": "Jakarta - Grand Indonesia",
      "cashier_id": 5,
      "cashier_name": "John Doe",
      "status": "open",
      "opening_cash": 500000.00,
      "closing_cash": null,
      "opened_at": "2024-11-12T08:00:00Z",
      "closed_at": null,
      "transaction_count": 15,
      "total_sales": 2750000.00,
      "created_at": "2024-11-12T08:00:00Z"
    }
  ],
  "count": 1
}
```

---

### Get Specific Session

Retrieve details of a specific session by ID.

**Endpoint:** `GET /api/pos/sessions/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Session ID |

**Request Example:**

```bash
curl -X GET "http://localhost:4000/api/pos/sessions/1" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_number": "SES-20241112-00001",
    "terminal_id": 1,
    "warehouse_id": 1,
    "cashier_id": 5,
    "status": "open",
    "opening_cash": 500000.00,
    "closing_cash": null,
    "opened_at": "2024-11-12T08:00:00Z",
    "closed_at": null,
    "transaction_count": 15,
    "total_sales": 2750000.00,
    "cash_movements": [],
    "notes": null
  }
}
```

---

### Open New Session

Start a new POS session with opening cash float.

**Endpoint:** `POST /api/pos/sessions`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `terminal_id` | number | Yes | Terminal ID |
| `warehouse_id` | number | Yes | Warehouse/outlet ID |
| `cashier_id` | number | Yes | Cashier user ID |
| `opening_cash` | number | Yes | Opening cash amount (IDR) |
| `notes` | string | No | Optional session notes |

**Request Example:**

```bash
curl -X POST "http://localhost:4000/api/pos/sessions" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "terminal_id": 1,
    "warehouse_id": 1,
    "cashier_id": 5,
    "opening_cash": 500000,
    "notes": "Morning shift - Nov 12"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_number": "SES-20241112-00001",
    "terminal_id": 1,
    "warehouse_id": 1,
    "cashier_id": 5,
    "status": "open",
    "opening_cash": 500000.00,
    "opened_at": "2024-11-12T08:00:00Z"
  },
  "message": "Session opened successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields or terminal already has open session
- `404 Not Found` - Terminal or warehouse not found

---

### Close Session

Close an existing session with cash reconciliation.

**Endpoint:** `PATCH /api/pos/sessions/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Session ID to close |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `closing_cash` | number | Yes | Actual cash counted (IDR) |
| `notes` | string | No | Closing notes/discrepancies |

**Request Example:**

```bash
curl -X PATCH "http://localhost:4000/api/pos/sessions/1" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "closing_cash": 3200000,
    "notes": "All transactions processed"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_number": "SES-20241112-00001",
    "status": "closed",
    "opening_cash": 500000.00,
    "closing_cash": 3200000.00,
    "expected_cash": 3200000.00,
    "cash_difference": 0.00,
    "transaction_count": 15,
    "total_sales": 2750000.00,
    "closed_at": "2024-11-12T17:00:00Z",
    "duration_hours": 9
  },
  "message": "Session closed successfully"
}
```

---

## Product Search API

### Search Products for POS

Fast product search for POS checkout with inventory availability.

**Endpoint:** `GET /api/pos/products/search`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes* | Search query (name, SKU, brand) |
| `barcode` | string | Yes* | Exact barcode match |
| `warehouse_id` | number | No | Filter by warehouse stock |
| `category_id` | number | No | Filter by category |
| `limit` | number | No | Max results (default: 50) |

*Either `q` or `barcode` is required.

**Request Example:**

```bash
# Search by product name
curl -X GET "http://localhost:4000/api/pos/products/search?q=wardah&warehouse_id=1" \
  -H "Cookie: session=your_session_cookie"

# Search by barcode (scanner input)
curl -X GET "http://localhost:4000/api/pos/products/search?barcode=8991199301234&warehouse_id=1" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "WRD-CLN-001",
      "name": "Wardah Perfect Bright Micellar Water",
      "barcode": "8991199301234",
      "brand": "Wardah",
      "category_id": 7,
      "category_name": "Cleansers",
      "unit_price": 45000.00,
      "cost_price": 30000.00,
      "unit_of_measure": "bottle",
      "is_taxable": true,
      "available_quantity": 245,
      "reserved_quantity": 0,
      "requires_batch_tracking": true,
      "shelf_life_days": 730,
      "skin_type_suitable": ["Normal", "Oily", "Combination"],
      "ingredients": ["Micellar Technology", "Vitamin B3"],
      "price_with_tax": 49950.00,
      "batches": [
        {
          "id": 1,
          "batch_number": "WRD2024110001",
          "expiry_date": "2026-11-01",
          "quantity_remaining": 150
        },
        {
          "id": 2,
          "batch_number": "WRD2024110002",
          "expiry_date": "2026-11-15",
          "quantity_remaining": 95
        }
      ]
    }
  ],
  "count": 1
}
```

**Error Responses:**

- `400 Bad Request` - Missing search query parameter
- `500 Internal Server Error` - Database error

---

## Customer Quick Lookup API

### Search Customer

Quick customer lookup for POS checkout.

**Endpoint:** `GET /api/pos/customers/quick`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `phone` | string | No* | Search by phone number |
| `email` | string | No* | Search by email |
| `membership_number` | string | No* | Search by membership number |
| `name` | string | No* | Search by customer name |

*At least one parameter required.

**Request Example:**

```bash
# Search by phone
curl -X GET "http://localhost:4000/api/pos/customers/quick?phone=081234567890" \
  -H "Cookie: session=your_session_cookie"

# Search by membership number
curl -X GET "http://localhost:4000/api/pos/customers/quick?membership_number=MEM-2024-0001" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "contact_person": "Siti Nurhaliza",
      "phone": "+62-812-3456-7890",
      "email": "siti.nurhaliza@gmail.com",
      "membership_number": "MEM-2024-0001",
      "membership_tier_id": 4,
      "tier_name": "Platinum",
      "tier_discount_percentage": 15.00,
      "tier_points_multiplier": 2.00,
      "loyalty_points": 15000,
      "lifetime_purchase_value": 85000000.00,
      "transaction_count": 42,
      "last_purchase_date": "2024-11-01",
      "recent_orders": [
        {
          "order_number": "SO-20241101-00123",
          "order_date": "2024-11-01",
          "total_amount": 2500000.00
        }
      ]
    }
  ],
  "count": 1
}
```

---

### Create Walk-In Customer

Create a quick walk-in customer record.

**Endpoint:** `POST /api/pos/customers/quick`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contact_person` | string | Yes | Customer name |
| `phone` | string | Yes | Phone number (unique) |
| `email` | string | No | Email address |

**Request Example:**

```bash
curl -X POST "http://localhost:4000/api/pos/customers/quick" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "contact_person": "Walk-in Customer",
    "phone": "+62-821-9999-8888",
    "email": "customer@example.com"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 21,
    "contact_person": "Walk-in Customer",
    "phone": "+62-821-9999-8888",
    "email": "customer@example.com",
    "membership_number": "MEM-2024-0021",
    "membership_tier_id": 1,
    "tier_name": "Bronze",
    "loyalty_points": 0,
    "created_at": "2024-11-12T10:30:00Z"
  },
  "message": "Walk-in customer created successfully"
}
```

---

## POS Transactions API

### Process Checkout

Complete a sales transaction with payment processing.

**Endpoint:** `POST /api/pos/transactions`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | number | Yes | Active session ID |
| `terminal_id` | number | Yes | Terminal ID |
| `warehouse_id` | number | Yes | Warehouse ID |
| `cashier_id` | number | Yes | Cashier user ID |
| `customer_id` | number | No | Customer ID (null for walk-in) |
| `items` | array | Yes | Array of transaction items |
| `items[].product_id` | number | Yes | Product ID |
| `items[].quantity` | number | Yes | Quantity purchased |
| `items[].unit_price` | number | Yes | Price per unit (IDR) |
| `items[].discount` | number | No | Discount amount (default: 0) |
| `items[].batch_id` | number | No | Batch ID (if batch tracking) |
| `payments` | array | Yes | Payment methods used |
| `payments[].method` | string | Yes | Payment method* |
| `payments[].amount` | number | Yes | Payment amount (IDR) |
| `loyalty_points_to_redeem` | number | No | Points to redeem (default: 0) |
| `notes` | string | No | Transaction notes |

*Payment methods: `cash`, `card`, `qris`, `gopay`, `ovo`, `dana`, `shopee`, `linkaja`

**Request Example:**

```bash
curl -X POST "http://localhost:4000/api/pos/transactions" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "session_id": 1,
    "terminal_id": 1,
    "warehouse_id": 1,
    "cashier_id": 5,
    "customer_id": 1,
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "unit_price": 45000,
        "discount": 0
      },
      {
        "product_id": 12,
        "quantity": 1,
        "unit_price": 95000,
        "discount": 5000
      }
    ],
    "payments": [
      {
        "method": "cash",
        "amount": 200000
      }
    ],
    "loyalty_points_to_redeem": 1000,
    "notes": "Customer requested gift wrapping"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "transaction_id": 1,
    "transaction_number": "TXN-20241112-00001",
    "order_id": 1,
    "order_number": "SO-20241112-00001",
    "receipt_number": "RCP-20241112-00001",
    "session_id": 1,
    "customer_id": 1,
    "customer_name": "Siti Nurhaliza",
    "subtotal": 185000.00,
    "tax_amount": 20350.00,
    "loyalty_discount": 1000.00,
    "total_amount": 204350.00,
    "payments": [
      {
        "method": "cash",
        "amount": 200000.00,
        "tender": 200000.00,
        "change": 0.00
      }
    ],
    "loyalty_points_redeemed": 1000,
    "loyalty_points_earned": 18,
    "new_loyalty_balance": 14018,
    "items": [
      {
        "product_name": "Wardah Perfect Bright Micellar Water",
        "quantity": 2,
        "unit_price": 45000.00,
        "subtotal": 90000.00,
        "tax": 9900.00
      },
      {
        "product_name": "Somethinc Sunscreen Gel SPF 50+",
        "quantity": 1,
        "unit_price": 95000.00,
        "discount": 5000.00,
        "subtotal": 90000.00,
        "tax": 9900.00
      }
    ],
    "created_at": "2024-11-12T10:45:00Z"
  },
  "message": "Transaction processed successfully"
}
```

**Error Responses:**

- `400 Bad Request` - Invalid data, insufficient inventory, or session closed
- `404 Not Found` - Session, product, or customer not found
- `500 Internal Server Error` - Transaction processing error

---

### Get Transaction History

Retrieve transaction history with filters.

**Endpoint:** `GET /api/pos/transactions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | number | No | Filter by session |
| `warehouse_id` | number | No | Filter by warehouse |
| `customer_id` | number | No | Filter by customer |
| `start_date` | string | No | Start date (YYYY-MM-DD) |
| `end_date` | string | No | End date (YYYY-MM-DD) |
| `limit` | number | No | Max results (default: 50) |

**Request Example:**

```bash
curl -X GET "http://localhost:4000/api/pos/transactions?session_id=1&limit=10" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "transaction_id": 1,
      "transaction_number": "TXN-20241112-00001",
      "order_number": "SO-20241112-00001",
      "session_number": "SES-20241112-00001",
      "terminal_name": "Terminal 1 - Main Counter",
      "customer_name": "Siti Nurhaliza",
      "cashier_name": "John Doe",
      "total_amount": 204350.00,
      "payment_methods": ["cash"],
      "transaction_date": "2024-11-12T10:45:00Z",
      "item_count": 2
    }
  ],
  "count": 1
}
```

---

## Loyalty Points API

### Get Customer Points History

Retrieve loyalty points transaction history for a customer.

**Endpoint:** `GET /api/loyalty/points/:customerId/history`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customerId` | number | Yes | Customer ID |

**Request Example:**

```bash
curl -X GET "http://localhost:4000/api/loyalty/points/1/history" \
  -H "Cookie: session=your_session_cookie"
```

**Response (200 OK):**

```json
{
  "success": true,
  "customer": {
    "id": 1,
    "name": "Siti Nurhaliza",
    "membership_number": "MEM-2024-0001",
    "tier_name": "Platinum",
    "loyalty_points": 15000,
    "points_expiring_soon": 500,
    "expiring_within_days": 30
  },
  "history": [
    {
      "transaction_type": "earned",
      "points": 25,
      "description": "Purchase - SO-20241112-00001",
      "order_number": "SO-20241112-00001",
      "expiry_date": "2025-11-12",
      "created_by_name": "John Doe",
      "created_at": "2024-11-12T10:45:00Z"
    },
    {
      "transaction_type": "redeemed",
      "points": -1000,
      "description": "Redeemed at checkout - SO-20241112-00001",
      "order_number": "SO-20241112-00001",
      "created_by_name": "John Doe",
      "created_at": "2024-11-12T10:45:00Z"
    }
  ],
  "count": 2
}
```

---

### Validate Loyalty Points Redemption

Validate if customer can redeem specified points.

**Endpoint:** `POST /api/loyalty/points/validate-redemption`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_id` | number | Yes | Customer ID |
| `points_to_redeem` | number | Yes | Points to redeem |

**Request Example:**

```bash
curl -X POST "http://localhost:4000/api/loyalty/points/validate-redemption" \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your_session_cookie" \
  -d '{
    "customer_id": 1,
    "points_to_redeem": 1000
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "can_redeem": true,
  "available_points": 15000,
  "points_to_redeem": 1000,
  "discount_amount": 1000.00,
  "points_value": "Rp 1,000 per point",
  "remaining_points": 14000,
  "errors": []
}
```

**Response (200 OK - Validation Failed):**

```json
{
  "success": true,
  "can_redeem": false,
  "available_points": 50,
  "points_to_redeem": 1000,
  "errors": [
    "Insufficient loyalty points. Available: 50, Requested: 1000",
    "Minimum points to redeem: 100"
  ]
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or business logic error |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate record) |
| 500 | Internal Server Error | Server error |

### Common Error Response Format

```json
{
  "success": false,
  "error": "Error message here",
  "details": {
    "field": "Field-specific error information"
  }
}
```

### Business Logic Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Terminal already has an open session" | Trying to open new session when one is active | Close existing session first |
| "Session is not open" | Attempting transaction on closed session | Open a new session |
| "Insufficient inventory" | Product stock too low | Reduce quantity or restock |
| "Invalid payment amount" | Payment total doesn't match transaction | Adjust payment amounts |
| "Duplicate phone number" | Phone already exists in database | Use different phone or find existing customer |
| "Minimum points to redeem: 100" | Trying to redeem < 100 points | Redeem at least 100 points |
| "Insufficient loyalty points" | Customer doesn't have enough points | Reduce points or skip redemption |

---

## Data Models

### Session Status

- `open` - Session is active and accepting transactions
- `closed` - Session is closed and reconciled

### Payment Methods

- `cash` - Cash payment
- `card` - Credit/Debit card
- `qris` - QR Indonesian Standard
- `gopay` - GoPay e-wallet
- `ovo` - OVO e-wallet
- `dana` - DANA e-wallet
- `shopee` - ShopeePay e-wallet
- `linkaja` - LinkAja e-wallet

### Transaction Types (Loyalty)

- `earned` - Points earned from purchase
- `redeemed` - Points used for discount
- `expired` - Points expired
- `manual_adjustment` - Manual points adjustment
- `bonus` - Bonus points from promotion

### Membership Tiers

| Tier | Min Purchase Value (IDR) | Discount | Points Multiplier |
|------|--------------------------|----------|-------------------|
| Bronze | Rp 0 | 0% | 1.0x |
| Silver | Rp 5,000,000 | 5% | 1.2x |
| Gold | Rp 15,000,000 | 10% | 1.5x |
| Platinum | Rp 50,000,000 | 15% | 2.0x |
| Titanium | Rp 100,000,000 | 20% | 3.0x |

### Loyalty Points Calculation

**Earning Points:**
```
base_points = floor(purchase_amount × 0.0001)
earned_points = base_points × tier_multiplier
```

Example: Rp 100,000 purchase by Gold member
```
base_points = floor(100,000 × 0.0001) = 10 points
earned_points = 10 × 1.5 = 15 points
```

**Redeeming Points:**
```
discount_amount = points_redeemed × 1,000 (IDR)
```

Example: Redeem 1,000 points
```
discount = 1,000 × Rp 1,000 = Rp 1,000,000 discount
```

---

## Rate Limits

- **General API calls:** 100 requests/minute per user
- **Product search:** 30 requests/minute per user
- **Transaction processing:** 10 requests/minute per terminal

---

## Testing & Development

### Test Credentials

Development environment has pre-loaded test data:

**Test Customers:**
- Siti Nurhaliza (Platinum): +62-812-3456-7890 / MEM-2024-0001
- Raisa Andriana (Titanium): +62-813-9876-5432 / MEM-2024-0002
- Anya Geraldine (Gold): +62-821-5555-1234 / MEM-2024-0004

**Test Products:**
- Wardah Perfect Bright Micellar Water: WRD-CLN-001 / 8991199301234
- Somethinc Sunscreen Gel: SMT-MST-013 / 8991199301357
- Avoskin Retinol 1%: AVO-SER-022 / 8991199301449

**Test Terminal:**
- Terminal ID: 1 (Terminal 1 - Main Counter)
- Warehouse ID: 1 (Jakarta - Grand Indonesia)

### Postman Collection

Import the Postman collection for easy API testing:
```
/docs/postman/ocean-erp-pos-api.postman_collection.json
```

---

## Support

For API support and bug reports:
- **Email:** dev-team@ocean-erp.com
- **Slack:** #pos-api-support
- **Documentation:** https://docs.ocean-erp.com/api/pos

---

**Last Updated:** November 12, 2025  
**Version:** 1.0.0  
**Maintained by:** Ocean ERP Development Team
