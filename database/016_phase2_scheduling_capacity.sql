-- Ocean ERP Operations Module Enhancement
-- Phase 2: Production Planning & Scheduling
-- Created: December 1, 2024

-- =====================================================
-- WORKSTATION SHIFTS & CAPACITY
-- =====================================================

-- Workstation Shifts: Define working hours for workstations
CREATE TABLE IF NOT EXISTS workstation_shifts (
    id SERIAL PRIMARY KEY,
    workstation_id INTEGER NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
    shift_name VARCHAR(50) NOT NULL, -- morning, afternoon, night, custom
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workstation_id, shift_name, day_of_week, effective_date)
);

-- Capacity Allocations: Track workstation capacity usage by date
CREATE TABLE IF NOT EXISTS capacity_allocations (
    id SERIAL PRIMARY KEY,
    workstation_id INTEGER NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
    allocation_date DATE NOT NULL,
    shift_name VARCHAR(50),
    available_minutes INTEGER NOT NULL,
    allocated_minutes INTEGER DEFAULT 0,
    overtime_minutes INTEGER DEFAULT 0,
    efficiency_percentage DECIMAL(5,2) DEFAULT 100.00,
    utilization_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN available_minutes > 0 THEN (allocated_minutes::DECIMAL / available_minutes::DECIMAL * 100)
            ELSE 0
        END
    ) STORED,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workstation_id, allocation_date, shift_name)
);

-- =====================================================
-- PRODUCTION SCHEDULES
-- =====================================================

-- Production Schedules: Master schedule for work orders
CREATE TABLE IF NOT EXISTS production_schedules (
    id SERIAL PRIMARY KEY,
    schedule_code VARCHAR(50) UNIQUE NOT NULL,
    schedule_name VARCHAR(255) NOT NULL,
    schedule_type VARCHAR(50) DEFAULT 'forward', -- forward, backward, finite, infinite
    planning_horizon_start DATE NOT NULL,
    planning_horizon_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, completed, cancelled
    created_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    total_work_orders INTEGER DEFAULT 0,
    scheduled_work_orders INTEGER DEFAULT 0,
    conflicts_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Assignments: Link work orders to schedules with timing
CREATE TABLE IF NOT EXISTS schedule_assignments (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER NOT NULL REFERENCES production_schedules(id) ON DELETE CASCADE,
    work_order_id INTEGER NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    sequence_number INTEGER NOT NULL,
    scheduled_start_date TIMESTAMP NOT NULL,
    scheduled_end_date TIMESTAMP NOT NULL,
    actual_start_date TIMESTAMP,
    actual_end_date TIMESTAMP,
    priority INTEGER DEFAULT 50 CHECK (priority BETWEEN 1 AND 100),
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, delayed, cancelled
    assigned_to INTEGER REFERENCES users(id),
    predecessor_assignments INTEGER[], -- Array of assignment IDs this depends on
    successor_assignments INTEGER[], -- Array of assignment IDs that depend on this
    slack_time_hours DECIMAL(10,2), -- Available slack time
    is_critical_path BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(schedule_id, work_order_id)
);

-- Schedule Operation Assignments: Assign operations to workstations with timing
CREATE TABLE IF NOT EXISTS schedule_operation_assignments (
    id SERIAL PRIMARY KEY,
    schedule_assignment_id INTEGER NOT NULL REFERENCES schedule_assignments(id) ON DELETE CASCADE,
    work_order_operation_id INTEGER NOT NULL REFERENCES work_order_operations(id) ON DELETE CASCADE,
    workstation_id INTEGER NOT NULL REFERENCES workstations(id),
    scheduled_start_time TIMESTAMP NOT NULL,
    scheduled_end_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    setup_minutes INTEGER DEFAULT 0,
    run_minutes INTEGER NOT NULL,
    capacity_allocation_id INTEGER REFERENCES capacity_allocations(id),
    status VARCHAR(50) DEFAULT 'scheduled',
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(work_order_operation_id)
);

-- Schedule Conflicts: Track scheduling conflicts
CREATE TABLE IF NOT EXISTS schedule_conflicts (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER NOT NULL REFERENCES production_schedules(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL, -- capacity_overload, resource_conflict, dependency_violation, deadline_miss
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    workstation_id INTEGER REFERENCES workstations(id),
    affected_date DATE,
    affected_assignments INTEGER[], -- Array of schedule_assignment IDs
    conflict_description TEXT NOT NULL,
    suggested_resolution TEXT,
    status VARCHAR(50) DEFAULT 'open', -- open, acknowledged, resolved, ignored
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DEMAND FORECASTING
-- =====================================================

-- Demand Forecasts: Store forecast data
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id SERIAL PRIMARY KEY,
    forecast_code VARCHAR(50) UNIQUE NOT NULL,
    forecast_name VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    product_category_id INTEGER,
    forecast_method VARCHAR(50) NOT NULL, -- moving_average, exponential_smoothing, linear_regression, manual
    forecast_period VARCHAR(20) NOT NULL, -- daily, weekly, monthly
    forecast_start_date DATE NOT NULL,
    forecast_end_date DATE NOT NULL,
    baseline_data_start DATE,
    baseline_data_end DATE,
    baseline_data_points INTEGER,
    forecast_parameters JSONB, -- Store method-specific parameters
    accuracy_metrics JSONB, -- MAPE, MAD, MSE, etc.
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, archived
    created_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Demand Forecast Details: Individual forecast points
CREATE TABLE IF NOT EXISTS demand_forecast_details (
    id SERIAL PRIMARY KEY,
    forecast_id INTEGER NOT NULL REFERENCES demand_forecasts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    forecast_date DATE NOT NULL,
    forecast_period_start DATE NOT NULL,
    forecast_period_end DATE NOT NULL,
    forecasted_quantity DECIMAL(15,4) NOT NULL,
    actual_quantity DECIMAL(15,4),
    forecast_error DECIMAL(15,4), -- Actual - Forecast
    confidence_level DECIMAL(5,2), -- Percentage
    lower_bound DECIMAL(15,4), -- Lower confidence interval
    upper_bound DECIMAL(15,4), -- Upper confidence interval
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(forecast_id, product_id, forecast_date)
);

-- =====================================================
-- MASTER PRODUCTION SCHEDULE (MPS)
-- =====================================================

-- Product Families: Group products for aggregate planning
CREATE TABLE IF NOT EXISTS product_families (
    id SERIAL PRIMARY KEY,
    family_code VARCHAR(50) UNIQUE NOT NULL,
    family_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Family Members: Link products to families
CREATE TABLE IF NOT EXISTS product_family_members (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL REFERENCES product_families(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00,
    is_representative_product BOOLEAN DEFAULT false, -- Use for planning calculations
    effective_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(family_id, product_id, effective_date)
);

-- Master Production Schedule: High-level production plan
CREATE TABLE IF NOT EXISTS master_production_schedule (
    id SERIAL PRIMARY KEY,
    mps_code VARCHAR(50) UNIQUE NOT NULL,
    mps_name VARCHAR(255) NOT NULL,
    planning_horizon VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly
    planning_start_date DATE NOT NULL,
    planning_end_date DATE NOT NULL,
    freeze_horizon_days INTEGER DEFAULT 7, -- Days that cannot be changed
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, active, archived
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MPS Details: Planned production by period
CREATE TABLE IF NOT EXISTS mps_details (
    id SERIAL PRIMARY KEY,
    mps_id INTEGER NOT NULL REFERENCES master_production_schedule(id) ON DELETE CASCADE,
    period_number INTEGER NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    product_id INTEGER REFERENCES products(id),
    family_id INTEGER REFERENCES product_families(id),
    planned_quantity DECIMAL(15,4) NOT NULL,
    firm_planned_quantity DECIMAL(15,4) DEFAULT 0, -- Committed orders
    forecast_quantity DECIMAL(15,4) DEFAULT 0,
    available_to_promise DECIMAL(15,4),
    projected_on_hand DECIMAL(15,4),
    status VARCHAR(50) DEFAULT 'planned', -- planned, firm, released
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mps_id, period_number, product_id),
    CHECK (product_id IS NOT NULL OR family_id IS NOT NULL)
);

-- =====================================================
-- BOM ENHANCEMENTS FOR MULTI-LEVEL EXPLOSION
-- =====================================================

-- BOM Explosion Cache: Store pre-calculated BOM explosions
CREATE TABLE IF NOT EXISTS bom_explosion_cache (
    id SERIAL PRIMARY KEY,
    bom_id INTEGER NOT NULL REFERENCES bill_of_materials(id) ON DELETE CASCADE,
    component_product_id INTEGER NOT NULL REFERENCES products(id),
    level INTEGER NOT NULL, -- 0=top, 1=first level, 2=second level, etc.
    path INTEGER[], -- Array of bom_item_ids showing the path
    quantity_per_unit DECIMAL(15,6) NOT NULL, -- Total quantity needed per top-level unit
    is_phantom BOOLEAN DEFAULT false,
    lead_time_offset_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bom_id, component_product_id, level)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Workstation shifts indexes
CREATE INDEX IF NOT EXISTS idx_workstation_shifts_ws ON workstation_shifts(workstation_id);
CREATE INDEX IF NOT EXISTS idx_workstation_shifts_dow ON workstation_shifts(day_of_week);
CREATE INDEX IF NOT EXISTS idx_workstation_shifts_active ON workstation_shifts(is_active) WHERE is_active = true;

-- Capacity allocations indexes
CREATE INDEX IF NOT EXISTS idx_capacity_alloc_ws ON capacity_allocations(workstation_id);
CREATE INDEX IF NOT EXISTS idx_capacity_alloc_date ON capacity_allocations(allocation_date);
CREATE INDEX IF NOT EXISTS idx_capacity_alloc_ws_date ON capacity_allocations(workstation_id, allocation_date);
CREATE INDEX IF NOT EXISTS idx_capacity_alloc_utilization ON capacity_allocations(utilization_percentage);

-- Production schedules indexes
CREATE INDEX IF NOT EXISTS idx_prod_schedules_code ON production_schedules(schedule_code);
CREATE INDEX IF NOT EXISTS idx_prod_schedules_status ON production_schedules(status);
CREATE INDEX IF NOT EXISTS idx_prod_schedules_dates ON production_schedules(planning_horizon_start, planning_horizon_end);

-- Schedule assignments indexes
CREATE INDEX IF NOT EXISTS idx_sched_assign_schedule ON schedule_assignments(schedule_id);
CREATE INDEX IF NOT EXISTS idx_sched_assign_wo ON schedule_assignments(work_order_id);
CREATE INDEX IF NOT EXISTS idx_sched_assign_dates ON schedule_assignments(scheduled_start_date, scheduled_end_date);
CREATE INDEX IF NOT EXISTS idx_sched_assign_status ON schedule_assignments(status);
CREATE INDEX IF NOT EXISTS idx_sched_assign_critical ON schedule_assignments(is_critical_path) WHERE is_critical_path = true;

-- Schedule operation assignments indexes
CREATE INDEX IF NOT EXISTS idx_sched_op_assign_sa ON schedule_operation_assignments(schedule_assignment_id);
CREATE INDEX IF NOT EXISTS idx_sched_op_assign_wo_op ON schedule_operation_assignments(work_order_operation_id);
CREATE INDEX IF NOT EXISTS idx_sched_op_assign_ws ON schedule_operation_assignments(workstation_id);
CREATE INDEX IF NOT EXISTS idx_sched_op_assign_times ON schedule_operation_assignments(scheduled_start_time, scheduled_end_time);

-- Schedule conflicts indexes
CREATE INDEX IF NOT EXISTS idx_sched_conflicts_schedule ON schedule_conflicts(schedule_id);
CREATE INDEX IF NOT EXISTS idx_sched_conflicts_type ON schedule_conflicts(conflict_type);
CREATE INDEX IF NOT EXISTS idx_sched_conflicts_status ON schedule_conflicts(status);
CREATE INDEX IF NOT EXISTS idx_sched_conflicts_date ON schedule_conflicts(affected_date);

-- Demand forecasts indexes
CREATE INDEX IF NOT EXISTS idx_demand_forecast_product ON demand_forecasts(product_id);
CREATE INDEX IF NOT EXISTS idx_demand_forecast_status ON demand_forecasts(status);
CREATE INDEX IF NOT EXISTS idx_demand_forecast_dates ON demand_forecasts(forecast_start_date, forecast_end_date);

-- Demand forecast details indexes
CREATE INDEX IF NOT EXISTS idx_demand_detail_forecast ON demand_forecast_details(forecast_id);
CREATE INDEX IF NOT EXISTS idx_demand_detail_product ON demand_forecast_details(product_id);
CREATE INDEX IF NOT EXISTS idx_demand_detail_date ON demand_forecast_details(forecast_date);

-- Product families indexes
CREATE INDEX IF NOT EXISTS idx_product_families_code ON product_families(family_code);
CREATE INDEX IF NOT EXISTS idx_product_families_active ON product_families(is_active) WHERE is_active = true;

-- Product family members indexes
CREATE INDEX IF NOT EXISTS idx_family_members_family ON product_family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_product ON product_family_members(product_id);
CREATE INDEX IF NOT EXISTS idx_family_members_rep ON product_family_members(is_representative_product) WHERE is_representative_product = true;

-- MPS indexes
CREATE INDEX IF NOT EXISTS idx_mps_code ON master_production_schedule(mps_code);
CREATE INDEX IF NOT EXISTS idx_mps_status ON master_production_schedule(status);
CREATE INDEX IF NOT EXISTS idx_mps_dates ON master_production_schedule(planning_start_date, planning_end_date);

-- MPS details indexes
CREATE INDEX IF NOT EXISTS idx_mps_details_mps ON mps_details(mps_id);
CREATE INDEX IF NOT EXISTS idx_mps_details_product ON mps_details(product_id);
CREATE INDEX IF NOT EXISTS idx_mps_details_family ON mps_details(family_id);
CREATE INDEX IF NOT EXISTS idx_mps_details_period ON mps_details(period_start_date, period_end_date);

-- BOM explosion cache indexes
CREATE INDEX IF NOT EXISTS idx_bom_explosion_bom ON bom_explosion_cache(bom_id);
CREATE INDEX IF NOT EXISTS idx_bom_explosion_component ON bom_explosion_cache(component_product_id);
CREATE INDEX IF NOT EXISTS idx_bom_explosion_level ON bom_explosion_cache(level);

-- =====================================================
-- FUNCTIONS & STORED PROCEDURES
-- =====================================================

-- Function: Calculate available capacity for a workstation on a date
CREATE OR REPLACE FUNCTION calculate_workstation_capacity(
    p_workstation_id INTEGER,
    p_date DATE
)
RETURNS TABLE (
    available_minutes INTEGER,
    allocated_minutes INTEGER,
    free_minutes INTEGER,
    utilization_percentage DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    WITH shift_capacity AS (
        SELECT 
            SUM(
                EXTRACT(EPOCH FROM (end_time - start_time))/60 - break_duration_minutes
            )::INTEGER as total_shift_minutes
        FROM workstation_shifts
        WHERE workstation_id = p_workstation_id
        AND day_of_week = EXTRACT(DOW FROM p_date)
        AND is_active = true
    ),
    current_allocation AS (
        SELECT 
            COALESCE(SUM(allocated_minutes), 0)::INTEGER as total_allocated
        FROM capacity_allocations
        WHERE workstation_id = p_workstation_id
        AND allocation_date = p_date
    )
    SELECT 
        COALESCE(sc.total_shift_minutes, 0) as available_minutes,
        COALESCE(ca.total_allocated, 0) as allocated_minutes,
        COALESCE(sc.total_shift_minutes, 0) - COALESCE(ca.total_allocated, 0) as free_minutes,
        CASE 
            WHEN COALESCE(sc.total_shift_minutes, 0) > 0 
            THEN (COALESCE(ca.total_allocated, 0)::DECIMAL / sc.total_shift_minutes::DECIMAL * 100)
            ELSE 0
        END as utilization_percentage
    FROM shift_capacity sc
    CROSS JOIN current_allocation ca;
END;
$$ LANGUAGE plpgsql;

-- Function: Detect scheduling conflicts for a schedule
CREATE OR REPLACE FUNCTION detect_schedule_conflicts(p_schedule_id INTEGER)
RETURNS TABLE (
    conflict_type VARCHAR,
    severity VARCHAR,
    workstation_id INTEGER,
    affected_date DATE,
    description TEXT
) AS $$
BEGIN
    -- Capacity overload conflicts
    RETURN QUERY
    SELECT 
        'capacity_overload'::VARCHAR as conflict_type,
        CASE 
            WHEN ca.utilization_percentage > 120 THEN 'critical'
            WHEN ca.utilization_percentage > 100 THEN 'high'
            ELSE 'medium'
        END::VARCHAR as severity,
        ca.workstation_id,
        ca.allocation_date as affected_date,
        'Workstation ' || w.workstation_name || ' overloaded on ' || 
        ca.allocation_date || ' (utilization: ' || 
        ROUND(ca.utilization_percentage, 2) || '%)'::TEXT as description
    FROM capacity_allocations ca
    JOIN workstations w ON w.id = ca.workstation_id
    WHERE ca.utilization_percentage > 100
    AND EXISTS (
        SELECT 1 FROM schedule_operation_assignments soa
        JOIN schedule_assignments sa ON sa.id = soa.schedule_assignment_id
        WHERE sa.schedule_id = p_schedule_id
        AND soa.workstation_id = ca.workstation_id
        AND DATE(soa.scheduled_start_time) = ca.allocation_date
    );
    
    -- Resource conflicts (same workstation, overlapping times)
    RETURN QUERY
    SELECT 
        'resource_conflict'::VARCHAR,
        'high'::VARCHAR,
        soa1.workstation_id,
        DATE(soa1.scheduled_start_time) as affected_date,
        'Workstation ' || w.workstation_name || ' has overlapping operations on ' || 
        DATE(soa1.scheduled_start_time)::TEXT as description
    FROM schedule_operation_assignments soa1
    JOIN schedule_operation_assignments soa2 ON soa1.workstation_id = soa2.workstation_id
    JOIN schedule_assignments sa1 ON sa1.id = soa1.schedule_assignment_id
    JOIN schedule_assignments sa2 ON sa2.id = soa2.schedule_assignment_id
    JOIN workstations w ON w.id = soa1.workstation_id
    WHERE sa1.schedule_id = p_schedule_id
    AND sa2.schedule_id = p_schedule_id
    AND soa1.id < soa2.id
    AND soa1.scheduled_start_time < soa2.scheduled_end_time
    AND soa1.scheduled_end_time > soa2.scheduled_start_time;
END;
$$ LANGUAGE plpgsql;

-- Function: Explode BOM recursively (multi-level)
CREATE OR REPLACE FUNCTION explode_bom_recursive(
    p_product_id INTEGER,
    p_quantity DECIMAL DEFAULT 1,
    p_level INTEGER DEFAULT 0,
    p_path INTEGER[] DEFAULT ARRAY[]::INTEGER[]
)
RETURNS TABLE (
    level INTEGER,
    component_product_id INTEGER,
    component_sku VARCHAR,
    component_name VARCHAR,
    quantity_per_unit DECIMAL,
    total_quantity DECIMAL,
    has_sub_bom BOOLEAN,
    path INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE bom_tree AS (
        -- Base case: direct components
        SELECT 
            0 as level,
            bomi.component_product_id,
            p.sku as component_sku,
            p.name as component_name,
            bomi.quantity as quantity_per_unit,
            bomi.quantity * p_quantity as total_quantity,
            EXISTS(SELECT 1 FROM bill_of_materials WHERE product_id = bomi.component_product_id AND is_active = true) as has_sub_bom,
            ARRAY[bomi.id] as path
        FROM bill_of_materials_items bomi
        JOIN products p ON p.id = bomi.component_product_id
        JOIN bill_of_materials bom ON bom.id = bomi.bom_id
        WHERE bom.product_id = p_product_id
        AND bom.is_active = true
        
        UNION ALL
        
        -- Recursive case: sub-components
        SELECT 
            bt.level + 1,
            bomi.component_product_id,
            p.sku,
            p.name,
            bomi.quantity,
            bomi.quantity * bt.total_quantity,
            EXISTS(SELECT 1 FROM bill_of_materials WHERE product_id = bomi.component_product_id AND is_active = true),
            bt.path || bomi.id
        FROM bom_tree bt
        JOIN bill_of_materials bom ON bom.product_id = bt.component_product_id AND bom.is_active = true
        JOIN bill_of_materials_items bomi ON bomi.bom_id = bom.id
        JOIN products p ON p.id = bomi.component_product_id
        WHERE bt.has_sub_bom = true
        AND NOT (bomi.id = ANY(bt.path)) -- Prevent circular references
    )
    SELECT * FROM bom_tree
    ORDER BY level, component_sku;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample workstation shifts (5-day work week, 2 shifts)
INSERT INTO workstation_shifts (workstation_id, shift_name, day_of_week, start_time, end_time, break_duration_minutes)
SELECT 
    w.id,
    'morning',
    dow,
    '08:00'::TIME,
    '16:00'::TIME,
    60
FROM workstations w
CROSS JOIN generate_series(1, 5) as dow -- Monday to Friday
WHERE w.id <= 5
ON CONFLICT DO NOTHING;

INSERT INTO workstation_shifts (workstation_id, shift_name, day_of_week, start_time, end_time, break_duration_minutes)
SELECT 
    w.id,
    'afternoon',
    dow,
    '16:00'::TIME,
    '00:00'::TIME,
    60
FROM workstations w
CROSS JOIN generate_series(1, 5) as dow
WHERE w.id <= 5
ON CONFLICT DO NOTHING;

-- Insert sample product families
INSERT INTO product_families (family_code, family_name, description)
VALUES 
    ('FAM-APPAREL', 'Apparel Products', 'Clothing and textile products'),
    ('FAM-COSMETICS', 'Cosmetics & Skincare', 'Beauty and skincare products'),
    ('FAM-FURNITURE', 'Furniture', 'Home and office furniture')
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE workstation_shifts IS 'Define working hours and shifts for workstations';
COMMENT ON TABLE capacity_allocations IS 'Track daily capacity allocation and utilization by workstation';
COMMENT ON TABLE production_schedules IS 'Master production schedules for planning work orders';
COMMENT ON TABLE schedule_assignments IS 'Assign work orders to schedules with timing and dependencies';
COMMENT ON TABLE schedule_operation_assignments IS 'Assign individual operations to workstations with precise timing';
COMMENT ON TABLE schedule_conflicts IS 'Track and manage scheduling conflicts';
COMMENT ON TABLE demand_forecasts IS 'Store demand forecast models and parameters';
COMMENT ON TABLE demand_forecast_details IS 'Individual forecast data points with confidence intervals';
COMMENT ON TABLE product_families IS 'Group products for aggregate planning';
COMMENT ON TABLE master_production_schedule IS 'High-level production plan by period';
COMMENT ON TABLE mps_details IS 'Planned production quantities by period and product/family';
COMMENT ON TABLE bom_explosion_cache IS 'Cache for pre-calculated multi-level BOM explosions';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Phase 2: Production Planning & Scheduling Schema Created';
    RAISE NOTICE '=================================================================';
    RAISE NOTICE 'Tables Created:';
    RAISE NOTICE '   - workstation_shifts (shift definitions)';
    RAISE NOTICE '   - capacity_allocations (daily capacity tracking)';
    RAISE NOTICE '   - production_schedules (master schedules)';
    RAISE NOTICE '   - schedule_assignments (work order assignments)';
    RAISE NOTICE '   - schedule_operation_assignments (operation-level scheduling)';
    RAISE NOTICE '   - schedule_conflicts (conflict tracking)';
    RAISE NOTICE '   - demand_forecasts (forecast models)';
    RAISE NOTICE '   - demand_forecast_details (forecast data points)';
    RAISE NOTICE '   - product_families (product grouping)';
    RAISE NOTICE '   - product_family_members (family membership)';
    RAISE NOTICE '   - master_production_schedule (MPS header)';
    RAISE NOTICE '   - mps_details (MPS line items)';
    RAISE NOTICE '   - bom_explosion_cache (BOM explosion cache)';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Functions Created:';
    RAISE NOTICE '   - calculate_workstation_capacity()';
    RAISE NOTICE '   - detect_schedule_conflicts()';
    RAISE NOTICE '   - explode_bom_recursive()';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Sample Data:';
    RAISE NOTICE '   - Workstation shifts (2 shifts × 5 days × 5 workstations)';
    RAISE NOTICE '   - Product families (3 families)';
    RAISE NOTICE ' ';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '   1. Implement multi-level BOM explosion enhancement';
    RAISE NOTICE '   2. Create capacity planning APIs';
    RAISE NOTICE '   3. Create production scheduler APIs';
    RAISE NOTICE '   4. Implement demand forecasting engine';
    RAISE NOTICE '   5. Build Gantt chart UI';
    RAISE NOTICE '=================================================================';
END $$;
