-- ============================================================================
-- Ocean ERP POS System - Test Data Seed Script (Simplified)
-- ============================================================================
-- Purpose: Generate realistic test data for POS system testing
-- Indonesian Skincare Retail Chain
-- Date: November 12, 2025
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PRODUCT CATEGORIES
-- ============================================================================

INSERT INTO product_categories (name, description, parent_id, created_at, updated_at)
VALUES 
  ('Facial Care', 'Facial skincare products', NULL, NOW(), NOW()),
  ('Body Care', 'Body care and treatment products', NULL, NOW(), NOW()),
  ('Sun Protection', 'Sunscreen and UV protection products', NULL, NOW(), NOW()),
  ('Acne Treatment', 'Acne and blemish treatment', NULL, NOW(), NOW()),
  ('Anti-Aging', 'Anti-aging and wrinkle treatment', NULL, NOW(), NOW()),
  ('Moisturizers', 'Facial and body moisturizers', NULL, NOW(), NOW()),
  ('Cleansers', 'Face and body cleansers', NULL, NOW(), NOW()),
  ('Serums & Essences', 'Treatment serums and essences', NULL, NOW(), NOW()),
  ('Masks', 'Sheet masks and treatment masks', NULL, NOW(), NOW()),
  ('Eye Care', 'Eye cream and treatment', NULL, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. SAMPLE PRODUCTS (50 Indonesian Skincare Items)
-- ============================================================================

INSERT INTO products (name, sku, barcode, description, category_id, brand, unit_price, cost_price, is_taxable, status, unit_of_measure, reorder_level, requires_batch_tracking, shelf_life_days, skin_type_suitable, ingredients)
SELECT * FROM (VALUES
  -- Cleansers (10)
  ('Wardah Perfect Bright Micellar Water', 'WRD-CLN-001', '8991199301234', 'Gentle micellar water for all skin types', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Wardah', 45000, 30000, true, 'Active', 'bottle', 100, true, 730, ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Micellar Technology', 'Vitamin B3']),
  ('Emina Bright Stuff Face Wash', 'EMI-CLN-002', '8991199301241', 'Brightening facial foam', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Emina', 25000, 15000, true, 'Active', 'tube', 150, true, 730, ARRAY['Normal', 'Oily'], ARRAY['Niacinamide', 'Garden Cress']),
  ('Somethinc Micellar Cleansing Water', 'SMT-CLN-003', '8991199301258', 'Hypoallergenic micellar water', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Somethinc', 89000, 60000, true, 'Active', 'bottle', 80, true, 730, ARRAY['Sensitive', 'Dry'], ARRAY['Probiotics', 'Hyaluronic Acid']),
  ('Avoskin Acne Gentle Cleanse', 'AVO-CLN-004', '8991199301265', 'Gentle cleanser for acne-prone skin', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Avoskin', 115000, 75000, true, 'Active', 'bottle', 60, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Tea Tree Oil', 'Salicylic Acid']),
  ('Hadalabo Gokujyun Face Wash', 'HAD-CLN-005', '8991199301272', 'Japanese hydrating cleanser', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Hadalabo', 42000, 28000, true, 'Active', 'tube', 120, true, 730, ARRAY['Dry', 'Normal'], ARRAY['Hyaluronic Acid']),
  ('Cetaphil Gentle Skin Cleanser', 'CET-CLN-006', '8991199301289', 'Dermatologist-recommended cleanser', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Cetaphil', 125000, 85000, true, 'Active', 'bottle', 80, true, 730, ARRAY['Sensitive', 'Dry'], ARRAY['Glycerin', 'Panthenol']),
  ('Skintific Ceramide Gel Cleanser', 'SKT-CLN-007', '8991199301296', 'Gel cleanser with ceramide', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Skintific', 98000, 65000, true, 'Active', 'tube', 100, true, 730, ARRAY['Dry', 'Sensitive'], ARRAY['5X Ceramide', 'Centella']),
  ('NPURE Cica Acne Cleanser', 'NPU-CLN-008', '8991199301302', 'Serum-infused cleanser', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'NPURE', 72000, 48000, true, 'Active', 'tube', 90, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Cica', 'Niacinamide']),
  ('Bioderma Sensibio H2O', 'BIO-CLN-009', '8991199301319', 'French pharmacy micellar water', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Bioderma', 189000, 130000, true, 'Active', 'bottle', 50, true, 730, ARRAY['Sensitive'], ARRAY['Micellar Technology']),
  ('Glad2Glow AHA BHA PHA Cleanser', 'GLD-CLN-010', '8991199301326', 'Triple acid exfoliating cleanser', (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Glad2Glow', 55000, 38000, true, 'Active', 'tube', 110, true, 730, ARRAY['Oily', 'Combination'], ARRAY['AHA', 'BHA', 'PHA']),

  -- Moisturizers & Sunscreens (10)
  ('Wardah Hydrating Moisturizer', 'WRD-MST-011', '8991199301333', 'Lightweight hydrating gel', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Wardah', 38000, 25000, true, 'Active', 'jar', 120, true, 730, ARRAY['Normal', 'Oily'], ARRAY['Aloe Vera', 'Vitamin E']),
  ('Emina Sun Protection SPF 30', 'EMI-MST-012', '8991199301340', '2-in-1 moisturizer with SPF', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Emina', 32000, 20000, true, 'Active', 'bottle', 140, true, 730, ARRAY['All Skin Types'], ARRAY['SPF 30', 'PA+++']),
  ('Somethinc Sunscreen Gel SPF 50+', 'SMT-MST-013', '8991199301357', 'Ultra-light sunscreen gel', (SELECT id FROM product_categories WHERE name = 'Sun Protection' LIMIT 1), 'Somethinc', 95000, 65000, true, 'Active', 'tube', 100, true, 730, ARRAY['Oily', 'Combination'], ARRAY['SPF 50+', 'Niacinamide']),
  ('Avoskin Sunscreen SPF 50', 'AVO-MST-014', '8991199301364', 'Physical sunscreen with centella', (SELECT id FROM product_categories WHERE name = 'Sun Protection' LIMIT 1), 'Avoskin', 135000, 90000, true, 'Active', 'tube', 70, true, 730, ARRAY['Sensitive', 'Dry'], ARRAY['Zinc Oxide', 'Centella']),
  ('Hadalabo Premium Lotion', 'HAD-MST-015', '8991199301371', 'Super hydrating lotion', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Hadalabo', 135000, 95000, true, 'Active', 'bottle', 80, true, 730, ARRAY['Dry', 'Normal'], ARRAY['5 Types Hyaluronic Acid']),
  ('Cetaphil Moisturizing Cream', 'CET-MST-016', '8991199301388', 'Rich cream for very dry skin', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Cetaphil', 165000, 115000, true, 'Active', 'jar', 60, true, 730, ARRAY['Dry', 'Very Dry'], ARRAY['Glycerin', 'Shea Butter']),
  ('Skintific Ceramide Moisturizer', 'SKT-MST-017', '8991199301395', 'Gel moisturizer with ceramide', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Skintific', 110000, 75000, true, 'Active', 'jar', 90, true, 730, ARRAY['Sensitive', 'Dry'], ARRAY['5X Ceramide']),
  ('NPURE Centella Moisturizer', 'NPU-MST-018', '8991199301401', 'Soothing gel cream with cica', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'NPURE', 68000, 45000, true, 'Active', 'jar', 110, true, 730, ARRAY['Sensitive', 'Acne-Prone'], ARRAY['Centella', 'Madecassoside']),
  ('La Roche-Posay Effaclar Mat', 'LRP-MST-019', '8991199301418', 'Mattifying moisturizer', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'La Roche-Posay', 225000, 155000, true, 'Active', 'tube', 50, true, 730, ARRAY['Oily', 'Combination'], ARRAY['Sebulyse']),
  ('Dear Me Beauty Moisturizer', 'DRM-MST-020', '8991199301425', 'Brightening moisturizer', (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Dear Me Beauty', 89000, 60000, true, 'Active', 'jar', 100, true, 730, ARRAY['All Skin Types'], ARRAY['Niacinamide', 'Licorice']),

  -- Serums & Essences (15)
  ('Somethinc Niacinamide Serum', 'SMT-SER-021', '8991199301432', '10% niacinamide brightening', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Somethinc', 125000, 85000, true, 'Active', 'dropper', 80, true, 730, ARRAY['All Skin Types'], ARRAY['10% Niacinamide', 'Red Beet']),
  ('Avoskin Retinol 1%', 'AVO-SER-022', '8991199301449', 'Anti-aging retinol serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Avoskin', 189000, 130000, true, 'Active', 'dropper', 60, true, 730, ARRAY['Normal', 'Dry'], ARRAY['1% Retinol', 'Vitamin E']),
  ('Skintific 10% Niacinamide', 'SKT-SER-023', '8991199301456', 'High concentration niacinamide', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Skintific', 135000, 95000, true, 'Active', 'dropper', 90, true, 730, ARRAY['Oily', 'Combination'], ARRAY['10% Niacinamide', 'Alpha Arbutin']),
  ('NPURE Cica Miracle Serum', 'NPU-SER-024', '8991199301463', 'Calming cica serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'NPURE', 95000, 65000, true, 'Active', 'dropper', 100, true, 730, ARRAY['Sensitive', 'Acne-Prone'], ARRAY['Centella', 'Tea Tree']),
  ('Wardah Vitamin C Serum', 'WRD-SER-025', '8991199301470', 'Brightening vitamin C', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Wardah', 65000, 45000, true, 'Active', 'dropper', 120, true, 365, ARRAY['All Skin Types'], ARRAY['Vitamin C', 'Vitamin E']),
  ('The Ordinary Niacinamide 10%', 'ORD-SER-026', '8991199301487', 'Oil control serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'The Ordinary', 115000, 80000, true, 'Active', 'dropper', 80, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Niacinamide', 'Zinc PCA']),
  ('The Ordinary Hyaluronic Acid', 'ORD-SER-027', '8991199301494', 'Deep hydration serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'The Ordinary', 95000, 65000, true, 'Active', 'dropper', 90, true, 730, ARRAY['Dry', 'Dehydrated'], ARRAY['Hyaluronic Acid', 'B5']),
  ('Glad2Glow Alpha Arbutin', 'GLD-SER-028', '8991199301500', 'Dark spot correcting serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Glad2Glow', 72000, 48000, true, 'Active', 'dropper', 100, true, 730, ARRAY['All Skin Types'], ARRAY['Alpha Arbutin', 'Niacinamide']),
  ('Emina Brightstuff Essence', 'EMI-SER-029', '8991199301517', 'Lightweight brightening essence', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Emina', 45000, 30000, true, 'Active', 'bottle', 130, true, 730, ARRAY['Normal', 'Oily'], ARRAY['Niacinamide', 'Licorice']),
  ('Hadalabo Whitening Essence', 'HAD-SER-030', '8991199301524', 'Japanese brightening essence', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Hadalabo', 165000, 115000, true, 'Active', 'bottle', 70, true, 730, ARRAY['All Skin Types'], ARRAY['Tranexamic Acid', 'HA']),
  ('Azarine Hydramax C Serum', 'AZR-SER-031', '8991199301531', 'Hydrating vitamin C serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Azarine', 58000, 38000, true, 'Active', 'dropper', 110, true, 730, ARRAY['Dry', 'Normal'], ARRAY['Vitamin C', 'Hyaluronic Acid']),
  ('Scarlett Whitening Serum', 'SCA-SER-032', '8991199301548', 'Brightening facial serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Scarlett', 75000, 50000, true, 'Active', 'dropper', 120, true, 730, ARRAY['All Skin Types'], ARRAY['Glutathione', 'Vitamin E']),
  ('Base Pore Minimizer Serum', 'BAS-SER-033', '8991199301555', 'Pore refining treatment', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Base', 89000, 60000, true, 'Active', 'dropper', 90, true, 730, ARRAY['Oily', 'Combination'], ARRAY['Niacinamide', 'Witch Hazel']),
  ('Dear Me Skin Barrier Serum', 'DRM-SER-034', '8991199301562', 'Barrier repair serum', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Dear Me Beauty', 105000, 70000, true, 'Active', 'dropper', 80, true, 730, ARRAY['Sensitive', 'Dry'], ARRAY['Ceramide', 'Peptides']),
  ('Y.O.U Triple Bright Serum', 'YOU-SER-035', '8991199301579', 'Triple action brightening', (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Y.O.U', 69000, 45000, true, 'Active', 'dropper', 100, true, 730, ARRAY['All Skin Types'], ARRAY['Vitamin C', 'Licorice', 'Niacinamide']),

  -- Acne Treatment (8)
  ('Erha Acne Care Serum', 'ERH-ACN-036', '8991199301586', 'Clinical acne treatment', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Erha', 145000, 100000, true, 'Active', 'dropper', 70, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Salicylic Acid', 'Niacinamide']),
  ('Acnes Sealing Jell', 'ACN-ACN-037', '8991199301593', 'Spot treatment gel', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Acnes', 28000, 18000, true, 'Active', 'tube', 140, true, 730, ARRAY['Acne-Prone'], ARRAY['Isopropyl Methylphenol']),
  ('Himalaya Neem Face Wash', 'HIM-ACN-038', '8991199301609', 'Natural acne cleanser', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Himalaya', 35000, 23000, true, 'Active', 'tube', 120, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Neem', 'Turmeric']),
  ('Paula''s Choice 2% BHA', 'PAU-ACN-039', '8991199301616', 'Clinical strength BHA', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Paula''s Choice', 385000, 265000, true, 'Active', 'bottle', 40, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['2% BHA', 'Green Tea']),
  ('Azarine Acne Gentle Foam', 'AZR-ACN-040', '8991199301623', 'Gentle foaming cleanser', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Azarine', 42000, 28000, true, 'Active', 'tube', 110, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Tea Tree', 'Salicylic Acid']),
  ('Cetaphil Pro Oil Removing', 'CET-ACN-041', '8991199301630', 'Oil control foam wash', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Cetaphil', 145000, 100000, true, 'Active', 'pump', 70, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['Zinc Technology']),
  ('Somebymi AHA BHA PHA Serum', 'SMY-ACN-042', '8991199301647', 'Korean triple acid serum', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Somebymi', 165000, 115000, true, 'Active', 'dropper', 60, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['AHA', 'BHA', 'PHA', 'Tea Tree']),
  ('The Body Shop Tea Tree Oil', 'TBS-ACN-043', '8991199301654', 'Pure tea tree essential oil', (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'The Body Shop', 125000, 85000, true, 'Active', 'dropper', 50, true, 1095, ARRAY['Acne-Prone'], ARRAY['Tea Tree Oil']),

  -- Masks (7)
  ('Wardah Hydrating Sheet Mask', 'WRD-MSK-044', '8991199301661', 'Intensive hydrating sheet mask', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Wardah', 15000, 10000, true, 'Active', 'sachet', 200, true, 730, ARRAY['All Skin Types'], ARRAY['Aloe Vera', 'Vitamin E']),
  ('Mediheal Aquaring Mask', 'MED-MSK-045', '8991199301678', 'Korean hydrating ampoule mask', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Mediheal', 22000, 15000, true, 'Active', 'sachet', 240, true, 730, ARRAY['Dry', 'Normal'], ARRAY['Hyaluronic Acid', 'Ceramide']),
  ('Skintific Clay Mask', 'SKT-MSK-046', '8991199301685', 'Clay mask for deep cleansing', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Skintific', 89000, 60000, true, 'Active', 'jar', 80, true, 730, ARRAY['Oily', 'Combination'], ARRAY['Kaolin Clay', 'Charcoal']),
  ('Innisfree My Real Squeeze', 'INN-MSK-047', '8991199301692', 'Natural ingredient sheet mask', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Innisfree', 18000, 12000, true, 'Active', 'sachet', 300, true, 730, ARRAY['All Skin Types'], ARRAY['Natural Extracts']),
  ('Emina Sheet Mask Green Tea', 'EMI-MSK-048', '8991199301708', 'Refreshing green tea mask', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Emina', 12000, 8000, true, 'Active', 'sachet', 360, true, 730, ARRAY['Oily', 'Combination'], ARRAY['Green Tea']),
  ('Avoskin Miraculous Toner', 'AVO-MSK-049', '8991199301715', 'AHA BHA exfoliating toner', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Avoskin', 125000, 85000, true, 'Active', 'bottle', 70, true, 730, ARRAY['Oily', 'Acne-Prone'], ARRAY['AHA', 'BHA', 'Niacinamide']),
  ('Dear Me Sleeping Mask', 'DRM-MSK-050', '8991199301722', 'Overnight repair mask', (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Dear Me Beauty', 95000, 65000, true, 'Active', 'jar', 80, true, 730, ARRAY['Dry', 'Sensitive'], ARRAY['Ceramide', 'Peptides'])
) AS t;

-- ============================================================================
-- 3. INVENTORY SETUP
-- ============================================================================

INSERT INTO inventory (
  product_id,
  warehouse_id,
  quantity_on_hand,
  quantity_reserved,
  quantity_available,
  unit_cost,
  total_value,
  created_at,
  updated_at
)
SELECT 
  p.id,
  1 as warehouse_id,
  (150 + (RANDOM() * 350)::INT) as quantity_on_hand,
  0 as quantity_reserved,
  (150 + (RANDOM() * 350)::INT) as quantity_available,
  p.cost_price as unit_cost,
  p.cost_price * (150 + (RANDOM() * 350)::INT) as total_value,
  NOW() as created_at,
  NOW() as updated_at
FROM products p
WHERE p.sku LIKE 'WRD-%' OR p.sku LIKE 'EMI-%' OR p.sku LIKE 'SMT-%' OR 
      p.sku LIKE 'AVO-%' OR p.sku LIKE 'HAD-%' OR p.sku LIKE 'CET-%' OR
      p.sku LIKE 'SKT-%' OR p.sku LIKE 'NPU-%' OR p.sku LIKE 'BIO-%' OR
      p.sku LIKE 'GLD-%' OR p.sku LIKE 'LRP-%' OR p.sku LIKE 'DRM-%' OR
      p.sku LIKE 'ORD-%' OR p.sku LIKE 'AZR-%' OR p.sku LIKE 'SCA-%' OR
      p.sku LIKE 'BAS-%' OR p.sku LIKE 'YOU-%' OR p.sku LIKE 'ERH-%' OR
      p.sku LIKE 'ACN-%' OR p.sku LIKE 'HIM-%' OR p.sku LIKE 'PAU-%' OR
      p.sku LIKE 'SMY-%' OR p.sku LIKE 'TBS-%' OR p.sku LIKE 'MED-%' OR
      p.sku LIKE 'INN-%'
ON CONFLICT (product_id, warehouse_id, batch_number) DO NOTHING;

-- ============================================================================
-- 4. SAMPLE CUSTOMERS (20)
-- ============================================================================

INSERT INTO customers (
  customer_type, contact_person, phone, email, membership_number,
  membership_tier_id, loyalty_points,
  lifetime_purchase_value, last_purchase_date, transaction_count,
  customer_status, billing_address, billing_city, billing_state, billing_country, billing_postal_code
)
SELECT * FROM (VALUES
  ('Individual', 'Siti Nurhaliza', '+62-812-3456-7890', 'siti.nurhaliza@gmail.com', 'MEM-2024-0001', 
   (SELECT id FROM membership_tiers WHERE tier_name = 'Platinum' LIMIT 1), 15000, 85000000, '2024-11-01'::date, 42, 'Active', 
   'Jl. Sudirman Kav. 52-53', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12190'),
   
  ('Individual', 'Raisa Andriana', '+62-813-9876-5432', 'raisa.andriana@yahoo.com', 'MEM-2024-0002',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Titanium' LIMIT 1), 45000, 125000000, '2024-11-05'::date, 68, 'Active',
   'Jl. MH Thamrin No. 1', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10310'),
   
  ('Individual', 'Dian Sastrowardoyo', '+62-815-2468-1357', 'dian.sastro@gmail.com', 'MEM-2024-0003',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Platinum' LIMIT 1), 12500, 72000000, '2024-10-28'::date, 38, 'Active',
   'Jl. Gatot Subroto Kav. 18', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12710'),

  ('Individual', 'Anya Geraldine', '+62-821-5555-1234', 'anya.geraldine@gmail.com', 'MEM-2024-0004',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 8200, 28000000, '2024-11-08'::date, 24, 'Active',
   'Jl. Kemang Raya No. 8', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12730'),
   
  ('Individual', 'Nagita Slavina', '+62-822-7777-9999', 'gigi.rafathar@gmail.com', 'MEM-2024-0005',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 9500, 32000000, '2024-11-10'::date, 28, 'Active',
   'Jl. Radio Dalam Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12140'),
   
  ('Individual', 'Luna Maya', '+62-823-4444-8888', 'lunamaya@outlook.com', 'MEM-2024-0006',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 7800, 26000000, '2024-11-03'::date, 22, 'Active',
   'Jl. Senopati No. 15', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12190'),

  ('Individual', 'Ayu Ting Ting', '+62-831-2222-3333', 'ayutingting@gmail.com', 'MEM-2024-0007',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 3500, 12000000, '2024-11-09'::date, 15, 'Active',
   'Jl. Pancoran Barat', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12780'),
   
  ('Individual', 'Maudy Ayunda', '+62-832-6666-7777', 'maudy.ayunda@gmail.com', 'MEM-2024-0008',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 4200, 14000000, '2024-11-07'::date, 18, 'Active',
   'Jl. Puri Indah Raya', 'Jakarta Barat', 'DKI Jakarta', 'Indonesia', '11610'),
   
  ('Individual', 'Chelsea Islan', '+62-833-9999-1111', 'chelsea.islan@yahoo.com', 'MEM-2024-0009',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 3800, 13000000, '2024-11-06'::date, 16, 'Active',
   'Jl. Tebet Barat Dalam', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12810'),
   
  ('Individual', 'Cinta Laura', '+62-834-5555-6666', 'cintalaura@gmail.com', 'MEM-2024-0010',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 4500, 15000000, '2024-11-11'::date, 19, 'Active',
   'Jl. Pondok Indah Mall 1', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12310'),

  ('Individual', 'Tara Basro', '+62-841-1111-2222', 'tara.basro@gmail.com', 'MEM-2024-0011',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 850, 3000000, '2024-11-04'::date, 8, 'Active',
   'Jl. Cikini Raya No. 25', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10330'),
   
  ('Individual', 'Pevita Pearce', '+62-842-3333-4444', 'pevita.pearce@gmail.com', 'MEM-2024-0012',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 920, 3500000, '2024-11-02'::date, 9, 'Active',
   'Jl. Menteng Raya', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10340'),
   
  ('Individual', 'Marsha Timothy', '+62-843-5555-6666', 'marsha.timothy@outlook.com', 'MEM-2024-0013',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 780, 2800000, '2024-10-30'::date, 7, 'Active',
   'Jl. Casablanca Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12870'),
   
  ('Individual', 'Hannah Al Rashid', '+62-844-7777-8888', 'hannah.alrashid@gmail.com', 'MEM-2024-0014',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 650, 2500000, '2024-10-25'::date, 6, 'Active',
   'Jl. Kuningan Barat', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12710'),
   
  ('Individual', 'Raihaanun', '+62-845-9999-0000', 'raihaanun@gmail.com', 'MEM-2024-0015',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 1100, 4000000, '2024-11-12'::date, 10, 'Active',
   'Jl. Pasar Minggu Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12780'),
   
  ('Individual', 'Adinia Wirasti', '+62-846-1234-5678', 'adinia.wirasti@yahoo.com', 'MEM-2024-0016',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 720, 2700000, '2024-10-29'::date, 7, 'Active',
   'Jl. Fatmawati Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12420'),
   
  ('Individual', 'Tatjana Saphira', '+62-847-9876-5432', 'tatjana.saphira@gmail.com', 'MEM-2024-0017',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 980, 3800000, '2024-11-01'::date, 9, 'Active',
   'Jl. Cilandak KKO', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12560'),
   
  ('Individual', 'Laura Basuki', '+62-848-5555-4444', 'laura.basuki@gmail.com', 'MEM-2024-0018',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 560, 2000000, '2024-10-20'::date, 5, 'Active',
   'Jl. Ciputat Raya', 'Tangerang Selatan', 'Banten', 'Indonesia', '15412'),
   
  ('Individual', 'Acha Septriasa', '+62-849-3333-2222', 'acha.septriasa@outlook.com', 'MEM-2024-0019',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 1250, 4500000, '2024-11-11'::date, 11, 'Active',
   'Jl. BSD Green Office', 'Tangerang Selatan', 'Banten', 'Indonesia', '15345'),
   
  ('Individual', 'Nirina Zubir', '+62-850-7777-6666', 'nirina.zubir@gmail.com', 'MEM-2024-0020',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 890, 3200000, '2024-11-08'::date, 8, 'Active',
   'Jl. Bintaro Jaya Sektor 7', 'Tangerang Selatan', 'Banten', 'Indonesia', '15224')
) AS t;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

SELECT 'Products Created' as metric, COUNT(*) as count FROM products WHERE sku LIKE '%-%';
SELECT 'Inventory Records' as metric, COUNT(*) as count FROM inventory WHERE warehouse_id = 1;
SELECT 'Customers Created' as metric, COUNT(*) as count FROM customers WHERE membership_number LIKE 'MEM-2024-%';

SELECT 
  mt.tier_name,
  COUNT(c.id) as customer_count,
  SUM(c.lifetime_purchase_value) as total_lifetime_value
FROM customers c
JOIN membership_tiers mt ON c.membership_tier_id = mt.id
WHERE c.membership_number LIKE 'MEM-2024-%'
GROUP BY mt.tier_name
ORDER BY mt.tier_name;
