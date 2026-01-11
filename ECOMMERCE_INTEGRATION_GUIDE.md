# E-commerce Integration Quick Start Guide 🚀

Complete guide to setting up and using Ocean ERP's e-commerce integration.

---

## 📋 Table of Contents

1. [Installation](#installation)
2. [Platform Setup](#platform-setup)
3. [Product Synchronization](#product-synchronization)
4. [Order Processing](#order-processing)
5. [Inventory Management](#inventory-management)
6. [Webhooks Setup](#webhooks-setup)
7. [Abandoned Cart Recovery](#abandoned-cart-recovery)
8. [Analytics & Reports](#analytics--reports)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Installation

### 1. Install Database Schema

```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
psql postgresql://mac@localhost:5432/ocean-erp -f database/021_phase7_ecommerce_integration.sql
```

**Verify Installation:**
```bash
psql postgresql://mac@localhost:5432/ocean-erp -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'ecommerce%' ORDER BY table_name;"
```

Expected output: 13 tables (10 tables + 3 views)

---

## 🏪 Platform Setup

### Shopify Store Setup

**Step 1: Get API Credentials**
1. Log into Shopify Admin
2. Go to **Apps** → **Develop apps** → **Create an app**
3. Configure scopes: `read_products`, `write_products`, `read_orders`, `write_orders`, `read_inventory`, `write_inventory`
4. Copy **API Key**, **API Secret**, and **Access Token**

**Step 2: Register Store in ERP**
```bash
curl -X POST http://localhost:4000/api/ecommerce/storefronts \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_code": "SHOPIFY-MAIN",
    "storefront_name": "My Shopify Store",
    "platform_type": "shopify",
    "platform_url": "https://mystore.myshopify.com",
    "api_endpoint": "https://mystore.myshopify.com/admin/api/2024-01",
    "api_key": "YOUR_API_KEY",
    "api_secret": "YOUR_API_SECRET",
    "api_token": "YOUR_ACCESS_TOKEN",
    "webhook_secret": "GENERATE_RANDOM_SECRET",
    "auto_sync_products": true,
    "auto_sync_orders": true,
    "auto_sync_inventory": true,
    "auto_create_sales_orders": true,
    "sync_frequency_minutes": 15,
    "default_currency": "USD",
    "timezone": "America/New_York",
    "is_active": true,
    "created_by": 1
  }'
```

**Response:**
```json
{
  "message": "Storefront created successfully",
  "storefront": {
    "storefront_id": 1,
    "storefront_code": "SHOPIFY-MAIN",
    "is_connected": true
  }
}
```

---

### WooCommerce Store Setup

**Step 1: Generate API Credentials**
1. Go to **WooCommerce** → **Settings** → **Advanced** → **REST API**
2. Click **Add Key**
3. Set permissions to **Read/Write**
4. Copy **Consumer Key** and **Consumer Secret**

**Step 2: Register Store**
```bash
curl -X POST http://localhost:4000/api/ecommerce/storefronts \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_code": "WOO-MAIN",
    "storefront_name": "My WooCommerce Store",
    "platform_type": "woocommerce",
    "platform_url": "https://mystore.com",
    "api_endpoint": "https://mystore.com/wp-json/wc/v3",
    "api_key": "ck_YOUR_CONSUMER_KEY",
    "api_secret": "cs_YOUR_CONSUMER_SECRET",
    "webhook_secret": "GENERATE_RANDOM_SECRET",
    "auto_sync_products": true,
    "auto_sync_orders": true,
    "auto_sync_inventory": true,
    "sync_frequency_minutes": 15,
    "default_currency": "USD",
    "is_active": true,
    "created_by": 1
  }'
```

---

### Magento Store Setup

**Step 1: Create Integration**
1. Go to **System** → **Integrations** → **Add New Integration**
2. Grant API permissions
3. Activate integration
4. Copy **Access Token**

**Step 2: Register Store**
```bash
curl -X POST http://localhost:4000/api/ecommerce/storefronts \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_code": "MAGENTO-MAIN",
    "storefront_name": "My Magento Store",
    "platform_type": "magento",
    "platform_url": "https://mystore.com",
    "api_endpoint": "https://mystore.com/rest/V1",
    "api_token": "YOUR_ACCESS_TOKEN",
    "webhook_secret": "GENERATE_RANDOM_SECRET",
    "auto_sync_products": true,
    "auto_sync_orders": true,
    "auto_sync_inventory": true,
    "default_currency": "USD",
    "is_active": true,
    "created_by": 1
  }'
```

---

## 📦 Product Synchronization

### Sync Products FROM Storefront TO ERP

**Sync Single Product:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/products \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "external_product_id": "prod_shopify_12345",
    "external_sku": "LAPTOP-PRO-15",
    "product_name": "Professional Laptop 15\"",
    "short_description": "High-performance laptop for professionals",
    "long_description": "Detailed product description here...",
    "price": 1299.99,
    "compare_at_price": 1499.99,
    "cost_per_item": 800.00,
    "inventory_quantity": 25,
    "inventory_tracked": true,
    "ecommerce_category_id": 1,
    "weight": 2.5,
    "weight_unit": "kg",
    "featured_image_url": "https://cdn.shopify.com/image.jpg",
    "image_urls": [
      "https://cdn.shopify.com/image1.jpg",
      "https://cdn.shopify.com/image2.jpg"
    ],
    "is_published": true,
    "is_featured": false,
    "tags": ["electronics", "laptops", "professional"],
    "meta_title": "Professional Laptop 15\" - High Performance",
    "meta_description": "Best professional laptop for...",
    "created_by": 1
  }'
```

**Sync Product WITH Variants:**
```bash
# 1. Create main product
curl -X POST http://localhost:4000/api/ecommerce/products \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "external_product_id": "prod_tshirt_001",
    "product_name": "Premium T-Shirt",
    "price": 29.99,
    "inventory_quantity": 0,
    "created_by": 1
  }'

# 2. Add variants (would require variant API endpoint)
# Small/Red: 15 units, $29.99
# Small/Blue: 20 units, $29.99
# Large/Red: 10 units, $34.99
# etc.
```

---

### View All Products

```bash
# All products
curl "http://localhost:4000/api/ecommerce/products?page=1&limit=50"

# Filter by storefront
curl "http://localhost:4000/api/ecommerce/products?storefront_id=1"

# Filter by sync status
curl "http://localhost:4000/api/ecommerce/products?sync_status=pending"

# Filter published only
curl "http://localhost:4000/api/ecommerce/products?is_published=true"

# Search by name or SKU
curl "http://localhost:4000/api/ecommerce/products?search=laptop"
```

---

### Update Product

```bash
curl -X PUT http://localhost:4000/api/ecommerce/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "inventory_quantity": 30,
    "is_on_sale": true,
    "updated_by": 1
  }'
```

---

## 🛒 Order Processing

### Import Order from Platform

**Basic Order:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/orders \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "external_order_id": "order_shopify_5678",
    "external_order_number": "1001",
    "external_order_name": "#1001",
    "order_date": "2024-12-04T15:30:00Z",
    "customer_email": "john.doe@email.com",
    "customer_first_name": "John",
    "customer_last_name": "Doe",
    "customer_phone": "+1-555-0123",
    "subtotal_amount": 1299.99,
    "shipping_amount": 15.00,
    "tax_amount": 104.00,
    "discount_amount": 0.00,
    "total_amount": 1418.99,
    "currency": "USD",
    "order_status": "confirmed",
    "payment_status": "paid",
    "fulfillment_status": "unfulfilled",
    "payment_method": "credit_card",
    "payment_gateway": "stripe",
    "payment_transaction_id": "ch_1234567890",
    "shipping_method": "Standard Shipping",
    "shipping_address": {
      "first_name": "John",
      "last_name": "Doe",
      "company": "",
      "address_line1": "123 Main Street",
      "address_line2": "Apt 4B",
      "city": "New York",
      "state_province": "NY",
      "postal_code": "10001",
      "country": "USA",
      "phone": "+1-555-0123"
    },
    "billing_address": {
      "first_name": "John",
      "last_name": "Doe",
      "address_line1": "123 Main Street",
      "city": "New York",
      "state_province": "NY",
      "postal_code": "10001",
      "country": "USA"
    },
    "line_items": [
      {
        "external_item_id": "item_001",
        "external_product_id": "prod_shopify_12345",
        "product_name": "Professional Laptop 15\"",
        "sku": "LAPTOP-PRO-15",
        "quantity": 1,
        "unit_price": 1299.99,
        "discount_amount": 0.00,
        "tax_amount": 104.00,
        "total_amount": 1299.99
      }
    ],
    "customer_note": "Please deliver between 9am-5pm",
    "created_by": 1
  }'
```

**Response:**
```json
{
  "message": "Order imported successfully",
  "order": {
    "ecommerce_order_id": 2,
    "external_order_number": "1001",
    "erp_sales_order_id": 154,
    "import_status": "imported"
  }
}
```

---

### List Orders

```bash
# All orders
curl "http://localhost:4000/api/ecommerce/orders"

# Filter by storefront
curl "http://localhost:4000/api/ecommerce/orders?storefront_id=1"

# Filter by status
curl "http://localhost:4000/api/ecommerce/orders?order_status=fulfilled"
curl "http://localhost:4000/api/ecommerce/orders?payment_status=paid"
curl "http://localhost:4000/api/ecommerce/orders?fulfillment_status=unfulfilled"

# Date range
curl "http://localhost:4000/api/ecommerce/orders?from_date=2024-12-01&to_date=2024-12-31"

# Pending import
curl "http://localhost:4000/api/ecommerce/orders?import_status=pending"
```

---

### Get Order Details

```bash
curl "http://localhost:4000/api/ecommerce/orders/1"
```

---

## 📊 Inventory Management

### Check Inventory Sync Status

```bash
# All products inventory status
curl "http://localhost:4000/api/ecommerce/inventory/sync"

# Specific storefront
curl "http://localhost:4000/api/ecommerce/inventory/sync?storefront_id=1"

# Low stock only
curl "http://localhost:4000/api/ecommerce/inventory/sync?stock_status=low_stock"

# Out of stock
curl "http://localhost:4000/api/ecommerce/inventory/sync?stock_status=out_of_stock"
```

---

### Sync Inventory TO Storefront

**Sync All Products:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "direction": "erp_to_store",
    "sync_all": true
  }'
```

**Sync Specific Products:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "direction": "erp_to_store",
    "product_updates": [
      {
        "ecommerce_product_id": 1,
        "inventory_quantity": 30
      },
      {
        "ecommerce_product_id": 2,
        "inventory_quantity": 45
      }
    ]
  }'
```

**Sync FROM Storefront TO ERP:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "direction": "store_to_erp",
    "sync_all": true
  }'
```

---

## 🔗 Webhooks Setup

Webhooks enable real-time order notifications from your storefront to Ocean ERP.

### Shopify Webhooks

**Step 1: Configure in Shopify Admin**
1. Go to **Settings** → **Notifications** → **Webhooks**
2. Click **Create webhook**
3. Configure:
   - **Event:** Orders/Create
   - **Format:** JSON
   - **URL:** `https://your-domain.com/api/ecommerce/webhooks/orders`
   - **API version:** 2024-01

**Step 2: Test Webhook**
```bash
# Shopify will send test payload
# Your endpoint should respond with 200 OK
```

**Sample Shopify Webhook:**
```json
{
  "storefront_code": "SHOPIFY-MAIN",
  "webhook_event": "order.created",
  "webhook_signature": "your_hmac_signature",
  "data": {
    "id": 5678901234,
    "order_number": 1002,
    "email": "customer@example.com",
    "created_at": "2024-12-04T15:30:00Z",
    "total_price": "599.99",
    "subtotal_price": "599.99",
    "total_tax": "48.00",
    "shipping_lines": [{
      "price": "15.00",
      "title": "Standard Shipping"
    }],
    "line_items": [{
      "id": 123456,
      "product_id": 789012,
      "variant_id": 345678,
      "title": "Executive Office Desk",
      "sku": "DESK-001",
      "quantity": 1,
      "price": "599.99"
    }],
    "customer": {
      "id": 111222,
      "email": "customer@example.com",
      "first_name": "Jane",
      "last_name": "Smith"
    },
    "shipping_address": {
      "first_name": "Jane",
      "last_name": "Smith",
      "address1": "456 Oak Avenue",
      "city": "New York",
      "province": "NY",
      "zip": "10001",
      "country": "USA"
    }
  }
}
```

---

### WooCommerce Webhooks

**Step 1: Configure in WooCommerce**
1. Go to **WooCommerce** → **Settings** → **Advanced** → **Webhooks**
2. Click **Add webhook**
3. Configure:
   - **Name:** Order Created
   - **Status:** Active
   - **Topic:** Order created
   - **Delivery URL:** `https://your-domain.com/api/ecommerce/webhooks/orders`
   - **Secret:** Your webhook secret

**Step 2: Handle Webhook**
The API will automatically:
1. Verify webhook signature
2. Create ecommerce_order
3. Create ecommerce_customer (if new)
4. Create sales_order in ERP (if auto_create_sales_orders = true)
5. Respond with 200 OK

---

## 🛒 Abandoned Cart Recovery

### View Abandoned Carts

```bash
# All abandoned carts
curl "http://localhost:4000/api/ecommerce/carts/abandoned"

# High-value carts (>$100)
curl "http://localhost:4000/api/ecommerce/carts/abandoned?min_value=100"

# Recent abandonment (last 24 hours)
curl "http://localhost:4000/api/ecommerce/carts/abandoned?days_abandoned=1"

# Haven't received recovery email
curl "http://localhost:4000/api/ecommerce/carts/abandoned?recovery_sent=false"

# Specific storefront
curl "http://localhost:4000/api/ecommerce/carts/abandoned?storefront_id=1"
```

**Response:**
```json
{
  "carts": [
    {
      "cart_id": 45,
      "storefront_name": "Main Shopify Store",
      "customer_email": "shopper@example.com",
      "total_amount": "899.99",
      "item_count": 2,
      "cart_status": "abandoned",
      "abandoned_at": "2024-12-03T10:00:00Z",
      "hours_abandoned": 28.5,
      "days_abandoned": 1,
      "recovery_email_sent": false,
      "checkout_url": "https://mystore.myshopify.com/cart/abc123"
    }
  ],
  "statistics": {
    "total_abandoned_carts": 156,
    "potential_revenue": "89234.50",
    "average_cart_value": "572.02",
    "recovery_emails_sent": 89,
    "recovered_carts": 23,
    "recovered_revenue": "18450.75"
  }
}
```

---

### Send Recovery Emails

**Send to Specific Carts:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/carts/abandoned/recover \
  -H "Content-Type: application/json" \
  -d '{
    "cart_ids": [45, 46, 47],
    "email_template": "abandoned_cart_v1"
  }'
```

**Send to All Eligible:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/carts/abandoned/recover \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "send_all": true,
    "min_value": 50,
    "max_days_abandoned": 7,
    "email_template": "abandoned_cart_v1"
  }'
```

---

## 📈 Analytics & Reports

### Get E-commerce KPIs

```bash
# All storefronts (last 30 days)
curl "http://localhost:4000/api/ecommerce/analytics"

# Specific storefront
curl "http://localhost:4000/api/ecommerce/analytics?storefront_id=1"

# Custom date range
curl "http://localhost:4000/api/ecommerce/analytics?from_date=2024-11-01&to_date=2024-11-30"
```

**Response:**
```json
{
  "sales_metrics": {
    "total_orders": 1247,
    "total_revenue": "1845230.50",
    "average_order_value": "1479.85",
    "unique_customers": 892,
    "fulfilled_orders": 1180,
    "cancelled_orders": 45,
    "paid_orders": 1200,
    "pending_payments": 47,
    "conversion_rate": "3.45",
    "revenue_growth": "15.30"
  },
  "top_products": [
    {
      "product_name": "Professional Laptop 15\"",
      "erp_sku": "LAP-001",
      "total_sold": 156,
      "total_revenue": "202344.00",
      "order_count": 143
    }
  ],
  "daily_trend": [...],
  "abandoned_carts": {
    "total_abandoned": 156,
    "potential_revenue": "89234.50",
    "recovery_rate": "14.74"
  },
  "inventory_status": {
    "total_products": 127,
    "out_of_stock_count": 3,
    "low_stock_count": 15
  }
}
```

---

### View Sales Summary by Storefront

```sql
SELECT * FROM ecommerce_sales_summary
ORDER BY total_revenue DESC;
```

---

### View Product Sync Health

```sql
SELECT * FROM ecommerce_product_sync_status
WHERE error_products > 0;
```

---

### View Abandoned Carts Summary

```sql
SELECT * FROM ecommerce_abandoned_carts_summary;
```

---

## 🔍 Troubleshooting

### Issue: Products Not Syncing

**Check sync status:**
```bash
curl "http://localhost:4000/api/ecommerce/products?sync_status=error"
```

**Manually retry sync:**
```bash
curl -X PUT http://localhost:4000/api/ecommerce/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "sync_status": "pending"
  }'
```

---

### Issue: Orders Not Importing

**Check connection status:**
```bash
curl "http://localhost:4000/api/ecommerce/storefronts" | jq '.storefronts[] | {name, connection_status, is_connected}'
```

**Verify webhook configuration:**
- Check webhook URL is accessible
- Verify webhook secret matches
- Check webhook logs in platform admin

**Manually import order:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/orders \
  -H "Content-Type: application/json" \
  -d '{ ... order data ... }'
```

---

### Issue: Inventory Out of Sync

**Check last sync time:**
```bash
curl "http://localhost:4000/api/ecommerce/storefronts" | jq '.storefronts[] | {name, last_inventory_sync_at}'
```

**Force inventory sync:**
```bash
curl -X POST http://localhost:4000/api/ecommerce/inventory/sync \
  -H "Content-Type: application/json" \
  -d '{
    "storefront_id": 1,
    "direction": "erp_to_store",
    "sync_all": true
  }'
```

---

### Issue: Webhook Signature Verification Failed

**Verify webhook secret:**
```sql
SELECT storefront_id, storefront_name, webhook_secret 
FROM ecommerce_storefronts 
WHERE storefront_id = 1;
```

**Update webhook secret:**
```bash
curl -X PUT http://localhost:4000/api/ecommerce/storefronts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_secret": "NEW_SECRET_HERE"
  }'
```

---

## 📚 Additional Resources

- **Full Documentation:** [PHASE_7_TASK_8_COMPLETE.md](./PHASE_7_TASK_8_COMPLETE.md)
- **Database Schema:** [021_phase7_ecommerce_integration.sql](./database/021_phase7_ecommerce_integration.sql)
- **API Code:** `/apps/v4/app/api/ecommerce/`

---

## 🎯 Common Workflows

### Daily Operations

```bash
# 1. Check new orders
curl "http://localhost:4000/api/ecommerce/orders?order_status=pending&page=1&limit=50"

# 2. Sync inventory (runs automatically every 15 minutes if auto_sync_inventory=true)
curl -X POST http://localhost:4000/api/ecommerce/inventory/sync \
  -d '{"storefront_id": 1, "direction": "erp_to_store", "sync_all": true}'

# 3. Check abandoned carts (send recovery after 24h)
curl "http://localhost:4000/api/ecommerce/carts/abandoned?days_abandoned=1&recovery_sent=false"

# 4. Send recovery emails
curl -X POST http://localhost:4000/api/ecommerce/carts/abandoned/recover \
  -d '{"storefront_id": 1, "send_all": true, "min_value": 50}'

# 5. View daily analytics
curl "http://localhost:4000/api/ecommerce/analytics?storefront_id=1"
```

---

### Weekly Operations

```bash
# 1. Review top products
curl "http://localhost:4000/api/ecommerce/analytics?from_date=2024-11-27&to_date=2024-12-04"

# 2. Check sync health
curl "http://localhost:4000/api/ecommerce/products?sync_status=error"

# 3. Review abandoned cart recovery
SELECT * FROM ecommerce_abandoned_carts_summary;

# 4. Analyze multi-channel performance
SELECT * FROM ecommerce_sales_summary;
```

---

## ✅ Success Criteria

Your e-commerce integration is working correctly when:

- [x] Storefronts show `connection_status: "connected"`
- [x] Products sync within 15 minutes
- [x] Orders auto-import via webhooks (< 5 seconds)
- [x] Inventory stays synchronized across all channels
- [x] Abandoned carts are tracked and recovered
- [x] Analytics show accurate sales data
- [x] No sync errors in product/order lists

---

*Last Updated: December 2024*  
*Ocean ERP v4 - E-commerce Integration*
