-- Indonesian Sales Orders with Rupiah
-- Date: 25 November 2025

-- Create sample sales orders with Indonesian customers and Rupiah prices
INSERT INTO sales_orders (
    customer_id,
    customer,
    customer_email,
    customer_phone,
    order_date,
    status,
    payment_terms,
    shipping_address,
    notes
) 
SELECT 
    c.id,
    c.company_name,
    c.email,
    c.phone,
    CURRENT_DATE - (random() * 30)::integer,
    (ARRAY['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'])[floor(random() * 5 + 1)],
    c.payment_terms,
    c.billing_address || ', ' || c.billing_city || ', ' || c.billing_country,
    'Pesanan dari ' || c.company_name
FROM customers c
WHERE c.billing_country = 'Indonesia'
LIMIT 10;

-- Add sales order items with Rupiah pricing
-- Order 1: Laptop and Office Equipment
INSERT INTO sales_order_items (sales_order_id, product_code, product_name, quantity, unit_price, discount_percent, tax_percent)
SELECT 
    so.id,
    p.sku,
    p.name,
    CASE p.sku
        WHEN 'ID-LAP-001' THEN 2
        WHEN 'ID-MON-001' THEN 2
        WHEN 'ID-KRS-001' THEN 2
        ELSE 1
    END as quantity,
    p.unit_price,
    5.00,  -- 5% discount
    11.00  -- PPN 11%
FROM sales_orders so
CROSS JOIN products p
WHERE so.id = (SELECT MIN(id) FROM sales_orders WHERE shipping_address LIKE '%Indonesia%')
AND p.sku IN ('ID-LAP-001', 'ID-MON-001', 'ID-KRS-001')
LIMIT 3;

-- Order 2: Office Supplies
INSERT INTO sales_order_items (sales_order_id, product_code, product_name, quantity, unit_price, discount_percent, tax_percent)
SELECT 
    so.id,
    p.sku,
    p.name,
    CASE p.sku
        WHEN 'ID-KTS-001' THEN 20
        WHEN 'ID-PLN-001' THEN 10
        WHEN 'ID-MAP-001' THEN 50
        WHEN 'ID-STP-001' THEN 10
        ELSE 1
    END as quantity,
    p.unit_price,
    0.00,  -- No discount
    11.00  -- PPN 11%
FROM sales_orders so
CROSS JOIN products p
WHERE so.id = (SELECT MIN(id) FROM sales_orders WHERE shipping_address LIKE '%Indonesia%') + 1
AND p.sku IN ('ID-KTS-001', 'ID-PLN-001', 'ID-MAP-001', 'ID-STP-001')
LIMIT 4;

-- Order 3: Furniture
INSERT INTO sales_order_items (sales_order_id, product_code, product_name, quantity, unit_price, discount_percent, tax_percent)
SELECT 
    so.id,
    p.sku,
    p.name,
    CASE p.sku
        WHEN 'CHAIR-DINING' THEN 10
        WHEN 'TABLE-DINING' THEN 2
        WHEN 'ID-MJ-001' THEN 5
        WHEN 'ID-LM-001' THEN 2
        ELSE 1
    END as quantity,
    p.unit_price,
    10.00,  -- 10% bulk discount
    11.00   -- PPN 11%
FROM sales_orders so
CROSS JOIN products p
WHERE so.id = (SELECT MIN(id) FROM sales_orders WHERE shipping_address LIKE '%Indonesia%') + 2
AND p.sku IN ('CHAIR-DINING', 'TABLE-DINING', 'ID-MJ-001', 'ID-LM-001')
LIMIT 4;

-- Order 4: Food & Beverage
INSERT INTO sales_order_items (sales_order_id, product_code, product_name, quantity, unit_price, discount_percent, tax_percent)
SELECT 
    so.id,
    p.sku,
    p.name,
    CASE p.sku
        WHEN 'ID-KOP-001' THEN 50
        WHEN 'ID-TEH-001' THEN 50
        WHEN 'ID-SNK-001' THEN 30
        ELSE 1
    END as quantity,
    p.unit_price,
    15.00,  -- 15% bulk discount
    11.00   -- PPN 11%
FROM sales_orders so
CROSS JOIN products p
WHERE so.id = (SELECT MIN(id) FROM sales_orders WHERE shipping_address LIKE '%Indonesia%') + 3
AND p.sku IN ('ID-KOP-001', 'ID-TEH-001', 'ID-SNK-001')
LIMIT 3;

-- Order 5: Cosmetics
INSERT INTO sales_order_items (sales_order_id, product_code, product_name, quantity, unit_price, discount_percent, tax_percent)
SELECT 
    so.id,
    p.sku,
    p.name,
    CASE p.sku
        WHEN 'ID-BDK-001' THEN 20
        WHEN 'ID-LST-001' THEN 30
        WHEN 'ID-SKN-001' THEN 25
        ELSE 1
    END as quantity,
    p.unit_price,
    8.00,   -- 8% discount
    11.00   -- PPN 11%
FROM sales_orders so
CROSS JOIN products p
WHERE so.id = (SELECT MIN(id) FROM sales_orders WHERE shipping_address LIKE '%Indonesia%') + 4
AND p.sku IN ('ID-BDK-001', 'ID-LST-001', 'ID-SKN-001')
LIMIT 3;

-- Update sales order items with calculated amounts
UPDATE sales_order_items
SET 
    discount_amount = quantity * unit_price * discount_percent / 100,
    tax_amount = quantity * unit_price * (1 - discount_percent/100) * tax_percent / 100,
    line_total = quantity * unit_price * (1 - discount_percent/100) * (1 + tax_percent/100)
WHERE sales_order_id IN (
    SELECT id FROM sales_orders WHERE shipping_address LIKE '%Indonesia%'
);

-- Update sales order totals
UPDATE sales_orders so
SET 
    subtotal = (
        SELECT COALESCE(SUM(soi.quantity * soi.unit_price), 0)
        FROM sales_order_items soi
        WHERE soi.sales_order_id = so.id
    ),
    discount_amount = (
        SELECT COALESCE(SUM(soi.discount_amount), 0)
        FROM sales_order_items soi
        WHERE soi.sales_order_id = so.id
    ),
    tax_amount = (
        SELECT COALESCE(SUM(soi.tax_amount), 0)
        FROM sales_order_items soi
        WHERE soi.sales_order_id = so.id
    ),
    total_amount = (
        SELECT COALESCE(SUM(soi.line_total), 0)
        FROM sales_order_items soi
        WHERE soi.sales_order_id = so.id
    )
WHERE shipping_address LIKE '%Indonesia%';

-- Verification
SELECT '=== SALES ORDERS INDONESIA (RUPIAH) ===' as title;

SELECT 
    so.id as no_order,
    so.customer as pelanggan,
    so.order_date as tanggal,
    so.status,
    'Rp ' || TO_CHAR(so.subtotal, 'FM999,999,999') as subtotal,
    'Rp ' || TO_CHAR(so.discount_amount, 'FM999,999,999') as diskon,
    'Rp ' || TO_CHAR(so.tax_amount, 'FM999,999,999') as ppn,
    'Rp ' || TO_CHAR(so.total_amount, 'FM999,999,999') as total
FROM sales_orders so
WHERE so.shipping_address LIKE '%Indonesia%'
ORDER BY so.id
LIMIT 10;

SELECT '' as divider;
SELECT '=== DETAIL ORDER ITEMS (Sample) ===' as title;

SELECT 
    so.id as no_order,
    soi.product_name as produk,
    soi.quantity as qty,
    'Rp ' || TO_CHAR(soi.unit_price, 'FM999,999,999') as harga_satuan,
    soi.discount_percent || '%' as diskon,
    'Rp ' || TO_CHAR(soi.line_total, 'FM999,999,999') as total
FROM sales_order_items soi
JOIN sales_orders so ON soi.sales_order_id = so.id
WHERE so.shipping_address LIKE '%Indonesia%'
ORDER BY so.id, soi.id
LIMIT 15;

SELECT '' as divider;
SELECT '=== RINGKASAN ===' as title;

SELECT 
    COUNT(DISTINCT so.id) as total_orders,
    COUNT(DISTINCT so.customer_id) as total_customers,
    COUNT(soi.id) as total_items,
    'Rp ' || TO_CHAR(SUM(so.total_amount), 'FM999,999,999,999') as total_penjualan
FROM sales_orders so
LEFT JOIN sales_order_items soi ON so.id = soi.sales_order_id
WHERE so.shipping_address LIKE '%Indonesia%';

SELECT '' as divider;
SELECT '✅ Sales Orders Indonesia dengan Rupiah berhasil dibuat!' as message;
