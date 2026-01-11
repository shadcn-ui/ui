-- =====================================================
-- Test Data for Multi-Level BOM Explosion
-- =====================================================
-- Creates complete test scenario with:
-- 1. Parent product (Laptop Computer)
-- 2. Sub-assemblies (Motherboard, Display)
-- 3. Components (CPU, RAM, LCD Panel, etc.)
-- =====================================================

-- Clean up any existing test data
DELETE FROM work_order_materials WHERE work_order_id IN (
    SELECT id FROM work_orders WHERE product_code LIKE 'TEST-%'
);
DELETE FROM work_orders WHERE product_code LIKE 'TEST-%';
DELETE FROM bom_items WHERE bom_id IN (
    SELECT id FROM bill_of_materials WHERE product_code LIKE 'TEST-%'
);
DELETE FROM bill_of_materials WHERE product_code LIKE 'TEST-%';
DELETE FROM products WHERE sku LIKE 'TEST-%';

-- Create test products
INSERT INTO products (sku, name, unit_of_measure, cost_price, unit_price, category_id, status)
VALUES
    -- Finished Goods
    ('TEST-LAPTOP-001', 'Business Laptop 15"', 'pcs', 8500000, 12500000, 
     (SELECT id FROM categories LIMIT 1), 'Active'),
    
    -- Sub-assemblies (Phantom BOMs)
    ('TEST-MOBO-001', 'Motherboard Assembly', 'pcs', 2500000, 3500000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-DISP-001', 'Display Assembly 15"', 'pcs', 1800000, 2500000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    
    -- Components
    ('TEST-CPU-001', 'Intel Core i5 Processor', 'pcs', 1500000, 2000000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-RAM-001', 'RAM 8GB DDR4', 'pcs', 400000, 600000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-SSD-001', 'SSD 256GB NVMe', 'pcs', 500000, 750000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-LCD-001', 'LCD Panel 15" FHD', 'pcs', 1200000, 1800000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-BATT-001', 'Lithium Battery 4-Cell', 'pcs', 600000, 900000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-KB-001', 'Keyboard Backlit', 'pcs', 200000, 300000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-CASE-001', 'Aluminum Laptop Case', 'pcs', 800000, 1200000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    
    -- Alternative components for substitution
    ('TEST-RAM-002', 'RAM 8GB DDR4 (Alternative)', 'pcs', 420000, 620000,
     (SELECT id FROM categories LIMIT 1), 'Active'),
    ('TEST-SSD-002', 'SSD 256GB SATA (Alternative)', 'pcs', 450000, 700000,
     (SELECT id FROM categories LIMIT 1), 'Active')
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    cost_price = EXCLUDED.cost_price,
    unit_price = EXCLUDED.unit_price,
    status = EXCLUDED.status;

-- Create BOMs
-- Level 0: Laptop (finished good)
INSERT INTO bill_of_materials (product_name, product_code, version, status, notes)
VALUES ('Business Laptop 15"', 'TEST-LAPTOP-001', '1.0', 'active', 'Complete laptop assembly')
RETURNING id;

-- Level 1: Laptop BOM Items (sub-assemblies + components)
INSERT INTO bom_items (
    bom_id, component_code, component_name, component_product_id, quantity, unit, unit_cost,
    is_phantom, level_number, scrap_percentage, is_substitutable, substitute_product_ids
)
SELECT 
    bom.id,
    p.sku,
    p.name,
    p.id,
    CASE p.sku
        WHEN 'TEST-MOBO-001' THEN 1
        WHEN 'TEST-DISP-001' THEN 1
        WHEN 'TEST-BATT-001' THEN 1
        WHEN 'TEST-KB-001' THEN 1
        WHEN 'TEST-CASE-001' THEN 1
    END,
    'pcs',
    p.cost_price,
    CASE p.sku
        WHEN 'TEST-MOBO-001' THEN true  -- Phantom: explodes to components
        WHEN 'TEST-DISP-001' THEN true  -- Phantom: explodes to components
        ELSE false
    END,
    1,  -- Level 1
    CASE p.sku
        WHEN 'TEST-BATT-001' THEN 5.00  -- 5% scrap for batteries
        ELSE 0
    END,
    false,
    ARRAY[]::INTEGER[]
FROM bill_of_materials bom
CROSS JOIN products p
WHERE bom.product_code = 'TEST-LAPTOP-001'
AND p.sku IN ('TEST-MOBO-001', 'TEST-DISP-001', 'TEST-BATT-001', 'TEST-KB-001', 'TEST-CASE-001');

-- Level 1.5: Motherboard BOM
INSERT INTO bill_of_materials (product_name, product_code, version, status, notes)
VALUES ('Motherboard Assembly', 'TEST-MOBO-001', '1.0', 'active', 'Motherboard sub-assembly')
RETURNING id;

-- Level 2: Motherboard components
INSERT INTO bom_items (
    bom_id, component_code, component_name, component_product_id, quantity, unit, unit_cost,
    is_phantom, level_number, scrap_percentage, is_substitutable, substitute_product_ids
)
SELECT 
    bom.id,
    p.sku,
    p.name,
    p.id,
    CASE p.sku
        WHEN 'TEST-CPU-001' THEN 1
        WHEN 'TEST-RAM-001' THEN 2  -- 2x 8GB RAM
        WHEN 'TEST-SSD-001' THEN 1
    END,
    'pcs',
    p.cost_price,
    false,
    2,  -- Level 2
    0,
    CASE p.sku
        WHEN 'TEST-RAM-001' THEN true  -- RAM is substitutable
        WHEN 'TEST-SSD-001' THEN true  -- SSD is substitutable
        ELSE false
    END,
    CASE p.sku
        WHEN 'TEST-RAM-001' THEN ARRAY[(SELECT id FROM products WHERE sku = 'TEST-RAM-002')]
        WHEN 'TEST-SSD-001' THEN ARRAY[(SELECT id FROM products WHERE sku = 'TEST-SSD-002')]
        ELSE ARRAY[]::INTEGER[]
    END
FROM bill_of_materials bom
CROSS JOIN products p
WHERE bom.product_code = 'TEST-MOBO-001'
AND p.sku IN ('TEST-CPU-001', 'TEST-RAM-001', 'TEST-SSD-001');

-- Level 1.5: Display BOM
INSERT INTO bill_of_materials (product_name, product_code, version, status, notes)
VALUES ('Display Assembly 15"', 'TEST-DISP-001', '1.0', 'active', 'Display sub-assembly')
RETURNING id;

-- Level 2: Display components
INSERT INTO bom_items (
    bom_id, component_code, component_name, component_product_id, quantity, unit, unit_cost,
    is_phantom, level_number, scrap_percentage, is_substitutable, substitute_product_ids
)
SELECT 
    bom.id,
    p.sku,
    p.name,
    p.id,
    1,
    'pcs',
    p.cost_price,
    false,
    2,
    CASE p.sku
        WHEN 'TEST-LCD-001' THEN 2.00  -- 2% scrap for LCD panels
        ELSE 0
    END,
    false,
    ARRAY[]::INTEGER[]
FROM bill_of_materials bom
CROSS JOIN products p
WHERE bom.product_code = 'TEST-DISP-001'
AND p.sku IN ('TEST-LCD-001');

-- Summary
SELECT '========================================' as separator;
SELECT 'Test Data Created Successfully' as status;
SELECT '========================================' as separator;

SELECT 'Products created:' as info;
SELECT sku, name, cost_price, unit_price
FROM products
WHERE sku LIKE 'TEST-%'
ORDER BY sku;

SELECT '' as separator;
SELECT 'BOMs created:' as info;
SELECT 
    bom.id,
    bom.product_code,
    bom.product_name,
    bom.version,
    COUNT(bi.id) as component_count
FROM bill_of_materials bom
LEFT JOIN bom_items bi ON bi.bom_id = bom.id
WHERE bom.product_code LIKE 'TEST-%'
GROUP BY bom.id, bom.product_code, bom.product_name, bom.version
ORDER BY bom.product_code;

SELECT '' as separator;
SELECT 'BOM Items (showing structure):' as info;
SELECT 
    bom.product_code as parent_product,
    bi.component_code,
    bi.component_name,
    bi.quantity,
    bi.level_number,
    bi.is_phantom,
    bi.is_substitutable
FROM bom_items bi
JOIN bill_of_materials bom ON bom.id = bi.bom_id
WHERE bom.product_code LIKE 'TEST-%'
ORDER BY bom.product_code, bi.level_number, bi.component_code;

SELECT '' as separator;
SELECT '✅ Ready to test multi-level BOM explosion!' as ready;
