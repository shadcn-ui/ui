# TikTok Shop Multi-Account Integration Guide

## Overview

This guide explains how to connect and manage multiple TikTok Shop accounts within Ocean ERP, enabling multi-region operations, multi-brand management, creator agency workflows, and testing environments.

---

## Use Cases

### 1. Multi-Region E-Commerce
Manage shops across different TikTok Shop regions:
- **US Shop:** USD pricing, FBA fulfillment, English content
- **UK Shop:** GBP pricing, European market
- **Indonesia Shop:** IDR pricing, COD, Bahasa Indonesia content
- **Southeast Asia Shops:** Multiple local markets

### 2. Multi-Brand Strategy
Separate brands with distinct positioning:
- **Premium Brand:** High-end fashion, luxury positioning
- **Budget Brand:** Mass market, competitive pricing
- **Niche Brand:** Specialty products, targeted audience

### 3. Creator Agency Management
Agencies managing multiple client shops:
- **Client A:** Beauty brand with 3 regional shops
- **Client B:** Fashion brand with live shopping focus
- **Client C:** Electronics shop with affiliate program

### 4. Content Creators with Multiple Shops
Influencers running multiple shop concepts:
- **Main Shop:** Personal brand products
- **Collab Shop:** Collaborations with other creators
- **Curated Shop:** Product recommendations

### 5. Test vs Production
Separate environments for development:
- **Sandbox Shop:** API testing and development
- **Staging Shop:** Pre-production testing
- **Production Shop:** Live customer-facing shop

---

## Architecture

### Database Schema

Uses the existing `integration_accounts` table:

```sql
CREATE TABLE integration_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id VARCHAR(100) NOT NULL, -- 'tiktok-shop'
    account_name VARCHAR(255) NOT NULL,
    account_identifier VARCHAR(255) NOT NULL, -- Shop ID
    credentials JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    metadata JSONB
);
```

### Credentials Structure for TikTok Shop

```json
{
  "app_key": "your_app_key",
  "app_secret": "your_app_secret",
  "shop_id": "shop_cipher_here",
  "region": "US",
  "access_token": "access_token_value",
  "access_token_expire_in": 86400,
  "refresh_token": "refresh_token_value",
  "refresh_token_expire_in": 7776000,
  "open_id": "seller_open_id",
  "token_obtained_at": "2025-12-01T10:00:00Z",
  "features": {
    "product_catalog": true,
    "order_fulfillment": true,
    "inventory_sync": true,
    "logistics": true,
    "promotions": false,
    "returns": true,
    "live_shopping": true,
    "affiliate_program": true,
    "shop_analytics": true
  },
  "sync_settings": {
    "auto_sync": true,
    "interval_minutes": 15,
    "sync_orders": true,
    "sync_products": true,
    "sync_inventory": true
  }
}
```

### Metadata Structure

```json
{
  "shop_name": "My Fashion Store",
  "region_name": "United States",
  "region_code": "US",
  "currency": "USD",
  "seller_center_url": "https://seller-us.tiktokshop.com",
  "shop_type": "standard",
  "verification_status": "verified",
  "total_products": 350,
  "total_followers": 12500,
  "monthly_orders": 850,
  "shop_rating": 4.7,
  "live_sessions_enabled": true,
  "affiliate_enabled": true,
  "last_sync": "2025-12-01T10:00:00Z"
}
```

---

## Implementation Guide

### Step 1: Deploy Multi-Account Schema

If not already deployed from Tokopedia/Shopee implementation:

```bash
psql -U ocean_erp -d ocean_erp_db -f database/014_integration_multi_account.sql
```

### Step 2: Update Integration Page UI

**File:** `apps/v4/app/(erp)/erp/integrations/page.tsx`

Add TikTok Shop account selector:

```tsx
// TikTok Shop account management
{selectedIntegration?.id === 'tiktok-shop' && hasMultipleAccounts && (
  <div className="mb-4">
    <Label htmlFor="account">TikTok Shop Account</Label>
    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
      <SelectTrigger>
        <SelectValue placeholder="Select shop account" />
      </SelectTrigger>
      <SelectContent>
        {tiktokAccounts.map(account => (
          <SelectItem key={account.id} value={account.id}>
            <div className="flex items-center gap-2">
              <span>{account.account_name}</span>
              <Badge variant="outline">{account.metadata.region_code}</Badge>
              {account.metadata.live_sessions_enabled && (
                <Badge variant="secondary">🔴 Live</Badge>
              )}
            </div>
          </SelectItem>
        ))}
        <SelectItem value="new">+ Add New Shop</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}
```

### Step 3: Create API Routes

**File:** `apps/v4/app/api/integrations/tiktok-shop/accounts/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: accounts, error } = await supabase
    .from('integration_accounts')
    .select('*')
    .eq('integration_id', 'tiktok-shop')
    .order('is_default', { ascending: false })
    .order('account_name')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(accounts)
}

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  const body = await request.json()
  
  const { data: user } = await supabase.auth.getUser()
  
  const accountData = {
    integration_id: 'tiktok-shop',
    account_name: body.account_name,
    account_identifier: body.shop_id,
    credentials: {
      app_key: body.app_key,
      app_secret: body.app_secret,
      shop_id: body.shop_id,
      region: body.region,
      features: body.features || {},
      sync_settings: body.sync_settings || {}
    },
    created_by: user?.user?.id,
    metadata: {
      region_name: getRegionName(body.region),
      region_code: body.region,
      currency: getRegionCurrency(body.region),
      seller_center_url: getSellerCenterUrl(body.region),
      live_sessions_enabled: body.features?.live_shopping || false,
      affiliate_enabled: body.features?.affiliate_program || false
    }
  }
  
  const { data, error } = await supabase
    .from('integration_accounts')
    .insert(accountData)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

function getRegionName(code: string): string {
  const regions = {
    'US': 'United States',
    'UK': 'United Kingdom',
    'ID': 'Indonesia',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'VN': 'Vietnam',
    'PH': 'Philippines'
  }
  return regions[code] || code
}

function getRegionCurrency(code: string): string {
  const currencies = {
    'US': 'USD',
    'UK': 'GBP',
    'ID': 'IDR',
    'SG': 'SGD',
    'MY': 'MYR',
    'TH': 'THB',
    'VN': 'VND',
    'PH': 'PHP'
  }
  return currencies[code] || 'USD'
}

function getSellerCenterUrl(code: string): string {
  const urls = {
    'US': 'https://seller-us.tiktokshop.com',
    'UK': 'https://seller-uk.tiktokshop.com',
    'ID': 'https://seller-id.tiktokshop.com',
    'SG': 'https://seller-sg.tiktokshop.com',
    'MY': 'https://seller-my.tiktokshop.com',
    'TH': 'https://seller-th.tiktokshop.com',
    'VN': 'https://seller-vn.tiktokshop.com',
    'PH': 'https://seller-ph.tiktokshop.com'
  }
  return urls[code] || 'https://seller.tiktokshop.com'
}
```

### Step 4: Account Management Page

**File:** `apps/v4/app/(erp)/erp/integrations/tiktok-shop/accounts/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Card } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Plus, Settings, Trash2, Star, Video, Users } from 'lucide-react'

interface TikTokShopAccount {
  id: string
  account_name: string
  account_identifier: string
  status: string
  is_default: boolean
  credentials: {
    region: string
  }
  metadata: {
    region_name: string
    region_code: string
    currency: string
    shop_rating?: number
    total_products?: number
    total_followers?: number
    monthly_orders?: number
    live_sessions_enabled?: boolean
    affiliate_enabled?: boolean
  }
}

export default function TikTokShopAccountsPage() {
  const [accounts, setAccounts] = useState<TikTokShopAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    const response = await fetch('/api/integrations/tiktok-shop/accounts')
    const data = await response.json()
    setAccounts(data)
    setLoading(false)
  }

  async function setDefaultAccount(accountId: string) {
    await fetch(`/api/integrations/tiktok-shop/accounts/${accountId}/set-default`, {
      method: 'POST'
    })
    fetchAccounts()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">TikTok Shop Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected TikTok Shop accounts across regions
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Shop
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map(account => (
          <Card key={account.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold">{account.account_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Shop ID: {account.account_identifier}
                </p>
              </div>
              <div className="flex gap-1">
                {account.is_default && (
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <Badge variant="outline">
                {account.metadata.region_code}
              </Badge>
              {account.metadata.live_sessions_enabled && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <Video className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
              {account.metadata.affiliate_enabled && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Users className="w-3 h-3 mr-1" />
                  Affiliate
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span className="font-medium">
                  {account.metadata.region_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-medium">{account.metadata.currency}</span>
              </div>
              {account.metadata.shop_rating && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">
                    ⭐ {account.metadata.shop_rating}
                  </span>
                </div>
              )}
              {account.metadata.total_followers && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Followers:</span>
                  <span className="font-medium">
                    {account.metadata.total_followers.toLocaleString()}
                  </span>
                </div>
              )}
              {account.metadata.total_products && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="font-medium">
                    {account.metadata.total_products}
                  </span>
                </div>
              )}
              {account.metadata.monthly_orders && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Orders:</span>
                  <span className="font-medium">
                    {account.metadata.monthly_orders}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              {!account.is_default && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDefaultAccount(account.id)}
                  className="flex-1"
                >
                  Set Default
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

---

## Product & Order Management

### Video Commerce Integration

Products linked to TikTok videos across accounts:

```sql
CREATE TABLE tiktok_video_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES integration_accounts(id),
    video_id VARCHAR(255),
    product_id UUID REFERENCES products(id),
    show_time_start INT,
    show_time_end INT,
    video_url TEXT,
    views INT,
    clicks INT,
    conversion_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Live Shopping Sessions

Track live sessions per account:

```sql
CREATE TABLE tiktok_live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES integration_accounts(id),
    live_session_id VARCHAR(255),
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    duration_minutes INT,
    total_viewers INT,
    peak_viewers INT,
    total_orders INT,
    total_revenue DECIMAL(15,2),
    products_showcased JSONB,
    status VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Affiliate Tracking

Monitor creator performance per account:

```sql
CREATE TABLE tiktok_affiliate_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES integration_accounts(id),
    creator_id VARCHAR(255),
    creator_name VARCHAR(255),
    product_id UUID REFERENCES products(id),
    total_orders INT,
    total_revenue DECIMAL(15,2),
    commission_paid DECIMAL(15,2),
    videos_created INT,
    average_views INT,
    conversion_rate DECIMAL(5,2),
    period_start DATE,
    period_end DATE
);
```

---

## Team Access Control

TikTok Shop-specific roles:

```sql
-- Role types for TikTok Shop
INSERT INTO integration_account_access (
    account_id,
    user_id,
    role,
    permissions
) VALUES 
(
    'tiktok-account-uuid',
    'user-uuid',
    'content_manager',
    '["manage_products", "manage_videos", "schedule_live", "view_analytics"]'::jsonb
),
(
    'tiktok-account-uuid',
    'creator-user-uuid',
    'creator_partner',
    '["view_products", "create_content", "view_commission"]'::jsonb
);
```

### Role Types
- **Admin:** Full control including credentials and settings
- **Content Manager:** Product management, video linking, live scheduling
- **Order Fulfillment:** Order processing and logistics
- **Creator Partner:** View products, track affiliate performance
- **Analyst:** View analytics and reports only

---

## UI/UX Mockups

### Account Selector with Special Features
```
┌──────────────────────────────────────────────┐
│ TikTok Shop Account                    ▼     │
├──────────────────────────────────────────────┤
│ ⭐ Main Store (US) 🔴 Live 👥 Affiliate     │
│    Fashion Brand (UK) 🔴 Live               │
│    Indonesia Store (ID) 👥 Affiliate         │
├──────────────────────────────────────────────┤
│ + Add New Shop                               │
└──────────────────────────────────────────────┘
```

### Account Dashboard
```
┌────────────────────────────────────────────────────┐
│  TikTok Shop Accounts               [+ Add Shop]   │
├────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ ⭐ Main Store    │  │ Fashion Brand    │       │
│  │ US 🔴 👥        │  │ UK 🔴           │       │
│  │                  │  │                  │       │
│  │ ⭐ 4.7           │  │ ⭐ 4.9           │       │
│  │ 350 Products     │  │ 280 Products     │       │
│  │ 12.5K Followers  │  │ 8.2K Followers   │       │
│  │ 850 Orders/mo    │  │ 640 Orders/mo    │       │
│  │                  │  │                  │       │
│  │ [View Live] [×]  │  │ [Set Default]    │       │
│  └──────────────────┘  └──────────────────┘       │
└────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Default Account Strategy
- Set most active shop as default
- Consider time zones for live sessions
- Prioritize shop with highest engagement

### 2. Account Naming
Use descriptive names with context:
- ✅ "Main Store - US (Live Enabled)"
- ✅ "Fashion Brand UK"
- ✅ "Indonesia Store (Affiliate)"
- ❌ "Shop 1"
- ❌ "Test"

### 3. Regional Strategy
- **Content Localization:** Create region-specific content
- **Pricing:** Adjust for local purchasing power
- **Live Session Timing:** Schedule during peak hours per region
- **Creator Partnerships:** Work with local influencers

### 4. Live Shopping Coordination
- Don't schedule overlapping live sessions
- Prepare exclusive products per live session
- Coordinate with different teams per region
- Record and repurpose successful live content

### 5. Affiliate Program Management
- Set consistent commission rates per category
- Track creator performance across shops
- Provide product samples strategically
- Build relationships with top-performing creators

---

## Advanced Scenarios

### Cross-Border Content Strategy
Share successful content across regions:
```typescript
// Viral video from US shop
const usVideo = {
  video_id: 'us_viral_video',
  products: ['product_a', 'product_b'],
  views: 2500000,
  conversion_rate: 3.5
}

// Adapt for other regions
await adaptContentForRegion(usVideo, 'UK') // English, GBP pricing
await adaptContentForRegion(usVideo, 'ID') // Bahasa, IDR pricing
```

### Multi-Region Live Shopping
Coordinate live sessions across time zones:
```typescript
const liveSchedule = [
  { shop: 'US', time: '19:00 EST', target: 'North America' },
  { shop: 'UK', time: '19:00 GMT', target: 'Europe' },
  { shop: 'ID', time: '19:00 WIB', target: 'Southeast Asia' }
]
```

### Unified Affiliate Network
Top creators promote across multiple shops:
```typescript
const creatorPartnership = {
  creator_id: 'top_fashion_creator',
  shops: ['US', 'UK', 'ID'],
  commission_rate: 15,
  exclusive_products: true,
  content_quota: 4, // videos per month per shop
}
```

### Consolidated Analytics
View performance across all shops:
- Total revenue (converted to base currency)
- Total followers across all shops
- Best-performing products globally
- Top creators by total sales
- Live session performance comparison

---

## Migration Guide

### From Single to Multi-Account

**Step 1:** Export existing configuration
```sql
SELECT * FROM integrations WHERE integration_id = 'tiktok-shop';
```

**Step 2:** Create first account record
```sql
INSERT INTO integration_accounts (
    integration_id,
    account_name,
    account_identifier,
    credentials,
    is_default,
    metadata
)
SELECT
    'tiktok-shop',
    'Main Shop',
    config->>'shop_id',
    config->'credentials',
    true,
    jsonb_build_object(
        'region_code', config->'credentials'->>'region',
        'region_name', get_region_name(config->'credentials'->>'region')
    )
FROM integrations
WHERE integration_id = 'tiktok-shop';
```

**Step 3:** Migrate existing data
```sql
-- Update product mappings
UPDATE integration_mappings
SET account_id = (
    SELECT id FROM integration_accounts
    WHERE integration_id = 'tiktok-shop' AND is_default = true
)
WHERE integration_id = 'tiktok-shop';

-- Update order records
UPDATE orders
SET source_account_id = (
    SELECT id FROM integration_accounts
    WHERE integration_id = 'tiktok-shop' AND is_default = true
)
WHERE source = 'tiktok-shop' AND source_account_id IS NULL;
```

---

## Monitoring & Alerts

### Account Health Metrics
- Sync success rate per account
- API error rate per account
- Token expiration status
- Live session performance
- Affiliate conversion rates
- Video engagement metrics

### Alert Conditions
- Access token expiration (< 7 days)
- Refresh token expiration (< 30 days)
- Sync failures (> 3 consecutive)
- Order sync delay (> 30 minutes)
- High API error rate (> 5%)
- Live session low viewership
- Affiliate program low performance

---

## TikTok Shop Specific Features

### Video Analytics Dashboard
```typescript
interface VideoAnalytics {
  account_id: string
  total_videos: number
  total_views: number
  average_conversion: number
  top_performing_videos: Array<{
    video_id: string
    views: number
    clicks: number
    orders: number
    revenue: number
  }>
}
```

### Live Session Dashboard
```typescript
interface LiveSessionDashboard {
  account_id: string
  upcoming_sessions: Array<{
    scheduled_time: string
    duration: number
    featured_products: string[]
  }>
  past_sessions_stats: {
    total_sessions: number
    average_viewers: number
    total_revenue: number
    conversion_rate: number
  }
}
```

### Creator Performance Tracking
```typescript
interface CreatorPerformance {
  account_id: string
  top_creators: Array<{
    creator_id: string
    name: string
    total_orders: number
    revenue_generated: number
    commission_earned: number
    average_conversion: number
    content_created: number
  }>
}
```

---

## Support & Resources

**Technical Support:**
- Ocean ERP multi-account documentation
- TikTok Shop Partner Support
- Integration troubleshooting guide

**Useful Links:**
- [TikTok Shop Partner Center](https://partner.tiktokshop.com)
- [Multi-Account Database Schema](../database/014_integration_multi_account.sql)
- [TikTok Shop Integration Guide](./TIKTOK_SHOP_INTEGRATION.md)
- [TikTok Shop Seller University](https://seller.tiktokshop.com/university)

---

## Frequently Asked Questions

**Q: Can I use the same App Key for multiple shops?**
A: No, each shop requires its own App Key and App Secret from TikTok Shop Partner Center.

**Q: Can I link the same product video to multiple regional shops?**
A: Yes, but you need to create separate product mappings and adapt pricing/descriptions per region.

**Q: How are live shopping sessions managed across multiple accounts?**
A: Each account has independent live session scheduling. Coordinate timing to avoid overlaps.

**Q: Can creators be affiliated with multiple of my shops?**
A: Yes, enable affiliate program on each shop and invite the same creators with appropriate commission rates.

**Q: What happens to video analytics when switching accounts?**
A: Analytics are account-specific and remain associated with each account independently.

---

## Next Steps

1. Deploy multi-account schema (if not done)
2. Add additional TikTok Shop accounts
3. Test product and order sync per account
4. Configure team access permissions
5. Set up video commerce tracking
6. Schedule multi-region live sessions
7. Enable affiliate programs
8. Build consolidated reporting dashboard

---

**Last Updated:** December 2025  
**Version:** 1.0.0
