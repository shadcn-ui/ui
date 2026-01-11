-- =====================================================
-- Phase 5: Logistics Schema Fixes & Migrations
-- Handles conflicts with existing tables
-- Created: December 2, 2025
-- =====================================================

-- =====================================================
-- 1. ALTER EXISTING SHIPMENTS TABLE
-- =====================================================

-- Rename existing shipments to logistics_shipments or extend it
-- The existing shipments table is simpler, so we'll extend it

ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS shipment_type VARCHAR(50) CHECK (shipment_type IN (
    'sales_order', 'transfer_order', 'purchase_return', 'sample', 'other'
)),
ADD COLUMN IF NOT EXISTS source_id INTEGER,
ADD COLUMN IF NOT EXISTS source_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS origin_location_id INTEGER REFERENCES warehouse_locations(id),
ADD COLUMN IF NOT EXISTS destination_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS destination_id INTEGER,
ADD COLUMN IF NOT EXISTS destination_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS destination_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS destination_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS destination_country VARCHAR(3) DEFAULT 'USA',
ADD COLUMN IF NOT EXISTS destination_latitude DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS destination_longitude DECIMAL(11,8),
ADD COLUMN IF NOT EXISTS delivery_zone_id INTEGER,
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
ADD COLUMN IF NOT EXISTS carrier_id INTEGER,
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS carrier_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS planned_ship_date DATE,
ADD COLUMN IF NOT EXISTS actual_ship_date DATE,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS requested_delivery_date DATE,
ADD COLUMN IF NOT EXISTS actual_delivery_date DATE,
ADD COLUMN IF NOT EXISTS delivery_time_slot VARCHAR(50),
ADD COLUMN IF NOT EXISTS package_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_weight_kg DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS total_volume_m3 DECIMAL(10,4),
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS freight_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS fuel_surcharge DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS accessorial_charges DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_shipping_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency_code VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS pod_signature_url TEXT,
ADD COLUMN IF NOT EXISTS pod_photo_url TEXT,
ADD COLUMN IF NOT EXISTS pod_notes TEXT,
ADD COLUMN IF NOT EXISTS delivered_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS received_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS requires_signature BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS requires_appointment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_cod BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cod_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS is_hazardous BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperature_controlled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS temperature_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS created_by INTEGER,
ADD COLUMN IF NOT EXISTS updated_by INTEGER;

-- Add foreign key constraints for new columns
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS fk_shipments_carrier;
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_carrier 
    FOREIGN KEY (carrier_id) REFERENCES carriers(id);

ALTER TABLE shipments DROP CONSTRAINT IF EXISTS fk_shipments_zone;
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_zone 
    FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id);

ALTER TABLE shipments DROP CONSTRAINT IF EXISTS fk_shipments_created_by;
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

ALTER TABLE shipments DROP CONSTRAINT IF EXISTS fk_shipments_updated_by;
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Add check constraints
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS chk_priority;
ALTER TABLE shipments ADD CONSTRAINT chk_priority 
    CHECK (priority IN ('urgent', 'high', 'normal', 'low'));

-- Update status column to support new values
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_status_check;
ALTER TABLE shipments ADD CONSTRAINT shipments_status_check
    CHECK (status IN (
        'draft', 'pending', 'picked', 'packed', 'manifested', 
        'in_transit', 'out_for_delivery', 'delivered', 
        'failed_delivery', 'returned', 'cancelled',
        'Preparing', 'In Transit', 'Delivered', 'Cancelled' -- Keep legacy values
    ));

-- Create new indexes for shipments
CREATE INDEX IF NOT EXISTS idx_shipments_source ON shipments(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier ON shipments(carrier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_zone ON shipments(delivery_zone_id);
CREATE INDEX IF NOT EXISTS idx_shipments_dates ON shipments(planned_ship_date, actual_ship_date);
CREATE INDEX IF NOT EXISTS idx_shipments_coords ON shipments(destination_latitude, destination_longitude);

-- =====================================================
-- 2. CREATE LOGISTICS WAREHOUSE FACILITIES TABLE
-- =====================================================
-- The existing warehouse_locations is for inventory bin locations
-- We need a new table for shipping facilities

CREATE TABLE IF NOT EXISTS logistics_facilities (
    id SERIAL PRIMARY KEY,
    facility_code VARCHAR(50) UNIQUE NOT NULL,
    facility_name VARCHAR(200) NOT NULL,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN (
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
    is_origin BOOLEAN DEFAULT true,
    is_destination BOOLEAN DEFAULT false,
    loading_docks_count INTEGER DEFAULT 0,
    max_daily_shipments INTEGER DEFAULT 100,
    operating_hours VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_logistics_facilities_coords ON logistics_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_logistics_facilities_zone ON logistics_facilities(delivery_zone_id);
CREATE INDEX IF NOT EXISTS idx_logistics_facilities_type ON logistics_facilities(facility_type);

-- =====================================================
-- 3. UPDATE REFERENCES
-- =====================================================

-- Update loading_docks to use logistics_facilities instead
ALTER TABLE loading_docks ADD COLUMN IF NOT EXISTS facility_id INTEGER;
ALTER TABLE loading_docks DROP CONSTRAINT IF EXISTS fk_loading_docks_facility;
ALTER TABLE loading_docks ADD CONSTRAINT fk_loading_docks_facility 
    FOREIGN KEY (facility_id) REFERENCES logistics_facilities(id) ON DELETE CASCADE;

-- Update delivery_routes references
ALTER TABLE delivery_routes DROP CONSTRAINT IF EXISTS delivery_routes_origin_location_id_fkey;
ALTER TABLE delivery_routes ADD COLUMN IF NOT EXISTS origin_facility_id INTEGER;
ALTER TABLE delivery_routes ADD CONSTRAINT fk_routes_origin_facility 
    FOREIGN KEY (origin_facility_id) REFERENCES logistics_facilities(id);

-- Update shipments origin reference
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_origin_location_id_fkey;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS origin_facility_id INTEGER;
ALTER TABLE shipments ADD CONSTRAINT fk_shipments_origin_facility 
    FOREIGN KEY (origin_facility_id) REFERENCES logistics_facilities(id);

-- =====================================================
-- 4. RECREATE VIEWS WITH CORRECT SCHEMA
-- =====================================================

DROP VIEW IF EXISTS v_active_shipments CASCADE;
CREATE OR REPLACE VIEW v_active_shipments AS
SELECT 
    s.id,
    s.shipment_number,
    s.shipment_type,
    s.status,
    s.tracking_number,
    c.carrier_name,
    s.customer_name as destination_name,
    s.destination_city,
    s.destination_state,
    lf.facility_name as origin_name,
    s.planned_ship_date,
    s.actual_ship_date,
    s.estimated_delivery_date,
    s.actual_delivery_date,
    CASE 
        WHEN s.actual_delivery_date IS NOT NULL THEN 
            EXTRACT(DAY FROM (s.actual_delivery_date::timestamp - COALESCE(s.actual_ship_date, s.shipment_date)::timestamp))
        ELSE 
            EXTRACT(DAY FROM (CURRENT_DATE - COALESCE(s.actual_ship_date, s.shipment_date, s.planned_ship_date)))
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
LEFT JOIN logistics_facilities lf ON s.origin_facility_id = lf.id
WHERE s.status NOT IN ('delivered', 'cancelled', 'Delivered', 'Cancelled')
ORDER BY COALESCE(s.priority, 'normal') DESC, COALESCE(s.planned_ship_date, s.shipment_date) ASC;

DROP VIEW IF EXISTS v_route_performance CASCADE;
CREATE OR REPLACE VIEW v_route_performance AS
SELECT 
    dr.id,
    dr.route_number,
    dr.route_name,
    dr.route_date,
    dr.status,
    u.email as driver_email,
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
         u.email, c.carrier_name, dr.total_stops, dr.total_distance_km,
         dr.estimated_duration_minutes, dr.actual_duration_minutes,
         dr.estimated_cost, dr.actual_cost
ORDER BY dr.route_date DESC;

DROP VIEW IF EXISTS v_carrier_performance CASCADE;
CREATE OR REPLACE VIEW v_carrier_performance AS
SELECT 
    c.id,
    c.carrier_name,
    c.carrier_type,
    c.service_level,
    c.rating,
    COUNT(DISTINCT s.id) as total_shipments,
    COUNT(CASE WHEN s.status IN ('delivered', 'Delivered') THEN 1 END) as delivered_shipments,
    COUNT(CASE WHEN s.status = 'failed_delivery' THEN 1 END) as failed_deliveries,
    ROUND(AVG(EXTRACT(DAY FROM (
        COALESCE(s.actual_delivery_date, s.actual_delivery)::timestamp - 
        COALESCE(s.actual_ship_date, s.shipment_date)::timestamp
    ))), 2) as avg_delivery_days,
    ROUND(AVG(COALESCE(s.total_shipping_cost, s.total_cost)), 2) as avg_shipping_cost,
    SUM(COALESCE(s.total_shipping_cost, s.total_cost)) as total_revenue,
    COUNT(CASE 
        WHEN COALESCE(s.actual_delivery_date, s.actual_delivery) IS NOT NULL 
        AND s.estimated_delivery_date IS NOT NULL 
        AND COALESCE(s.actual_delivery_date, s.actual_delivery) <= s.estimated_delivery_date
        THEN 1 
    END) as on_time_deliveries,
    ROUND(
        COUNT(CASE 
            WHEN COALESCE(s.actual_delivery_date, s.actual_delivery) IS NOT NULL 
            AND s.estimated_delivery_date IS NOT NULL 
            AND COALESCE(s.actual_delivery_date, s.actual_delivery) <= s.estimated_delivery_date
            THEN 1 
        END)::NUMERIC / 
        NULLIF(COUNT(CASE WHEN COALESCE(s.actual_delivery_date, s.actual_delivery) IS NOT NULL THEN 1 END), 0) * 100, 
        2
    ) as on_time_percentage
FROM carriers c
LEFT JOIN shipments s ON c.id = s.carrier_id
WHERE c.is_active = true
GROUP BY c.id, c.carrier_name, c.carrier_type, c.service_level, c.rating
ORDER BY total_shipments DESC;

-- =====================================================
-- 5. SEED LOGISTICS FACILITIES DATA
-- =====================================================

INSERT INTO logistics_facilities (facility_code, facility_name, facility_type, address_line1, city, state_province, postal_code, country_code, latitude, longitude, is_origin, is_destination, loading_docks_count, max_daily_shipments, is_active)
VALUES 
    ('DC-MAIN', 'Main Distribution Center', 'distribution_center', '123 Warehouse Way', 'Los Angeles', 'California', '90001', 'USA', 34.0522, -118.2437, true, true, 8, 500, true),
    ('FC-EAST', 'East Coast Fulfillment', 'fulfillment_center', '456 Distribution Dr', 'Newark', 'New Jersey', '07102', 'USA', 40.7357, -74.1724, true, true, 6, 300, true),
    ('XD-MIDWEST', 'Midwest Cross-Dock', 'cross_dock', '789 Transit Blvd', 'Chicago', 'Illinois', '60601', 'USA', 41.8781, -87.6298, true, true, 4, 200, true)
ON CONFLICT (facility_code) DO NOTHING;

-- Update loading_docks with facility_id
UPDATE loading_docks ld
SET facility_id = lf.id
FROM logistics_facilities lf
WHERE lf.facility_code = 'DC-MAIN'
AND ld.facility_id IS NULL
AND ld.warehouse_location_id IN (
    SELECT id FROM warehouse_locations WHERE location_code LIKE 'WH-MAIN%' LIMIT 1
);

-- =====================================================
-- 6. ADD MISSING INDEXES FROM ORIGINAL SCHEMA
-- =====================================================

-- Shipment Items
CREATE INDEX IF NOT EXISTS idx_shipment_items_product ON shipment_items(product_id);

-- Success Message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Phase 5 Logistics Schema Fixes Applied!';
    RAISE NOTICE '📊 Extended: shipments table with 40+ new columns';
    RAISE NOTICE '🏭 Created: logistics_facilities table';
    RAISE NOTICE '📈 Updated: 3 views with correct schema';
    RAISE NOTICE '🔗 Fixed: Foreign key relationships';
END $$;
