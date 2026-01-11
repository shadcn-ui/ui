-- ============================================================================
-- HRIS (Human Resource Information System) Database Schema
-- ============================================================================
-- This migration creates tables for comprehensive HRIS module including:
-- - Employees and departments
-- - Recruitment and hiring
-- - Payroll and compensation
-- - Leave management
-- - Training and development
-- - Attendance tracking
-- ============================================================================

-- ============================================================================
-- DEPARTMENTS & ORGANIZATIONAL STRUCTURE
-- ============================================================================

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  parent_department_id INTEGER REFERENCES departments(id),
  manager_id INTEGER REFERENCES users(id),
  budget DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS positions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  description TEXT,
  requirements TEXT,
  min_salary DECIMAL(14,2),
  max_salary DECIMAL(14,2),
  level VARCHAR(50), -- Entry, Junior, Mid, Senior, Lead, Manager, Director
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- EMPLOYEES (Extends users table)
-- ============================================================================

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  employee_number VARCHAR(50) UNIQUE NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  position_id INTEGER REFERENCES positions(id),
  manager_id INTEGER REFERENCES employees(id),
  
  -- Personal Information
  date_of_birth DATE,
  gender VARCHAR(20),
  marital_status VARCHAR(20),
  nationality VARCHAR(50),
  phone VARCHAR(20),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  
  -- Employment Details
  employment_type VARCHAR(50), -- Full-time, Part-time, Contract, Intern
  employment_status VARCHAR(50) DEFAULT 'Active', -- Active, Probation, Notice, Terminated, Resigned
  hire_date DATE NOT NULL,
  probation_end_date DATE,
  termination_date DATE,
  termination_reason TEXT,
  
  -- Compensation
  salary DECIMAL(14,2),
  salary_currency VARCHAR(3) DEFAULT 'IDR',
  salary_frequency VARCHAR(20) DEFAULT 'Monthly', -- Monthly, Weekly, Hourly
  bank_name VARCHAR(100),
  bank_account_number VARCHAR(50),
  bank_account_holder VARCHAR(100),
  
  -- Tax & Insurance (Indonesia)
  npwp VARCHAR(50), -- Nomor Pokok Wajib Pajak (Tax ID)
  bpjs_kesehatan VARCHAR(50), -- Health Insurance
  bpjs_ketenagakerjaan VARCHAR(50), -- Employment Insurance
  
  -- Other
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RECRUITMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS job_postings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  position_id INTEGER REFERENCES positions(id),
  department_id INTEGER REFERENCES departments(id),
  description TEXT,
  requirements TEXT,
  responsibilities TEXT,
  benefits TEXT,
  
  employment_type VARCHAR(50), -- Full-time, Part-time, Contract, Intern
  location VARCHAR(100),
  salary_min DECIMAL(14,2),
  salary_max DECIMAL(14,2),
  salary_currency VARCHAR(3) DEFAULT 'IDR',
  
  status VARCHAR(50) DEFAULT 'Draft', -- Draft, Published, Closed, Filled
  openings INTEGER DEFAULT 1,
  posted_date DATE,
  closing_date DATE,
  
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
  
  -- Applicant Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  province VARCHAR(100),
  
  -- Application Details
  resume_url VARCHAR(500),
  cover_letter TEXT,
  portfolio_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  expected_salary DECIMAL(14,2),
  available_from DATE,
  
  -- Application Status
  status VARCHAR(50) DEFAULT 'New', -- New, Screening, Interview, Offer, Rejected, Hired
  stage VARCHAR(100), -- Initial Screening, Phone Interview, Technical Test, Final Interview
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
  
  interview_type VARCHAR(50), -- Phone, Video, In-person, Technical
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location VARCHAR(200),
  meeting_link VARCHAR(500),
  
  interviewer_ids INTEGER[], -- Array of user IDs
  status VARCHAR(50) DEFAULT 'Scheduled', -- Scheduled, Completed, Cancelled, Rescheduled
  
  -- Feedback
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  recommendation VARCHAR(50), -- Strong Yes, Yes, Maybe, No, Strong No
  
  conducted_by INTEGER REFERENCES users(id),
  conducted_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PAYROLL
-- ============================================================================

CREATE TABLE IF NOT EXISTS payroll_periods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Open', -- Open, Processing, Paid, Closed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_period UNIQUE(start_date, end_date)
);

CREATE TABLE IF NOT EXISTS payroll_records (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  period_id INTEGER REFERENCES payroll_periods(id),
  
  -- Basic Salary
  basic_salary DECIMAL(14,2) NOT NULL,
  
  -- Allowances
  transport_allowance DECIMAL(14,2) DEFAULT 0,
  meal_allowance DECIMAL(14,2) DEFAULT 0,
  housing_allowance DECIMAL(14,2) DEFAULT 0,
  position_allowance DECIMAL(14,2) DEFAULT 0,
  other_allowances DECIMAL(14,2) DEFAULT 0,
  
  -- Overtime
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  overtime_rate DECIMAL(14,2) DEFAULT 0,
  overtime_pay DECIMAL(14,2) DEFAULT 0,
  
  -- Bonuses
  performance_bonus DECIMAL(14,2) DEFAULT 0,
  attendance_bonus DECIMAL(14,2) DEFAULT 0,
  other_bonus DECIMAL(14,2) DEFAULT 0,
  
  -- Deductions
  tax_deduction DECIMAL(14,2) DEFAULT 0, -- PPh 21
  bpjs_kesehatan_employee DECIMAL(14,2) DEFAULT 0,
  bpjs_ketenagakerjaan_employee DECIMAL(14,2) DEFAULT 0,
  pension_deduction DECIMAL(14,2) DEFAULT 0,
  loan_deduction DECIMAL(14,2) DEFAULT 0,
  other_deductions DECIMAL(14,2) DEFAULT 0,
  
  -- Company Contributions
  bpjs_kesehatan_company DECIMAL(14,2) DEFAULT 0,
  bpjs_ketenagakerjaan_company DECIMAL(14,2) DEFAULT 0,
  jht_company DECIMAL(14,2) DEFAULT 0, -- Jaminan Hari Tua
  jkk_company DECIMAL(14,2) DEFAULT 0, -- Jaminan Kecelakaan Kerja
  jkm_company DECIMAL(14,2) DEFAULT 0, -- Jaminan Kematian
  
  -- Totals
  gross_salary DECIMAL(14,2) NOT NULL,
  total_deductions DECIMAL(14,2) NOT NULL,
  net_salary DECIMAL(14,2) NOT NULL,
  
  -- Payment Details
  payment_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Cancelled
  payment_date DATE,
  payment_method VARCHAR(50), -- Bank Transfer, Cash, Cheque
  payment_reference VARCHAR(100),
  
  notes TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- LEAVE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS leave_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  days_per_year INTEGER DEFAULT 0,
  is_paid BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT true,
  max_days_per_request INTEGER,
  color VARCHAR(7), -- Hex color for calendar
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_leave_balances (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id INTEGER REFERENCES leave_types(id),
  year INTEGER NOT NULL,
  total_days DECIMAL(5,2) NOT NULL,
  used_days DECIMAL(5,2) DEFAULT 0,
  remaining_days DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_employee_leave_year UNIQUE(employee_id, leave_type_id, year)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id INTEGER REFERENCES leave_types(id),
  
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_requested DECIMAL(5,2) NOT NULL,
  reason TEXT,
  attachment_url VARCHAR(500),
  
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected, Cancelled
  
  -- Approval workflow
  approver_id INTEGER REFERENCES users(id),
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public_holidays (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  is_national BOOLEAN DEFAULT true,
  province VARCHAR(100), -- For regional holidays
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_holiday_date UNIQUE(date, province)
);

-- ============================================================================
-- TRAINING & DEVELOPMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS training_programs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  code VARCHAR(50) UNIQUE,
  description TEXT,
  objectives TEXT,
  
  trainer_name VARCHAR(100),
  trainer_company VARCHAR(100),
  training_type VARCHAR(50), -- Internal, External, Online, Certification
  
  start_date DATE,
  end_date DATE,
  duration_hours DECIMAL(5,2),
  location VARCHAR(200),
  max_participants INTEGER,
  
  cost_per_participant DECIMAL(14,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'IDR',
  
  status VARCHAR(50) DEFAULT 'Planned', -- Planned, Scheduled, In Progress, Completed, Cancelled
  
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_enrollments (
  id SERIAL PRIMARY KEY,
  program_id INTEGER REFERENCES training_programs(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Enrolled', -- Enrolled, Completed, Cancelled, Failed
  
  attendance_percentage DECIMAL(5,2),
  assessment_score DECIMAL(5,2),
  certification_url VARCHAR(500),
  certification_date DATE,
  
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_enrollment UNIQUE(program_id, employee_id)
);

-- ============================================================================
-- ATTENDANCE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS attendance_records (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  
  status VARCHAR(50) DEFAULT 'Present', -- Present, Absent, Late, Half-day, Leave, Holiday
  work_hours DECIMAL(5,2),
  overtime_hours DECIMAL(5,2) DEFAULT 0,
  
  location VARCHAR(200), -- For remote work tracking
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_attendance UNIQUE(employee_id, date)
);

-- ============================================================================
-- PERFORMANCE MANAGEMENT (Extends existing tables)
-- ============================================================================

CREATE TABLE IF NOT EXISTS performance_reviews (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id),
  
  review_period_start DATE NOT NULL,
  review_period_end DATE NOT NULL,
  review_type VARCHAR(50), -- Annual, Mid-year, Probation, Project
  
  -- Ratings (1-5 scale)
  quality_of_work INTEGER CHECK (quality_of_work >= 1 AND quality_of_work <= 5),
  productivity INTEGER CHECK (productivity >= 1 AND productivity <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 5),
  leadership INTEGER CHECK (leadership >= 1 AND leadership <= 5),
  innovation INTEGER CHECK (innovation >= 1 AND innovation <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  strengths TEXT,
  areas_for_improvement TEXT,
  goals_achieved TEXT,
  goals_for_next_period TEXT,
  
  employee_comments TEXT,
  reviewer_comments TEXT,
  
  status VARCHAR(50) DEFAULT 'Draft', -- Draft, Submitted, Acknowledged, Completed
  
  reviewed_at TIMESTAMP,
  acknowledged_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_position ON employees(position_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);

CREATE INDEX idx_job_applications_posting ON job_applications(job_posting_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_email ON job_applications(email);

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_date ON interviews(scheduled_date);
CREATE INDEX idx_interviews_status ON interviews(status);

CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
CREATE INDEX idx_payroll_period ON payroll_records(period_id);
CREATE INDEX idx_payroll_status ON payroll_records(payment_status);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);

CREATE INDEX idx_leave_balances_employee ON employee_leave_balances(employee_id);
CREATE INDEX idx_leave_balances_year ON employee_leave_balances(year);

CREATE INDEX idx_training_enrollments_program ON training_enrollments(program_id);
CREATE INDEX idx_training_enrollments_employee ON training_enrollments(employee_id);
CREATE INDEX idx_training_enrollments_status ON training_enrollments(status);

CREATE INDEX idx_attendance_employee ON attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_status ON attendance_records(status);

CREATE INDEX idx_performance_reviews_employee ON performance_reviews(employee_id);
CREATE INDEX idx_performance_reviews_reviewer ON performance_reviews(reviewer_id);
CREATE INDEX idx_performance_reviews_period ON performance_reviews(review_period_start, review_period_end);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default departments
INSERT INTO departments (name, code, description) VALUES
('Management', 'MGT', 'Executive management and administration'),
('Sales & Marketing', 'SAL', 'Sales and marketing operations'),
('Product & Operations', 'OPS', 'Product development and operations'),
('Finance & Accounting', 'FIN', 'Financial management and accounting'),
('Human Resources', 'HR', 'Human resource management'),
('Information Technology', 'IT', 'Technology and systems')
ON CONFLICT (code) DO NOTHING;

-- Insert default positions
INSERT INTO positions (title, code, department_id, level, min_salary, max_salary) VALUES
('Chief Executive Officer', 'CEO', (SELECT id FROM departments WHERE code = 'MGT'), 'Director', 50000000, 100000000),
('Chief Operating Officer', 'COO', (SELECT id FROM departments WHERE code = 'MGT'), 'Director', 40000000, 80000000),
('Sales Manager', 'SM', (SELECT id FROM departments WHERE code = 'SAL'), 'Manager', 15000000, 30000000),
('Marketing Manager', 'MM', (SELECT id FROM departments WHERE code = 'SAL'), 'Manager', 15000000, 30000000),
('Operations Manager', 'OM', (SELECT id FROM departments WHERE code = 'OPS'), 'Manager', 15000000, 30000000),
('Finance Manager', 'FM', (SELECT id FROM departments WHERE code = 'FIN'), 'Manager', 15000000, 30000000),
('HR Manager', 'HRM', (SELECT id FROM departments WHERE code = 'HR'), 'Manager', 12000000, 25000000),
('IT Manager', 'ITM', (SELECT id FROM departments WHERE code = 'IT'), 'Manager', 15000000, 30000000),
('Senior Sales Executive', 'SSE', (SELECT id FROM departments WHERE code = 'SAL'), 'Senior', 8000000, 15000000),
('Sales Executive', 'SE', (SELECT id FROM departments WHERE code = 'SAL'), 'Mid', 5000000, 10000000),
('Marketing Executive', 'ME', (SELECT id FROM departments WHERE code = 'SAL'), 'Mid', 5000000, 10000000),
('Accountant', 'ACC', (SELECT id FROM departments WHERE code = 'FIN'), 'Mid', 6000000, 12000000),
('HR Executive', 'HRE', (SELECT id FROM departments WHERE code = 'HR'), 'Mid', 5000000, 10000000),
('Software Engineer', 'SE', (SELECT id FROM departments WHERE code = 'IT'), 'Mid', 8000000, 15000000),
('Administrative Staff', 'ADM', (SELECT id FROM departments WHERE code = 'MGT'), 'Junior', 4000000, 7000000)
ON CONFLICT (code) DO NOTHING;

-- Insert default leave types
INSERT INTO leave_types (name, code, description, days_per_year, is_paid, color) VALUES
('Annual Leave', 'ANNUAL', 'Yearly paid vacation leave', 12, true, '#22c55e'),
('Sick Leave', 'SICK', 'Medical leave with certificate', 12, true, '#ef4444'),
('Casual Leave', 'CASUAL', 'Personal leave for urgent matters', 6, true, '#3b82f6'),
('Maternity Leave', 'MATERNITY', 'Maternity leave (90 days)', 90, true, '#ec4899'),
('Paternity Leave', 'PATERNITY', 'Paternity leave (2 days)', 2, true, '#8b5cf6'),
('Unpaid Leave', 'UNPAID', 'Leave without pay', 0, false, '#6b7280'),
('Bereavement Leave', 'BEREAVEMENT', 'Leave due to death of family member', 3, true, '#000000'),
('Marriage Leave', 'MARRIAGE', 'Leave for own marriage', 3, true, '#f59e0b')
ON CONFLICT (code) DO NOTHING;

-- Insert Indonesian public holidays for 2025
INSERT INTO public_holidays (name, date, is_national, description) VALUES
('Tahun Baru 2025', '2025-01-01', true, 'New Year 2025'),
('Imlek 2575 Kongzili', '2025-01-29', true, 'Chinese New Year'),
('Isra Mikraj Nabi Muhammad SAW', '2025-01-27', true, 'Ascension of the Prophet Muhammad'),
('Hari Raya Nyepi 1947', '2025-03-29', true, 'Balinese New Year'),
('Wafat Yesus Kristus', '2025-04-18', true, 'Good Friday'),
('Hari Buruh Internasional', '2025-05-01', true, 'International Labor Day'),
('Kenaikan Yesus Kristus', '2025-05-29', true, 'Ascension of Jesus Christ'),
('Hari Raya Idul Fitri 1446 H', '2025-03-31', true, 'Eid al-Fitr Day 1'),
('Hari Raya Idul Fitri 1446 H', '2025-04-01', true, 'Eid al-Fitr Day 2'),
('Hari Lahir Pancasila', '2025-06-01', true, 'Pancasila Day'),
('Hari Raya Waisak 2569', '2025-05-12', true, 'Vesak Day'),
('Hari Raya Idul Adha 1446 H', '2025-06-07', true, 'Eid al-Adha'),
('Tahun Baru Islam 1447 H', '2025-06-27', true, 'Islamic New Year'),
('Hari Kemerdekaan RI', '2025-08-17', true, 'Independence Day'),
('Maulid Nabi Muhammad SAW', '2025-09-05', true, 'Birthday of Prophet Muhammad'),
('Hari Natal', '2025-12-25', true, 'Christmas Day'),
('Cuti Bersama Imlek', '2025-01-30', true, 'Joint Leave Chinese New Year'),
('Cuti Bersama Nyepi', '2025-03-31', true, 'Joint Leave Nyepi'),
('Cuti Bersama Idul Fitri', '2025-03-28', true, 'Joint Leave Eid al-Fitr'),
('Cuti Bersama Idul Fitri', '2025-04-02', true, 'Joint Leave Eid al-Fitr'),
('Cuti Bersama Idul Fitri', '2025-04-03', true, 'Joint Leave Eid al-Fitr'),
('Cuti Bersama Idul Fitri', '2025-04-04', true, 'Joint Leave Eid al-Fitr')
ON CONFLICT (date, province) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE employees IS 'Employee information extending users table';
COMMENT ON TABLE departments IS 'Organizational departments structure';
COMMENT ON TABLE positions IS 'Job positions and roles';
COMMENT ON TABLE job_postings IS 'Job vacancy postings';
COMMENT ON TABLE job_applications IS 'Candidate applications for jobs';
COMMENT ON TABLE interviews IS 'Interview scheduling and feedback';
COMMENT ON TABLE payroll_records IS 'Employee payroll and salary records';
COMMENT ON TABLE payroll_periods IS 'Payroll processing periods';
COMMENT ON TABLE leave_types IS 'Types of leave available';
COMMENT ON TABLE leave_requests IS 'Employee leave requests';
COMMENT ON TABLE employee_leave_balances IS 'Employee leave balance tracking';
COMMENT ON TABLE public_holidays IS 'National and regional public holidays';
COMMENT ON TABLE training_programs IS 'Training and development programs';
COMMENT ON TABLE training_enrollments IS 'Employee training enrollments';
COMMENT ON TABLE attendance_records IS 'Daily attendance tracking';
COMMENT ON TABLE performance_reviews IS 'Employee performance reviews';

-- ============================================================================
-- END OF HRIS SCHEMA
-- ============================================================================
