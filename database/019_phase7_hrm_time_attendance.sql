-- =====================================================
-- Phase 7 Task 6: HRM - Time & Attendance
-- =====================================================
-- Description: Complete time tracking, attendance, leave management, and overtime system
-- Tables: 12 (shifts, time_entries, attendance_records, leave_types, leave_policies,
--             leave_requests, leave_balances, leave_approvals, overtime_records,
--             holidays, work_schedules, time_off_calendar)
-- Version: 1.0
-- Date: December 4, 2025
-- =====================================================

-- =====================================================
-- SHIFTS & SCHEDULES
-- =====================================================

-- Table: hrm_shifts
-- Purpose: Define work shifts
CREATE TABLE IF NOT EXISTS hrm_shifts (
    shift_id SERIAL PRIMARY KEY,
    shift_code VARCHAR(20) UNIQUE NOT NULL,
    shift_name VARCHAR(100) NOT NULL,
    
    -- Shift timing
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INTEGER DEFAULT 0, -- Total break time
    work_hours DECIMAL(4,2), -- Calculated work hours
    
    -- Shift type
    shift_type VARCHAR(50) DEFAULT 'regular', -- regular, night, weekend, split, rotating
    is_overnight BOOLEAN DEFAULT false, -- Shift crosses midnight
    
    -- Pay multipliers
    regular_pay_multiplier DECIMAL(4,2) DEFAULT 1.0,
    overtime_pay_multiplier DECIMAL(4,2) DEFAULT 1.5,
    
    -- Grace periods (in minutes)
    late_grace_period INTEGER DEFAULT 10,
    early_departure_grace_period INTEGER DEFAULT 10,
    
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Table: hrm_work_schedules
-- Purpose: Employee work schedule assignments
CREATE TABLE IF NOT EXISTS hrm_work_schedules (
    schedule_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Schedule details
    effective_date DATE NOT NULL,
    end_date DATE,
    schedule_type VARCHAR(50) DEFAULT 'fixed', -- fixed, rotating, flexible, compressed
    
    -- Weekly schedule (for fixed schedules)
    monday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    tuesday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    wednesday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    thursday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    friday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    saturday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    sunday_shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    
    -- Weekly totals
    weekly_hours DECIMAL(5,2),
    working_days_per_week INTEGER,
    
    -- Flexibility
    is_flexible BOOLEAN DEFAULT false,
    flexible_hours_range_start TIME,
    flexible_hours_range_end TIME,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- =====================================================
-- TIME TRACKING
-- =====================================================

-- Table: hrm_time_entries
-- Purpose: Clock in/out records
CREATE TABLE IF NOT EXISTS hrm_time_entries (
    entry_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Entry details
    entry_date DATE NOT NULL,
    clock_in_time TIMESTAMP NOT NULL,
    clock_out_time TIMESTAMP,
    
    -- Entry type
    entry_type VARCHAR(50) DEFAULT 'regular', -- regular, overtime, break, remote
    shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    
    -- Location tracking
    clock_in_location VARCHAR(200),
    clock_out_location VARCHAR(200),
    is_remote BOOLEAN DEFAULT false,
    
    -- Time calculations
    total_hours DECIMAL(5,2),
    regular_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2),
    break_hours DECIMAL(5,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- open, closed, approved, rejected, disputed
    
    -- Device tracking
    clock_in_device VARCHAR(100),
    clock_out_device VARCHAR(100),
    clock_in_ip VARCHAR(50),
    clock_out_ip VARCHAR(50),
    
    -- Notes
    notes TEXT,
    
    -- Approval
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ATTENDANCE
-- =====================================================

-- Table: hrm_attendance_records
-- Purpose: Daily attendance tracking
CREATE TABLE IF NOT EXISTS hrm_attendance_records (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Date and shift
    attendance_date DATE NOT NULL,
    shift_id INTEGER REFERENCES hrm_shifts(shift_id),
    
    -- Attendance status
    status VARCHAR(50) NOT NULL, -- present, absent, late, half_day, on_leave, holiday, weekend, remote
    
    -- Timing details
    scheduled_in_time TIME,
    scheduled_out_time TIME,
    actual_in_time TIME,
    actual_out_time TIME,
    
    -- Calculations
    late_by_minutes INTEGER DEFAULT 0,
    early_departure_minutes INTEGER DEFAULT 0,
    total_work_hours DECIMAL(5,2),
    
    -- Leave reference
    leave_request_id INTEGER, -- Will reference hrm_leave_requests
    
    -- Location
    work_location VARCHAR(100), -- office, home, client_site, field
    is_remote BOOLEAN DEFAULT false,
    
    -- Status flags
    is_late BOOLEAN DEFAULT false,
    is_early_departure BOOLEAN DEFAULT false,
    is_overtime BOOLEAN DEFAULT false,
    
    -- Notes
    remarks TEXT,
    
    -- Approval
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(employee_id, attendance_date)
);

-- =====================================================
-- LEAVE MANAGEMENT
-- =====================================================

-- Table: hrm_leave_types
-- Purpose: Define types of leave
CREATE TABLE IF NOT EXISTS hrm_leave_types (
    leave_type_id SERIAL PRIMARY KEY,
    leave_type_code VARCHAR(20) UNIQUE NOT NULL,
    leave_type_name VARCHAR(100) NOT NULL,
    
    -- Leave category
    category VARCHAR(50), -- annual, sick, personal, unpaid, maternity, paternity, bereavement, sabbatical
    
    -- Accrual settings
    is_paid BOOLEAN DEFAULT true,
    requires_approval BOOLEAN DEFAULT true,
    max_consecutive_days INTEGER,
    min_advance_notice_days INTEGER DEFAULT 0,
    
    -- Balance settings
    allow_negative_balance BOOLEAN DEFAULT false,
    max_carry_forward INTEGER,
    carry_forward_expiry_months INTEGER,
    
    -- Documentation
    requires_documentation BOOLEAN DEFAULT false,
    documentation_required_after_days INTEGER,
    
    -- Special rules
    affects_attendance BOOLEAN DEFAULT true,
    counts_as_worked_day BOOLEAN DEFAULT false,
    
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_leave_policies
-- Purpose: Leave policies by employee/organization
CREATE TABLE IF NOT EXISTS hrm_leave_policies (
    policy_id SERIAL PRIMARY KEY,
    policy_name VARCHAR(200) NOT NULL,
    
    -- Applicability
    organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    department_id INTEGER REFERENCES hrm_departments(department_id),
    job_title_id INTEGER REFERENCES hrm_job_titles(job_title_id),
    employment_type VARCHAR(50), -- full_time, part_time, contract
    
    -- Effective dates
    effective_date DATE NOT NULL,
    end_date DATE,
    
    -- Policy details stored as JSONB for flexibility
    policy_rules JSONB, -- Leave type allocations, accrual rates, etc.
    
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Table: hrm_leave_balances
-- Purpose: Employee leave balances
CREATE TABLE IF NOT EXISTS hrm_leave_balances (
    balance_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    leave_type_id INTEGER REFERENCES hrm_leave_types(leave_type_id),
    
    -- Balance year
    leave_year INTEGER NOT NULL, -- e.g., 2025
    
    -- Balance details
    opening_balance DECIMAL(5,2) DEFAULT 0,
    accrued DECIMAL(5,2) DEFAULT 0,
    used DECIMAL(5,2) DEFAULT 0,
    pending DECIMAL(5,2) DEFAULT 0, -- Awaiting approval
    carry_forward DECIMAL(5,2) DEFAULT 0,
    adjustment DECIMAL(5,2) DEFAULT 0,
    current_balance DECIMAL(5,2) DEFAULT 0,
    
    -- Dates
    last_accrual_date DATE,
    balance_as_of_date DATE DEFAULT CURRENT_DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(employee_id, leave_type_id, leave_year)
);

-- Table: hrm_leave_requests
-- Purpose: Leave request submissions
CREATE TABLE IF NOT EXISTS hrm_leave_requests (
    request_id SERIAL PRIMARY KEY,
    request_number VARCHAR(20) UNIQUE NOT NULL,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    leave_type_id INTEGER REFERENCES hrm_leave_types(leave_type_id),
    
    -- Request details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(4,1) NOT NULL, -- Can be 0.5 for half day
    
    -- Leave details
    leave_reason TEXT,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(50),
    
    -- Documentation
    has_documentation BOOLEAN DEFAULT false,
    document_url VARCHAR(500),
    
    -- Handover
    covering_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    handover_notes TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled, withdrawn
    
    -- Workflow
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Notes
    employee_notes TEXT,
    admin_notes TEXT,
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_dates CHECK (end_date >= start_date)
);

-- Table: hrm_leave_approvals
-- Purpose: Leave approval workflow
CREATE TABLE IF NOT EXISTS hrm_leave_approvals (
    approval_id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES hrm_leave_requests(request_id),
    
    -- Approver
    approver_id INTEGER REFERENCES hrm_employees(employee_id),
    approval_level INTEGER DEFAULT 1, -- 1=direct manager, 2=department head, 3=HR, etc.
    
    -- Decision
    decision VARCHAR(50), -- pending, approved, rejected, forwarded
    decision_date TIMESTAMP,
    comments TEXT,
    
    -- Sequence
    sequence_order INTEGER DEFAULT 1,
    is_final_approver BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- OVERTIME
-- =====================================================

-- Table: hrm_overtime_records
-- Purpose: Overtime tracking
CREATE TABLE IF NOT EXISTS hrm_overtime_records (
    overtime_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Date and timing
    overtime_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_hours DECIMAL(5,2) NOT NULL,
    
    -- Overtime type
    overtime_type VARCHAR(50), -- weekday, weekend, holiday, night_shift
    
    -- Pay calculation
    pay_multiplier DECIMAL(4,2) DEFAULT 1.5,
    approved_hours DECIMAL(5,2),
    
    -- Reason
    reason TEXT,
    project_code VARCHAR(50),
    task_description TEXT,
    
    -- Pre-approval
    is_pre_approved BOOLEAN DEFAULT false,
    pre_approved_by INTEGER REFERENCES hrm_employees(employee_id),
    pre_approved_date DATE,
    
    -- Final approval
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, paid
    approved_by INTEGER REFERENCES hrm_employees(employee_id),
    approved_date DATE,
    approval_notes TEXT,
    
    -- Payment
    is_paid BOOLEAN DEFAULT false,
    payment_date DATE,
    payment_amount DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- HOLIDAYS & CALENDAR
-- =====================================================

-- Table: hrm_holidays
-- Purpose: Company holidays
CREATE TABLE IF NOT EXISTS hrm_holidays (
    holiday_id SERIAL PRIMARY KEY,
    
    -- Holiday details
    holiday_name VARCHAR(200) NOT NULL,
    holiday_date DATE NOT NULL,
    holiday_year INTEGER,
    
    -- Applicability
    organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    is_mandatory BOOLEAN DEFAULT true,
    
    -- Type
    holiday_type VARCHAR(50), -- national, regional, company, floating
    
    -- Regional
    region VARCHAR(100),
    country VARCHAR(100),
    
    -- Description
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_time_off_calendar
-- Purpose: Aggregate time-off calendar view
CREATE TABLE IF NOT EXISTS hrm_time_off_calendar (
    calendar_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Date
    calendar_date DATE NOT NULL,
    
    -- Type
    entry_type VARCHAR(50) NOT NULL, -- leave, holiday, absence, remote_work
    
    -- Details
    leave_request_id INTEGER REFERENCES hrm_leave_requests(request_id),
    holiday_id INTEGER REFERENCES hrm_holidays(holiday_id),
    
    -- Status
    status VARCHAR(50), -- scheduled, confirmed, tentative
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(employee_id, calendar_date, entry_type)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Shifts indexes
CREATE INDEX idx_shifts_active ON hrm_shifts(is_active);
CREATE INDEX idx_shifts_type ON hrm_shifts(shift_type);

-- Work schedules indexes
CREATE INDEX idx_schedules_employee ON hrm_work_schedules(employee_id);
CREATE INDEX idx_schedules_effective ON hrm_work_schedules(effective_date);
CREATE INDEX idx_schedules_active ON hrm_work_schedules(is_active);

-- Time entries indexes
CREATE INDEX idx_time_entries_employee ON hrm_time_entries(employee_id);
CREATE INDEX idx_time_entries_date ON hrm_time_entries(entry_date);
CREATE INDEX idx_time_entries_status ON hrm_time_entries(status);
CREATE INDEX idx_time_entries_employee_date ON hrm_time_entries(employee_id, entry_date);

-- Attendance indexes
CREATE INDEX idx_attendance_employee ON hrm_attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON hrm_attendance_records(attendance_date);
CREATE INDEX idx_attendance_status ON hrm_attendance_records(status);
CREATE INDEX idx_attendance_employee_date ON hrm_attendance_records(employee_id, attendance_date);

-- Leave types indexes
CREATE INDEX idx_leave_types_category ON hrm_leave_types(category);
CREATE INDEX idx_leave_types_active ON hrm_leave_types(is_active);

-- Leave balances indexes
CREATE INDEX idx_leave_balances_employee ON hrm_leave_balances(employee_id);
CREATE INDEX idx_leave_balances_type ON hrm_leave_balances(leave_type_id);
CREATE INDEX idx_leave_balances_year ON hrm_leave_balances(leave_year);

-- Leave requests indexes
CREATE INDEX idx_leave_requests_employee ON hrm_leave_requests(employee_id);
CREATE INDEX idx_leave_requests_type ON hrm_leave_requests(leave_type_id);
CREATE INDEX idx_leave_requests_status ON hrm_leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON hrm_leave_requests(start_date, end_date);

-- Overtime indexes
CREATE INDEX idx_overtime_employee ON hrm_overtime_records(employee_id);
CREATE INDEX idx_overtime_date ON hrm_overtime_records(overtime_date);
CREATE INDEX idx_overtime_status ON hrm_overtime_records(status);

-- Holidays indexes
CREATE INDEX idx_holidays_date ON hrm_holidays(holiday_date);
CREATE INDEX idx_holidays_year ON hrm_holidays(holiday_year);
CREATE INDEX idx_holidays_org ON hrm_holidays(organization_id);

-- Calendar indexes
CREATE INDEX idx_calendar_employee ON hrm_time_off_calendar(employee_id);
CREATE INDEX idx_calendar_date ON hrm_time_off_calendar(calendar_date);
CREATE INDEX idx_calendar_employee_date ON hrm_time_off_calendar(employee_id, calendar_date);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_hrm_shifts_updated_at BEFORE UPDATE ON hrm_shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_work_schedules_updated_at BEFORE UPDATE ON hrm_work_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_time_entries_updated_at BEFORE UPDATE ON hrm_time_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_attendance_records_updated_at BEFORE UPDATE ON hrm_attendance_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_leave_balances_updated_at BEFORE UPDATE ON hrm_leave_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_leave_requests_updated_at BEFORE UPDATE ON hrm_leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_overtime_records_updated_at BEFORE UPDATE ON hrm_overtime_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to calculate work hours in shifts
CREATE OR REPLACE FUNCTION calculate_shift_hours()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate work hours (handles overnight shifts)
    IF NEW.is_overnight THEN
        NEW.work_hours = EXTRACT(EPOCH FROM (NEW.end_time + INTERVAL '1 day' - NEW.start_time)) / 3600.0 - (NEW.break_duration_minutes / 60.0);
    ELSE
        NEW.work_hours = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time)) / 3600.0 - (NEW.break_duration_minutes / 60.0);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_shift_hours_trigger
BEFORE INSERT OR UPDATE ON hrm_shifts
FOR EACH ROW EXECUTE FUNCTION calculate_shift_hours();

-- Trigger to calculate time entry hours
CREATE OR REPLACE FUNCTION calculate_time_entry_hours()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clock_out_time IS NOT NULL THEN
        -- Calculate total hours
        NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out_time - NEW.clock_in_time)) / 3600.0;
        
        -- Simple logic: first 8 hours are regular, rest is overtime
        IF NEW.total_hours <= 8 THEN
            NEW.regular_hours = NEW.total_hours;
            NEW.overtime_hours = 0;
        ELSE
            NEW.regular_hours = 8;
            NEW.overtime_hours = NEW.total_hours - 8;
        END IF;
        
        NEW.status = 'closed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_time_entry_hours_trigger
BEFORE INSERT OR UPDATE ON hrm_time_entries
FOR EACH ROW EXECUTE FUNCTION calculate_time_entry_hours();

-- Trigger to update leave balance when request is approved
CREATE OR REPLACE FUNCTION update_leave_balance_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Update leave balance
        UPDATE hrm_leave_balances
        SET 
            used = used + NEW.total_days,
            current_balance = current_balance - NEW.total_days,
            pending = GREATEST(0, pending - NEW.total_days)
        WHERE employee_id = NEW.employee_id
          AND leave_type_id = NEW.leave_type_id
          AND leave_year = EXTRACT(YEAR FROM NEW.start_date);
    ELSIF NEW.status = 'pending' AND OLD.status != 'pending' AND OLD.status IS NOT NULL THEN
        -- Moving from another status to pending (e.g., resubmission)
        UPDATE hrm_leave_balances
        SET pending = pending + NEW.total_days
        WHERE employee_id = NEW.employee_id
          AND leave_type_id = NEW.leave_type_id
          AND leave_year = EXTRACT(YEAR FROM NEW.start_date);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leave_balance_trigger
AFTER UPDATE ON hrm_leave_requests
FOR EACH ROW EXECUTE FUNCTION update_leave_balance_on_approval();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert shifts
INSERT INTO hrm_shifts (shift_code, shift_name, start_time, end_time, break_duration_minutes, shift_type) VALUES
('DAY', 'Day Shift', '09:00', '17:00', 60, 'regular'),
('MORNING', 'Morning Shift', '06:00', '14:00', 30, 'regular'),
('EVENING', 'Evening Shift', '14:00', '22:00', 30, 'regular'),
('NIGHT', 'Night Shift', '22:00', '06:00', 60, 'night'),
('FLEX', 'Flexible Hours', '08:00', '17:00', 60, 'regular');

-- Insert leave types
INSERT INTO hrm_leave_types (leave_type_code, leave_type_name, category, is_paid, requires_approval, max_consecutive_days) VALUES
('AL', 'Annual Leave', 'annual', true, true, 15),
('SL', 'Sick Leave', 'sick', true, true, 5),
('CL', 'Casual Leave', 'personal', true, true, 3),
('UL', 'Unpaid Leave', 'unpaid', false, true, NULL),
('ML', 'Maternity Leave', 'maternity', true, true, 90),
('PL', 'Paternity Leave', 'paternity', true, true, 10),
('BL', 'Bereavement Leave', 'bereavement', true, true, 5),
('SB', 'Sabbatical', 'sabbatical', false, true, 365);

-- Insert holidays for 2025
INSERT INTO hrm_holidays (holiday_name, holiday_date, holiday_year, holiday_type, country) VALUES
('New Year Day', '2025-01-01', 2025, 'national', 'United States'),
('Independence Day', '2025-07-04', 2025, 'national', 'United States'),
('Thanksgiving Day', '2025-11-27', 2025, 'national', 'United States'),
('Christmas Day', '2025-12-25', 2025, 'national', 'United States');

-- Insert leave balances for sample employees
INSERT INTO hrm_leave_balances (employee_id, leave_type_id, leave_year, opening_balance, accrued, current_balance)
SELECT 
    e.employee_id,
    lt.leave_type_id,
    2025,
    CASE 
        WHEN lt.leave_type_code = 'AL' THEN 20
        WHEN lt.leave_type_code = 'SL' THEN 10
        WHEN lt.leave_type_code = 'CL' THEN 5
        ELSE 0
    END,
    CASE 
        WHEN lt.leave_type_code = 'AL' THEN 20
        WHEN lt.leave_type_code = 'SL' THEN 10
        WHEN lt.leave_type_code = 'CL' THEN 5
        ELSE 0
    END,
    CASE 
        WHEN lt.leave_type_code = 'AL' THEN 20
        WHEN lt.leave_type_code = 'SL' THEN 10
        WHEN lt.leave_type_code = 'CL' THEN 5
        ELSE 0
    END
FROM hrm_employees e
CROSS JOIN hrm_leave_types lt
WHERE e.is_active = true 
  AND e.employee_status = 'active'
  AND lt.leave_type_code IN ('AL', 'SL', 'CL')
  AND e.employee_id <= 5;

-- Insert work schedules for sample employees (Day shift, Mon-Fri)
INSERT INTO hrm_work_schedules (
    employee_id, effective_date, schedule_type,
    monday_shift_id, tuesday_shift_id, wednesday_shift_id, 
    thursday_shift_id, friday_shift_id,
    weekly_hours, working_days_per_week
)
SELECT 
    employee_id,
    '2025-01-01',
    'fixed',
    1, 1, 1, 1, 1, -- Day shift Mon-Fri
    40.0,
    5
FROM hrm_employees
WHERE is_active = true AND employee_status = 'active' AND employee_id <= 5;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Phase 7 Task 6: HRM - Time & Attendance Schema Installation Complete!';
    RAISE NOTICE '📊 Tables created: 12';
    RAISE NOTICE '⏰ Shifts: %', (SELECT COUNT(*) FROM hrm_shifts);
    RAISE NOTICE '📅 Leave Types: %', (SELECT COUNT(*) FROM hrm_leave_types);
    RAISE NOTICE '🎉 Holidays: %', (SELECT COUNT(*) FROM hrm_holidays);
    RAISE NOTICE '💼 Leave Balances: %', (SELECT COUNT(*) FROM hrm_leave_balances);
    RAISE NOTICE '📋 Work Schedules: %', (SELECT COUNT(*) FROM hrm_work_schedules);
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Ready for API implementation!';
END $$;
