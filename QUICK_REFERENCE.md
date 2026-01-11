# Ocean ERP - Quick Reference Guide

## 🚀 Quick Start

### Start the Application
```bash
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp/apps/v4
PORT=4000 pnpm dev
```

**Access:** http://localhost:4000

---

## 📱 Main Features

### 1. Customer Management
**URL:** http://localhost:4000/erp/sales/customers

**What you can do:**
- ✅ View all customers with search and filters
- ✅ Create new customers (with lead conversion)
- ✅ View customer details with order history
- ✅ Edit and delete customers
- ✅ Track customer metrics (orders, revenue)

**Quick Actions:**
- Click "New Customer" to create
- Search by company name, email, or number
- Filter by type (Individual/Business/Enterprise)
- Filter by status (Active/Inactive/Prospect/Blocked)
- Click any customer card to view details

### 2. Sales Analytics
**URL:** http://localhost:4000/erp/sales/analytics

**What you can see:**
- 📊 Real-time KPIs (revenue, orders, customers, conversion rate)
- 📈 Lead conversion funnel with percentages
- 👥 Top customers by revenue
- 🎯 Opportunity pipeline by stage
- 📅 Monthly sales trends

**Tabs:**
- **Overview** - Status breakdowns and conversion funnel
- **Customers** - Top performing customers
- **Pipeline** - Opportunity analysis
- **Trends** - Month-over-month performance

### 3. Sales Orders
**URL:** http://localhost:4000/erp/sales/orders

**Features:**
- ✅ View all orders with status badges
- ✅ Create orders from leads
- ✅ Manage order items inline
- ✅ Track payment status
- ✅ Filter by status (All/Pending/Unpaid)

**Order Statuses:**
- Pending → Confirmed → Processing → Shipped → Delivered
- Also: Cancelled, On Hold

**Payment Statuses:**
- Unpaid → Partially Paid → Paid
- Also: Overdue

### 4. Quotations
**URL:** http://localhost:4000/erp/sales/quotations

**Features:**
- ✅ Create quotations from qualified leads
- ✅ Add multiple items with pricing
- ✅ Set valid until dates
- ✅ Track quotation status

---

## 🔌 API Endpoints

### Customers
```bash
# List all customers
GET http://localhost:4000/api/customers

# Create customer
POST http://localhost:4000/api/customers
Content-Type: application/json
{
  "company_name": "Acme Corp",
  "email": "contact@acme.com",
  "customer_type": "Business",
  "status": "Active"
}

# Get single customer
GET http://localhost:4000/api/customers/1

# Update customer
PATCH http://localhost:4000/api/customers/1
Content-Type: application/json
{ "status": "Inactive" }

# Delete customer
DELETE http://localhost:4000/api/customers/1
```

### Analytics
```bash
# Get KPIs
GET http://localhost:4000/api/analytics?type=kpis

# Get monthly trends
GET http://localhost:4000/api/analytics?type=monthly

# Get top customers
GET http://localhost:4000/api/analytics?type=top-customers

# Get conversion funnel
GET http://localhost:4000/api/analytics?type=funnel

# Get pipeline
GET http://localhost:4000/api/analytics?type=pipeline

# Other types: daily, status, payment, customers, products
```

### Sales Orders
```bash
# List all orders
GET http://localhost:4000/api/sales-orders

# Filter by customer
GET http://localhost:4000/api/sales-orders?customer_id=1

# Create order
POST http://localhost:4000/api/sales-orders

# Get order details
GET http://localhost:4000/api/sales-orders/1

# Update order
PATCH http://localhost:4000/api/sales-orders/1

# Add item to order
POST http://localhost:4000/api/sales-orders/1/items
```

---

## 💾 Database Quick Reference

### Customer Number Format
`CUST-2025-00001` (Auto-generated)

### Order Number Format
`SO-2025-00001` (Auto-generated)

### Tables
- `customers` - Customer records
- `sales_orders` - Sales orders
- `quotations` - Quotations
- `leads` - Sales leads
- `opportunities` - Sales opportunities

### Analytics Views
- `sales_kpis` - All key metrics
- `customer_performance` - Customer metrics
- `lead_conversion_funnel` - Sales funnel
- `monthly_sales_trend` - Trends
- `opportunity_pipeline` - Pipeline analysis

---

## 🎯 Common Workflows

### Convert Lead to Customer
1. Go to `/erp/sales/customers/new`
2. Select a qualified lead from dropdown
3. Form auto-fills with lead data
4. Add financial info (credit limit, payment terms)
5. Add addresses (billing/shipping)
6. Click "Create Customer"

### Create Sales Order
1. Go to `/erp/sales/orders/new`
2. Select a lead (optional - auto-fills customer info)
3. Enter customer details if not from lead
4. Add items (name, quantity, price)
5. System calculates totals automatically
6. Click "Create Order"

### View Customer History
1. Go to `/erp/sales/customers`
2. Click on any customer card
3. Navigate to "Orders" tab
4. See all orders with amounts and status
5. Click any order to view details

### Check Analytics
1. Go to `/erp/sales/analytics`
2. View KPI cards at top (instant overview)
3. Switch between tabs for detailed views:
   - Overview: Funnel and status breakdown
   - Customers: Top performers
   - Pipeline: Opportunities
   - Trends: Monthly analysis

---

## 🔍 Search & Filter Tips

### Customer Search
- Search works on: company name, customer number, email, contact person
- Use filters to narrow by type and status
- Results update instantly as you type

### Order Filters
- "All Orders" - Everything
- "Pending Orders" - Only pending status
- "Unpaid Orders" - Only unpaid invoices

---

## 📊 Understanding Metrics

### KPIs Explained
- **Total Revenue** - Sum of all order amounts
- **Total Orders** - Count of all orders
- **Avg Order Value** - Revenue ÷ Orders
- **Total Customers** - Count of all customers
- **Conversion Rate** - (Orders ÷ Leads) × 100%

### Customer Metrics
- **Total Orders** - Orders from this customer
- **Total Revenue** - Revenue from this customer
- **Credit Limit** - Maximum credit allowed
- **Payment Terms** - Default payment terms (Net 30, etc.)

---

## 🎨 UI Features

### Color Coding

**Customer Types:**
- 🔵 Individual - Blue
- 🟣 Business - Purple
- 🟢 Enterprise - Indigo

**Customer Status:**
- 🟢 Active - Green
- ⚫ Inactive - Gray
- 🟡 Prospect - Yellow
- 🔴 Blocked - Red

**Order Status:**
- 🟡 Pending - Yellow
- 🔵 Confirmed - Blue
- 🟣 Processing - Indigo
- 🟣 Shipped - Purple
- 🟢 Delivered - Green
- 🔴 Cancelled - Red
- 🟠 On Hold - Orange

**Payment Status:**
- 🔴 Unpaid - Red
- 🟡 Partially Paid - Yellow
- 🟢 Paid - Green
- 🔴 Overdue - Red

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Kill existing process
kill -9 <PID>

# Restart
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp/apps/v4
PORT=4000 pnpm dev
```

### Database connection error
```bash
# Check PostgreSQL is running
psql -U mac -d ocean-erp -c "SELECT 1"

# Verify environment variables
echo $DB_USER
echo $DB_NAME
```

### TypeScript errors
```bash
# Check for errors
cd /Users/mac/Projects/Github/ocean-erp/ocean-erp/apps/v4
pnpm type-check

# Rebuild
pnpm build
```

---

## 📞 Support Information

**Database:** ocean-erp (PostgreSQL)  
**Port:** 4000  
**Framework:** Next.js 15.3.1  
**Node Version:** Check with `node -v`

**Documentation Files:**
- `CUSTOMER_ANALYTICS_IMPLEMENTATION.md` - Full feature docs
- `SALES_ORDERS_IMPLEMENTATION.md` - Sales orders guide
- `APPLICATION_STATUS_COMPLETE.txt` - Complete status
- `QUICK_REFERENCE.md` - This file

---

## ✨ Pro Tips

1. **Use Lead Conversion** - When creating customers, select from qualified leads to auto-fill data
2. **Copy Billing to Shipping** - When addresses are the same, use the "Copy from Billing" button
3. **Tag Your Customers** - Use tags like "VIP", "Key Account" for easy filtering later
4. **Check Analytics Regularly** - View the funnel to identify conversion bottlenecks
5. **Filter Customer Orders** - On customer detail page, Orders tab shows all their purchases
6. **Use Search** - Type anywhere in search boxes for instant filtering

---

**Happy Selling! 🎉**
