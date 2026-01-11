# 🎯 Multi-Account Tokopedia - Visual Guide

## Current vs Multi-Account Comparison

### BEFORE (Single Account)
```
┌─────────────────────────────────────────┐
│         OCEAN ERP                       │
│                                         │
│  ┌───────────────────────────────┐    │
│  │   Tokopedia Integration       │    │
│  │                               │    │
│  │   Shop: Main Store            │    │
│  │   FS ID: 12345                │    │
│  │   Status: Active              │    │
│  │                               │    │
│  │   ⚠️ Can only connect ONE shop │    │
│  └───────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘

❌ Limitation: One shop per integration
```

---

### AFTER (Multi-Account)
```
┌──────────────────────────────────────────────────────────────┐
│                    OCEAN ERP                                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Tokopedia Integration (Platform)            │    │
│  ├────────────────────────────────────────────────────┤    │
│  │                                                     │    │
│  │  Account 1: Main Store - Jakarta (Primary)        │    │
│  │  ├─ FS ID: 12345                                  │    │
│  │  ├─ Shop ID: 67890                                │    │
│  │  ├─ Status: ✅ Active                             │    │
│  │  ├─ Sync: Every 15 minutes                        │    │
│  │  └─ Products: 1,245 | Orders: 892                 │    │
│  │                                                     │    │
│  │  Account 2: Surabaya Branch                       │    │
│  │  ├─ FS ID: 67890                                  │    │
│  │  ├─ Shop ID: 12345                                │    │
│  │  ├─ Status: ✅ Active                             │    │
│  │  ├─ Sync: Every 30 minutes                        │    │
│  │  └─ Products: 856 | Orders: 567                   │    │
│  │                                                     │    │
│  │  Account 3: Bandung Outlet                        │    │
│  │  ├─ FS ID: 11111                                  │    │
│  │  ├─ Shop ID: 22222                                │    │
│  │  ├─ Status: ⚪ Inactive (Testing)                 │    │
│  │  ├─ Sync: Manual only                             │    │
│  │  └─ Products: 234 | Orders: 0                     │    │
│  │                                                     │    │
│  │  [+ Add More Accounts]                            │    │
│  │                                                     │    │
│  │  Total: 2,335 products | 1,459 orders            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

✅ Benefit: Unlimited shops, centralized management
```

---

## Database Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE STRUCTURE                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│   integrations          │  ← Platform Definition
│─────────────────────────│
│ id: 1                   │
│ integration_id: tokopedia│
│ name: Tokopedia         │
│ category: ecommerce     │
│ config: {...}           │
└────────────┬────────────┘
             │
             │ One-to-Many
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              integration_accounts                            │
│──────────────────────────────────────────────────────────────│
│                                                              │
│  [Account 1]                                                │
│  id: 1                                                       │
│  integration_id: 'tokopedia'  ←─────┐                      │
│  account_name: 'Main Store'          │                      │
│  account_identifier: 'shop_12345'    │                      │
│  credentials: {fs_id, client_id...}  │  Links to platform   │
│  is_primary: true                    │                      │
│  status: active                      │                      │
│  ─────────────────────────────────────┘                      │
│                                                              │
│  [Account 2]                                                │
│  id: 2                                                       │
│  integration_id: 'tokopedia'  ←─────┐                      │
│  account_name: 'Surabaya Branch'     │                      │
│  account_identifier: 'shop_67890'    │                      │
│  credentials: {fs_id, client_id...}  │  Links to platform   │
│  is_primary: false                   │                      │
│  status: active                      │                      │
│  ─────────────────────────────────────┘                      │
│                                                              │
│  [Account 3]                                                │
│  id: 3                                                       │
│  integration_id: 'tokopedia'  ←─────┐                      │
│  account_name: 'Bandung Outlet'      │                      │
│  account_identifier: 'shop_11111'    │                      │
│  credentials: {fs_id, client_id...}  │  Links to platform   │
│  is_primary: false                   │                      │
│  status: inactive                    │                      │
│  ─────────────────────────────────────┘                      │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    │ One-to-Many
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│              integration_mappings                             │
│───────────────────────────────────────────────────────────────│
│  Maps external IDs to internal IDs per account               │
│                                                               │
│  [Mapping 1] account_id: 1, product_id: 100, tokopedia_id: T1│
│  [Mapping 2] account_id: 1, order_id: 50, tokopedia_id: O1  │
│  [Mapping 3] account_id: 2, product_id: 101, tokopedia_id: T2│
│  [Mapping 4] account_id: 2, order_id: 51, tokopedia_id: O2  │
│                                                               │
│  ✅ Each account has separate mappings                       │
└──────────────────────────────────────────────────────────────┘

                    │
                    │ One-to-Many
                    │
                    ▼
┌──────────────────────────────────────────────────────────────┐
│                  integration_logs                             │
│───────────────────────────────────────────────────────────────│
│  Tracks sync activity per account                            │
│                                                               │
│  [Log 1] account_id: 1, action: sync_products, status: success│
│  [Log 2] account_id: 1, action: sync_orders, status: success │
│  [Log 3] account_id: 2, action: sync_products, status: success│
│  [Log 4] account_id: 3, action: test_connection, status: error│
│                                                               │
│  ✅ Track performance per account                            │
└──────────────────────────────────────────────────────────────┘
```

---

## User Journey: Adding Second Account

```
Step 1: Navigate to Integrations
┌────────────────────────────────┐
│  ERP > Integrations            │
│                                │
│  🛍️ Tokopedia                  │
│  Connected: 1 account          │
│  [Manage Accounts]  [Settings] │
└────────────────────────────────┘
           │
           ▼
Step 2: Manage Accounts
┌─────────────────────────────────────┐
│  Tokopedia Accounts            [×] │
│                                     │
│  ✅ Main Store (Primary)           │
│     [Edit] [Sync] [Settings]       │
│                                     │
│  [+ Add New Account] ←─────────────│  Click here
└─────────────────────────────────────┘
           │
           ▼
Step 3: Fill Account Details
┌─────────────────────────────────────┐
│  Add New Tokopedia Account     [×] │
│                                     │
│  Account Name:                     │
│  [Surabaya Branch__________]       │
│                                     │
│  FS ID:                            │
│  [67890____________________]       │
│                                     │
│  Shop ID:                          │
│  [12345____________________]       │
│                                     │
│  Client ID:                        │
│  [xyz789___________________]       │
│                                     │
│  Client Secret:                    │
│  [●●●●●●●●●●●●●●●●●●●●●●●]       │
│                                     │
│  [Test Connection] [Connect]       │
└─────────────────────────────────────┘
           │
           ▼
Step 4: Success!
┌─────────────────────────────────────┐
│  ✅ Account Connected!              │
│                                     │
│  Surabaya Branch is now syncing    │
│  - Products: Syncing...            │
│  - Orders: Syncing...              │
│  - Inventory: Syncing...           │
│                                     │
│  [View Account] [Done]             │
└─────────────────────────────────────┘
           │
           ▼
Step 5: Both Accounts Active
┌─────────────────────────────────────┐
│  Tokopedia Accounts            [×] │
│                                     │
│  ✅ Main Store (Primary)           │
│     Last sync: 2 mins ago          │
│     [Edit] [Sync] [Settings]       │
│                                     │
│  ✅ Surabaya Branch                │
│     Last sync: Just now            │
│     [Edit] [Sync] [Settings]       │
│                                     │
│  [+ Add Another Account]           │
└─────────────────────────────────────┘
```

---

## Data Flow: Multi-Account Sync

```
┌─────────────────────────────────────────────────────────────┐
│                  SYNC PROCESS                               │
└─────────────────────────────────────────────────────────────┘

Time: 10:00 AM - Account 1 Syncs
════════════════════════════════════════
Tokopedia API (Shop 12345)
         │
         │ 1. Fetch Products/Orders
         ▼
Ocean ERP Backend
         │
         │ 2. Process Data
         ▼
integration_accounts (id: 1)
         │
         │ 3. Update Stats
         ├────────► integration_mappings (account_id: 1)
         │          └─ Map: Tokopedia Product T1 → Internal Product 100
         │
         └────────► integration_logs (account_id: 1)
                    └─ Log: "Synced 10 products, 5 orders"

✅ Result: Account 1 updated, Account 2 unaffected


Time: 10:15 AM - Account 2 Syncs (Independent)
════════════════════════════════════════
Tokopedia API (Shop 67890)  ← Different shop
         │
         │ 1. Fetch Products/Orders
         ▼
Ocean ERP Backend
         │
         │ 2. Process Data
         ▼
integration_accounts (id: 2)
         │
         │ 3. Update Stats
         ├────────► integration_mappings (account_id: 2)
         │          └─ Map: Tokopedia Product T2 → Internal Product 101
         │
         └────────► integration_logs (account_id: 2)
                    └─ Log: "Synced 8 products, 3 orders"

✅ Result: Account 2 updated, Account 1 unaffected
```

---

## Real-World Example: Fashion Store Chain

```
┌──────────────────────────────────────────────────────────────┐
│           FASHION STORE INDONESIA - Multi-City               │
└──────────────────────────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐
│  JAKARTA STORE      │  │  SURABAYA STORE     │  │  BANDUNG STORE       │
│─────────────────────│  │─────────────────────│  │──────────────────────│
│ Tokopedia Shop:     │  │ Tokopedia Shop:     │  │ Tokopedia Shop:      │
│ fashion_jkt         │  │ fashion_sby         │  │ fashion_bdg          │
│                     │  │                     │  │                      │
│ Products: 1,245     │  │ Products: 856       │  │ Products: 432        │
│ Orders/day: 245     │  │ Orders/day: 123     │  │ Orders/day: 67       │
│                     │  │                     │  │                      │
│ Warehouse:          │  │ Warehouse:          │  │ Warehouse:           │
│ Jakarta Central     │  │ Surabaya Hub        │  │ Bandung West         │
│                     │  │                     │  │                      │
│ Sync: Every 15 min  │  │ Sync: Every 30 min  │  │ Sync: Every hour     │
│ Status: ✅ Active   │  │ Status: ✅ Active   │  │ Status: ✅ Active    │
└─────────────────────┘  └─────────────────────┘  └──────────────────────┘
          │                        │                         │
          └────────────────────────┴─────────────────────────┘
                                   │
                                   ▼
               ┌─────────────────────────────────────┐
               │    OCEAN ERP - SINGLE DASHBOARD    │
               │─────────────────────────────────────│
               │                                     │
               │  Consolidated View:                │
               │  ─────────────────                 │
               │  Total Products: 2,533             │
               │  Total Orders Today: 435           │
               │  Total Revenue: Rp 125,000,000     │
               │                                     │
               │  Per Store Breakdown:              │
               │  • Jakarta:  Rp 75M  (245 orders) │
               │  • Surabaya: Rp 35M  (123 orders) │
               │  • Bandung:  Rp 15M  (67 orders)  │
               │                                     │
               │  [View Details] [Sync All]         │
               └─────────────────────────────────────┘
```

---

## Benefits Visualization

```
╔════════════════════════════════════════════════════════════╗
║              SINGLE ACCOUNT vs MULTI-ACCOUNT              ║
╚════════════════════════════════════════════════════════════╝

SINGLE ACCOUNT                   MULTI-ACCOUNT
═══════════════════             ══════════════════════════

🏪 1 Shop                       🏪 Unlimited Shops
📊 Basic reporting              📊 Consolidated + Per-shop reports
⚙️  One configuration           ⚙️  Independent configurations
🔄 One sync schedule            🔄 Multiple sync schedules
📦 Single warehouse             📦 Multi-warehouse support
👥 One team                     👥 Multi-team management
🧪 No testing environment       🧪 Production + Staging
💼 Solo business only           💼 Agency-ready

❌ Limited scalability          ✅ Highly scalable
❌ Can't grow easily            ✅ Easy expansion
❌ Risky to test                ✅ Safe testing
❌ Manual consolidation         ✅ Automatic consolidation
```

---

## Implementation Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                    WEEK 1 TIMELINE                          │
└─────────────────────────────────────────────────────────────┘

Day 1: Database Setup
├─ ✅ Review documentation (1 hour)
├─ ✅ Run migration script (5 minutes)
├─ ✅ Verify tables created (15 minutes)
└─ ✅ Test with sample data (30 minutes)

Day 2-3: Backend Development
├─ 🔄 Create account CRUD APIs (4 hours)
├─ 🔄 Implement account-specific sync (4 hours)
├─ 🔄 Add primary account logic (2 hours)
└─ 🔄 Create statistics endpoints (2 hours)

Day 4-5: Frontend Development
├─ 🔄 Update integrations page (3 hours)
├─ 🔄 Create "Manage Accounts" dialog (4 hours)
├─ 🔄 Create "Add Account" form (3 hours)
└─ 🔄 Add consolidated dashboard (2 hours)

Day 6: Testing
├─ 🔄 Test adding accounts (2 hours)
├─ 🔄 Test concurrent syncing (2 hours)
├─ 🔄 Test error scenarios (2 hours)
└─ 🔄 Load testing (2 hours)

Day 7: Deployment
├─ 🔄 Review and QA (2 hours)
├─ 🔄 Deploy to production (1 hour)
└─ 🔄 Monitor and verify (Ongoing)

Total: 5-7 days for complete implementation
```

---

## Support & Resources

```
📚 Documentation Files:
├─ /docs/TOKOPEDIA_MULTI_ACCOUNT.md (Complete guide)
├─ /docs/TOKOPEDIA_INTEGRATION.md (Single account)
├─ /database/014_integration_multi_account.sql (Migration)
└─ TOKOPEDIA_MULTI_ACCOUNT_SUMMARY.md (This summary)

🔧 Database Migration:
└─ Ready to deploy: Just run the SQL file!

🎨 UI Mockups:
└─ Included in documentation

📞 Support:
├─ Documentation (Self-service)
├─ GitHub Issues (Bug reports)
└─ Ocean ERP Support Team (Implementation help)
```

---

**Ready to connect multiple Tokopedia accounts?** 🚀

1. Read `/docs/TOKOPEDIA_MULTI_ACCOUNT.md`
2. Run database migration
3. Implement APIs and UI
4. Start managing multiple shops!

**Created:** December 1, 2025  
**Status:** ✅ Design Complete
