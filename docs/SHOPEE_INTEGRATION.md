# Shopee Integration Guide

## Overview

Complete integration guide for connecting Ocean ERP with Shopee marketplace using the official Shopee Open Platform API.

## Prerequisites

1. **Active Shopee Seller Account** with verified shop
2. **Shopee Open Platform Account** at [open.shopee.com](https://open.shopee.com)
3. **Partner ID & Partner Key** (API credentials)
4. **Shop ID** from Shopee Seller Centre

---

## Getting Started

### Step 1: Register as Shopee Partner

1. Visit [Shopee Open Platform](https://open.shopee.com)
2. Sign up or log in with your Shopee seller account
3. Complete the partner registration
4. Create a new application
5. Set redirect URL: `https://yourdomain.com/api/integrations/shopee/callback`
6. Note down your **Partner ID** and **Partner Key**

### Step 2: Get Your Shop ID

1. Log in to [Shopee Seller Centre](https://seller.shopee.co.id)
2. Navigate to **My Account** → **My Profile**
3. Find your **Shop ID** (numeric identifier)
4. Note: Each region has different Seller Centre URLs:
   - Indonesia: seller.shopee.co.id
   - Singapore: seller.shopee.sg
   - Malaysia: seller.shopee.com.my
   - Thailand: seller.shopee.co.th
   - Taiwan: seller.shopee.tw
   - Philippines: seller.shopee.ph
   - Vietnam: seller.shopee.vn

### Step 3: Configure in Ocean ERP

1. Go to **ERP** → **Integrations**
2. Find **Shopee** in E-Commerce section
3. Click **Configure**
4. Fill in the required fields:

```
Partner ID: [Your Partner ID from Open Platform]
Partner Key: [Your Partner Key]
Shop ID: [Your Shop ID from Seller Centre]
Region: [Select your marketplace region]
```

5. Enable desired API features:
   - ✅ Product Management
   - ✅ Order Management & Shipping
   - ✅ Stock & Price Sync
   - ⚪ Logistics & Tracking
   - ⚪ Promotions & Discounts
   - ⚪ Returns & Refunds
   - ⚪ Chat API
   - ⚪ Shop Performance & Analytics

6. Click **Connect & Authorize**

---

## Available API Features

### 1. Product Management

**Endpoints:**
- `POST /api/v2/product/add_item` - Add new products
- `POST /api/v2/product/update_item` - Update product details
- `POST /api/v2/product/delete_item` - Delete products
- `GET /api/v2/product/get_item_list` - Get product list
- `GET /api/v2/product/get_item_base_info` - Get product details
- `POST /api/v2/product/update_stock` - Update stock levels
- `POST /api/v2/product/update_price` - Update prices
- `POST /api/v2/product/boost_item` - Boost product visibility
- `GET /api/v2/product/get_category` - Get category tree

**Features:**
- Create, update, and delete products
- Manage product variations (size, color, etc.)
- Upload multiple product images (up to 9)
- Set prices, stock, and SKU
- Category and attribute mapping
- Product boosting and promotion

### 2. Order Management

**Endpoints:**
- `GET /api/v2/order/get_order_list` - Get orders with filters
- `GET /api/v2/order/get_order_detail` - Get order details
- `GET /api/v2/order/get_shipment_list` - Get shipping info
- `POST /api/v2/logistics/get_tracking_number` - Get tracking number
- `POST /api/v2/logistics/ship_order` - Arrange shipment
- `POST /api/v2/order/cancel_order` - Cancel order

**Features:**
- Real-time order synchronization
- Order status tracking
- Shipping arrangement
- Tracking number generation
- Order cancellation management
- Bulk order processing

### 3. Inventory & Pricing

**Endpoints:**
- `POST /api/v2/product/update_stock` - Update stock quantity
- `POST /api/v2/product/update_price` - Update product price
- `POST /api/v2/product/update_variation_stock` - Update variant stock
- `POST /api/v2/product/update_variation_price` - Update variant price

**Features:**
- Real-time stock synchronization
- Price updates (including promotional prices)
- Multi-variation support
- Batch update capability
- Low stock alerts
- Price scheduling

### 4. Logistics Integration

**Endpoints:**
- `GET /api/v2/logistics/get_channel_list` - Get available logistics
- `GET /api/v2/logistics/get_tracking_info` - Track shipments
- `POST /api/v2/logistics/init` - Initialize logistics
- `GET /api/v2/logistics/get_address_list` - Get pickup addresses
- `POST /api/v2/logistics/set_address` - Set pickup address

**Features:**
- Multiple courier integration
- Real-time tracking
- Pickup arrangement
- Shipping label generation
- COD support
- Cross-border shipping

### 5. Promotions & Marketing

**Endpoints:**
- `GET /api/v2/discount/get_discount` - Get discount details
- `POST /api/v2/discount/add_discount` - Create discount
- `POST /api/v2/discount/update_discount` - Update discount
- `POST /api/v2/discount/delete_discount` - Delete discount
- `GET /api/v2/voucher/get_voucher` - Get voucher info
- `POST /api/v2/add_on_deal/add_add_on_deal` - Create bundle deals

**Features:**
- Discount management
- Voucher creation
- Flash sales
- Add-on deals
- Bundle promotions
- Cashback campaigns

### 6. Returns & Refunds

**Endpoints:**
- `GET /api/v2/returns/get_return_list` - Get return requests
- `GET /api/v2/returns/get_return_detail` - Get return details
- `POST /api/v2/returns/confirm` - Confirm return
- `POST /api/v2/returns/dispute` - Dispute return

**Features:**
- Return request management
- Refund processing
- Dispute handling
- Return tracking
- Automated refund approval

### 7. Chat API

**Endpoints:**
- `GET /api/v2/sellerchat/get_message` - Get customer messages
- `POST /api/v2/sellerchat/send_message` - Send reply
- `GET /api/v2/sellerchat/get_conversation_list` - Get conversations
- `POST /api/v2/sellerchat/upload_image` - Upload chat image

**Features:**
- Customer message management
- Auto-reply capability
- Image sharing in chat
- Conversation history
- Unread message alerts

### 8. Shop Performance

**Endpoints:**
- `GET /api/v2/shop/get_shop_info` - Get shop details
- `GET /api/v2/shop/get_profile` - Get shop profile
- `GET /api/v2/shop/update_profile` - Update profile
- `GET /api/v2/merchant/get_merchant_info` - Get merchant info

**Features:**
- Shop performance metrics
- Rating and review stats
- Sales analytics
- Product performance
- Shop badge info

### 9. Push Notifications (Webhooks)

**Supported Events:**
- `order_status` - Order status changes
- `order_tracking` - Shipping updates
- `item_promotion` - Promotion updates
- `banned_item` - Product violations
- `product_update` - Product changes from seller centre

**Configuration:**
```json
{
  "webhook_url": "https://yourdomain.com/api/webhooks/shopee",
  "events": ["order_status", "order_tracking", "item_promotion"],
  "sign_type": "HMAC-SHA256"
}
```

---

## Authentication Flow

### Shop Authorization (OAuth 2.0)

```http
Step 1: Get Authorization Code
GET https://partner.shopeemobile.com/api/v2/shop/auth_partner

Parameters:
- partner_id: Your Partner ID
- redirect: Your callback URL
- timestamp: Current Unix timestamp
- sign: HMAC-SHA256 signature

Response: Redirects to callback with code
```

```http
Step 2: Get Access Token
POST https://partner.shopeemobile.com/api/v2/auth/token/get

Body:
{
  "code": "authorization_code",
  "shop_id": 12345,
  "partner_id": 98765
}

Response:
{
  "access_token": "access_token_value",
  "refresh_token": "refresh_token_value",
  "expire_in": 14400,
  "shop_id_list": [12345]
}
```

### API Request Authentication

All API requests require:

1. **Partner ID** in URL or header
2. **Timestamp** (Unix seconds)
3. **Access Token** (for shop-level APIs)
4. **Signature** (HMAC-SHA256)

**Signature Generation:**
```
base_string = partner_id + path + timestamp + access_token + body
signature = HMAC-SHA256(base_string, partner_key)
```

**Example Request:**
```http
POST https://partner.shopeemobile.com/api/v2/product/get_item_list
Content-Type: application/json

Headers:
- partner_id: 98765
- timestamp: 1638158888
- access_token: access_token_value
- sign: generated_signature

Body:
{
  "shop_id": 12345,
  "offset": 0,
  "page_size": 50
}
```

---

## Region-Specific Details

### API Base URLs by Region

| Region | Base URL | Seller Centre |
|--------|----------|---------------|
| Indonesia | https://partner.shopeemobile.com | seller.shopee.co.id |
| Singapore | https://partner.shopeemobile.com | seller.shopee.sg |
| Malaysia | https://partner.shopeemobile.com | seller.shopee.com.my |
| Thailand | https://partner.shopeemobile.com | seller.shopee.co.th |
| Taiwan | https://partner.shopeemobile.com | seller.shopee.tw |
| Philippines | https://partner.shopeemobile.com | seller.shopee.ph |
| Vietnam | https://partner.shopeemobile.com | seller.shopee.vn |

### Regional Differences

**Indonesia Specifics:**
- COD (Cash on Delivery) widely used
- ShopeePay integration
- Multiple logistics partners (J&T, JNE, SiCepat, etc.)
- Shopee Mall requirements

**Singapore Specifics:**
- Credit card dominant
- Faster shipping expectations
- English language only
- Stricter product regulations

**Multi-Region Operations:**
- Separate Partner ID per region
- Independent product catalogs
- Region-specific pricing
- Local currency handling

---

## Sync Configuration

### Manual Sync
- Click **Sync** button in integrations page
- Syncs: Products, Orders, Inventory, Pricing

### Auto-Sync Intervals
- **Every 5 minutes** - High-frequency (for active shops)
- **Every 15 minutes** - Recommended for most shops
- **Every 30 minutes** - Standard frequency
- **Every hour** - Low-frequency
- **Manual Only** - No automatic sync

### Push Notifications (Recommended)
- Enable webhooks for instant updates
- No polling required
- Lower API quota usage
- Real-time order notifications

---

## API Rate Limits

### Call Limits per Shop

| API Category | Rate Limit | Notes |
|--------------|------------|-------|
| Product APIs | 1,000 calls/min | Per shop |
| Order APIs | 1,000 calls/min | Per shop |
| Logistics APIs | 1,000 calls/min | Per shop |
| Chat APIs | 100 calls/min | Per shop |
| Shop APIs | 100 calls/min | Per shop |
| Global APIs | 10,000 calls/min | Per partner |

### Best Practices
- Use push notifications instead of polling
- Batch API calls when possible
- Implement exponential backoff on rate limit errors
- Cache shop and product information
- Use webhooks for real-time updates

---

## Error Handling

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 403 | Invalid signature | Check signature calculation |
| 401 | Token expired | Refresh access token |
| 429 | Rate limit exceeded | Implement backoff strategy |
| 1000 | Invalid parameter | Validate request parameters |
| 1001 | Shop authorization expired | Re-authorize shop |
| 1002 | Product not found | Check product ID |
| 1003 | Insufficient stock | Update stock levels |

### Error Response Format

```json
{
  "error": "error_code",
  "message": "Error description",
  "request_id": "unique_request_id"
}
```

---

## Testing

### Sandbox Environment

Shopee provides a test environment:

```
Test Base URL: https://partner.test-stable.shopeemobile.com
Test Seller Centre: https://seller.test.shopee.co.id
```

### Test Flow

1. Create test shop in sandbox
2. Use sandbox Partner ID and Key
3. Test all API endpoints
4. Verify webhook functionality
5. Test error scenarios
6. Move to production after validation

---

## Production Checklist

- [ ] Partner credentials configured
- [ ] Shop ID verified
- [ ] Region selected correctly
- [ ] Webhook endpoint secured with HTTPS
- [ ] Webhook signature validation implemented
- [ ] Token refresh mechanism implemented
- [ ] Error handling and logging configured
- [ ] Rate limit handling implemented
- [ ] Product catalog synced successfully
- [ ] Test order processed end-to-end
- [ ] Inventory sync verified
- [ ] Monitor API quota usage
- [ ] Set up alerting for errors

---

## Troubleshooting

### Issue: "Invalid Signature"
**Solution:** 
1. Check Partner Key is correct
2. Verify signature calculation (base string order)
3. Ensure timestamp is within 5 minutes of server time
4. Check URL encoding of parameters

### Issue: "Token Expired"
**Solution:** Implement automatic token refresh using refresh_token (expires after 60 days)

### Issue: "Product Upload Failed"
**Solution:** 
1. Verify all required fields are present
2. Check category ID is valid
3. Ensure images are properly formatted (JPG/PNG, max 2MB each)
4. Validate attribute values match category requirements

### Issue: "Order Sync Missing Orders"
**Solution:** 
1. Check time_range parameter
2. Verify order status filters
3. Ensure shop_id is correct
4. Check for pagination (max 100 orders per call)

### Issue: "Webhook Not Receiving Events"
**Solution:** 
1. Verify webhook URL is accessible publicly
2. Check SSL certificate is valid
3. Return HTTP 200 within 5 seconds
4. Verify signature validation logic
5. Check partner portal webhook settings

---

## Advanced Features

### Multi-Variation Products

```json
{
  "item_name": "T-Shirt",
  "variation": [
    {
      "name": "Size",
      "options": ["S", "M", "L", "XL"]
    },
    {
      "name": "Color",  
      "options": ["Red", "Blue", "Black"]
    }
  ],
  "tier_variation": [
    {
      "variation_sku": "TS-RED-S",
      "stock": 10,
      "price": 99000
    }
  ]
}
```

### Bundle Deals

```json
{
  "add_on_deal_name": "Buy 2 Get Discount",
  "promotion_type": "bundle",
  "item_list": [
    {
      "item_id": 12345,
      "sub_item_limit": 2,
      "sub_item_priority": 1
    }
  ],
  "promotion_price": 150000
}
```

### Flash Sales

Shopee Flash Sales are platform-managed:
- Register products for flash sale slots
- Set flash sale price
- Limited time period
- High visibility on platform

---

## API Reference Links

- **Shopee Open Platform:** https://open.shopee.com
- **API Documentation:** https://open.shopee.com/documents
- **Seller Centre:** https://seller.shopee.co.id (varies by region)
- **Developer Forum:** https://open.shopee.com/forum
- **API Updates:** https://open.shopee.com/documents/v2/v2.common.release_log

---

## Support

### Integration Issues
1. Check Ocean ERP logs: `/var/log/ocean-erp/integrations.log`
2. Review Shopee API response errors
3. Contact Ocean ERP support with error details

### Shopee API Issues
1. Check Shopee API status page
2. Review error codes in documentation
3. Contact Shopee Partner Support
4. Post in Shopee Developer Forum

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2025 | Initial Shopee integration |

---

## Comparison: Shopee vs Tokopedia

| Feature | Shopee | Tokopedia |
|---------|--------|-----------|
| **Authentication** | Partner ID + Partner Key | Client ID + Client Secret (OAuth 2.0) |
| **Shop Identifier** | Shop ID | FS ID + Shop ID |
| **Regions** | 7 countries (SEA) | Indonesia only |
| **Product Images** | Max 9 images | Multiple images |
| **Variations** | 2-tier system | Multiple variants |
| **Chat API** | ✅ Available | ❌ Not available in Open API |
| **Promotions** | Rich promotion APIs | Limited |
| **Webhooks** | Push notifications | Webhooks |
| **Rate Limits** | 1,000 calls/min/shop | 100-200 calls/min |

---

## Next Steps

After successful integration:
1. Configure automatic product sync
2. Set up order notification webhooks
3. Enable inventory management
4. Configure logistics preferences
5. Test complete order fulfillment flow
6. Set up promotional campaigns
7. Monitor sync logs and performance
8. Enable chat API for customer service

---

**Need Help?** Contact Ocean ERP Support Team
