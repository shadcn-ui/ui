-- =====================================================
-- Phase 7 Task 5: HRM - Employee Management
-- =====================================================
-- Description: Complete employee management system with organizational structure,
--              departments, positions, employment lifecycle, documents, and performance
-- Tables: 15 (organizations, departments, positions, employees, employment_history,
--             job_titles, salary_grades, emergency_contacts, dependents, documents,
--             certifications, skills, performance_reviews, disciplinary_actions, exit_interviews)
-- Version: 1.0
-- Date: December 4, 2025
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ORGANIZATION STRUCTURE
-- =====================================================

-- Table: hrm_organizations
-- Purpose: Company organizational units/entities
CREATE TABLE IF NOT EXISTS hrm_organizations (
    organization_id SERIAL PRIMARY KEY,
    organization_code VARCHAR(20) UNIQUE NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    parent_organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    organization_type VARCHAR(50) NOT NULL, -- headquarters, branch, subsidiary, division, regional_office
    tax_id VARCHAR(50),
    registration_number VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Contact
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(200),
    
    -- Operations
    established_date DATE,
    employee_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Table: hrm_departments
-- Purpose: Organizational departments
CREATE TABLE IF NOT EXISTS hrm_departments (
    department_id SERIAL PRIMARY KEY,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    parent_department_id INTEGER REFERENCES hrm_departments(department_id),
    
    -- Management
    department_head_id INTEGER, -- Will reference hrm_employees
    cost_center_code VARCHAR(50),
    budget_code VARCHAR(50),
    
    -- Details
    description TEXT,
    function_type VARCHAR(50), -- operations, sales, marketing, finance, hr, it, admin, support
    employee_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- Table: hrm_job_titles
-- Purpose: Standardized job titles across the organization
CREATE TABLE IF NOT EXISTS hrm_job_titles (
    job_title_id SERIAL PRIMARY KEY,
    job_title_code VARCHAR(20) UNIQUE NOT NULL,
    job_title_name VARCHAR(200) NOT NULL,
    job_level INTEGER, -- 1-10 (1=entry, 10=executive)
    job_family VARCHAR(100), -- engineering, sales, marketing, finance, operations, etc.
    
    -- Job details
    description TEXT,
    responsibilities TEXT,
    required_qualifications TEXT,
    preferred_qualifications TEXT,
    
    -- Compensation
    salary_grade_id INTEGER, -- Will reference hrm_salary_grades
    min_salary DECIMAL(15,2),
    max_salary DECIMAL(15,2),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_salary_grades
-- Purpose: Salary grade structure
CREATE TABLE IF NOT EXISTS hrm_salary_grades (
    salary_grade_id SERIAL PRIMARY KEY,
    grade_code VARCHAR(20) UNIQUE NOT NULL,
    grade_name VARCHAR(100) NOT NULL,
    grade_level INTEGER, -- 1-20
    
    -- Salary range
    min_salary DECIMAL(15,2) NOT NULL,
    max_salary DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Steps within grade
    step_count INTEGER DEFAULT 5,
    step_increment DECIMAL(15,2),
    
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    expiry_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_positions
-- Purpose: Specific positions/headcount in the organization
CREATE TABLE IF NOT EXISTS hrm_positions (
    position_id SERIAL PRIMARY KEY,
    position_code VARCHAR(20) UNIQUE NOT NULL,
    position_name VARCHAR(200) NOT NULL,
    
    -- Organizational placement
    organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    department_id INTEGER REFERENCES hrm_departments(department_id),
    job_title_id INTEGER REFERENCES hrm_job_titles(job_title_id),
    
    -- Reporting structure
    reports_to_position_id INTEGER REFERENCES hrm_positions(position_id),
    
    -- Position details
    employment_type VARCHAR(50) NOT NULL, -- full_time, part_time, contract, temporary, intern
    position_type VARCHAR(50), -- permanent, fixed_term, seasonal, project_based
    headcount INTEGER DEFAULT 1,
    filled_count INTEGER DEFAULT 0,
    
    -- Compensation
    salary_grade_id INTEGER REFERENCES hrm_salary_grades(salary_grade_id),
    budgeted_salary DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'approved', -- draft, approved, on_hold, filled, closed
    approved_date DATE,
    approved_by INTEGER,
    
    description TEXT,
    requirements TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER
);

-- =====================================================
-- EMPLOYEE MASTER DATA
-- =====================================================

-- Table: hrm_employees
-- Purpose: Core employee information
CREATE TABLE IF NOT EXISTS hrm_employees (
    employee_id SERIAL PRIMARY KEY,
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(50),
    nationality VARCHAR(100),
    
    -- Identification
    national_id VARCHAR(50),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    driving_license VARCHAR(50),
    driving_license_expiry DATE,
    
    -- Contact
    personal_email VARCHAR(100),
    work_email VARCHAR(100),
    mobile_phone VARCHAR(50),
    work_phone VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    -- Employment
    organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    department_id INTEGER REFERENCES hrm_departments(department_id),
    position_id INTEGER REFERENCES hrm_positions(position_id),
    job_title_id INTEGER REFERENCES hrm_job_titles(job_title_id),
    
    -- Reporting
    reports_to_employee_id INTEGER REFERENCES hrm_employees(employee_id),
    dotted_line_manager_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Employment details
    employment_type VARCHAR(50), -- full_time, part_time, contract, temporary, intern
    employee_status VARCHAR(50) DEFAULT 'active', -- active, on_leave, suspended, terminated, retired
    hire_date DATE NOT NULL,
    confirmation_date DATE,
    termination_date DATE,
    last_working_date DATE,
    
    -- Compensation
    salary_grade_id INTEGER REFERENCES hrm_salary_grades(salary_grade_id),
    current_salary DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    pay_frequency VARCHAR(50), -- monthly, bi_weekly, weekly, hourly
    
    -- Bank details
    bank_name VARCHAR(200),
    bank_account_number VARCHAR(50),
    bank_routing_number VARCHAR(50),
    
    -- System access
    user_id INTEGER, -- Link to system users table
    username VARCHAR(100),
    photo_url VARCHAR(500),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    termination_reason TEXT,
    rehire_eligible BOOLEAN DEFAULT true,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    
    CONSTRAINT check_hire_date CHECK (hire_date <= CURRENT_DATE)
);

-- Table: hrm_employment_history
-- Purpose: Track all employment changes (promotions, transfers, etc.)
CREATE TABLE IF NOT EXISTS hrm_employment_history (
    history_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Change details
    change_type VARCHAR(50) NOT NULL, -- hire, promotion, transfer, demotion, salary_change, status_change, termination
    effective_date DATE NOT NULL,
    
    -- Previous values
    previous_organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    previous_department_id INTEGER REFERENCES hrm_departments(department_id),
    previous_position_id INTEGER REFERENCES hrm_positions(position_id),
    previous_job_title_id INTEGER REFERENCES hrm_job_titles(job_title_id),
    previous_manager_id INTEGER REFERENCES hrm_employees(employee_id),
    previous_salary DECIMAL(15,2),
    previous_employment_type VARCHAR(50),
    previous_status VARCHAR(50),
    
    -- New values
    new_organization_id INTEGER REFERENCES hrm_organizations(organization_id),
    new_department_id INTEGER REFERENCES hrm_departments(department_id),
    new_position_id INTEGER REFERENCES hrm_positions(position_id),
    new_job_title_id INTEGER REFERENCES hrm_job_titles(job_title_id),
    new_manager_id INTEGER REFERENCES hrm_employees(employee_id),
    new_salary DECIMAL(15,2),
    new_employment_type VARCHAR(50),
    new_status VARCHAR(50),
    
    -- Approval
    reason TEXT,
    approved_by INTEGER,
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- =====================================================
-- EMPLOYEE RELATIONSHIPS
-- =====================================================

-- Table: hrm_emergency_contacts
-- Purpose: Emergency contact information
CREATE TABLE IF NOT EXISTS hrm_emergency_contacts (
    contact_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Contact details
    contact_name VARCHAR(200) NOT NULL,
    relationship VARCHAR(100) NOT NULL, -- spouse, parent, sibling, child, friend, other
    phone_primary VARCHAR(50) NOT NULL,
    phone_secondary VARCHAR(50),
    email VARCHAR(100),
    
    -- Address
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    
    is_primary BOOLEAN DEFAULT false,
    priority_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_dependents
-- Purpose: Employee dependents (for benefits, insurance, etc.)
CREATE TABLE IF NOT EXISTS hrm_dependents (
    dependent_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Dependent details
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(100) NOT NULL, -- spouse, child, parent, other
    date_of_birth DATE,
    gender VARCHAR(20),
    
    -- Identification
    national_id VARCHAR(50),
    passport_number VARCHAR(50),
    
    -- Status
    is_beneficiary BOOLEAN DEFAULT false,
    beneficiary_percentage DECIMAL(5,2),
    is_insured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EMPLOYEE DOCUMENTS & CREDENTIALS
-- =====================================================

-- Table: hrm_employee_documents
-- Purpose: Store employee document metadata
CREATE TABLE IF NOT EXISTS hrm_employee_documents (
    document_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Document details
    document_type VARCHAR(100) NOT NULL, -- resume, contract, id_proof, education, certification, offer_letter, etc.
    document_number VARCHAR(100),
    document_name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- File info
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    file_type VARCHAR(50),
    file_size INTEGER, -- in bytes
    
    -- Dates
    issue_date DATE,
    expiry_date DATE,
    
    -- Status
    verification_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected, expired
    verified_by INTEGER,
    verified_date DATE,
    verification_notes TEXT,
    
    is_confidential BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Table: hrm_certifications
-- Purpose: Professional certifications and licenses
CREATE TABLE IF NOT EXISTS hrm_certifications (
    certification_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Certification details
    certification_name VARCHAR(200) NOT NULL,
    certification_number VARCHAR(100),
    issuing_organization VARCHAR(200),
    certification_type VARCHAR(100), -- professional, technical, safety, compliance, language
    
    -- Dates
    issue_date DATE,
    expiry_date DATE,
    last_renewal_date DATE,
    
    -- Verification
    verification_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    verified_by INTEGER,
    verified_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, expired, suspended, revoked
    requires_renewal BOOLEAN DEFAULT true,
    renewal_reminder_days INTEGER DEFAULT 60,
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: hrm_employee_skills
-- Purpose: Employee skills and competencies
CREATE TABLE IF NOT EXISTS hrm_employee_skills (
    skill_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Skill details
    skill_name VARCHAR(200) NOT NULL,
    skill_category VARCHAR(100), -- technical, soft_skill, language, tool, domain_knowledge
    proficiency_level VARCHAR(50), -- beginner, intermediate, advanced, expert
    proficiency_score INTEGER, -- 1-10
    
    -- Acquisition
    years_of_experience DECIMAL(4,1),
    acquired_date DATE,
    last_used_date DATE,
    
    -- Validation
    is_certified BOOLEAN DEFAULT false,
    certification_name VARCHAR(200),
    is_primary_skill BOOLEAN DEFAULT false,
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PERFORMANCE & CONDUCT
-- =====================================================

-- Table: hrm_performance_reviews
-- Purpose: Employee performance reviews
CREATE TABLE IF NOT EXISTS hrm_performance_reviews (
    review_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Review details
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    review_type VARCHAR(50), -- annual, mid_year, probation, project, ad_hoc
    review_date DATE,
    
    -- Reviewer
    reviewer_id INTEGER REFERENCES hrm_employees(employee_id),
    reviewer_relationship VARCHAR(50), -- direct_manager, skip_level, peer, self
    
    -- Ratings
    overall_rating DECIMAL(3,2), -- 1.00 to 5.00
    goals_achievement_rating DECIMAL(3,2),
    competency_rating DECIMAL(3,2),
    behavior_rating DECIMAL(3,2),
    
    -- Performance details
    strengths TEXT,
    areas_for_improvement TEXT,
    achievements TEXT,
    goals_next_period TEXT,
    development_plan TEXT,
    
    -- Recommendations
    promotion_recommended BOOLEAN DEFAULT false,
    salary_increase_recommended BOOLEAN DEFAULT false,
    recommended_increase_percentage DECIMAL(5,2),
    training_recommended TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, submitted, under_review, completed, acknowledged
    employee_acknowledgment_date DATE,
    employee_comments TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Table: hrm_disciplinary_actions
-- Purpose: Track disciplinary actions
CREATE TABLE IF NOT EXISTS hrm_disciplinary_actions (
    action_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Action details
    action_type VARCHAR(50) NOT NULL, -- verbal_warning, written_warning, suspension, demotion, termination
    severity_level VARCHAR(50), -- minor, moderate, major, critical
    incident_date DATE NOT NULL,
    action_date DATE NOT NULL,
    
    -- Incident details
    incident_description TEXT NOT NULL,
    policy_violated TEXT,
    witness_names TEXT,
    
    -- Action taken
    action_description TEXT NOT NULL,
    consequences TEXT,
    improvement_plan TEXT,
    follow_up_date DATE,
    
    -- Approval
    reported_by INTEGER,
    approved_by INTEGER,
    approved_date DATE,
    hr_reviewed_by INTEGER,
    hr_review_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, appealed, overturned
    appeal_date DATE,
    appeal_outcome TEXT,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- Table: hrm_exit_interviews
-- Purpose: Exit interview data
CREATE TABLE IF NOT EXISTS hrm_exit_interviews (
    exit_interview_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Interview details
    interview_date DATE,
    interviewer_id INTEGER REFERENCES hrm_employees(employee_id),
    
    -- Reasons for leaving
    primary_reason VARCHAR(100), -- better_opportunity, compensation, career_growth, relocation, personal, retirement, health, other
    secondary_reasons TEXT,
    
    -- Feedback
    job_satisfaction_rating INTEGER, -- 1-5
    manager_relationship_rating INTEGER,
    work_environment_rating INTEGER,
    compensation_rating INTEGER,
    growth_opportunities_rating INTEGER,
    work_life_balance_rating INTEGER,
    
    -- Details
    liked_most TEXT,
    liked_least TEXT,
    suggestions_for_improvement TEXT,
    would_recommend_company BOOLEAN,
    would_consider_returning BOOLEAN,
    
    -- Follow-up
    final_settlement_date DATE,
    exit_clearance_completed BOOLEAN DEFAULT false,
    
    is_confidential BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Organization indexes
CREATE INDEX idx_organizations_parent ON hrm_organizations(parent_organization_id);
CREATE INDEX idx_organizations_active ON hrm_organizations(is_active);
CREATE INDEX idx_organizations_type ON hrm_organizations(organization_type);

-- Department indexes
CREATE INDEX idx_departments_org ON hrm_departments(organization_id);
CREATE INDEX idx_departments_parent ON hrm_departments(parent_department_id);
CREATE INDEX idx_departments_head ON hrm_departments(department_head_id);
CREATE INDEX idx_departments_active ON hrm_departments(is_active);

-- Position indexes
CREATE INDEX idx_positions_org ON hrm_positions(organization_id);
CREATE INDEX idx_positions_dept ON hrm_positions(department_id);
CREATE INDEX idx_positions_job_title ON hrm_positions(job_title_id);
CREATE INDEX idx_positions_reports_to ON hrm_positions(reports_to_position_id);
CREATE INDEX idx_positions_status ON hrm_positions(status);

-- Employee indexes
CREATE INDEX idx_employees_org ON hrm_employees(organization_id);
CREATE INDEX idx_employees_dept ON hrm_employees(department_id);
CREATE INDEX idx_employees_position ON hrm_employees(position_id);
CREATE INDEX idx_employees_job_title ON hrm_employees(job_title_id);
CREATE INDEX idx_employees_manager ON hrm_employees(reports_to_employee_id);
CREATE INDEX idx_employees_status ON hrm_employees(employee_status);
CREATE INDEX idx_employees_active ON hrm_employees(is_active);
CREATE INDEX idx_employees_hire_date ON hrm_employees(hire_date);
CREATE INDEX idx_employees_name ON hrm_employees(last_name, first_name);
CREATE INDEX idx_employees_email ON hrm_employees(work_email);

-- Employment history indexes
CREATE INDEX idx_employment_history_employee ON hrm_employment_history(employee_id);
CREATE INDEX idx_employment_history_type ON hrm_employment_history(change_type);
CREATE INDEX idx_employment_history_date ON hrm_employment_history(effective_date);

-- Document indexes
CREATE INDEX idx_documents_employee ON hrm_employee_documents(employee_id);
CREATE INDEX idx_documents_type ON hrm_employee_documents(document_type);
CREATE INDEX idx_documents_expiry ON hrm_employee_documents(expiry_date);

-- Certification indexes
CREATE INDEX idx_certifications_employee ON hrm_certifications(employee_id);
CREATE INDEX idx_certifications_expiry ON hrm_certifications(expiry_date);
CREATE INDEX idx_certifications_status ON hrm_certifications(status);

-- Performance review indexes
CREATE INDEX idx_reviews_employee ON hrm_performance_reviews(employee_id);
CREATE INDEX idx_reviews_reviewer ON hrm_performance_reviews(reviewer_id);
CREATE INDEX idx_reviews_date ON hrm_performance_reviews(review_date);
CREATE INDEX idx_reviews_status ON hrm_performance_reviews(status);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_hrm_organizations_updated_at BEFORE UPDATE ON hrm_organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_departments_updated_at BEFORE UPDATE ON hrm_departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_positions_updated_at BEFORE UPDATE ON hrm_positions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_employees_updated_at BEFORE UPDATE ON hrm_employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_job_titles_updated_at BEFORE UPDATE ON hrm_job_titles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hrm_salary_grades_updated_at BEFORE UPDATE ON hrm_salary_grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update department employee count
CREATE OR REPLACE FUNCTION update_department_employee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hrm_departments SET employee_count = employee_count + 1
        WHERE department_id = NEW.department_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hrm_departments SET employee_count = employee_count - 1
        WHERE department_id = OLD.department_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.department_id != OLD.department_id THEN
        UPDATE hrm_departments SET employee_count = employee_count - 1
        WHERE department_id = OLD.department_id;
        UPDATE hrm_departments SET employee_count = employee_count + 1
        WHERE department_id = NEW.department_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dept_count_on_employee_change
AFTER INSERT OR UPDATE OR DELETE ON hrm_employees
FOR EACH ROW EXECUTE FUNCTION update_department_employee_count();

-- Trigger to update organization employee count
CREATE OR REPLACE FUNCTION update_organization_employee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hrm_organizations SET employee_count = employee_count + 1
        WHERE organization_id = NEW.organization_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hrm_organizations SET employee_count = employee_count - 1
        WHERE organization_id = OLD.organization_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.organization_id != OLD.organization_id THEN
        UPDATE hrm_organizations SET employee_count = employee_count - 1
        WHERE organization_id = OLD.organization_id;
        UPDATE hrm_organizations SET employee_count = employee_count + 1
        WHERE organization_id = NEW.organization_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_org_count_on_employee_change
AFTER INSERT OR UPDATE OR DELETE ON hrm_employees
FOR EACH ROW EXECUTE FUNCTION update_organization_employee_count();

-- Trigger to update position filled count
CREATE OR REPLACE FUNCTION update_position_filled_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE hrm_positions SET filled_count = filled_count + 1
        WHERE position_id = NEW.position_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE hrm_positions SET filled_count = filled_count - 1
        WHERE position_id = OLD.position_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.position_id != OLD.position_id THEN
        UPDATE hrm_positions SET filled_count = filled_count - 1
        WHERE position_id = OLD.position_id;
        UPDATE hrm_positions SET filled_count = filled_count + 1
        WHERE position_id = NEW.position_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_position_count_on_employee_change
AFTER INSERT OR UPDATE OR DELETE ON hrm_employees
FOR EACH ROW EXECUTE FUNCTION update_position_filled_count();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert salary grades
INSERT INTO hrm_salary_grades (grade_code, grade_name, grade_level, min_salary, max_salary, step_count, step_increment, description) VALUES
('G1', 'Grade 1 - Entry Level', 1, 30000, 45000, 5, 3000, 'Entry level positions'),
('G2', 'Grade 2 - Junior', 2, 45000, 60000, 5, 3000, 'Junior professional positions'),
('G3', 'Grade 3 - Mid Level', 3, 60000, 80000, 5, 4000, 'Mid-level professional positions'),
('G4', 'Grade 4 - Senior', 4, 80000, 110000, 5, 6000, 'Senior professional positions'),
('G5', 'Grade 5 - Lead', 5, 110000, 145000, 5, 7000, 'Lead/Principal positions'),
('G6', 'Grade 6 - Manager', 6, 120000, 160000, 5, 8000, 'Management positions'),
('G7', 'Grade 7 - Senior Manager', 7, 140000, 190000, 5, 10000, 'Senior management positions'),
('G8', 'Grade 8 - Director', 8, 160000, 220000, 5, 12000, 'Director level positions'),
('G9', 'Grade 9 - Senior Director', 9, 190000, 260000, 5, 14000, 'Senior director positions'),
('G10', 'Grade 10 - Executive', 10, 220000, 350000, 5, 26000, 'Executive level positions');

-- Insert job titles
INSERT INTO hrm_job_titles (job_title_code, job_title_name, job_level, job_family, description, salary_grade_id, min_salary, max_salary) VALUES
('JT001', 'Software Engineer I', 2, 'Engineering', 'Entry-level software engineer', 2, 45000, 60000),
('JT002', 'Software Engineer II', 3, 'Engineering', 'Mid-level software engineer', 3, 60000, 80000),
('JT003', 'Senior Software Engineer', 4, 'Engineering', 'Senior software engineer', 4, 80000, 110000),
('JT004', 'Lead Software Engineer', 5, 'Engineering', 'Technical lead', 5, 110000, 145000),
('JT005', 'Engineering Manager', 6, 'Engineering', 'Engineering team manager', 6, 120000, 160000),
('JT006', 'Sales Representative', 2, 'Sales', 'Inside sales representative', 2, 45000, 60000),
('JT007', 'Account Executive', 3, 'Sales', 'Field sales account executive', 3, 60000, 80000),
('JT008', 'Senior Account Executive', 4, 'Sales', 'Senior sales executive', 4, 80000, 110000),
('JT009', 'Sales Manager', 6, 'Sales', 'Sales team manager', 6, 120000, 160000),
('JT010', 'HR Specialist', 3, 'Human Resources', 'HR generalist', 3, 60000, 80000),
('JT011', 'HR Manager', 6, 'Human Resources', 'HR team manager', 6, 120000, 160000),
('JT012', 'Accountant', 3, 'Finance', 'Staff accountant', 3, 60000, 80000),
('JT013', 'Senior Accountant', 4, 'Finance', 'Senior accountant', 4, 80000, 110000),
('JT014', 'Finance Manager', 6, 'Finance', 'Finance team manager', 6, 120000, 160000),
('JT015', 'Marketing Specialist', 3, 'Marketing', 'Marketing coordinator', 3, 60000, 80000);

-- Insert main organization
INSERT INTO hrm_organizations (organization_code, organization_name, legal_name, organization_type, address_line1, city, state_province, country, phone, email, established_date) VALUES
('ORG-HQ', 'Ocean ERP Headquarters', 'Ocean ERP Corporation', 'headquarters', '123 Tech Boulevard', 'San Francisco', 'California', 'United States', '+1-415-555-0100', 'info@ocean-erp.com', '2020-01-15');

-- Insert departments
INSERT INTO hrm_departments (department_code, department_name, organization_id, function_type, description) VALUES
('DEPT-ENG', 'Engineering', 1, 'operations', 'Software development and engineering'),
('DEPT-SALES', 'Sales', 1, 'sales', 'Sales and business development'),
('DEPT-HR', 'Human Resources', 1, 'hr', 'Employee management and development'),
('DEPT-FIN', 'Finance', 1, 'finance', 'Financial planning and accounting'),
('DEPT-MKT', 'Marketing', 1, 'marketing', 'Marketing and communications');

-- Insert positions
INSERT INTO hrm_positions (position_code, position_name, organization_id, department_id, job_title_id, employment_type, position_type, headcount, status) VALUES
('POS-001', 'Senior Software Engineer - Backend', 1, 1, 3, 'full_time', 'permanent', 3, 'approved'),
('POS-002', 'Engineering Manager - Platform', 1, 1, 5, 'full_time', 'permanent', 1, 'approved'),
('POS-003', 'Account Executive - Enterprise', 1, 2, 7, 'full_time', 'permanent', 5, 'approved'),
('POS-004', 'HR Manager', 1, 3, 11, 'full_time', 'permanent', 1, 'filled'),
('POS-005', 'Finance Manager', 1, 4, 14, 'full_time', 'permanent', 1, 'filled');

-- Insert sample employees
INSERT INTO hrm_employees (employee_number, first_name, last_name, date_of_birth, gender, personal_email, work_email, mobile_phone, organization_id, department_id, position_id, job_title_id, employment_type, employee_status, hire_date, current_salary, salary_grade_id) VALUES
('EMP-00001', 'John', 'Smith', '1985-03-15', 'Male', 'john.smith@personal.com', 'john.smith@ocean-erp.com', '+1-415-555-1001', 1, 1, 2, 5, 'full_time', 'active', '2020-02-01', 135000, 5),
('EMP-00002', 'Sarah', 'Johnson', '1988-07-22', 'Female', 'sarah.j@personal.com', 'sarah.johnson@ocean-erp.com', '+1-415-555-1002', 1, 3, 4, 11, 'full_time', 'active', '2020-03-15', 145000, 6),
('EMP-00003', 'Michael', 'Chen', '1990-11-08', 'Male', 'mchen@personal.com', 'michael.chen@ocean-erp.com', '+1-415-555-1003', 1, 1, 1, 3, 'full_time', 'active', '2021-06-01', 95000, 4),
('EMP-00004', 'Emily', 'Davis', '1992-05-30', 'Female', 'emily.d@personal.com', 'emily.davis@ocean-erp.com', '+1-415-555-1004', 1, 2, 3, 7, 'full_time', 'active', '2021-09-01', 72000, 3),
('EMP-00005', 'David', 'Wilson', '1987-01-12', 'Male', 'dwilson@personal.com', 'david.wilson@ocean-erp.com', '+1-415-555-1005', 1, 4, 5, 14, 'full_time', 'active', '2020-05-01', 155000, 6);

-- Update manager relationships
UPDATE hrm_employees SET reports_to_employee_id = 1 WHERE employee_id = 3;
UPDATE hrm_employees SET reports_to_employee_id = 2 WHERE employee_id IN (4, 5);

-- Insert emergency contacts
INSERT INTO hrm_emergency_contacts (employee_id, contact_name, relationship, phone_primary, email, is_primary) VALUES
(1, 'Jane Smith', 'spouse', '+1-415-555-2001', 'jane.smith@email.com', true),
(2, 'Robert Johnson', 'spouse', '+1-415-555-2002', 'rob.johnson@email.com', true),
(3, 'Linda Chen', 'parent', '+1-415-555-2003', 'linda.chen@email.com', true);

-- Insert certifications
INSERT INTO hrm_certifications (employee_id, certification_name, certification_number, issuing_organization, certification_type, issue_date, expiry_date, is_verified, status) VALUES
(1, 'AWS Certified Solutions Architect', 'AWS-SA-12345', 'Amazon Web Services', 'technical', '2023-01-15', '2026-01-15', true, 'active'),
(3, 'Google Cloud Professional Developer', 'GCP-PD-67890', 'Google Cloud', 'technical', '2023-06-01', '2025-06-01', true, 'active'),
(2, 'SHRM-CP', 'SHRM-123456', 'Society for Human Resource Management', 'professional', '2022-03-01', '2025-03-01', true, 'active');

-- Insert skills
INSERT INTO hrm_employee_skills (employee_id, skill_name, skill_category, proficiency_level, proficiency_score, years_of_experience, is_primary_skill) VALUES
(1, 'Python', 'technical', 'expert', 9, 8.0, true),
(1, 'JavaScript', 'technical', 'advanced', 8, 6.0, true),
(1, 'Team Leadership', 'soft_skill', 'advanced', 8, 5.0, false),
(3, 'React', 'technical', 'advanced', 8, 3.0, true),
(3, 'Node.js', 'technical', 'intermediate', 6, 2.5, false),
(4, 'Salesforce', 'tool', 'advanced', 8, 4.0, true),
(4, 'Negotiation', 'soft_skill', 'advanced', 8, 5.0, true);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Phase 7 Task 5: HRM - Employee Management Schema Installation Complete!';
    RAISE NOTICE '📊 Tables created: 15';
    RAISE NOTICE '👥 Organizations: %', (SELECT COUNT(*) FROM hrm_organizations);
    RAISE NOTICE '🏢 Departments: %', (SELECT COUNT(*) FROM hrm_departments);
    RAISE NOTICE '📋 Positions: %', (SELECT COUNT(*) FROM hrm_positions);
    RAISE NOTICE '💼 Job Titles: %', (SELECT COUNT(*) FROM hrm_job_titles);
    RAISE NOTICE '💰 Salary Grades: %', (SELECT COUNT(*) FROM hrm_salary_grades);
    RAISE NOTICE '👨‍💼 Employees: %', (SELECT COUNT(*) FROM hrm_employees);
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Ready for API implementation!';
END $$;
