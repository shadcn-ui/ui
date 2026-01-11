-- Multi-Location Management System
-- Date: 2025-11-28

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('warehouse', 'factory', 'retail')),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Indonesia',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    capacity_total DECIMAL(15, 2),
    capacity_unit VARCHAR(50) DEFAULT 'cubic_meters',
    manager_name VARCHAR(255),
    manager_contact VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Location Inventory Table
CREATE TABLE IF NOT EXISTS location_inventory (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    reorder_point INTEGER DEFAULT 10,
    max_quantity INTEGER,
    bin_location VARCHAR(100),
    last_counted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(location_id, product_id)
);

-- Inter-Location Transfers Table
CREATE TABLE IF NOT EXISTS location_transfers (
    id SERIAL PRIMARY KEY,
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    from_location_id INTEGER REFERENCES locations(id) ON DELETE RESTRICT,
    to_location_id INTEGER REFERENCES locations(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_transit', 'completed', 'cancelled')),
    total_items INTEGER NOT NULL DEFAULT 0,
    transfer_type VARCHAR(50) DEFAULT 'stock_transfer',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    requested_by VARCHAR(255),
    approved_by VARCHAR(255),
    shipped_by VARCHAR(255),
    received_by VARCHAR(255),
    notes TEXT,
    requested_date TIMESTAMP DEFAULT NOW(),
    approved_date TIMESTAMP,
    shipped_date TIMESTAMP,
    estimated_arrival TIMESTAMP,
    completed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Transfer Items Table
CREATE TABLE IF NOT EXISTS location_transfer_items (
    id SERIAL PRIMARY KEY,
    transfer_id INTEGER REFERENCES location_transfers(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT,
    sku VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity_requested INTEGER NOT NULL,
    quantity_shipped INTEGER DEFAULT 0,
    quantity_received INTEGER DEFAULT 0,
    unit_cost DECIMAL(15, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Location Performance Metrics Table
CREATE TABLE IF NOT EXISTS location_metrics (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    total_inventory_value DECIMAL(15, 2) DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    capacity_utilization DECIMAL(5, 2) DEFAULT 0,
    inbound_transfers INTEGER DEFAULT 0,
    outbound_transfers INTEGER DEFAULT 0,
    stock_accuracy DECIMAL(5, 2) DEFAULT 100,
    order_fulfillment_rate DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(location_id, metric_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);

CREATE INDEX IF NOT EXISTS idx_location_inventory_location ON location_inventory(location_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_product ON location_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_sku ON location_inventory(sku);

CREATE INDEX IF NOT EXISTS idx_transfers_from ON location_transfers(from_location_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to ON location_transfers(to_location_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON location_transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON location_transfers(requested_date);

CREATE INDEX IF NOT EXISTS idx_transfer_items_transfer ON location_transfer_items(transfer_id);
CREATE INDEX IF NOT EXISTS idx_transfer_items_product ON location_transfer_items(product_id);

CREATE INDEX IF NOT EXISTS idx_location_metrics_location ON location_metrics(location_id);
CREATE INDEX IF NOT EXISTS idx_location_metrics_date ON location_metrics(metric_date);

-- Sample data
INSERT INTO locations (code, name, type, address, city, province) VALUES
('WH-JKT-01', 'Jakarta Main Warehouse', 'warehouse', 'Jl. Industri Raya No. 123', 'Jakarta Utara', 'DKI Jakarta'),
('FC-BDG-01', 'Bandung Factory', 'factory', 'Jl. Pabrik No. 45', 'Bandung', 'Jawa Barat'),
('RT-SBY-01', 'Surabaya Retail Store', 'retail', 'Jl. Tunjungan Plaza No. 78', 'Surabaya', 'Jawa Timur'),
('WH-MDN-01', 'Medan Distribution Center', 'warehouse', 'Jl. Gatot Subroto No. 234', 'Medan', 'Sumatera Utara'),
('RT-DPS-01', 'Bali Retail Outlet', 'retail', 'Jl. Sunset Road No. 56', 'Denpasar', 'Bali')
ON CONFLICT (code) DO NOTHING;

-- Sample transfers
INSERT INTO location_transfers (transfer_number, from_location_id, to_location_id, status, total_items, estimated_arrival) 
SELECT 
    'TRF-' || to_char(NOW(), 'YYYYMMDD') || '-001',
    (SELECT id FROM locations WHERE code = 'WH-JKT-01'),
    (SELECT id FROM locations WHERE code = 'RT-SBY-01'),
    'in_transit',
    15,
    NOW() + INTERVAL '2 days'
WHERE NOT EXISTS (SELECT 1 FROM location_transfers WHERE transfer_number = 'TRF-' || to_char(NOW(), 'YYYYMMDD') || '-001');

INSERT INTO location_transfers (transfer_number, from_location_id, to_location_id, status, total_items, estimated_arrival) 
SELECT 
    'TRF-' || to_char(NOW(), 'YYYYMMDD') || '-002',
    (SELECT id FROM locations WHERE code = 'FC-BDG-01'),
    (SELECT id FROM locations WHERE code = 'WH-JKT-01'),
    'pending',
    25,
    NOW() + INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM location_transfers WHERE transfer_number = 'TRF-' || to_char(NOW(), 'YYYYMMDD') || '-002');

-- Update metrics for locations
INSERT INTO location_metrics (location_id, metric_date, total_inventory_value, total_items, capacity_utilization)
SELECT 
    l.id,
    CURRENT_DATE,
    CASE 
        WHEN l.type = 'warehouse' THEN 245000000
        WHEN l.type = 'factory' THEN 180000000
        ELSE 85000000
    END,
    CASE 
        WHEN l.type = 'warehouse' THEN 1250
        WHEN l.type = 'factory' THEN 850
        ELSE 450
    END,
    CASE 
        WHEN l.type = 'warehouse' THEN 75.5
        WHEN l.type = 'factory' THEN 85.2
        ELSE 62.8
    END
FROM locations l
ON CONFLICT (location_id, metric_date) DO UPDATE SET
    total_inventory_value = EXCLUDED.total_inventory_value,
    total_items = EXCLUDED.total_items,
    capacity_utilization = EXCLUDED.capacity_utilization;

COMMENT ON TABLE locations IS 'Multi-location management for warehouses, factories, and retail stores';
COMMENT ON TABLE location_inventory IS 'Inventory levels per location and product';
COMMENT ON TABLE location_transfers IS 'Inter-location inventory transfers';
COMMENT ON TABLE location_transfer_items IS 'Line items for location transfers';
COMMENT ON TABLE location_metrics IS 'Daily performance metrics per location';
