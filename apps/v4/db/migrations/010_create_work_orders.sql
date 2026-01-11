-- =============================================
-- Work Orders Module Migration
-- =============================================
-- Description: Complete work order management system
-- Author: Ocean ERP
-- Date: 2025-11-21
-- =============================================

-- =============================================
-- 1. WORK ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS work_orders (
    id SERIAL PRIMARY KEY,
    wo_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Product Information
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    bom_id INTEGER REFERENCES bill_of_materials(id),
    
    -- Quantities
    quantity_to_produce DECIMAL(15, 4) NOT NULL,
    quantity_produced DECIMAL(15, 4) DEFAULT 0,
    quantity_scrapped DECIMAL(15, 4) DEFAULT 0,
    unit_of_measure VARCHAR(50),
    
    -- Dates
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date TIMESTAMP,
    actual_end_date TIMESTAMP,
    
    -- Status Management
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    -- draft, ready, released, in_progress, on_hold, completed, cancelled, closed
    priority VARCHAR(20) DEFAULT 'normal',
    -- low, normal, high, urgent
    
    -- Production Location
    production_line_id INTEGER REFERENCES production_lines(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    work_center VARCHAR(100),
    
    -- Costs (calculated)
    material_cost DECIMAL(15, 2) DEFAULT 0,
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    overhead_cost DECIMAL(15, 2) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    
    -- References
    sales_order_id INTEGER,
    project_id INTEGER,
    customer_name VARCHAR(255),
    
    -- Additional Info
    notes TEXT,
    special_instructions TEXT,
    attachments JSONB,
    
    -- Tracking
    created_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    completed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_quantity CHECK (quantity_to_produce > 0),
    CONSTRAINT valid_produced CHECK (quantity_produced >= 0),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'ready', 'released', 'in_progress', 'on_hold', 'completed', 'cancelled', 'closed')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- =============================================
-- 2. WORK ORDER ITEMS (Material Requirements)
-- =============================================
CREATE TABLE IF NOT EXISTS work_order_items (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    
    -- Item Information
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    item_type VARCHAR(50) DEFAULT 'material',
    -- material, component, sub_assembly
    
    -- From BOM
    bom_item_id INTEGER REFERENCES bom_items(id),
    quantity_per_unit DECIMAL(15, 6) NOT NULL,
    
    -- Calculated Requirements
    quantity_required DECIMAL(15, 4) NOT NULL,
    quantity_reserved DECIMAL(15, 4) DEFAULT 0,
    quantity_consumed DECIMAL(15, 4) DEFAULT 0,
    quantity_returned DECIMAL(15, 4) DEFAULT 0,
    
    -- Availability
    quantity_available DECIMAL(15, 4) DEFAULT 0,
    is_available BOOLEAN DEFAULT FALSE,
    
    -- Unit & Cost
    unit_of_measure VARCHAR(50),
    unit_cost DECIMAL(15, 4) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    
    -- Scrap & Wastage
    scrap_factor DECIMAL(5, 2) DEFAULT 0,
    -- percentage
    
    -- Warehouse
    warehouse_id INTEGER REFERENCES warehouses(id),
    bin_location VARCHAR(100),
    
    -- Tracking
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_item_quantity CHECK (quantity_required >= 0),
    CONSTRAINT valid_consumed CHECK (quantity_consumed >= 0)
);

-- =============================================
-- 3. WORK ORDER OPERATIONS (Routing Steps)
-- =============================================
CREATE TABLE IF NOT EXISTS work_order_operations (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    
    -- Operation Details
    operation_number INTEGER NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Sequencing
    sequence_number INTEGER NOT NULL,
    is_parallel BOOLEAN DEFAULT FALSE,
    depends_on_operation_id INTEGER REFERENCES work_order_operations(id),
    
    -- Work Center
    work_center VARCHAR(100),
    machine_id INTEGER,
    production_line_id INTEGER REFERENCES production_lines(id),
    
    -- Time Management
    setup_time DECIMAL(10, 2) DEFAULT 0,
    -- hours
    run_time_per_unit DECIMAL(10, 4) DEFAULT 0,
    -- hours per unit
    total_planned_time DECIMAL(10, 2) DEFAULT 0,
    -- hours
    
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration DECIMAL(10, 2) DEFAULT 0,
    -- hours
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- pending, in_progress, completed, skipped, failed
    completion_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Labor
    required_operators INTEGER DEFAULT 1,
    assigned_operators JSONB,
    -- [{"user_id": 1, "name": "John"}, ...]
    
    -- Quality Check
    requires_qc BOOLEAN DEFAULT FALSE,
    qc_completed BOOLEAN DEFAULT FALSE,
    qc_result VARCHAR(50),
    -- pass, fail
    
    -- Costs
    labor_cost DECIMAL(15, 2) DEFAULT 0,
    machine_cost DECIMAL(15, 2) DEFAULT 0,
    overhead_cost DECIMAL(15, 2) DEFAULT 0,
    
    -- Tracking
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_operation_status CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
    CONSTRAINT valid_sequence CHECK (sequence_number > 0),
    CONSTRAINT unique_operation_sequence UNIQUE (work_order_id, sequence_number)
);

-- =============================================
-- 4. MATERIAL CONSUMPTION TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS material_consumption (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id),
    work_order_item_id INTEGER REFERENCES work_order_items(id),
    
    -- Material Details
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    
    -- Consumption
    quantity_consumed DECIMAL(15, 4) NOT NULL,
    unit_of_measure VARCHAR(50),
    unit_cost DECIMAL(15, 4) DEFAULT 0,
    total_cost DECIMAL(15, 2) DEFAULT 0,
    
    -- Source
    warehouse_id INTEGER REFERENCES warehouses(id),
    bin_location VARCHAR(100),
    lot_number VARCHAR(100),
    serial_number VARCHAR(100),
    
    -- Transaction
    consumption_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consumption_type VARCHAR(50) DEFAULT 'production',
    -- production, scrap, adjustment, return
    
    -- Tracking
    consumed_by INTEGER REFERENCES users(id),
    operation_id INTEGER REFERENCES work_order_operations(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_consumption CHECK (quantity_consumed > 0),
    CONSTRAINT valid_consumption_type CHECK (consumption_type IN ('production', 'scrap', 'adjustment', 'return'))
);

-- =============================================
-- 5. WORK ORDER HISTORY/AUDIT
-- =============================================
CREATE TABLE IF NOT EXISTS work_order_history (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    
    -- Change Details
    action VARCHAR(50) NOT NULL,
    -- created, status_changed, updated, material_consumed, completed, cancelled
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    
    -- Change Data
    change_details JSONB,
    
    -- User & Timestamp
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    
    -- Notes
    notes TEXT
);

-- =============================================
-- INDEXES
-- =============================================

-- Work Orders
CREATE INDEX idx_wo_number ON work_orders(wo_number);
CREATE INDEX idx_wo_product ON work_orders(product_id);
CREATE INDEX idx_wo_status ON work_orders(status);
CREATE INDEX idx_wo_dates ON work_orders(planned_start_date, planned_end_date);
CREATE INDEX idx_wo_bom ON work_orders(bom_id);
CREATE INDEX idx_wo_production_line ON work_orders(production_line_id);

-- Work Order Items
CREATE INDEX idx_woi_work_order ON work_order_items(work_order_id);
CREATE INDEX idx_woi_product ON work_order_items(product_id);
CREATE INDEX idx_woi_availability ON work_order_items(is_available);

-- Work Order Operations
CREATE INDEX idx_woo_work_order ON work_order_operations(work_order_id);
CREATE INDEX idx_woo_sequence ON work_order_operations(sequence_number);
CREATE INDEX idx_woo_status ON work_order_operations(status);

-- Material Consumption
CREATE INDEX idx_mc_work_order ON material_consumption(work_order_id);
CREATE INDEX idx_mc_product ON material_consumption(product_id);
CREATE INDEX idx_mc_date ON material_consumption(consumption_date);

-- Work Order History
CREATE INDEX idx_woh_work_order ON work_order_history(work_order_id);
CREATE INDEX idx_woh_action ON work_order_history(action);
CREATE INDEX idx_woh_date ON work_order_history(changed_at);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-generate WO Number
CREATE OR REPLACE FUNCTION generate_wo_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    new_wo_number VARCHAR(50);
BEGIN
    IF NEW.wo_number IS NULL OR NEW.wo_number = '' THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(wo_number FROM 'WO-(\d+)') AS INTEGER)), 0) + 1 
        INTO next_number
        FROM work_orders
        WHERE wo_number ~ '^WO-\d+$';
        
        new_wo_number := 'WO-' || LPAD(next_number::TEXT, 6, '0');
        NEW.wo_number := new_wo_number;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_wo_number
    BEFORE INSERT ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_wo_number();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_work_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wo_timestamp
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_work_order_timestamp();

CREATE TRIGGER trigger_update_woi_timestamp
    BEFORE UPDATE ON work_order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_work_order_timestamp();

CREATE TRIGGER trigger_update_woo_timestamp
    BEFORE UPDATE ON work_order_operations
    FOR EACH ROW
    EXECUTE FUNCTION update_work_order_timestamp();

-- Log work order changes
CREATE OR REPLACE FUNCTION log_work_order_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO work_order_history (work_order_id, action, new_status, changed_by, change_details)
        VALUES (NEW.id, 'created', NEW.status, NEW.created_by, 
                jsonb_build_object('wo_number', NEW.wo_number, 'product', NEW.product_name, 'quantity', NEW.quantity_to_produce));
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO work_order_history (work_order_id, action, old_status, new_status, changed_by, change_details)
            VALUES (NEW.id, 'status_changed', OLD.status, NEW.status, NEW.created_by,
                    jsonb_build_object('from', OLD.status, 'to', NEW.status));
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_wo_changes
    AFTER INSERT OR UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION log_work_order_changes();

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE work_orders IS 'Manufacturing work orders for production tracking';
COMMENT ON TABLE work_order_items IS 'Material requirements for each work order (from BOM)';
COMMENT ON TABLE work_order_operations IS 'Routing/operation steps for work orders';
COMMENT ON TABLE material_consumption IS 'Actual material consumption tracking';
COMMENT ON TABLE work_order_history IS 'Audit trail for work order changes';

COMMENT ON COLUMN work_orders.status IS 'draft, ready, released, in_progress, on_hold, completed, cancelled, closed';
COMMENT ON COLUMN work_order_items.is_available IS 'Whether material is available in sufficient quantity';
COMMENT ON COLUMN work_order_operations.is_parallel IS 'Can this operation run in parallel with others';
COMMENT ON COLUMN material_consumption.consumption_type IS 'production, scrap, adjustment, return';
