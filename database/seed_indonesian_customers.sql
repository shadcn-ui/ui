-- Indonesian Customer Data
-- Date: 25 November 2025

INSERT INTO customers (
    company_name, 
    contact_person, 
    email, 
    phone, 
    mobile,
    customer_type,
    industry,
    customer_status,
    billing_address,
    billing_city,
    billing_state,
    billing_country,
    billing_postal_code,
    credit_limit,
    payment_terms
) VALUES
(
    'PT Maju Jaya Sentosa', 
    'Budi Santoso',
    'info@majujaya.co.id', 
    '021-5551234', 
    '0812-3456-7890',
    'Business',
    'Manufacturing',
    'Active',
    'Jl. Sudirman No. 45',
    'Jakarta Pusat',
    'DKI Jakarta',
    'Indonesia',
    '10110',
    50000000,  -- Rp 50 juta
    'Net 30'
),
(
    'CV Berkah Sejahtera', 
    'Siti Rahmawati',
    'contact@berkahsejahtera.com', 
    '021-7778899', 
    '0856-7890-1234',
    'Business',
    'Trading',
    'Active',
    'Jl. Gatot Subroto Kav. 23',
    'Jakarta Selatan',
    'DKI Jakarta',
    'Indonesia',
    '12930',
    75000000,  -- Rp 75 juta
    'Net 45'
),
(
    'Toko Elektronik Sentosa', 
    'Andi Wijaya',
    'toko@elektroniksent.com', 
    '022-4445566', 
    '0813-2345-6789',
    'Retail',
    'Electronics Retail',
    'Active',
    'Jl. Braga No. 67',
    'Bandung',
    'Jawa Barat',
    'Indonesia',
    '40111',
    25000000,  -- Rp 25 juta
    'Net 14'
),
(
    'UD Sumber Rezeki', 
    'Ahmad Fauzi',
    'sumberrezeki@gmail.com', 
    '031-8889900', 
    '0822-9876-5432',
    'Business',
    'Wholesale',
    'Active',
    'Jl. Tunjungan No. 89',
    'Surabaya',
    'Jawa Timur',
    'Indonesia',
    '60275',
    100000000,  -- Rp 100 juta
    'Net 60'
),
(
    'PT Teknologi Nusantara', 
    'Dewi Kusuma',
    'admin@teknusa.co.id', 
    '021-3334455', 
    '0815-6543-2109',
    'Business',
    'Technology',
    'Active',
    'Jl. Rasuna Said Kav. 12',
    'Jakarta Selatan',
    'DKI Jakarta',
    'Indonesia',
    '12940',
    150000000,  -- Rp 150 juta
    'Net 30'
),
(
    'PT Indofood Makmur', 
    'Rina Sari',
    'rina@indofoodmak.com', 
    '021-5557788', 
    '0817-8765-4321',
    'Business',
    'Food & Beverage',
    'Active',
    'Jl. Thamrin No. 15',
    'Jakarta Pusat',
    'DKI Jakarta',
    'Indonesia',
    '10230',
    200000000,  -- Rp 200 juta
    'Net 45'
),
(
    'Toko Furniture Jaya', 
    'Hendra Wijaya',
    'hendra@furniturejaya.com', 
    '022-3334455', 
    '0851-2345-6789',
    'Retail',
    'Furniture Retail',
    'Active',
    'Jl. Dago No. 102',
    'Bandung',
    'Jawa Barat',
    'Indonesia',
    '40135',
    30000000,  -- Rp 30 juta
    'Net 30'
),
(
    'PT Kosmetik Cantik Indonesia', 
    'Maya Sari',
    'maya@kosmetikcantik.co.id', 
    '021-9998877', 
    '0878-5432-1098',
    'Business',
    'Cosmetics',
    'Active',
    'Jl. Kuningan Raya No. 34',
    'Jakarta Selatan',
    'DKI Jakarta',
    'Indonesia',
    '12950',
    80000000,  -- Rp 80 juta
    'Net 30'
)
ON CONFLICT (email) DO NOTHING;

-- Verification
SELECT '=== PELANGGAN INDONESIA ===' as title;
SELECT 
    company_name as perusahaan,
    contact_person as kontak,
    phone as telepon,
    billing_city as kota,
    'Rp ' || TO_CHAR(credit_limit, 'FM999,999,999') as limit_kredit,
    payment_terms as termin_bayar
FROM customers
WHERE billing_country = 'Indonesia'
ORDER BY company_name;

SELECT '' as divider;
SELECT '✅ Data pelanggan Indonesia berhasil dibuat!' as message;
