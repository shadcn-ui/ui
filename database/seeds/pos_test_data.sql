-- ============================================================================
-- Ocean ERP POS System - Test Data Seed Script
-- ============================================================================
-- Purpose: Generate realistic test data for POS system testing
-- Indonesian Skincare Retail Chain (300 outlets planned)
-- Date: November 12, 2025
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PRODUCT CATEGORIES
-- ============================================================================

-- Insert product categories for skincare retail
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

INSERT INTO products (
  name, 
  sku, 
  barcode,
  description,
  category_id,
  brand,
  unit_price,
  cost_price,
  is_taxable,
  status,
  unit_of_measure,
  reorder_level,
  requires_batch_tracking,
  shelf_life_days,
  skin_type_suitable,
  ingredients,
  created_at,
  updated_at
) VALUES 
  -- Facial Cleansers (10 items)
  ('Wardah Perfect Bright Micellar Water', 'WRD-CLN-001', '8991199301234', 'Gentle micellar water for all skin types', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Wardah', 45000, 30000, 11, true, 'Active', 'Good', 'bottle', 50, 500, 100, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Normal', 'Oily', 'Combination'], ARRAY['Micellar Technology', 'Vitamin B3'], 'Apply to cotton pad and gently wipe face', 'Indonesia'),
  
  ('Emina Bright Stuff Face Wash', 'EMI-CLN-002', '8991199301241', 'Brightening facial foam with natural extracts', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Emina', 25000, 15000, 11, true, 'Active', 'Good', 'tube', 80, 800, 150, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Normal', 'Oily'], ARRAY['Niacinamide', 'Garden Cress Extract'], 'Wet face, apply foam, massage gently, rinse', 'Indonesia'),
  
  ('Somethinc Micellar Cleansing Water', 'SMT-CLN-003', '8991199301258', 'Hypoallergenic micellar water with probiotics', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Somethinc', 89000, 60000, 11, true, 'Active', 'Good', 'bottle', 40, 400, 80, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Sensitive', 'Dry'], ARRAY['Probiotics', 'Hyaluronic Acid'], 'Soak cotton pad, wipe gently without rinsing', 'Indonesia'),
  
  ('Avoskin Your Skin Bae Acne Gentle Cleanse', 'AVO-CLN-004', '8991199301265', 'Gentle cleanser for acne-prone skin', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Avoskin', 115000, 75000, 11, true, 'Active', 'Good', 'bottle', 30, 300, 60, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Acne-Prone'], ARRAY['Tea Tree Oil', 'Salicylic Acid'], 'Pump onto wet face, massage, rinse thoroughly', 'Indonesia'),
  
  ('Hadalabo Gokujyun Ultimate Moisturizing Face Wash', 'HAD-CLN-005', '8991199301272', 'Japanese hydrating cleanser', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Hadalabo', 42000, 28000, 11, true, 'Active', 'Good', 'tube', 60, 600, 120, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Dry', 'Normal'], ARRAY['Hyaluronic Acid'], 'Lather with water, massage face, rinse', 'Japan'),
  
  ('Cetaphil Gentle Skin Cleanser', 'CET-CLN-006', '8991199301289', 'Dermatologist-recommended gentle cleanser', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Cetaphil', 125000, 85000, 11, true, 'Active', 'Good', 'bottle', 40, 400, 80, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Sensitive', 'Dry'], ARRAY['Glycerin', 'Panthenol'], 'Apply to damp skin, massage, rinse or wipe', 'USA'),
  
  ('Skintific 5X Ceramide Barrier Repair Moisture Gel', 'SKT-CLN-007', '8991199301296', 'Gel cleanser with ceramide barrier repair', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Skintific', 98000, 65000, 11, true, 'Active', 'Good', 'tube', 50, 500, 100, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Dry', 'Sensitive'], ARRAY['5X Ceramide', 'Centella Asiatica'], 'Massage onto wet face, rinse with water', 'Indonesia'),
  
  ('NPURE Cica Beatuy Miracle Serum Acne Cleanser', 'NPU-CLN-008', '8991199301302', 'Serum-infused cleanser for acne', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'NPURE', 72000, 48000, 11, true, 'Active', 'Good', 'tube', 45, 450, 90, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Acne-Prone'], ARRAY['Cica', 'Niacinamide'], 'Apply to wet face, lather, rinse thoroughly', 'Indonesia'),
  
  ('Bioderma Sensibio H2O Micellar Water', 'BIO-CLN-009', '8991199301319', 'French pharmacy micellar water', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Bioderma', 189000, 130000, 11, true, 'Active', 'Good', 'bottle', 25, 250, 50, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Sensitive'], ARRAY['Micellar Technology', 'Cucumber Extract'], 'Apply with cotton pad, no rinsing needed', 'France'),
  
  ('Glad2Glow AHA BHA PHA Serum Cleanser', 'GLD-CLN-010', '8991199301326', 'Triple acid gentle exfoliating cleanser', 
   (SELECT id FROM product_categories WHERE name = 'Cleansers' LIMIT 1), 'Glad2Glow', 55000, 38000, 11, true, 'Active', 'Good', 'tube', 55, 550, 110, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Combination'], ARRAY['AHA', 'BHA', 'PHA'], 'Use 2-3 times weekly, massage, rinse', 'Indonesia'),

  -- Moisturizers (10 items)
  ('Wardah Hydrating Moisturizer', 'WRD-MST-011', '8991199301333', 'Lightweight hydrating gel moisturizer', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Wardah', 38000, 25000, 11, true, 'Active', 'Good', 'jar', 60, 600, 120, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Normal', 'Oily'], ARRAY['Aloe Vera', 'Vitamin E'], 'Apply to clean face morning and night', 'Indonesia'),
  
  ('Emina Sun Protection SPF 30', 'EMI-MST-012', '8991199301340', '2-in-1 moisturizer with sun protection', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Emina', 32000, 20000, 11, true, 'Active', 'Good', 'bottle', 70, 700, 140, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['All Skin Types'], ARRAY['SPF 30', 'PA+++'], 'Apply generously 15 minutes before sun exposure', 'Indonesia'),
  
  ('Somethinc Holyshield! UV Watery Sunscreen Gel SPF 50+', 'SMT-MST-013', '8991199301357', 'Ultra-light sunscreen gel moisturizer', 
   (SELECT id FROM product_categories WHERE name = 'Sun Protection' LIMIT 1), 'Somethinc', 95000, 65000, 11, true, 'Active', 'Good', 'tube', 50, 500, 100, true, 730, 'Room Temperature', true, 'Sunscreen', ARRAY['Oily', 'Combination'], ARRAY['SPF 50+', 'PA++++', 'Niacinamide'], 'Apply as last step of skincare routine', 'Indonesia'),
  
  ('Avoskin The Great Shield Sunscreen SPF 50', 'AVO-MST-014', '8991199301364', 'Physical sunscreen with centella', 
   (SELECT id FROM product_categories WHERE name = 'Sun Protection' LIMIT 1), 'Avoskin', 135000, 90000, 11, true, 'Active', 'Good', 'tube', 35, 350, 70, true, 730, 'Room Temperature', true, 'Sunscreen', ARRAY['Sensitive', 'Dry'], ARRAY['Zinc Oxide', 'Centella Asiatica'], 'Apply liberally, reapply every 2 hours', 'Indonesia'),
  
  ('Hadalabo Gokujyun Premium Lotion', 'HAD-MST-015', '8991199301371', 'Super hydrating lotion with 5 types HA', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Hadalabo', 135000, 95000, 11, true, 'Active', 'Good', 'bottle', 40, 400, 80, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Dry', 'Normal'], ARRAY['5 Types Hyaluronic Acid'], 'Pat onto damp skin after cleansing', 'Japan'),
  
  ('Cetaphil Moisturizing Cream', 'CET-MST-016', '8991199301388', 'Rich cream for very dry skin', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Cetaphil', 165000, 115000, 11, true, 'Active', 'Good', 'jar', 30, 300, 60, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Dry', 'Very Dry'], ARRAY['Glycerin', 'Shea Butter'], 'Apply to face and body as needed', 'USA'),
  
  ('Skintific 5X Ceramide Barrier Repair Moisturizer Gel', 'SKT-MST-017', '8991199301395', 'Gel moisturizer with ceramide complex', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Skintific', 110000, 75000, 11, true, 'Active', 'Good', 'jar', 45, 450, 90, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Sensitive', 'Dry'], ARRAY['5X Ceramide', 'Hyaluronic Acid'], 'Apply after serum, morning and night', 'Indonesia'),
  
  ('NPURE Centella Asiatica Calming Moisturizer', 'NPU-MST-018', '8991199301401', 'Soothing gel cream with cica', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'NPURE', 68000, 45000, 11, true, 'Active', 'Good', 'jar', 55, 550, 110, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Sensitive', 'Acne-Prone'], ARRAY['Centella Asiatica', 'Madecassoside'], 'Apply to cleansed face twice daily', 'Indonesia'),
  
  ('La Roche-Posay Effaclar Mat Moisturizer', 'LRP-MST-019', '8991199301418', 'Mattifying moisturizer for oily skin', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'La Roche-Posay', 225000, 155000, 11, true, 'Active', 'Good', 'tube', 25, 250, 50, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['Oily', 'Combination'], ARRAY['Sebulyse', 'Thermal Spring Water'], 'Apply to face after cleansing', 'France'),
  
  ('Dear Me Beauty Glowing One Moisturizer', 'DRM-MST-020', '8991199301425', 'Brightening moisturizer with glow effect', 
   (SELECT id FROM product_categories WHERE name = 'Moisturizers' LIMIT 1), 'Dear Me Beauty', 89000, 60000, 11, true, 'Active', 'Good', 'jar', 50, 500, 100, true, 730, 'Room Temperature', true, 'Moisturizer', ARRAY['All Skin Types'], ARRAY['Niacinamide', 'Licorice Extract'], 'Use morning and night for radiant skin', 'Indonesia'),

  -- Serums & Essences (15 items)
  ('Somethinc Niacinamide + Moisture Beet Serum', 'SMT-SER-021', '8991199301432', '10% niacinamide brightening serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Somethinc', 125000, 85000, 11, true, 'Active', 'Good', 'dropper', 40, 400, 80, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['All Skin Types'], ARRAY['10% Niacinamide', 'Red Beet Extract'], 'Apply 3-4 drops to face after toner', 'Indonesia'),
  
  ('Avoskin Your Skin Bae Retinol 1%', 'AVO-SER-022', '8991199301449', 'Anti-aging retinol serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Avoskin', 189000, 130000, 11, true, 'Active', 'Good', 'dropper', 30, 300, 60, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Normal', 'Dry'], ARRAY['1% Retinol', 'Vitamin E'], 'Use at night only, start 2x weekly', 'Indonesia'),
  
  ('Skintific 10% Niacinamide Brightening Glow Serum', 'SKT-SER-023', '8991199301456', 'High concentration niacinamide', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Skintific', 135000, 95000, 11, true, 'Active', 'Good', 'dropper', 45, 450, 90, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Oily', 'Combination'], ARRAY['10% Niacinamide', 'Alpha Arbutin'], 'Apply 2-3 drops morning and night', 'Indonesia'),
  
  ('NPURE Cica Beauty Miracle Serum', 'NPU-SER-024', '8991199301463', 'Calming cica serum for sensitive skin', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'NPURE', 95000, 65000, 11, true, 'Active', 'Good', 'dropper', 50, 500, 100, true, 730, 'Room Temperature', true, 'Serum', ARRAY['Sensitive', 'Acne-Prone'], ARRAY['Centella Asiatica', 'Tea Tree'], 'Apply to troubled areas or entire face', 'Indonesia'),
  
  ('Wardah C-Defense Vitamin C Serum', 'WRD-SER-025', '8991199301470', 'Brightening vitamin C serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Wardah', 65000, 45000, 11, true, 'Active', 'Good', 'dropper', 60, 600, 120, true, 365, 'Cool (<25°C)', true, 'Serum', ARRAY['All Skin Types'], ARRAY['Vitamin C', 'Vitamin E'], 'Use morning after cleansing', 'Indonesia'),
  
  ('The Ordinary Niacinamide 10% + Zinc 1%', 'ORD-SER-026', '8991199301487', 'Oil control and pore refining serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'The Ordinary', 115000, 80000, 11, true, 'Active', 'Good', 'dropper', 40, 400, 80, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Oily', 'Acne-Prone'], ARRAY['Niacinamide', 'Zinc PCA'], 'Apply before heavier creams', 'Canada'),
  
  ('The Ordinary Hyaluronic Acid 2% + B5', 'ORD-SER-027', '8991199301494', 'Deep hydration serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'The Ordinary', 95000, 65000, 11, true, 'Active', 'Good', 'dropper', 45, 450, 90, true, 730, 'Room Temperature', true, 'Serum', ARRAY['Dry', 'Dehydrated'], ARRAY['Hyaluronic Acid', 'Vitamin B5'], 'Apply to damp skin for best results', 'Canada'),
  
  ('Glad2Glow Alpha Arbutin Serum', 'GLD-SER-028', '8991199301500', 'Dark spot correcting serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Glad2Glow', 72000, 48000, 11, true, 'Active', 'Good', 'dropper', 50, 500, 100, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['All Skin Types'], ARRAY['Alpha Arbutin', 'Niacinamide'], 'Use twice daily for best results', 'Indonesia'),
  
  ('Emina Brightstuff Essence', 'EMI-SER-029', '8991199301517', 'Lightweight brightening essence', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Emina', 45000, 30000, 11, true, 'Active', 'Good', 'bottle', 65, 650, 130, true, 730, 'Room Temperature', true, 'Essence', ARRAY['Normal', 'Oily'], ARRAY['Niacinamide', 'Licorice'], 'Pat onto skin after toner', 'Indonesia'),
  
  ('Hadalabo Shirojyun Premium Whitening Essence', 'HAD-SER-030', '8991199301524', 'Japanese brightening essence', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Hadalabo', 165000, 115000, 11, true, 'Active', 'Good', 'bottle', 35, 350, 70, true, 730, 'Cool (<25°C)', true, 'Essence', ARRAY['All Skin Types'], ARRAY['Tranexamic Acid', 'Hyaluronic Acid'], 'Apply after cleansing, before moisturizer', 'Japan'),
  
  ('Azarine Hydramax C Serum', 'AZR-SER-031', '8991199301531', 'Hydrating vitamin C serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Azarine', 58000, 38000, 11, true, 'Active', 'Good', 'dropper', 55, 550, 110, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Dry', 'Normal'], ARRAY['Vitamin C', 'Hyaluronic Acid'], 'Use in morning routine', 'Indonesia'),
  
  ('Scarlett Whitening Serum', 'SCA-SER-032', '8991199301548', 'Brightening facial serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Scarlett', 75000, 50000, 11, true, 'Active', 'Good', 'dropper', 60, 600, 120, true, 730, 'Room Temperature', true, 'Serum', ARRAY['All Skin Types'], ARRAY['Glutathione', 'Vitamin E'], 'Apply 2-3 drops to clean face', 'Indonesia'),
  
  ('Base Pore Minimizer Serum', 'BAS-SER-033', '8991199301555', 'Pore refining treatment serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Base', 89000, 60000, 11, true, 'Active', 'Good', 'dropper', 45, 450, 90, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Oily', 'Combination'], ARRAY['Niacinamide', 'Witch Hazel'], 'Focus on T-zone and pores', 'Indonesia'),
  
  ('Dear Me Beauty Skin Barrier Serum', 'DRM-SER-034', '8991199301562', 'Barrier repair serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Dear Me Beauty', 105000, 70000, 11, true, 'Active', 'Good', 'dropper', 40, 400, 80, true, 730, 'Room Temperature', true, 'Serum', ARRAY['Sensitive', 'Dry'], ARRAY['Ceramide', 'Peptides'], 'Apply morning and night', 'Indonesia'),
  
  ('Y.O.U Glowing Glow Triple Bright Serum', 'YOU-SER-035', '8991199301579', 'Triple action brightening serum', 
   (SELECT id FROM product_categories WHERE name = 'Serums & Essences' LIMIT 1), 'Y.O.U', 69000, 45000, 11, true, 'Active', 'Good', 'dropper', 50, 500, 100, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['All Skin Types'], ARRAY['Vitamin C', 'Licorice', 'Niacinamide'], 'Use consistently for radiant skin', 'Indonesia'),

  -- Acne Treatment (8 items)
  ('Erha Acne Care Lab Face Serum', 'ERH-ACN-036', '8991199301586', 'Clinical acne treatment serum', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Erha', 145000, 100000, 11, true, 'Active', 'Good', 'dropper', 35, 350, 70, true, 730, 'Cool (<25°C)', true, 'Acne Treatment', ARRAY['Oily', 'Acne-Prone'], ARRAY['Salicylic Acid', 'Niacinamide'], 'Apply to acne-prone areas', 'Indonesia'),
  
  ('Acnes Sealing Jell', 'ACN-ACN-037', '8991199301593', 'Spot treatment gel for pimples', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Acnes', 28000, 18000, 11, true, 'Active', 'Good', 'tube', 70, 700, 140, true, 730, 'Room Temperature', true, 'Acne Treatment', ARRAY['Acne-Prone'], ARRAY['Isopropyl Methylphenol', 'Vitamin E'], 'Apply directly to pimples', 'Japan'),
  
  ('Himalaya Herbals Purifying Neem Face Wash', 'HIM-ACN-038', '8991199301609', 'Natural acne cleanser with neem', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Himalaya', 35000, 23000, 11, true, 'Active', 'Good', 'tube', 60, 600, 120, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Acne-Prone'], ARRAY['Neem', 'Turmeric'], 'Use twice daily for clear skin', 'India'),
  
  ('Paula''s Choice 2% BHA Liquid Exfoliant', 'PAU-ACN-039', '8991199301616', 'Clinical strength BHA treatment', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Paula''s Choice', 385000, 265000, 11, true, 'Active', 'Good', 'bottle', 20, 200, 40, true, 730, 'Cool (<25°C)', true, 'Exfoliant', ARRAY['Oily', 'Acne-Prone'], ARRAY['2% BHA', 'Green Tea'], 'Apply with cotton pad after cleansing', 'USA'),
  
  ('Azarine Acne Gentle Cleansing Foam', 'AZR-ACN-040', '8991199301623', 'Gentle foaming cleanser for acne', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Azarine', 42000, 28000, 11, true, 'Active', 'Good', 'tube', 55, 550, 110, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Acne-Prone'], ARRAY['Tea Tree Oil', 'Salicylic Acid'], 'Lather and massage gently', 'Indonesia'),
  
  ('Cetaphil Pro Oil Removing Foam Wash', 'CET-ACN-041', '8991199301630', 'Oil control foam wash', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Cetaphil', 145000, 100000, 11, true, 'Active', 'Good', 'pump', 35, 350, 70, true, 730, 'Room Temperature', true, 'Cleanser', ARRAY['Oily', 'Acne-Prone'], ARRAY['Zinc Technology', 'Aloe Vera'], 'Use morning and night', 'USA'),
  
  ('Somebymi AHA BHA PHA 30 Days Miracle Serum', 'SMY-ACN-042', '8991199301647', 'Korean triple acid acne serum', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'Somebymi', 165000, 115000, 11, true, 'Active', 'Good', 'dropper', 30, 300, 60, true, 730, 'Cool (<25°C)', true, 'Serum', ARRAY['Oily', 'Acne-Prone'], ARRAY['AHA', 'BHA', 'PHA', 'Tea Tree'], 'Use daily for 30-day challenge', 'South Korea'),
  
  ('The Body Shop Tea Tree Oil', 'TBS-ACN-043', '8991199301654', 'Pure tea tree essential oil', 
   (SELECT id FROM product_categories WHERE name = 'Acne Treatment' LIMIT 1), 'The Body Shop', 125000, 85000, 11, true, 'Active', 'Good', 'dropper', 25, 250, 50, true, 1095, 'Cool (<25°C)', true, 'Spot Treatment', ARRAY['Acne-Prone'], ARRAY['Tea Tree Essential Oil'], 'Apply to blemishes with cotton swab', 'UK'),

  -- Masks (7 items)
  ('Wardah Hydrating Sheet Mask', 'WRD-MSK-044', '8991199301661', 'Intensive hydrating sheet mask', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Wardah', 15000, 10000, 11, true, 'Active', 'Good', 'sachet', 100, 1000, 200, true, 730, 'Room Temperature', true, 'Sheet Mask', ARRAY['All Skin Types'], ARRAY['Aloe Vera', 'Vitamin E'], 'Apply for 15-20 minutes', 'Indonesia'),
  
  ('Mediheal N.M.F Aquaring Ampoule Mask', 'MED-MSK-045', '8991199301678', 'Korean hydrating ampoule mask', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Mediheal', 22000, 15000, 11, true, 'Active', 'Good', 'sachet', 120, 1200, 240, true, 730, 'Room Temperature', true, 'Sheet Mask', ARRAY['Dry', 'Normal'], ARRAY['Hyaluronic Acid', 'Ceramide'], 'Leave on for 20 minutes, pat excess', 'South Korea'),
  
  ('Skintific Cover All Perfect Cushion Foundation', 'SKT-MSK-046', '8991199301685', 'Clay mask for deep cleansing', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Skintific', 89000, 60000, 11, true, 'Active', 'Good', 'jar', 40, 400, 80, true, 730, 'Room Temperature', true, 'Clay Mask', ARRAY['Oily', 'Combination'], ARRAY['Kaolin Clay', 'Charcoal'], 'Apply, leave 10 min, rinse thoroughly', 'Indonesia'),
  
  ('Innisfree My Real Squeeze Mask', 'INN-MSK-047', '8991199301692', 'Natural ingredient sheet mask variety', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Innisfree', 18000, 12000, 11, true, 'Active', 'Good', 'sachet', 150, 1500, 300, true, 730, 'Room Temperature', true, 'Sheet Mask', ARRAY['All Skin Types'], ARRAY['Natural Extracts'], 'Choose formula based on skin need', 'South Korea'),
  
  ('Emina Sheet Mask Green Tea', 'EMI-MSK-048', '8991199301708', 'Refreshing green tea sheet mask', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Emina', 12000, 8000, 11, true, 'Active', 'Good', 'sachet', 180, 1800, 360, true, 730, 'Room Temperature', true, 'Sheet Mask', ARRAY['Oily', 'Combination'], ARRAY['Green Tea Extract'], 'Use 2-3 times weekly', 'Indonesia'),
  
  ('Avoskin Miraculous Refining Toner', 'AVO-MSK-049', '8991199301715', 'AHA BHA exfoliating toner', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Avoskin', 125000, 85000, 11, true, 'Active', 'Good', 'bottle', 35, 350, 70, true, 730, 'Cool (<25°C)', true, 'Exfoliating Toner', ARRAY['Oily', 'Acne-Prone'], ARRAY['AHA', 'BHA', 'Niacinamide'], 'Use as toner or mask (soak cotton)', 'Indonesia'),
  
  ('Dear Me Beauty Skin Barrier Sleeping Mask', 'DRM-MSK-050', '8991199301722', 'Overnight repair sleeping mask', 
   (SELECT id FROM product_categories WHERE name = 'Masks' LIMIT 1), 'Dear Me Beauty', 95000, 65000, 11, true, 'Active', 'Good', 'jar', 40, 400, 80, true, 730, 'Room Temperature', true, 'Sleeping Mask', ARRAY['Dry', 'Sensitive'], ARRAY['Ceramide', 'Peptides'], 'Apply before bed, rinse in morning', 'Indonesia')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. INVENTORY SETUP FOR PRODUCTS
-- ============================================================================

-- Add inventory for all products at Jakarta Grand Indonesia warehouse (ID 1)
-- Assuming warehouse ID 1 exists from previous migration
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
  1 as warehouse_id, -- Jakarta GI warehouse
  CASE 
    WHEN p.product_type = 'Good' THEN (100 + (RANDOM() * 400)::INT) -- Random stock between 100-500
    ELSE 0
  END as quantity_on_hand,
  0 as quantity_reserved,
  CASE 
    WHEN p.product_type = 'Good' THEN (100 + (RANDOM() * 400)::INT)
    ELSE 0
  END as quantity_available,
  p.cost_price as unit_cost,
  CASE 
    WHEN p.product_type = 'Good' THEN p.cost_price * (100 + (RANDOM() * 400)::INT)
    ELSE 0
  END as total_value,
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
-- 4. SAMPLE CUSTOMERS (20 Indonesian Customers)
-- ============================================================================

INSERT INTO customers (
  customer_type,
  company_name,
  contact_person,
  phone,
  email,
  membership_number,
  membership_tier_id,
  loyalty_points,
  loyalty_points_earned_total,
  loyalty_points_redeemed_total,
  lifetime_purchase_value,
  last_purchase_date,
  total_transactions,
  average_transaction_value,
  preferred_payment_method,
  status,
  billing_address,
  billing_city,
  billing_state,
  billing_country,
  billing_postal_code,
  created_at,
  updated_at
) VALUES 
  -- VIP Customers (Platinum/Titanium Tier)
  ('Individual', NULL, 'Siti Nurhaliza', '+62-812-3456-7890', 'siti.nurhaliza@gmail.com', 'MEM-2024-0001', 
   (SELECT id FROM membership_tiers WHERE tier_name = 'Platinum' LIMIT 1), 15000, 75000, 60000, 85000000, '2024-11-01', 42, 2023809, 'Card', 'Active', 
   'Jl. Sudirman Kav. 52-53', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12190'),
   
  ('Individual', NULL, 'Raisa Andriana', '+62-813-9876-5432', 'raisa.andriana@yahoo.com', 'MEM-2024-0002',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Titanium' LIMIT 1), 45000, 180000, 135000, 125000000, '2024-11-05', 68, 1838235, 'Card', 'Active',
   'Jl. MH Thamrin No. 1', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10310'),
   
  ('Individual', NULL, 'Dian Sastrowardoyo', '+62-815-2468-1357', 'dian.sastro@gmail.com', 'MEM-2024-0003',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Platinum' LIMIT 1), 12500, 68000, 55500, 72000000, '2024-10-28', 38, 1894736, 'QRIS', 'Active',
   'Jl. Gatot Subroto Kav. 18', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12710'),

  -- Gold Tier Customers
  ('Individual', NULL, 'Anya Geraldine', '+62-821-5555-1234', 'anya.geraldine@gmail.com', 'MEM-2024-0004',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 8200, 42000, 33800, 28000000, '2024-11-08', 24, 1166666, 'GoPay', 'Active',
   'Jl. Kemang Raya No. 8', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12730'),
   
  ('Individual', NULL, 'Nagita Slavina', '+62-822-7777-9999', 'gigi.rafathar@gmail.com', 'MEM-2024-0005',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 9500, 48000, 38500, 32000000, '2024-11-10', 28, 1142857, 'Card', 'Active',
   'Jl. Radio Dalam Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12140'),
   
  ('Individual', NULL, 'Luna Maya', '+62-823-4444-8888', 'lunamaya@outlook.com', 'MEM-2024-0006',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Gold' LIMIT 1), 7800, 39000, 31200, 26000000, '2024-11-03', 22, 1181818, 'OVO', 'Active',
   'Jl. Senopati No. 15', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12190'),

  -- Silver Tier Customers
  ('Individual', NULL, 'Ayu Ting Ting', '+62-831-2222-3333', 'ayutingting@gmail.com', 'MEM-2024-0007',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 3500, 18000, 14500, 12000000, '2024-11-09', 15, 800000, 'DANA', 'Active',
   'Jl. Pancoran Barat', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12780'),
   
  ('Individual', NULL, 'Maudy Ayunda', '+62-832-6666-7777', 'maudy.ayunda@gmail.com', 'MEM-2024-0008',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 4200, 21000, 16800, 14000000, '2024-11-07', 18, 777777, 'Card', 'Active',
   'Jl. Puri Indah Raya', 'Jakarta Barat', 'DKI Jakarta', 'Indonesia', '11610'),
   
  ('Individual', NULL, 'Chelsea Islan', '+62-833-9999-1111', 'chelsea.islan@yahoo.com', 'MEM-2024-0009',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 3800, 19000, 15200, 13000000, '2024-11-06', 16, 812500, 'QRIS', 'Active',
   'Jl. Tebet Barat Dalam', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12810'),
   
  ('Individual', NULL, 'Cinta Laura', '+62-834-5555-6666', 'cintalaura@gmail.com', 'MEM-2024-0010',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Silver' LIMIT 1), 4500, 22500, 18000, 15000000, '2024-11-11', 19, 789473, 'GoPay', 'Active',
   'Jl. Pondok Indah Mall 1', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12310'),

  -- Bronze Tier Customers (Regular Customers)
  ('Individual', NULL, 'Tara Basro', '+62-841-1111-2222', 'tara.basro@gmail.com', 'MEM-2024-0011',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 850, 4250, 3400, 3000000, '2024-11-04', 8, 375000, 'Cash', 'Active',
   'Jl. Cikini Raya No. 25', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10330'),
   
  ('Individual', NULL, 'Pevita Pearce', '+62-842-3333-4444', 'pevita.pearce@gmail.com', 'MEM-2024-0012',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 920, 4600, 3680, 3500000, '2024-11-02', 9, 388888, 'DANA', 'Active',
   'Jl. Menteng Raya', 'Jakarta Pusat', 'DKI Jakarta', 'Indonesia', '10340'),
   
  ('Individual', NULL, 'Marsha Timothy', '+62-843-5555-6666', 'marsha.timothy@outlook.com', 'MEM-2024-0013',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 780, 3900, 3120, 2800000, '2024-10-30', 7, 400000, 'OVO', 'Active',
   'Jl. Casablanca Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12870'),
   
  ('Individual', NULL, 'Hannah Al Rashid', '+62-844-7777-8888', 'hannah.alrashid@gmail.com', 'MEM-2024-0014',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 650, 3250, 2600, 2500000, '2024-10-25', 6, 416666, 'Card', 'Active',
   'Jl. Kuningan Barat', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12710'),
   
  ('Individual', NULL, 'Raihaanun', '+62-845-9999-0000', 'raihaanun@gmail.com', 'MEM-2024-0015',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 1100, 5500, 4400, 4000000, '2024-11-12', 10, 400000, 'GoPay', 'Active',
   'Jl. Pasar Minggu Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12780'),
   
  ('Individual', NULL, 'Adinia Wirasti', '+62-846-1234-5678', 'adinia.wirasti@yahoo.com', 'MEM-2024-0016',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 720, 3600, 2880, 2700000, '2024-10-29', 7, 385714, 'QRIS', 'Active',
   'Jl. Fatmawati Raya', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12420'),
   
  ('Individual', NULL, 'Tatjana Saphira', '+62-847-9876-5432', 'tatjana.saphira@gmail.com', 'MEM-2024-0017',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 980, 4900, 3920, 3800000, '2024-11-01', 9, 422222, 'Cash', 'Active',
   'Jl. Cilandak KKO', 'Jakarta Selatan', 'DKI Jakarta', 'Indonesia', '12560'),
   
  ('Individual', NULL, 'Laura Basuki', '+62-848-5555-4444', 'laura.basuki@gmail.com', 'MEM-2024-0018',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 560, 2800, 2240, 2000000, '2024-10-20', 5, 400000, 'DANA', 'Active',
   'Jl. Ciputat Raya', 'Tangerang Selatan', 'Banten', 'Indonesia', '15412'),
   
  ('Individual', NULL, 'Acha Septriasa', '+62-849-3333-2222', 'acha.septriasa@outlook.com', 'MEM-2024-0019',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 1250, 6250, 5000, 4500000, '2024-11-11', 11, 409090, 'Card', 'Active',
   'Jl. BSD Green Office', 'Tangerang Selatan', 'Banten', 'Indonesia', '15345'),
   
  ('Individual', NULL, 'Nirina Zubir', '+62-850-7777-6666', 'nirina.zubir@gmail.com', 'MEM-2024-0020',
   (SELECT id FROM membership_tiers WHERE tier_name = 'Bronze' LIMIT 1), 890, 4450, 3560, 3200000, '2024-11-08', 8, 400000, 'GoPay', 'Active',
   'Jl. Bintaro Jaya Sektor 7', 'Tangerang Selatan', 'Banten', 'Indonesia', '15224')
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check products count
SELECT 
  'Products Created' as metric,
  COUNT(*) as count 
FROM products 
WHERE sku LIKE 'WRD-%' OR sku LIKE 'EMI-%' OR sku LIKE 'SMT-%';

-- Check inventory count
SELECT 
  'Inventory Records' as metric,
  COUNT(*) as count 
FROM inventory 
WHERE warehouse_id = 1;

-- Check customers count
SELECT 
  'Customers Created' as metric,
  COUNT(*) as count 
FROM customers 
WHERE membership_number LIKE 'MEM-2024-%';

-- Check customers by tier
SELECT 
  mt.tier_name,
  COUNT(c.id) as customer_count,
  SUM(c.lifetime_purchase_value) as total_lifetime_value
FROM customers c
JOIN membership_tiers mt ON c.membership_tier_id = mt.id
WHERE c.membership_number LIKE 'MEM-2024-%'
GROUP BY mt.tier_name
ORDER BY mt.tier_name;

-- ============================================================================
-- END OF SEED SCRIPT
-- ============================================================================
