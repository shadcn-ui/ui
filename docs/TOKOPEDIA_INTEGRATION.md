# Tokopedia Integration Guide

## Overview

Complete integration guide for connecting Ocean ERP with Tokopedia marketplace using their official Open API.

## Prerequisites

1. **Active Tokopedia Seller Account** with verified shop
2. **Tokopedia Developer Account** at [developer.tokopedia.com](https://developer.tokopedia.com)
3. **OAuth 2.0 Credentials** (Client ID & Client Secret)
4. **FS ID** (Fulfillment Service ID) from Seller Center

---

## Getting Started

### Step 1: Register Your Application

1. Visit [Tokopedia Developer Console](https://developer.tokopedia.com)
2. Log in with your Tokopedia account
3. Create a new application
4. Set callback URL: `https://yourdomain.com/api/integrations/tokopedia/callback`
5. Note down your **Client ID** and **Client Secret**

### Step 2: Get Your FS ID and Shop ID

1. Log in to [Tokopedia Seller Center](https://seller.tokopedia.com)
2. Navigate to **Settings** → **Shop Settings**
3. Find your **Shop ID** in the URL or settings page
4. Your **FS ID** (Fulfillment Service ID) can be found in:
   - **Settings** → **Shipping** → **Fulfillment Service**
   - Or via API: `/v1/shop/fs/{fs_id}`

### Step 3: Configure in Ocean ERP

1. Go to **ERP** → **Integrations**
2. Find **Tokopedia** in E-Commerce section
3. Click **Configure**
4. Fill in the required fields:

```
FS ID: [Your Fulfillment Service ID]
Shop ID: [Your Shop ID]
Client ID: [From Developer Console]
Client Secret: [From Developer Console]
```

5. Enable desired API features:
   - ✅ Product Management
   - ✅ Order Management & Fulfillment
   - ✅ Stock & Inventory Sync
   - ⚪ Logistics & Shipping Integration
   - ⚪ Shop Information & Statistics
   - ⚪ Real-time Webhooks

6. Click **Connect & Authorize**

---

## Available API Features

### 1. Product Management

**Endpoints:**
- `POST /v3/products` - Create new products
- `PATCH /v3/products/{product_id}` - Update product details
- `DELETE /v3/products/{product_id}` - Delete products
- `GET /v3/products/info` - Get product information
- `POST /v3/products/variant` - Manage product variants
- `POST /v3/products/upload-image` - Upload product images

**Features:**
- Create, update, and delete products
- Manage product variants (size, color, etc.)
- Upload multiple product images
- Set prices, stock, and descriptions
- Category mapping

### 2. Order Management

**Endpoints:**
- `GET /v2/order/list` - Get order list with filters
- `POST /v1/order/accept` - Accept incoming orders
- `POST /v1/order/reject` - Reject orders (with reasons)
- `POST /v2/order/shipping` - Request shipping pickup
- `POST /v1/order/confirm-shipping` - Confirm shipment

**Features:**
- Real-time order synchronization
- Auto-accept orders (configurable)
- Order fulfillment workflow
- Shipping label generation
- Order status tracking

### 3. Inventory Sync

**Endpoints:**
- `POST /v1/inventory/update` - Update stock quantity
- `POST /v1/inventory/update_stock` - Batch stock update
- `GET /v1/products/info` - Get current stock levels

**Features:**
- Real-time stock synchronization
- Low stock alerts
- Multi-warehouse support
- Automatic stock reservation on order

### 4. Logistics Integration

**Endpoints:**
- `GET /v2/logistic/info` - Get available shipping options
- `POST /v2/logistic/active` - Activate shipping methods
- `GET /v1/order/shipping-label` - Generate shipping labels

**Features:**
- Multiple courier integration
- Automatic shipping cost calculation
- AWB (Airway Bill) generation
- Tracking number sync

### 5. Shop Information

**Endpoints:**
- `GET /v1/shop/info` - Get shop details
- `GET /v1/shop/showcase` - Get shop showcases
- `GET /v1/shop/status` - Check shop status

**Features:**
- Shop performance metrics
- Showcase management
- Shop badge and tier info

### 6. Webhooks (Real-time Notifications)

**Supported Events:**
- `order_notification` - New orders, cancellations
- `product_update` - Product changes from seller center
- `chat_notification` - Customer messages
- `stock_update` - Stock changes

**Configuration:**
```json
{
  "webhook_url": "https://yourdomain.com/api/webhooks/tokopedia",
  "events": ["order_notification", "product_update", "chat_notification"],
  "secret_key": "your-webhook-secret"
}
```

---

## Authentication Flow

### OAuth 2.0 Client Credentials

```http
POST https://accounts.tokopedia.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id={YOUR_CLIENT_ID}
&client_secret={YOUR_CLIENT_SECRET}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Using Access Token

All API requests require Bearer token:

```http
GET https://fs.tokopedia.net/v3/products/info
Authorization: Bearer {ACCESS_TOKEN}
```

---

## Sync Configuration

### Manual Sync
- Click **Sync** button in integrations page
- Syncs: Products, Orders, Inventory

### Auto-Sync Intervals
- **Every 5 minutes** - High-frequency (recommended for active shops)
- **Every 15 minutes** - Moderate frequency
- **Every 30 minutes** - Standard
- **Every hour** - Low-frequency
- **Manual Only** - No automatic sync

### Webhook Mode (Real-time)
- Enable webhooks for instant updates
- No polling required
- Lower API quota usage
- Recommended for production

---

## API Rate Limits

| Endpoint Type | Rate Limit | Notes |
|---------------|------------|-------|
| Product APIs | 100 req/min | Per shop |
| Order APIs | 200 req/min | Per shop |
| Inventory APIs | 150 req/min | Per shop |
| Shop Info | 50 req/min | Per shop |
| Webhooks | Unlimited | Event-driven |

**Best Practices:**
- Use webhooks instead of polling
- Batch operations when possible
- Implement exponential backoff on errors
- Cache shop information

---

## Error Handling

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 401 | Unauthorized | Refresh access token |
| 403 | Forbidden | Check API permissions |
| 429 | Rate Limit Exceeded | Implement backoff strategy |
| 400 | Bad Request | Validate request parameters |
| 500 | Server Error | Retry with exponential backoff |

### Error Response Format

```json
{
  "header": {
    "process_time": 0.123,
    "messages": "Invalid FS ID",
    "reason": "INVALID_FS_ID",
    "error_code": "400"
  },
  "data": null
}
```

---

## Testing

### Sandbox Environment

Tokopedia provides a staging environment:

```
API Base URL: https://staging.fs.tokopedia.net
Auth URL: https://staging.accounts.tokopedia.com/token
```

### Test Shop Setup

1. Create test shop on staging
2. Use staging credentials
3. Test all workflows before production
4. Verify webhook endpoints

---

## Production Checklist

- [ ] OAuth credentials configured
- [ ] FS ID and Shop ID verified
- [ ] Webhook endpoint secured with HTTPS
- [ ] Webhook signature validation implemented
- [ ] Error handling and logging configured
- [ ] Rate limit handling implemented
- [ ] Product catalog synced successfully
- [ ] Test order processed end-to-end
- [ ] Inventory sync verified
- [ ] Monitor API quota usage

---

## Troubleshooting

### Issue: "Invalid FS ID"
**Solution:** Double-check FS ID from Seller Center → Shipping Settings

### Issue: "Token Expired"
**Solution:** Implement automatic token refresh (expires after 3600 seconds)

### Issue: "Product Not Found"
**Solution:** Ensure product exists in Tokopedia before updating

### Issue: "Stock Update Failed"
**Solution:** Check product_id and variant_id are correct

### Issue: "Webhook Not Receiving Events"
**Solution:** 
1. Verify webhook URL is accessible publicly
2. Check SSL certificate is valid
3. Return HTTP 200 within 5 seconds
4. Verify webhook secret configuration

---

## API Reference Links

- **Developer Portal:** https://developer.tokopedia.com
- **API Documentation:** https://developer.tokopedia.com/openapi/guide/
- **Seller Center:** https://seller.tokopedia.com
- **Support:** https://seller.tokopedia.com/edu/

---

## Support

For integration issues:
1. Check Ocean ERP logs: `/var/log/ocean-erp/integrations.log`
2. Review Tokopedia API response errors
3. Contact Ocean ERP support with error details
4. For Tokopedia API issues, contact Tokopedia Developer Support

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2025 | Initial Tokopedia integration |

---

## Next Steps

After successful integration:
1. Configure automatic product sync
2. Set up order notification webhooks
3. Enable inventory management
4. Configure shipping methods
5. Test complete order fulfillment flow
6. Monitor sync logs and performance

---

**Need Help?** Contact Ocean ERP Support Team
