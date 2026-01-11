# TikTok Shop Integration Guide

## Overview

Complete integration guide for connecting Ocean ERP with TikTok Shop marketplace using the official TikTok Shop Seller API. TikTok Shop combines social commerce with short-form video content, enabling sellers to reach millions of engaged users through product listings, live shopping, and creator partnerships.

## Prerequisites

1. **Active TikTok Shop Seller Account** with approved shop
2. **TikTok Shop Partner Center Access** at [partner.tiktokshop.com](https://partner.tiktokshop.com)
3. **App Key & App Secret** (API credentials)
4. **Shop ID** from TikTok Shop Seller Center
5. **Business verification** (required for API access)

---

## Getting Started

### Step 1: Register as TikTok Shop Partner

1. Visit [TikTok Shop Partner Center](https://partner.tiktokshop.com)
2. Log in with your TikTok Shop seller account
3. Navigate to **Development** → **My Apps**
4. Click **Create App**
5. Fill in app information:
   - App Name
   - App Description
   - Redirect URI: `https://yourdomain.com/api/integrations/tiktok/callback`
6. Select required API permissions
7. Submit for review
8. Once approved, note down your **App Key** and **App Secret**

### Step 2: Get Your Shop ID

1. Log in to [TikTok Shop Seller Center](https://seller.tiktokshop.com)
2. Navigate to **Settings** → **Shop Settings**
3. Find your **Shop ID** (also called Shop Cipher)
4. Note: Each region has different Seller Center URLs:
   - United States: seller-us.tiktokshop.com
   - United Kingdom: seller-uk.tiktokshop.com
   - Indonesia: seller-id.tiktokshop.com
   - Singapore: seller-sg.tiktokshop.com
   - Malaysia: seller-my.tiktokshop.com
   - Thailand: seller-th.tiktokshop.com
   - Vietnam: seller-vn.tiktokshop.com
   - Philippines: seller-ph.tiktokshop.com

### Step 3: Configure in Ocean ERP

1. Go to **ERP** → **Integrations**
2. Find **TikTok Shop** in E-Commerce section
3. Click **Configure**
4. Fill in the required fields:

```
App Key: [Your App Key from Partner Center]
App Secret: [Your App Secret]
Shop ID: [Your Shop ID from Seller Center]
Region: [Select your marketplace region]
```

5. Enable desired API features:
   - ✅ Product Catalog Management
   - ✅ Order & Fulfillment
   - ✅ Inventory & Stock Sync
   - ⚪ Logistics & Shipping
   - ⚪ Promotions & Campaigns
   - ⚪ Returns & Cancellations
   - ⚪ Live Shopping Integration
   - ⚪ Affiliate & Creator Programs
   - ⚪ Shop Analytics & Insights

6. Click **Connect & Authorize**

---

## Available API Features

### 1. Product Catalog Management

**Endpoints:**
- `POST /api/products/upload` - Create new products
- `PUT /api/products/{product_id}` - Update product details
- `DELETE /api/products/{product_id}` - Delete products
- `GET /api/products/search` - Search products
- `GET /api/products/{product_id}` - Get product details
- `POST /api/products/update_stock` - Update inventory
- `POST /api/products/update_price` - Update prices
- `POST /api/products/activate` - Activate products
- `POST /api/products/deactivate` - Deactivate products
- `GET /api/products/categories` - Get category tree

**Features:**
- Create and manage product listings
- Support for single and variation products
- Upload up to 9 product images + 1 video
- Set prices, SKU, and stock levels
- Category and attribute mapping
- Product status management (active/inactive)
- Bulk product operations

**Product Structure:**
```json
{
  "title": "Premium T-Shirt",
  "description": "High quality cotton t-shirt",
  "category_id": "123456",
  "brand_id": "789",
  "images": ["url1", "url2"],
  "video": "video_url",
  "skus": [
    {
      "seller_sku": "TS-RED-M",
      "original_price": 299000,
      "sales_attributes": [
        {"attribute_id": "size", "value_id": "M"},
        {"attribute_id": "color", "value_id": "Red"}
      ],
      "stock_infos": [
        {"warehouse_id": "default", "available_stock": 100}
      ]
    }
  ],
  "package_dimensions": {
    "length": "30",
    "width": "20",
    "height": "5",
    "unit": "CENTIMETER"
  },
  "package_weight": {
    "value": "200",
    "unit": "GRAM"
  }
}
```

### 2. Order Management

**Endpoints:**
- `GET /api/orders/search` - Get orders with filters
- `GET /api/orders/{order_id}` - Get order details
- `POST /api/orders/confirm` - Confirm order
- `POST /api/orders/cancel` - Cancel order
- `POST /api/fulfillment/rts` - Ready to ship
- `GET /api/fulfillment/detail` - Get fulfillment details
- `POST /api/fulfillment/ship` - Ship package

**Features:**
- Real-time order synchronization
- Order status tracking (Unpaid → Processing → Shipped → Completed)
- Order confirmation and cancellation
- Fulfillment management
- Multiple shipping options
- Tracking number integration
- Bulk order processing

**Order Statuses:**
- `UNPAID` - Awaiting payment
- `AWAITING_SHIPMENT` - Paid, awaiting fulfillment
- `AWAITING_COLLECTION` - Ready for pickup
- `IN_TRANSIT` - Shipped
- `DELIVERED` - Successfully delivered
- `COMPLETED` - Order completed
- `CANCELLED` - Order cancelled

### 3. Inventory Management

**Endpoints:**
- `POST /api/products/update_stock` - Update stock levels
- `POST /api/products/stocks` - Batch stock update
- `GET /api/warehouse/list` - Get warehouse list
- `GET /api/warehouse/detail` - Get warehouse details

**Features:**
- Real-time stock synchronization
- Multi-warehouse support
- Stock reservation for pending orders
- Low stock alerts
- Batch inventory updates
- Stock history tracking

### 4. Logistics & Shipping

**Endpoints:**
- `GET /api/logistics/shipping_providers` - Get available carriers
- `GET /api/logistics/shipping_document` - Get shipping labels
- `POST /api/logistics/tracking_number` - Update tracking info
- `GET /api/logistics/tracking` - Track shipments

**Features:**
- Multiple courier integration
- Shipping label generation
- Real-time tracking updates
- Delivery confirmation
- International shipping support
- COD (Cash on Delivery) support in select regions

### 5. Promotions & Campaigns

**Endpoints:**
- `GET /api/promotion/activity/list` - Get promotion list
- `GET /api/promotion/activity/detail` - Get promotion details
- `POST /api/promotion/product/add` - Add products to promotion
- `DELETE /api/promotion/product/remove` - Remove from promotion
- `GET /api/seller_voucher/list` - Get voucher list
- `POST /api/seller_voucher/create` - Create shop voucher

**Features:**
- Flash sale participation
- Shop vouchers and discounts
- Bundle deals
- Limited-time offers
- Exclusive promotions for followers
- Affiliate commission management

### 6. Returns & Cancellations

**Endpoints:**
- `GET /api/returns/list` - Get return requests
- `GET /api/returns/{return_id}` - Get return details
- `POST /api/returns/approve` - Approve return
- `POST /api/returns/reject` - Reject return
- `POST /api/reverse_logistics/update` - Update return tracking

**Features:**
- Return request management
- Refund processing
- Cancellation handling
- Return tracking
- Dispute resolution
- Automated refund approval rules

### 7. Live Shopping Integration

**Endpoints:**
- `GET /api/live/list` - Get live session list
- `POST /api/live/products/add` - Add products to live session
- `GET /api/live/products/list` - Get live session products
- `POST /api/live/products/update` - Update live product info

**Features:**
- Schedule live shopping sessions
- Manage live session products
- Real-time inventory during live
- Flash sale during live streaming
- Live session analytics
- Creator collaboration for live events

### 8. Affiliate & Creator Programs

**Endpoints:**
- `GET /api/affiliate/creators` - Get affiliated creators
- `POST /api/affiliate/products/add` - Add products to affiliate program
- `GET /api/affiliate/orders` - Get affiliate-generated orders
- `GET /api/affiliate/commission` - Get commission details

**Features:**
- Enable affiliate marketing
- Set commission rates
- Track creator performance
- Manage product samples for creators
- Video content tracking
- Commission payout management

### 9. Shop Analytics & Insights

**Endpoints:**
- `GET /api/data/shop_overview` - Get shop performance metrics
- `GET /api/data/product_analytics` - Get product performance
- `GET /api/data/order_stats` - Get order statistics
- `GET /api/data/traffic_analytics` - Get traffic sources

**Features:**
- Sales performance metrics
- Product view and conversion rates
- Traffic source analysis
- Customer behavior insights
- Video engagement metrics
- Live session performance
- Affiliate contribution tracking

---

## Authentication Flow

### Shop Authorization (OAuth 2.0)

TikTok Shop uses OAuth 2.0 for shop-level authorization:

```http
Step 1: Get Authorization URL
https://services.tiktokshop.com/open/authorize?app_key={APP_KEY}&state={STATE}

Parameters:
- app_key: Your App Key
- state: Random string for CSRF protection

Response: Redirects to your callback URL with authorization code
```

```http
Step 2: Exchange Code for Access Token
POST https://auth.tiktokshop.com/api/v2/token/get

Body:
{
  "app_key": "your_app_key",
  "app_secret": "your_app_secret",
  "auth_code": "authorization_code",
  "grant_type": "authorized_code"
}

Response:
{
  "access_token": "access_token_value",
  "access_token_expire_in": 86400,
  "refresh_token": "refresh_token_value",
  "refresh_token_expire_in": 7776000,
  "open_id": "seller_open_id",
  "seller_name": "Shop Name",
  "seller_base_region": "US",
  "user_type": 0
}
```

### API Request Signature

All API requests require HMAC-SHA256 signature:

**Signature Calculation:**
```javascript
// For GET requests
const sign_string = app_key + timestamp + access_token + path
const sign = HMAC_SHA256(sign_string, app_secret)

// For POST requests with body
const sign_string = app_key + timestamp + access_token + path + body
const sign = HMAC_SHA256(sign_string, app_secret)
```

**Example Request:**
```http
POST https://open-api.tiktokshop.com/api/products/search
Content-Type: application/json

Headers:
- x-tts-access-token: your_access_token
- content-type: application/json

Query Parameters:
- app_key: your_app_key
- timestamp: 1638158888
- sign: calculated_signature

Body:
{
  "page_size": 20,
  "page_number": 1,
  "search_status": 1
}
```

### Token Refresh

Access tokens expire after 24 hours. Use refresh token to get new access token:

```http
POST https://auth.tiktokshop.com/api/v2/token/refresh

Body:
{
  "app_key": "your_app_key",
  "app_secret": "your_app_secret",
  "refresh_token": "your_refresh_token",
  "grant_type": "refresh_token"
}
```

---

## Region-Specific Details

### API Base URLs by Region

| Region | Base URL | Seller Center |
|--------|----------|---------------|
| United States | https://open-api.tiktokshop.com | seller-us.tiktokshop.com |
| United Kingdom | https://open-api.tiktokshop.com | seller-uk.tiktokshop.com |
| Indonesia | https://open-api.tiktokshop.com | seller-id.tiktokshop.com |
| Singapore | https://open-api.tiktokshop.com | seller-sg.tiktokshop.com |
| Malaysia | https://open-api.tiktokshop.com | seller-my.tiktokshop.com |
| Thailand | https://open-api.tiktokshop.com | seller-th.tiktokshop.com |
| Vietnam | https://open-api.tiktokshop.com | seller-vn.tiktokshop.com |
| Philippines | https://open-api.tiktokshop.com | seller-ph.tiktokshop.com |

**Note:** All regions use the same API base URL, but responses and features may vary by region.

### Regional Differences

**United States & United Kingdom:**
- English language only
- USD/GBP pricing
- Stricter product compliance
- FBA (Fulfillment by TikTok) available
- No COD support

**Southeast Asia (ID, SG, MY, TH, VN, PH):**
- Local language support
- Local currency (IDR, SGD, MYR, THB, VND, PHP)
- COD widely used in ID, TH, VN, PH
- Local payment methods
- Regional logistics partners
- Lower price points
- Live shopping highly popular

**Indonesia Specifics:**
- Largest TikTok Shop market in SEA
- Heavy use of COD
- Local e-wallet integration (OVO, GoPay, Dana)
- Bahasa Indonesia product descriptions recommended
- Influencer marketing highly effective

---

## Sync Configuration

### Manual Sync
- Click **Sync** button in integrations page
- Syncs: Products, Orders, Inventory, Analytics

### Auto-Sync Intervals
- **Every 5 minutes** - High-frequency (for active shops with live events)
- **Every 15 minutes** - Recommended for most shops
- **Every 30 minutes** - Standard frequency
- **Every hour** - Low-frequency
- **Manual Only** - No automatic sync

### Webhook Notifications (Recommended)

Enable webhooks for real-time updates:

**Supported Events:**
- `ORDER_STATUS_CHANGE` - Order status updates
- `PRODUCT_CHANGE` - Product updates from seller center
- `RETURN_STATUS_CHANGE` - Return request updates
- `REVERSE_ORDER_STATUS_CHANGE` - Cancellation updates
- `PACKAGE_UPDATE` - Shipping updates

**Webhook Configuration:**
```json
{
  "url": "https://yourdomain.com/api/webhooks/tiktok",
  "events": [
    "ORDER_STATUS_CHANGE",
    "PRODUCT_CHANGE",
    "RETURN_STATUS_CHANGE"
  ]
}
```

---

## API Rate Limits

### Call Limits per Shop

| API Category | Rate Limit | Notes |
|--------------|------------|-------|
| Product APIs | 600 calls/min | Per shop |
| Order APIs | 600 calls/min | Per shop |
| Fulfillment APIs | 600 calls/min | Per shop |
| Logistics APIs | 600 calls/min | Per shop |
| Global APIs | 6,000 calls/min | Per app |

### Best Practices
- Use webhook notifications instead of frequent polling
- Batch API calls when possible (up to 100 items per batch)
- Implement exponential backoff on rate limit errors
- Cache product categories and attributes
- Use efficient filters in search APIs
- Monitor quota usage via API response headers

---

## Error Handling

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 1000 | Invalid parameters | Validate all request parameters |
| 1001 | Authentication failed | Check App Key/Secret, token validity |
| 1002 | Access token expired | Refresh access token |
| 1003 | Rate limit exceeded | Implement backoff, reduce frequency |
| 2000 | Product not found | Verify product ID exists |
| 2001 | SKU stock insufficient | Update inventory before order confirmation |
| 3000 | Order not found | Check order ID and status |
| 3001 | Order cannot be cancelled | Check order status and cancellation policy |
| 4000 | Category not exist | Verify category ID is valid for region |

### Error Response Format

```json
{
  "code": 1000,
  "message": "Invalid parameters: title is required",
  "request_id": "20251201-abc123",
  "data": {}
}
```

---

## Testing

### Sandbox Environment

TikTok Shop provides a sandbox for testing:

```
Sandbox API URL: https://open-api-sandbox.tiktokshop.com
Sandbox Seller Center: https://seller-sandbox.tiktokshop.com
```

### Test Flow

1. Create test shop in sandbox environment
2. Use sandbox App Key and Secret
3. Test product creation and updates
4. Test order flow (create test orders)
5. Test webhook endpoints
6. Verify error handling
7. Load test with batch operations
8. Move to production after validation

---

## Production Checklist

- [ ] App credentials configured (App Key & Secret)
- [ ] Shop ID verified
- [ ] Region selected correctly
- [ ] OAuth authorization completed
- [ ] Access token and refresh token stored securely
- [ ] Webhook endpoint secured with HTTPS
- [ ] Webhook signature validation implemented
- [ ] Token refresh mechanism implemented
- [ ] Error handling and logging configured
- [ ] Rate limit handling with exponential backoff
- [ ] Product catalog synced successfully
- [ ] Test order processed end-to-end
- [ ] Inventory sync verified
- [ ] Monitoring and alerting set up
- [ ] API quota usage tracking enabled
- [ ] Live shopping products configured (if applicable)
- [ ] Affiliate program enabled (if applicable)

---

## Troubleshooting

### Issue: "Authentication Failed"
**Solution:** 
1. Verify App Key and App Secret are correct
2. Check access token hasn't expired (24-hour validity)
3. Ensure signature calculation is correct
4. Verify timestamp is within 5 minutes of server time

### Issue: "Access Token Expired"
**Solution:** Implement automatic token refresh using refresh_token (valid for 90 days)

### Issue: "Product Upload Failed - Category Error"
**Solution:** 
1. Verify category ID is valid for your region
2. Check required attributes for the category
3. Ensure all mandatory fields are provided
4. Validate image formats (JPG/PNG, max 5MB each)

### Issue: "Order Sync Missing Recent Orders"
**Solution:** 
1. Check `create_time_from` and `create_time_to` parameters
2. Verify order status filters
3. Ensure pagination is handled correctly (max 100 per page)
4. Check webhook notifications are working

### Issue: "Webhook Not Receiving Events"
**Solution:** 
1. Verify webhook URL is publicly accessible
2. Check SSL certificate is valid
3. Ensure endpoint returns HTTP 200 within 5 seconds
4. Verify signature validation logic
5. Check webhook configuration in Partner Center
6. Review webhook logs for errors

### Issue: "Rate Limit Exceeded"
**Solution:**
1. Implement exponential backoff (wait 1s, 2s, 4s, 8s)
2. Reduce sync frequency
3. Use webhooks instead of polling
4. Batch multiple operations when possible
5. Monitor rate limit headers in API responses

---

## Advanced Features

### Video Commerce

TikTok Shop's unique feature - link products to video content:

```json
{
  "video_id": "tiktok_video_id",
  "product_ids": ["prod1", "prod2", "prod3"],
  "show_times": [
    {"product_id": "prod1", "start_time": 5, "end_time": 15},
    {"product_id": "prod2", "start_time": 20, "end_time": 30}
  ]
}
```

### Live Shopping

Schedule and manage live shopping events:

```json
{
  "live_session_id": "live123",
  "scheduled_start_time": "2025-12-05T19:00:00Z",
  "duration_minutes": 60,
  "products": [
    {
      "product_id": "prod1",
      "special_price": 199000,
      "stock_limit": 100,
      "flash_sale_start": "2025-12-05T19:15:00Z",
      "flash_sale_duration": 300
    }
  ]
}
```

### Affiliate Marketing

Enable creators to promote your products:

```json
{
  "product_id": "prod1",
  "affiliate_enabled": true,
  "commission_rate": 10.0,
  "target_regions": ["US", "UK"],
  "sample_available": true,
  "creator_requirements": {
    "min_followers": 1000,
    "categories": ["fashion", "beauty"]
  }
}
```

---

## API Reference Links

- **TikTok Shop Partner Center:** https://partner.tiktokshop.com
- **API Documentation:** https://partner.tiktokshop.com/doc
- **Seller Center:** https://seller.tiktokshop.com (varies by region)
- **Developer Forum:** https://partner.tiktokshop.com/forum
- **API Updates & Changelog:** https://partner.tiktokshop.com/doc/page/releases

---

## Support

### Integration Issues
1. Check Ocean ERP logs: `/var/log/ocean-erp/integrations.log`
2. Review TikTok Shop API response errors
3. Contact Ocean ERP support with error details and request_id

### TikTok Shop API Issues
1. Check TikTok Shop API status
2. Review error codes in documentation
3. Contact TikTok Shop Partner Support
4. Post in TikTok Shop Developer Forum

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Dec 2025 | Initial TikTok Shop integration |

---

## Comparison: TikTok Shop vs Shopee vs Tokopedia

| Feature | TikTok Shop | Shopee | Tokopedia |
|---------|-------------|--------|-----------|
| **Authentication** | App Key + Secret | Partner ID + Key | Client ID + Secret |
| **OAuth** | ✅ OAuth 2.0 | ✅ OAuth 2.0 | ✅ OAuth 2.0 |
| **Regions** | 8+ countries (US, UK, SEA) | 7 SEA countries | Indonesia only |
| **Product API** | ✅ Full CRUD | ✅ Full CRUD | ✅ Full CRUD |
| **Order API** | ✅ Comprehensive | ✅ Comprehensive | ✅ Comprehensive |
| **Inventory Sync** | ✅ Real-time | ✅ Real-time | ✅ Real-time |
| **Logistics** | ✅ Multi-carrier | ✅ Multi-carrier | ✅ Partner logistics |
| **Promotions** | ✅ Rich features | ✅ Rich APIs | ⚠️ Limited |
| **Live Shopping** | ✅ **Unique Feature** | ❌ No | ❌ No |
| **Video Commerce** | ✅ **Unique Feature** | ❌ No | ❌ No |
| **Affiliate Program** | ✅ **Built-in** | ⚠️ Limited | ⚠️ Limited |
| **Chat API** | ⚠️ Limited | ✅ Available | ❌ Not in Open API |
| **Webhooks** | ✅ Event-based | ✅ Push notifications | ✅ Webhooks |
| **Rate Limits** | 600/min/shop | 1,000/min/shop | 100-200/min |

### TikTok Shop Unique Advantages:
- **Social Commerce Integration:** Native TikTok video content
- **Live Shopping:** Built-in live streaming commerce
- **Creator Economy:** Robust affiliate and influencer marketing
- **Video Product Tagging:** Link products directly in videos
- **Viral Potential:** Products can go viral through TikTok algorithm
- **Younger Demographics:** Access to Gen Z and Millennial audiences

---

## Next Steps

After successful integration:
1. Complete product catalog sync
2. Configure webhook notifications
3. Enable inventory management
4. Test order fulfillment flow
5. Set up promotional campaigns
6. **Enable live shopping sessions** (TikTok Shop exclusive)
7. **Activate affiliate program** for creator partnerships
8. **Link products to videos** for video commerce
9. Monitor analytics and performance
10. Optimize for TikTok algorithm and trends

---

## Tips for TikTok Shop Success

### Content Strategy
- Create engaging short-form video content
- Show products in use, not just static images
- Leverage trending sounds and hashtags
- Post consistently (3-5 times per week)

### Live Shopping Best Practices
- Schedule during peak hours (7-9 PM local time)
- Prepare flash deals and limited offers
- Engage with viewers in real-time
- Showcase 5-10 products per session
- Collaborate with creators for co-hosted lives

### Creator Partnerships
- Offer competitive commission rates (10-20%)
- Provide product samples to micro-influencers
- Create creator-exclusive discount codes
- Track performance by creator
- Build long-term relationships with top performers

---

**Need Help?** Contact Ocean ERP Support Team or TikTok Shop Partner Support
