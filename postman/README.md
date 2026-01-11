# Ocean ERP - Postman API Collections

Complete Postman collections for testing Ocean ERP APIs.

## 📦 Files Included

### Phase 7 - Complete API Collection (NEW!)
- **Ocean-ERP-API-v4.postman_collection.json** - Complete Phase 7 API collection with CRM & Projects endpoints
- **Ocean-ERP-Development.postman_environment.json** - Development environment (localhost:4000)
- **Ocean-ERP-Production.postman_environment.json** - Production environment template

### Legacy Collections
- **Ocean-ERP-POS-API.postman_collection.json** - Point of Sale (POS) specific APIs

## 🚀 Quick Start

### Option A: Phase 7 Complete APIs (Recommended)

#### 1. Import Collection & Environment

1. Open Postman
2. Click **Import** button (top left)
3. Import these files:
   - `Ocean-ERP-API-v4.postman_collection.json`
   - `Ocean-ERP-Development.postman_environment.json`
4. Select **Ocean ERP - Development** environment from dropdown (top right)

#### 2. Start Your Dev Server

```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
pnpm dev --filter=v4
```

#### 3. Test CRM APIs

**Basic Flow:**
1. **CRM → Leads → List Leads**
   - Returns all leads with pagination
   
2. **CRM → Leads → Create Lead**
   - Create a new lead
   - Auto-validates required fields
   
3. **CRM → Leads → Get Lead by ID**
   - View full lead details
   
4. **CRM → Leads → Update Lead**
   - Qualify the lead
   
5. **CRM → Leads → Convert Lead**
   - Convert to contact/company

#### 4. Test Project Management APIs

**Basic Flow:**
1. **Projects → List Projects**
   - Returns all projects with statistics
   
2. **Projects → Create Project**
   - Create a new project
   
3. **Projects → Tasks → Create Task**
   - Add task with dependencies
   
4. **Projects → Time Tracking → Log Time Entry**
   - Track time for tasks
   
5. **Projects → Time Tracking → Approve Time Entries**
   - Approve logged hours
   
6. **Projects → Analytics → Portfolio Dashboard**
   - View project portfolio analytics

---

### Option B: Legacy POS APIs

## 📚 Collection Structure

### 1. Session Management (3 endpoints)
- Open POS Session
- Get Active Session
- Close POS Session

### 2. Products (3 endpoints)
- Search Products (by name/SKU/brand)
- Search by Barcode (exact match)
- Get Product by ID

### 3. Customers (3 endpoints)
- Search Customers (by name/email/phone)
- Get Customer by ID
- Create Walk-in Customer

### 4. Transactions (3 endpoints)
- Create POS Transaction (with loyalty calculation)
- Get Transaction by ID
- List Session Transactions

### 5. Loyalty & Membership (3 endpoints)
- Get Loyalty Points
- Get Membership Tiers
- Redeem Loyalty Points

### 6. Reports & Analytics (2 endpoints)
- Session Summary Report
- Daily Sales Report

## 🧪 Test Data Available

### Products (50 Indonesian Skincare Items)
- **Wardah**: Micellar Water (IDR 45,000), Vitamin C Serum (IDR 65,000)
- **Somethinc**: Niacinamide Serum (IDR 89,000), Hyaluronic Acid (IDR 129,000)
- **Avoskin**: PHTE Toner (IDR 139,000), Miraculous Serum (IDR 179,000)
- **Skintific**: 5X Ceramide Serum (IDR 109,000)
- **Y.O.U**: Skin Barrier Cream (IDR 79,000)

### Customers (20 Test Customers)

| Name | Tier | Points | Annual Spend |
|------|------|--------|--------------|
| Siti Nurhaliza | Titanium | 12,500 | IDR 95M |
| Ahmad Wijaya | Platinum | 8,200 | IDR 45M |
| Dewi Lestari | Gold | 3,100 | IDR 22M |
| Rina Kusuma | Silver | 980 | IDR 8M |
| Budi Santoso | Bronze | 250 | IDR 2M |

### Membership Tiers

| Tier | Annual Spend | Points Multiplier | Discount | Special Benefits |
|------|--------------|-------------------|----------|------------------|
| Bronze | IDR 0 - 5M | 1x | 0% | Entry level |
| Silver | IDR 5M - 15M | 1.5x | 5% | Birthday gift |
| Gold | IDR 15M - 30M | 2x | 10% | Priority service |
| Platinum | IDR 30M - 75M | 3x | 15% | Free quarterly treatment |
| Titanium | IDR 75M+ | 5x | 20% | Exclusive events, personal shopper |

## 🔧 Environment Variables

### Development Environment
```
base_url = http://localhost:4000
user_id = 1 (test cashier)
warehouse_id = 1 (Jakarta Main Store)
customer_id = 1 (auto-populated after search)
session_id = (auto-populated after opening session)
transaction_id = (auto-populated after transaction)
```

### Auto-Populated Variables
The collection automatically saves these variables from responses:
- `session_id` - After opening POS session
- `session_number` - POS session identifier
- `customer_id` - After customer search
- `transaction_id` - After creating transaction
- `invoice_number` - Transaction invoice number

## 🧩 Common Use Cases

### Scenario 1: Quick Sale (Registered Customer)
1. Open POS Session
2. Search Customer by phone: `q=081234567890`
3. Search Products: `q=wardah`
4. Create Transaction with items
5. Close Session

### Scenario 2: Walk-in Sale (New Customer)
1. Open POS Session
2. Create Walk-in Customer
3. Search Products by barcode: `barcode=8992745001234`
4. Create Transaction
5. Close Session

### Scenario 3: Loyalty Points Redemption
1. Search Customer
2. Get Loyalty Points (check balance)
3. Search Products
4. Create Transaction
5. Redeem Loyalty Points (100 points = IDR 10,000)

### Scenario 4: Batch Tracked Products
1. Search Products with batch tracking: `q=vitamin c`
2. Check `batches` array in response
3. Select specific batch by expiry date
4. Create Transaction with batch_id

## 📊 Global Test Scripts

The collection includes automatic tests:
- ✅ Response time < 5 seconds
- ✅ Response has `success` field
- ✅ Auto-save important IDs to environment

## 🎯 Payment Methods Supported

- Cash
- Debit Card
- Credit Card
- GoPay (e-wallet)
- OVO (e-wallet)
- DANA (e-wallet)
- QRIS (QR payment)
- Bank Transfer

## 💡 Tips & Tricks

### 1. Fuzzy Search
Products and customers support partial matching:
- `q=war` finds "Wardah"
- `q=siti` finds "Siti Nurhaliza"

### 2. Tax Calculation
All prices automatically include 11% PPN (Indonesian VAT):
- Base price: IDR 45,000
- Price with tax: IDR 49,950

### 3. Loyalty Points
Points are calculated based on membership tier:
- Bronze: 1 point per IDR 1,000
- Titanium: 5 points per IDR 1,000

### 4. Barcode Scanning
Use the barcode endpoint for instant product lookup:
```
GET /api/pos/products/search?barcode=8992745001234&warehouse_id=1
```

## 📖 Additional Documentation

- **Full API Docs**: `/docs/api/pos.md`
- **Phase 2 RFC**: `/docs/rfcs/phase2-offline-mode.md`
- **Test Data Script**: `/database/seeds/pos_test_data_v2.sql`

## 🐛 Troubleshooting

### Issue: "Failed to fetch"
**Solution**: Make sure dev server is running on port 4000
```bash
pnpm dev --filter=v4 --port 4000
```

### Issue: "Session not found"
**Solution**: Create a new session using "Open POS Session" endpoint

### Issue: "Product not in stock"
**Solution**: Check `available_quantity` in product search response. Only products with stock > 0 are shown.

### Issue: "Invalid customer_id"
**Solution**: Use "Search Customers" to find valid customer IDs, or create a new walk-in customer

## 🔐 Production Environment Setup

For production use:
1. Update `base_url` in Production environment
2. Add `api_key` and `auth_token` (contact admin)
3. Switch to Production environment in Postman
4. Test with read-only endpoints first

## 📞 Support

For API issues or questions:
- Email: dev@ocean-erp.com
- Slack: #api-support
- Documentation: https://docs.ocean-erp.com

---

**Last Updated**: November 12, 2025  
**Collection Version**: 1.0.0  
**API Version**: v1
