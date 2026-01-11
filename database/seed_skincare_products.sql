-- Skincare Product Sample Data
-- Generated: December 9, 2025
-- Purpose: Populate database with realistic skincare products

BEGIN;

-- =====================================================
-- STEP 1: Create Skincare Product Categories
-- =====================================================

-- Clear existing skincare categories if any
DELETE FROM product_categories WHERE name IN (
  'Skincare', 'Cleansers', 'Toners', 'Serums & Treatments', 
  'Moisturizers', 'Eye Care', 'Masks', 'Sunscreen', 'Exfoliators'
);

-- Create parent category
INSERT INTO product_categories (id, name, description, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Skincare', 'Skincare and beauty products', true);

-- Create subcategories
INSERT INTO product_categories (id, name, description, parent_id, is_active) VALUES
('22222222-2222-2222-2222-222222222222', 'Cleansers', 'Facial cleansers and makeup removers', '11111111-1111-1111-1111-111111111111', true),
('33333333-3333-3333-3333-333333333333', 'Toners', 'Facial toners and essences', '11111111-1111-1111-1111-111111111111', true),
('44444444-4444-4444-4444-444444444444', 'Serums & Treatments', 'Concentrated treatments and serums', '11111111-1111-1111-1111-111111111111', true),
('55555555-5555-5555-5555-555555555555', 'Moisturizers', 'Face moisturizers and creams', '11111111-1111-1111-1111-111111111111', true),
('66666666-6666-6666-6666-666666666666', 'Eye Care', 'Eye creams and treatments', '11111111-1111-1111-1111-111111111111', true),
('77777777-7777-7777-7777-777777777777', 'Masks', 'Face masks and treatments', '11111111-1111-1111-1111-111111111111', true),
('88888888-8888-8888-8888-888888888888', 'Sunscreen', 'Sun protection products', '11111111-1111-1111-1111-111111111111', true),
('99999999-9999-9999-9999-999999999999', 'Exfoliators', 'Physical and chemical exfoliants', '11111111-1111-1111-1111-111111111111', true);

-- =====================================================
-- STEP 2: Insert Skincare Products
-- =====================================================

-- CLEANSERS
INSERT INTO products (
  sku, name, description, category_id, unit_price, cost_price,
  brand, product_line, size, 
  ingredients, skin_type_suitable, concerns_addressed,
  current_stock, min_stock_level, max_stock_level,
  requires_batch_tracking, shelf_life_days, pao_months,
  is_vegan, is_cruelty_free, is_active
) VALUES
-- Gentle Cream Cleanser
('SKIN-CLN-001', 'Gentle Cream Cleanser', 
'Luxurious cream cleanser that removes makeup and impurities while maintaining skin moisture barrier. Suitable for sensitive and dry skin types.',
'22222222-2222-2222-2222-222222222222', 289000, 145000,
'Derma Glow', 'Essential Care', '150ml',
ARRAY['Water', 'Glycerin', 'Cetyl Alcohol', 'Stearic Acid', 'Niacinamide', 'Allantoin', 'Chamomile Extract'],
ARRAY['Dry', 'Sensitive', 'Normal'],
ARRAY['Dryness', 'Sensitivity', 'Redness'],
50, 10, 100,
true, 730, 12,
true, true, true),

-- Foaming Gel Cleanser
('SKIN-CLN-002', 'Deep Clean Foaming Gel',
'Deep cleansing gel that removes excess oil and unclogs pores. Perfect for oily and combination skin.',
'22222222-2222-2222-2222-222222222222', 249000, 125000,
'Pure Skin', 'Clear Solutions', '200ml',
ARRAY['Water', 'Sodium Cocoyl Glycinate', 'Salicylic Acid', 'Tea Tree Oil', 'Zinc PCA', 'Aloe Vera'],
ARRAY['Oily', 'Combination', 'Acne-Prone'],
ARRAY['Acne', 'Excess Oil', 'Large Pores'],
75, 15, 150,
true, 730, 12,
false, true, true),

-- Micellar Water
('SKIN-CLN-003', 'Micellar Cleansing Water',
'All-in-one no-rinse cleanser that removes makeup, cleanses, and tones. Perfect for all skin types.',
'22222222-2222-2222-2222-222222222222', 199000, 100000,
'Clear Beauty', 'Gentle Care', '400ml',
ARRAY['Water', 'Poloxamer 184', 'Glycerin', 'Rose Water', 'Witch Hazel', 'Vitamin B5'],
ARRAY['All Skin Types'],
ARRAY['Makeup Removal', 'Daily Cleansing'],
100, 20, 200,
false, 730, 12,
true, true, true),

-- Oil Cleanser
('SKIN-CLN-004', 'Cleansing Oil',
'Lightweight oil cleanser that melts away makeup and sunscreen. Emulsifies with water for easy rinsing.',
'22222222-2222-2222-2222-222222222222', 325000, 163000,
'Glow Lab', 'Double Cleanse', '180ml',
ARRAY['Caprylic/Capric Triglyceride', 'Jojoba Oil', 'Sweet Almond Oil', 'Vitamin E', 'Rosehip Oil'],
ARRAY['All Skin Types', 'Dry', 'Normal'],
ARRAY['Makeup Removal', 'Dullness'],
45, 10, 90,
true, 540, 9,
true, true, true),

-- TONERS
('SKIN-TON-001', 'Hydrating Essence Toner',
'Deeply hydrating essence that preps skin for better absorption of skincare. Contains hyaluronic acid.',
'33333333-3333-3333-3333-333333333333', 279000, 140000,
'Hydra Plus', 'Moisture Boost', '200ml',
ARRAY['Water', 'Hyaluronic Acid', 'Glycerin', 'Niacinamide', 'Panthenol', 'Beta-Glucan'],
ARRAY['Dry', 'Normal', 'Dehydrated'],
ARRAY['Dehydration', 'Fine Lines', 'Dullness'],
60, 15, 120,
true, 730, 12,
true, true, true),

-- BHA Toner
('SKIN-TON-002', 'BHA Exfoliating Toner',
'Chemical exfoliating toner with salicylic acid to unclog pores and reduce breakouts.',
'33333333-3333-3333-3333-333333333333', 299000, 150000,
'Clear Skin Co', 'Acne Solutions', '150ml',
ARRAY['Water', 'Salicylic Acid 2%', 'Witch Hazel', 'Niacinamide', 'Green Tea Extract'],
ARRAY['Oily', 'Combination', 'Acne-Prone'],
ARRAY['Acne', 'Blackheads', 'Large Pores', 'Texture'],
40, 10, 80,
true, 730, 12,
false, true, true),

-- Soothing Toner
('SKIN-TON-003', 'Centella Soothing Toner',
'Calming toner with centella asiatica to reduce redness and irritation.',
'33333333-3333-3333-3333-333333333333', 265000, 133000,
'Calm Botanics', 'Sensitive Care', '250ml',
ARRAY['Centella Asiatica Extract', 'Madecassoside', 'Panthenol', 'Allantoin', 'Green Tea'],
ARRAY['Sensitive', 'Combination', 'Normal'],
ARRAY['Sensitivity', 'Redness', 'Irritation'],
55, 12, 110,
true, 730, 12,
true, true, true),

-- SERUMS & TREATMENTS
('SKIN-SER-001', 'Vitamin C Brightening Serum',
'Potent vitamin C serum to brighten skin tone and fade dark spots. Contains 15% L-Ascorbic Acid.',
'44444444-4444-4444-4444-444444444444', 485000, 243000,
'Radiant Skin', 'Glow Series', '30ml',
ARRAY['Water', 'L-Ascorbic Acid 15%', 'Vitamin E', 'Ferulic Acid', 'Hyaluronic Acid'],
ARRAY['All Skin Types', 'Normal', 'Dry'],
ARRAY['Dark Spots', 'Dullness', 'Uneven Tone', 'Aging'],
35, 8, 70,
true, 365, 6,
true, true, true),

-- Niacinamide Serum
('SKIN-SER-002', '10% Niacinamide + Zinc Serum',
'High-strength niacinamide to reduce pores, control oil, and improve skin texture.',
'44444444-4444-4444-4444-444444444444', 349000, 175000,
'The Ordinary Plus', 'Clinical Formulas', '30ml',
ARRAY['Water', 'Niacinamide 10%', 'Zinc PCA 1%', 'Tamarind Extract', 'Hyaluronic Acid'],
ARRAY['Oily', 'Combination', 'Acne-Prone'],
ARRAY['Large Pores', 'Excess Oil', 'Uneven Texture', 'Blemishes'],
65, 15, 130,
true, 730, 12,
true, true, true),

-- Retinol Serum
('SKIN-SER-003', 'Advanced Retinol 0.5% Serum',
'Anti-aging retinol serum to reduce wrinkles and improve skin texture. Start slowly for beginners.',
'44444444-4444-4444-4444-444444444444', 525000, 263000,
'Youth Restore', 'Age Defense', '30ml',
ARRAY['Water', 'Retinol 0.5%', 'Squalane', 'Vitamin E', 'Peptides', 'Ceramides'],
ARRAY['Normal', 'Dry', 'Combination'],
ARRAY['Fine Lines', 'Wrinkles', 'Aging', 'Texture'],
25, 5, 50,
true, 365, 6,
false, true, true),

-- Hyaluronic Acid Serum
('SKIN-SER-004', 'Triple Hyaluronic Acid Serum',
'Multi-molecular weight hyaluronic acid for deep and surface hydration.',
'44444444-4444-4444-4444-444444444444', 379000, 190000,
'Hydration Lab', 'Plump & Glow', '50ml',
ARRAY['Water', 'Sodium Hyaluronate', 'Hyaluronic Acid', 'Panthenol', 'Glycerin', 'Vitamin B5'],
ARRAY['All Skin Types', 'Dry', 'Dehydrated'],
ARRAY['Dehydration', 'Fine Lines', 'Dullness'],
70, 15, 140,
true, 730, 12,
true, true, true),

-- Peptide Serum
('SKIN-SER-005', 'Anti-Aging Peptide Complex',
'Advanced peptide formula to boost collagen and reduce signs of aging.',
'44444444-4444-4444-4444-444444444444', 595000, 298000,
'Pro Age', 'Ultimate Youth', '30ml',
ARRAY['Water', 'Matrixyl 3000', 'Argireline', 'Copper Peptides', 'Niacinamide', 'Adenosine'],
ARRAY['Mature', 'Normal', 'Dry'],
ARRAY['Wrinkles', 'Fine Lines', 'Loss of Firmness', 'Aging'],
20, 5, 40,
true, 730, 12,
false, true, true),

-- MOISTURIZERS
('SKIN-MOI-001', 'Ultra Hydrating Gel Cream',
'Lightweight gel-cream that provides 72-hour hydration without heaviness.',
'55555555-5555-5555-5555-555555555555', 329000, 165000,
'Aqua Boost', 'Hydration Plus', '50ml',
ARRAY['Water', 'Glycerin', 'Hyaluronic Acid', 'Squalane', 'Ceramides', 'Vitamin E'],
ARRAY['Normal', 'Combination', 'Oily'],
ARRAY['Dehydration', 'Dullness'],
80, 20, 160,
true, 730, 12,
true, true, true),

-- Rich Night Cream
('SKIN-MOI-002', 'Rich Repair Night Cream',
'Intensive overnight moisturizer that repairs and nourishes skin while you sleep.',
'55555555-5555-5555-5555-555555555555', 425000, 213000,
'Night Care', 'Deep Repair', '50ml',
ARRAY['Shea Butter', 'Ceramides', 'Peptides', 'Squalane', 'Vitamin E', 'Niacinamide'],
ARRAY['Dry', 'Mature', 'Normal'],
ARRAY['Dryness', 'Aging', 'Loss of Firmness'],
45, 10, 90,
true, 730, 12,
true, true, true),

-- Light Gel Moisturizer
('SKIN-MOI-003', 'Oil-Free Gel Moisturizer',
'Ultra-lightweight gel that hydrates without adding oil. Perfect for hot climates.',
'55555555-5555-5555-5555-555555555555', 279000, 140000,
'Fresh Face', 'Oil Control', '80ml',
ARRAY['Water', 'Glycerin', 'Hyaluronic Acid', 'Niacinamide', 'Aloe Vera', 'Green Tea'],
ARRAY['Oily', 'Combination', 'Acne-Prone'],
ARRAY['Excess Oil', 'Dehydration'],
90, 20, 180,
true, 730, 12,
true, true, true),

-- EYE CARE
('SKIN-EYE-001', 'Caffeine Eye Serum',
'Depuffing eye serum with caffeine to reduce dark circles and puffiness.',
'66666666-6666-6666-6666-666666666666', 289000, 145000,
'Bright Eyes', 'Wake Up', '15ml',
ARRAY['Water', 'Caffeine 5%', 'Niacinamide', 'Hyaluronic Acid', 'Peptides', 'Vitamin K'],
ARRAY['All Skin Types'],
ARRAY['Dark Circles', 'Puffiness', 'Tired Eyes'],
55, 12, 110,
true, 730, 12,
true, true, true),

-- Retinol Eye Cream
('SKIN-EYE-002', 'Retinol Eye Treatment',
'Gentle retinol formula for the delicate eye area to reduce fine lines.',
'66666666-6666-6666-6666-666666666666', 389000, 195000,
'Eye Youth', 'Age Reverse', '20ml',
ARRAY['Water', 'Retinol 0.1%', 'Peptides', 'Hyaluronic Acid', 'Ceramides', 'Vitamin E'],
ARRAY['Mature', 'Normal'],
ARRAY['Fine Lines', 'Wrinkles', 'Crow Feet'],
30, 8, 60,
true, 365, 6,
false, true, true),

-- MASKS
('SKIN-MSK-001', 'Clay Purifying Mask',
'Deep cleansing clay mask that draws out impurities and excess oil.',
'77777777-7777-7777-7777-777777777777', 245000, 123000,
'Pure Earth', 'Detox Collection', '100ml',
ARRAY['Kaolin Clay', 'Bentonite Clay', 'Charcoal', 'Tea Tree Oil', 'Witch Hazel'],
ARRAY['Oily', 'Combination', 'Acne-Prone'],
ARRAY['Excess Oil', 'Blackheads', 'Large Pores'],
60, 15, 120,
true, 730, 12,
true, true, true),

-- Sheet Mask
('SKIN-MSK-002', 'Hyaluronic Acid Sheet Mask (Box of 5)',
'Intensive hydrating sheet mask infused with hyaluronic acid essence.',
'77777777-7777-7777-7777-777777777777', 125000, 63000,
'Mask Lab', 'Sheet Collection', '5 sheets',
ARRAY['Water', 'Hyaluronic Acid', 'Glycerin', 'Niacinamide', 'Allantoin'],
ARRAY['All Skin Types'],
ARRAY['Dehydration', 'Dullness'],
150, 30, 300,
true, 730, 12,
true, true, true),

-- Overnight Mask
('SKIN-MSK-003', 'Sleeping Mask - Repair',
'Overnight mask that works while you sleep to repair and hydrate skin.',
'77777777-7777-7777-7777-777777777777', 349000, 175000,
'Night Glow', 'Sleep Beauty', '75ml',
ARRAY['Water', 'Ceramides', 'Peptides', 'Niacinamide', 'Hyaluronic Acid', 'Squalane'],
ARRAY['All Skin Types', 'Dry', 'Normal'],
ARRAY['Dryness', 'Dullness', 'Aging'],
40, 10, 80,
true, 730, 12,
true, true, true),

-- SUNSCREEN
('SKIN-SUN-001', 'SPF 50+ PA++++ Sunscreen',
'Broad spectrum sunscreen with high protection. Lightweight and non-greasy.',
'88888888-8888-8888-8888-888888888888', 189000, 95000,
'Sun Shield', 'Daily Defense', '50ml',
ARRAY['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Vitamin E', 'Aloe Vera'],
ARRAY['All Skin Types'],
ARRAY['Sun Protection', 'UV Damage'],
120, 30, 250,
false, 730, 12,
false, true, true),

-- Tinted Sunscreen
('SKIN-SUN-002', 'Tinted Sunscreen SPF 45',
'Tinted moisturizing sunscreen that evens skin tone while protecting.',
'88888888-8888-8888-8888-888888888888', 225000, 113000,
'Glow Protect', 'Beauty Shield', '40ml',
ARRAY['Zinc Oxide', 'Iron Oxides', 'Niacinamide', 'Hyaluronic Acid', 'Vitamin C'],
ARRAY['All Skin Types', 'Normal', 'Dry'],
ARRAY['Sun Protection', 'Uneven Tone'],
85, 20, 170,
false, 730, 12,
false, true, true),

-- EXFOLIATORS
('SKIN-EXF-001', 'AHA+BHA Exfoliating Solution',
'Weekly exfoliating treatment with glycolic and salicylic acid for smooth, radiant skin.',
'99999999-9999-9999-9999-999999999999', 295000, 148000,
'Glow Lab', 'Peel Collection', '30ml',
ARRAY['Water', 'Glycolic Acid 7%', 'Salicylic Acid 2%', 'Lactic Acid', 'Aloe Vera'],
ARRAY['Normal', 'Oily', 'Combination'],
ARRAY['Dullness', 'Texture', 'Blackheads', 'Fine Lines'],
45, 10, 90,
true, 730, 12,
false, true, true),

-- Gentle Scrub
('SKIN-EXF-002', 'Gentle Daily Exfoliator',
'Physical exfoliator with natural jojoba beads for daily gentle exfoliation.',
'99999999-9999-9999-9999-999999999999', 219000, 110000,
'Smooth Skin', 'Polish & Glow', '100ml',
ARRAY['Water', 'Jojoba Beads', 'Glycerin', 'Aloe Vera', 'Chamomile Extract', 'Vitamin E'],
ARRAY['All Skin Types', 'Normal', 'Dry'],
ARRAY['Dullness', 'Rough Texture'],
70, 15, 140,
true, 730, 12,
true, true, true);

-- =====================================================
-- STEP 3: Insert Product Sets/Kits
-- =====================================================

INSERT INTO products (
  sku, name, description, category_id, unit_price, cost_price,
  brand, product_line, size,
  ingredients, skin_type_suitable, concerns_addressed,
  current_stock, min_stock_level, max_stock_level,
  requires_batch_tracking, shelf_life_days, pao_months,
  is_vegan, is_cruelty_free, is_active
) VALUES
-- Starter Kit
('SKIN-KIT-001', 'Complete Skincare Starter Kit',
'Perfect starter set with cleanser, toner, serum, and moisturizer. Great value!',
'11111111-1111-1111-1111-111111111111', 995000, 498000,
'Derma Glow', 'Complete Care', 'Kit (4 items)',
ARRAY['See individual products'],
ARRAY['All Skin Types'],
ARRAY['Complete Skincare Routine'],
30, 5, 60,
false, 730, 12,
true, true, true),

-- Anti-Aging Kit
('SKIN-KIT-002', 'Anti-Aging Complete System',
'Advanced anti-aging regimen with retinol, peptides, and vitamin C.',
'11111111-1111-1111-1111-111111111111', 1795000, 898000,
'Pro Age', 'Ultimate Youth', 'Kit (5 items)',
ARRAY['See individual products'],
ARRAY['Mature', 'Normal'],
ARRAY['Aging', 'Wrinkles', 'Fine Lines', 'Loss of Firmness'],
15, 3, 30,
false, 365, 6,
false, true, true),

-- Acne Care Kit
('SKIN-KIT-003', 'Clear Skin Acne System',
'Complete acne-fighting system with BHA, niacinamide, and tea tree.',
'11111111-1111-1111-1111-111111111111', 1195000, 598000,
'Clear Skin Co', 'Acne Solutions', 'Kit (4 items)',
ARRAY['See individual products'],
ARRAY['Oily', 'Acne-Prone'],
ARRAY['Acne', 'Blackheads', 'Excess Oil', 'Large Pores'],
25, 5, 50,
false, 730, 12,
false, true, true);

-- =====================================================
-- STEP 4: Update Stock Levels with Realistic Variance
-- =====================================================

-- Add some variance to stock levels (simulate real inventory)
UPDATE products 
SET current_stock = current_stock + (RANDOM() * 20)::INTEGER - 10
WHERE category_id IN (
  SELECT id FROM product_categories WHERE parent_id = '11111111-1111-1111-1111-111111111111'
  UNION
  SELECT id FROM product_categories WHERE id = '11111111-1111-1111-1111-111111111111'
);

-- =====================================================
-- STEP 5: Create Sample Customer Reviews (Optional)
-- =====================================================

-- Note: If you have a reviews table, uncomment and adjust:
-- INSERT INTO product_reviews (product_id, customer_id, rating, comment) ...

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count products by category
SELECT 
  pc.name AS category,
  COUNT(p.id) AS product_count
FROM product_categories pc
LEFT JOIN products p ON p.category_id = pc.id
WHERE pc.parent_id = '11111111-1111-1111-1111-111111111111'
   OR pc.id = '11111111-1111-1111-1111-111111111111'
GROUP BY pc.name
ORDER BY pc.name;

-- Show sample products
SELECT 
  sku, 
  name, 
  brand,
  size,
  unit_price,
  current_stock
FROM products
WHERE category_id IN (
  SELECT id FROM product_categories WHERE parent_id = '11111111-1111-1111-1111-111111111111'
  UNION SELECT '11111111-1111-1111-1111-111111111111'
)
ORDER BY category_id, name
LIMIT 10;

-- Total inventory value
SELECT 
  SUM(current_stock * cost_price) AS total_cost_value,
  SUM(current_stock * unit_price) AS total_retail_value,
  SUM(current_stock * unit_price) - SUM(current_stock * cost_price) AS potential_profit
FROM products
WHERE category_id IN (
  SELECT id FROM product_categories WHERE parent_id = '11111111-1111-1111-1111-111111111111'
  UNION SELECT '11111111-1111-1111-1111-111111111111'
);

-- Summary
SELECT 
  '✅ Skincare categories created: ' || COUNT(DISTINCT pc.id) AS summary
FROM product_categories pc
WHERE pc.parent_id = '11111111-1111-1111-1111-111111111111'
   OR pc.id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT 
  '✅ Skincare products inserted: ' || COUNT(p.id)
FROM products p
WHERE p.category_id IN (
  SELECT id FROM product_categories WHERE parent_id = '11111111-1111-1111-1111-111111111111'
  UNION SELECT '11111111-1111-1111-1111-111111111111'
);
