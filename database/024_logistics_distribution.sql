-- =====================================================
-- Phase 5: Logistics & Distribution System
-- Ocean ERP Database Schema
-- Created: December 2, 2025
-- Target: 79% Operations Capability
-- =====================================================

-- =====================================================
-- 1. CARRIERS & RATE MANAGEMENT
-- =====================================================

-- Carrier/Shipping Provider Master
CREATE TABLE IF NOT EXISTS carriers (
    id SERIAL PRIMARY KEY,
    carrier_code VARCHAR(50) UNIQUE NOT NULL,
    carrier_name VARCHAR(200) NOT NULL,
    carrier_type VARCHAR(50) NOT NULL CHECK (carrier_type IN (
        'courier', 'freight', 'parcel', 'ltl', 'ftl', '3pl', 'last_mile', 'postal'
    )),
    service_level VARCHAR(50), -- 'express', 'standard', 'economy', 'same_day'
    contact_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT,
    tracking_url_template VARCHAR(500), -- e.g., 'https://track.carrier.com/{tracking_number}'
    supports_label_generation BOOLEAN DEFAULT false,
    supports_tracking BOOLEAN DEFAULT true,
    supports_pickup BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Carrier Rate Cards
CREATE TABLE IF NOT EXISTS carrier_rates (
    id SERIAL PRIMARY KEY,
    carrier_id INTEGER NOT NULL REFERENCES carriers(id) ON DELETE CASCADE,
    rate_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(50) NOT NULL, -- 'express', 'standard', 'economy'
    origin_zone_id INTEGER, -- REFERENCES delivery_zones(id)
    destination_zone_id INTEGER, -- REFERENCES delivery_zones(id)
    weight_min_kg DECIMAL(10,2) DEFAULT 0,
    weight_max_kg DECIMAL(10,2),
    dimension_factor DECIMAL(10,4) DEFAULT 5000, -- For volumetric weight
    base_rate DECIMAL(10,2) NOT NULL,
    rate_per_kg DECIMAL(10,2) DEFAULT 0,
    rate_per_km DECIMAL(10,2) DEFAULT 0,
    fuel_surcharge_percent DECIMAL(5,2) DEFAULT 0,
    minimum_charge DECIMAL(10,2) DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'USD',
    valid_from DATE NOT NULL,
    valid_to DATE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. DELIVERY ZONES & GEOGRAPHIC DATA
-- =====================================================

-- Delivery Zones (Postal Code/Region Groupings)
CREATE TABLE IF NOT EXISTS delivery_zones (
    id SERIAL PRIMARY KEY,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    zone_name VARCHAR(200) NOT NULL,
    zone_type VARCHAR(50) NOT NULL CHECK (zone_type IN (
        'postal', 'city', 'region', 'state', 'country', 'custom'
    )),
    country_code VARCHAR(3) NOT NULL,
    state_province VARCHAR(100),
    city VARCHAR(100),
    postal_code_pattern VARCHAR(50), -- Regex pattern, e.g., '^90[0-9]{3}$'
    delivery_sla_hours INTEGER DEFAULT 48, -- Standard delivery time
    is_remote BOOLEAN DEFAULT false,
    remote_surcharge_percent DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouse/Distribution Center Locations
CREATE TABLE IF NOT EXISTS warehouse_locations (
    id SERIAL PRIMARY KEY,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    location_type VARCHAR(50) NOT NULL CHECK (location_type IN (
        'warehouse', 'distribution_center', 'fulfillment_center', 
        'cross_dock', 'retail_store', 'depot'
    )),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    delivery_zone_id INTEGER REFERENCES delivery_zones(id),
    is_origin BOOLEAN DEFAULT true, -- Can ship from here
    is_destination BOOLEAN DEFAULT false, -- Can receive here
    loading_docks_count INTEGER DEFAULT 0,
    max_daily_shipments INTEGER DEFAULT 100,
    operating_hours VARCHAR(100), -- e.g., 'Mon-Fri 8AM-6PM'
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loading Docks Management
CREATE TABLE IF NOT EXISTS loading_docks (
    id SERIAL PRIMARY KEY,
    warehouse_location_id INTEGER NOT NULL REFERENCES warehouse_locations(id) ON DELETE CASCADE,
    dock_number VARCHAR(20) NOT NULL,
    dock_type VARCHAR(50) NOT NULL CHECK (dock_type IN (
        'loading', 'unloading', 'cross_dock', 'staging'
    )),
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN (
        'available', 'occupied', 'reserved', 'maintenance', 'closed'
    )),
    current_shipment_id INTEGER, -- REFERENCES shipments(id)
    equipment_type VARCHAR(50), -- 'forklift', 'pallet_jack', 'conveyor'
    max_weight_capacity_kg DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_location_id, dock_number)
);

-- =====================================================
-- 3. SHIPMENT MANAGEMENT
-- =====================================================

-- Shipment Master
CREATE TABLE IF NOT EXISTS shipments (
    id SERIAL PRIMARY KEY,
    shipment_number VARCHAR(50) UNIQUE NOT NULL,
    shipment_type VARCHAR(50) NOT NULL CHECK (shipment_type IN (
        'sales_order', 'transfer_order', 'purchase_return', 'sample', 'other'
    )),
    source_id INTEGER, -- sales_order_id, transfer_order_id, etc.
    source_type VARCHAR(50), -- 'sales_order', 'transfer_order'
    
    -- Origin & Destination
    origin_location_id INTEGER REFERENCES warehouse_locations(id),
    destination_type VARCHAR(50) NOT NULL CHECK (destination_type IN (
        'customer', 'warehouse', 'store', 'vendor', 'other'
    )),
    destination_id INTEGER, -- customer_id, warehouse_id, etc.
    destination_name VARCHAR(200) NOT NULL,
    destination_address_line1 VARCHAR(255) NOT NULL,
    destination_address_line2 VARCHAR(255),
    destination_city VARCHAR(100) NOT NULL,
    destination_state VARCHAR(100),
    destination_postal_code VARCHAR(20) NOT NULL,
    destination_country VARCHAR(3) NOT NULL,
    destination_latitude DECIMAL(10,8),
    destination_longitude DECIMAL(11,8),
    delivery_zone_id INTEGER REFERENCES delivery_zones(id),
    
    -- Contact Info
    contact_name VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    delivery_instructions TEXT,
    
    -- Carrier & Service
    carrier_id INTEGER REFERENCES carriers(id),
    service_type VARCHAR(50), -- 'express', 'standard', 'economy'
    tracking_number VARCHAR(100),
    carrier_reference VARCHAR(100),
    
    -- Schedule
    planned_ship_date DATE,
    actual_ship_date DATE,
    estimated_delivery_date DATE,
    requested_delivery_date DATE,
    actual_delivery_date DATE,
    delivery_time_slot VARCHAR(50), -- 'morning', 'afternoon', '9AM-12PM'
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending', 'picked', 'packed', 'manifested', 
        'in_transit', 'out_for_delivery', 'delivered', 
        'failed_delivery', 'returned', 'cancelled'
    )),
    
    -- Packaging
    package_count INTEGER DEFAULT 1,
    total_weight_kg DECIMAL(10,2),
    total_volume_m3 DECIMAL(10,4),
    package_type VARCHAR(50), -- 'box', 'pallet', 'envelope', 'crate'
    
    -- Costs
    freight_cost DECIMAL(10,2) DEFAULT 0,
    fuel_surcharge DECIMAL(10,2) DEFAULT 0,
    accessorial_charges DECIMAL(10,2) DEFAULT 0,
    total_shipping_cost DECIMAL(10,2) DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'USD',
    
    -- Proof of Delivery
    pod_signature_url TEXT,
    pod_photo_url TEXT,
    pod_notes TEXT,
    delivered_by VARCHAR(100),
    received_by VARCHAR(100),
    
    -- Tracking
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('urgent', 'high', 'normal', 'low')),
    requires_signature BOOLEAN DEFAULT false,
    requires_appointment BOOLEAN DEFAULT false,
    is_cod BOOLEAN DEFAULT false, -- Cash on Delivery
    cod_amount DECIMAL(10,2),
    is_hazardous BOOLEAN DEFAULT false,
    temperature_controlled BOOLEAN DEFAULT false,
    temperature_range VARCHAR(50), -- '2-8°C'
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    
    -- Add index on tracking_number for faster lookups
    CHECK (actual_ship_date IS NULL OR actual_ship_date >= planned_ship_date),
    CHECK (actual_delivery_date IS NULL OR actual_delivery_date >= actual_ship_date)
);

-- Shipment Items (Line Items)
CREATE TABLE IF NOT EXISTS shipment_items (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    source_line_id INTEGER, -- sales_order_item_id, etc.
    product_id INTEGER REFERENCES products(id),
    sku VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    quantity_ordered DECIMAL(10,2) NOT NULL,
    quantity_shipped DECIMAL(10,2) NOT NULL,
    quantity_delivered DECIMAL(10,2) DEFAULT 0,
    uom VARCHAR(20) NOT NULL,
    weight_kg DECIMAL(10,2),
    volume_m3 DECIMAL(10,4),
    lot_number VARCHAR(50),
    serial_numbers TEXT[], -- Array of serial numbers
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (quantity_shipped <= quantity_ordered),
    CHECK (quantity_delivered <= quantity_shipped)
);

-- Shipment Packages (for multi-package shipments)
CREATE TABLE IF NOT EXISTS shipment_packages (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    package_number VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100),
    package_type VARCHAR(50) NOT NULL, -- 'box', 'pallet', 'envelope'
    weight_kg DECIMAL(10,2) NOT NULL,
    length_cm DECIMAL(10,2),
    width_cm DECIMAL(10,2),
    height_cm DECIMAL(10,2),
    volume_m3 DECIMAL(10,4),
    label_url TEXT,
    barcode VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(shipment_id, package_number)
);

-- =====================================================
-- 4. ROUTE PLANNING & OPTIMIZATION
-- =====================================================

-- Delivery Routes
CREATE TABLE IF NOT EXISTS delivery_routes (
    id SERIAL PRIMARY KEY,
    route_number VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    route_date DATE NOT NULL,
    driver_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER, -- REFERENCES vehicles(id) if you have a fleet module
    vehicle_type VARCHAR(50),
    vehicle_capacity_kg DECIMAL(10,2),
    carrier_id INTEGER REFERENCES carriers(id),
    
    -- Route Details
    origin_location_id INTEGER REFERENCES warehouse_locations(id),
    total_stops INTEGER DEFAULT 0,
    total_distance_km DECIMAL(10,2) DEFAULT 0,
    estimated_duration_minutes INTEGER DEFAULT 0,
    actual_duration_minutes INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN (
        'planned', 'scheduled', 'in_progress', 'completed', 'cancelled'
    )),
    
    -- Schedule
    planned_start_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    planned_end_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    
    -- Optimization
    optimization_method VARCHAR(50), -- 'distance', 'time', 'cost', 'manual'
    sequence_locked BOOLEAN DEFAULT false,
    
    -- Costs
    estimated_cost DECIMAL(10,2) DEFAULT 0,
    actual_cost DECIMAL(10,2) DEFAULT 0,
    fuel_cost DECIMAL(10,2) DEFAULT 0,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Route Stops (Sequence of deliveries on a route)
CREATE TABLE IF NOT EXISTS route_stops (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES delivery_routes(id) ON DELETE CASCADE,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id),
    stop_sequence INTEGER NOT NULL,
    stop_type VARCHAR(50) DEFAULT 'delivery' CHECK (stop_type IN (
        'pickup', 'delivery', 'both', 'break', 'fuel'
    )),
    
    -- Location
    location_name VARCHAR(200) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Schedule
    planned_arrival_time TIMESTAMP,
    actual_arrival_time TIMESTAMP,
    planned_departure_time TIMESTAMP,
    actual_departure_time TIMESTAMP,
    time_window_start TIME,
    time_window_end TIME,
    service_time_minutes INTEGER DEFAULT 15, -- Time needed at stop
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'en_route', 'arrived', 'completed', 'failed', 'skipped'
    )),
    
    -- Distances
    distance_from_previous_km DECIMAL(10,2) DEFAULT 0,
    distance_to_next_km DECIMAL(10,2) DEFAULT 0,
    
    -- Delivery Details
    delivery_notes TEXT,
    failure_reason TEXT,
    proof_of_delivery_url TEXT,
    signature_url TEXT,
    photo_urls TEXT[],
    
    is_priority BOOLEAN DEFAULT false,
    requires_appointment BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, stop_sequence),
    CHECK (actual_departure_time IS NULL OR actual_departure_time >= actual_arrival_time)
);

-- =====================================================
-- 5. TRACKING & EVENTS
-- =====================================================

-- Shipment Tracking Events
CREATE TABLE IF NOT EXISTS shipment_tracking_events (
    id SERIAL PRIMARY KEY,
    shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'created', 'picked', 'packed', 'manifested', 'shipped', 
        'in_transit', 'out_for_delivery', 'delivered', 'exception',
        'delayed', 'returned', 'cancelled', 'location_update'
    )),
    event_status VARCHAR(50) NOT NULL, -- 'info', 'warning', 'error', 'success'
    event_code VARCHAR(50), -- Carrier-specific code
    event_description TEXT NOT NULL,
    event_location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    event_timestamp TIMESTAMP NOT NULL,
    carrier_event_data JSONB, -- Raw carrier API response
    is_customer_visible BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- =====================================================
-- 6. DELIVERY PERFORMANCE & METRICS
-- =====================================================

-- Delivery Performance Tracking
CREATE TABLE IF NOT EXISTS delivery_performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_period_start DATE NOT NULL,
    metric_period_end DATE NOT NULL,
    carrier_id INTEGER REFERENCES carriers(id),
    delivery_zone_id INTEGER REFERENCES delivery_zones(id),
    route_id INTEGER REFERENCES delivery_routes(id),
    
    -- Volume Metrics
    total_shipments INTEGER DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    total_packages INTEGER DEFAULT 0,
    
    -- Time Metrics
    on_time_deliveries INTEGER DEFAULT 0,
    late_deliveries INTEGER DEFAULT 0,
    early_deliveries INTEGER DEFAULT 0,
    avg_delivery_time_hours DECIMAL(10,2),
    avg_delay_hours DECIMAL(10,2),
    
    -- Performance Percentages
    on_time_delivery_rate DECIMAL(5,2), -- Percentage
    first_attempt_success_rate DECIMAL(5,2),
    
    -- Distance & Efficiency
    total_distance_km DECIMAL(10,2) DEFAULT 0,
    avg_distance_per_delivery_km DECIMAL(10,2),
    
    -- Cost Metrics
    total_freight_cost DECIMAL(10,2) DEFAULT 0,
    avg_cost_per_delivery DECIMAL(10,2),
    cost_per_km DECIMAL(10,2),
    
    -- Quality Metrics
    damage_incidents INTEGER DEFAULT 0,
    lost_packages INTEGER DEFAULT 0,
    failed_delivery_attempts INTEGER DEFAULT 0,
    customer_complaints INTEGER DEFAULT 0,
    
    -- Rating
    avg_customer_rating DECIMAL(3,2), -- 0.00 to 5.00
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(metric_period_start, metric_period_end, carrier_id, delivery_zone_id, route_id)
);

-- =====================================================
-- 7. TRANSPORTATION COSTS
-- =====================================================

-- Detailed Transportation Cost Tracking
CREATE TABLE IF NOT EXISTS transportation_costs (
    id SERIAL PRIMARY KEY,
    cost_date DATE NOT NULL,
    shipment_id INTEGER REFERENCES shipments(id),
    route_id INTEGER REFERENCES delivery_routes(id),
    carrier_id INTEGER REFERENCES carriers(id),
    
    -- Cost Categories
    base_freight_cost DECIMAL(10,2) DEFAULT 0,
    fuel_surcharge DECIMAL(10,2) DEFAULT 0,
    residential_delivery_fee DECIMAL(10,2) DEFAULT 0,
    lift_gate_fee DECIMAL(10,2) DEFAULT 0,
    inside_delivery_fee DECIMAL(10,2) DEFAULT 0,
    appointment_fee DECIMAL(10,2) DEFAULT 0,
    redelivery_fee DECIMAL(10,2) DEFAULT 0,
    storage_fee DECIMAL(10,2) DEFAULT 0,
    insurance_fee DECIMAL(10,2) DEFAULT 0,
    customs_fees DECIMAL(10,2) DEFAULT 0,
    other_fees DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) NOT NULL,
    
    currency_code VARCHAR(3) DEFAULT 'USD',
    
    -- Allocation
    cost_center VARCHAR(50),
    department VARCHAR(50),
    project_code VARCHAR(50),
    
    -- Invoice Matching
    carrier_invoice_number VARCHAR(100),
    invoice_date DATE,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'approved', 'paid', 'disputed', 'void'
    )),
    
    -- Reconciliation
    is_reconciled BOOLEAN DEFAULT false,
    variance_amount DECIMAL(10,2) DEFAULT 0,
    variance_reason TEXT,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- =====================================================
-- 8. REVERSE LOGISTICS (RETURNS)
-- =====================================================

-- Return Merchandise Authorization (RMA)
CREATE TABLE IF NOT EXISTS return_authorizations (
    id SERIAL PRIMARY KEY,
    rma_number VARCHAR(50) UNIQUE NOT NULL,
    original_shipment_id INTEGER REFERENCES shipments(id),
    customer_id INTEGER, -- REFERENCES customers(id)
    return_reason VARCHAR(100) NOT NULL,
    return_type VARCHAR(50) NOT NULL CHECK (return_type IN (
        'defective', 'damaged', 'wrong_item', 'excess', 'warranty', 'other'
    )),
    
    -- Authorization
    authorized_by INTEGER REFERENCES users(id),
    authorization_date DATE NOT NULL,
    expiry_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'authorized' CHECK (status IN (
        'authorized', 'label_sent', 'in_transit', 'received', 
        'inspected', 'restocked', 'scrapped', 'cancelled'
    )),
    
    -- Return Shipment
    return_shipment_id INTEGER, -- REFERENCES shipments(id)
    return_carrier_id INTEGER REFERENCES carriers(id),
    return_tracking_number VARCHAR(100),
    prepaid_label_url TEXT,
    
    -- Disposition
    disposition VARCHAR(50), -- 'restock', 'refurbish', 'scrap', 'vendor_return'
    restocked_date DATE,
    refund_amount DECIMAL(10,2),
    restock_fee DECIMAL(10,2) DEFAULT 0,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Return Items
CREATE TABLE IF NOT EXISTS return_items (
    id SERIAL PRIMARY KEY,
    rma_id INTEGER NOT NULL REFERENCES return_authorizations(id) ON DELETE CASCADE,
    original_shipment_item_id INTEGER REFERENCES shipment_items(id),
    product_id INTEGER REFERENCES products(id),
    sku VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    quantity_returned DECIMAL(10,2) NOT NULL,
    quantity_accepted DECIMAL(10,2) DEFAULT 0,
    quantity_rejected DECIMAL(10,2) DEFAULT 0,
    uom VARCHAR(20) NOT NULL,
    
    -- Condition Assessment
    condition_received VARCHAR(50), -- 'new', 'good', 'damaged', 'defective'
    defect_description TEXT,
    inspection_notes TEXT,
    
    -- Disposition
    disposition VARCHAR(50), -- 'restock', 'refurbish', 'scrap', 'vendor_return'
    restocked_to_location_id INTEGER REFERENCES warehouse_locations(id),
    
    -- Financial
    unit_price DECIMAL(10,2),
    refund_amount DECIMAL(10,2),
    restock_fee DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (quantity_returned = quantity_accepted + quantity_rejected)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Carriers
CREATE INDEX IF NOT EXISTS idx_carriers_type ON carriers(carrier_type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_carriers_active ON carriers(is_active);

-- Carrier Rates
CREATE INDEX IF NOT EXISTS idx_carrier_rates_lookup ON carrier_rates(carrier_id, origin_zone_id, destination_zone_id) 
    WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_carrier_rates_validity ON carrier_rates(valid_from, valid_to);

-- Delivery Zones
CREATE INDEX IF NOT EXISTS idx_delivery_zones_country ON delivery_zones(country_code, state_province);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_postal ON delivery_zones(postal_code_pattern);

-- Warehouse Locations
CREATE INDEX IF NOT EXISTS idx_warehouse_locations_coords ON warehouse_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_warehouse_locations_zone ON warehouse_locations(delivery_zone_id);

-- Shipments
CREATE INDEX IF NOT EXISTS idx_shipments_number ON shipments(shipment_number);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_dates ON shipments(planned_ship_date, actual_ship_date);
CREATE INDEX IF NOT EXISTS idx_shipments_source ON shipments(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_zone ON shipments(delivery_zone_id);

-- Shipment Items
CREATE INDEX IF NOT EXISTS idx_shipment_items_shipment ON shipment_items(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_items_product ON shipment_items(product_id);

-- Routes
CREATE INDEX IF NOT EXISTS idx_delivery_routes_date ON delivery_routes(route_date, status);
CREATE INDEX IF NOT EXISTS idx_delivery_routes_driver ON delivery_routes(driver_id);

-- Route Stops
CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id, stop_sequence);
CREATE INDEX IF NOT EXISTS idx_route_stops_shipment ON route_stops(shipment_id);
CREATE INDEX IF NOT EXISTS idx_route_stops_status ON route_stops(status);

-- Tracking Events
CREATE INDEX IF NOT EXISTS idx_tracking_events_shipment ON shipment_tracking_events(shipment_id, event_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tracking_events_type ON shipment_tracking_events(event_type);

-- Performance Metrics
CREATE INDEX IF NOT EXISTS idx_delivery_performance_period ON delivery_performance_metrics(metric_period_start, metric_period_end);
CREATE INDEX IF NOT EXISTS idx_delivery_performance_carrier ON delivery_performance_metrics(carrier_id);

-- Transportation Costs
CREATE INDEX IF NOT EXISTS idx_transportation_costs_date ON transportation_costs(cost_date);
CREATE INDEX IF NOT EXISTS idx_transportation_costs_shipment ON transportation_costs(shipment_id);
CREATE INDEX IF NOT EXISTS idx_transportation_costs_invoice ON transportation_costs(carrier_invoice_number);

-- Return Authorizations
CREATE INDEX IF NOT EXISTS idx_rma_number ON return_authorizations(rma_number);
CREATE INDEX IF NOT EXISTS idx_rma_status ON return_authorizations(status);
CREATE INDEX IF NOT EXISTS idx_rma_original_shipment ON return_authorizations(original_shipment_id);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active Shipments Dashboard
CREATE OR REPLACE VIEW v_active_shipments AS
SELECT 
    s.id,
    s.shipment_number,
    s.shipment_type,
    s.status,
    s.tracking_number,
    c.carrier_name,
    s.destination_name,
    s.destination_city,
    s.destination_state,
    wl.location_name as origin_name,
    s.planned_ship_date,
    s.actual_ship_date,
    s.estimated_delivery_date,
    s.actual_delivery_date,
    CASE 
        WHEN s.actual_delivery_date IS NOT NULL THEN 
            EXTRACT(DAY FROM (s.actual_delivery_date - s.actual_ship_date))
        ELSE 
            EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(s.actual_ship_date, s.planned_ship_date)))
    END as days_in_transit,
    s.package_count,
    s.total_weight_kg,
    s.total_shipping_cost,
    s.priority,
    (SELECT COUNT(*) FROM shipment_items si WHERE si.shipment_id = s.id) as item_count,
    (SELECT event_description 
     FROM shipment_tracking_events 
     WHERE shipment_id = s.id 
     ORDER BY event_timestamp DESC 
     LIMIT 1) as latest_event
FROM shipments s
LEFT JOIN carriers c ON s.carrier_id = c.id
LEFT JOIN warehouse_locations wl ON s.origin_location_id = wl.id
WHERE s.status NOT IN ('delivered', 'cancelled')
ORDER BY s.priority DESC, s.planned_ship_date ASC;

-- Route Performance Dashboard
CREATE OR REPLACE VIEW v_route_performance AS
SELECT 
    dr.id,
    dr.route_number,
    dr.route_name,
    dr.route_date,
    dr.status,
    u.name as driver_name,
    c.carrier_name,
    dr.total_stops,
    dr.total_distance_km,
    dr.estimated_duration_minutes,
    dr.actual_duration_minutes,
    dr.estimated_cost,
    dr.actual_cost,
    COUNT(rs.id) as stops_count,
    COUNT(CASE WHEN rs.status = 'completed' THEN 1 END) as completed_stops,
    COUNT(CASE WHEN rs.status = 'failed' THEN 1 END) as failed_stops,
    ROUND(COUNT(CASE WHEN rs.status = 'completed' THEN 1 END)::NUMERIC / 
          NULLIF(COUNT(rs.id), 0) * 100, 2) as completion_rate
FROM delivery_routes dr
LEFT JOIN users u ON dr.driver_id = u.id
LEFT JOIN carriers c ON dr.carrier_id = c.id
LEFT JOIN route_stops rs ON dr.id = rs.route_id
GROUP BY dr.id, dr.route_number, dr.route_name, dr.route_date, dr.status,
         u.name, c.carrier_name, dr.total_stops, dr.total_distance_km,
         dr.estimated_duration_minutes, dr.actual_duration_minutes,
         dr.estimated_cost, dr.actual_cost
ORDER BY dr.route_date DESC;

-- Carrier Performance Summary
CREATE OR REPLACE VIEW v_carrier_performance AS
SELECT 
    c.id,
    c.carrier_name,
    c.carrier_type,
    c.service_level,
    c.rating,
    COUNT(DISTINCT s.id) as total_shipments,
    COUNT(CASE WHEN s.status = 'delivered' THEN 1 END) as delivered_shipments,
    COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries,
    ROUND(AVG(EXTRACT(DAY FROM (s.actual_delivery_date - s.actual_ship_date))), 2) as avg_delivery_days,
    ROUND(AVG(s.total_shipping_cost), 2) as avg_shipping_cost,
    SUM(s.total_shipping_cost) as total_revenue,
    COUNT(CASE 
        WHEN s.actual_delivery_date IS NOT NULL 
        AND s.estimated_delivery_date IS NOT NULL 
        AND s.actual_delivery_date <= s.estimated_delivery_date 
        THEN 1 
    END) as on_time_deliveries,
    ROUND(
        COUNT(CASE 
            WHEN s.actual_delivery_date IS NOT NULL 
            AND s.estimated_delivery_date IS NOT NULL 
            AND s.actual_delivery_date <= s.estimated_delivery_date 
            THEN 1 
        END)::NUMERIC / 
        NULLIF(COUNT(CASE WHEN s.actual_delivery_date IS NOT NULL THEN 1 END), 0) * 100, 
        2
    ) as on_time_percentage
FROM carriers c
LEFT JOIN shipments s ON c.id = s.carrier_id
WHERE c.is_active = true
GROUP BY c.id, c.carrier_name, c.carrier_type, c.service_level, c.rating
ORDER BY total_shipments DESC;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert Sample Carriers
INSERT INTO carriers (carrier_code, carrier_name, carrier_type, service_level, contact_email, contact_phone, supports_label_generation, supports_tracking, is_active, rating, created_by)
VALUES 
    ('FEDEX', 'FedEx Corporation', 'courier', 'express', 'support@fedex.com', '1-800-463-3339', true, true, true, 4.50, 1),
    ('UPS', 'United Parcel Service', 'courier', 'standard', 'support@ups.com', '1-800-742-5877', true, true, true, 4.30, 1),
    ('USPS', 'United States Postal Service', 'postal', 'economy', 'support@usps.com', '1-800-275-8777', false, true, true, 3.80, 1),
    ('DHL', 'DHL Express', 'courier', 'express', 'support@dhl.com', '1-800-225-5345', true, true, true, 4.40, 1),
    ('LOCAL', 'Local Delivery Service', 'last_mile', 'standard', 'info@localdelivery.com', '555-0100', false, true, true, 4.00, 1)
ON CONFLICT (carrier_code) DO NOTHING;

-- Insert Sample Delivery Zones
INSERT INTO delivery_zones (zone_code, zone_name, zone_type, country_code, state_province, delivery_sla_hours, is_remote, is_active)
VALUES 
    ('US-CA-SF', 'San Francisco Bay Area', 'region', 'USA', 'California', 24, false, true),
    ('US-CA-LA', 'Los Angeles Metro', 'region', 'USA', 'California', 24, false, true),
    ('US-NY-NYC', 'New York City Metro', 'region', 'USA', 'New York', 24, false, true),
    ('US-TX-DFW', 'Dallas-Fort Worth', 'region', 'USA', 'Texas', 48, false, true),
    ('US-REMOTE', 'Remote US Areas', 'custom', 'USA', NULL, 120, true, true)
ON CONFLICT (zone_code) DO NOTHING;

-- Insert Sample Warehouse Location
INSERT INTO warehouse_locations (location_code, location_name, location_type, address_line1, city, state_province, postal_code, country_code, latitude, longitude, is_origin, is_destination, loading_docks_count, max_daily_shipments, is_active)
VALUES 
    ('WH-MAIN', 'Main Distribution Center', 'distribution_center', '123 Warehouse Way', 'Los Angeles', 'California', '90001', 'USA', 34.0522, -118.2437, true, true, 8, 500, true),
    ('WH-EAST', 'East Coast Fulfillment', 'fulfillment_center', '456 Distribution Dr', 'Newark', 'New Jersey', '07102', 'USA', 40.7357, -74.1724, true, true, 6, 300, true)
ON CONFLICT (location_code) DO NOTHING;

-- Insert Sample Loading Docks
INSERT INTO loading_docks (warehouse_location_id, dock_number, dock_type, status, max_weight_capacity_kg, is_active)
SELECT 
    wl.id,
    'DOCK-' || generate_series,
    CASE WHEN generate_series % 3 = 0 THEN 'cross_dock' ELSE 'loading' END,
    'available',
    5000,
    true
FROM warehouse_locations wl, generate_series(1, 4)
WHERE wl.location_code = 'WH-MAIN'
ON CONFLICT (warehouse_location_id, dock_number) DO NOTHING;

-- Success Message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Phase 5 Logistics & Distribution Schema Created Successfully!';
    RAISE NOTICE '📊 Tables: 17 core tables + 3 views';
    RAISE NOTICE '🚚 Features: Shipments, Routes, Carriers, Tracking, Returns';
    RAISE NOTICE '📍 Seed Data: 5 carriers, 5 zones, 2 warehouses, 4 docks';
END $$;
