-- =====================================================
-- Data Warehouse & ETL System
-- Phase 6 - Task 7: Analytics Intelligence
-- =====================================================
-- Purpose: Star schema data warehouse with dimension and fact tables
--          for high-performance analytics and business intelligence
-- =====================================================

-- =====================================================
-- DIMENSION TABLES (Star Schema)
-- =====================================================

-- Dimension: Time (Date hierarchy)
CREATE TABLE IF NOT EXISTS dim_time (
    time_key INTEGER PRIMARY KEY,
    full_date DATE NOT NULL UNIQUE,
    
    -- Date components
    year INTEGER NOT NULL,
    quarter INTEGER NOT NULL CHECK (quarter BETWEEN 1 AND 4),
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    month_name VARCHAR(20) NOT NULL,
    week_of_year INTEGER NOT NULL CHECK (week_of_year BETWEEN 1 AND 53),
    day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    day_name VARCHAR(20) NOT NULL,
    
    -- Business attributes
    is_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    is_holiday BOOLEAN NOT NULL DEFAULT FALSE,
    holiday_name VARCHAR(100),
    fiscal_year INTEGER,
    fiscal_quarter INTEGER,
    fiscal_period INTEGER,
    
    -- Relative attributes
    year_month VARCHAR(7) NOT NULL, -- YYYY-MM
    year_quarter VARCHAR(7) NOT NULL, -- YYYY-Q1
    is_current_day BOOLEAN DEFAULT FALSE,
    is_current_week BOOLEAN DEFAULT FALSE,
    is_current_month BOOLEAN DEFAULT FALSE,
    is_current_quarter BOOLEAN DEFAULT FALSE,
    is_current_year BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_time_date ON dim_time(full_date);
CREATE INDEX idx_dim_time_year_month ON dim_time(year, month);
CREATE INDEX idx_dim_time_quarter ON dim_time(year, quarter);
CREATE INDEX idx_dim_time_week ON dim_time(week_of_year);
CREATE INDEX idx_dim_time_current ON dim_time(is_current_month, is_current_quarter, is_current_year) WHERE is_current_month OR is_current_quarter OR is_current_year;

-- Dimension: Product (SCD Type 2 - Slowly Changing Dimension)
CREATE TABLE IF NOT EXISTS dim_product (
    product_key SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL, -- Source system key
    
    -- Product attributes
    product_code VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    
    -- Classification
    product_type VARCHAR(50),
    product_family VARCHAR(100),
    product_line VARCHAR(100),
    
    -- Pricing
    unit_price DECIMAL(15,2),
    cost_price DECIMAL(15,2),
    margin_percentage DECIMAL(5,2),
    
    -- Inventory
    unit_of_measure VARCHAR(20),
    reorder_level INTEGER,
    safety_stock INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_discontinued BOOLEAN DEFAULT FALSE,
    
    -- SCD Type 2 fields
    effective_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_product_id ON dim_product(product_id);
CREATE INDEX idx_dim_product_code ON dim_product(product_code);
CREATE INDEX idx_dim_product_category ON dim_product(category, subcategory);
CREATE INDEX idx_dim_product_current ON dim_product(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_dim_product_effective ON dim_product(effective_start_date, effective_end_date);

-- Dimension: Customer (SCD Type 2)
CREATE TABLE IF NOT EXISTS dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL, -- Source system key
    
    -- Customer attributes
    customer_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50), -- individual, corporate, government
    customer_segment VARCHAR(50), -- VIP, premium, standard, new
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Location
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    region VARCHAR(100),
    
    -- Demographics
    industry VARCHAR(100),
    company_size VARCHAR(50),
    annual_revenue_range VARCHAR(50),
    
    -- Metrics
    credit_limit DECIMAL(15,2),
    payment_terms VARCHAR(50),
    lifetime_value DECIMAL(15,2),
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    risk_level VARCHAR(20), -- low, medium, high
    
    -- SCD Type 2 fields
    effective_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_end_date DATE,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_customer_id ON dim_customer(customer_id);
CREATE INDEX idx_dim_customer_name ON dim_customer(customer_name);
CREATE INDEX idx_dim_customer_segment ON dim_customer(customer_segment);
CREATE INDEX idx_dim_customer_region ON dim_customer(region, country);
CREATE INDEX idx_dim_customer_current ON dim_customer(is_current) WHERE is_current = TRUE;
CREATE INDEX idx_dim_customer_effective ON dim_customer(effective_start_date, effective_end_date);

-- Dimension: Location (Warehouses, Stores, Distribution Centers)
CREATE TABLE IF NOT EXISTS dim_location (
    location_key SERIAL PRIMARY KEY,
    location_id INTEGER NOT NULL, -- Source system key
    
    -- Location attributes
    location_code VARCHAR(100) NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    location_type VARCHAR(50), -- warehouse, store, distribution_center, factory
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    region VARCHAR(100),
    
    -- Geographic
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    
    -- Capacity
    total_capacity DECIMAL(15,2),
    capacity_unit VARCHAR(20),
    
    -- Operational
    manager_name VARCHAR(255),
    contact_phone VARCHAR(50),
    operating_hours VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    opened_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_location_id ON dim_location(location_id);
CREATE INDEX idx_dim_location_code ON dim_location(location_code);
CREATE INDEX idx_dim_location_type ON dim_location(location_type);
CREATE INDEX idx_dim_location_region ON dim_location(region, country);
CREATE INDEX idx_dim_location_active ON dim_location(is_active) WHERE is_active = TRUE;

-- Dimension: Supplier
CREATE TABLE IF NOT EXISTS dim_supplier (
    supplier_key SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL, -- Source system key
    
    -- Supplier attributes
    supplier_name VARCHAR(255) NOT NULL,
    supplier_code VARCHAR(100),
    supplier_type VARCHAR(50), -- manufacturer, distributor, wholesaler
    
    -- Contact
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Location
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    
    -- Performance metrics
    performance_rating DECIMAL(3,2), -- 0.00 to 5.00
    on_time_delivery_rate DECIMAL(5,2), -- percentage
    quality_rating DECIMAL(3,2),
    
    -- Terms
    payment_terms VARCHAR(50),
    lead_time_days INTEGER,
    minimum_order_quantity DECIMAL(15,2),
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_preferred BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_supplier_id ON dim_supplier(supplier_id);
CREATE INDEX idx_dim_supplier_name ON dim_supplier(supplier_name);
CREATE INDEX idx_dim_supplier_performance ON dim_supplier(performance_rating DESC);
CREATE INDEX idx_dim_supplier_active ON dim_supplier(is_active) WHERE is_active = TRUE;

-- Dimension: Employee (Sales reps, managers, etc.)
CREATE TABLE IF NOT EXISTS dim_employee (
    employee_key SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL, -- Source system key
    
    -- Employee attributes
    employee_code VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    
    -- Role
    job_title VARCHAR(100),
    department VARCHAR(100),
    role VARCHAR(100),
    
    -- Hierarchy
    manager_id INTEGER,
    manager_name VARCHAR(255),
    
    -- Location
    office_location VARCHAR(255),
    region VARCHAR(100),
    territory VARCHAR(100),
    
    -- Status
    hire_date DATE,
    termination_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dim_employee_id ON dim_employee(employee_id);
CREATE INDEX idx_dim_employee_name ON dim_employee(full_name);
CREATE INDEX idx_dim_employee_department ON dim_employee(department, role);
CREATE INDEX idx_dim_employee_active ON dim_employee(is_active) WHERE is_active = TRUE;

-- =====================================================
-- FACT TABLES (Star Schema)
-- =====================================================

-- Fact: Sales (Order line items)
CREATE TABLE IF NOT EXISTS fact_sales (
    sales_key BIGSERIAL PRIMARY KEY,
    
    -- Dimension keys
    time_key INTEGER NOT NULL REFERENCES dim_time(time_key),
    product_key INTEGER NOT NULL REFERENCES dim_product(product_key),
    customer_key INTEGER NOT NULL REFERENCES dim_customer(customer_key),
    location_key INTEGER REFERENCES dim_location(location_key),
    employee_key INTEGER REFERENCES dim_employee(employee_key),
    
    -- Source keys (for traceability)
    order_id INTEGER NOT NULL,
    order_item_id INTEGER NOT NULL,
    
    -- Measures (Metrics)
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Calculated measures
    gross_sales_amount DECIMAL(15,2) NOT NULL, -- quantity * unit_price
    net_sales_amount DECIMAL(15,2) NOT NULL, -- gross - discount
    total_amount DECIMAL(15,2) NOT NULL, -- net + tax
    
    -- Cost & Margin
    unit_cost DECIMAL(15,2),
    total_cost DECIMAL(15,2), -- quantity * unit_cost
    gross_margin DECIMAL(15,2), -- net_sales - total_cost
    margin_percentage DECIMAL(5,2), -- (margin / net_sales) * 100
    
    -- Order attributes (denormalized for performance)
    order_status VARCHAR(50),
    order_type VARCHAR(50),
    payment_method VARCHAR(50),
    shipping_method VARCHAR(50),
    
    -- Timestamps
    order_date DATE NOT NULL,
    ship_date DATE,
    delivery_date DATE,
    
    -- Delivery performance
    days_to_ship INTEGER,
    days_to_deliver INTEGER,
    is_on_time BOOLEAN,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partitioning for large datasets (by order_date)
-- CREATE TABLE fact_sales_2024 PARTITION OF fact_sales FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
-- CREATE TABLE fact_sales_2025 PARTITION OF fact_sales FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE INDEX idx_fact_sales_time ON fact_sales(time_key);
CREATE INDEX idx_fact_sales_product ON fact_sales(product_key);
CREATE INDEX idx_fact_sales_customer ON fact_sales(customer_key);
CREATE INDEX idx_fact_sales_location ON fact_sales(location_key);
CREATE INDEX idx_fact_sales_employee ON fact_sales(employee_key);
CREATE INDEX idx_fact_sales_order ON fact_sales(order_id, order_item_id);
CREATE INDEX idx_fact_sales_date ON fact_sales(order_date);
CREATE INDEX idx_fact_sales_composite ON fact_sales(time_key, product_key, customer_key);

-- Fact: Inventory (Daily snapshots)
CREATE TABLE IF NOT EXISTS fact_inventory (
    inventory_key BIGSERIAL PRIMARY KEY,
    
    -- Dimension keys
    time_key INTEGER NOT NULL REFERENCES dim_time(time_key),
    product_key INTEGER NOT NULL REFERENCES dim_product(product_key),
    location_key INTEGER NOT NULL REFERENCES dim_location(location_key),
    
    -- Source keys
    inventory_id INTEGER,
    
    -- Measures
    quantity_on_hand DECIMAL(15,2) NOT NULL,
    quantity_reserved DECIMAL(15,2) DEFAULT 0,
    quantity_available DECIMAL(15,2) NOT NULL, -- on_hand - reserved
    
    -- Value
    unit_cost DECIMAL(15,2),
    total_value DECIMAL(15,2), -- quantity_on_hand * unit_cost
    
    -- Movement
    quantity_received DECIMAL(15,2) DEFAULT 0,
    quantity_shipped DECIMAL(15,2) DEFAULT 0,
    quantity_adjusted DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    is_stockout BOOLEAN DEFAULT FALSE,
    is_below_reorder BOOLEAN DEFAULT FALSE,
    is_excess BOOLEAN DEFAULT FALSE,
    days_of_supply INTEGER,
    
    -- Snapshot info
    snapshot_date DATE NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(time_key, product_key, location_key)
);

CREATE INDEX idx_fact_inventory_time ON fact_inventory(time_key);
CREATE INDEX idx_fact_inventory_product ON fact_inventory(product_key);
CREATE INDEX idx_fact_inventory_location ON fact_inventory(location_key);
CREATE INDEX idx_fact_inventory_date ON fact_inventory(snapshot_date);
CREATE INDEX idx_fact_inventory_stockout ON fact_inventory(is_stockout) WHERE is_stockout = TRUE;
CREATE INDEX idx_fact_inventory_composite ON fact_inventory(time_key, product_key, location_key);

-- Fact: Production (Manufacturing orders)
CREATE TABLE IF NOT EXISTS fact_production (
    production_key BIGSERIAL PRIMARY KEY,
    
    -- Dimension keys
    time_key INTEGER NOT NULL REFERENCES dim_time(time_key),
    product_key INTEGER NOT NULL REFERENCES dim_product(product_key),
    location_key INTEGER NOT NULL REFERENCES dim_location(location_key),
    
    -- Source keys
    production_order_id INTEGER NOT NULL,
    
    -- Measures
    quantity_planned DECIMAL(15,2) NOT NULL,
    quantity_produced DECIMAL(15,2) NOT NULL,
    quantity_rejected DECIMAL(15,2) DEFAULT 0,
    quantity_accepted DECIMAL(15,2) NOT NULL,
    
    -- Efficiency
    planned_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2),
    efficiency_percentage DECIMAL(5,2), -- (planned / actual) * 100
    
    -- Quality
    defect_count INTEGER DEFAULT 0,
    defect_rate DECIMAL(5,2), -- (rejected / produced) * 100
    
    -- Cost
    material_cost DECIMAL(15,2),
    labor_cost DECIMAL(15,2),
    overhead_cost DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    cost_per_unit DECIMAL(15,2),
    
    -- Timing
    planned_start_date DATE,
    actual_start_date DATE,
    planned_end_date DATE,
    actual_end_date DATE,
    days_variance INTEGER, -- actual - planned
    is_on_time BOOLEAN,
    
    -- Status
    production_status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fact_production_time ON fact_production(time_key);
CREATE INDEX idx_fact_production_product ON fact_production(product_key);
CREATE INDEX idx_fact_production_location ON fact_production(location_key);
CREATE INDEX idx_fact_production_order ON fact_production(production_order_id);
CREATE INDEX idx_fact_production_status ON fact_production(production_status);
CREATE INDEX idx_fact_production_composite ON fact_production(time_key, product_key, location_key);

-- Fact: Shipments (Logistics)
CREATE TABLE IF NOT EXISTS fact_shipments (
    shipment_key BIGSERIAL PRIMARY KEY,
    
    -- Dimension keys
    time_key INTEGER NOT NULL REFERENCES dim_time(time_key),
    customer_key INTEGER NOT NULL REFERENCES dim_customer(customer_key),
    origin_location_key INTEGER REFERENCES dim_location(location_key),
    destination_location_key INTEGER,
    
    -- Source keys
    shipment_id INTEGER NOT NULL,
    order_id INTEGER,
    
    -- Measures
    package_count INTEGER DEFAULT 1,
    total_weight DECIMAL(15,2),
    total_volume DECIMAL(15,2),
    
    -- Cost
    shipping_cost DECIMAL(15,2),
    fuel_surcharge DECIMAL(15,2),
    total_cost DECIMAL(15,2),
    
    -- Timing
    ship_date DATE NOT NULL,
    scheduled_delivery_date DATE,
    actual_delivery_date DATE,
    days_in_transit INTEGER,
    days_variance INTEGER, -- actual - scheduled
    
    -- Performance
    is_on_time BOOLEAN,
    is_damaged BOOLEAN DEFAULT FALSE,
    is_lost BOOLEAN DEFAULT FALSE,
    
    -- Carrier
    carrier_name VARCHAR(255),
    service_level VARCHAR(100),
    tracking_number VARCHAR(255),
    
    -- Status
    shipment_status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fact_shipments_time ON fact_shipments(time_key);
CREATE INDEX idx_fact_shipments_customer ON fact_shipments(customer_key);
CREATE INDEX idx_fact_shipments_origin ON fact_shipments(origin_location_key);
CREATE INDEX idx_fact_shipments_order ON fact_shipments(order_id);
CREATE INDEX idx_fact_shipments_ship_date ON fact_shipments(ship_date);
CREATE INDEX idx_fact_shipments_performance ON fact_shipments(is_on_time, is_damaged, is_lost);
CREATE INDEX idx_fact_shipments_carrier ON fact_shipments(carrier_name);

-- Fact: Purchases (Procurement)
CREATE TABLE IF NOT EXISTS fact_purchases (
    purchase_key BIGSERIAL PRIMARY KEY,
    
    -- Dimension keys
    time_key INTEGER NOT NULL REFERENCES dim_time(time_key),
    product_key INTEGER NOT NULL REFERENCES dim_product(product_key),
    supplier_key INTEGER NOT NULL REFERENCES dim_supplier(supplier_key),
    location_key INTEGER REFERENCES dim_location(location_key),
    
    -- Source keys
    purchase_order_id INTEGER NOT NULL,
    purchase_order_item_id INTEGER NOT NULL,
    
    -- Measures
    quantity_ordered DECIMAL(15,2) NOT NULL,
    quantity_received DECIMAL(15,2) DEFAULT 0,
    quantity_rejected DECIMAL(15,2) DEFAULT 0,
    
    -- Cost
    unit_price DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    
    -- Quality
    quality_score DECIMAL(3,2),
    defect_count INTEGER DEFAULT 0,
    
    -- Timing
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    lead_time_days INTEGER,
    days_variance INTEGER,
    is_on_time BOOLEAN,
    
    -- Status
    purchase_status VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fact_purchases_time ON fact_purchases(time_key);
CREATE INDEX idx_fact_purchases_product ON fact_purchases(product_key);
CREATE INDEX idx_fact_purchases_supplier ON fact_purchases(supplier_key);
CREATE INDEX idx_fact_purchases_location ON fact_purchases(location_key);
CREATE INDEX idx_fact_purchases_order ON fact_purchases(purchase_order_id);
CREATE INDEX idx_fact_purchases_date ON fact_purchases(order_date);
CREATE INDEX idx_fact_purchases_composite ON fact_purchases(time_key, product_key, supplier_key);

-- =====================================================
-- AGGREGATE TABLES (Pre-calculated for performance)
-- =====================================================

-- Aggregate: Monthly Sales Summary
CREATE TABLE IF NOT EXISTS agg_monthly_sales (
    month_key INTEGER NOT NULL, -- YYYYMM format (e.g., 202512)
    product_key INTEGER REFERENCES dim_product(product_key),
    customer_key INTEGER REFERENCES dim_customer(customer_key),
    location_key INTEGER REFERENCES dim_location(location_key),
    
    -- Aggregated measures
    total_orders INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    total_quantity DECIMAL(15,2) DEFAULT 0,
    
    total_gross_sales DECIMAL(15,2) DEFAULT 0,
    total_discounts DECIMAL(15,2) DEFAULT 0,
    total_net_sales DECIMAL(15,2) DEFAULT 0,
    total_tax DECIMAL(15,2) DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    
    total_cost DECIMAL(15,2) DEFAULT 0,
    total_margin DECIMAL(15,2) DEFAULT 0,
    avg_margin_percentage DECIMAL(5,2),
    
    avg_order_value DECIMAL(15,2),
    avg_items_per_order DECIMAL(10,2),
    
    -- Period
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (month_key, product_key, customer_key, location_key)
);

CREATE INDEX idx_agg_monthly_sales_month ON agg_monthly_sales(month_key);
CREATE INDEX idx_agg_monthly_sales_year ON agg_monthly_sales(year, month);
CREATE INDEX idx_agg_monthly_sales_product ON agg_monthly_sales(product_key);
CREATE INDEX idx_agg_monthly_sales_customer ON agg_monthly_sales(customer_key);

-- Aggregate: Daily Inventory Snapshot
CREATE TABLE IF NOT EXISTS agg_daily_inventory (
    snapshot_date DATE NOT NULL,
    product_key INTEGER REFERENCES dim_product(product_key),
    location_key INTEGER REFERENCES dim_location(location_key),
    
    -- Aggregated measures
    total_quantity_on_hand DECIMAL(15,2) DEFAULT 0,
    total_quantity_reserved DECIMAL(15,2) DEFAULT 0,
    total_quantity_available DECIMAL(15,2) DEFAULT 0,
    total_inventory_value DECIMAL(15,2) DEFAULT 0,
    
    stockout_count INTEGER DEFAULT 0,
    low_stock_count INTEGER DEFAULT 0,
    excess_stock_count INTEGER DEFAULT 0,
    
    avg_days_of_supply DECIMAL(10,2),
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (snapshot_date, product_key, location_key)
);

CREATE INDEX idx_agg_daily_inventory_date ON agg_daily_inventory(snapshot_date);
CREATE INDEX idx_agg_daily_inventory_product ON agg_daily_inventory(product_key);
CREATE INDEX idx_agg_daily_inventory_location ON agg_daily_inventory(location_key);

-- Aggregate: Product Performance Summary
CREATE TABLE IF NOT EXISTS agg_product_performance (
    period_key INTEGER NOT NULL, -- YYYYMM or YYYYWW
    period_type VARCHAR(20) NOT NULL, -- 'month' or 'week'
    product_key INTEGER REFERENCES dim_product(product_key),
    
    -- Sales metrics
    total_sales_quantity DECIMAL(15,2) DEFAULT 0,
    total_sales_revenue DECIMAL(15,2) DEFAULT 0,
    total_sales_margin DECIMAL(15,2) DEFAULT 0,
    total_sales_orders INTEGER DEFAULT 0,
    
    -- Inventory metrics
    avg_inventory_level DECIMAL(15,2),
    inventory_turnover DECIMAL(10,2), -- sales / avg_inventory
    days_of_inventory DECIMAL(10,2), -- 365 / turnover
    
    -- Production metrics
    total_production_quantity DECIMAL(15,2) DEFAULT 0,
    avg_production_efficiency DECIMAL(5,2),
    avg_defect_rate DECIMAL(5,2),
    
    -- Purchase metrics
    total_purchase_quantity DECIMAL(15,2) DEFAULT 0,
    avg_purchase_cost DECIMAL(15,2),
    avg_supplier_lead_time INTEGER,
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (period_key, period_type, product_key)
);

CREATE INDEX idx_agg_product_perf_period ON agg_product_performance(period_key, period_type);
CREATE INDEX idx_agg_product_perf_product ON agg_product_performance(product_key);

-- =====================================================
-- ETL CONTROL & AUDIT TABLES
-- =====================================================

-- ETL Job Execution Log
CREATE TABLE IF NOT EXISTS etl_job_log (
    job_log_id SERIAL PRIMARY KEY,
    job_name VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- 'dimension', 'fact', 'aggregate'
    
    -- Execution details
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    
    -- Status
    status VARCHAR(50) NOT NULL, -- 'running', 'completed', 'failed', 'partial'
    error_message TEXT,
    
    -- Statistics
    rows_extracted INTEGER DEFAULT 0,
    rows_inserted INTEGER DEFAULT 0,
    rows_updated INTEGER DEFAULT 0,
    rows_deleted INTEGER DEFAULT 0,
    rows_rejected INTEGER DEFAULT 0,
    
    -- Source info
    source_system VARCHAR(100),
    source_query TEXT,
    
    executed_by VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_etl_job_log_job ON etl_job_log(job_name, status);
CREATE INDEX idx_etl_job_log_start ON etl_job_log(start_time DESC);

-- ETL Data Quality Check Results
CREATE TABLE IF NOT EXISTS etl_data_quality (
    quality_check_id SERIAL PRIMARY KEY,
    job_log_id INTEGER REFERENCES etl_job_log(job_log_id),
    
    -- Check details
    check_name VARCHAR(255) NOT NULL,
    check_type VARCHAR(50) NOT NULL, -- 'null_check', 'duplicate_check', 'referential_integrity', 'range_check', 'format_check'
    table_name VARCHAR(255) NOT NULL,
    column_name VARCHAR(255),
    
    -- Results
    check_status VARCHAR(50) NOT NULL, -- 'passed', 'failed', 'warning'
    records_checked INTEGER,
    records_failed INTEGER,
    failure_percentage DECIMAL(5,2),
    
    -- Details
    check_query TEXT,
    error_details TEXT,
    sample_failed_records JSONB,
    
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_etl_quality_job ON etl_data_quality(job_log_id);
CREATE INDEX idx_etl_quality_status ON etl_data_quality(check_status) WHERE check_status = 'failed';

-- ETL Incremental Load Tracking
CREATE TABLE IF NOT EXISTS etl_load_control (
    control_id SERIAL PRIMARY KEY,
    table_name VARCHAR(255) NOT NULL UNIQUE,
    
    -- Last load info
    last_load_date TIMESTAMP,
    last_extract_date TIMESTAMP,
    last_record_id INTEGER,
    last_record_timestamp TIMESTAMP,
    
    -- Watermark for incremental loads
    high_watermark VARCHAR(255), -- Max ID or timestamp from last load
    
    -- Load configuration
    load_type VARCHAR(50) NOT NULL DEFAULT 'incremental', -- 'full', 'incremental'
    load_frequency VARCHAR(50), -- 'hourly', 'daily', 'weekly'
    is_active BOOLEAN DEFAULT TRUE,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ETL STORED PROCEDURES
-- =====================================================

-- Populate dim_time with dates
CREATE OR REPLACE FUNCTION populate_dim_time(
    start_date DATE,
    end_date DATE
) RETURNS INTEGER AS $$
DECLARE
    current_date DATE;
    inserted_count INTEGER := 0;
BEGIN
    current_date := start_date;
    
    WHILE current_date <= end_date LOOP
        INSERT INTO dim_time (
            time_key,
            full_date,
            year,
            quarter,
            month,
            month_name,
            week_of_year,
            day_of_month,
            day_of_week,
            day_name,
            is_weekend,
            year_month,
            year_quarter,
            fiscal_year,
            fiscal_quarter
        ) VALUES (
            TO_CHAR(current_date, 'YYYYMMDD')::INTEGER,
            current_date,
            EXTRACT(YEAR FROM current_date)::INTEGER,
            EXTRACT(QUARTER FROM current_date)::INTEGER,
            EXTRACT(MONTH FROM current_date)::INTEGER,
            TO_CHAR(current_date, 'Month'),
            EXTRACT(WEEK FROM current_date)::INTEGER,
            EXTRACT(DAY FROM current_date)::INTEGER,
            EXTRACT(DOW FROM current_date)::INTEGER,
            TO_CHAR(current_date, 'Day'),
            EXTRACT(DOW FROM current_date) IN (0, 6),
            TO_CHAR(current_date, 'YYYY-MM'),
            TO_CHAR(current_date, 'YYYY-"Q"Q'),
            EXTRACT(YEAR FROM current_date)::INTEGER,
            EXTRACT(QUARTER FROM current_date)::INTEGER
        ) ON CONFLICT (full_date) DO NOTHING;
        
        inserted_count := inserted_count + 1;
        current_date := current_date + INTERVAL '1 day';
    END LOOP;
    
    -- Update current flags
    UPDATE dim_time SET is_current_day = FALSE;
    UPDATE dim_time SET is_current_day = TRUE WHERE full_date = CURRENT_DATE;
    
    UPDATE dim_time SET is_current_week = FALSE;
    UPDATE dim_time SET is_current_week = TRUE WHERE week_of_year = EXTRACT(WEEK FROM CURRENT_DATE) AND year = EXTRACT(YEAR FROM CURRENT_DATE);
    
    UPDATE dim_time SET is_current_month = FALSE;
    UPDATE dim_time SET is_current_month = TRUE WHERE year = EXTRACT(YEAR FROM CURRENT_DATE) AND month = EXTRACT(MONTH FROM CURRENT_DATE);
    
    UPDATE dim_time SET is_current_quarter = FALSE;
    UPDATE dim_time SET is_current_quarter = TRUE WHERE year = EXTRACT(YEAR FROM CURRENT_DATE) AND quarter = EXTRACT(QUARTER FROM CURRENT_DATE);
    
    UPDATE dim_time SET is_current_year = FALSE;
    UPDATE dim_time SET is_current_year = TRUE WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);
    
    RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED TIME DIMENSION (2020-2030)
-- =====================================================

SELECT populate_dim_time('2020-01-01'::DATE, '2030-12-31'::DATE);

-- =====================================================
-- DATA QUALITY VIEWS
-- =====================================================

-- View: ETL Job Summary
CREATE OR REPLACE VIEW v_etl_job_summary AS
SELECT 
    job_name,
    job_type,
    COUNT(*) as total_runs,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_runs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_runs,
    AVG(duration_seconds) as avg_duration_seconds,
    MAX(end_time) as last_run_time,
    SUM(rows_inserted) as total_rows_inserted,
    SUM(rows_updated) as total_rows_updated
FROM etl_job_log
GROUP BY job_name, job_type;

-- View: Data Quality Dashboard
CREATE OR REPLACE VIEW v_data_quality_dashboard AS
SELECT 
    table_name,
    check_type,
    COUNT(*) as total_checks,
    COUNT(*) FILTER (WHERE check_status = 'passed') as passed_checks,
    COUNT(*) FILTER (WHERE check_status = 'failed') as failed_checks,
    COUNT(*) FILTER (WHERE check_status = 'warning') as warning_checks,
    AVG(failure_percentage) as avg_failure_rate,
    MAX(checked_at) as last_checked_at
FROM etl_data_quality
GROUP BY table_name, check_type;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE dim_time IS 'Time dimension with date hierarchy and business attributes';
COMMENT ON TABLE dim_product IS 'Product dimension with SCD Type 2 for historical tracking';
COMMENT ON TABLE dim_customer IS 'Customer dimension with SCD Type 2 for historical tracking';
COMMENT ON TABLE dim_location IS 'Location dimension for warehouses, stores, and distribution centers';
COMMENT ON TABLE dim_supplier IS 'Supplier dimension with performance metrics';
COMMENT ON TABLE dim_employee IS 'Employee dimension for sales reps and managers';

COMMENT ON TABLE fact_sales IS 'Sales fact table with order line item details';
COMMENT ON TABLE fact_inventory IS 'Inventory fact table with daily snapshots';
COMMENT ON TABLE fact_production IS 'Production fact table with manufacturing orders';
COMMENT ON TABLE fact_shipments IS 'Shipments fact table with logistics performance';
COMMENT ON TABLE fact_purchases IS 'Purchases fact table with procurement details';

COMMENT ON TABLE agg_monthly_sales IS 'Pre-aggregated monthly sales metrics';
COMMENT ON TABLE agg_daily_inventory IS 'Pre-aggregated daily inventory snapshots';
COMMENT ON TABLE agg_product_performance IS 'Pre-aggregated product performance metrics';

COMMENT ON TABLE etl_job_log IS 'ETL job execution audit log';
COMMENT ON TABLE etl_data_quality IS 'Data quality check results';
COMMENT ON TABLE etl_load_control IS 'Incremental load tracking and configuration';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant read access to analytics users
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_users;
-- GRANT SELECT ON v_etl_job_summary, v_data_quality_dashboard TO analytics_users;

-- =====================================================
-- END OF DATA WAREHOUSE SCHEMA
-- =====================================================
