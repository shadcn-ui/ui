-- =====================================================
-- Phase 7 Task 8: E-commerce Integration
-- Database Schema for Multi-Channel E-commerce
-- =====================================================
-- Description: Connects online storefronts (Shopify, WooCommerce, Magento, etc.)
--              to Ocean ERP for product sync, order import, and inventory management
-- Tables: 10 core tables + indexes + triggers
-- Features: Product catalog sync, order import/export, real-time inventory sync,
--           customer linking, payment integration, shipping methods, cart recovery
-- Created: December 2024
-- =====================================================

-- =====================================================
-- 1. ECOMMERCE STOREFRONTS
-- =====================================================
-- Manage multiple online stores (Shopify, WooCommerce, custom, etc.)
CREATE TABLE IF NOT EXISTS ecommerce_storefronts (
    storefront_id SERIAL PRIMARY KEY,
    storefront_code VARCHAR(50) UNIQUE NOT NULL,
    storefront_name VARCHAR(200) NOT NULL,
    platform_type VARCHAR(50) NOT NULL, -- shopify, woocommerce, magento, custom, amazon, ebay, etsy
    platform_url TEXT, -- Store URL
    
    -- API Configuration
    api_endpoint TEXT,
    api_key TEXT,
    api_secret TEXT,
    api_token TEXT,
    webhook_secret TEXT,
    
    -- Store Settings
    default_currency VARCHAR(3) DEFAULT 'USD',
    default_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'UTC',
    
    -- Sync Settings
    auto_sync_products BOOLEAN DEFAULT true,
    auto_sync_orders BOOLEAN DEFAULT true,
    auto_sync_inventory BOOLEAN DEFAULT true,
    auto_sync_customers BOOLEAN DEFAULT false,
    sync_frequency_minutes INTEGER DEFAULT 15, -- How often to sync
    last_product_sync_at TIMESTAMP,
    last_order_sync_at TIMESTAMP,
    last_inventory_sync_at TIMESTAMP,
    
    -- Order Settings
    auto_create_sales_orders BOOLEAN DEFAULT true,
    auto_fulfill_orders BOOLEAN DEFAULT false,
    order_prefix VARCHAR(20), -- Prefix for order numbers
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_connected BOOLEAN DEFAULT false,
    connection_last_tested_at TIMESTAMP,
    connection_status VARCHAR(50), -- connected, disconnected, error
    connection_error TEXT,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

CREATE INDEX idx_storefronts_code ON ecommerce_storefronts(storefront_code);
CREATE INDEX idx_storefronts_platform ON ecommerce_storefronts(platform_type);
CREATE INDEX idx_storefronts_active ON ecommerce_storefronts(is_active);

-- =====================================================
-- 2. ECOMMERCE CATEGORIES
-- =====================================================
-- Category mapping between ERP and e-commerce platforms
CREATE TABLE IF NOT EXISTS ecommerce_categories (
    ecommerce_category_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Category Info
    external_category_id VARCHAR(100), -- Platform's category ID
    external_parent_id VARCHAR(100), -- Platform's parent category
    category_name VARCHAR(200) NOT NULL,
    category_slug VARCHAR(200),
    category_path TEXT, -- Full path: "Home > Electronics > Laptops"
    
    -- ERP Mapping
    erp_category_id INTEGER, -- Link to internal product category
    
    -- Category Details
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    product_count INTEGER DEFAULT 0,
    
    -- Metadata
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, synced, error
    last_synced_at TIMESTAMP,
    sync_error TEXT,
    external_metadata JSONB, -- Store platform-specific data
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, external_category_id)
);

CREATE INDEX idx_ecom_categories_storefront ON ecommerce_categories(storefront_id);
CREATE INDEX idx_ecom_categories_external ON ecommerce_categories(external_category_id);
CREATE INDEX idx_ecom_categories_erp ON ecommerce_categories(erp_category_id);

-- =====================================================
-- 3. ECOMMERCE PRODUCTS
-- =====================================================
-- Product catalog sync between ERP and e-commerce platforms
CREATE TABLE IF NOT EXISTS ecommerce_products (
    ecommerce_product_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Product Info
    external_product_id VARCHAR(100), -- Platform's product ID
    external_sku VARCHAR(100), -- Platform's SKU
    external_url TEXT, -- Product page URL
    
    -- ERP Product Mapping
    erp_product_id INTEGER, -- Link to products table
    erp_sku VARCHAR(100),
    
    -- Product Details
    product_name VARCHAR(300) NOT NULL,
    product_slug VARCHAR(300),
    short_description TEXT,
    long_description TEXT,
    
    -- Pricing
    price DECIMAL(15, 2),
    compare_at_price DECIMAL(15, 2), -- Original/compare price
    cost_per_item DECIMAL(15, 2),
    
    -- Inventory
    inventory_quantity INTEGER DEFAULT 0,
    inventory_tracked BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    low_stock_threshold INTEGER DEFAULT 10,
    
    -- Category
    ecommerce_category_id INTEGER REFERENCES ecommerce_categories(ecommerce_category_id),
    
    -- Product Attributes
    weight DECIMAL(10, 2), -- In kg
    weight_unit VARCHAR(10) DEFAULT 'kg',
    dimensions_length DECIMAL(10, 2),
    dimensions_width DECIMAL(10, 2),
    dimensions_height DECIMAL(10, 2),
    dimension_unit VARCHAR(10) DEFAULT 'cm',
    
    -- Media
    featured_image_url TEXT,
    image_urls JSONB, -- Array of image URLs
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    
    -- Sync Status
    sync_direction VARCHAR(20) DEFAULT 'both', -- erp_to_store, store_to_erp, both
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, synced, error, conflict
    last_synced_at TIMESTAMP,
    sync_error TEXT,
    
    -- Tags & Custom Fields
    tags TEXT[],
    custom_fields JSONB,
    external_metadata JSONB, -- Platform-specific data
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    
    UNIQUE(storefront_id, external_product_id)
);

CREATE INDEX idx_ecom_products_storefront ON ecommerce_products(storefront_id);
CREATE INDEX idx_ecom_products_external_id ON ecommerce_products(external_product_id);
CREATE INDEX idx_ecom_products_external_sku ON ecommerce_products(external_sku);
CREATE INDEX idx_ecom_products_erp_id ON ecommerce_products(erp_product_id);
CREATE INDEX idx_ecom_products_erp_sku ON ecommerce_products(erp_sku);
CREATE INDEX idx_ecom_products_published ON ecommerce_products(is_published);
CREATE INDEX idx_ecom_products_sync_status ON ecommerce_products(sync_status);

-- =====================================================
-- 4. ECOMMERCE PRODUCT VARIANTS
-- =====================================================
-- Product variants (size, color, style, etc.)
CREATE TABLE IF NOT EXISTS ecommerce_product_variants (
    variant_id SERIAL PRIMARY KEY,
    ecommerce_product_id INTEGER REFERENCES ecommerce_products(ecommerce_product_id) ON DELETE CASCADE,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Variant Info
    external_variant_id VARCHAR(100),
    external_sku VARCHAR(100),
    
    -- ERP Mapping
    erp_product_variant_id INTEGER, -- If ERP has variant support
    
    -- Variant Details
    variant_name VARCHAR(200), -- e.g., "Small / Red"
    option1_name VARCHAR(50), -- e.g., "Size"
    option1_value VARCHAR(100), -- e.g., "Small"
    option2_name VARCHAR(50), -- e.g., "Color"
    option2_value VARCHAR(100), -- e.g., "Red"
    option3_name VARCHAR(50), -- e.g., "Material"
    option3_value VARCHAR(100), -- e.g., "Cotton"
    
    -- Pricing
    price DECIMAL(15, 2),
    compare_at_price DECIMAL(15, 2),
    
    -- Inventory
    inventory_quantity INTEGER DEFAULT 0,
    inventory_tracked BOOLEAN DEFAULT true,
    
    -- Attributes
    weight DECIMAL(10, 2),
    barcode VARCHAR(100),
    
    -- Media
    image_url TEXT,
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    
    -- Sync
    sync_status VARCHAR(50) DEFAULT 'pending',
    last_synced_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, external_variant_id)
);

CREATE INDEX idx_variants_product ON ecommerce_product_variants(ecommerce_product_id);
CREATE INDEX idx_variants_storefront ON ecommerce_product_variants(storefront_id);
CREATE INDEX idx_variants_external_id ON ecommerce_product_variants(external_variant_id);
CREATE INDEX idx_variants_external_sku ON ecommerce_product_variants(external_sku);

-- =====================================================
-- 5. ECOMMERCE CUSTOMERS
-- =====================================================
-- Customer profiles from e-commerce platforms
CREATE TABLE IF NOT EXISTS ecommerce_customers (
    ecommerce_customer_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Customer Info
    external_customer_id VARCHAR(100),
    external_email VARCHAR(200),
    
    -- ERP Customer Mapping
    erp_customer_id INTEGER, -- Link to customers table
    
    -- Customer Details
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(50),
    
    -- Address (Default)
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Customer Stats
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(15, 2) DEFAULT 0,
    average_order_value DECIMAL(15, 2) DEFAULT 0,
    first_order_date TIMESTAMP,
    last_order_date TIMESTAMP,
    
    -- Marketing
    accepts_marketing BOOLEAN DEFAULT false,
    marketing_opt_in_date TIMESTAMP,
    
    -- Status
    customer_status VARCHAR(50) DEFAULT 'active', -- active, inactive, blocked
    account_created_at TIMESTAMP,
    
    -- Sync
    sync_status VARCHAR(50) DEFAULT 'pending',
    last_synced_at TIMESTAMP,
    sync_error TEXT,
    
    -- Metadata
    tags TEXT[],
    notes TEXT,
    external_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, external_customer_id)
);

CREATE INDEX idx_ecom_customers_storefront ON ecommerce_customers(storefront_id);
CREATE INDEX idx_ecom_customers_external_id ON ecommerce_customers(external_customer_id);
CREATE INDEX idx_ecom_customers_email ON ecommerce_customers(email);
CREATE INDEX idx_ecom_customers_erp_id ON ecommerce_customers(erp_customer_id);

-- =====================================================
-- 6. ECOMMERCE ORDERS
-- =====================================================
-- Orders from e-commerce platforms
CREATE TABLE IF NOT EXISTS ecommerce_orders (
    ecommerce_order_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Order Info
    external_order_id VARCHAR(100),
    external_order_number VARCHAR(100), -- Human-readable order number
    external_order_name VARCHAR(100), -- e.g., "#1001"
    
    -- ERP Order Mapping
    erp_sales_order_id INTEGER, -- Link to sales_orders table
    erp_order_number VARCHAR(100),
    
    -- Customer
    ecommerce_customer_id INTEGER REFERENCES ecommerce_customers(ecommerce_customer_id),
    
    -- Customer Details (snapshot at time of order)
    customer_email VARCHAR(200),
    customer_first_name VARCHAR(100),
    customer_last_name VARCHAR(100),
    customer_phone VARCHAR(50),
    
    -- Order Dates
    order_date TIMESTAMP NOT NULL,
    processed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    fulfilled_at TIMESTAMP,
    
    -- Amounts
    subtotal_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    shipping_amount DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Shipping Address
    shipping_first_name VARCHAR(100),
    shipping_last_name VARCHAR(100),
    shipping_company VARCHAR(200),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state_province VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    shipping_phone VARCHAR(50),
    
    -- Billing Address
    billing_first_name VARCHAR(100),
    billing_last_name VARCHAR(100),
    billing_company VARCHAR(200),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state_province VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    billing_phone VARCHAR(50),
    
    -- Order Status
    order_status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, fulfilled, cancelled, refunded
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, partially_paid, refunded, partially_refunded
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- unfulfilled, partially_fulfilled, fulfilled
    
    -- Shipping
    shipping_method VARCHAR(100),
    shipping_carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    tracking_url TEXT,
    estimated_delivery_date DATE,
    
    -- Payment
    payment_method VARCHAR(100), -- credit_card, paypal, bank_transfer, etc.
    payment_gateway VARCHAR(100), -- stripe, paypal, square, etc.
    payment_transaction_id VARCHAR(200),
    
    -- Sync Status
    sync_direction VARCHAR(20) DEFAULT 'store_to_erp', -- store_to_erp, erp_to_store, both
    sync_status VARCHAR(50) DEFAULT 'pending', -- pending, synced, error
    import_status VARCHAR(50) DEFAULT 'pending', -- pending, imported, error
    last_synced_at TIMESTAMP,
    imported_at TIMESTAMP,
    sync_error TEXT,
    
    -- Flags
    is_test_order BOOLEAN DEFAULT false,
    requires_shipping BOOLEAN DEFAULT true,
    is_gift BOOLEAN DEFAULT false,
    gift_message TEXT,
    
    -- Notes
    customer_note TEXT,
    internal_note TEXT,
    
    -- Metadata
    tags TEXT[],
    external_metadata JSONB, -- Platform-specific data
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, external_order_id)
);

CREATE INDEX idx_ecom_orders_storefront ON ecommerce_orders(storefront_id);
CREATE INDEX idx_ecom_orders_external_id ON ecommerce_orders(external_order_id);
CREATE INDEX idx_ecom_orders_external_number ON ecommerce_orders(external_order_number);
CREATE INDEX idx_ecom_orders_erp_id ON ecommerce_orders(erp_sales_order_id);
CREATE INDEX idx_ecom_orders_customer ON ecommerce_orders(ecommerce_customer_id);
CREATE INDEX idx_ecom_orders_email ON ecommerce_orders(customer_email);
CREATE INDEX idx_ecom_orders_order_date ON ecommerce_orders(order_date);
CREATE INDEX idx_ecom_orders_status ON ecommerce_orders(order_status);
CREATE INDEX idx_ecom_orders_payment_status ON ecommerce_orders(payment_status);
CREATE INDEX idx_ecom_orders_sync_status ON ecommerce_orders(sync_status);
CREATE INDEX idx_ecom_orders_import_status ON ecommerce_orders(import_status);

-- =====================================================
-- 7. ECOMMERCE ORDER ITEMS
-- =====================================================
-- Line items for e-commerce orders
CREATE TABLE IF NOT EXISTS ecommerce_order_items (
    order_item_id SERIAL PRIMARY KEY,
    ecommerce_order_id INTEGER REFERENCES ecommerce_orders(ecommerce_order_id) ON DELETE CASCADE,
    ecommerce_product_id INTEGER REFERENCES ecommerce_products(ecommerce_product_id),
    variant_id INTEGER REFERENCES ecommerce_product_variants(variant_id),
    
    -- External Item Info
    external_item_id VARCHAR(100),
    external_product_id VARCHAR(100),
    external_variant_id VARCHAR(100),
    
    -- ERP Mapping
    erp_order_item_id INTEGER, -- Link to sales_order_items
    erp_product_id INTEGER,
    
    -- Item Details
    product_name VARCHAR(300),
    variant_name VARCHAR(200),
    sku VARCHAR(100),
    
    -- Quantity & Pricing
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL, -- (quantity * unit_price) - discount + tax
    
    -- Fulfillment
    fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- unfulfilled, fulfilled, cancelled
    fulfilled_quantity INTEGER DEFAULT 0,
    
    -- Product Details (snapshot)
    weight DECIMAL(10, 2),
    requires_shipping BOOLEAN DEFAULT true,
    is_taxable BOOLEAN DEFAULT true,
    
    -- Metadata
    custom_fields JSONB,
    external_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_order ON ecommerce_order_items(ecommerce_order_id);
CREATE INDEX idx_order_items_product ON ecommerce_order_items(ecommerce_product_id);
CREATE INDEX idx_order_items_variant ON ecommerce_order_items(variant_id);
CREATE INDEX idx_order_items_external_id ON ecommerce_order_items(external_item_id);
CREATE INDEX idx_order_items_sku ON ecommerce_order_items(sku);

-- =====================================================
-- 8. ECOMMERCE CARTS
-- =====================================================
-- Shopping carts for abandoned cart recovery
CREATE TABLE IF NOT EXISTS ecommerce_carts (
    cart_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Cart Info
    external_cart_id VARCHAR(100),
    cart_token VARCHAR(200),
    
    -- Customer
    ecommerce_customer_id INTEGER REFERENCES ecommerce_customers(ecommerce_customer_id),
    customer_email VARCHAR(200),
    customer_first_name VARCHAR(100),
    customer_last_name VARCHAR(100),
    
    -- Cart Details
    cart_items JSONB, -- Array of cart items with product details
    item_count INTEGER DEFAULT 0,
    
    -- Amounts
    subtotal_amount DECIMAL(15, 2) DEFAULT 0,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    shipping_amount DECIMAL(15, 2) DEFAULT 0,
    tax_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Cart Status
    cart_status VARCHAR(50) DEFAULT 'active', -- active, abandoned, recovered, converted, expired
    is_abandoned BOOLEAN DEFAULT false,
    abandoned_at TIMESTAMP,
    
    -- Recovery
    recovery_email_sent BOOLEAN DEFAULT false,
    recovery_email_sent_at TIMESTAMP,
    recovery_email_count INTEGER DEFAULT 0,
    checkout_url TEXT, -- Link to resume checkout
    
    -- Conversion
    converted_to_order BOOLEAN DEFAULT false,
    ecommerce_order_id INTEGER REFERENCES ecommerce_orders(ecommerce_order_id),
    converted_at TIMESTAMP,
    
    -- Dates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Metadata
    browser_info JSONB, -- Browser, device, location
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    external_metadata JSONB,
    
    UNIQUE(storefront_id, external_cart_id)
);

CREATE INDEX idx_carts_storefront ON ecommerce_carts(storefront_id);
CREATE INDEX idx_carts_external_id ON ecommerce_carts(external_cart_id);
CREATE INDEX idx_carts_customer ON ecommerce_carts(ecommerce_customer_id);
CREATE INDEX idx_carts_email ON ecommerce_carts(customer_email);
CREATE INDEX idx_carts_status ON ecommerce_carts(cart_status);
CREATE INDEX idx_carts_abandoned ON ecommerce_carts(is_abandoned);
CREATE INDEX idx_carts_abandoned_at ON ecommerce_carts(abandoned_at);

-- =====================================================
-- 9. ECOMMERCE PAYMENTS
-- =====================================================
-- Payment transactions from e-commerce platforms
CREATE TABLE IF NOT EXISTS ecommerce_payments (
    payment_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    ecommerce_order_id INTEGER REFERENCES ecommerce_orders(ecommerce_order_id),
    
    -- External Payment Info
    external_payment_id VARCHAR(100),
    external_transaction_id VARCHAR(200),
    
    -- Payment Details
    payment_method VARCHAR(100), -- credit_card, paypal, bank_transfer, etc.
    payment_gateway VARCHAR(100), -- stripe, paypal, square, authorize_net, etc.
    payment_type VARCHAR(50) DEFAULT 'charge', -- charge, refund, capture, void
    
    -- Amounts
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Card Details (last 4 digits only)
    card_brand VARCHAR(50), -- visa, mastercard, amex, etc.
    card_last4 VARCHAR(4),
    card_expiry_month INTEGER,
    card_expiry_year INTEGER,
    
    -- Payment Status
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, authorized, captured, succeeded, failed, cancelled, refunded
    authorization_code VARCHAR(100),
    
    -- Dates
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    authorized_at TIMESTAMP,
    captured_at TIMESTAMP,
    failed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    
    -- Error Handling
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Related Payments
    parent_payment_id INTEGER REFERENCES ecommerce_payments(payment_id), -- For refunds
    refund_reason TEXT,
    
    -- Metadata
    gateway_response JSONB, -- Full gateway response
    external_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, external_payment_id)
);

CREATE INDEX idx_payments_storefront ON ecommerce_payments(storefront_id);
CREATE INDEX idx_payments_order ON ecommerce_payments(ecommerce_order_id);
CREATE INDEX idx_payments_external_id ON ecommerce_payments(external_payment_id);
CREATE INDEX idx_payments_transaction_id ON ecommerce_payments(external_transaction_id);
CREATE INDEX idx_payments_status ON ecommerce_payments(payment_status);
CREATE INDEX idx_payments_date ON ecommerce_payments(payment_date);

-- =====================================================
-- 10. ECOMMERCE SHIPPING METHODS
-- =====================================================
-- Available shipping methods per storefront
CREATE TABLE IF NOT EXISTS ecommerce_shipping_methods (
    shipping_method_id SERIAL PRIMARY KEY,
    storefront_id INTEGER REFERENCES ecommerce_storefronts(storefront_id),
    
    -- External Shipping Info
    external_shipping_id VARCHAR(100),
    
    -- Method Details
    method_name VARCHAR(200) NOT NULL,
    method_code VARCHAR(100),
    carrier VARCHAR(100), -- UPS, FedEx, USPS, DHL, etc.
    service_level VARCHAR(100), -- Standard, Express, Overnight, etc.
    
    -- Pricing
    base_rate DECIMAL(15, 2) DEFAULT 0,
    rate_per_kg DECIMAL(10, 2) DEFAULT 0,
    rate_per_item DECIMAL(10, 2) DEFAULT 0,
    free_shipping_threshold DECIMAL(15, 2), -- Free over this amount
    
    -- Delivery Time
    min_delivery_days INTEGER,
    max_delivery_days INTEGER,
    estimated_delivery_text VARCHAR(200), -- e.g., "3-5 business days"
    
    -- Availability
    is_active BOOLEAN DEFAULT true,
    available_countries TEXT[], -- Array of country codes
    available_zones TEXT[], -- Shipping zones
    
    -- Restrictions
    min_order_amount DECIMAL(15, 2),
    max_order_amount DECIMAL(15, 2),
    max_weight DECIMAL(10, 2), -- Maximum weight in kg
    
    -- Display
    display_order INTEGER DEFAULT 0,
    description TEXT,
    
    -- Tracking
    supports_tracking BOOLEAN DEFAULT true,
    tracking_url_template TEXT, -- e.g., "https://track.carrier.com/{tracking_number}"
    
    -- Metadata
    external_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(storefront_id, method_code)
);

CREATE INDEX idx_shipping_methods_storefront ON ecommerce_shipping_methods(storefront_id);
CREATE INDEX idx_shipping_methods_active ON ecommerce_shipping_methods(is_active);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger 1: Update ecommerce_orders total amounts
CREATE OR REPLACE FUNCTION calculate_ecommerce_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ecommerce_orders
    SET 
        subtotal_amount = (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM ecommerce_order_items
            WHERE ecommerce_order_id = NEW.ecommerce_order_id
        ),
        total_amount = (
            SELECT COALESCE(SUM(total_amount), 0)
            FROM ecommerce_order_items
            WHERE ecommerce_order_id = NEW.ecommerce_order_id
        ) + COALESCE(NEW.shipping_amount, 0) - COALESCE(NEW.discount_amount, 0) + COALESCE(NEW.tax_amount, 0),
        updated_at = CURRENT_TIMESTAMP
    WHERE ecommerce_order_id = NEW.ecommerce_order_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_order_totals
AFTER INSERT OR UPDATE ON ecommerce_order_items
FOR EACH ROW
EXECUTE FUNCTION calculate_ecommerce_order_totals();

-- Trigger 2: Update customer stats when order is created
CREATE OR REPLACE FUNCTION update_ecommerce_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.order_status = 'fulfilled' AND OLD.order_status != 'fulfilled') THEN
        UPDATE ecommerce_customers
        SET 
            total_orders = (
                SELECT COUNT(*)
                FROM ecommerce_orders
                WHERE ecommerce_customer_id = NEW.ecommerce_customer_id
                AND order_status IN ('fulfilled', 'processing')
            ),
            total_spent = (
                SELECT COALESCE(SUM(total_amount), 0)
                FROM ecommerce_orders
                WHERE ecommerce_customer_id = NEW.ecommerce_customer_id
                AND order_status IN ('fulfilled', 'processing')
            ),
            average_order_value = (
                SELECT COALESCE(AVG(total_amount), 0)
                FROM ecommerce_orders
                WHERE ecommerce_customer_id = NEW.ecommerce_customer_id
                AND order_status IN ('fulfilled', 'processing')
            ),
            last_order_date = NEW.order_date,
            first_order_date = LEAST(
                COALESCE(first_order_date, NEW.order_date),
                NEW.order_date
            ),
            updated_at = CURRENT_TIMESTAMP
        WHERE ecommerce_customer_id = NEW.ecommerce_customer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_stats
AFTER INSERT OR UPDATE ON ecommerce_orders
FOR EACH ROW
WHEN (NEW.ecommerce_customer_id IS NOT NULL)
EXECUTE FUNCTION update_ecommerce_customer_stats();

-- Trigger 3: Mark cart as abandoned after 24 hours of inactivity
CREATE OR REPLACE FUNCTION check_abandoned_carts()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.last_activity_at < CURRENT_TIMESTAMP - INTERVAL '24 hours' 
       AND NEW.cart_status = 'active' 
       AND NOT NEW.is_abandoned THEN
        NEW.is_abandoned := true;
        NEW.abandoned_at := CURRENT_TIMESTAMP;
        NEW.cart_status := 'abandoned';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_abandoned_carts
BEFORE UPDATE ON ecommerce_carts
FOR EACH ROW
EXECUTE FUNCTION check_abandoned_carts();

-- Trigger 4: Update product inventory when order is fulfilled
CREATE OR REPLACE FUNCTION update_ecommerce_product_inventory()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.fulfillment_status = 'fulfilled' AND OLD.fulfillment_status != 'fulfilled' THEN
        UPDATE ecommerce_products
        SET 
            inventory_quantity = inventory_quantity - NEW.quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE ecommerce_product_id = NEW.ecommerce_product_id
        AND inventory_tracked = true;
        
        IF NEW.variant_id IS NOT NULL THEN
            UPDATE ecommerce_product_variants
            SET 
                inventory_quantity = inventory_quantity - NEW.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE variant_id = NEW.variant_id
            AND inventory_tracked = true;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_inventory
AFTER UPDATE ON ecommerce_order_items
FOR EACH ROW
EXECUTE FUNCTION update_ecommerce_product_inventory();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Sample Storefront: Shopify Store
INSERT INTO ecommerce_storefronts (
    storefront_code, storefront_name, platform_type, platform_url,
    default_currency, auto_sync_products, auto_sync_orders, auto_sync_inventory,
    is_active, is_connected, connection_status, created_by
) VALUES
('SHOPIFY-MAIN', 'Main Shopify Store', 'shopify', 'https://ocean-erp.myshopify.com',
 'USD', true, true, true, true, true, 'connected', 1),
('WOO-MAIN', 'Main WooCommerce Store', 'woocommerce', 'https://store.ocean-erp.com',
 'USD', true, true, true, true, false, 'disconnected', 1),
('AMAZON-US', 'Amazon US Marketplace', 'amazon', 'https://www.amazon.com',
 'USD', true, true, true, true, true, 'connected', 1);

-- Sample Categories
INSERT INTO ecommerce_categories (
    storefront_id, external_category_id, category_name, category_slug, 
    category_path, is_visible, sync_status
) VALUES
(1, 'cat_electronics', 'Electronics', 'electronics', 'Home > Electronics', true, 'synced'),
(1, 'cat_laptops', 'Laptops', 'laptops', 'Home > Electronics > Laptops', true, 'synced'),
(1, 'cat_furniture', 'Furniture', 'furniture', 'Home > Furniture', true, 'synced'),
(1, 'cat_clothing', 'Clothing', 'clothing', 'Home > Clothing', true, 'synced');

-- Sample Products
INSERT INTO ecommerce_products (
    storefront_id, external_product_id, external_sku, product_name, product_slug,
    short_description, price, compare_at_price, inventory_quantity, 
    ecommerce_category_id, is_published, sync_status, created_by
) VALUES
(1, 'prod_laptop_001', 'LAP-001', 'Professional Laptop 15"', 'professional-laptop-15',
 'High-performance laptop for business professionals', 1299.99, 1499.99, 25, 
 2, true, 'synced', 1),
(1, 'prod_desk_001', 'DESK-001', 'Executive Office Desk', 'executive-office-desk',
 'Premium wooden desk with storage', 599.99, 699.99, 15, 
 3, true, 'synced', 1),
(1, 'prod_chair_001', 'CHAIR-001', 'Ergonomic Office Chair', 'ergonomic-office-chair',
 'Comfortable chair with lumbar support', 299.99, 349.99, 40, 
 3, true, 'synced', 1);

-- Sample Customer
INSERT INTO ecommerce_customers (
    storefront_id, external_customer_id, external_email, first_name, last_name,
    email, phone, total_orders, total_spent, customer_status, sync_status
) VALUES
(1, 'cust_001', 'john.doe@example.com', 'John', 'Doe',
 'john.doe@example.com', '+1-555-0123', 3, 2499.97, 'active', 'synced');

-- Sample Order
INSERT INTO ecommerce_orders (
    storefront_id, external_order_id, external_order_number, external_order_name,
    ecommerce_customer_id, customer_email, customer_first_name, customer_last_name,
    order_date, subtotal_amount, shipping_amount, tax_amount, total_amount,
    shipping_address_line1, shipping_city, shipping_state_province, shipping_postal_code, shipping_country,
    order_status, payment_status, fulfillment_status, payment_method, sync_status
) VALUES
(1, 'order_001', 'ORD-1001', '#1001', 1, 'john.doe@example.com', 'John', 'Doe',
 CURRENT_TIMESTAMP - INTERVAL '2 days', 1299.99, 15.00, 104.00, 1418.99,
 '123 Main Street', 'San Francisco', 'CA', '94102', 'USA',
 'fulfilled', 'paid', 'fulfilled', 'credit_card', 'synced');

-- Sample Order Items
INSERT INTO ecommerce_order_items (
    ecommerce_order_id, ecommerce_product_id, external_item_id, external_product_id,
    product_name, sku, quantity, unit_price, total_amount, fulfillment_status
) VALUES
(1, 1, 'item_001', 'prod_laptop_001', 'Professional Laptop 15"', 'LAP-001', 
 1, 1299.99, 1299.99, 'fulfilled');

-- Sample Shipping Methods
INSERT INTO ecommerce_shipping_methods (
    storefront_id, method_name, method_code, carrier, service_level,
    base_rate, min_delivery_days, max_delivery_days, estimated_delivery_text,
    is_active, supports_tracking
) VALUES
(1, 'Standard Shipping', 'standard', 'USPS', 'Standard', 5.99, 5, 7, '5-7 business days', true, true),
(1, 'Express Shipping', 'express', 'FedEx', 'Express', 15.99, 2, 3, '2-3 business days', true, true),
(1, 'Next Day Delivery', 'overnight', 'FedEx', 'Overnight', 29.99, 1, 1, 'Next business day', true, true);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View: E-commerce sales summary
CREATE OR REPLACE VIEW ecommerce_sales_summary AS
SELECT 
    s.storefront_name,
    s.platform_type,
    COUNT(o.ecommerce_order_id) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as average_order_value,
    COUNT(DISTINCT o.ecommerce_customer_id) as unique_customers,
    SUM(CASE WHEN o.order_status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled_orders,
    SUM(CASE WHEN o.order_status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
FROM ecommerce_storefronts s
LEFT JOIN ecommerce_orders o ON s.storefront_id = o.storefront_id
GROUP BY s.storefront_id, s.storefront_name, s.platform_type;

-- View: Product sync status
CREATE OR REPLACE VIEW ecommerce_product_sync_status AS
SELECT 
    s.storefront_name,
    COUNT(p.ecommerce_product_id) as total_products,
    SUM(CASE WHEN p.sync_status = 'synced' THEN 1 ELSE 0 END) as synced_products,
    SUM(CASE WHEN p.sync_status = 'error' THEN 1 ELSE 0 END) as error_products,
    SUM(CASE WHEN p.sync_status = 'pending' THEN 1 ELSE 0 END) as pending_products,
    MAX(p.last_synced_at) as last_sync_time
FROM ecommerce_storefronts s
LEFT JOIN ecommerce_products p ON s.storefront_id = p.storefront_id
GROUP BY s.storefront_id, s.storefront_name;

-- View: Abandoned carts
CREATE OR REPLACE VIEW ecommerce_abandoned_carts_summary AS
SELECT 
    s.storefront_name,
    COUNT(c.cart_id) as total_abandoned_carts,
    SUM(c.total_amount) as potential_revenue,
    AVG(c.total_amount) as average_cart_value,
    SUM(CASE WHEN c.recovery_email_sent THEN 1 ELSE 0 END) as recovery_emails_sent,
    SUM(CASE WHEN c.converted_to_order THEN 1 ELSE 0 END) as recovered_carts
FROM ecommerce_storefronts s
LEFT JOIN ecommerce_carts c ON s.storefront_id = c.storefront_id
WHERE c.is_abandoned = true
GROUP BY s.storefront_id, s.storefront_name;

-- =====================================================
-- COMPLETION
-- =====================================================

-- Verify tables
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_name LIKE 'ecommerce%'
ORDER BY table_name;

COMMENT ON TABLE ecommerce_storefronts IS 'E-commerce platform configurations (Shopify, WooCommerce, etc.)';
COMMENT ON TABLE ecommerce_categories IS 'Product category mapping between ERP and e-commerce';
COMMENT ON TABLE ecommerce_products IS 'Product catalog synchronization';
COMMENT ON TABLE ecommerce_product_variants IS 'Product variants (size, color, etc.)';
COMMENT ON TABLE ecommerce_customers IS 'Customer profiles from e-commerce platforms';
COMMENT ON TABLE ecommerce_orders IS 'Orders imported from e-commerce platforms';
COMMENT ON TABLE ecommerce_order_items IS 'Order line items';
COMMENT ON TABLE ecommerce_carts IS 'Shopping carts for abandoned cart recovery';
COMMENT ON TABLE ecommerce_payments IS 'Payment transactions';
COMMENT ON TABLE ecommerce_shipping_methods IS 'Available shipping methods';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'E-commerce Integration Schema Created Successfully!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables: 10';
    RAISE NOTICE 'Triggers: 4';
    RAISE NOTICE 'Views: 3';
    RAISE NOTICE 'Sample Records: 15+';
    RAISE NOTICE '==============================================';
END $$;
