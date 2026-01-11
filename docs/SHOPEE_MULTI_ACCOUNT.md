# Shopee Multi-Account Integration Guide

## Overview

This guide explains how to connect and manage multiple Shopee shops within Ocean ERP, enabling multi-store operations, regional management, and agency workflows.

---

## Use Cases

### 1. Multi-Region Operations
Connect shops across different Shopee regions from one ERP:
- **Indonesia Shop:** IDR pricing, local logistics
- **Singapore Shop:** SGD pricing, cross-border shipping
- **Malaysia Shop:** MYR pricing, regional promotions

### 2. Multi-Brand Management
Manage multiple brands under one company:
- **Brand A Shopee Shop:** Fashion products
- **Brand B Shopee Shop:** Electronics
- **Brand C Shopee Shop:** Home & Living

### 3. Agency/Marketplace Manager
E-commerce agencies managing client shops:
- **Client 1 - 3 Regional Shops**
- **Client 2 - 2 Country Shops**
- **Client 3 - Single flagship shop**

### 4. Test vs Production
Separate testing and live environments:
- **Sandbox Shop:** API testing
- **Production Shop:** Live operations

---

## Architecture

### Database Schema

The multi-account architecture uses the existing `integration_accounts` table from the Tokopedia implementation:

```sql
CREATE TABLE integration_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id VARCHAR(100) NOT NULL, -- 'shopee'
    account_name VARCHAR(255) NOT NULL,
    account_identifier VARCHAR(255) NOT NULL, -- Shop ID
    credentials JSONB NOT NULL, -- Partner credentials + shop config
    status VARCHAR(50) DEFAULT 'active',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    metadata JSONB -- Additional shop info
);
```

### Credentials Structure for Shopee

```json
{
  "partner_id": "1234567",
  "partner_key": "secret_key_here",
  "shop_id": "98765",
  "region": "ID",
  "access_token": "token_value",
  "refresh_token": "refresh_token_value",
  "token_expires_at": "2025-12-31T23:59:59Z",
  "features": {
    "product_management": true,
    "order_management": true,
    "stock_price_sync": true,
    "logistics": true,
    "promotions": false,
    "returns": true,
    "chat_api": false,
    "shop_performance": true
  },
  "sync_settings": {
    "auto_sync": true,
    "interval_minutes": 15
  }
}
```

### Metadata Structure

```json
{
  "shop_name": "My Fashion Store",
  "region_name": "Indonesia",
  "currency": "IDR",
  "seller_centre_url": "https://seller.shopee.co.id",
  "shop_rating": 4.8,
  "total_products": 450,
  "monthly_orders": 1250,
  "last_sync": "2025-12-01T10:00:00Z"
}
```

---

## Implementation Guide

### Step 1: Deploy Multi-Account Schema

If not already deployed from Tokopedia implementation:

```bash
psql -U ocean_erp -d ocean_erp_db -f database/014_integration_multi_account.sql
```

This creates:
- `integration_accounts` table
- `integration_account_access` (for team access control)
- Updated `integration_mappings` and `integration_logs`
- Necessary indexes and triggers

### Step 2: Update Integration Page UI

**File:** `apps/v4/app/(erp)/erp/integrations/page.tsx`

Add account management section:

```tsx
// Account selector for Shopee
{selectedIntegration?.id === 'shopee' && hasMultipleAccounts && (
  <div className="mb-4">
    <Label htmlFor="account">Shopee Account</Label>
    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
      <SelectTrigger>
        <SelectValue placeholder="Select account" />
      </SelectTrigger>
      <SelectContent>
        {shopeeAccounts.map(account => (
          <SelectItem key={account.id} value={account.id}>
            {account.account_name} ({account.metadata.region_name})
          </SelectItem>
        ))}
        <SelectItem value="new">+ Add New Shop</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}
```

### Step 3: Create API Routes

**File:** `apps/v4/app/api/integrations/shopee/accounts/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: accounts, error } = await supabase
    .from('integration_accounts')
    .select('*')
    .eq('integration_id', 'shopee')
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
    integration_id: 'shopee',
    account_name: body.account_name,
    account_identifier: body.shop_id,
    credentials: {
      partner_id: body.partner_id,
      partner_key: body.partner_key,
      shop_id: body.shop_id,
      region: body.region,
      features: body.features || {},
      sync_settings: body.sync_settings || {}
    },
    created_by: user?.user?.id,
    metadata: {
      region_name: getRegionName(body.region),
      currency: getRegionCurrency(body.region),
      seller_centre_url: getSellerCentreUrl(body.region)
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
    'ID': 'Indonesia',
    'SG': 'Singapore',
    'MY': 'Malaysia',
    'TH': 'Thailand',
    'TW': 'Taiwan',
    'PH': 'Philippines',
    'VN': 'Vietnam'
  }
  return regions[code] || code
}

function getRegionCurrency(code: string): string {
  const currencies = {
    'ID': 'IDR',
    'SG': 'SGD',
    'MY': 'MYR',
    'TH': 'THB',
    'TW': 'TWD',
    'PH': 'PHP',
    'VN': 'VND'
  }
  return currencies[code] || 'USD'
}

function getSellerCentreUrl(code: string): string {
  const urls = {
    'ID': 'https://seller.shopee.co.id',
    'SG': 'https://seller.shopee.sg',
    'MY': 'https://seller.shopee.com.my',
    'TH': 'https://seller.shopee.co.th',
    'TW': 'https://seller.shopee.tw',
    'PH': 'https://seller.shopee.ph',
    'VN': 'https://seller.shopee.vn'
  }
  return urls[code] || 'https://seller.shopee.com'
}
```

### Step 4: Account Management Page

**File:** `apps/v4/app/(erp)/erp/integrations/shopee/accounts/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Card } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Plus, Settings, Trash2, Star } from 'lucide-react'

interface ShopeeAccount {
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
    currency: string
    shop_rating?: number
    total_products?: number
    monthly_orders?: number
  }
}

export default function ShopeeAccountsPage() {
  const [accounts, setAccounts] = useState<ShopeeAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    const response = await fetch('/api/integrations/shopee/accounts')
    const data = await response.json()
    setAccounts(data)
    setLoading(false)
  }

  async function setDefaultAccount(accountId: string) {
    await fetch(`/api/integrations/shopee/accounts/${accountId}/set-default`, {
      method: 'POST'
    })
    fetchAccounts()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Shopee Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected Shopee shops
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
              <div>
                <h3 className="font-semibold">{account.account_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Shop ID: {account.account_identifier}
                </p>
              </div>
              {account.is_default && (
                <Badge variant="secondary">
                  <Star className="w-3 h-3 mr-1" />
                  Default
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
              {account.metadata.total_products && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products:</span>
                  <span className="font-medium">
                    {account.metadata.total_products}
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

### Product Mapping

Products can be:
1. **Shop-Specific:** Only available in one shop
2. **Multi-Shop:** Same product across multiple shops with region-specific pricing

```sql
CREATE TABLE integration_product_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    account_id UUID REFERENCES integration_accounts(id),
    external_id VARCHAR(255), -- Shopee item_id
    external_sku VARCHAR(255), -- Shopee item_sku
    status VARCHAR(50),
    metadata JSONB -- Region-specific data
);
```

### Order Routing

Orders automatically route to the correct account:

```typescript
async function syncShopeeOrders() {
  const accounts = await getActiveShopeeAccounts()
  
  for (const account of accounts) {
    const orders = await fetchShopeeOrders(account)
    
    for (const order of orders) {
      await createOrder({
        ...order,
        source: 'shopee',
        source_account_id: account.id,
        currency: account.metadata.currency
      })
    }
  }
}
```

---

## Team Access Control

Use `integration_account_access` table to manage permissions:

```sql
INSERT INTO integration_account_access (
    account_id,
    user_id,
    role,
    permissions
) VALUES (
    'shopee-account-uuid',
    'user-uuid',
    'manager',
    '["read", "write", "sync"]'::jsonb
);
```

### Role Types
- **Admin:** Full control including credentials
- **Manager:** Product and order management
- **Viewer:** Read-only access
- **Sync Operator:** Can trigger syncs only

---

## UI/UX Mockups

### Account Selector
```
┌─────────────────────────────────────┐
│ Shopee Account                ▼     │
├─────────────────────────────────────┤
│ ⭐ Main Store (Indonesia)           │
│    Fashion Store (Singapore)        │
│    Electronics Hub (Malaysia)       │
├─────────────────────────────────────┤
│ + Add New Shop                      │
└─────────────────────────────────────┘
```

### Account Dashboard
```
┌──────────────────────────────────────────────────┐
│  Shopee Accounts                    [+ Add Shop] │
├──────────────────────────────────────────────────┤
│  ┌────────────────┐  ┌────────────────┐         │
│  │ ⭐ Main Store  │  │ Fashion Store  │         │
│  │ Indonesia      │  │ Singapore      │         │
│  │                │  │                │         │
│  │ ⭐ 4.8        │  │ ⭐ 4.9        │         │
│  │ 450 Products   │  │ 320 Products   │         │
│  │ 1.2K Orders/mo │  │ 890 Orders/mo  │         │
│  │                │  │                │         │
│  │ [Settings] [×] │  │ [Set Default]  │         │
│  └────────────────┘  └────────────────┘         │
└──────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Default Account
- Set most active shop as default
- Auto-selects for new products/orders
- Can override per transaction

### 2. Account Naming
Use descriptive names:
- ✅ "Main Store - Indonesia"
- ✅ "Fashion Brand SG"
- ❌ "Shop 1"
- ❌ "Test"

### 3. Regional Considerations
- **Pricing:** Use local currency for each region
- **Logistics:** Different couriers per region
- **Language:** Product descriptions in local language
- **Regulations:** Comply with regional requirements

### 4. Sync Strategy
- High-volume shops: 5-minute sync
- Standard shops: 15-minute sync
- Use webhooks when possible
- Stagger sync times across accounts

### 5. Inventory Management
Options for multi-shop inventory:
- **Shared Pool:** Deduct from central inventory
- **Allocated:** Pre-allocate stock per shop
- **Separate:** Independent inventory per shop

---

## Advanced Scenarios

### Cross-Border Fulfillment
Ship from one region to another:
```typescript
// Order from Singapore shop
// Fulfill from Indonesia warehouse
const order = {
  shop_account_id: 'singapore-shop',
  fulfillment_warehouse: 'indonesia-warehouse',
  shipping_method: 'cross_border'
}
```

### Multi-Currency Pricing
Sync products with region-specific pricing:
```typescript
const product = {
  base_price: 100000, // IDR
  regional_pricing: {
    'ID': 100000, // IDR
    'SG': 9.50,   // SGD
    'MY': 30,     // MYR
  }
}
```

### Consolidated Reporting
View performance across all shops:
- Total revenue (converted to base currency)
- Order volume by region
- Best-selling products per shop
- Performance comparison

---

## Migration Guide

### From Single to Multi-Account

**Step 1:** Backup existing integration data
```sql
-- Export current Shopee configuration
SELECT * FROM integrations WHERE integration_id = 'shopee';
```

**Step 2:** Create account record
```sql
INSERT INTO integration_accounts (
    integration_id,
    account_name,
    account_identifier,
    credentials,
    is_default
)
SELECT
    'shopee',
    'Main Shop',
    config->>'shop_id',
    config->'credentials',
    true
FROM integrations
WHERE integration_id = 'shopee';
```

**Step 3:** Migrate product mappings
```sql
UPDATE integration_mappings
SET account_id = (
    SELECT id FROM integration_accounts
    WHERE integration_id = 'shopee' AND is_default = true
)
WHERE integration_id = 'shopee';
```

**Step 4:** Test thoroughly before going live

---

## Monitoring & Alerts

### Account Health Metrics
- Sync success rate per account
- API error rate per account
- Order processing time
- Inventory accuracy

### Alert Conditions
- Token expiration (< 7 days)
- Sync failures (> 3 consecutive)
- Order sync delay (> 1 hour)
- High error rate (> 5%)
- Stock discrepancy detected

---

## Support & Resources

**Technical Support:**
- Ocean ERP multi-account documentation
- Shopee Partner Support (per region)
- Integration troubleshooting guide

**Useful Links:**
- [Shopee Open Platform](https://open.shopee.com)
- [Multi-Account Database Schema](../database/014_integration_multi_account.sql)
- [Shopee Integration Guide](./SHOPEE_INTEGRATION.md)

---

## Frequently Asked Questions

**Q: Can I use one Partner ID for multiple shops?**
A: No, each shop requires its own Partner ID and Partner Key from Shopee Open Platform.

**Q: Can I sync the same product to multiple regional shops?**
A: Yes, create separate mappings for each shop with region-specific prices and descriptions.

**Q: How are orders from different shops distinguished?**
A: Each order includes `source_account_id` linking to the specific Shopee account.

**Q: Can I bulk transfer products between shops?**
A: Yes, use the bulk product sync feature with account selection.

**Q: What happens if I delete an account?**
A: Historical orders remain, but future syncs stop. Product mappings are archived, not deleted.

---

## Next Steps

1. Deploy multi-account schema (if not done for Tokopedia)
2. Add first additional Shopee shop
3. Test product and order sync
4. Configure team access permissions
5. Set up consolidated reporting
6. Enable multi-shop inventory management

---

**Last Updated:** December 2025  
**Version:** 1.0.0
