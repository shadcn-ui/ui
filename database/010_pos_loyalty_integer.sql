-- ============================================================================
-- Ocean ERP - POS and Loyalty System Database Migration
-- For Indonesian Skincare Retail Chain (300+ Outlets)
-- Date: November 12, 2025
-- Using INTEGER primary keys to match existing schema
-- ============================================================================

-- ============================================================================
-- SECTION 1: TAX CONFIGURATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS tax_configurations (
    id SERIAL PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL,
    tax_type VARCHAR(50) NOT NULL DEFAULT 'percentage',
    tax_rate DECIMAL(5,2) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tax_configurations_active ON tax_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_tax_configurations_default ON tax_configurations(is_default);

-- Insert Indonesian PPN (VAT) tax
INSERT INTO tax_configurations (tax_name, tax_type, tax_rate, is_default, is_active, effective_date, notes)
VALUES 
    ('PPN', 'percentage', 11.00, true, true, '2022-04-01', 'Pajak Pertambahan Nilai (Indonesian VAT)')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SECTION 2: LOYALTY PROGRAM TABLES
-- ============================================================================

-- Membership Tiers
CREATE TABLE IF NOT EXISTS membership_tiers (
    id SERIAL PRIMARY KEY,
    tier_code VARCHAR(20) UNIQUE NOT NULL,
    tier_name VARCHAR(100) NOT NULL,
    tier_level INTEGER NOT NULL,
    min_lifetime_purchase DECIMAL(15,2) DEFAULT 0,
    min_annual_purchase DECIMAL(15,2) DEFAULT 0,
    min_transaction_count INTEGER DEFAULT 0,
    points_multiplier DECIMAL(3,2) DEFAULT 1.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    benefits JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_membership_tiers_code ON membership_tiers(tier_code);
CREATE INDEX IF NOT EXISTS idx_membership_tiers_level ON membership_tiers(tier_level);

-- Insert default membership tiers
INSERT INTO membership_tiers (tier_code, tier_name, tier_level, min_lifetime_purchase, min_annual_purchase, points_multiplier, discount_percentage, benefits)
VALUES 
    ('BRONZE', 'Bronze', 1, 0, 0, 1.0, 0, '{"perks": ["Welcome gift", "Birthday voucher"]}'),
    ('SILVER', 'Silver', 2, 5000000, 2000000, 1.2, 5, '{"perks": ["All Bronze perks", "5% discount", "Priority queue"]}'),
    ('GOLD', 'Gold', 3, 15000000, 5000000, 1.5, 10, '{"perks": ["All Silver perks", "10% discount", "Free consultation"]}'),
    ('PLATINUM', 'Platinum', 4, 50000000, 15000000, 2.0, 15, '{"perks": ["All Gold perks", "15% discount", "Complimentary treatments"]}'),
    ('TITANIUM', 'Titanium', 5, 100000000, 30000000, 3.0, 20, '{"perks": ["All Platinum perks", "20% discount", "VIP lounge access", "Exclusive products"]}')
ON CONFLICT (tier_code) DO NOTHING;

-- Loyalty Points Configuration
CREATE TABLE IF NOT EXISTS loyalty_points_config (
    id SERIAL PRIMARY KEY,
    earning_rate DECIMAL(10,6) NOT NULL,
    redemption_rate DECIMAL(10,2) NOT NULL,
    min_points_to_redeem INTEGER DEFAULT 0,
    max_points_per_transaction INTEGER,
    points_expiry_days INTEGER DEFAULT 365,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loyalty_points_config_active ON loyalty_points_config(is_active);

-- Insert default loyalty points configuration (1 point per Rp 10,000)
INSERT INTO loyalty_points_config (earning_rate, redemption_rate, min_points_to_redeem, points_expiry_days)
VALUES 
    (0.0001, 1000.00, 100, 365)
ON CONFLICT DO NOTHING;

-- Loyalty Points History
CREATE TABLE IF NOT EXISTS loyalty_points_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    transaction_type VARCHAR(20) NOT NULL,
    points_amount INTEGER NOT NULL,
    transaction_reference VARCHAR(100),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    expiry_date DATE,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loyalty_points_customer ON loyalty_points_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_type ON loyalty_points_history(transaction_type);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_expiry ON loyalty_points_history(expiry_date);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_sales_order ON loyalty_points_history(sales_order_id);

-- ============================================================================
-- SECTION 3: ENHANCE CUSTOMERS TABLE FOR LOYALTY
-- ============================================================================

-- Add loyalty and membership columns to customers
ALTER TABLE customers 
    ADD COLUMN IF NOT EXISTS membership_number VARCHAR(50) UNIQUE,
    ADD COLUMN IF NOT EXISTS membership_tier_id INTEGER REFERENCES membership_tiers(id),
    ADD COLUMN IF NOT EXISTS membership_joined_date DATE,
    ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS points_earned_lifetime INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS points_redeemed_lifetime INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS lifetime_purchase_value DECIMAL(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS annual_purchase_value DECIMAL(15,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_purchase_date DATE,
    ADD COLUMN IF NOT EXISTS transaction_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS skin_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS skin_concerns TEXT[],
    ADD COLUMN IF NOT EXISTS allergies TEXT[],
    ADD COLUMN IF NOT EXISTS preferred_outlet_id INTEGER REFERENCES warehouses(id),
    ADD COLUMN IF NOT EXISTS birth_date DATE,
    ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
    ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50),
    ADD COLUMN IF NOT EXISTS referred_by_id INTEGER REFERENCES customers(id);

CREATE INDEX IF NOT EXISTS idx_customers_membership_number ON customers(membership_number);
CREATE INDEX IF NOT EXISTS idx_customers_membership_tier ON customers(membership_tier_id);
CREATE INDEX IF NOT EXISTS idx_customers_loyalty_points ON customers(loyalty_points);

-- ============================================================================
-- SECTION 4: ENHANCE PRODUCTS TABLE FOR SKINCARE & POS
-- ============================================================================

-- Add skincare and POS-specific columns to products
ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS treatment_duration INTEGER,
    ADD COLUMN IF NOT EXISTS treatment_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS product_line VARCHAR(100),
    ADD COLUMN IF NOT EXISTS size VARCHAR(50),
    ADD COLUMN IF NOT EXISTS ingredients TEXT[],
    ADD COLUMN IF NOT EXISTS skin_type_suitable TEXT[],
    ADD COLUMN IF NOT EXISTS concerns_addressed TEXT[],
    ADD COLUMN IF NOT EXISTS requires_batch_tracking BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS shelf_life_days INTEGER,
    ADD COLUMN IF NOT EXISTS pao_months INTEGER,
    ADD COLUMN IF NOT EXISTS is_taxable BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS is_vegan BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_cruelty_free BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_halal BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_tester BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS tester_usage_limit INTEGER,
    ADD COLUMN IF NOT EXISTS tester_usage_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_treatment_type ON products(treatment_type);
CREATE INDEX IF NOT EXISTS idx_products_taxable ON products(is_taxable);

-- ============================================================================
-- SECTION 5: ENHANCE WAREHOUSES TABLE FOR OUTLETS
-- ============================================================================

-- Add outlet-specific columns to warehouses
ALTER TABLE warehouses 
    ADD COLUMN IF NOT EXISTS outlet_code VARCHAR(20) UNIQUE,
    ADD COLUMN IF NOT EXISTS outlet_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS mall_name VARCHAR(200),
    ADD COLUMN IF NOT EXISTS floor_level VARCHAR(20),
    ADD COLUMN IF NOT EXISTS store_size_sqft INTEGER,
    ADD COLUMN IF NOT EXISTS operating_hours JSONB,
    ADD COLUMN IF NOT EXISTS store_manager_id INTEGER REFERENCES users(id),
    ADD COLUMN IF NOT EXISTS phone_number VARCHAR(50),
    ADD COLUMN IF NOT EXISTS monthly_rent DECIMAL(15,2),
    ADD COLUMN IF NOT EXISTS monthly_sales_target DECIMAL(15,2),
    ADD COLUMN IF NOT EXISTS region VARCHAR(100),
    ADD COLUMN IF NOT EXISTS area VARCHAR(100),
    ADD COLUMN IF NOT EXISTS is_franchise BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS has_consultation_room BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS pos_terminal_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_warehouses_outlet_code ON warehouses(outlet_code);
CREATE INDEX IF NOT EXISTS idx_warehouses_region ON warehouses(region);
CREATE INDEX IF NOT EXISTS idx_warehouses_outlet_type ON warehouses(outlet_type);

-- ============================================================================
-- SECTION 6: POS TERMINALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_terminals (
    id SERIAL PRIMARY KEY,
    terminal_code VARCHAR(20) UNIQUE NOT NULL,
    terminal_name VARCHAR(100) NOT NULL,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    device_id VARCHAR(100),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    terminal_type VARCHAR(50) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'active',
    last_sync_at TIMESTAMP,
    printer_config JSONB,
    scanner_config JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_terminals_code ON pos_terminals(terminal_code);
CREATE INDEX IF NOT EXISTS idx_pos_terminals_warehouse ON pos_terminals(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_pos_terminals_status ON pos_terminals(status);

-- ============================================================================
-- SECTION 7: POS SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_sessions (
    id SERIAL PRIMARY KEY,
    session_number VARCHAR(50) UNIQUE NOT NULL,
    terminal_id INTEGER NOT NULL REFERENCES pos_terminals(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    cashier_id INTEGER NOT NULL REFERENCES users(id),
    opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    opening_cash DECIMAL(15,2) NOT NULL DEFAULT 0,
    closing_cash DECIMAL(15,2),
    expected_cash DECIMAL(15,2),
    cash_variance DECIMAL(15,2),
    total_transactions INTEGER DEFAULT 0,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_refunds DECIMAL(15,2) DEFAULT 0,
    session_status VARCHAR(20) DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_sessions_number ON pos_sessions(session_number);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_terminal ON pos_sessions(terminal_id);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_warehouse ON pos_sessions(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_cashier ON pos_sessions(cashier_id);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_status ON pos_sessions(session_status);
CREATE INDEX IF NOT EXISTS idx_pos_sessions_opened ON pos_sessions(opened_at);

-- ============================================================================
-- SECTION 8: POS TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_transactions (
    id SERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    session_id INTEGER NOT NULL REFERENCES pos_sessions(id),
    terminal_id INTEGER NOT NULL REFERENCES pos_terminals(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    customer_id INTEGER REFERENCES customers(id),
    cashier_id INTEGER NOT NULL REFERENCES users(id),
    transaction_type VARCHAR(20) DEFAULT 'sale',
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    loyalty_points_redeemed INTEGER DEFAULT 0,
    loyalty_discount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    tender_amount DECIMAL(15,2),
    change_amount DECIMAL(15,2),
    payment_status VARCHAR(20) DEFAULT 'pending',
    transaction_status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    offline_transaction BOOLEAN DEFAULT false,
    synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_transactions_number ON pos_transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_session ON pos_transactions(session_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_terminal ON pos_transactions(terminal_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_warehouse ON pos_transactions(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_sales_order ON pos_transactions(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_customer ON pos_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_created ON pos_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_offline ON pos_transactions(offline_transaction);

-- ============================================================================
-- SECTION 9: POS PAYMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_payments (
    id SERIAL PRIMARY KEY,
    pos_transaction_id INTEGER NOT NULL REFERENCES pos_transactions(id),
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL,
    reference_number VARCHAR(100),
    card_last_four VARCHAR(4),
    card_type VARCHAR(50),
    ewallet_provider VARCHAR(50),
    qris_reference VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'completed',
    payment_gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_payments_transaction ON pos_payments(pos_transaction_id);
CREATE INDEX IF NOT EXISTS idx_pos_payments_method ON pos_payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_pos_payments_status ON pos_payments(payment_status);

-- ============================================================================
-- SECTION 10: POS RECEIPTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    pos_transaction_id INTEGER NOT NULL REFERENCES pos_transactions(id),
    receipt_type VARCHAR(20) DEFAULT 'sale',
    receipt_format VARCHAR(20) DEFAULT 'thermal',
    printed_at TIMESTAMP,
    print_count INTEGER DEFAULT 0,
    email_sent_at TIMESTAMP,
    email_address VARCHAR(255),
    sms_sent_at TIMESTAMP,
    phone_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_receipts_number ON pos_receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_pos_receipts_transaction ON pos_receipts(pos_transaction_id);

-- ============================================================================
-- SECTION 11: POS CASH MOVEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pos_cash_movements (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES pos_sessions(id),
    terminal_id INTEGER NOT NULL REFERENCES pos_terminals(id),
    movement_type VARCHAR(20) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    reason TEXT,
    performed_by INTEGER NOT NULL REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pos_cash_movements_session ON pos_cash_movements(session_id);
CREATE INDEX IF NOT EXISTS idx_pos_cash_movements_terminal ON pos_cash_movements(terminal_id);
CREATE INDEX IF NOT EXISTS idx_pos_cash_movements_type ON pos_cash_movements(movement_type);

-- ============================================================================
-- SECTION 12: PRODUCT BATCHES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_batches (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    batch_number VARCHAR(100) NOT NULL,
    manufacture_date DATE,
    expiry_date DATE,
    quantity_received INTEGER NOT NULL,
    quantity_remaining INTEGER NOT NULL,
    warehouse_id INTEGER REFERENCES warehouses(id),
    supplier_id INTEGER REFERENCES suppliers(id),
    purchase_order_id INTEGER,
    unit_cost DECIMAL(15,2),
    recall_status VARCHAR(20) DEFAULT 'none',
    recall_reason TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, batch_number, warehouse_id)
);

CREATE INDEX IF NOT EXISTS idx_product_batches_product ON product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_product_batches_batch_number ON product_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_product_batches_expiry ON product_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_product_batches_warehouse ON product_batches(warehouse_id);

-- ============================================================================
-- SECTION 13: OUTLET DAILY STATS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS outlet_daily_stats (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    stat_date DATE NOT NULL,
    total_transactions INTEGER DEFAULT 0,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_refunds DECIMAL(15,2) DEFAULT 0,
    total_customers INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    avg_transaction_value DECIMAL(15,2) DEFAULT 0,
    top_selling_products JSONB,
    staff_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, stat_date)
);

CREATE INDEX IF NOT EXISTS idx_outlet_daily_stats_warehouse ON outlet_daily_stats(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_outlet_daily_stats_date ON outlet_daily_stats(stat_date);

-- ============================================================================
-- SECTION 14: PROMOTIONS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    promo_name VARCHAR(200) NOT NULL,
    promo_type VARCHAR(50) NOT NULL,
    discount_type VARCHAR(20),
    discount_value DECIMAL(15,2),
    min_purchase_amount DECIMAL(15,2),
    max_discount_amount DECIMAL(15,2),
    applicable_products INTEGER[],
    applicable_categories INTEGER[],
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(promo_code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

CREATE TABLE IF NOT EXISTS promotion_usage (
    id SERIAL PRIMARY KEY,
    promotion_id INTEGER NOT NULL REFERENCES promotions(id),
    customer_id INTEGER REFERENCES customers(id),
    sales_order_id INTEGER REFERENCES sales_orders(id),
    pos_transaction_id INTEGER REFERENCES pos_transactions(id),
    discount_amount DECIMAL(15,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotion_usage_promotion ON promotion_usage(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_customer ON promotion_usage(customer_id);
CREATE INDEX IF NOT EXISTS idx_promotion_usage_transaction ON promotion_usage(pos_transaction_id);

-- ============================================================================
-- SECTION 15: DATABASE VIEWS
-- ============================================================================

-- POS Session Summary View
CREATE OR REPLACE VIEW pos_session_summary AS
SELECT 
    s.id,
    s.session_number,
    s.terminal_id,
    t.terminal_name,
    s.warehouse_id,
    w.name as outlet_name,
    s.cashier_id,
    CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
    s.opened_at,
    s.closed_at,
    s.opening_cash,
    s.closing_cash,
    s.expected_cash,
    s.cash_variance,
    s.total_transactions,
    s.total_sales,
    s.total_refunds,
    s.session_status,
    EXTRACT(EPOCH FROM (COALESCE(s.closed_at, CURRENT_TIMESTAMP) - s.opened_at))/3600 as session_duration_hours
FROM pos_sessions s
JOIN pos_terminals t ON s.terminal_id = t.id
JOIN warehouses w ON s.warehouse_id = w.id
JOIN users u ON s.cashier_id = u.id;

-- POS Sales Summary View
CREATE OR REPLACE VIEW pos_sales_summary AS
SELECT 
    pt.warehouse_id,
    w.name as outlet_name,
    DATE(pt.created_at) as sale_date,
    COUNT(DISTINCT pt.id) as total_transactions,
    COUNT(DISTINCT pt.customer_id) as unique_customers,
    SUM(pt.subtotal) as total_subtotal,
    SUM(pt.tax_amount) as total_tax,
    SUM(pt.discount_amount) as total_discounts,
    SUM(pt.total_amount) as total_sales,
    AVG(pt.total_amount) as avg_transaction_value,
    SUM(pt.loyalty_points_redeemed) as total_points_redeemed
FROM pos_transactions pt
JOIN warehouses w ON pt.warehouse_id = w.id
WHERE pt.transaction_status = 'completed'
GROUP BY pt.warehouse_id, w.name, DATE(pt.created_at);

-- Customer Loyalty Summary View
CREATE OR REPLACE VIEW customer_loyalty_summary AS
SELECT 
    c.id,
    c.company_name,
    c.contact_person,
    c.email,
    c.membership_number,
    mt.tier_name,
    mt.tier_level,
    c.loyalty_points,
    c.points_earned_lifetime,
    c.points_redeemed_lifetime,
    c.lifetime_purchase_value,
    c.annual_purchase_value,
    c.transaction_count,
    c.last_purchase_date,
    c.membership_joined_date
FROM customers c
LEFT JOIN membership_tiers mt ON c.membership_tier_id = mt.id
WHERE c.membership_number IS NOT NULL;

-- ============================================================================
-- SECTION 16: TRIGGERS
-- ============================================================================

-- Trigger to auto-upgrade customer tier based on purchase history
CREATE OR REPLACE FUNCTION update_customer_tier()
RETURNS TRIGGER AS $$
DECLARE
    qualifying_tier INTEGER;
BEGIN
    -- Find the highest tier the customer qualifies for
    SELECT id INTO qualifying_tier
    FROM membership_tiers
    WHERE is_active = true
    AND NEW.lifetime_purchase_value >= min_lifetime_purchase
    AND NEW.annual_purchase_value >= min_annual_purchase
    AND NEW.transaction_count >= min_transaction_count
    ORDER BY tier_level DESC
    LIMIT 1;

    -- Update customer tier if they qualify for a higher tier
    IF qualifying_tier IS NOT NULL AND (NEW.membership_tier_id IS NULL OR qualifying_tier != NEW.membership_tier_id) THEN
        NEW.membership_tier_id = qualifying_tier;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_customer_tier ON customers;
CREATE TRIGGER trigger_update_customer_tier
BEFORE UPDATE OF lifetime_purchase_value, annual_purchase_value, transaction_count
ON customers
FOR EACH ROW
EXECUTE FUNCTION update_customer_tier();

-- ============================================================================
-- SECTION 17: SAMPLE DATA FOR PILOT OUTLETS
-- ============================================================================

-- Update existing warehouses to be outlets (sample data for first warehouse)
UPDATE warehouses 
SET 
    outlet_code = 'JKT001',
    outlet_type = 'Mall',
    mall_name = 'Grand Indonesia',
    floor_level = 'Ground Floor',
    store_size_sqft = 1200,
    region = 'Jakarta',
    area = 'Central Jakarta',
    operating_hours = '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-22:00", "saturday": "10:00-22:00", "sunday": "10:00-22:00"}',
    phone_number = '+62-21-12345678',
    has_consultation_room = true,
    pos_terminal_count = 3
WHERE id = (SELECT id FROM warehouses ORDER BY created_at LIMIT 1);

-- Insert POS terminals for pilot outlet
INSERT INTO pos_terminals (terminal_code, terminal_name, warehouse_id, device_id, terminal_type, status)
SELECT 
    'JKT001-T' || seq::text,
    'Jakarta GI Terminal ' || seq::text,
    (SELECT id FROM warehouses WHERE outlet_code = 'JKT001'),
    'DEVICE-JKT001-' || seq::text,
    'standard',
    'active'
FROM generate_series(1, 3) seq
WHERE NOT EXISTS (SELECT 1 FROM pos_terminals WHERE terminal_code = 'JKT001-T' || seq::text);

-- Assign default Bronze tier to existing customers without membership
UPDATE customers 
SET 
    membership_tier_id = (SELECT id FROM membership_tiers WHERE tier_code = 'BRONZE'),
    membership_joined_date = CURRENT_DATE,
    loyalty_points = 0
WHERE membership_tier_id IS NULL;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify table creation
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN (
        'tax_configurations',
        'membership_tiers',
        'loyalty_points_config',
        'loyalty_points_history',
        'pos_terminals',
        'pos_sessions',
        'pos_transactions',
        'pos_payments',
        'pos_receipts',
        'pos_cash_movements',
        'product_batches',
        'outlet_daily_stats',
        'promotions',
        'promotion_usage'
    );
    
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'POS and Loyalty System Migration Complete!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Created/verified % new tables', table_count;
    RAISE NOTICE 'Enhanced: customers, products, warehouses tables';
    RAISE NOTICE 'Created: 3 views (pos_session_summary, pos_sales_summary, customer_loyalty_summary)';
    RAISE NOTICE 'Created: 1 trigger (auto tier upgrade)';
    RAISE NOTICE '';
    RAISE NOTICE 'System is now ready for POS development!';
    RAISE NOTICE '============================================================================';
END $$;
