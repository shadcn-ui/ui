-- Sample Data for Work Order Testing
-- This creates products, BOMs, and demonstrates the complete flow

-- Step 1: Create RAW MATERIAL Products (Components)
INSERT INTO products (sku, name, description, unit_price, cost_price, unit_of_measure, status) VALUES
-- Chair components
('WOOD-LEG', 'Wooden Leg', 'Chair leg made from oak wood', 8.00, 5.00, 'pcs', 'Active'),
('WOOD-SEAT', 'Wooden Seat Panel', 'Seat panel 40x40cm', 15.00, 10.00, 'pcs', 'Active'),
('WOOD-BACK', 'Wooden Backrest', 'Backrest panel 40x50cm', 12.00, 8.00, 'pcs', 'Active'),
('SCREW-M6', 'M6 Screws', 'Metal screws M6x50mm', 0.50, 0.20, 'pcs', 'Active'),
('VARNISH-OAK', 'Oak Varnish', 'Wood finish varnish', 25.00, 15.00, 'liter', 'Active'),
('CUSHION-40', 'Seat Cushion 40cm', 'Foam cushion with fabric', 20.00, 12.00, 'pcs', 'Active'),

-- Table components
('WOOD-TOP', 'Table Top Panel', 'Large wooden panel 120x80cm', 80.00, 50.00, 'pcs', 'Active'),
('TABLE-LEG', 'Table Leg', 'Sturdy wooden table leg', 12.00, 7.00, 'pcs', 'Active'),
('BRACKET', 'Metal Bracket', 'Corner reinforcement bracket', 3.00, 1.50, 'pcs', 'Active')
ON CONFLICT (sku) DO NOTHING;

-- Step 2: Create FINISHED GOODS Products (What we manufacture)
INSERT INTO products (sku, name, description, unit_price, cost_price, unit_of_measure, status) VALUES
('CHAIR-DINING', 'Wooden Dining Chair', 'Handcrafted dining chair with cushion', 120.00, 60.00, 'pcs', 'Active'),
('TABLE-DINING', 'Wooden Dining Table', 'Large dining table 120x80cm', 450.00, 200.00, 'pcs', 'Active')
ON CONFLICT (sku) DO NOTHING;

-- Step 3: Create Bill of Materials (BOMs) - The RECIPES

-- BOM for Dining Chair
INSERT INTO bill_of_materials (product_name, product_code, version, status, notes, total_cost)
VALUES ('Wooden Dining Chair', 'CHAIR-DINING', '1.0', 'active', 'Standard production method', 0)
ON CONFLICT DO NOTHING
RETURNING id;

-- Get the BOM ID (you'll need to run this manually or in a script)
-- For this example, let's assume BOM ID will be auto-generated

-- Add BOM Items for Chair (using component codes that match products)
DO $$
DECLARE
    v_bom_id INTEGER;
BEGIN
    -- Get or create the BOM
    SELECT id INTO v_bom_id FROM bill_of_materials WHERE product_code = 'CHAIR-DINING' AND version = '1.0';
    
    IF v_bom_id IS NULL THEN
        INSERT INTO bill_of_materials (product_name, product_code, version, status, notes, total_cost)
        VALUES ('Wooden Dining Chair', 'CHAIR-DINING', '1.0', 'active', 'Standard production method', 0)
        RETURNING id INTO v_bom_id;
    END IF;
    
    -- Delete existing items to avoid duplicates
    DELETE FROM bom_items WHERE bom_id = v_bom_id;
    
    -- Add components
    INSERT INTO bom_items (bom_id, component_name, component_code, quantity, unit, unit_cost, notes) VALUES
    (v_bom_id, 'Wooden Leg', 'WOOD-LEG', 4.000, 'pcs', 5.00, '4 legs per chair'),
    (v_bom_id, 'Wooden Seat Panel', 'WOOD-SEAT', 1.000, 'pcs', 10.00, 'Main seat'),
    (v_bom_id, 'Wooden Backrest', 'WOOD-BACK', 1.000, 'pcs', 8.00, 'Back support'),
    (v_bom_id, 'M6 Screws', 'SCREW-M6', 16.000, 'pcs', 0.20, '16 screws for assembly'),
    (v_bom_id, 'Oak Varnish', 'VARNISH-OAK', 0.100, 'liter', 15.00, 'Finishing'),
    (v_bom_id, 'Seat Cushion 40cm', 'CUSHION-40', 1.000, 'pcs', 12.00, 'Optional cushion');
    
    -- Calculate and update total cost
    UPDATE bill_of_materials 
    SET total_cost = (
        SELECT SUM(quantity * unit_cost) 
        FROM bom_items 
        WHERE bom_id = v_bom_id
    )
    WHERE id = v_bom_id;
    
    RAISE NOTICE 'Chair BOM created with ID: %', v_bom_id;
END $$;

-- BOM for Dining Table
DO $$
DECLARE
    v_bom_id INTEGER;
BEGIN
    -- Get or create the BOM
    SELECT id INTO v_bom_id FROM bill_of_materials WHERE product_code = 'TABLE-DINING' AND version = '1.0';
    
    IF v_bom_id IS NULL THEN
        INSERT INTO bill_of_materials (product_name, product_code, version, status, notes, total_cost)
        VALUES ('Wooden Dining Table', 'TABLE-DINING', '1.0', 'active', 'Standard production method', 0)
        RETURNING id INTO v_bom_id;
    END IF;
    
    -- Delete existing items to avoid duplicates
    DELETE FROM bom_items WHERE bom_id = v_bom_id;
    
    -- Add components
    INSERT INTO bom_items (bom_id, component_name, component_code, quantity, unit, unit_cost, notes) VALUES
    (v_bom_id, 'Table Top Panel', 'WOOD-TOP', 1.000, 'pcs', 50.00, 'Main table surface'),
    (v_bom_id, 'Table Leg', 'TABLE-LEG', 4.000, 'pcs', 7.00, '4 sturdy legs'),
    (v_bom_id, 'Metal Bracket', 'BRACKET', 8.000, 'pcs', 1.50, 'Corner reinforcements'),
    (v_bom_id, 'M6 Screws', 'SCREW-M6', 24.000, 'pcs', 0.20, '24 screws for assembly'),
    (v_bom_id, 'Oak Varnish', 'VARNISH-OAK', 0.300, 'liter', 15.00, 'Finishing');
    
    -- Calculate and update total cost
    UPDATE bill_of_materials 
    SET total_cost = (
        SELECT SUM(quantity * unit_cost) 
        FROM bom_items 
        WHERE bom_id = v_bom_id
    )
    WHERE id = v_bom_id;
    
    RAISE NOTICE 'Table BOM created with ID: %', v_bom_id;
END $$;

-- Verification Queries
SELECT 'Products Created:' as step;
SELECT sku, name, unit_of_measure, status FROM products WHERE sku IN ('CHAIR-DINING', 'TABLE-DINING', 'WOOD-LEG', 'SCREW-M6');

SELECT '' as divider;
SELECT 'BOMs Created:' as step;
SELECT b.id, b.product_name, b.product_code, b.version, b.status, b.total_cost,
       COUNT(bi.id) as item_count
FROM bill_of_materials b
LEFT JOIN bom_items bi ON b.id = bi.bom_id
WHERE b.product_code IN ('CHAIR-DINING', 'TABLE-DINING')
GROUP BY b.id;

SELECT '' as divider;
SELECT 'Chair BOM Details:' as step;
SELECT bi.component_name, bi.component_code, bi.quantity, bi.unit, bi.unit_cost, 
       (bi.quantity * bi.unit_cost) as total_cost
FROM bom_items bi
JOIN bill_of_materials b ON bi.bom_id = b.id
WHERE b.product_code = 'CHAIR-DINING';

SELECT '' as divider;
SELECT '✅ Sample data created successfully!' as message;
SELECT 'You can now:' as next_steps;
SELECT '1. Go to Operations > Manufacturing' as step;
SELECT '2. Click "New Work Order"' as step;
SELECT '3. Select "Wooden Dining Chair" or "Wooden Dining Table"' as step;
SELECT '4. The BOM materials will be automatically loaded!' as step;
