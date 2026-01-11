-- Ocean ERP Operations Module Enhancement
-- Phase 1: MRP (Material Requirements Planning) and Production Routing
-- Created: December 1, 2025

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- WORKSTATIONS & RESOURCES
-- =====================================================

-- Workstations (machines, work centers, production lines)
CREATE TABLE IF NOT EXISTS workstations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Production Routes (sequence of operations for products)
CREATE TABLE IF NOT EXISTS production_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_code VARCHAR(50) UNIQUE NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Production Route Operations (steps in a route)
CREATE TABLE IF NOT EXISTS production_route_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES production_routes(id) ON DELETE CASCADE,
    sequence_number INT NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- setup, process, inspection, packaging
    workstation_id UUID REFERENCES workstations(id),
    description TEXT,
    setup_time_minutes INT DEFAULT 0,
    run_time_per_unit DECIMAL(10,2) DEFAULT 0, -- minutes per unit
    labor_cost_per_hour DECIMAL(10,2) DEFAULT 0,
    labor_hours_per_unit DECIMAL(10,4) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route_id, sequence_number)
);

-- =====================================================
-- WORK ORDER ENHANCEMENTS
-- =====================================================

-- Work Order Operations (actual operations for a specific work order)
CREATE TABLE IF NOT EXISTS work_order_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    operation_id UUID REFERENCES production_route_operations(id),
    sequence_number INT NOT NULL,
    operation_name VARCHAR(255) NOT NULL,
    workstation_id UUID REFERENCES workstations(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, skipped
    planned_start_time TIMESTAMP WITH TIME ZONE,
    planned_end_time TIMESTAMP WITH TIME ZONE,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    setup_time_actual_minutes INT,
    run_time_actual_minutes INT,
    quantity_completed INT DEFAULT 0,
    quantity_rejected INT DEFAULT 0,
    operator_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Work Order Materials (materials required for work order from BOM)
CREATE TABLE IF NOT EXISTS work_order_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    bom_item_id UUID REFERENCES bom_items(id),
    quantity_required DECIMAL(15,4) NOT NULL,
    quantity_reserved DECIMAL(15,4) DEFAULT 0,
    quantity_consumed DECIMAL(15,4) DEFAULT 0,
    unit_cost DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) GENERATED ALWAYS AS (quantity_required * unit_cost) STORED,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reserved, issued, consumed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Reservations (reserve materials for work orders)
CREATE TABLE IF NOT EXISTS material_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    location_id UUID REFERENCES inventory_locations(id),
    quantity_reserved DECIMAL(15,4) NOT NULL,
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active', -- active, released, expired, consumed
    reserved_by UUID REFERENCES users(id),
    released_by UUID REFERENCES users(id),
    released_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MRP Calculations (store MRP calculation results)
CREATE TABLE IF NOT EXISTS mrp_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_to_produce DECIMAL(15,4) NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_material_cost DECIMAL(15,2) DEFAULT 0,
    can_produce BOOLEAN DEFAULT false,
    has_shortages BOOLEAN DEFAULT false,
    shortage_count INT DEFAULT 0,
    calculation_details JSONB, -- store detailed breakdown
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MRP Shortage Items (track material shortages)
CREATE TABLE IF NOT EXISTS mrp_shortage_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mrp_calculation_id UUID NOT NULL REFERENCES mrp_calculations(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_required DECIMAL(15,4) NOT NULL,
    quantity_available DECIMAL(15,4) NOT NULL,
    quantity_shortage DECIMAL(15,4) GENERATED ALWAYS AS (quantity_required - quantity_available) STORED,
    estimated_cost DECIMAL(15,2) DEFAULT 0,
    recommended_action VARCHAR(100), -- purchase, transfer, substitute, wait
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CAPACITY PLANNING
-- =====================================================

-- Workstation Capacity Schedule
CREATE TABLE IF NOT EXISTS workstation_capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workstation_id UUID NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    shift VARCHAR(50) NOT NULL, -- morning, afternoon, night, or custom
    available_hours DECIMAL(5,2) NOT NULL,
    scheduled_hours DECIMAL(5,2) DEFAULT 0,
    actual_hours DECIMAL(5,2) DEFAULT 0,
    utilization_rate DECIMAL(5,2) GENERATED ALWAYS AS 
        (CASE WHEN available_hours > 0 THEN (scheduled_hours / available_hours * 100) ELSE 0 END) STORED,
    status VARCHAR(50) DEFAULT 'available', -- available, scheduled, maintenance
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workstation_id, schedule_date, shift)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Workstations indexes
CREATE INDEX idx_workstations_code ON workstations(workstation_code);
CREATE INDEX idx_workstations_status ON workstations(status);
CREATE INDEX idx_workstations_type ON workstations(workstation_type);

-- Production routes indexes
CREATE INDEX idx_production_routes_product ON production_routes(product_id);
CREATE INDEX idx_production_routes_code ON production_routes(route_code);
CREATE INDEX idx_production_routes_default ON production_routes(is_default) WHERE is_default = true;

-- Route operations indexes
CREATE INDEX idx_route_operations_route ON production_route_operations(route_id);
CREATE INDEX idx_route_operations_workstation ON production_route_operations(workstation_id);
CREATE INDEX idx_route_operations_sequence ON production_route_operations(route_id, sequence_number);

-- Work order operations indexes
CREATE INDEX idx_wo_operations_work_order ON work_order_operations(work_order_id);
CREATE INDEX idx_wo_operations_workstation ON work_order_operations(workstation_id);
CREATE INDEX idx_wo_operations_status ON work_order_operations(status);
CREATE INDEX idx_wo_operations_operator ON work_order_operations(operator_id);

-- Work order materials indexes
CREATE INDEX idx_wo_materials_work_order ON work_order_materials(work_order_id);
CREATE INDEX idx_wo_materials_product ON work_order_materials(product_id);
CREATE INDEX idx_wo_materials_status ON work_order_materials(status);

-- Material reservations indexes
CREATE INDEX idx_material_reservations_wo ON material_reservations(work_order_id);
CREATE INDEX idx_material_reservations_product ON material_reservations(product_id);
CREATE INDEX idx_material_reservations_status ON material_reservations(status);
CREATE INDEX idx_material_reservations_location ON material_reservations(location_id);

-- MRP calculations indexes
CREATE INDEX idx_mrp_calculations_wo ON mrp_calculations(work_order_id);
CREATE INDEX idx_mrp_calculations_product ON mrp_calculations(product_id);
CREATE INDEX idx_mrp_calculations_date ON mrp_calculations(calculation_date);
CREATE INDEX idx_mrp_calculations_shortages ON mrp_calculations(has_shortages) WHERE has_shortages = true;

-- MRP shortage items indexes
CREATE INDEX idx_mrp_shortage_calculation ON mrp_shortage_items(mrp_calculation_id);
CREATE INDEX idx_mrp_shortage_product ON mrp_shortage_items(product_id);

-- Workstation capacity indexes
CREATE INDEX idx_workstation_capacity_ws ON workstation_capacity(workstation_id);
CREATE INDEX idx_workstation_capacity_date ON workstation_capacity(schedule_date);
CREATE INDEX idx_workstation_capacity_status ON workstation_capacity(status);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample workstations
INSERT INTO workstations (workstation_code, workstation_name, workstation_type, capacity_per_hour, cost_per_hour, setup_time_minutes, description) VALUES
    ('WS-001', 'Mixing Station 1', 'mixing', 20.00, 50.00, 30, 'Primary mixing station for liquid products'),
    ('WS-002', 'Mixing Station 2', 'mixing', 20.00, 50.00, 30, 'Secondary mixing station for backup'),
    ('WS-003', 'Filling Line 1', 'filling', 100.00, 75.00, 45, 'Automated filling line for bottles'),
    ('WS-004', 'Filling Line 2', 'filling', 80.00, 70.00, 45, 'Semi-automated filling line'),
    ('WS-005', 'Labeling Station', 'labeling', 120.00, 40.00, 15, 'Automatic labeling machine'),
    ('WS-006', 'Packaging Line 1', 'packaging', 150.00, 60.00, 20, 'Primary packaging line'),
    ('WS-007', 'Quality Inspection', 'inspection', 50.00, 45.00, 10, 'Quality control inspection station'),
    ('WS-008', 'Assembly Table 1', 'assembly', 30.00, 35.00, 5, 'Manual assembly workstation'),
    ('WS-009', 'Assembly Table 2', 'assembly', 30.00, 35.00, 5, 'Manual assembly workstation'),
    ('WS-010', 'Curing Chamber', 'curing', 500.00, 25.00, 60, 'Temperature-controlled curing chamber')
ON CONFLICT (workstation_code) DO NOTHING;

-- Insert sample production route (for a skincare product example)
DO $$
DECLARE
    sample_product_id UUID;
    new_route_id UUID;
BEGIN
    -- Get a sample product (assuming products exist)
    SELECT id INTO sample_product_id FROM products LIMIT 1;
    
    IF sample_product_id IS NOT NULL THEN
        -- Create a sample route
        INSERT INTO production_routes (route_code, route_name, product_id, is_default, description)
        VALUES ('ROUTE-001', 'Standard Lotion Production', sample_product_id, true, 'Standard production route for lotion products')
        RETURNING id INTO new_route_id;
        
        -- Add route operations
        INSERT INTO production_route_operations (route_id, sequence_number, operation_name, operation_type, workstation_id, setup_time_minutes, run_time_per_unit, labor_hours_per_unit, description)
        SELECT 
            new_route_id,
            seq,
            op_name,
            op_type,
            (SELECT id FROM workstations WHERE workstation_code = ws_code),
            setup_min,
            run_min,
            labor_hrs,
            descr
        FROM (VALUES
            (10, 'Material Preparation', 'setup', 'WS-008', 15, 0.5, 0.01, 'Prepare and measure raw materials'),
            (20, 'Mixing Phase 1', 'process', 'WS-001', 30, 1.0, 0.02, 'Mix base ingredients'),
            (30, 'Mixing Phase 2', 'process', 'WS-001', 0, 0.8, 0.015, 'Add active ingredients'),
            (40, 'Quality Check - Viscosity', 'inspection', 'WS-007', 5, 0.2, 0.005, 'Check product viscosity'),
            (50, 'Filling', 'process', 'WS-003', 45, 0.6, 0.008, 'Fill into bottles'),
            (60, 'Capping', 'process', 'WS-003', 0, 0.3, 0.005, 'Apply caps to bottles'),
            (70, 'Labeling', 'process', 'WS-005', 15, 0.4, 0.006, 'Apply product labels'),
            (80, 'Quality Check - Final', 'inspection', 'WS-007', 5, 0.3, 0.005, 'Final product inspection'),
            (90, 'Packaging', 'packaging', 'WS-006', 20, 0.5, 0.007, 'Package finished products'),
            (100, 'Curing (if needed)', 'process', 'WS-010', 60, 0.1, 0.001, 'Optional curing for certain formulations')
        ) AS ops(seq, op_name, op_type, ws_code, setup_min, run_min, labor_hrs, descr);
    END IF;
END $$;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update workstation capacity scheduled hours
CREATE OR REPLACE FUNCTION update_workstation_capacity()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called when work orders are scheduled
    -- For now, it's a placeholder for future scheduling logic
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to check material availability
CREATE OR REPLACE FUNCTION check_material_availability(
    p_product_id UUID,
    p_quantity DECIMAL
)
RETURNS TABLE(
    product_id UUID,
    product_name VARCHAR,
    required_quantity DECIMAL,
    available_quantity DECIMAL,
    shortage DECIMAL,
    has_shortage BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p_quantity,
        COALESCE(p.current_stock, 0),
        GREATEST(p_quantity - COALESCE(p.current_stock, 0), 0),
        (COALESCE(p.current_stock, 0) < p_quantity)
    FROM products p
    WHERE p.id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate MRP for a product
CREATE OR REPLACE FUNCTION calculate_mrp(
    p_product_id UUID,
    p_quantity DECIMAL
)
RETURNS TABLE(
    material_id UUID,
    material_name VARCHAR,
    material_sku VARCHAR,
    quantity_required DECIMAL,
    quantity_available DECIMAL,
    quantity_shortage DECIMAL,
    unit_cost DECIMAL,
    total_cost DECIMAL,
    has_shortage BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH bom_explosion AS (
        SELECT 
            bi.component_id,
            bi.quantity_required * p_quantity as required_qty,
            bi.unit_cost
        FROM bom_items bi
        INNER JOIN bill_of_materials bom ON bi.bom_id = bom.id
        WHERE bom.product_id = p_product_id
          AND bom.is_active = true
    )
    SELECT 
        p.id as material_id,
        p.name as material_name,
        p.sku as material_sku,
        be.required_qty as quantity_required,
        COALESCE(p.current_stock, 0) as quantity_available,
        GREATEST(be.required_qty - COALESCE(p.current_stock, 0), 0) as quantity_shortage,
        be.unit_cost,
        be.required_qty * be.unit_cost as total_cost,
        (COALESCE(p.current_stock, 0) < be.required_qty) as has_shortage
    FROM bom_explosion be
    INNER JOIN products p ON p.id = be.component_id
    ORDER BY has_shortage DESC, p.name;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE workstations IS 'Manufacturing workstations, machines, and work centers';
COMMENT ON TABLE production_routes IS 'Production routes defining manufacturing process for products';
COMMENT ON TABLE production_route_operations IS 'Individual operations within a production route';
COMMENT ON TABLE work_order_operations IS 'Actual operations performed for a work order';
COMMENT ON TABLE work_order_materials IS 'Materials required and consumed for work orders';
COMMENT ON TABLE material_reservations IS 'Material reservations to ensure availability';
COMMENT ON TABLE mrp_calculations IS 'MRP calculation results for material planning';
COMMENT ON TABLE mrp_shortage_items IS 'Items with material shortages identified by MRP';
COMMENT ON TABLE workstation_capacity IS 'Workstation capacity schedule and utilization';

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Operations Module Enhancement - Phase 1 Schema Created Successfully';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables Created:';
    RAISE NOTICE '  - workstations (10 sample records)';
    RAISE NOTICE '  - production_routes';
    RAISE NOTICE '  - production_route_operations';
    RAISE NOTICE '  - work_order_operations';
    RAISE NOTICE '  - work_order_materials';
    RAISE NOTICE '  - material_reservations';
    RAISE NOTICE '  - mrp_calculations';
    RAISE NOTICE '  - mrp_shortage_items';
    RAISE NOTICE '  - workstation_capacity';
    RAISE NOTICE '';
    RAISE NOTICE 'Functions Created:';
    RAISE NOTICE '  - check_material_availability()';
    RAISE NOTICE '  - calculate_mrp()';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '  1. Run API implementation';
    RAISE NOTICE '  2. Implement frontend UI';
    RAISE NOTICE '  3. Test MRP calculations';
    RAISE NOTICE '=================================================================';
END $$;
