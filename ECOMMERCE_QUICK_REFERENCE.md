# E-Commerce Integrations - Quick Reference

## 🚀 Quick Start

### 1. Connect a Platform

**Shopee:**
```typescript
import { createShopeeClient } from '@/lib/integrations/shopee-api-client';

const client = createShopeeClient({
  partnerId: 123456,
  partnerKey: 'your_partner_key',
  shopId: 111111,
  region: 'ID',
  sandbox: false,
  accessToken: 'your_access_token'
});

// Authorize (first time)
const authUrl = client.generateAuthUrl('https://yourapp.com/callback');
// Redirect user to authUrl

// Get token after authorization
const auth = await client.getAccessToken(authCode, shopId);
```

**TikTok Shop:**
```typescript
import { createTikTokShopClient } from '@/lib/integrations/tiktok-shop-api-client';

const client = createTikTokShopClient({
  appKey: 'your_app_key',
  appSecret: 'your_app_secret',
  sandbox: false
});

// Authorize
const authUrl = client.generateAuthUrl('https://yourapp.com/callback');
const auth = await client.getAccessToken(authCode);
```

**Tokopedia:**
```typescript
import { createTokopediaClient } from '@/lib/integrations/tokopedia-api-client';

const client = createTokopediaClient({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  fsId: 'your_fs_id',
  shopId: 'your_shop_id'
});

// Get token
const auth = await client.getAccessToken();
```

---

## 📦 Product Operations

### Sync Product to Platform
```typescript
import { ProductSyncService } from '@/lib/services/product-sync-service';

// Single product
await ProductSyncService.syncProductToPlatform(
  productId: 123,
  storefrontId: 1,
  platform: 'shopee',
  credentials
);

// Bulk sync
await ProductSyncService.bulkSyncToPlatform(
  productIds: [1, 2, 3],
  storefrontId: 1,
  platform: 'tiktok',
  credentials
);
```

### Import Products from Platform
```typescript
// Import all products
await ProductSyncService.bulkSyncFromPlatform(
  storefrontId: 1,
  platform: 'tokopedia',
  credentials
);
```

### Update Stock
```typescript
import { StockSyncService } from '@/lib/services/fulfillment-stock-chat-services';

// Sync to all platforms
await StockSyncService.syncStockToAllPlatforms(
  productId: 123,
  newStock: 50
);

// Or update via ProductSyncService
await ProductSyncService.syncStock(
  productId: 123,
  storefrontId: 1,
  platform: 'shopee',
  credentials,
  newStock: 50
);
```

### Update Price
```typescript
await ProductSyncService.syncPrice(
  productId: 123,
  storefrontId: 1,
  platform: 'tiktok',
  credentials,
  newPrice: 99000
);
```

---

## 🛒 Order Operations

### Import Orders
```typescript
import { OrderSyncService } from '@/lib/services/order-sync-service';

// Import orders within date range
await OrderSyncService.syncOrdersFromPlatform(
  storefrontId: 1,
  platform: 'shopee',
  credentials,
  {
    startDate: new Date('2025-01-01'),
    endDate: new Date()
  }
);

// Import single order
await OrderSyncService.syncSingleOrder(
  platformOrderId: 'ORDER123',
  storefrontId: 1,
  platform: 'tokopedia',
  credentials
);
```

### Update Order Status
```typescript
await OrderSyncService.updateOrderStatus(
  erpOrderId: 456,
  storefrontId: 1,
  platform: 'tiktok',
  credentials,
  newStatus: 'SHIPPED',
  trackingNumber: 'TRACK123'
);
```

### Cancel Order
```typescript
await OrderSyncService.cancelOrder(
  erpOrderId: 456,
  storefrontId: 1,
  platform: 'shopee',
  credentials,
  cancelReason: 'Out of stock'
);
```

---

## 📮 Fulfillment

### Accept Order
```typescript
import { FulfillmentService } from '@/lib/services/fulfillment-stock-chat-services';

await FulfillmentService.acceptOrder(
  erpOrderId: 456,
  storefrontId: 1,
  platform: 'tokopedia',
  credentials
);
```

### Ship Order
```typescript
await FulfillmentService.shipOrder(
  erpOrderId: 456,
  storefrontId: 1,
  platform: 'tiktok',
  credentials,
  trackingNumber: 'TRACK123',
  carrier: 'JNE'
);
```

### Get Shipping Label
```typescript
const result = await FulfillmentService.getShippingLabel(
  erpOrderId: 456,
  storefrontId: 1,
  platform: 'tiktok',
  credentials
);

console.log(result.labelUrl); // Download URL
```

### Bulk Fulfillment
```typescript
await FulfillmentService.bulkFulfillOrders(
  orderIds: [1, 2, 3],
  storefrontId: 1,
  platform: 'shopee',
  credentials
);
```

---

## 💬 Chat (Shopee Only)

```typescript
import { ChatService } from '@/lib/services/fulfillment-stock-chat-services';

// Get unread messages
const messages = await ChatService.fetchUnreadMessages(
  storefrontId: 1,
  credentials
);

// Send reply
await ChatService.sendReply(
  conversationId: 'CONV123',
  toId: 'USER456',
  message: 'Hello! How can I help you?',
  credentials
);

// Mark as read
await ChatService.markAsRead(
  conversationId: 'CONV123',
  messageIds: ['MSG1', 'MSG2'],
  credentials
);
```

---

## 📊 Analytics

```typescript
import { AnalyticsService } from '@/lib/services/analytics-service';

// Platform metrics
const metrics = await AnalyticsService.getPlatformMetrics(
  storefrontId: 1,
  platform: 'shopee',
  credentials,
  startDate: new Date('2025-01-01'),
  endDate: new Date()
);

// Comparative analytics (all platforms)
const comparison = await AnalyticsService.getComparativeAnalytics(
  startDate: new Date('2025-01-01'),
  endDate: new Date()
);

// Sales trend
const trend = await AnalyticsService.getSalesTrend(days: 30);

// Top products
const topProducts = await AnalyticsService.getTopSellingProducts(limit: 20);

// Inventory health
const inventory = await AnalyticsService.getInventoryAnalytics();

// Sync to data warehouse
await AnalyticsService.syncSalesToWarehouse(
  startDate: new Date('2025-01-01'),
  endDate: new Date()
);
```

---

## 🔌 API Routes

### Sync Products
```bash
POST /api/integrations/sync-products
Content-Type: application/json

{
  "storefrontId": 1,
  "platform": "shopee",
  "productIds": [1, 2, 3],
  "direction": "to_platform"  // or "from_platform"
}
```

### Sync Orders
```bash
POST /api/integrations/sync-orders
Content-Type: application/json

{
  "storefrontId": 1,
  "platform": "tiktok",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31"
}
```

### Sync Stock
```bash
POST /api/integrations/sync-stock
Content-Type: application/json

{
  "productId": 123,
  "newStock": 50
}
```

### Get Analytics
```bash
GET /api/integrations/analytics?days=30
```

---

## 🗄️ Database Queries

### Get Product Mappings
```sql
SELECT * FROM integration_mappings 
WHERE entity_type = 'product' AND internal_id = 123;
```

### Get Orders for Platform
```sql
SELECT * FROM ecommerce_orders 
WHERE storefront_id = 1 AND status = 'NEW'
ORDER BY created_at DESC;
```

### Check Sync Status
```sql
SELECT 
  i.name,
  i.status,
  i.last_sync_at,
  i.sync_count,
  i.error_count
FROM integrations i
WHERE i.enabled = true;
```

### Inventory Health
```sql
SELECT 
  p.id,
  p.name,
  p.sku,
  inv.quantity,
  inv.reserved,
  (inv.quantity - inv.reserved) as available
FROM products p
JOIN inventory inv ON inv.product_id = p.id
WHERE inv.quantity < 10;
```

---

## ⚙️ Configuration Examples

### Storefront Config (Shopee)
```json
{
  "shopId": 111111,
  "region": "ID",
  "sandbox": false,
  "refreshToken": "abc123..."
}
```

### Storefront Config (TikTok)
```json
{
  "warehouseId": "WAREHOUSE123",
  "shippingProviderId": "PROVIDER456",
  "sandbox": false
}
```

### Storefront Config (Tokopedia)
```json
{
  "fsId": "123456",
  "shopId": "789012",
  "sandbox": false
}
```

---

## 🔥 Common Patterns

### Full Product Sync Workflow
```typescript
// 1. Fetch ERP products
const products = await db.query('SELECT * FROM products WHERE active = true');

// 2. Sync to platform
for (const product of products.rows) {
  await ProductSyncService.syncProductToPlatform(
    product.id,
    storefrontId,
    platform,
    credentials
  );
}

// 3. Verify mappings
const mappings = await db.query(
  'SELECT * FROM integration_mappings WHERE entity_type = $1',
  ['product']
);
```

### Order Import + Fulfillment
```typescript
// 1. Import new orders
const orderResult = await OrderSyncService.syncOrdersFromPlatform(
  storefrontId,
  platform,
  credentials,
  { startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) }
);

// 2. Auto-accept orders
for (const order of newOrders) {
  await FulfillmentService.acceptOrder(order.id, storefrontId, platform, credentials);
}

// 3. Reserve stock
for (const item of order.items) {
  await StockSyncService.reserveStock(item.productId, item.quantity);
}
```

### Stock Update Broadcast
```typescript
// Update ERP inventory
await db.query('UPDATE inventory SET quantity = $1 WHERE product_id = $2', [newStock, productId]);

// Broadcast to all platforms
await StockSyncService.syncStockToAllPlatforms(productId, newStock);
```

---

## 🛠️ Troubleshooting

### Check Integration Logs
```sql
SELECT * FROM integration_logs 
WHERE status = 'error' 
ORDER BY created_at DESC 
LIMIT 50;
```

### Verify Token Expiry
```typescript
const storefront = await db.query(
  'SELECT config FROM ecommerce_storefronts WHERE storefront_id = $1',
  [storefrontId]
);

const tokenExpiresAt = storefront.rows[0].config?.tokenExpiresAt;
const isExpired = Date.now() > tokenExpiresAt;
```

### Resync Failed Products
```sql
SELECT * FROM ecommerce_products 
WHERE sync_status = 'error' 
AND storefront_id = 1;
```

---

## 📚 References

- [Shopee Open Platform](https://open.shopee.com/documents)
- [TikTok Shop API](https://partner.tiktokshop.com/docv2/)
- [Tokopedia API](https://developer.tokopedia.com/openapi/guide/)
- [Implementation Guide](./ECOMMERCE_INTEGRATIONS_COMPLETE.md)
