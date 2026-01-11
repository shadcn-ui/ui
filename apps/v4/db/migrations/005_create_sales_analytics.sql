-- Migration: create sales analytics views and helper functions
-- Provides aggregated data for sales dashboards and reports
-- Run this: psql -U mac -d ocean-erp -f 005_create_sales_analytics.sql

-- Sales Overview - Daily aggregates
CREATE OR REPLACE VIEW sales_daily_summary AS
SELECT 
  DATE(order_date) as date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  SUM(CASE WHEN payment_status = 'Paid' THEN total_amount ELSE 0 END) as paid_revenue,
  SUM(CASE WHEN payment_status = 'Unpaid' THEN total_amount ELSE 0 END) as unpaid_revenue,
  COUNT(CASE WHEN status = 'Delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled_orders
FROM sales_orders
GROUP BY DATE(order_date)
ORDER BY date DESC;

-- Sales by Status
CREATE OR REPLACE VIEW sales_by_status AS
SELECT 
  status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_value,
  AVG(total_amount) as avg_value
FROM sales_orders
GROUP BY status
ORDER BY order_count DESC;

-- Sales by Payment Status
CREATE OR REPLACE VIEW sales_by_payment_status AS
SELECT 
  payment_status,
  COUNT(*) as order_count,
  SUM(total_amount) as total_value,
  AVG(total_amount) as avg_value
FROM sales_orders
GROUP BY payment_status
ORDER BY order_count DESC;

-- Customer Performance
CREATE OR REPLACE VIEW customer_performance AS
SELECT 
  c.id,
  c.customer_number,
  c.company_name,
  c.contact_person,
  c.customer_status,
  c.total_orders,
  c.total_revenue,
  c.last_order_date,
  COALESCE(AVG(so.total_amount), 0) as avg_order_value,
  COUNT(CASE WHEN so.order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_last_30_days
FROM customers c
LEFT JOIN sales_orders so ON c.id = so.customer_id
GROUP BY c.id, c.customer_number, c.company_name, c.contact_person, c.customer_status, c.total_orders, c.total_revenue, c.last_order_date
ORDER BY c.total_revenue DESC;

-- Lead Conversion Funnel
CREATE OR REPLACE VIEW lead_conversion_funnel AS
SELECT 
  'Total Leads' as stage,
  COUNT(*) as count,
  100.0 as percentage,
  1 as stage_order
FROM leads
UNION ALL
SELECT 
  'Qualified Leads' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM leads), 0) * 100, 2) as percentage,
  2 as stage_order
FROM leads 
WHERE status_id IN (SELECT id FROM lead_statuses WHERE name IN ('Qualified', 'Contacted', 'Meeting Scheduled'))
UNION ALL
SELECT 
  'Opportunities Created' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM leads), 0) * 100, 2) as percentage,
  3 as stage_order
FROM opportunities
UNION ALL
SELECT 
  'Quotations Created' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM leads), 0) * 100, 2) as percentage,
  4 as stage_order
FROM quotations
UNION ALL
SELECT 
  'Orders Created' as stage,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / NULLIF((SELECT COUNT(*) FROM leads), 0) * 100, 2) as percentage,
  5 as stage_order
FROM sales_orders
ORDER BY stage_order;

-- Top Products (from order items)
CREATE OR REPLACE VIEW top_products AS
SELECT 
  product_name,
  COUNT(*) as times_ordered,
  SUM(quantity) as total_quantity_sold,
  SUM(line_total) as total_revenue,
  AVG(unit_price) as avg_price
FROM sales_order_items
GROUP BY product_name
ORDER BY total_revenue DESC
LIMIT 50;

-- Monthly Sales Trend (last 12 months)
CREATE OR REPLACE VIEW monthly_sales_trend AS
SELECT 
  TO_CHAR(order_date, 'YYYY-MM') as month,
  DATE_TRUNC('month', order_date) as month_start,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  COUNT(DISTINCT customer_id) as unique_customers
FROM sales_orders
WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY TO_CHAR(order_date, 'YYYY-MM'), DATE_TRUNC('month', order_date)
ORDER BY month_start DESC;

-- Opportunity Pipeline Value
CREATE OR REPLACE VIEW opportunity_pipeline AS
SELECT 
  stage,
  COUNT(*) as opportunity_count,
  SUM(estimated_value) as total_value,
  AVG(estimated_value) as avg_value,
  AVG(probability) as avg_probability,
  SUM(estimated_value * probability / 100) as weighted_value
FROM opportunities
WHERE status NOT IN ('Lost', 'Won')
GROUP BY stage
ORDER BY 
  CASE stage
    WHEN 'Qualification' THEN 1
    WHEN 'Needs Analysis' THEN 2
    WHEN 'Proposal' THEN 3
    WHEN 'Negotiation' THEN 4
    ELSE 5
  END;

-- Sales Performance Metrics (KPIs)
CREATE OR REPLACE VIEW sales_kpis AS
SELECT 
  -- Current Period (This Month)
  (SELECT COUNT(*) FROM sales_orders WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)) as orders_this_month,
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)) as revenue_this_month,
  (SELECT COUNT(*) FROM customers WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as new_customers_this_month,
  
  -- Last Month
  (SELECT COUNT(*) FROM sales_orders WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND order_date < DATE_TRUNC('month', CURRENT_DATE)) as orders_last_month,
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND order_date < DATE_TRUNC('month', CURRENT_DATE)) as revenue_last_month,
  
  -- Year to Date
  (SELECT COUNT(*) FROM sales_orders WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)) as orders_ytd,
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)) as revenue_ytd,
  
  -- All Time
  (SELECT COUNT(*) FROM customers) as total_customers,
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM opportunities) as total_opportunities,
  (SELECT COUNT(*) FROM quotations) as total_quotations,
  (SELECT COUNT(*) FROM sales_orders) as total_orders,
  (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders) as total_revenue_all_time,
  
  -- Averages
  (SELECT COALESCE(AVG(total_amount), 0) FROM sales_orders) as avg_order_value,
  (SELECT COALESCE(AVG(total_revenue), 0) FROM customers WHERE total_revenue > 0) as avg_customer_lifetime_value,
  
  -- Conversion Rates
  ROUND(
    (SELECT COUNT(*)::numeric FROM sales_orders) / 
    NULLIF((SELECT COUNT(*) FROM leads), 0) * 100, 2
  ) as lead_to_order_conversion_rate,
  ROUND(
    (SELECT COUNT(*)::numeric FROM quotations WHERE status = 'Accepted') / 
    NULLIF((SELECT COUNT(*) FROM quotations), 0) * 100, 2
  ) as quotation_acceptance_rate;

-- Top Customers by Revenue
CREATE OR REPLACE VIEW top_customers_by_revenue AS
SELECT 
  c.id,
  c.customer_number,
  c.company_name,
  c.contact_person,
  c.total_orders,
  c.total_revenue,
  c.last_order_date,
  ROUND(c.total_revenue / NULLIF((SELECT SUM(total_revenue) FROM customers), 0) * 100, 2) as revenue_percentage
FROM customers c
WHERE c.total_revenue > 0
ORDER BY c.total_revenue DESC
LIMIT 50;

-- Comments for documentation
COMMENT ON VIEW sales_daily_summary IS 'Daily aggregated sales metrics';
COMMENT ON VIEW sales_by_status IS 'Sales orders grouped by status';
COMMENT ON VIEW customer_performance IS 'Customer analytics with order history';
COMMENT ON VIEW lead_conversion_funnel IS 'Sales pipeline conversion metrics';
COMMENT ON VIEW top_products IS 'Best selling products by revenue';
COMMENT ON VIEW monthly_sales_trend IS 'Monthly sales trends for last 12 months';
COMMENT ON VIEW opportunity_pipeline IS 'Opportunity pipeline analysis';
COMMENT ON VIEW sales_kpis IS 'Key Performance Indicators for sales';
COMMENT ON VIEW top_customers_by_revenue IS 'Top revenue generating customers';
