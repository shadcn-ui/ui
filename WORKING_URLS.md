# Ocean ERP - Working Application URLs 🚀

**Last Updated:** December 4, 2025  
**Server:** http://localhost:4000  
**Status:** ✅ Running

---

## 🏠 Main Application

### Dashboard & Home
```
http://localhost:4000
```
Main application entry point

---

## 📊 Working API Endpoints

### ✅ Analytics APIs

#### Dashboard Analytics
```bash
curl http://localhost:4000/api/analytics
```
**Returns:** KPIs including orders, revenue, customers, leads, opportunities, quotations

**Response includes:**
- `orders_this_month`, `revenue_this_month`
- `new_customers_this_month`
- `orders_ytd`, `revenue_ytd`
- `total_customers`, `total_leads`, `total_opportunities`
- `avg_order_value`, `avg_customer_lifetime_value`
- `lead_to_order_conversion_rate`

---

### ✅ User Management APIs

#### List All Users
```bash
curl http://localhost:4000/api/users
```
**Returns:** All users with roles and statistics

#### Get User by ID
```bash
curl http://localhost:4000/api/users/1
```

---

### ✅ CRM APIs (Existing)

#### Accounts
```bash
curl http://localhost:4000/api/crm/accounts
```

#### Opportunities
```bash
curl http://localhost:4000/api/crm/opportunities
```

#### Cases (Support Tickets)
```bash
curl http://localhost:4000/api/crm/cases
```

#### Campaigns
```bash
curl http://localhost:4000/api/crm/campaigns
```

#### Communications
```bash
curl http://localhost:4000/api/crm/communications
```

#### Forecasts
```bash
curl http://localhost:4000/api/crm/forecasts
```

#### Knowledge Base
```bash
curl http://localhost:4000/api/crm/knowledge
```

#### Lead Scoring
```bash
curl http://localhost:4000/api/crm/lead-scoring
```

#### Support Dashboard
```bash
curl http://localhost:4000/api/crm/support/dashboard
```

#### Marketing Analytics
```bash
curl http://localhost:4000/api/crm/marketing/analytics
```

---

### ✅ Additional Working APIs

Check these existing API routes:

- `/api/products` - Product catalog
- `/api/customers` - Customer management
- `/api/orders` - Sales orders
- `/api/quotations` - Price quotations
- `/api/suppliers` - Supplier management
- `/api/inventory` - Inventory tracking
- `/api/warehouse` - Warehouse management
- `/api/analytics/dashboard` - Detailed analytics
- `/api/analytics/forecasts/*` - Forecasting
- `/api/analytics/alerts` - Business alerts
- `/api/analytics/recommendations/*` - AI recommendations

---

## 🔍 Discovering More Endpoints

### Method 1: Check Available Routes
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
find apps/v4/app/api -name "route.ts" -type f | head -50
```

### Method 2: Test Common Patterns
```bash
# Test a route
curl -s http://localhost:4000/api/[module]/[resource] | json_pp

# Example
curl -s http://localhost:4000/api/crm/accounts | json_pp
```

### Method 3: Check with Verbose Output
```bash
curl -v http://localhost:4000/api/users 2>&1 | grep "< HTTP"
```

---

## 📋 API Testing Examples

### Analytics Dashboard
```bash
curl -s http://localhost:4000/api/analytics | json_pp
```

### Users List
```bash
curl -s http://localhost:4000/api/users | json_pp
```

### User by ID
```bash
curl -s http://localhost:4000/api/users/1 | json_pp
```

### CRM Opportunities
```bash
curl -s http://localhost:4000/api/crm/opportunities | json_pp
```

### CRM Cases
```bash
curl -s http://localhost:4000/api/crm/cases | json_pp
```

---

## 🎯 Quick Access URLs

### Most Commonly Used

1. **Analytics Dashboard**
   ```
   http://localhost:4000/api/analytics
   ```

2. **Users Management**
   ```
   http://localhost:4000/api/users
   ```

3. **CRM Opportunities**
   ```
   http://localhost:4000/api/crm/opportunities
   ```

4. **CRM Cases (Support)**
   ```
   http://localhost:4000/api/crm/cases
   ```

5. **Marketing Analytics**
   ```
   http://localhost:4000/api/crm/marketing/analytics
   ```

---

## 🚧 Planned API Endpoints (Not Yet Implemented)

The following endpoints are **documented in `/docs/api/API_REFERENCE.md`** but **not yet implemented**:

### CRM - Phase 7 (Planned)
- `/api/crm/leads` - Lead management (PLANNED)
- `/api/crm/contacts` - Contact management (PLANNED)
- `/api/crm/companies` - Company management (PLANNED)
- `/api/crm/interactions` - Interaction tracking (PLANNED)

### Project Management - Phase 7 (Planned)
- `/api/projects` - Project management (PLANNED)
- `/api/projects/tasks` - Task management (PLANNED)
- `/api/projects/time-entries` - Time tracking (PLANNED)
- `/api/projects/resources` - Resource management (PLANNED)
- `/api/projects/budgets` - Budget tracking (PLANNED)
- `/api/projects/expenses` - Expense management (PLANNED)
- `/api/projects/documents` - Document management (PLANNED)
- `/api/projects/analytics` - Project analytics (PLANNED)

**Note:** These endpoints have complete OpenAPI specifications and API documentation ready for implementation.

---

## 🛠️ Development Server

### Start Server
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
pnpm dev --filter=v4
```

### Check Server Status
```bash
curl http://localhost:4000/api/analytics
```

### View Logs
```bash
tail -f server.log
```

---

## 📚 Documentation Reference

### Existing Implementation
- **Working APIs:** This document (WORKING_URLS.md)
- **Server Status:** Check with curl commands above

### Planned Implementation
- **API Reference:** `/docs/api/API_REFERENCE.md`
- **OpenAPI Spec:** `/docs/api/openapi.yaml`
- **Postman Collection:** `/postman/Ocean-ERP-API-v4.postman_collection.json`
- **Swagger Setup:** `/docs/api/SWAGGER_SETUP.md`

---

## 🎓 How to Explore the Application

### Step 1: Verify Server is Running
```bash
curl http://localhost:4000/api/analytics
```

### Step 2: List All Available Route Files
```bash
find apps/v4/app/api -name "route.ts" -type f | sort
```

### Step 3: Test Common Endpoints
```bash
# Analytics
curl -s http://localhost:4000/api/analytics | json_pp

# Users
curl -s http://localhost:4000/api/users | json_pp

# CRM
curl -s http://localhost:4000/api/crm/opportunities | json_pp
curl -s http://localhost:4000/api/crm/cases | json_pp
curl -s http://localhost:4000/api/crm/accounts | json_pp
```

### Step 4: Browse in Browser
Open your browser and visit:
- http://localhost:4000 (Main app)
- http://localhost:4000/api/analytics (API response)
- http://localhost:4000/api/users (Users list)

---

## ⚡ Quick Test Script

Save this as `test-apis.sh`:

```bash
#!/bin/bash

echo "Testing Ocean ERP APIs..."
echo ""

echo "1. Analytics Dashboard:"
curl -s http://localhost:4000/api/analytics | json_pp | head -20
echo ""

echo "2. Users List:"
curl -s http://localhost:4000/api/users | json_pp | head -20
echo ""

echo "3. CRM Opportunities:"
curl -s http://localhost:4000/api/crm/opportunities | json_pp | head -20
echo ""

echo "4. CRM Cases:"
curl -s http://localhost:4000/api/crm/cases | json_pp | head -20
echo ""

echo "Tests complete!"
```

Run it:
```bash
chmod +x test-apis.sh
./test-apis.sh
```

---

## 📊 API Status Summary

| Module | Status | Endpoint Example |
|--------|--------|------------------|
| Analytics | ✅ Working | `/api/analytics` |
| Users | ✅ Working | `/api/users` |
| CRM Opportunities | ✅ Working | `/api/crm/opportunities` |
| CRM Cases | ✅ Working | `/api/crm/cases` |
| CRM Accounts | ✅ Working | `/api/crm/accounts` |
| CRM Campaigns | ✅ Working | `/api/crm/campaigns` |
| CRM Leads | 🚧 Planned | `/api/crm/leads` (documented) |
| CRM Contacts | 🚧 Planned | `/api/crm/contacts` (documented) |
| Projects | 🚧 Planned | `/api/projects` (documented) |
| Tasks | 🚧 Planned | `/api/projects/tasks` (documented) |

---

## 🔧 Troubleshooting

### Issue: "Could not connect"
**Solution:**
```bash
# Check if server is running
ps aux | grep "next dev"

# Start server if not running
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
pnpm dev --filter=v4
```

### Issue: "404 Not Found"
**Solution:**
- Verify the endpoint exists in `apps/v4/app/api/`
- Check this document for working endpoints
- Some endpoints from API documentation are planned but not yet implemented

### Issue: "Connection refused"
**Solution:**
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill existing process if needed
kill -9 [PID]

# Restart server
pnpm dev --filter=v4
```

---

## 📞 Need Help?

- **Check if endpoint exists:** Look in `apps/v4/app/api/` directory
- **Test with curl:** Use examples above
- **View server logs:** `tail -f server.log`
- **Restart server:** `pnpm dev --filter=v4`

---

**✅ WORKING:** This document lists only functional, tested endpoints  
**🚧 PLANNED:** See `/docs/api/API_REFERENCE.md` for future endpoints  
**📝 STATUS:** Updated December 4, 2025

Use the curl commands above to test each endpoint immediately!
