# 🇮🇩 Rupiah (IDR) Implementation - Quick Reference

## ✅ What's Done

### 1. Database ✅
- All 93 products converted to IDR
- 17 new Indonesian products added (ID-* SKUs)
- 2 manufacturing BOMs updated with Rupiah costs
- 20 Indonesian customers created
- 10 sample sales orders with Rupiah totaling Rp 82.9M
- Default currency changed to IDR

### 2. Product Categories ✅
- Elektronik (Electronics)
- Furniture Kantor (Office Furniture)
- Alat Tulis Kantor (Office Supplies)
- Makanan & Minuman (Food & Beverage)
- Kosmetik (Cosmetics)

### 3. Sample Data ✅
All sample data includes:
- PPN 11% (Indonesian VAT)
- Realistic Indonesian pricing
- Indonesian addresses and customer names
- Multiple order types (electronics, furniture, office supplies, F&B, cosmetics)

---

## 🔍 Quick Verification Queries

### Check All Products are IDR
```sql
SELECT COUNT(*) as total, 
       COUNT(*) FILTER (WHERE currency = 'IDR') as idr_count
FROM products;
-- Expected: All products should be IDR
```

### View Indonesian Products
```sql
SELECT sku, name, 
       'Rp ' || TO_CHAR(unit_price, 'FM999,999,999') as price
FROM products 
WHERE sku LIKE 'ID-%'
ORDER BY unit_price DESC;
```

### Check Manufacturing Costs
```sql
SELECT p.name, 
       'Rp ' || TO_CHAR(p.unit_price, 'FM999,999,999') as selling_price,
       'Rp ' || TO_CHAR(b.total_cost, 'FM999,999,999') as material_cost
FROM products p
JOIN bill_of_materials b ON p.sku = b.product_code
WHERE b.status = 'active';
```

### View Sales Orders
```sql
SELECT id, customer, 
       TO_CHAR(order_date, 'DD Mon YYYY') as date,
       'Rp ' || TO_CHAR(total_amount, 'FM999,999,999') as total
FROM sales_orders
WHERE shipping_address LIKE '%Indonesia%'
ORDER BY id DESC;
```

---

## 💻 Frontend Implementation Guide

### 1. Currency Formatter Function

Create a utility file: `/apps/v4/lib/currency.ts`

```typescript
/**
 * Format number as Indonesian Rupiah
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatRupiah(
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    useGrouping?: boolean;
  }
): string {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    useGrouping = true,
  } = options || {};

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  }).format(amount);
}

// Usage examples:
// formatRupiah(7500000)        => "Rp7.500.000"
// formatRupiah(7500000, { minimumFractionDigits: 2 }) => "Rp7.500.000,00"
// formatRupiah(850)            => "Rp850"
```

### 2. Update Product Components

**File:** `/apps/v4/app/(erp)/erp/products/page.tsx`

```typescript
import { formatRupiah } from '@/lib/currency';

// In your product list component:
<div className="price">
  {formatRupiah(product.unit_price)}
</div>

// For cost price with comparison:
<div className="pricing">
  <span className="selling-price">
    Jual: {formatRupiah(product.unit_price)}
  </span>
  <span className="cost-price text-muted">
    Beli: {formatRupiah(product.cost_price)}
  </span>
  <span className="margin text-success">
    Margin: {((product.unit_price - product.cost_price) / product.cost_price * 100).toFixed(1)}%
  </span>
</div>
```

### 3. Update Sales Order Components

**File:** `/apps/v4/app/(erp)/erp/sales/orders/page.tsx`

```typescript
import { formatRupiah } from '@/lib/currency';

// In order list:
<Table>
  <TableBody>
    {orders.map((order) => (
      <TableRow key={order.id}>
        <TableCell>{order.order_number}</TableCell>
        <TableCell>{order.customer}</TableCell>
        <TableCell>{formatRupiah(order.total_amount)}</TableCell>
        <TableCell>
          <Badge>{order.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// In order details:
<div className="order-summary">
  <div className="line-item">
    <span>Subtotal:</span>
    <span>{formatRupiah(order.subtotal)}</span>
  </div>
  <div className="line-item">
    <span>Diskon:</span>
    <span className="text-red-500">-{formatRupiah(order.discount_amount)}</span>
  </div>
  <div className="line-item">
    <span>PPN 11%:</span>
    <span>{formatRupiah(order.tax_amount)}</span>
  </div>
  <div className="line-item font-bold text-lg">
    <span>Total:</span>
    <span>{formatRupiah(order.total_amount)}</span>
  </div>
</div>
```

### 4. Update Manufacturing/Work Order Components

**File:** `/apps/v4/app/(erp)/erp/operations/manufacturing/page.tsx`

```typescript
import { formatRupiah } from '@/lib/currency';

// In BOM display:
<div className="bom-cost">
  <h4>Bill of Materials</h4>
  <div className="components">
    {bomItems.map((item) => (
      <div key={item.id} className="component-line">
        <span>{item.component_name}</span>
        <span className="qty">{item.quantity} {item.unit}</span>
        <span className="cost">{formatRupiah(item.unit_cost)}</span>
        <span className="total">{formatRupiah(item.quantity * item.unit_cost)}</span>
      </div>
    ))}
  </div>
  <div className="total-cost font-bold">
    Total Biaya Bahan: {formatRupiah(bom.total_cost)}
  </div>
</div>

// In work order form:
<div className="product-info">
  <p>Harga Jual: {formatRupiah(selectedProduct.unit_price)}</p>
  <p>Biaya Produksi: {formatRupiah(bomTotalCost)}</p>
  <p className="text-green-600">
    Profit: {formatRupiah(selectedProduct.unit_price - bomTotalCost)}
  </p>
</div>
```

### 5. Update API Responses (Optional Enhancement)

**File:** `/apps/v4/app/api/products/route.ts`

```typescript
// Add formatted currency in API response
const productsWithFormatted = products.map(product => ({
  ...product,
  unit_price_formatted: formatRupiah(product.unit_price),
  cost_price_formatted: formatRupiah(product.cost_price),
}));

return NextResponse.json({ products: productsWithFormatted });
```

### 6. Update Dashboard/Analytics

**File:** `/apps/v4/app/(erp)/erp/dashboard/page.tsx`

```typescript
import { formatRupiah } from '@/lib/currency';

// In dashboard cards:
<Card>
  <CardHeader>
    <CardTitle>Total Penjualan Bulan Ini</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">
      {formatRupiah(totalSales)}
    </div>
    <p className="text-sm text-muted-foreground">
      +12.5% dari bulan lalu
    </p>
  </CardContent>
</Card>

// In charts:
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={salesData}>
    <XAxis dataKey="month" />
    <YAxis 
      tickFormatter={(value) => formatRupiah(value, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      })} 
    />
    <Tooltip 
      formatter={(value: number) => formatRupiah(value)}
    />
    <Bar dataKey="amount" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

---

## 📋 Testing Checklist

### Database Tests ✅
- [x] All products use IDR currency
- [x] Indonesian products created with proper SKUs
- [x] BOMs updated with Rupiah costs
- [x] Sales orders calculated correctly with PPN 11%
- [x] Customer data with Indonesian addresses

### Frontend Tests (Pending)
- [ ] Product list displays Rupiah correctly
- [ ] Product detail shows cost, price, margin in Rupiah
- [ ] Sales order list shows totals in Rupiah
- [ ] Sales order form calculates in Rupiah with PPN
- [ ] Work orders show BOM costs in Rupiah
- [ ] Dashboard shows metrics in Rupiah
- [ ] Reports export with Rupiah formatting
- [ ] POS displays Rupiah (if applicable)

### API Tests (Pending)
- [ ] Products API returns IDR currency
- [ ] Sales Orders API calculates correctly
- [ ] Work Orders API includes Rupiah costs
- [ ] Reports API formats currency properly

---

## 🚀 Deployment Steps

### 1. Run Database Scripts (Already Done ✅)
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp
psql -U mac ocean_erp -f database/seed_indonesian_rupiah_data.sql
psql -U mac ocean_erp -f database/seed_indonesian_customers.sql
psql -U mac ocean_erp -f database/seed_indonesian_sales_orders.sql
```

### 2. Update Frontend (Next Steps)
```bash
# Create currency utility
mkdir -p apps/v4/lib
touch apps/v4/lib/currency.ts
# (Add the formatRupiah function above)

# Update components
# - Product pages
# - Sales order pages
# - Manufacturing pages
# - Dashboard
# - Reports
```

### 3. Test Thoroughly
```bash
# Start dev server
cd apps/v4
pnpm dev

# Test each module:
# - Navigate to Products → Check prices display correctly
# - Navigate to Sales → Check orders show Rupiah
# - Navigate to Operations → Check work orders show costs
# - Navigate to Dashboard → Check metrics in Rupiah
```

### 4. Production Deployment
```bash
# Build
pnpm build

# Deploy
# (Your deployment process here)
```

---

## 📊 Data Summary

| Metric | Count | Value |
|--------|-------|-------|
| **Total Products** | 93 | All IDR ✅ |
| **Indonesian Products** | 17 | Rp 3,500 - Rp 12.5M |
| **Manufacturing Products** | 2 | Chair & Table |
| **BOMs** | 2 | Rp 848K - Rp 1.5M material cost |
| **Indonesian Customers** | 20 | Jakarta, Bandung, Surabaya |
| **Sample Sales Orders** | 10 | Total Rp 82.9M |

---

## 🎯 Key Features

### Realistic Indonesian Pricing ✅
- Office supplies: Rp 3,500 - Rp 85,000
- Food & beverage: Rp 15,000 - Rp 35,000
- Cosmetics: Rp 35,000 - Rp 45,000
- Furniture: Rp 1.5M - Rp 7M
- Electronics: Rp 2.5M - Rp 12.5M

### Indonesian Business Practices ✅
- PPN 11% (Indonesian VAT)
- Net 14/30/45/60 payment terms
- Credit limits: Rp 25M - Rp 200M
- Indonesian addresses and company names
- Proper Indonesian product names

### Manufacturing in Rupiah ✅
- Complete BOMs with Rupiah costs
- Material costs calculated correctly
- Profit margins displayed
- Work orders ready for Rupiah

---

## 🐛 Common Issues & Solutions

### Issue 1: Prices showing as $0.00
**Solution:** Ensure you're using the `formatRupiah()` function instead of default currency formatters.

### Issue 2: Tax calculation incorrect
**Solution:** PPN should be 11% in Indonesia. Check that `tax_percent` is set to 11.00.

### Issue 3: Number format with dots vs commas
**Solution:** Indonesian format uses dots for thousands (Rp 1.500.000), use `id-ID` locale.

### Issue 4: Currency not showing in API
**Solution:** Check that database queries include the `currency` column and it's set to 'IDR'.

---

## 📞 Support

For questions about this implementation:
1. Check the main documentation: `RUPIAH_IMPLEMENTATION_COMPLETE.md`
2. Review database scripts in `/database/seed_indonesian_*.sql`
3. Test queries provided in this guide

---

**Last Updated:** 25 November 2025  
**Status:** Database ✅ Complete | Frontend ⏳ Pending  
**Total Implementation Time:** ~2 hours
