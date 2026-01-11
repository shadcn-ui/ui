# Supplier Performance Management System

**Version:** 1.0  
**Date:** November 18, 2025  
**Status:** Production Ready ✅

---

## 📋 Overview

The Supplier Performance Management system provides comprehensive analytics and metrics to evaluate, compare, and track supplier performance across multiple dimensions including delivery reliability, cost effectiveness, and overall quality.

---

## 🎯 Key Features

### 1. **Performance Dashboard**
- Real-time KPI cards showing:
  - Total active suppliers
  - Average supplier rating (out of 5.0)
  - Average on-time delivery rate
  - Total lifetime purchase value
  
### 2. **Visual Analytics**
- **Bar Chart:** Top 10 suppliers by rating and on-time delivery
- **Pie Chart:** Rating distribution across all suppliers
- **Line Chart:** Delivery performance trends and order volumes
- **Radar Chart:** Multi-metric comparison of top 5 suppliers

### 3. **Detailed Performance Table**
- Comprehensive supplier metrics including:
  - Supplier ranking with star indicators
  - Rating with quality badges (Excellent/Good/Average/Poor)
  - On-time delivery rate with visual progress bars
  - Total orders and completed orders count
  - Purchase value and average order value
  - Current status indicator

### 4. **Performance Insights**
- Top performer identification
- Suppliers needing improvement
- Performance summary breakdown by rating category

### 5. **Filtering & Sorting**
- Time range filters: All Time, This Year, This Quarter, This Month
- Sort options: Rating, On-Time Delivery, Purchase Value, Total Orders
- Export report functionality (coming soon)

---

## 📊 Performance Metrics

### Core KPIs

| Metric | Description | Calculation | Target |
|--------|-------------|-------------|--------|
| **Rating** | Overall supplier quality score | Manual rating by procurement team | ≥ 4.5 (Excellent) |
| **On-Time Delivery Rate** | % of deliveries received on or before expected date | (On-time deliveries / Total deliveries) × 100 | ≥ 95% (Excellent) |
| **Total Orders** | Number of purchase orders placed | COUNT(purchase_orders) | - |
| **Completed Orders** | Orders with "Received" status | COUNT(status = 'Received') | - |
| **Purchase Value** | Total monetary value of purchases | SUM(total_amount) | - |
| **Average Order Value** | Mean purchase order size | AVG(total_amount) | - |
| **Lead Time** | Average days from order to delivery | AVG(delivery_date - order_date) | ≤ 14 days |
| **Payment Completion Rate** | % of orders with completed payment | (Paid orders / Total orders) × 100 | 100% |

### Rating Badges

| Rating Range | Badge | Color | Description |
|--------------|-------|-------|-------------|
| 4.5 - 5.0 | Excellent | Green | Top-tier supplier, consistently exceeds expectations |
| 3.5 - 4.4 | Good | Blue | Reliable supplier, meets standards regularly |
| 2.5 - 3.4 | Average | Yellow | Acceptable performance, needs monitoring |
| 0.0 - 2.4 | Poor | Red | Below standards, requires immediate attention |

### Delivery Performance Badges

| Rate Range | Badge | Color | Description |
|------------|-------|-------|-------------|
| 95% - 100% | Excellent | Green | Outstanding delivery reliability |
| 85% - 94% | Good | Blue | Good delivery performance |
| 70% - 84% | Fair | Yellow | Acceptable but needs improvement |
| 0% - 69% | Poor | Red | Unreliable delivery performance |

---

## 🔧 Technical Architecture

### Frontend Component
**File:** `/apps/v4/app/(erp)/erp/product/suppliers/performance/page.tsx`

**Technology Stack:**
- React 19 with hooks (useState, useEffect)
- TypeScript for type safety
- Recharts for data visualization
- Shadcn UI components (Card, Table, Badge, Select, Button)
- Responsive grid layout (Tailwind CSS)

**Key Functions:**
```typescript
fetchSupplierPerformance() // Fetches data from API
formatCurrency(value)      // Formats numbers as USD
formatNumber(value)        // Formats numbers with commas
getRatingColor(rating)     // Returns color class for rating
getRatingBadge(rating)     // Returns badge component for rating
getDeliveryBadge(rate)     // Returns badge for delivery performance
```

### Backend API
**File:** `/apps/v4/app/api/suppliers/performance/route.ts`

**Endpoints:**

#### GET `/api/suppliers/performance`
Returns supplier performance data with various metric types.

**Query Parameters:**
- `supplier_id` (optional): Filter by specific supplier
- `time_range` (optional): all, year, quarter, month (default: all)
- `metrics` (optional): summary, trends, comparison (default: summary)

**Response Examples:**

1. **Summary Metrics** (`metrics=summary`):
```json
[
  {
    "id": 1,
    "supplier_code": "SUP-001",
    "company_name": "Acme Supplies",
    "rating": 4.8,
    "total_orders": 156,
    "total_purchase_value": 458900.00,
    "avg_order_value": 2941.67,
    "completed_orders": 150,
    "on_time_deliveries": 148,
    "on_time_delivery_rate": 98.67
  }
]
```

2. **Trends Data** (`metrics=trends`):
```json
[
  {
    "supplier_code": "SUP-001",
    "company_name": "Acme Supplies",
    "month": "2025-11-01",
    "orders_count": 12,
    "total_value": 38500.00,
    "avg_order_value": 3208.33,
    "on_time_rate": 100.00
  }
]
```

3. **Comparison Data** (`metrics=comparison`):
```json
[
  {
    "company_name": "Acme Supplies",
    "rating": 4.8,
    "total_orders": 156,
    "on_time_delivery_rate": 98.67,
    "payment_completion_rate": 100.00,
    "avg_lead_time_days": 11.5,
    "min_order_value": 500.00,
    "max_order_value": 15000.00
  }
]
```

#### POST `/api/suppliers/performance`
Updates supplier rating or adds performance notes.

**Request Body:**
```json
{
  "supplier_id": 1,
  "rating": 4.5,
  "performance_notes": "Improved delivery times in Q4",
  "updated_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplier performance updated successfully"
}
```

### Database Views

#### `supplier_performance_summary`
Pre-calculated performance metrics for fast dashboard loading.

**SQL Definition:**
```sql
CREATE OR REPLACE VIEW supplier_performance_summary AS
SELECT 
  s.id,
  s.supplier_code,
  s.company_name,
  s.contact_person,
  s.email,
  s.status,
  s.rating,
  COUNT(DISTINCT po.id) AS total_orders,
  SUM(po.total_amount) AS total_purchase_value,
  AVG(po.total_amount) AS avg_order_value,
  COUNT(DISTINCT CASE WHEN po.status = 'Received' THEN po.id END) AS completed_orders,
  COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END) AS on_time_deliveries,
  CASE 
    WHEN COUNT(DISTINCT CASE WHEN po.actual_delivery_date IS NOT NULL THEN po.id END) = 0 THEN 0
    ELSE ROUND(
      COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END)::numeric / 
      NULLIF(COUNT(DISTINCT CASE WHEN po.actual_delivery_date IS NOT NULL THEN po.id END), 0)::numeric * 100, 
      2
    )
  END AS on_time_delivery_rate,
  MAX(po.order_date) AS last_order_date,
  s.created_at
FROM suppliers s
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
WHERE s.status != 'Inactive'
GROUP BY s.id, s.supplier_code, s.company_name, s.contact_person, s.email, s.status, s.rating, s.created_at;
```

**Key Features:**
- Prevents division by zero with NULLIF()
- Filters out inactive suppliers
- Calculates on-time delivery rate safely
- Includes last order date for recency analysis

---

## 🚀 Usage Guide

### Accessing the Dashboard

1. **From Main Navigation:**
   ```
   ERP → Product → Suppliers → Performance
   ```

2. **From Suppliers Page:**
   - Click "View Performance Dashboard" button at the top right

3. **Direct URL:**
   ```
   http://localhost:4000/erp/product/suppliers/performance
   ```

### Using Filters

**Time Range Filter:**
- **All Time:** Shows complete historical data
- **This Year:** January 1 to present
- **This Quarter:** Last 3 months
- **This Month:** Last 30 days

**Sort Options:**
- **Rating (High to Low):** Best performers first
- **On-Time Delivery:** Most reliable suppliers first
- **Purchase Value:** Largest spending first
- **Total Orders:** Highest volume first

### Reading the Charts

#### Bar Chart (Top Suppliers)
- **Blue bars:** Rating out of 5
- **Green bars:** On-time delivery percentage
- Shows top 10 suppliers by selected sort criteria

#### Pie Chart (Rating Distribution)
- Visual breakdown of supplier quality levels
- Percentages show proportion of suppliers in each category
- Colors match rating badge colors

#### Line Chart (Delivery Performance)
- **Blue line (left axis):** On-time delivery rate %
- **Green line (right axis):** Total order volume
- Shows correlation between volume and performance

#### Radar Chart (Multi-Metric)
- **Blue area:** Rating (scaled to 100)
- **Green area:** On-time delivery %
- **Yellow area:** Order volume (scaled to 100)
- Compares top 5 suppliers across multiple metrics

### Understanding the Performance Table

**Columns Explained:**
1. **Rank:** Position based on current sort (⭐ = #1)
2. **Supplier:** Company name and contact person
3. **Code:** Unique supplier identifier
4. **Rating:** Score out of 5.0 with quality badge
5. **On-Time Delivery:** Percentage with visual progress bar and badge
6. **Total Orders:** Lifetime order count
7. **Completed:** Orders successfully received (✓ icon)
8. **Purchase Value:** Total spending with supplier
9. **Avg Order Value:** Mean order size
10. **Status:** Active/Inactive badge

---

## 📈 Performance Insights Section

### Top Performer
- Displays the highest-rated supplier
- Green trending up icon
- Shows supplier name

### Needs Improvement
- Displays the lowest-rated supplier
- Red trending down icon
- Identifies suppliers requiring attention

### Performance Summary
- **Excellent (4.5+):** Count of top-tier suppliers
- **Good (3.5-4.5):** Count of reliable suppliers
- **Below Average (<3.5):** Count of problematic suppliers

---

## 🔍 Use Cases

### 1. Quarterly Performance Review
**Scenario:** Procurement manager needs to evaluate suppliers for Q4 review.

**Steps:**
1. Set time range to "This Quarter"
2. Sort by "Rating (High to Low)"
3. Review top performers for recognition/incentives
4. Check "Needs Improvement" section for suppliers requiring meetings
5. Export report for stakeholder presentation

### 2. Sourcing Decision
**Scenario:** Need to choose between suppliers for new product line.

**Steps:**
1. Set time range to "This Year" for recent performance
2. Sort by "On-Time Delivery"
3. Compare delivery rates in the table
4. Review radar chart for multi-metric comparison
5. Select suppliers with 95%+ on-time rate and 4.0+ rating

### 3. Cost Optimization
**Scenario:** Identify opportunities to consolidate suppliers.

**Steps:**
1. Sort by "Purchase Value"
2. Review top spending suppliers
3. Check "Avg Order Value" column
4. Identify small orders that could be consolidated
5. Compare pricing and performance of similar suppliers

### 4. Risk Management
**Scenario:** Identify suppliers with declining performance.

**Steps:**
1. Review "Delivery Performance Analysis" line chart
2. Look for suppliers with dropping on-time rates
3. Check "Below Average" count in Performance Summary
4. Filter table to show suppliers with <85% on-time rate
5. Create action plans for at-risk suppliers

### 5. Supplier Development
**Scenario:** Help suppliers improve their performance.

**Steps:**
1. Identify suppliers in "Average" category (3.5-4.0 rating)
2. Review their specific metrics (delivery, payment, lead time)
3. Compare with top performers to identify gaps
4. Use data to have constructive improvement discussions
5. Track progress over quarters

---

## 🎨 UI Components & Styling

### Color Scheme

**Rating Colors:**
- Excellent (4.5+): `text-green-600`, `bg-green-100`
- Good (3.5-4.5): `text-blue-600`, `bg-blue-100`
- Average (2.5-3.5): `text-yellow-600`, `bg-yellow-100`
- Poor (<2.5): `text-red-600`, `bg-red-100`

**Chart Colors:**
- Primary: `#8884d8` (Blue)
- Secondary: `#82ca9d` (Green)
- Tertiary: `#ffc658` (Yellow)
- Quaternary: `#ff8042` (Orange)

### Responsive Design
- **Mobile (<768px):** Single column layout, stacked charts
- **Tablet (768-1024px):** 2-column grid for charts
- **Desktop (>1024px):** Full multi-column layout with side-by-side charts

---

## ⚡ Performance Optimizations

### Data Loading
- Uses database view for pre-calculated metrics
- Single API call loads all dashboard data
- Efficient SQL with proper indexing on join columns

### Rendering
- Chart data limited to top 10 suppliers (prevents overcrowding)
- Responsive containers prevent layout shift
- Loading state with skeleton UI

### Caching
- Browser caches API responses
- Static chart configurations
- Memoized calculation functions

---

## 🔐 Security & Permissions

### Access Control
- Requires authenticated user session
- Role-based access: Procurement, Management, Admin
- Data filtered by user's organizational scope

### Data Protection
- No sensitive supplier pricing exposed in frontend
- API validates all query parameters
- SQL injection prevention with parameterized queries

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "No supplier performance data available"
**Cause:** No suppliers in database or all marked inactive.  
**Solution:** 
- Check `suppliers` table has active records
- Verify `purchase_orders` table has data
- Run: `SELECT * FROM supplier_performance_summary LIMIT 1;`

#### 2. Charts not rendering
**Cause:** Data format mismatch or missing Recharts library.  
**Solution:**
- Check browser console for errors
- Verify `recharts` is installed: `pnpm list recharts`
- Ensure data arrays are not empty

#### 3. Division by zero error
**Cause:** View query attempting to divide by zero.  
**Solution:**
- Recreate view with updated NULLIF() protection
- Check that the fix from earlier is applied

#### 4. Slow loading times
**Cause:** Large dataset or missing database indexes.  
**Solution:**
```sql
-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_po_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_order_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
```

---

## 📊 Sample SQL Queries

### Top 5 Suppliers by Rating
```sql
SELECT company_name, rating, on_time_delivery_rate
FROM supplier_performance_summary
ORDER BY rating DESC, on_time_delivery_rate DESC
LIMIT 5;
```

### Suppliers Needing Attention (Poor Performance)
```sql
SELECT company_name, rating, on_time_delivery_rate, total_orders
FROM supplier_performance_summary
WHERE rating < 3.5 OR on_time_delivery_rate < 85
ORDER BY rating ASC;
```

### Monthly Trend Analysis
```sql
SELECT 
  DATE_TRUNC('month', po.order_date) as month,
  COUNT(*) as orders,
  AVG(EXTRACT(DAY FROM (po.actual_delivery_date::timestamp - po.order_date::timestamp))) as avg_lead_time,
  COUNT(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN 1 END)::float / 
  NULLIF(COUNT(CASE WHEN po.actual_delivery_date IS NOT NULL THEN 1 END), 0) * 100 as on_time_rate
FROM purchase_orders po
WHERE po.order_date >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', po.order_date)
ORDER BY month DESC;
```

---

## 🚀 Future Enhancements

### Phase 2 Features (Planned)
- [ ] Export to PDF/Excel functionality
- [ ] Email performance reports to stakeholders
- [ ] Automated alerts for declining performance
- [ ] Supplier scorecards with weighted metrics
- [ ] Historical trend comparison (YoY, QoQ)
- [ ] Custom metric definitions
- [ ] Performance goals and targets
- [ ] Predictive analytics for supplier risk

### Phase 3 Features (Roadmap)
- [ ] Supplier self-service portal
- [ ] Integration with procurement workflows
- [ ] Benchmarking against industry standards
- [ ] AI-powered supplier recommendations
- [ ] Contract compliance tracking
- [ ] Sustainability and ESG metrics
- [ ] Real-time delivery tracking integration

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks
1. **Weekly:** Review performance data accuracy
2. **Monthly:** Update supplier ratings based on feedback
3. **Quarterly:** Validate view calculations
4. **Annually:** Archive old performance data

### Contact
For issues or feature requests related to Supplier Performance:
- Technical Support: dev-team@ocean-erp.com
- Procurement Team: procurement@ocean-erp.com

---

## ✅ Testing Checklist

- [x] Dashboard loads without errors
- [x] All 4 KPI cards display correct values
- [x] Bar chart renders with top 10 suppliers
- [x] Pie chart shows rating distribution
- [x] Line chart displays delivery trends
- [x] Radar chart compares top 5 suppliers
- [x] Performance table shows all suppliers
- [x] Sorting works for all options
- [x] Time range filter updates data
- [x] Rating badges display correct colors
- [x] Delivery progress bars show accurate percentages
- [x] Links navigate to correct pages
- [x] Responsive design works on all screen sizes
- [x] Loading state displays before data loads
- [x] Empty state shows when no data available
- [x] API returns correct data format
- [x] Database view calculates metrics accurately

---

**Document Version:** 1.0  
**Last Updated:** November 18, 2025  
**Status:** ✅ Production Ready
