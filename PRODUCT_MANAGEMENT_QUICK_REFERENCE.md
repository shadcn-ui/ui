# Product Management - Quick Reference Guide

## 🚀 Quick Start

### Access Product Management
```
URL: http://localhost:4000/erp/product
```

### Add Product (3 Required Fields)
1. **SKU**: Unique code (e.g., "PROD-001")
2. **Name**: Product name (e.g., "Facial Cream")
3. **Unit Price**: Selling price (e.g., 49.99)

## 📋 Common Operations

### 1. Create Product via API
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD-001",
    "name": "Premium Facial Cream",
    "unit_price": 49.99,
    "category_id": 56,
    "status": "Active"
  }'
```

### 2. Update Product
```bash
curl -X PATCH http://localhost:4000/api/products/[ID] \
  -H "Content-Type: application/json" \
  -d '{
    "unit_price": 59.99,
    "description": "Updated description"
  }'
```

### 3. Delete Product
```bash
curl -X DELETE http://localhost:4000/api/products/[ID]
```

### 4. Search Products
```bash
# By status
curl "http://localhost:4000/api/products?status=Active"

# By category
curl "http://localhost:4000/api/products?category_id=56"

# Search text
curl "http://localhost:4000/api/products?search=cream"

# Low stock only
curl "http://localhost:4000/api/products?low_stock=true"

# Combine filters
curl "http://localhost:4000/api/products?category_id=56&status=Active&search=cream"
```

## 🎨 UI Features

### Dialog Tabs
| Tab | Purpose | Key Fields |
|-----|---------|------------|
| **Basic Info** | Core product details | SKU, Name, Category, Status, Brand |
| **Pricing** | Financial information | Unit Price, Cost Price, Currency, Tax |
| **Inventory** | Stock management | Reorder Level, Barcode, Min/Max Qty |
| **Details** | Product specifications | Size, Weight, Treatment Type, Tags |

### Table Features
- **Search**: Type in search box (name/SKU/barcode)
- **Filter**: Select category or status dropdown
- **Sort**: Click column headers (SKU, Name, Price)
- **Actions**: Click ⋮ menu → Edit or Delete

## 🏷️ Field Reference

### Required Fields ⚠️
- `sku` - Unique product code
- `name` - Product name
- `unit_price` - Selling price

### Common Optional Fields
| Field | Example | Purpose |
|-------|---------|---------|
| `category_id` | 56 | Link to category |
| `cost_price` | 25.00 | Your cost |
| `description` | "Moisturizing cream..." | Product details |
| `reorder_level` | 50 | Low stock alert |
| `barcode` | "5901234123457" | For scanning |
| `brand` | "LuxeSkin" | Brand name |
| `status` | "Active" | Product status |
| `tags` | ["skincare", "facial"] | Search tags |

### Product Status Options
- `Active` - Available for sale
- `Inactive` - Not currently selling
- `Draft` - Being prepared
- `Discontinued` - No longer available

### Unit of Measure Options
- `pcs` - Pieces (default)
- `kg` - Kilogram
- `g` - Gram
- `l` - Liter
- `ml` - Milliliter
- `box` - Box
- `pack` - Pack

### Currency Options
- `USD` - US Dollar (default)
- `EUR` - Euro
- `GBP` - British Pound
- `IDR` - Indonesian Rupiah

## 📊 Available Categories

Run to see all categories:
```bash
curl http://localhost:4000/api/product-categories | jq
```

Common categories:
- Facial Care (ID: 56)
- Body Care (ID: 57)
- Sun Protection (ID: 58)
- Acne Treatment (ID: 59)
- Anti-Aging (ID: 60)
- Moisturizers (ID: 61)
- Cleansers (ID: 62)
- Serums & Essences (ID: 63)

## 🔍 Stock Status Indicators

| Status | Badge Color | Meaning |
|--------|-------------|---------|
| In Stock | 🟢 Green | Sufficient inventory |
| Low Stock | 🟡 Yellow | Below reorder level |
| Out of Stock | 🔴 Red | Zero inventory |

## 💡 Tips & Tricks

### 1. Quick Product Entry
Minimum required for fast entry:
```json
{
  "sku": "QUICK-001",
  "name": "Quick Product",
  "unit_price": 29.99
}
```

### 2. Profit Margin Calculation
The UI automatically calculates:
- **Profit Margin %** = ((Price - Cost) / Price) × 100
- **Profit per Unit** = Price - Cost

### 3. Reorder Management
Set `reorder_level` to trigger low stock alerts:
- Recommended: 2-3 weeks of average sales
- Example: Sells 10/day → Set to 150-200

### 4. SKU Best Practices
- Use consistent format: `CATEGORY-SUBCATEGORY-NUMBER`
- Examples:
  - `FACE-CREAM-001`
  - `BODY-LOTION-025`
  - `SUN-SPF50-010`

### 5. Tag Strategy
Use tags for:
- Product type: "cream", "serum", "mask"
- Skin type: "oily", "dry", "sensitive"
- Special: "bestseller", "new", "sale"

## 🐛 Troubleshooting

### Product Not Showing in List
✅ Check status filter (might be filtered out)
✅ Check if deleted (deleted_at is set)
✅ Refresh page

### Can't Edit Product
✅ Verify product exists
✅ Check network console for errors
✅ Ensure valid data types

### SKU Already Exists Error
✅ Choose unique SKU
✅ Check for soft-deleted products with same SKU

### Stock Status Not Updating
✅ Product needs inventory records
✅ Check inventory table has entries
✅ Verify reorder_level is set

## 📱 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Add Dialog | Click "Add New Product" |
| Submit Form | Enter (when in input) |
| Add Tag | Enter (in tags field) |
| Close Dialog | Esc |

## 🔗 Related Pages

- **Suppliers**: `/erp/product/suppliers`
- **Inventory**: `/erp/product/inventory`
- **Purchase Orders**: `/erp/product/purchase-orders`
- **Warehouses**: `/erp/product/warehouses`

## ✅ Checklist: Adding Your First Product

- [ ] Open http://localhost:4000/erp/product
- [ ] Click "Add New Product" button
- [ ] Enter SKU (e.g., "TEST-001")
- [ ] Enter Name (e.g., "Test Product")
- [ ] Enter Unit Price (e.g., 19.99)
- [ ] (Optional) Select Category
- [ ] (Optional) Add Cost Price
- [ ] (Optional) Set Reorder Level
- [ ] Click "Create Product"
- [ ] Verify product appears in table
- [ ] Test edit by clicking ⋮ → Edit
- [ ] Test search by typing product name

---

**Need Help?**
- Check full documentation: `PRODUCT_MANAGEMENT_DOCUMENTATION.md`
- View API errors in browser console (F12)
- Check server logs for detailed errors
