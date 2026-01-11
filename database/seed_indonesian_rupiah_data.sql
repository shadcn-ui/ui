-- Indonesian Sample Data with Rupiah Currency
-- Date: 25 November 2025
-- This script creates realistic Indonesian business data with IDR pricing

-- Clean up existing sample data (optional)
-- DELETE FROM products WHERE sku LIKE 'ID-%';

-- Step 1: Update existing products to IDR
UPDATE products SET 
    currency = 'IDR',
    unit_price = ROUND(unit_price * 15500, -3),  -- Convert USD to IDR (~Rp 15,500/USD)
    cost_price = ROUND(cost_price * 15500, -3)
WHERE currency = 'USD';

-- Step 2: Create Indonesian Product Categories
INSERT INTO product_categories (name, description, is_active) VALUES
('Elektronik', 'Peralatan elektronik dan komputer', true),
('Furniture Kantor', 'Mebel dan perabotan kantor', true),
('Alat Tulis Kantor', 'Perlengkapan tulis dan kantor', true),
('Makanan & Minuman', 'Produk konsumsi', true),
('Kosmetik', 'Produk kecantikan dan perawatan', true)
ON CONFLICT (name) DO NOTHING;

-- Step 3: Create Indonesian Products with Rupiah Pricing

-- Electronics (Elektronik)
INSERT INTO products (sku, name, description, category_id, unit_price, cost_price, currency, unit_of_measure, reorder_level, status, tags) VALUES
('ID-LAP-001', 'Laptop ASUS VivoBook 14"', 'Laptop untuk bisnis dengan Intel Core i5, RAM 8GB, SSD 512GB', 
    (SELECT id FROM product_categories WHERE name = 'Elektronik' LIMIT 1), 
    7500000, 6000000, 'IDR', 'unit', 5, 'Active', ARRAY['elektronik', 'komputer', 'laptop']),
    
('ID-LAP-002', 'Laptop Lenovo ThinkPad 15"', 'Laptop profesional dengan Intel Core i7, RAM 16GB, SSD 1TB', 
    (SELECT id FROM product_categories WHERE name = 'Elektronik' LIMIT 1), 
    12500000, 10000000, 'IDR', 'unit', 3, 'Active', ARRAY['elektronik', 'komputer', 'laptop']),
    
('ID-MON-001', 'Monitor Samsung 24" Full HD', 'Monitor LED 24 inch untuk kantor', 
    (SELECT id FROM product_categories WHERE name = 'Elektronik' LIMIT 1), 
    2500000, 1800000, 'IDR', 'unit', 10, 'Active', ARRAY['elektronik', 'monitor']),
    
('ID-PRT-001', 'Printer HP LaserJet Warna', 'Printer laser warna untuk kantor', 
    (SELECT id FROM product_categories WHERE name = 'Elektronik' LIMIT 1), 
    4500000, 3500000, 'IDR', 'unit', 5, 'Active', ARRAY['elektronik', 'printer']),

-- Office Furniture (Furniture Kantor)
('ID-KRS-001', 'Kursi Kantor Ergonomis', 'Kursi kantor dengan sandaran tinggi dan roda', 
    (SELECT id FROM product_categories WHERE name = 'Furniture Kantor' LIMIT 1), 
    1500000, 950000, 'IDR', 'unit', 15, 'Active', ARRAY['furniture', 'kursi']),
    
('ID-MJ-001', 'Meja Kerja Kayu Jati 120x60cm', 'Meja kerja solid kayu jati', 
    (SELECT id FROM product_categories WHERE name = 'Furniture Kantor' LIMIT 1), 
    3500000, 2200000, 'IDR', 'unit', 8, 'Active', ARRAY['furniture', 'meja']),
    
('ID-LM-001', 'Lemari Arsip Besi 4 Pintu', 'Lemari penyimpanan dokumen dari besi', 
    (SELECT id FROM product_categories WHERE name = 'Furniture Kantor' LIMIT 1), 
    2800000, 1900000, 'IDR', 'unit', 5, 'Active', ARRAY['furniture', 'lemari']),

-- Office Supplies (Alat Tulis Kantor)
('ID-KTS-001', 'Kertas A4 80gram (1 Rim)', 'Kertas fotokopi ukuran A4, isi 500 lembar', 
    (SELECT id FROM product_categories WHERE name = 'Alat Tulis Kantor' LIMIT 1), 
    45000, 32000, 'IDR', 'rim', 50, 'Active', ARRAY['atk', 'kertas']),
    
('ID-PLN-001', 'Pulpen Pilot Hi-Techpoint (1 Lusin)', 'Pulpen gel hitam, isi 12 pcs', 
    (SELECT id FROM product_categories WHERE name = 'Alat Tulis Kantor' LIMIT 1), 
    85000, 60000, 'IDR', 'lusin', 30, 'Active', ARRAY['atk', 'pulpen']),
    
('ID-MAP-001', 'Map Plastik Folio Warna', 'Map plastik tebal warna-warni', 
    (SELECT id FROM product_categories WHERE name = 'Alat Tulis Kantor' LIMIT 1), 
    3500, 2000, 'IDR', 'pcs', 100, 'Active', ARRAY['atk', 'map']),
    
('ID-STP-001', 'Stapler Joyko HD-10', 'Stapler kecil kapasitas 20 lembar', 
    (SELECT id FROM product_categories WHERE name = 'Alat Tulis Kantor' LIMIT 1), 
    25000, 15000, 'IDR', 'pcs', 40, 'Active', ARRAY['atk', 'stapler']),

-- Food & Beverage (Makanan & Minuman)
('ID-KOP-001', 'Kopi Kapal Api Special Mix (10 sachet)', 'Kopi instan premium isi 10 sachet', 
    (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' LIMIT 1), 
    25000, 18000, 'IDR', 'box', 100, 'Active', ARRAY['makanan', 'kopi', 'minuman']),
    
('ID-TEH-001', 'Teh Sariwangi (25 teabags)', 'Teh celup isi 25 teabag', 
    (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' LIMIT 1), 
    15000, 11000, 'IDR', 'box', 80, 'Active', ARRAY['makanan', 'teh', 'minuman']),
    
('ID-SNK-001', 'Biskuit Roma Kelapa (10 pack)', 'Biskuit kelapa isi 10 bungkus', 
    (SELECT id FROM product_categories WHERE name = 'Makanan & Minuman' LIMIT 1), 
    35000, 25000, 'IDR', 'karton', 50, 'Active', ARRAY['makanan', 'snack']),

-- Cosmetics (Kosmetik)
('ID-BDK-001', 'Bedak Marcks Tabur Natural', 'Bedak tabur untuk wajah berminyak', 
    (SELECT id FROM product_categories WHERE name = 'Kosmetik' LIMIT 1), 
    45000, 30000, 'IDR', 'pcs', 40, 'Active', ARRAY['kosmetik', 'bedak']),
    
('ID-LST-001', 'Lipstik Wardah Matte (Berbagai Warna)', 'Lipstik matte long lasting', 
    (SELECT id FROM product_categories WHERE name = 'Kosmetik' LIMIT 1), 
    42000, 28000, 'IDR', 'pcs', 60, 'Active', ARRAY['kosmetik', 'lipstik']),
    
('ID-SKN-001', 'Sabun Cuci Muka Pond''s Men (100ml)', 'Face wash untuk pria', 
    (SELECT id FROM product_categories WHERE name = 'Kosmetik' LIMIT 1), 
    35000, 24000, 'IDR', 'pcs', 50, 'Active', ARRAY['kosmetik', 'skincare'])
ON CONFLICT (sku) DO UPDATE SET
    unit_price = EXCLUDED.unit_price,
    cost_price = EXCLUDED.cost_price,
    currency = EXCLUDED.currency;

-- Step 4: Update Manufacturing Sample Data to Rupiah

-- Update Chair and Table components with Rupiah pricing
UPDATE products SET
    currency = 'IDR',
    unit_price = CASE sku
        WHEN 'WOOD-LEG' THEN 125000
        WHEN 'WOOD-SEAT' THEN 230000
        WHEN 'WOOD-BACK' THEN 185000
        WHEN 'SCREW-M6' THEN 8000
        WHEN 'VARNISH-OAK' THEN 380000
        WHEN 'CUSHION-40' THEN 310000
        WHEN 'WOOD-TOP' THEN 1240000
        WHEN 'TABLE-LEG' THEN 185000
        WHEN 'BRACKET' THEN 46000
        ELSE unit_price
    END,
    cost_price = CASE sku
        WHEN 'WOOD-LEG' THEN 78000
        WHEN 'WOOD-SEAT' THEN 155000
        WHEN 'WOOD-BACK' THEN 124000
        WHEN 'SCREW-M6' THEN 3000
        WHEN 'VARNISH-OAK' THEN 233000
        WHEN 'CUSHION-40' THEN 186000
        WHEN 'WOOD-TOP' THEN 775000
        WHEN 'TABLE-LEG' THEN 108000
        WHEN 'BRACKET' THEN 23000
        ELSE cost_price
    END
WHERE sku IN ('WOOD-LEG', 'WOOD-SEAT', 'WOOD-BACK', 'SCREW-M6', 'VARNISH-OAK', 
              'CUSHION-40', 'WOOD-TOP', 'TABLE-LEG', 'BRACKET');

-- Update finished goods (Chair and Table)
UPDATE products SET
    currency = 'IDR',
    unit_price = CASE sku
        WHEN 'CHAIR-DINING' THEN 1860000  -- Selling price
        WHEN 'TABLE-DINING' THEN 6975000  -- Selling price
        ELSE unit_price
    END,
    cost_price = CASE sku
        WHEN 'CHAIR-DINING' THEN 930000   -- Production cost
        WHEN 'TABLE-DINING' THEN 3100000  -- Production cost
        ELSE cost_price
    END
WHERE sku IN ('CHAIR-DINING', 'TABLE-DINING');

-- Update BOM items with Rupiah costs
UPDATE bom_items SET
    unit_cost = CASE component_code
        WHEN 'WOOD-LEG' THEN 78000
        WHEN 'WOOD-SEAT' THEN 155000
        WHEN 'WOOD-BACK' THEN 124000
        WHEN 'SCREW-M6' THEN 3000
        WHEN 'VARNISH-OAK' THEN 233000
        WHEN 'CUSHION-40' THEN 186000
        WHEN 'WOOD-TOP' THEN 775000
        WHEN 'TABLE-LEG' THEN 108000
        WHEN 'BRACKET' THEN 23000
        ELSE unit_cost
    END
WHERE component_code IN ('WOOD-LEG', 'WOOD-SEAT', 'WOOD-BACK', 'SCREW-M6', 'VARNISH-OAK',
                         'CUSHION-40', 'WOOD-TOP', 'TABLE-LEG', 'BRACKET');

-- Recalculate BOM total costs
UPDATE bill_of_materials b
SET total_cost = (
    SELECT SUM(bi.quantity * bi.unit_cost)
    FROM bom_items bi
    WHERE bi.bom_id = b.id
)
WHERE b.id IN (11, 12);

-- Step 5: Create Indonesian Customer Data
INSERT INTO customers (name, email, phone, address, city, postal_code, country, customer_type, status) VALUES
('PT Maju Jaya Sentosa', 'info@majujaya.co.id', '021-5551234', 'Jl. Sudirman No. 45', 'Jakarta Pusat', '10110', 'Indonesia', 'Business', 'Active'),
('CV Berkah Sejahtera', 'contact@berkahsejahtera.com', '021-7778899', 'Jl. Gatot Subroto Kav. 23', 'Jakarta Selatan', '12930', 'Indonesia', 'Business', 'Active'),
('Toko Elektronik Sentosa', 'toko@elektroniksent.com', '022-4445566', 'Jl. Braga No. 67', 'Bandung', '40111', 'Indonesia', 'Retail', 'Active'),
('UD Sumber Rezeki', 'sumberrezeki@gmail.com', '031-8889900', 'Jl. Tunjungan No. 89', 'Surabaya', '60275', 'Indonesia', 'Business', 'Active'),
('PT Teknologi Nusantara', 'admin@teknusa.co.id', '021-3334455', 'Jl. Rasuna Said Kav. 12', 'Jakarta Selatan', '12940', 'Indonesia', 'Business', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Verification Queries
SELECT '=== PRODUK INDONESIA DENGAN HARGA RUPIAH ===' as title;
SELECT sku, name, 
       'Rp ' || TO_CHAR(unit_price, 'FM999,999,999') as harga_jual,
       'Rp ' || TO_CHAR(cost_price, 'FM999,999,999') as harga_beli,
       currency, unit_of_measure, status
FROM products 
WHERE sku LIKE 'ID-%' 
ORDER BY sku
LIMIT 10;

SELECT '' as divider;
SELECT '=== PRODUK MANUFAKTUR (KURSI & MEJA) ===' as title;
SELECT p.sku, p.name,
       'Rp ' || TO_CHAR(p.unit_price, 'FM999,999,999') as harga_jual,
       'Rp ' || TO_CHAR(p.cost_price, 'FM999,999,999') as biaya_produksi,
       p.currency
FROM products p
WHERE p.sku IN ('CHAIR-DINING', 'TABLE-DINING')
ORDER BY p.sku;

SELECT '' as divider;
SELECT '=== BOM DENGAN BIAYA RUPIAH ===' as title;
SELECT b.product_name,
       'Rp ' || TO_CHAR(b.total_cost, 'FM999,999,999') as total_biaya_bahan,
       b.version, b.status
FROM bill_of_materials b
WHERE b.product_code IN ('CHAIR-DINING', 'TABLE-DINING')
ORDER BY b.product_code;

SELECT '' as divider;
SELECT '=== RINGKASAN ===' as title;
SELECT 
    COUNT(*) as total_produk,
    COUNT(*) FILTER (WHERE sku LIKE 'ID-%') as produk_indonesia,
    COUNT(*) FILTER (WHERE currency = 'IDR') as produk_rupiah
FROM products;

SELECT '' as divider;
SELECT '✅ Data Indonesia dengan Rupiah berhasil dibuat!' as message;
SELECT 'Semua harga sudah dalam Rupiah (IDR)' as info;
