-- Ocean ERP Operations Module Enhancement
-- Phase 1: MRP (Material Requirements Planning) and Production Routing
-- Created: December 2024
-- Fixed: Corrected to use INTEGER instead of UUID to match existing schema

-- =====================================================
-- WORKSTATIONS & RESOURCES
-- =====================================================

-- Workstations (machines, work centers, production lines)
CREATE TABLE IF NOT EXISTS workstations (
    id SERIAL PRIMARY KEY,
    workstation_code VARCHAR(50) UNIQUE NOT NULL,
    workstation_name VARCHAR(255) NOT NULL,
    workstation_type VARCHAR(50) NOT NULL, -- machine, manual, assembly, packaging, etc.
    description TEXT,
    capacity_per_hour DECIMAL(10,2), -- units per hour
    cost_per_hour DECIMAL(10,2) DEFAULT 0,
    setup_time_minutes INT DEFAULT 0,
    efficiency_rate DECIMAL(5,2) DEFAULT 100.00, -- percentage
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, inactive
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Routes (sequence of operations for products)
CREATE TABLE IF NOT EXISTS production_routes (
    id SERIAL PRIMARY KEY,
    route_code VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Route Operations (steps in a route)
CREATE TABLE IF NOT EXISTS production_route_operations (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES production_routes(id) ON DELETE CASCADE,
    sequence_number INT NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- setup, process, inspection, packaging
    workstation_id INTEGER REFERENCES workstations(id),
    description TEXT,
    setup_time_minutes INT DEFAULT 0,
    run_time_per_unit DECIMAL(10,2) DEFAULT 0, -- minutes per unit
    labor_cost_per_hour DECIMAL(10,2) DEFAULT 0,
    labor_hours_per_unit DECIMAL(10,4) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, sequence_number)
);

-- =====================================================
-- WORK ORDER ENHANCEMENTS
-- =====================================================

-- Work Order Operations (actual operations for a specific work order)
-- Note: work_order_operations table already exists, so we'll skip if exists
CREATE TABLE IF NOT EXISTS work_order_operations (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    operation_id INTEGER REFERENCES production_route_operations(id),
    sequence_number INT NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    workstation_id INTEGER REFERENCES workstations(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, skipped
    planned_start_time TIMESTAMP,
    planned_end_time TIMESTAMP,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    setup_time_actual_minutes INT,
    run_time_actual_minutes INT,
    operator_id INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MRP - MATERIAL REQUIREMENTS PLANNING
-- =====================================================

-- Work Order Materials (materials needed for work orders)
CREATE TABLE IF NOT EXISTS work_order_materials (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    bom_item_id INTEGER, -- reference to bill_of_materials_items if needed
    required_quantity DECIMAL(15,4) NOT NULL,
    reserved_quantity DECIMAL(15,4) DEFAULT 0,
    issued_quantity DECIMAL(15,4) DEFAULT 0,
    returned_quantity DECIMAL(15,4) DEFAULT 0,
    unit_cost DECIMAL(15,2) DEFAULT 0,
    line_total DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reserved, issued, completed
    warehouse_id INTEGER REFERENCES warehouses(id),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material Reservations (reserve inventory for work orders)
CREATE TABLE IF NOT EXISTS material_reservations (
    id SERIAL PRIMARY KEY,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    work_order_material_id INTEGER REFERENCES work_order_materials(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    warehouse_id INTEGER REFERENCES warehouses(id),
    reserved_quantity DECIMAL(15,4) NOT NULL,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP, -- auto-release if not used by this date
    status VARCHAR(50) DEFAULT 'active', -- active, released, expired, consumed
    reserved_by INTEGER REFERENCES users(id),
    released_by INTEGER REFERENCES users(id),
    released_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MRP Calculations (history of MRP runs)
CREATE TABLE IF NOT EXISTS mrp_calculations (
    id SERIAL PRIMARY KEY,
    run_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    run_by INTEGER REFERENCES users(id),
    work_order_id INTEGER REFERENCES work_orders(id), -- if run for specific WO, null for all
    scope VARCHAR(50) DEFAULT 'all', -- all, specific_wo, specific_product
    status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
    total_items_checked INT DEFAULT 0,
    total_shortages_found INT DEFAULT 0,
    summary_data JSONB, -- store detailed results
    execution_time_seconds DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- MRP Shortage Items (items identified as short)
CREATE TABLE IF NOT EXISTS mrp_shortage_items (
    id SERIAL PRIMARY KEY,
    mrp_calculation_id INTEGER NOT NULL REFERENCES mrp_calculations(id) ON DELETE CASCADE,
    work_order_id INTEGER REFERENCES work_orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    required_quantity DECIMAL(15,4) NOT NULL,
    available_quantity DECIMAL(15,4) DEFAULT 0,
    reserved_quantity DECIMAL(15,4) DEFAULT 0,
    shortage_quantity DECIMAL(15,4) NOT NULL,
    required_date DATE,
    recommendation VARCHAR(100), -- purchase, transfer, cancel_wo, etc.
    recommendation_data JSONB, -- supplier suggestions, transfer sources, etc.
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workstation Capacity Planning (optional - for advanced scheduling)
CREATE TABLE IF NOT EXISTS workstation_capacity (
    id SERIAL PRIMARY KEY,
    workstation_id INTEGER NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    shift VARCHAR(50), -- morning, afternoon, night, or shift number
    available_hours DECIMAL(10,2) NOT NULL,
    scheduled_hours DECIMAL(10,2) DEFAULT 0,
    actual_hours DECIMAL(10,2) DEFAULT 0,
    efficiency_percentage DECIMAL(5,2) DEFAULT 100.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workstation_id, date, shift)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Workstations indexes
CREATE INDEX IF NOT EXISTS idx_workstations_code ON workstations(workstation_code);
CREATE INDEX IF NOT EXISTS idx_workstations_type ON workstations(workstation_type);
CREATE INDEX IF NOT EXISTS idx_workstations_status ON workstations(status);

-- Production routes indexes
CREATE INDEX IF NOT EXISTS idx_production_routes_product ON production_routes(product_id);
CREATE INDEX IF NOT EXISTS idx_production_routes_code ON production_routes(route_code);
CREATE INDEX IF NOT EXISTS idx_production_routes_default ON production_routes(is_default) WHERE is_default = true;

-- Production route operations indexes
CREATE INDEX IF NOT EXISTS idx_route_operations_route ON production_route_operations(route_id);
CREATE INDEX IF NOT EXISTS idx_route_operations_workstation ON production_route_operations(workstation_id);
CREATE INDEX IF NOT EXISTS idx_route_operations_sequence ON production_route_operations(route_id, sequence_number);

-- Work order operations indexes
CREATE INDEX IF NOT EXISTS idx_wo_operations_wo ON work_order_operations(work_order_id);
CREATE INDEX IF NOT EXISTS idx_wo_operations_workstation ON work_order_operations(workstation_id);
CREATE INDEX IF NOT EXISTS idx_wo_operations_status ON work_order_operations(status);
CREATE INDEX IF NOT EXISTS idx_wo_operations_operator ON work_order_operations(operator_id);

-- Work order materials indexes
CREATE INDEX IF NOT EXISTS idx_wo_materials_wo ON work_order_materials(work_order_id);
CREATE INDEX IF NOT EXISTS idx_wo_materials_product ON work_order_materials(product_id);
CREATE INDEX IF NOT EXISTS idx_wo_materials_status ON work_order_materials(status);

-- Material reservations indexes
CREATE INDEX IF NOT EXISTS idx_material_reservations_wo ON material_reservations(work_order_id);
CREATE INDEX IF NOT EXISTS idx_material_reservations_product ON material_reservations(product_id);
CREATE INDEX IF NOT EXISTS idx_material_reservations_status ON material_reservations(status);
CREATE INDEX IF NOT EXISTS idx_material_reservations_expiry ON material_reservations(expiry_date) WHERE status = 'active';

-- MRP calculations indexes
CREATE INDEX IF NOT EXISTS idx_mrp_calculations_date ON mrp_calculations(run_date DESC);
CREATE INDEX IF NOT EXISTS idx_mrp_calculations_wo ON mrp_calculations(work_order_id);
CREATE INDEX IF NOT EXISTS idx_mrp_calculations_status ON mrp_calculations(status);

-- MRP shortage items indexes
CREATE INDEX IF NOT EXISTS idx_mrp_shortages_calculation ON mrp_shortage_items(mrp_calculation_id);
CREATE INDEX IF NOT EXISTS idx_mrp_shortages_wo ON mrp_shortage_items(work_order_id);
CREATE INDEX IF NOT EXISTS idx_mrp_shortages_product ON mrp_shortage_items(product_id);
CREATE INDEX IF NOT EXISTS idx_mrp_shortages_status ON mrp_shortage_items(status);

-- Workstation capacity indexes
CREATE INDEX IF NOT EXISTS idx_workstation_capacity_ws ON workstation_capacity(workstation_id);
CREATE INDEX IF NOT EXISTS idx_workstation_capacity_date ON workstation_capacity(date);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample workstations
INSERT INTO workstations (workstation_code, workstation_name, workstation_type, capacity_per_hour, cost_per_hour, location, status)
VALUES 
    ('WS-CUT-01', 'Cutting Station 1', 'cutting', 50, 25.00, 'Production Floor A', 'active'),
    ('WS-SEW-01', 'Sewing Station 1', 'sewing', 30, 20.00, 'Production Floor A', 'active'),
    ('WS-SEW-02', 'Sewing Station 2', 'sewing', 30, 20.00, 'Production Floor A', 'active'),
    ('WS-PKG-01', 'Packaging Station 1', 'packaging', 100, 15.00, 'Production Floor B', 'active'),
    ('WS-QC-01', 'Quality Control Station 1', 'inspection', 80, 22.00, 'Production Floor B', 'active'),
    ('WS-ASM-01', 'Assembly Station 1', 'assembly', 40, 28.00, 'Production Floor A', 'active'),
    ('WS-MIX-01', 'Mixing Station 1', 'mixing', 200, 35.00, 'Production Floor C', 'active'),
    ('WS-FILL-01', 'Filling Station 1', 'filling', 150, 30.00, 'Production Floor C', 'active'),
    ('WS-LABEL-01', 'Labeling Station 1', 'labeling', 120, 18.00, 'Production Floor C', 'active'),
    ('WS-WELD-01', 'Welding Station 1', 'welding', 20, 40.00, 'Production Floor D', 'active')
ON CONFLICT (workstation_code) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to check material availability
CREATE OR REPLACE FUNCTION check_material_availability(
    p_product_id INTEGER,
    p_required_quantity DECIMAL,
    p_warehouse_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
    available_quantity DECIMAL,
    reserved_quantity DECIMAL,
    free_quantity DECIMAL,
    is_sufficient BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH material_status AS (
        SELECT 
            p.id,
            COALESCE(p.current_stock, 0) as stock,
            COALESCE(SUM(mr.reserved_quantity), 0) as reserved
        FROM products p
        LEFT JOIN material_reservations mr ON mr.product_id = p.id 
            AND mr.status = 'active'
            AND (p_warehouse_id IS NULL OR mr.warehouse_id = p_warehouse_id)
        WHERE p.id = p_product_id
        GROUP BY p.id, p.current_stock
    )
    SELECT 
        stock as available_quantity,
        reserved as reserved_quantity,
        (stock - reserved) as free_quantity,
        (stock - reserved) >= p_required_quantity as is_sufficient
    FROM material_status;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-calculate MRP for a work order
CREATE OR REPLACE FUNCTION calculate_mrp_for_work_order(p_work_order_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
    v_mrp_calculation_id INTEGER;
    v_shortages_count INTEGER := 0;
BEGIN
    -- Create MRP calculation record
    INSERT INTO mrp_calculations (work_order_id, scope, status, run_date)
    VALUES (p_work_order_id, 'specific_wo', 'running', CURRENT_TIMESTAMP)
    RETURNING id INTO v_mrp_calculation_id;
    
    -- Check each material requirement
    INSERT INTO mrp_shortage_items (
        mrp_calculation_id, work_order_id, product_id,
        required_quantity, available_quantity, reserved_quantity, shortage_quantity,
        required_date, recommendation, status
    )
    SELECT 
        v_mrp_calculation_id,
        wom.work_order_id,
        wom.product_id,
        wom.required_quantity,
        COALESCE(p.current_stock, 0),
        COALESCE(wom.reserved_quantity, 0),
        GREATEST(wom.required_quantity - COALESCE(p.current_stock, 0) + COALESCE(wom.reserved_quantity, 0), 0),
        wo.planned_start_date,
        CASE 
            WHEN COALESCE(p.current_stock, 0) < wom.required_quantity THEN 'purchase'
            ELSE 'sufficient'
        END,
        CASE 
            WHEN COALESCE(p.current_stock, 0) < wom.required_quantity THEN 'open'
            ELSE 'resolved'
        END
    FROM work_order_materials wom
    JOIN work_orders wo ON wo.id = wom.work_order_id
    JOIN products p ON p.id = wom.product_id
    WHERE wom.work_order_id = p_work_order_id
        AND COALESCE(p.current_stock, 0) < wom.required_quantity;
    
    GET DIAGNOSTICS v_shortages_count = ROW_COUNT;
    
    -- Update MRP calculation status
    UPDATE mrp_calculations
    SET status = 'completed',
        total_shortages_found = v_shortages_count,
        completed_at = CURRENT_TIMESTAMP
    WHERE id = v_mrp_calculation_id;
    
    RETURN v_mrp_calculation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-populate work order materials from BOM
CREATE OR REPLACE FUNCTION populate_work_order_materials_from_bom()
RETURNS TRIGGER AS $$
BEGIN
    -- Only populate if work order has a BOM and is in draft/ready status
    IF NEW.bom_id IS NOT NULL AND NEW.status IN ('draft', 'ready') THEN
        INSERT INTO work_order_materials (
            work_order_id, product_id, bom_item_id, required_quantity, 
            unit_cost, line_total, status
        )
        SELECT 
            NEW.id,
            bomi.component_product_id,
            bomi.id,
            bomi.quantity * NEW.quantity_to_produce,
            COALESCE(p.cost_price, 0),
            (bomi.quantity * NEW.quantity_to_produce) * COALESCE(p.cost_price, 0),
            'pending'
        FROM bill_of_materials_items bomi
        JOIN products p ON p.id = bomi.component_product_id
        WHERE bomi.bom_id = NEW.bom_id
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to populate materials when work order is created
DROP TRIGGER IF EXISTS trigger_populate_wo_materials ON work_orders;
CREATE TRIGGER trigger_populate_wo_materials
    AFTER INSERT ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION populate_work_order_materials_from_bom();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE workstations IS 'Workstations, machines, and work centers for production operations';
COMMENT ON TABLE production_routes IS 'Production routing templates defining operation sequences for products';
COMMENT ON TABLE production_route_operations IS 'Individual operations within a production route';
COMMENT ON TABLE work_order_operations IS 'Actual operations scheduled for specific work orders';
COMMENT ON TABLE work_order_materials IS 'Material requirements and consumption tracking for work orders';
COMMENT ON TABLE material_reservations IS 'Inventory reservations for work orders to prevent double-allocation';
COMMENT ON TABLE mrp_calculations IS 'History of MRP calculation runs and their results';
COMMENT ON TABLE mrp_shortage_items IS 'Material shortages identified by MRP calculations';
COMMENT ON TABLE workstation_capacity IS 'Daily capacity planning and utilization tracking for workstations';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Operations Module Enhancement - Phase 1 Schema Created Successfully';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables Created:';
    RAISE NOTICE '   - workstations (with sample data)';
    RAISE NOTICE '   - production_routes';
    RAISE NOTICE '   - production_route_operations';
    RAISE NOTICE '   - work_order_operations';
    RAISE NOTICE '   - work_order_materials';
    RAISE NOTICE '   - material_reservations';
    RAISE NOTICE '   - mrp_calculations';
    RAISE NOTICE '   - mrp_shortage_items';
    RAISE NOTICE '   - workstation_capacity';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Functions Created:';
    RAISE NOTICE '   - check_material_availability()';
    RAISE NOTICE '   - calculate_mrp_for_work_order()';
    RAISE NOTICE '   - populate_work_order_materials_from_bom()';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Triggers Created:';
    RAISE NOTICE '   - trigger_populate_wo_materials (auto-populate materials from BOM)';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '   1. Run API implementation';
    RAISE NOTICE '   2. Implement frontend UI';
    RAISE NOTICE '   3. Test MRP calculations';
    RAISE NOTICE '=================================================================';
END $$;
