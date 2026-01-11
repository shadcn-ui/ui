# Asset Management - Quick Installation & Testing Guide

## 🚀 Quick Install (2 minutes)

### Step 1: Install Database Schema
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
psql $DATABASE_URL -f database/020_phase7_asset_management.sql
```

**What gets installed:**
- ✅ 9 tables (asset_categories, asset_locations, assets, etc.)
- ✅ 4 automated triggers
- ✅ 25+ indexes
- ✅ 18 sample records (6 categories, 5 locations, 5 assets, 2 schedules)

### Step 2: Verify Installation
```bash
# Check tables were created
psql $DATABASE_URL -c "
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_name LIKE 'asset%' 
  ORDER BY table_name;
"

# Check sample data
psql $DATABASE_URL -c "
  SELECT 'Categories' as type, COUNT(*)::text as count FROM asset_categories
  UNION ALL
  SELECT 'Locations', COUNT(*)::text FROM asset_locations
  UNION ALL
  SELECT 'Assets', COUNT(*)::text FROM assets;
"
```

Expected output:
```
     type     | count 
--------------+-------
 Categories   | 6
 Locations    | 5
 Assets       | 5
```

### Step 3: Start API Server
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp/apps/v4
PORT=4000 pnpm dev
```

Access at: **http://localhost:4000**

---

## 🧪 Quick Test (5 minutes)

### Test 1: List All Assets
```bash
curl http://localhost:4000/api/assets | jq
```

Expected: List of 5 sample assets (laptop, printer, desk, van, server)

### Test 2: Get Asset Details
```bash
curl http://localhost:4000/api/assets/1 | jq
```

Expected: Dell Latitude 5420 Laptop with full details

### Test 3: List Categories
```bash
curl http://localhost:4000/api/assets/categories | jq
```

Expected: 6 categories (Computers, Furniture, Vehicles, Machinery, Buildings, Software)

### Test 4: List Locations
```bash
curl http://localhost:4000/api/assets/locations | jq
```

Expected: 5 locations (HQ floors, warehouse, production, IT room)

### Test 5: Create New Asset
```bash
curl -X POST http://localhost:4000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Test Asset",
    "category_id": 1,
    "purchase_date": "2024-12-01",
    "purchase_price": 1000.00,
    "current_location_id": 1,
    "depreciation_start_date": "2024-12-01",
    "useful_life_years": 3,
    "salvage_value": 100.00,
    "created_by": 1
  }' | jq
```

Expected: New asset created with auto-generated asset_number (ASSET-00006)

### Test 6: Calculate Depreciation
```bash
curl -X POST http://localhost:4000/api/assets/depreciation \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2024,
    "month": 12,
    "created_by": 1
  }' | jq
```

Expected: Depreciation records created for all assets with depreciation_start_date

### Test 7: Create Maintenance Record
```bash
curl -X POST http://localhost:4000/api/assets/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "maintenance_type": "preventive",
    "scheduled_date": "2024-12-15",
    "maintenance_status": "scheduled",
    "issue_description": "Regular maintenance",
    "created_by": 1
  }' | jq
```

Expected: New maintenance record with auto-generated maintenance_number (MAINT-000001)

### Test 8: Create Transfer Request
```bash
curl -X POST http://localhost:4000/api/assets/transfers \
  -H "Content-Type: application/json" \
  -d '{
    "asset_id": 1,
    "from_location_id": 2,
    "to_location_id": 3,
    "transfer_reason": "Testing transfer workflow",
    "requested_by": 1
  }' | jq
```

Expected: New transfer with status='pending' and transfer_number (TRANS-000001)

---

## 📊 Sample Data Overview

### Categories (6)
1. **COMP** - Computers (3 years, straight-line, 10% salvage)
2. **FURN** - Furniture (7 years, straight-line, 15% salvage)
3. **VEHI** - Vehicles (5 years, declining balance, 20% salvage)
4. **MACH** - Machinery (10 years, double declining, 10% salvage)
5. **BLDG** - Buildings (30 years, straight-line, 20% salvage)
6. **SOFT** - Software (3 years, straight-line, 0% salvage)

### Locations (5)
1. **HQ-1** - Main Office - Floor 1 (23 assets)
2. **HQ-2** - Main Office - Floor 2 (15 assets)
3. **WH-1** - Main Warehouse (120 assets)
4. **PROD-1** - Production Floor (45 assets)
5. **IT-ROOM** - IT Server Room (12 assets)

### Assets (5)
1. **ASSET-00001** - Dell Latitude 5420 Laptop ($1,200)
2. **ASSET-00002** - HP LaserJet Pro M404dn Printer ($450)
3. **ASSET-00003** - Executive Office Desk ($800)
4. **ASSET-00004** - Ford Transit Cargo Van ($35,000)
5. **ASSET-00005** - Dell PowerEdge R740 Server ($8,500)

### Maintenance Schedules (2)
1. IT Equipment - 6 Month Maintenance (180 days)
2. Vehicle - 3 Month Service (90 days)

---

## 🔍 Database Queries

### Get Assets Needing Maintenance
```sql
SELECT 
  asset_number,
  asset_name,
  next_maintenance_date,
  DATE_PART('day', next_maintenance_date - CURRENT_DATE) as days_until_due
FROM assets
WHERE 
  asset_status = 'in_use' 
  AND next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY next_maintenance_date;
```

### Get Depreciation Summary by Category
```sql
SELECT 
  c.category_name,
  COUNT(*) as asset_count,
  SUM(a.purchase_price) as total_purchase_value,
  SUM(a.current_book_value) as total_book_value,
  SUM(a.accumulated_depreciation) as total_depreciation
FROM assets a
JOIN asset_categories c ON a.category_id = c.category_id
WHERE a.asset_status != 'disposed'
GROUP BY c.category_name
ORDER BY total_purchase_value DESC;
```

### Get Asset Location Report
```sql
SELECT 
  l.location_name,
  COUNT(*) as asset_count,
  SUM(a.purchase_price) as total_value
FROM assets a
JOIN asset_locations l ON a.current_location_id = l.location_id
WHERE a.asset_status != 'disposed'
GROUP BY l.location_name
ORDER BY asset_count DESC;
```

### Get Transfer History
```sql
SELECT 
  t.transfer_number,
  a.asset_number,
  a.asset_name,
  fl.location_name as from_location,
  tl.location_name as to_location,
  t.transfer_status,
  t.request_date
FROM asset_transfers t
JOIN assets a ON t.asset_id = a.asset_id
LEFT JOIN asset_locations fl ON t.from_location_id = fl.location_id
LEFT JOIN asset_locations tl ON t.to_location_id = tl.location_id
ORDER BY t.request_date DESC
LIMIT 10;
```

---

## 🎯 API Endpoints Reference

### Assets
- `GET /api/assets` - List assets (with filters)
- `POST /api/assets` - Create asset
- `GET /api/assets/[id]` - Get asset details
- `PUT /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Soft delete asset

### Maintenance
- `GET /api/assets/maintenance` - List maintenance records
- `POST /api/assets/maintenance` - Create maintenance record

### Depreciation
- `GET /api/assets/depreciation` - List depreciation records
- `POST /api/assets/depreciation` - Calculate depreciation

### Transfers
- `GET /api/assets/transfers` - List transfer requests
- `POST /api/assets/transfers` - Create transfer
- `PUT /api/assets/transfers/[id]` - Update transfer status

### Disposal
- `GET /api/assets/disposal` - List disposal records
- `POST /api/assets/disposal` - Create disposal

### Categories & Locations
- `GET /api/assets/categories` - List categories
- `POST /api/assets/categories` - Create category
- `GET /api/assets/locations` - List locations
- `POST /api/assets/locations` - Create location

---

## 📁 File Locations

### Database
- `/database/020_phase7_asset_management.sql` (850 lines)

### API Routes
- `/apps/v4/app/api/assets/route.ts`
- `/apps/v4/app/api/assets/[id]/route.ts`
- `/apps/v4/app/api/assets/maintenance/route.ts`
- `/apps/v4/app/api/assets/depreciation/route.ts`
- `/apps/v4/app/api/assets/transfers/route.ts`
- `/apps/v4/app/api/assets/transfers/[id]/route.ts`
- `/apps/v4/app/api/assets/disposal/route.ts`
- `/apps/v4/app/api/assets/categories/route.ts`
- `/apps/v4/app/api/assets/locations/route.ts`

### Documentation
- `/PHASE_7_TASK_7_COMPLETE.md` (comprehensive docs)
- `/PHASE_7_TASK_7_SUMMARY.md` (quick summary)
- `/ASSET_MANAGEMENT_INSTALL_GUIDE.md` (this file)

---

## ✅ Installation Checklist

- [ ] Database schema installed
- [ ] Sample data verified (6 categories, 5 locations, 5 assets)
- [ ] API server running on port 4000
- [ ] All 8 API endpoints tested
- [ ] Can list assets successfully
- [ ] Can create new assets
- [ ] Can calculate depreciation
- [ ] Can create maintenance records
- [ ] Can create transfer requests

---

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

### API Not Responding
```bash
# Check if server is running
lsof -i :4000

# Restart server
cd apps/v4
PORT=4000 pnpm dev
```

### Missing Tables
```bash
# Re-run schema installation
psql $DATABASE_URL -f database/020_phase7_asset_management.sql
```

---

## 📚 Additional Resources

- **Full Documentation:** [PHASE_7_TASK_7_COMPLETE.md](./PHASE_7_TASK_7_COMPLETE.md)
- **Summary:** [PHASE_7_TASK_7_SUMMARY.md](./PHASE_7_TASK_7_SUMMARY.md)
- **Phase 7 Roadmap:** [PHASE_7_ROADMAP.md](./PHASE_7_ROADMAP.md)

---

*Quick Installation Guide - December 2024*  
*Ocean ERP v4 - Phase 7 Task 7*
