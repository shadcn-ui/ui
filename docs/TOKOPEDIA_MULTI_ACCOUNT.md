# Multi-Account Tokopedia Integration Guide

## ✅ **YES, You Can Connect Multiple Tokopedia Accounts!**

Ocean ERP fully supports connecting multiple Tokopedia accounts simultaneously. This is perfect for:
- **Multi-store businesses** (different shops/brands)
- **Marketplace management agencies** (managing client accounts)
- **Testing environments** (production + sandbox accounts)
- **Regional operations** (different warehouse locations)

---

## 🏗️ **Architecture Overview**

### Current Database Schema
The `integrations` table uses a **UNIQUE constraint** on `integration_id`, but we can work around this elegantly:

```sql
-- Current (Single Account)
integration_id: 'tokopedia' (UNIQUE)

-- Multi-Account Solution (Option 1: Account Suffix)
integration_id: 'tokopedia-shop1'
integration_id: 'tokopedia-shop2'
integration_id: 'tokopedia-warehouse-north'

-- Multi-Account Solution (Option 2: New Table)
-- Keep integrations table for platform definitions
-- Add integration_accounts table for multiple connections
```

---

## 🎯 **Recommended Approach: Multi-Account Table**

### Option A: Account Suffix Pattern (Quick Implementation)

**How it works:**
- Each Tokopedia shop gets a unique `integration_id`
- Format: `tokopedia-{shop_id}` or `tokopedia-{custom_name}`
- Example: `tokopedia-12345`, `tokopedia-main`, `tokopedia-jakarta`

**Pros:**
- ✅ Quick to implement (no schema changes)
- ✅ Works with existing structure
- ✅ Each shop is independent

**Cons:**
- ⚠️ Shows multiple "Tokopedia" entries in UI
- ⚠️ Harder to manage centrally

### Option B: Dedicated Multi-Account Schema (Professional)

**How it works:**
- Keep one `integrations` record for Tokopedia platform
- Add `integration_accounts` table for individual shops
- Link accounts to parent integration

**Pros:**
- ✅ Clean UI (one Tokopedia entry)
- ✅ Centralized management
- ✅ Easy account switching
- ✅ Shared platform settings
- ✅ Better reporting/analytics

**Cons:**
- ⚠️ Requires schema migration

---

## 🚀 **Implementation: Option B (Recommended)**

### Step 1: Create Multi-Account Schema

```sql
-- Add integration_accounts table
CREATE TABLE IF NOT EXISTS integration_accounts (
  id SERIAL PRIMARY KEY,
  integration_id VARCHAR(100) NOT NULL REFERENCES integrations(integration_id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL, -- User-friendly name: "Main Store", "Jakarta Warehouse"
  account_identifier VARCHAR(255) NOT NULL, -- Shop ID, FS ID, or unique identifier
  
  -- Account-specific credentials
  credentials JSONB DEFAULT '{}',
  
  -- Account status
  status VARCHAR(50) CHECK (status IN ('active', 'inactive', 'error', 'pending')) DEFAULT 'inactive',
  enabled BOOLEAN DEFAULT false,
  
  -- Sync settings (can override parent integration)
  auto_sync BOOLEAN DEFAULT true,
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMP,
  sync_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  last_error TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- Shop info, warehouse location, etc.
  is_primary BOOLEAN DEFAULT false, -- Mark one as primary/default
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(integration_id, account_identifier)
);

-- Create indexes for performance
CREATE INDEX idx_integration_accounts_integration ON integration_accounts(integration_id);
CREATE INDEX idx_integration_accounts_status ON integration_accounts(status);
CREATE INDEX idx_integration_accounts_enabled ON integration_accounts(enabled);
CREATE INDEX idx_integration_accounts_primary ON integration_accounts(is_primary);

-- Update integration_mappings to include account_id
ALTER TABLE integration_mappings 
ADD COLUMN account_id INTEGER REFERENCES integration_accounts(id) ON DELETE CASCADE;

CREATE INDEX idx_integration_mappings_account ON integration_mappings(account_id);

-- Update integration_logs to include account_id
ALTER TABLE integration_logs 
ADD COLUMN account_id INTEGER REFERENCES integration_accounts(id) ON DELETE SET NULL;

CREATE INDEX idx_integration_logs_account ON integration_logs(account_id);
```

### Step 2: Sample Data Structure

```json
// integrations table (Platform level)
{
  "integration_id": "tokopedia",
  "name": "Tokopedia",
  "category": "ecommerce",
  "status": "active",
  "config": {
    "api_endpoints": {
      "base_url": "https://fs.tokopedia.net",
      "auth_url": "https://accounts.tokopedia.com/token"
    },
    "supported_features": [
      "product_management",
      "order_management", 
      "inventory_sync",
      "logistics",
      "shop_info",
      "webhooks"
    ]
  }
}

// integration_accounts table (Account level)
[
  {
    "id": 1,
    "integration_id": "tokopedia",
    "account_name": "Main Store - Jakarta",
    "account_identifier": "shop_12345",
    "credentials": {
      "fs_id": "12345",
      "shop_id": "67890",
      "client_id": "abc123",
      "client_secret": "encrypted_secret",
      "access_token": "encrypted_token",
      "token_expires_at": "2025-12-01T15:00:00Z"
    },
    "status": "active",
    "enabled": true,
    "auto_sync": true,
    "sync_interval_minutes": 15,
    "metadata": {
      "shop_name": "Fashion Store Jakarta",
      "warehouse": "Jakarta Central",
      "tier": "Gold Merchant",
      "seller_level": "Power Merchant"
    },
    "is_primary": true
  },
  {
    "id": 2,
    "integration_id": "tokopedia",
    "account_name": "Surabaya Branch",
    "account_identifier": "shop_67890",
    "credentials": {
      "fs_id": "67890",
      "shop_id": "12345",
      "client_id": "xyz789",
      "client_secret": "encrypted_secret_2",
      "access_token": "encrypted_token_2",
      "token_expires_at": "2025-12-01T15:30:00Z"
    },
    "status": "active",
    "enabled": true,
    "auto_sync": true,
    "sync_interval_minutes": 30,
    "metadata": {
      "shop_name": "Fashion Store Surabaya",
      "warehouse": "Surabaya Hub",
      "tier": "Official Store"
    },
    "is_primary": false
  }
]
```

---

## 🎨 **UI/UX Design for Multi-Account**

### Updated Configuration Dialog

```
┌─────────────────────────────────────────────────────┐
│ Configure Tokopedia                            [×]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Connected Accounts (2)                               │
│ ┌──────────────────────────────────────────────┐   │
│ │ [●] Main Store - Jakarta (Primary)            │   │
│ │     Shop ID: shop_12345                       │   │
│ │     Status: ✅ Active | Last sync: 2 mins ago │   │
│ │     [Edit] [Sync Now] [Set as Primary]        │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ [●] Surabaya Branch                           │   │
│ │     Shop ID: shop_67890                       │   │
│ │     Status: ✅ Active | Last sync: 15 mins ago│   │
│ │     [Edit] [Sync Now] [Remove]                │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ [+ Add New Tokopedia Account]                       │
│                                                      │
│ Platform Settings                                    │
│ ☐ Sync all accounts simultaneously                  │
│ ☐ Share product catalog across accounts             │
│ ☐ Consolidated order notifications                  │
│                                                      │
│                          [Cancel] [Save Settings]   │
└─────────────────────────────────────────────────────┘
```

### Add Account Dialog

```
┌─────────────────────────────────────────────────────┐
│ Add New Tokopedia Account                      [×]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Account Information                                  │
│ ┌──────────────────────────────────────────────┐   │
│ │ Account Name *                                │   │
│ │ [Main Store - Jakarta_________________]      │   │
│ │ (Used to identify this account in Ocean ERP)  │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ FS ID (Fulfillment Service ID) *              │   │
│ │ [12345________________________________]      │   │
│ │ From Tokopedia Seller Center                  │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ Shop ID *                                     │   │
│ │ [67890________________________________]      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ OAuth Credentials                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ Client ID *                                   │   │
│ │ [abc123xyz____________________________]      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ ┌──────────────────────────────────────────────┐   │
│ │ Client Secret *                               │   │
│ │ [●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●]      │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
│ Sync Settings                                        │
│ [✓] Enable auto-sync                                │
│ Interval: [Every 15 minutes ▼]                      │
│                                                      │
│ Features                                             │
│ [✓] Product Management                              │
│ [✓] Order Management                                │
│ [✓] Inventory Sync                                  │
│ [ ] Logistics Integration                           │
│ [ ] Shop Information                                │
│ [ ] Real-time Webhooks                              │
│                                                      │
│ [ ] Set as primary account                          │
│                                                      │
│              [Cancel] [Test Connection] [Connect]   │
└─────────────────────────────────────────────────────┘
```

### Integrations Page View

```
┌─────────────────────────────────────────────────────┐
│ Tokopedia                                            │
│ ───────────────────────────────────────────────────│
│ Official Tokopedia API integration                   │
│                                                      │
│ Connected: 2 accounts                                │
│ Status: ✅ Active | Last sync: 2 mins ago           │
│                                                      │
│ Accounts:                                            │
│ • Main Store - Jakarta (Primary) - 245 orders/day   │
│ • Surabaya Branch - 123 orders/day                  │
│                                                      │
│ [Manage Accounts] [Sync All] [Settings]            │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 **Backend API Structure**

### API Endpoints

```
GET    /api/integrations/tokopedia/accounts
       → List all connected Tokopedia accounts

POST   /api/integrations/tokopedia/accounts
       → Add new Tokopedia account

GET    /api/integrations/tokopedia/accounts/:id
       → Get specific account details

PUT    /api/integrations/tokopedia/accounts/:id
       → Update account settings

DELETE /api/integrations/tokopedia/accounts/:id
       → Remove account

POST   /api/integrations/tokopedia/accounts/:id/sync
       → Trigger sync for specific account

POST   /api/integrations/tokopedia/accounts/sync-all
       → Sync all accounts

POST   /api/integrations/tokopedia/accounts/:id/set-primary
       → Set account as primary

GET    /api/integrations/tokopedia/accounts/:id/stats
       → Get account statistics
```

### Sample API Response

```json
{
  "success": true,
  "data": {
    "accounts": [
      {
        "id": 1,
        "account_name": "Main Store - Jakarta",
        "account_identifier": "shop_12345",
        "status": "active",
        "enabled": true,
        "is_primary": true,
        "stats": {
          "total_products": 1245,
          "total_orders": 892,
          "pending_orders": 23,
          "daily_order_average": 245,
          "sync_count": 1520,
          "last_sync": "2025-12-01T14:58:00Z"
        },
        "shop_info": {
          "name": "Fashion Store Jakarta",
          "tier": "Gold Merchant",
          "location": "Jakarta"
        }
      },
      {
        "id": 2,
        "account_name": "Surabaya Branch",
        "account_identifier": "shop_67890",
        "status": "active",
        "enabled": true,
        "is_primary": false,
        "stats": {
          "total_products": 856,
          "total_orders": 567,
          "pending_orders": 12,
          "daily_order_average": 123,
          "sync_count": 890,
          "last_sync": "2025-12-01T14:45:00Z"
        },
        "shop_info": {
          "name": "Fashion Store Surabaya",
          "tier": "Official Store",
          "location": "Surabaya"
        }
      }
    ],
    "summary": {
      "total_accounts": 2,
      "active_accounts": 2,
      "total_products": 2101,
      "total_orders_today": 57,
      "pending_orders": 35
    }
  }
}
```

---

## 💼 **Use Cases**

### 1. Multi-Store Business
```
Scenario: Fashion brand with stores in different cities

Accounts:
- tokopedia-jakarta (Main Store - Jakarta)
- tokopedia-surabaya (Surabaya Branch)
- tokopedia-bandung (Bandung Outlet)

Benefits:
✅ Separate inventory per location
✅ Independent order fulfillment
✅ Location-specific pricing
✅ Consolidated reporting
```

### 2. Agency Managing Multiple Clients
```
Scenario: E-commerce agency managing client Tokopedia shops

Accounts:
- tokopedia-client-a (Client A Fashion)
- tokopedia-client-b (Client B Electronics)
- tokopedia-client-c (Client C Beauty)

Benefits:
✅ Separate credentials per client
✅ Client-specific reporting
✅ Easy account switching
✅ Centralized management dashboard
```

### 3. Testing & Production
```
Scenario: Development with staging environment

Accounts:
- tokopedia-production (Live Shop)
- tokopedia-staging (Test Shop)

Benefits:
✅ Safe testing without affecting live data
✅ Test new features before rollout
✅ Different sync frequencies
```

### 4. Warehouse-Based Operations
```
Scenario: Business with multiple warehouses

Accounts:
- tokopedia-warehouse-north (Northern Region)
- tokopedia-warehouse-south (Southern Region)
- tokopedia-warehouse-central (Central Hub)

Benefits:
✅ Warehouse-specific inventory
✅ Regional order routing
✅ Optimized shipping zones
```

---

## 🔐 **Security Considerations**

### Credential Isolation
- ✅ Each account has separate credentials
- ✅ Encrypted storage per account
- ✅ Independent token management
- ✅ No credential sharing between accounts

### Access Control
```sql
-- Add user/role-based access control
CREATE TABLE integration_account_access (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES integration_accounts(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50), -- 'admin', 'editor', 'viewer'
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Audit Trail
- 🔍 Track which account performed each action
- 🔍 Separate logs per account
- 🔍 User-account access logs

---

## 📊 **Reporting & Analytics**

### Consolidated Dashboard
```
┌─────────────────────────────────────────────────┐
│ Tokopedia Overview - All Accounts               │
├─────────────────────────────────────────────────┤
│                                                  │
│ Total Revenue Today:     Rp 45,670,000          │
│ Total Orders Today:      127                     │
│ Pending Orders:          35                      │
│ Active Products:         2,101                   │
│                                                  │
│ Performance by Account:                          │
│ ┌──────────────────────────────────────────┐   │
│ │ Main Store - Jakarta                      │   │
│ │ Revenue: Rp 28M | Orders: 82 | ⬆️ +15%    │   │
│ └──────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────┐   │
│ │ Surabaya Branch                           │   │
│ │ Revenue: Rp 12M | Orders: 32 | ⬆️ +8%     │   │
│ └──────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────┐   │
│ │ Bandung Outlet                            │   │
│ │ Revenue: Rp 5.6M | Orders: 13 | ⬇️ -3%    │   │
│ └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## ✅ **Implementation Checklist**

### Phase 1: Database Schema
- [ ] Create `integration_accounts` table
- [ ] Add indexes for performance
- [ ] Update `integration_mappings` with `account_id`
- [ ] Update `integration_logs` with `account_id`
- [ ] Create access control table (optional)
- [ ] Migrate existing data (if any)

### Phase 2: Backend APIs
- [ ] Create accounts CRUD endpoints
- [ ] Implement account-specific sync logic
- [ ] Add primary account management
- [ ] Create bulk sync functionality
- [ ] Add account statistics endpoint
- [ ] Implement access control (if needed)

### Phase 3: Frontend UI
- [ ] Update integrations page to show account count
- [ ] Create "Manage Accounts" dialog
- [ ] Create "Add Account" form
- [ ] Add account switcher/selector
- [ ] Create account-specific settings
- [ ] Add consolidated dashboard

### Phase 4: Testing
- [ ] Test adding multiple accounts
- [ ] Test account switching
- [ ] Test concurrent syncing
- [ ] Test primary account functionality
- [ ] Test credential isolation
- [ ] Load testing with multiple accounts

---

## 🎯 **Quick Start: Adding Second Account**

### For Merchants

1. **Navigate to Integrations**
   - Go to ERP → Integrations
   - Find Tokopedia

2. **Click "Manage Accounts"**
   - See list of connected accounts
   - Click "+ Add New Tokopedia Account"

3. **Fill in Details**
   - Account Name: "Surabaya Branch"
   - FS ID: Your second shop's FS ID
   - Shop ID: Your second shop ID
   - OAuth credentials for second shop

4. **Configure Settings**
   - Choose sync frequency
   - Enable desired features
   - Optionally set as primary

5. **Test & Connect**
   - Click "Test Connection"
   - Verify credentials work
   - Click "Connect"

6. **Done!**
   - Both accounts now sync independently
   - Switch between accounts anytime
   - View consolidated statistics

---

## 📈 **Benefits Summary**

### For Business
- ✅ **Scalability** - Add unlimited accounts
- ✅ **Flexibility** - Independent settings per account
- ✅ **Efficiency** - Manage all shops in one place
- ✅ **Visibility** - Consolidated reporting
- ✅ **Control** - Granular permissions

### For Operations
- ✅ **Separation** - Isolated inventory per shop
- ✅ **Automation** - Each account syncs independently
- ✅ **Reliability** - One account failure doesn't affect others
- ✅ **Performance** - Parallel syncing support

### For Developers
- ✅ **Clean Architecture** - Proper separation of concerns
- ✅ **Maintainability** - Easy to manage multiple accounts
- ✅ **Extensibility** - Pattern works for all integrations
- ✅ **Testing** - Easy to test with multiple accounts

---

## 🚀 **Next Steps**

1. **Review this document** with your team
2. **Choose implementation approach** (A or B)
3. **Create database migration** for multi-account schema
4. **Implement backend APIs** for account management
5. **Update frontend UI** with account management
6. **Test with 2-3 accounts** before production
7. **Deploy** and train users

---

## 📞 **Support**

**Questions about multi-account setup?**
- Review this guide thoroughly
- Check `/docs/TOKOPEDIA_INTEGRATION.md` for single account setup
- Test in staging environment first
- Contact Ocean ERP support for implementation help

---

**Status:** 📋 Design Complete - Ready for Implementation  
**Complexity:** Medium (2-3 days development)  
**Impact:** High (unlocks multi-store capabilities)  
**Updated:** December 1, 2025
