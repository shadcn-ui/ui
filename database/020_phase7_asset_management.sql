-- =====================================================
-- Phase 7 Task 7: Asset Management System
-- =====================================================
-- Description: Comprehensive fixed asset tracking, maintenance scheduling,
--              depreciation calculations, and lifecycle management
-- Tables: 9 (categories, assets, locations, assignments, maintenance schedules,
--            maintenance records, depreciation records, disposal, transfers)
-- Features: QR/barcode tracking, preventive maintenance, depreciation methods,
--           asset transfer workflow, disposal tracking
-- =====================================================

-- =====================================================
-- 1. Asset Categories
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    parent_category_id INTEGER REFERENCES asset_categories(category_id),
    description TEXT,
    
    -- Depreciation defaults for this category
    default_useful_life_years INTEGER DEFAULT 5,
    default_depreciation_method VARCHAR(30) DEFAULT 'straight_line',
    default_salvage_value_percent DECIMAL(5,2) DEFAULT 10.00,
    
    -- Category settings
    requires_maintenance BOOLEAN DEFAULT false,
    maintenance_frequency_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (default_salvage_value_percent >= 0 AND default_salvage_value_percent <= 100),
    CHECK (default_depreciation_method IN ('straight_line', 'declining_balance', 'double_declining', 'sum_of_years', 'units_of_production'))
);

-- =====================================================
-- 2. Asset Locations
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_locations (
    location_id SERIAL PRIMARY KEY,
    location_code VARCHAR(20) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(30) DEFAULT 'building',
    
    -- Address
    building VARCHAR(100),
    floor VARCHAR(50),
    room_number VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Location hierarchy
    parent_location_id INTEGER REFERENCES asset_locations(location_id),
    
    -- GPS coordinates (optional)
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Location manager
    manager_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (location_type IN ('building', 'floor', 'room', 'warehouse', 'site', 'vehicle', 'external'))
);

-- =====================================================
-- 3. Assets (Master Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS assets (
    asset_id SERIAL PRIMARY KEY,
    asset_number VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(200) NOT NULL,
    
    -- Classification
    category_id INTEGER NOT NULL REFERENCES asset_categories(category_id),
    asset_type VARCHAR(50) DEFAULT 'tangible',
    
    -- Identification
    barcode VARCHAR(100) UNIQUE,
    qr_code VARCHAR(200) UNIQUE,
    serial_number VARCHAR(100),
    model_number VARCHAR(100),
    manufacturer VARCHAR(100),
    
    -- Status
    asset_status VARCHAR(30) DEFAULT 'available',
    condition_status VARCHAR(30) DEFAULT 'good',
    
    -- Location
    current_location_id INTEGER REFERENCES asset_locations(location_id),
    
    -- Financial information
    purchase_date DATE,
    purchase_price DECIMAL(15,2) NOT NULL DEFAULT 0,
    purchase_order_number VARCHAR(50),
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    
    -- Depreciation
    depreciation_method VARCHAR(30) DEFAULT 'straight_line',
    useful_life_years INTEGER DEFAULT 5,
    salvage_value DECIMAL(15,2) DEFAULT 0,
    depreciation_start_date DATE,
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    current_book_value DECIMAL(15,2),
    
    -- Warranty
    warranty_expiry_date DATE,
    warranty_provider VARCHAR(100),
    warranty_terms TEXT,
    
    -- Insurance
    is_insured BOOLEAN DEFAULT false,
    insurance_policy_number VARCHAR(50),
    insurance_value DECIMAL(15,2),
    insurance_expiry_date DATE,
    
    -- Assignment
    assigned_to_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    assigned_to_department_id INTEGER REFERENCES hrm_departments(department_id),
    assignment_date DATE,
    
    -- Maintenance
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_frequency_days INTEGER,
    
    -- Additional info
    description TEXT,
    specifications JSONB,
    notes TEXT,
    image_url TEXT,
    documents JSONB, -- Array of document URLs
    
    -- Tags for search
    tags TEXT[],
    
    -- Disposal
    disposal_date DATE,
    disposal_method VARCHAR(50),
    disposal_value DECIMAL(15,2),
    disposal_reason TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (asset_type IN ('tangible', 'intangible', 'equipment', 'vehicle', 'property', 'software', 'other')),
    CHECK (asset_status IN ('available', 'in_use', 'under_maintenance', 'reserved', 'damaged', 'lost', 'stolen', 'disposed', 'retired')),
    CHECK (condition_status IN ('excellent', 'good', 'fair', 'poor', 'needs_repair', 'beyond_repair')),
    CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'double_declining', 'sum_of_years', 'units_of_production')),
    CHECK (purchase_price >= 0),
    CHECK (salvage_value >= 0),
    CHECK (current_book_value >= 0)
);

-- =====================================================
-- 4. Asset Assignments (History)
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_assignments (
    assignment_id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    
    -- Assignment details
    assigned_to_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    assigned_to_department_id INTEGER REFERENCES hrm_departments(department_id),
    assigned_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Dates
    assignment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    
    -- Location
    location_id INTEGER REFERENCES asset_locations(location_id),
    
    -- Status
    assignment_status VARCHAR(30) DEFAULT 'active',
    
    -- Condition tracking
    condition_at_assignment VARCHAR(30),
    condition_at_return VARCHAR(30),
    
    -- Notes
    assignment_notes TEXT,
    return_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (assignment_status IN ('active', 'returned', 'overdue', 'lost', 'damaged')),
    CHECK (condition_at_assignment IN ('excellent', 'good', 'fair', 'poor', 'needs_repair')),
    CHECK (condition_at_return IN ('excellent', 'good', 'fair', 'poor', 'needs_repair', 'damaged', 'lost'))
);

-- =====================================================
-- 5. Asset Transfers
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_transfers (
    transfer_id SERIAL PRIMARY KEY,
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    asset_id INTEGER NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    
    -- Transfer details
    from_location_id INTEGER REFERENCES asset_locations(location_id),
    to_location_id INTEGER NOT NULL REFERENCES asset_locations(location_id),
    from_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    to_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    from_department_id INTEGER REFERENCES hrm_departments(department_id),
    to_department_id INTEGER REFERENCES hrm_departments(department_id),
    
    -- Transfer process
    requested_by INTEGER REFERENCES hrm_employees(employee_id),
    requested_date TIMESTAMP DEFAULT NOW(),
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date TIMESTAMP,
    transferred_by INTEGER REFERENCES hrm_employees(employee_id),
    transfer_date TIMESTAMP,
    received_by INTEGER REFERENCES hrm_employees(employee_id),
    received_date TIMESTAMP,
    
    -- Status
    transfer_status VARCHAR(30) DEFAULT 'pending',
    
    -- Reason and notes
    transfer_reason TEXT,
    notes TEXT,
    
    -- Condition
    condition_at_transfer VARCHAR(30),
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CHECK (transfer_status IN ('pending', 'approved', 'in_transit', 'completed', 'rejected', 'cancelled')),
    CHECK (condition_at_transfer IN ('excellent', 'good', 'fair', 'poor', 'needs_repair'))
);

-- =====================================================
-- 6. Maintenance Schedules
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_maintenance_schedules (
    schedule_id SERIAL PRIMARY KEY,
    schedule_name VARCHAR(100) NOT NULL,
    
    -- Asset or category
    asset_id INTEGER REFERENCES assets(asset_id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES asset_categories(category_id),
    
    -- Schedule details
    maintenance_type VARCHAR(50) NOT NULL,
    frequency_type VARCHAR(30) DEFAULT 'days',
    frequency_value INTEGER NOT NULL,
    
    -- Scheduling
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE,
    
    -- Work details
    estimated_duration_hours DECIMAL(5,2),
    estimated_cost DECIMAL(15,2),
    priority VARCHAR(20) DEFAULT 'medium',
    
    -- Assignment
    assigned_to_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    assigned_to_vendor VARCHAR(100),
    
    -- Checklist
    maintenance_checklist JSONB,
    required_parts JSONB,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Notes
    description TEXT,
    instructions TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (maintenance_type IN ('preventive', 'corrective', 'predictive', 'inspection', 'calibration', 'cleaning', 'testing', 'other')),
    CHECK (frequency_type IN ('days', 'weeks', 'months', 'years', 'usage_hours', 'mileage')),
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CHECK (frequency_value > 0)
);

-- =====================================================
-- 7. Maintenance Records
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_maintenance_records (
    maintenance_id SERIAL PRIMARY KEY,
    maintenance_number VARCHAR(50) UNIQUE NOT NULL,
    asset_id INTEGER NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    schedule_id INTEGER REFERENCES asset_maintenance_schedules(schedule_id),
    
    -- Maintenance details
    maintenance_type VARCHAR(50) NOT NULL,
    maintenance_date DATE NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    actual_duration_hours DECIMAL(5,2),
    
    -- Who performed it
    performed_by_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    performed_by_vendor VARCHAR(100),
    vendor_invoice_number VARCHAR(50),
    
    -- Status
    maintenance_status VARCHAR(30) DEFAULT 'scheduled',
    priority VARCHAR(20) DEFAULT 'medium',
    
    -- Issue details
    issue_description TEXT,
    work_performed TEXT,
    parts_used JSONB,
    parts_cost DECIMAL(15,2) DEFAULT 0,
    labor_cost DECIMAL(15,2) DEFAULT 0,
    other_costs DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) GENERATED ALWAYS AS (parts_cost + labor_cost + other_costs) STORED,
    
    -- Results
    condition_before VARCHAR(30),
    condition_after VARCHAR(30),
    is_resolved BOOLEAN DEFAULT false,
    requires_followup BOOLEAN DEFAULT false,
    followup_date DATE,
    
    -- Downtime tracking
    asset_downtime_hours DECIMAL(10,2),
    
    -- Documentation
    notes TEXT,
    attachments JSONB,
    
    -- Approval
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date TIMESTAMP,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (maintenance_type IN ('preventive', 'corrective', 'predictive', 'inspection', 'calibration', 'cleaning', 'testing', 'emergency', 'other')),
    CHECK (maintenance_status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'deferred')),
    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CHECK (condition_before IN ('excellent', 'good', 'fair', 'poor', 'needs_repair', 'failed')),
    CHECK (condition_after IN ('excellent', 'good', 'fair', 'poor', 'needs_repair', 'failed'))
);

-- =====================================================
-- 8. Depreciation Records
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_depreciation_records (
    depreciation_id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    
    -- Period
    depreciation_year INTEGER NOT NULL,
    depreciation_month INTEGER NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    
    -- Values at period start
    opening_book_value DECIMAL(15,2) NOT NULL,
    
    -- Depreciation calculation
    depreciation_method VARCHAR(30) NOT NULL,
    depreciation_rate DECIMAL(5,2),
    depreciation_amount DECIMAL(15,2) NOT NULL,
    accumulated_depreciation DECIMAL(15,2) NOT NULL,
    
    -- Values at period end
    closing_book_value DECIMAL(15,2) NOT NULL,
    
    -- Calculation details
    useful_life_years INTEGER,
    remaining_life_years DECIMAL(5,2),
    salvage_value DECIMAL(15,2),
    
    -- Units of production (if applicable)
    usage_units DECIMAL(15,2), -- hours, miles, etc.
    
    -- Status
    is_posted BOOLEAN DEFAULT false,
    posted_date TIMESTAMP,
    posted_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Notes
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    calculated_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (depreciation_year >= 2000 AND depreciation_year <= 2100),
    CHECK (depreciation_month >= 1 AND depreciation_month <= 12),
    CHECK (depreciation_method IN ('straight_line', 'declining_balance', 'double_declining', 'sum_of_years', 'units_of_production')),
    CHECK (depreciation_amount >= 0),
    CHECK (accumulated_depreciation >= 0),
    CHECK (closing_book_value >= 0),
    
    UNIQUE (asset_id, depreciation_year, depreciation_month)
);

-- =====================================================
-- 9. Asset Disposal
-- =====================================================
CREATE TABLE IF NOT EXISTS asset_disposal (
    disposal_id SERIAL PRIMARY KEY,
    disposal_number VARCHAR(50) UNIQUE NOT NULL,
    asset_id INTEGER NOT NULL REFERENCES assets(asset_id) ON DELETE CASCADE,
    
    -- Disposal details
    disposal_date DATE NOT NULL,
    disposal_method VARCHAR(50) NOT NULL,
    disposal_reason TEXT,
    
    -- Financial details
    book_value_at_disposal DECIMAL(15,2),
    disposal_proceeds DECIMAL(15,2) DEFAULT 0,
    disposal_costs DECIMAL(15,2) DEFAULT 0,
    gain_loss DECIMAL(15,2) GENERATED ALWAYS AS (disposal_proceeds - disposal_costs - book_value_at_disposal) STORED,
    
    -- Buyer/recipient (if sold or donated)
    buyer_name VARCHAR(200),
    buyer_contact TEXT,
    sale_invoice_number VARCHAR(50),
    
    -- Disposal agent
    disposed_by INTEGER REFERENCES hrm_employees(employee_id),
    disposal_company VARCHAR(200),
    
    -- Approvals
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date DATE,
    
    -- Documentation
    disposal_certificate_number VARCHAR(50),
    documentation JSONB,
    notes TEXT,
    
    -- Environmental compliance
    environmental_clearance BOOLEAN DEFAULT false,
    clearance_certificate VARCHAR(50),
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Constraints
    CHECK (disposal_method IN ('sold', 'scrapped', 'donated', 'recycled', 'traded_in', 'lost', 'stolen', 'destroyed', 'returned_to_vendor')),
    CHECK (disposal_proceeds >= 0),
    CHECK (disposal_costs >= 0)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Asset Categories
CREATE INDEX IF NOT EXISTS idx_asset_categories_parent ON asset_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_asset_categories_code ON asset_categories(category_code);
CREATE INDEX IF NOT EXISTS idx_asset_categories_active ON asset_categories(is_active);

-- Asset Locations
CREATE INDEX IF NOT EXISTS idx_asset_locations_code ON asset_locations(location_code);
CREATE INDEX IF NOT EXISTS idx_asset_locations_parent ON asset_locations(parent_location_id);
CREATE INDEX IF NOT EXISTS idx_asset_locations_manager ON asset_locations(manager_id);
CREATE INDEX IF NOT EXISTS idx_asset_locations_type ON asset_locations(location_type);

-- Assets
CREATE INDEX IF NOT EXISTS idx_assets_number ON assets(asset_number);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(asset_status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(current_location_id);
CREATE INDEX IF NOT EXISTS idx_assets_barcode ON assets(barcode);
CREATE INDEX IF NOT EXISTS idx_assets_qr_code ON assets(qr_code);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_employee ON assets(assigned_to_employee_id);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_department ON assets(assigned_to_department_id);
CREATE INDEX IF NOT EXISTS idx_assets_supplier ON assets(supplier_id);
CREATE INDEX IF NOT EXISTS idx_assets_purchase_date ON assets(purchase_date);
CREATE INDEX IF NOT EXISTS idx_assets_next_maintenance ON assets(next_maintenance_date);

-- Asset Assignments
CREATE INDEX IF NOT EXISTS idx_asset_assignments_asset ON asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_employee ON asset_assignments(assigned_to_employee_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_department ON asset_assignments(assigned_to_department_id);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_status ON asset_assignments(assignment_status);
CREATE INDEX IF NOT EXISTS idx_asset_assignments_dates ON asset_assignments(assignment_date, actual_return_date);

-- Asset Transfers
CREATE INDEX IF NOT EXISTS idx_asset_transfers_asset ON asset_transfers(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_transfers_from_location ON asset_transfers(from_location_id);
CREATE INDEX IF NOT EXISTS idx_asset_transfers_to_location ON asset_transfers(to_location_id);
CREATE INDEX IF NOT EXISTS idx_asset_transfers_status ON asset_transfers(transfer_status);
CREATE INDEX IF NOT EXISTS idx_asset_transfers_date ON asset_transfers(transfer_date);

-- Maintenance Schedules
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_asset ON asset_maintenance_schedules(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_category ON asset_maintenance_schedules(category_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_next_due ON asset_maintenance_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_active ON asset_maintenance_schedules(is_active);

-- Maintenance Records
CREATE INDEX IF NOT EXISTS idx_maintenance_records_asset ON asset_maintenance_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_schedule ON asset_maintenance_records(schedule_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_date ON asset_maintenance_records(maintenance_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_status ON asset_maintenance_records(maintenance_status);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_type ON asset_maintenance_records(maintenance_type);

-- Depreciation Records
CREATE INDEX IF NOT EXISTS idx_depreciation_records_asset ON asset_depreciation_records(asset_id);
CREATE INDEX IF NOT EXISTS idx_depreciation_records_period ON asset_depreciation_records(depreciation_year, depreciation_month);
CREATE INDEX IF NOT EXISTS idx_depreciation_records_posted ON asset_depreciation_records(is_posted);

-- Asset Disposal
CREATE INDEX IF NOT EXISTS idx_asset_disposal_asset ON asset_disposal(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_disposal_date ON asset_disposal(disposal_date);
CREATE INDEX IF NOT EXISTS idx_asset_disposal_method ON asset_disposal(disposal_method);

-- =====================================================
-- Triggers
-- =====================================================

-- Trigger: Update asset book value when depreciation changes
CREATE OR REPLACE FUNCTION update_asset_book_value()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE assets
    SET 
        accumulated_depreciation = NEW.accumulated_depreciation,
        current_book_value = NEW.closing_book_value,
        updated_at = NOW()
    WHERE asset_id = NEW.asset_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_asset_book_value
AFTER INSERT OR UPDATE ON asset_depreciation_records
FOR EACH ROW
EXECUTE FUNCTION update_asset_book_value();

-- Trigger: Update asset status on disposal
CREATE OR REPLACE FUNCTION update_asset_on_disposal()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE assets
    SET 
        asset_status = 'disposed',
        disposal_date = NEW.disposal_date,
        disposal_method = NEW.disposal_method,
        disposal_value = NEW.disposal_proceeds - NEW.disposal_costs,
        disposal_reason = NEW.disposal_reason,
        updated_at = NOW()
    WHERE asset_id = NEW.asset_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_asset_on_disposal
AFTER INSERT ON asset_disposal
FOR EACH ROW
EXECUTE FUNCTION update_asset_on_disposal();

-- Trigger: Update asset location on transfer completion
CREATE OR REPLACE FUNCTION update_asset_on_transfer()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transfer_status = 'completed' AND (OLD.transfer_status IS NULL OR OLD.transfer_status != 'completed') THEN
        UPDATE assets
        SET 
            current_location_id = NEW.to_location_id,
            assigned_to_employee_id = NEW.to_employee_id,
            assigned_to_department_id = NEW.to_department_id,
            updated_at = NOW()
        WHERE asset_id = NEW.asset_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_asset_on_transfer
AFTER UPDATE ON asset_transfers
FOR EACH ROW
EXECUTE FUNCTION update_asset_on_transfer();

-- Trigger: Update asset maintenance dates
CREATE OR REPLACE FUNCTION update_asset_maintenance_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.maintenance_status = 'completed' THEN
        UPDATE assets
        SET 
            last_maintenance_date = NEW.maintenance_date,
            next_maintenance_date = NEW.maintenance_date + INTERVAL '1 day' * COALESCE(maintenance_frequency_days, 90),
            updated_at = NOW()
        WHERE asset_id = NEW.asset_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_asset_maintenance_dates
AFTER INSERT OR UPDATE ON asset_maintenance_records
FOR EACH ROW
EXECUTE FUNCTION update_asset_maintenance_dates();

-- Trigger: Standard updated_at timestamp
CREATE TRIGGER trigger_asset_categories_updated_at BEFORE UPDATE ON asset_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_asset_locations_updated_at BEFORE UPDATE ON asset_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_asset_assignments_updated_at BEFORE UPDATE ON asset_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_asset_transfers_updated_at BEFORE UPDATE ON asset_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_maintenance_schedules_updated_at BEFORE UPDATE ON asset_maintenance_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_maintenance_records_updated_at BEFORE UPDATE ON asset_maintenance_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_depreciation_records_updated_at BEFORE UPDATE ON asset_depreciation_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_asset_disposal_updated_at BEFORE UPDATE ON asset_disposal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data
-- =====================================================

-- Sample Asset Categories
INSERT INTO asset_categories (category_code, category_name, description, default_useful_life_years, default_depreciation_method, requires_maintenance, maintenance_frequency_days) VALUES
('COMP', 'Computers & IT Equipment', 'Desktop computers, laptops, servers, and IT infrastructure', 3, 'declining_balance', true, 180),
('FURN', 'Furniture & Fixtures', 'Office furniture, cabinets, and fixtures', 7, 'straight_line', false, NULL),
('VEHI', 'Vehicles', 'Company vehicles, trucks, and transportation equipment', 5, 'declining_balance', true, 90),
('MACH', 'Machinery & Equipment', 'Production machinery and equipment', 10, 'straight_line', true, 60),
('BLDG', 'Buildings & Real Estate', 'Office buildings, warehouses, and facilities', 30, 'straight_line', true, 365),
('SOFT', 'Software & Licenses', 'Software applications and licenses', 3, 'straight_line', false, NULL)
ON CONFLICT (category_code) DO NOTHING;

-- Sample Asset Locations
INSERT INTO asset_locations (location_code, location_name, location_type, building, floor, city, state, country) VALUES
('HQ-1', 'Headquarters - Floor 1', 'floor', 'Main Building', '1', 'New York', 'NY', 'USA'),
('HQ-2', 'Headquarters - Floor 2', 'floor', 'Main Building', '2', 'New York', 'NY', 'USA'),
('WH-1', 'Main Warehouse', 'warehouse', 'Warehouse A', NULL, 'Newark', 'NJ', 'USA'),
('PROD-1', 'Production Floor 1', 'floor', 'Factory Building', '1', 'Chicago', 'IL', 'USA'),
('IT-ROOM', 'IT Server Room', 'room', 'Main Building', '3', 'New York', 'NY', 'USA')
ON CONFLICT (location_code) DO NOTHING;

-- Sample Assets (get actual employee IDs from database)
DO $$
DECLARE
    v_comp_category_id INTEGER;
    v_furn_category_id INTEGER;
    v_vehi_category_id INTEGER;
    v_hq1_location_id INTEGER;
    v_hq2_location_id INTEGER;
    v_it_room_location_id INTEGER;
    v_employee1_id INTEGER;
    v_employee2_id INTEGER;
BEGIN
    -- Get category IDs
    SELECT category_id INTO v_comp_category_id FROM asset_categories WHERE category_code = 'COMP';
    SELECT category_id INTO v_furn_category_id FROM asset_categories WHERE category_code = 'FURN';
    SELECT category_id INTO v_vehi_category_id FROM asset_categories WHERE category_code = 'VEHI';
    
    -- Get location IDs
    SELECT location_id INTO v_hq1_location_id FROM asset_locations WHERE location_code = 'HQ-1';
    SELECT location_id INTO v_hq2_location_id FROM asset_locations WHERE location_code = 'HQ-2';
    SELECT location_id INTO v_it_room_location_id FROM asset_locations WHERE location_code = 'IT-ROOM';
    
    -- Get employee IDs (first two employees)
    SELECT employee_id INTO v_employee1_id FROM hrm_employees ORDER BY employee_id LIMIT 1;
    SELECT employee_id INTO v_employee2_id FROM hrm_employees ORDER BY employee_id LIMIT 1 OFFSET 1;
    
    -- Insert sample assets
    INSERT INTO assets (
        asset_number, asset_name, category_id, asset_type, asset_status,
        current_location_id, purchase_date, purchase_price, depreciation_method,
        useful_life_years, salvage_value, depreciation_start_date,
        barcode, serial_number, model_number, manufacturer,
        assigned_to_employee_id, maintenance_frequency_days
    ) VALUES
    (
        'ASSET-00001', 'Dell Latitude 7420 Laptop', v_comp_category_id, 'equipment', 'in_use',
        v_hq1_location_id, '2024-01-15', 1200.00, 'declining_balance',
        3, 100.00, '2024-01-15',
        'BARCODE-00001', 'SN-DL7420-001', 'Latitude 7420', 'Dell',
        v_employee1_id, 180
    ),
    (
        'ASSET-00002', 'HP LaserJet Pro Printer', v_comp_category_id, 'equipment', 'available',
        v_hq2_location_id, '2024-02-10', 450.00, 'straight_line',
        5, 50.00, '2024-02-10',
        'BARCODE-00002', 'SN-HP-LJ-002', 'LaserJet Pro M404', 'HP',
        NULL, 90
    ),
    (
        'ASSET-00003', 'Executive Desk', v_furn_category_id, 'equipment', 'in_use',
        v_hq2_location_id, '2023-06-01', 800.00, 'straight_line',
        7, 100.00, '2023-06-01',
        'BARCODE-00003', NULL, 'Executive Series', 'Steelcase',
        v_employee2_id, NULL
    ),
    (
        'ASSET-00004', 'Company Van - Ford Transit', v_vehi_category_id, 'vehicle', 'in_use',
        v_hq1_location_id, '2023-03-20', 35000.00, 'declining_balance',
        5, 5000.00, '2023-04-01',
        'BARCODE-00004', 'VIN-FORD-TR-2023', 'Transit 250', 'Ford',
        NULL, 90
    ),
    (
        'ASSET-00005', 'Dell PowerEdge Server', v_comp_category_id, 'equipment', 'in_use',
        v_it_room_location_id, '2022-09-15', 8500.00, 'straight_line',
        5, 500.00, '2022-10-01',
        'BARCODE-00005', 'SN-PE-R740-005', 'PowerEdge R740', 'Dell',
        NULL, 60
    )
    ON CONFLICT (asset_number) DO NOTHING;
    
    -- Insert sample maintenance schedules
    INSERT INTO asset_maintenance_schedules (
        schedule_name, category_id, maintenance_type, frequency_type,
        frequency_value, start_date, next_due_date, priority,
        description, is_active
    ) VALUES
    (
        'IT Equipment Preventive Maintenance',
        v_comp_category_id,
        'preventive',
        'months',
        6,
        '2025-01-01',
        '2025-07-01',
        'medium',
        'Regular preventive maintenance for all IT equipment',
        true
    ),
    (
        'Vehicle Maintenance Schedule',
        v_vehi_category_id,
        'preventive',
        'months',
        3,
        '2025-01-01',
        '2025-04-01',
        'high',
        'Quarterly vehicle maintenance and inspection',
        true
    )
    ON CONFLICT DO NOTHING;
    
END $$;

-- =====================================================
-- Completion Message
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Phase 7 Task 7: Asset Management Schema Installation Complete!';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables created: 9';
    RAISE NOTICE '   1. asset_categories (6 categories)';
    RAISE NOTICE '   2. asset_locations (5 locations)';
    RAISE NOTICE '   3. assets (5 sample assets)';
    RAISE NOTICE '   4. asset_assignments';
    RAISE NOTICE '   5. asset_transfers';
    RAISE NOTICE '   6. asset_maintenance_schedules (2 schedules)';
    RAISE NOTICE '   7. asset_maintenance_records';
    RAISE NOTICE '   8. asset_depreciation_records';
    RAISE NOTICE '   9. asset_disposal';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Triggers created: 4';
    RAISE NOTICE '   - update_asset_book_value (on depreciation)';
    RAISE NOTICE '   - update_asset_on_disposal (status change)';
    RAISE NOTICE '   - update_asset_on_transfer (location update)';
    RAISE NOTICE '   - update_asset_maintenance_dates (maintenance tracking)';
    RAISE NOTICE '';
    RAISE NOTICE '📦 Sample data: 18 records';
    RAISE NOTICE '   - 6 asset categories';
    RAISE NOTICE '   - 5 locations';
    RAISE NOTICE '   - 5 assets';
    RAISE NOTICE '   - 2 maintenance schedules';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Ready for API implementation!';
    RAISE NOTICE '   Next: Create 8 REST API endpoints';
    RAISE NOTICE '';
END $$;
