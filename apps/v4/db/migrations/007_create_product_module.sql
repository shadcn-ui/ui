-- Migration: Product Module (Products, Inventory, Warehouses, Purchase Orders, Suppliers)
-- Date: 2025-11-12
-- Description: Complete product management system with inventory tracking, warehouses, and procurement

-- =============================================
-- 1. PRODUCT CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_categories_parent ON product_categories(parent_id);
CREATE INDEX idx_categories_active ON product_categories(is_active);

-- =============================================
-- 2. PRODUCTS (Product Catalog)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    
    -- Pricing
    unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    cost_price NUMERIC(15, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Stock Info
    unit_of_measure VARCHAR(20) DEFAULT 'pcs',
    reorder_level INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    
    -- Product Details
    barcode VARCHAR(100),
    manufacturer VARCHAR(100),
    brand VARCHAR(100),
    model_number VARCHAR(100),
    weight NUMERIC(10, 2), -- in kg
    dimensions VARCHAR(50), -- e.g., "10x20x30 cm"
    
    -- Images and Media
    primary_image_url VARCHAR(500),
    images_urls TEXT[], -- Array of image URLs
    
    -- Product Status
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Discontinued', 'Draft')),
    is_serialized BOOLEAN DEFAULT false, -- Track by serial numbers
    is_batch_tracked BOOLEAN DEFAULT false, -- Track by batch/lot numbers
    
    -- SEO and Marketing
    tags TEXT[],
    specifications JSONB, -- Flexible product specs
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    deleted_at TIMESTAMP, -- Soft delete
    deleted_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_deleted ON products(deleted_at);

-- =============================================
-- 3. SUPPLIERS
-- =============================================
CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(255),
    
    -- Address
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Business Details
    tax_id VARCHAR(50),
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    currency VARCHAR(3) DEFAULT 'USD',
    credit_limit NUMERIC(15, 2) DEFAULT 0,
    
    -- Supplier Status
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Blocked', 'Pending')),
    rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    
    -- Performance Metrics
    total_orders INTEGER DEFAULT 0,
    total_value NUMERIC(15, 2) DEFAULT 0,
    on_time_delivery_rate NUMERIC(5, 2) DEFAULT 0,
    quality_rating NUMERIC(3, 2) DEFAULT 0,
    
    -- Notes and Documents
    notes TEXT,
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_email ON suppliers(email);

-- =============================================
-- 4. SUPPLIER PRODUCTS (Supplier Catalog)
-- =============================================
CREATE TABLE IF NOT EXISTS supplier_products (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    supplier_sku VARCHAR(100),
    supplier_product_name VARCHAR(255),
    supplier_price NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    lead_time_days INTEGER DEFAULT 0,
    min_order_quantity INTEGER DEFAULT 1,
    is_preferred BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_price_update TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_id, product_id)
);

CREATE INDEX idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_product ON supplier_products(product_id);
CREATE INDEX idx_supplier_products_preferred ON supplier_products(is_preferred);

-- =============================================
-- 5. WAREHOUSES
-- =============================================
CREATE TABLE IF NOT EXISTS warehouses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'Standard' CHECK (type IN ('Standard', 'Distribution Center', 'Retail', 'Transit', 'Quarantine')),
    
    -- Location
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    
    -- Warehouse Details
    manager_id INTEGER REFERENCES users(id),
    phone VARCHAR(20),
    email VARCHAR(100),
    
    -- Capacity
    total_capacity NUMERIC(15, 2), -- in cubic meters or sq meters
    capacity_unit VARCHAR(20) DEFAULT 'sqm',
    current_utilization NUMERIC(5, 2) DEFAULT 0, -- percentage
    
    -- Status
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    is_primary BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_warehouses_code ON warehouses(code);
CREATE INDEX idx_warehouses_status ON warehouses(status);
CREATE INDEX idx_warehouses_manager ON warehouses(manager_id);

-- =============================================
-- 6. WAREHOUSE LOCATIONS (Bin/Rack Locations)
-- =============================================
CREATE TABLE IF NOT EXISTS warehouse_locations (
    id SERIAL PRIMARY KEY,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    location_code VARCHAR(50) NOT NULL,
    location_type VARCHAR(20) DEFAULT 'Shelf' CHECK (location_type IN ('Shelf', 'Rack', 'Bin', 'Pallet', 'Floor')),
    aisle VARCHAR(10),
    rack VARCHAR(10),
    shelf VARCHAR(10),
    bin VARCHAR(10),
    capacity NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, location_code)
);

CREATE INDEX idx_locations_warehouse ON warehouse_locations(warehouse_id);
CREATE INDEX idx_locations_code ON warehouse_locations(location_code);

-- =============================================
-- 7. INVENTORY (Stock Levels)
-- =============================================
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    location_id INTEGER REFERENCES warehouse_locations(id) ON DELETE SET NULL,
    
    -- Stock Quantities
    quantity_on_hand INTEGER DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0, -- Reserved for sales orders
    quantity_available INTEGER DEFAULT 0, -- on_hand - reserved
    quantity_on_order INTEGER DEFAULT 0, -- From purchase orders
    quantity_in_transit INTEGER DEFAULT 0,
    
    -- Batch/Serial Tracking
    batch_number VARCHAR(100),
    serial_numbers TEXT[], -- Array of serial numbers
    expiry_date DATE,
    manufacturing_date DATE,
    
    -- Valuation
    unit_cost NUMERIC(15, 2) DEFAULT 0,
    total_value NUMERIC(15, 2) DEFAULT 0,
    
    -- Stock Status
    last_stock_count_date TIMESTAMP,
    last_movement_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(product_id, warehouse_id, batch_number)
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_location ON inventory(location_id);
CREATE INDEX idx_inventory_batch ON inventory(batch_number);

-- =============================================
-- 8. STOCK MOVEMENTS (Inventory Transactions)
-- =============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    
    -- Movement Details
    movement_type VARCHAR(50) NOT NULL CHECK (movement_type IN (
        'Purchase Receipt', 'Sales Shipment', 'Transfer In', 'Transfer Out',
        'Adjustment Increase', 'Adjustment Decrease', 'Return', 'Production',
        'Damage', 'Loss', 'Stock Count', 'Sample'
    )),
    
    -- Quantities
    quantity INTEGER NOT NULL,
    unit_cost NUMERIC(15, 2) DEFAULT 0,
    total_value NUMERIC(15, 2) DEFAULT 0,
    
    -- Before/After Balances
    balance_before INTEGER,
    balance_after INTEGER,
    
    -- Batch/Serial
    batch_number VARCHAR(100),
    serial_numbers TEXT[],
    
    -- References
    reference_type VARCHAR(50), -- 'Purchase Order', 'Sales Order', 'Transfer', etc.
    reference_id INTEGER,
    reference_number VARCHAR(100),
    
    -- Source/Destination
    from_warehouse_id INTEGER REFERENCES warehouses(id),
    to_warehouse_id INTEGER REFERENCES warehouses(id),
    from_location_id INTEGER REFERENCES warehouse_locations(id),
    to_location_id INTEGER REFERENCES warehouse_locations(id),
    
    -- Additional Info
    notes TEXT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_movements_product ON stock_movements(product_id);
CREATE INDEX idx_movements_warehouse ON stock_movements(warehouse_id);
CREATE INDEX idx_movements_type ON stock_movements(movement_type);
CREATE INDEX idx_movements_date ON stock_movements(movement_date);
CREATE INDEX idx_movements_reference ON stock_movements(reference_type, reference_id);

-- =============================================
-- 9. PURCHASE ORDERS
-- =============================================
CREATE TABLE IF NOT EXISTS purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    warehouse_id INTEGER REFERENCES warehouses(id), -- Receiving warehouse
    
    -- Order Details
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN (
        'Draft', 'Pending Approval', 'Approved', 'Sent', 'Partially Received',
        'Received', 'Cancelled', 'Closed'
    )),
    
    -- Financial
    currency VARCHAR(3) DEFAULT 'USD',
    subtotal NUMERIC(15, 2) DEFAULT 0,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    shipping_cost NUMERIC(15, 2) DEFAULT 0,
    other_charges NUMERIC(15, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    total_amount NUMERIC(15, 2) DEFAULT 0,
    
    -- Payment
    payment_terms VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Paid')),
    
    -- Shipping
    shipping_method VARCHAR(50),
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    
    -- Approval
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approval_date TIMESTAMP,
    
    -- Notes
    notes TEXT,
    terms_and_conditions TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER REFERENCES users(id),
    cancellation_reason TEXT
);

CREATE INDEX idx_po_number ON purchase_orders(po_number);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_order_date ON purchase_orders(order_date);
CREATE INDEX idx_po_warehouse ON purchase_orders(warehouse_id);

-- =============================================
-- 10. PURCHASE ORDER ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    
    -- Order Details
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    quantity_pending INTEGER GENERATED ALWAYS AS (quantity_ordered - quantity_received) STORED,
    
    -- Pricing
    unit_price NUMERIC(15, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(15, 2) DEFAULT 0,
    tax_percent NUMERIC(5, 2) DEFAULT 0,
    tax_amount NUMERIC(15, 2) DEFAULT 0,
    line_total NUMERIC(15, 2) GENERATED ALWAYS AS (
        (quantity_ordered * unit_price) - discount_amount + tax_amount
    ) STORED,
    
    -- Additional Info
    notes TEXT,
    expected_delivery_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_po_items_product ON purchase_order_items(product_id);

-- =============================================
-- 11. GOODS RECEIPT (Receiving)
-- =============================================
CREATE TABLE IF NOT EXISTS goods_receipts (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    warehouse_id INTEGER NOT NULL REFERENCES warehouses(id),
    
    -- Receipt Details
    receipt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_by INTEGER REFERENCES users(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Completed', 'Cancelled')),
    
    -- Quality Check
    quality_status VARCHAR(20) DEFAULT 'Pending' CHECK (quality_status IN ('Pending', 'Passed', 'Failed', 'Partial')),
    quality_checked_by INTEGER REFERENCES users(id),
    quality_check_date TIMESTAMP,
    quality_notes TEXT,
    
    -- Notes
    notes TEXT,
    discrepancy_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_receipts_number ON goods_receipts(receipt_number);
CREATE INDEX idx_receipts_po ON goods_receipts(purchase_order_id);
CREATE INDEX idx_receipts_warehouse ON goods_receipts(warehouse_id);
CREATE INDEX idx_receipts_date ON goods_receipts(receipt_date);

-- =============================================
-- 12. GOODS RECEIPT ITEMS
-- =============================================
CREATE TABLE IF NOT EXISTS goods_receipt_items (
    id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    po_item_id INTEGER NOT NULL REFERENCES purchase_order_items(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    
    -- Received Quantities
    quantity_ordered INTEGER NOT NULL,
    quantity_received INTEGER NOT NULL,
    quantity_accepted INTEGER DEFAULT 0,
    quantity_rejected INTEGER DEFAULT 0,
    
    -- Batch/Serial
    batch_number VARCHAR(100),
    serial_numbers TEXT[],
    expiry_date DATE,
    
    -- Location
    location_id INTEGER REFERENCES warehouse_locations(id),
    
    -- Quality
    quality_status VARCHAR(20) DEFAULT 'Pending',
    rejection_reason TEXT,
    
    -- Notes
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipt_items_receipt ON goods_receipt_items(receipt_id);
CREATE INDEX idx_receipt_items_po_item ON goods_receipt_items(po_item_id);
CREATE INDEX idx_receipt_items_product ON goods_receipt_items(product_id);
CREATE INDEX idx_receipt_items_batch ON goods_receipt_items(batch_number);

-- =============================================
-- VIEWS
-- =============================================

-- Product Inventory Summary (Stock across all warehouses)
CREATE OR REPLACE VIEW product_inventory_summary AS
SELECT 
    p.id AS product_id,
    p.sku,
    p.name AS product_name,
    p.category_id,
    pc.name AS category_name,
    p.unit_price,
    p.cost_price,
    p.reorder_level,
    COALESCE(SUM(i.quantity_on_hand), 0) AS total_quantity_on_hand,
    COALESCE(SUM(i.quantity_reserved), 0) AS total_quantity_reserved,
    COALESCE(SUM(i.quantity_available), 0) AS total_quantity_available,
    COALESCE(SUM(i.quantity_on_order), 0) AS total_quantity_on_order,
    COALESCE(SUM(i.total_value), 0) AS total_inventory_value,
    COUNT(DISTINCT i.warehouse_id) AS warehouse_count,
    CASE 
        WHEN COALESCE(SUM(i.quantity_available), 0) <= 0 THEN 'Out of Stock'
        WHEN COALESCE(SUM(i.quantity_available), 0) <= p.reorder_level THEN 'Low Stock'
        ELSE 'In Stock'
    END AS stock_status
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.sku, p.name, p.category_id, pc.name, p.unit_price, p.cost_price, p.reorder_level;

-- Warehouse Stock Levels
CREATE OR REPLACE VIEW warehouse_stock_levels AS
SELECT 
    w.id AS warehouse_id,
    w.code AS warehouse_code,
    w.name AS warehouse_name,
    p.id AS product_id,
    p.sku,
    p.name AS product_name,
    i.quantity_on_hand,
    i.quantity_reserved,
    i.quantity_available,
    i.quantity_on_order,
    i.batch_number,
    i.unit_cost,
    i.total_value,
    wl.location_code,
    i.last_movement_date
FROM warehouses w
CROSS JOIN products p
LEFT JOIN inventory i ON w.id = i.warehouse_id AND p.id = i.product_id
LEFT JOIN warehouse_locations wl ON i.location_id = wl.id
WHERE p.deleted_at IS NULL AND w.status = 'Active';

-- Purchase Order Summary
CREATE OR REPLACE VIEW purchase_order_summary AS
SELECT 
    po.id,
    po.po_number,
    po.order_date,
    po.expected_delivery_date,
    po.status,
    po.payment_status,
    s.company_name AS supplier_name,
    s.supplier_code,
    s.email AS supplier_email,
    s.phone AS supplier_phone,
    w.name AS warehouse_name,
    po.currency,
    po.subtotal,
    po.tax_amount,
    po.total_amount,
    COUNT(poi.id) AS item_count,
    SUM(poi.quantity_ordered) AS total_items_ordered,
    SUM(poi.quantity_received) AS total_items_received,
    SUM(poi.quantity_pending) AS total_items_pending,
    CASE 
        WHEN SUM(poi.quantity_received) = 0 THEN 0
        ELSE ROUND((SUM(poi.quantity_received)::NUMERIC / SUM(poi.quantity_ordered)::NUMERIC) * 100, 2)
    END AS fulfillment_percentage,
    CONCAT(u.first_name, ' ', u.last_name) AS created_by_name,
    po.created_at
FROM purchase_orders po
LEFT JOIN suppliers s ON po.supplier_id = s.id
LEFT JOIN warehouses w ON po.warehouse_id = w.id
LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
LEFT JOIN users u ON po.created_by = u.id
GROUP BY po.id, po.po_number, po.order_date, po.expected_delivery_date, po.status, po.payment_status,
         s.company_name, s.supplier_code, s.email, s.phone, w.name, po.currency,
         po.subtotal, po.tax_amount, po.total_amount, u.first_name, u.last_name, po.created_at;

-- Low Stock Products
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
    p.id,
    p.sku,
    p.name,
    pc.name AS category_name,
    p.reorder_level,
    p.reorder_quantity,
    COALESCE(SUM(i.quantity_available), 0) AS current_stock,
    COALESCE(SUM(i.quantity_on_order), 0) AS on_order_quantity,
    p.reorder_level - COALESCE(SUM(i.quantity_available), 0) AS shortage_quantity,
    p.unit_price,
    p.cost_price
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
LEFT JOIN inventory i ON p.id = i.product_id
WHERE p.deleted_at IS NULL 
  AND p.status = 'Active'
GROUP BY p.id, p.sku, p.name, pc.name, p.reorder_level, p.reorder_quantity, p.unit_price, p.cost_price
HAVING COALESCE(SUM(i.quantity_available), 0) <= p.reorder_level;

-- Supplier Performance
CREATE OR REPLACE VIEW supplier_performance_summary AS
SELECT 
    s.id,
    s.supplier_code,
    s.company_name,
    s.contact_person,
    s.email,
    s.status,
    s.rating,
    COUNT(DISTINCT po.id) AS total_orders,
    SUM(po.total_amount) AS total_purchase_value,
    AVG(po.total_amount) AS avg_order_value,
    COUNT(DISTINCT CASE WHEN po.status = 'Received' THEN po.id END) AS completed_orders,
    COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END) AS on_time_deliveries,
    CASE 
        WHEN COUNT(DISTINCT po.id) = 0 THEN 0
        ELSE ROUND((COUNT(DISTINCT CASE WHEN po.actual_delivery_date <= po.expected_delivery_date THEN po.id END)::NUMERIC / 
                    COUNT(DISTINCT CASE WHEN po.actual_delivery_date IS NOT NULL THEN po.id END)::NUMERIC) * 100, 2)
    END AS on_time_delivery_rate,
    MAX(po.order_date) AS last_order_date,
    s.created_at
FROM suppliers s
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
WHERE s.status != 'Inactive'
GROUP BY s.id, s.supplier_code, s.company_name, s.contact_person, s.email, s.status, s.rating, s.created_at;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update inventory available quantity
CREATE OR REPLACE FUNCTION update_inventory_available_quantity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quantity_available = NEW.quantity_on_hand - NEW.quantity_reserved;
    NEW.total_value = NEW.quantity_on_hand * NEW.unit_cost;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_quantities BEFORE INSERT OR UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_inventory_available_quantity();

-- Update PO totals when items change
CREATE OR REPLACE FUNCTION update_po_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE purchase_orders
    SET subtotal = (
        SELECT COALESCE(SUM(line_total), 0)
        FROM purchase_order_items
        WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
    ),
    total_amount = (
        SELECT COALESCE(SUM(line_total), 0) + COALESCE(tax_amount, 0) + COALESCE(shipping_cost, 0) + 
               COALESCE(other_charges, 0) - COALESCE(discount_amount, 0)
        FROM purchase_order_items
        WHERE purchase_order_id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id)
    )
    WHERE id = COALESCE(NEW.purchase_order_id, OLD.purchase_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_po_totals_on_items AFTER INSERT OR UPDATE OR DELETE ON purchase_order_items
    FOR EACH ROW EXECUTE FUNCTION update_po_totals();

-- Record stock movement on inventory change
CREATE OR REPLACE FUNCTION record_inventory_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND NEW.quantity_on_hand != OLD.quantity_on_hand) THEN
        INSERT INTO stock_movements (
            product_id, warehouse_id, movement_type, quantity,
            balance_before, balance_after, unit_cost, total_value,
            batch_number, notes, created_by
        ) VALUES (
            NEW.product_id, NEW.warehouse_id, 
            CASE 
                WHEN NEW.quantity_on_hand > OLD.quantity_on_hand THEN 'Adjustment Increase'
                ELSE 'Adjustment Decrease'
            END,
            ABS(NEW.quantity_on_hand - OLD.quantity_on_hand),
            OLD.quantity_on_hand, NEW.quantity_on_hand,
            NEW.unit_cost,
            ABS(NEW.quantity_on_hand - OLD.quantity_on_hand) * NEW.unit_cost,
            NEW.batch_number,
            'Automatic adjustment tracking',
            NEW.updated_at::INTEGER -- Using timestamp as placeholder
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_inventory_movements AFTER UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION record_inventory_movement();

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE products IS 'Master product catalog with pricing and specifications';
COMMENT ON TABLE inventory IS 'Real-time stock levels across warehouses';
COMMENT ON TABLE stock_movements IS 'Complete audit trail of all inventory transactions';
COMMENT ON TABLE purchase_orders IS 'Purchase orders for procurement';
COMMENT ON TABLE suppliers IS 'Supplier master data with performance tracking';
COMMENT ON TABLE warehouses IS 'Warehouse locations for inventory storage';

-- =============================================
-- SEED DATA: Product Categories
-- =============================================
INSERT INTO product_categories (name, description, is_active, display_order) VALUES
    ('Electronics', 'Electronic devices and accessories', true, 1),
    ('Office Supplies', 'Office equipment and stationery', true, 2),
    ('Furniture', 'Office and home furniture', true, 3),
    ('Software', 'Software licenses and subscriptions', true, 4),
    ('Services', 'Professional and consulting services', true, 5),
    ('Hardware', 'Computer hardware and components', true, 6),
    ('Accessories', 'General accessories and peripherals', true, 7),
    ('Consumables', 'Consumable items and supplies', true, 8),
    ('Tools', 'Tools and equipment', true, 9),
    ('Other', 'Miscellaneous products', true, 10)
ON CONFLICT (name) DO NOTHING;

