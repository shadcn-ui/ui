-- =============================================
-- Phase 7 Task 9: Project Management System
-- =============================================
-- Complete project lifecycle management including:
-- - Project planning and tracking
-- - Task management with dependencies
-- - Resource allocation and scheduling
-- - Time tracking and billing
-- - Budget management and expense tracking
-- - Document management
-- - Team collaboration
-- - Milestones and deliverables
-- - Gantt chart data
-- - Project analytics and reporting
-- =============================================

-- Drop existing tables if they exist (in correct order)
DROP TABLE IF EXISTS project_task_comments CASCADE;
DROP TABLE IF EXISTS project_time_entries CASCADE;
DROP TABLE IF EXISTS project_expenses CASCADE;
DROP TABLE IF EXISTS project_documents CASCADE;
DROP TABLE IF EXISTS project_team_members CASCADE;
DROP TABLE IF EXISTS project_resource_allocations CASCADE;
DROP TABLE IF EXISTS project_task_dependencies CASCADE;
DROP TABLE IF EXISTS project_tasks CASCADE;
DROP TABLE IF EXISTS project_milestones CASCADE;
DROP TABLE IF EXISTS project_phases CASCADE;
DROP TABLE IF EXISTS project_budgets CASCADE;
DROP TABLE IF EXISTS project_resources CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS project_dashboard_summary CASCADE;
DROP VIEW IF EXISTS project_task_timeline CASCADE;
DROP VIEW IF EXISTS project_resource_utilization CASCADE;

-- =============================================
-- 1. PROJECTS - Master project table
-- =============================================
CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    
    -- Client/Customer
    customer_id INTEGER, -- Reference to customers table (if exists)
    customer_name VARCHAR(255),
    customer_contact_person VARCHAR(255),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    
    -- Project Classification
    project_type VARCHAR(50) NOT NULL DEFAULT 'internal', -- internal, client, maintenance, development, consulting
    project_category VARCHAR(100), -- software, construction, marketing, research, etc.
    industry VARCHAR(100), -- technology, healthcare, finance, etc.
    
    -- Project Manager
    project_manager_id INTEGER, -- Reference to users table
    project_manager_name VARCHAR(255),
    
    -- Timeline
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Duration (calculated)
    planned_duration_days INTEGER GENERATED ALWAYS AS (planned_end_date - planned_start_date) STORED,
    actual_duration_days INTEGER,
    
    -- Status
    project_status VARCHAR(50) NOT NULL DEFAULT 'planning', 
    -- planning, active, on_hold, completed, cancelled, archived
    status_reason TEXT,
    health_status VARCHAR(50) DEFAULT 'on_track', -- on_track, at_risk, delayed, critical
    
    -- Progress
    completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    tasks_total INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    
    -- Budget
    budget_amount DECIMAL(15,2) DEFAULT 0.00,
    budget_currency VARCHAR(3) DEFAULT 'USD',
    actual_cost DECIMAL(15,2) DEFAULT 0.00,
    budget_variance DECIMAL(15,2) GENERATED ALWAYS AS (budget_amount - actual_cost) STORED,
    budget_variance_percentage DECIMAL(5,2),
    
    -- Billing
    billing_type VARCHAR(50) DEFAULT 'fixed_price', -- fixed_price, time_and_material, milestone_based, retainer
    billing_rate_per_hour DECIMAL(10,2),
    total_billed_amount DECIMAL(15,2) DEFAULT 0.00,
    total_unbilled_amount DECIMAL(15,2) DEFAULT 0.00,
    
    -- Priority and Risk
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    risk_level VARCHAR(20) DEFAULT 'low', -- low, medium, high, critical
    risk_description TEXT,
    
    -- Location
    project_location VARCHAR(255),
    site_address TEXT,
    
    -- Metrics
    total_hours_planned DECIMAL(10,2) DEFAULT 0.00,
    total_hours_logged DECIMAL(10,2) DEFAULT 0.00,
    billable_hours DECIMAL(10,2) DEFAULT 0.00,
    non_billable_hours DECIMAL(10,2) DEFAULT 0.00,
    
    -- Team
    team_size INTEGER DEFAULT 0,
    
    -- Documents and Links
    project_folder_path VARCHAR(500),
    repository_url VARCHAR(500),
    documentation_url VARCHAR(500),
    
    -- Notifications
    enable_notifications BOOLEAN DEFAULT TRUE,
    notification_frequency VARCHAR(50) DEFAULT 'daily', -- real_time, daily, weekly
    
    -- Tags and Custom Fields
    tags TEXT[], -- Array of tags
    custom_fields JSONB, -- Flexible custom fields
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    is_billable BOOLEAN DEFAULT TRUE,
    is_template BOOLEAN DEFAULT FALSE,
    template_name VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    
    -- Constraints
    CONSTRAINT valid_dates CHECK (planned_end_date >= planned_start_date),
    CONSTRAINT valid_actual_dates CHECK (actual_end_date IS NULL OR actual_end_date >= actual_start_date)
);

CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_manager ON projects(project_manager_id);
CREATE INDEX idx_projects_status ON projects(project_status);
CREATE INDEX idx_projects_dates ON projects(planned_start_date, planned_end_date);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_health ON projects(health_status);
CREATE INDEX idx_projects_active ON projects(is_active);

-- =============================================
-- 2. PROJECT_PHASES - Project phases/stages
-- =============================================
CREATE TABLE project_phases (
    phase_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    
    phase_name VARCHAR(255) NOT NULL,
    phase_description TEXT,
    phase_order INTEGER NOT NULL DEFAULT 1,
    
    -- Timeline
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_end_date DATE,
    
    -- Status
    phase_status VARCHAR(50) NOT NULL DEFAULT 'not_started', 
    -- not_started, in_progress, completed, on_hold, cancelled
    
    -- Progress
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Budget
    phase_budget DECIMAL(15,2) DEFAULT 0.00,
    phase_actual_cost DECIMAL(15,2) DEFAULT 0.00,
    
    -- Dependencies
    depends_on_phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    
    -- Deliverables
    deliverables TEXT[],
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_phase_dates CHECK (planned_end_date >= planned_start_date),
    CONSTRAINT unique_phase_order UNIQUE(project_id, phase_order)
);

CREATE INDEX idx_phases_project ON project_phases(project_id);
CREATE INDEX idx_phases_status ON project_phases(phase_status);
CREATE INDEX idx_phases_order ON project_phases(project_id, phase_order);

-- =============================================
-- 3. PROJECT_MILESTONES - Key project milestones
-- =============================================
CREATE TABLE project_milestones (
    milestone_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    
    milestone_name VARCHAR(255) NOT NULL,
    milestone_description TEXT,
    
    -- Timeline
    planned_date DATE NOT NULL,
    actual_date DATE,
    
    -- Status
    milestone_status VARCHAR(50) NOT NULL DEFAULT 'pending', 
    -- pending, achieved, missed, cancelled
    
    -- Type
    milestone_type VARCHAR(50) DEFAULT 'deliverable', 
    -- deliverable, payment, approval, review, launch
    
    -- Payment milestone
    is_payment_milestone BOOLEAN DEFAULT FALSE,
    payment_amount DECIMAL(15,2),
    payment_percentage DECIMAL(5,2),
    invoice_generated BOOLEAN DEFAULT FALSE,
    
    -- Dependencies
    depends_on_milestone_id INTEGER REFERENCES project_milestones(milestone_id) ON DELETE SET NULL,
    
    -- Deliverables
    deliverables TEXT[],
    
    -- Approval
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    approval_notes TEXT,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_payment_milestone CHECK (
        (is_payment_milestone = FALSE) OR 
        (is_payment_milestone = TRUE AND (payment_amount IS NOT NULL OR payment_percentage IS NOT NULL))
    )
);

CREATE INDEX idx_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_milestones_phase ON project_milestones(phase_id);
CREATE INDEX idx_milestones_status ON project_milestones(milestone_status);
CREATE INDEX idx_milestones_date ON project_milestones(planned_date);

-- =============================================
-- 4. PROJECT_TASKS - Individual project tasks
-- =============================================
CREATE TABLE project_tasks (
    task_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    milestone_id INTEGER REFERENCES project_milestones(milestone_id) ON DELETE SET NULL,
    parent_task_id INTEGER REFERENCES project_tasks(task_id) ON DELETE CASCADE,
    
    -- Task Details
    task_code VARCHAR(50),
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    
    -- Assignment
    assigned_to INTEGER,
    assigned_by INTEGER,
    assigned_date TIMESTAMP,
    
    -- Timeline
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    due_date DATE,
    
    -- Estimated effort
    estimated_hours DECIMAL(10,2) DEFAULT 0.00,
    actual_hours DECIMAL(10,2) DEFAULT 0.00,
    remaining_hours DECIMAL(10,2) DEFAULT 0.00,
    
    -- Status
    task_status VARCHAR(50) NOT NULL DEFAULT 'todo', 
    -- todo, in_progress, in_review, blocked, completed, cancelled
    status_reason TEXT,
    
    -- Progress
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    
    -- Type
    task_type VARCHAR(50) DEFAULT 'task', -- task, bug, feature, enhancement, research, documentation
    
    -- Billing
    is_billable BOOLEAN DEFAULT TRUE,
    billable_rate DECIMAL(10,2),
    
    -- Blocking
    is_blocked BOOLEAN DEFAULT FALSE,
    blocked_reason TEXT,
    blocked_date TIMESTAMP,
    
    -- Checklist (sub-items)
    checklist_items JSONB, -- Array of checklist items with status
    
    -- Effort tracking
    story_points INTEGER, -- For agile teams
    complexity VARCHAR(20), -- simple, medium, complex
    
    -- Tags and Custom
    tags TEXT[],
    custom_fields JSONB,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    updated_by INTEGER,
    completed_at TIMESTAMP,
    completed_by INTEGER,
    
    CONSTRAINT valid_task_dates CHECK (
        planned_end_date IS NULL OR planned_start_date IS NULL OR 
        planned_end_date >= planned_start_date
    )
);

CREATE INDEX idx_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_tasks_phase ON project_tasks(phase_id);
CREATE INDEX idx_tasks_milestone ON project_tasks(milestone_id);
CREATE INDEX idx_tasks_assigned ON project_tasks(assigned_to);
CREATE INDEX idx_tasks_status ON project_tasks(task_status);
CREATE INDEX idx_tasks_parent ON project_tasks(parent_task_id);
CREATE INDEX idx_tasks_due_date ON project_tasks(due_date);
CREATE INDEX idx_tasks_priority ON project_tasks(priority);

-- =============================================
-- 5. PROJECT_TASK_DEPENDENCIES - Task dependencies
-- =============================================
CREATE TABLE project_task_dependencies (
    dependency_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES project_tasks(task_id) ON DELETE CASCADE,
    depends_on_task_id INTEGER NOT NULL REFERENCES project_tasks(task_id) ON DELETE CASCADE,
    
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'finish_to_start',
    -- finish_to_start (FS): Task B starts when Task A finishes
    -- start_to_start (SS): Task B starts when Task A starts
    -- finish_to_finish (FF): Task B finishes when Task A finishes
    -- start_to_finish (SF): Task B finishes when Task A starts
    
    lag_days INTEGER DEFAULT 0, -- Delay between tasks (can be negative for lead time)
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT no_self_dependency CHECK (task_id != depends_on_task_id),
    CONSTRAINT unique_task_dependency UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_dependencies_task ON project_task_dependencies(task_id);
CREATE INDEX idx_dependencies_depends ON project_task_dependencies(depends_on_task_id);

-- =============================================
-- 6. PROJECT_RESOURCES - Resource catalog
-- =============================================
CREATE TABLE project_resources (
    resource_id SERIAL PRIMARY KEY,
    
    -- Resource Details
    resource_type VARCHAR(50) NOT NULL, -- human, equipment, material, facility, software
    resource_name VARCHAR(255) NOT NULL,
    resource_code VARCHAR(50) UNIQUE,
    
    -- For Human Resources
    user_id INTEGER,
    employee_id INTEGER, -- Reference to HR module if exists
    role VARCHAR(100), -- developer, designer, manager, analyst, etc.
    skill_set TEXT[], -- Array of skills
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    available_from DATE,
    available_until DATE,
    
    -- Capacity
    daily_capacity_hours DECIMAL(5,2) DEFAULT 8.00,
    weekly_capacity_hours DECIMAL(5,2) DEFAULT 40.00,
    
    -- Cost
    cost_per_hour DECIMAL(10,2),
    cost_per_day DECIMAL(10,2),
    cost_per_unit DECIMAL(10,2),
    billing_rate_per_hour DECIMAL(10,2),
    
    -- Location
    location VARCHAR(255),
    timezone VARCHAR(50),
    
    -- Contact (for external resources)
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    vendor_id INTEGER, -- Reference to vendors table if exists
    
    -- Utilization metrics
    current_utilization_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_allocated_hours DECIMAL(10,2) DEFAULT 0.00,
    
    -- Custom
    notes TEXT,
    custom_fields JSONB,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_type ON project_resources(resource_type);
CREATE INDEX idx_resources_user ON project_resources(user_id);
CREATE INDEX idx_resources_available ON project_resources(is_available);
CREATE INDEX idx_resources_role ON project_resources(role);

-- =============================================
-- 7. PROJECT_RESOURCE_ALLOCATIONS - Resource assignments
-- =============================================
CREATE TABLE project_resource_allocations (
    allocation_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES project_tasks(task_id) ON DELETE CASCADE,
    resource_id INTEGER NOT NULL REFERENCES project_resources(resource_id) ON DELETE CASCADE,
    
    -- Allocation Period
    allocation_start_date DATE NOT NULL,
    allocation_end_date DATE NOT NULL,
    
    -- Allocation Details
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00, -- % of resource capacity
    allocated_hours DECIMAL(10,2) DEFAULT 0.00,
    
    -- Cost
    cost_per_hour DECIMAL(10,2),
    billing_rate_per_hour DECIMAL(10,2),
    
    -- Status
    allocation_status VARCHAR(50) DEFAULT 'planned', -- planned, active, completed, cancelled
    
    -- Role in project
    role_in_project VARCHAR(100),
    
    -- Notes
    notes TEXT,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT valid_allocation_dates CHECK (allocation_end_date >= allocation_start_date),
    CONSTRAINT valid_allocation_percentage CHECK (allocation_percentage > 0 AND allocation_percentage <= 100)
);

CREATE INDEX idx_allocations_project ON project_resource_allocations(project_id);
CREATE INDEX idx_allocations_task ON project_resource_allocations(task_id);
CREATE INDEX idx_allocations_resource ON project_resource_allocations(resource_id);
CREATE INDEX idx_allocations_dates ON project_resource_allocations(allocation_start_date, allocation_end_date);
CREATE INDEX idx_allocations_status ON project_resource_allocations(allocation_status);

-- =============================================
-- 8. PROJECT_TIME_ENTRIES - Time tracking
-- =============================================
CREATE TABLE project_time_entries (
    time_entry_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES project_tasks(task_id) ON DELETE SET NULL,
    phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    
    -- Resource/User
    user_id INTEGER NOT NULL,
    resource_id INTEGER REFERENCES project_resources(resource_id) ON DELETE SET NULL,
    
    -- Time Details
    entry_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_worked DECIMAL(10,2) NOT NULL CHECK (hours_worked > 0),
    
    -- Billing
    is_billable BOOLEAN DEFAULT TRUE,
    billing_rate DECIMAL(10,2),
    billable_amount DECIMAL(10,2) GENERATED ALWAYS AS (hours_worked * COALESCE(billing_rate, 0)) STORED,
    
    -- Invoice
    is_invoiced BOOLEAN DEFAULT FALSE,
    invoice_id INTEGER, -- Reference to invoice if exists
    invoiced_at TIMESTAMP,
    
    -- Description
    work_description TEXT NOT NULL,
    
    -- Activity Type
    activity_type VARCHAR(50), -- development, design, testing, meeting, documentation, review, etc.
    
    -- Approval
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Location
    work_location VARCHAR(100), -- office, remote, client_site
    
    -- Overtime
    is_overtime BOOLEAN DEFAULT FALSE,
    overtime_multiplier DECIMAL(5,2) DEFAULT 1.00,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_time_entries_project ON project_time_entries(project_id);
CREATE INDEX idx_time_entries_task ON project_time_entries(task_id);
CREATE INDEX idx_time_entries_user ON project_time_entries(user_id);
CREATE INDEX idx_time_entries_date ON project_time_entries(entry_date);
CREATE INDEX idx_time_entries_billable ON project_time_entries(is_billable);
CREATE INDEX idx_time_entries_invoiced ON project_time_entries(is_invoiced);
CREATE INDEX idx_time_entries_approved ON project_time_entries(is_approved);

-- =============================================
-- 9. PROJECT_BUDGETS - Detailed budget tracking
-- =============================================
CREATE TABLE project_budgets (
    budget_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    
    -- Budget Category
    budget_category VARCHAR(100) NOT NULL, -- labor, materials, equipment, software, travel, overhead, etc.
    budget_subcategory VARCHAR(100),
    
    -- Amounts
    budgeted_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    committed_amount DECIMAL(15,2) DEFAULT 0.00, -- Purchase orders issued
    actual_amount DECIMAL(15,2) DEFAULT 0.00, -- Actual spent
    forecasted_amount DECIMAL(15,2) DEFAULT 0.00, -- Projected final cost
    
    -- Variance
    variance_amount DECIMAL(15,2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    variance_percentage DECIMAL(5,2),
    
    -- Period
    budget_period VARCHAR(50), -- total, monthly, quarterly, annual
    period_start_date DATE,
    period_end_date DATE,
    
    -- Notes
    description TEXT,
    notes TEXT,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER
);

CREATE INDEX idx_budgets_project ON project_budgets(project_id);
CREATE INDEX idx_budgets_phase ON project_budgets(phase_id);
CREATE INDEX idx_budgets_category ON project_budgets(budget_category);

-- =============================================
-- 10. PROJECT_EXPENSES - Project expenses
-- =============================================
CREATE TABLE project_expenses (
    expense_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES project_tasks(task_id) ON DELETE SET NULL,
    budget_id INTEGER REFERENCES project_budgets(budget_id) ON DELETE SET NULL,
    
    -- Expense Details
    expense_date DATE NOT NULL,
    expense_category VARCHAR(100) NOT NULL, -- travel, meals, materials, equipment, software, etc.
    expense_description TEXT NOT NULL,
    
    -- Amount
    expense_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Submitted by
    submitted_by INTEGER NOT NULL,
    vendor_name VARCHAR(255),
    
    -- Receipt
    receipt_number VARCHAR(100),
    receipt_url VARCHAR(500), -- Link to receipt image/document
    
    -- Billing
    is_billable BOOLEAN DEFAULT TRUE,
    is_reimbursable BOOLEAN DEFAULT FALSE,
    markup_percentage DECIMAL(5,2) DEFAULT 0.00,
    billable_amount DECIMAL(15,2),
    
    -- Status
    expense_status VARCHAR(50) NOT NULL DEFAULT 'submitted', 
    -- submitted, approved, rejected, reimbursed, invoiced
    
    -- Approval
    approved_by INTEGER,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Reimbursement
    reimbursed_by INTEGER,
    reimbursed_at TIMESTAMP,
    reimbursement_method VARCHAR(50), -- bank_transfer, check, cash, payroll
    
    -- Invoice
    is_invoiced BOOLEAN DEFAULT FALSE,
    invoice_id INTEGER,
    invoiced_at TIMESTAMP,
    
    -- Payment
    payment_method VARCHAR(50), -- credit_card, cash, bank_transfer, company_card
    payment_reference VARCHAR(100),
    
    -- Notes
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_project ON project_expenses(project_id);
CREATE INDEX idx_expenses_task ON project_expenses(task_id);
CREATE INDEX idx_expenses_budget ON project_expenses(budget_id);
CREATE INDEX idx_expenses_submitted_by ON project_expenses(submitted_by);
CREATE INDEX idx_expenses_date ON project_expenses(expense_date);
CREATE INDEX idx_expenses_status ON project_expenses(expense_status);
CREATE INDEX idx_expenses_category ON project_expenses(expense_category);

-- =============================================
-- 11. PROJECT_DOCUMENTS - Document management
-- =============================================
CREATE TABLE project_documents (
    document_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES project_tasks(task_id) ON DELETE SET NULL,
    phase_id INTEGER REFERENCES project_phases(phase_id) ON DELETE SET NULL,
    
    -- Document Details
    document_name VARCHAR(255) NOT NULL,
    document_description TEXT,
    document_type VARCHAR(50), -- contract, specification, design, report, invoice, proposal, etc.
    
    -- File Details
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    file_type VARCHAR(50), -- pdf, docx, xlsx, pptx, jpg, png, etc.
    file_url VARCHAR(500) NOT NULL,
    file_path VARCHAR(500),
    
    -- Version Control
    version VARCHAR(20) DEFAULT '1.0',
    is_latest_version BOOLEAN DEFAULT TRUE,
    previous_version_id INTEGER REFERENCES project_documents(document_id) ON DELETE SET NULL,
    
    -- Classification
    category VARCHAR(100), -- legal, technical, financial, communication, etc.
    tags TEXT[],
    
    -- Access Control
    is_public BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'project_team', -- public, project_team, managers_only, restricted
    
    -- Status
    document_status VARCHAR(50) DEFAULT 'draft', -- draft, in_review, approved, final, archived
    
    -- Approval
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    
    -- Dates
    valid_from DATE,
    valid_until DATE,
    
    -- Audit
    uploaded_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_project ON project_documents(project_id);
CREATE INDEX idx_documents_task ON project_documents(task_id);
CREATE INDEX idx_documents_phase ON project_documents(phase_id);
CREATE INDEX idx_documents_type ON project_documents(document_type);
CREATE INDEX idx_documents_status ON project_documents(document_status);
CREATE INDEX idx_documents_uploaded_by ON project_documents(uploaded_by);

-- =============================================
-- 12. PROJECT_TEAM_MEMBERS - Team composition
-- =============================================
CREATE TABLE project_team_members (
    team_member_id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    resource_id INTEGER REFERENCES project_resources(resource_id) ON DELETE SET NULL,
    
    -- Role in Project
    role VARCHAR(100) NOT NULL, -- project_manager, team_lead, developer, designer, analyst, tester, etc.
    role_description TEXT,
    
    -- Permissions
    permission_level VARCHAR(50) DEFAULT 'member', -- owner, admin, manager, member, viewer
    can_edit_project BOOLEAN DEFAULT FALSE,
    can_approve_time BOOLEAN DEFAULT FALSE,
    can_approve_expenses BOOLEAN DEFAULT FALSE,
    can_manage_budget BOOLEAN DEFAULT FALSE,
    can_assign_tasks BOOLEAN DEFAULT FALSE,
    
    -- Timeline
    joined_date DATE NOT NULL DEFAULT CURRENT_DATE,
    left_date DATE,
    
    -- Allocation
    allocation_percentage DECIMAL(5,2) DEFAULT 100.00,
    estimated_hours DECIMAL(10,2),
    
    -- Billing
    hourly_rate DECIMAL(10,2),
    billing_rate DECIMAL(10,2),
    
    -- Contact
    is_primary_contact BOOLEAN DEFAULT FALSE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    
    -- Status
    member_status VARCHAR(50) DEFAULT 'active', -- active, inactive, on_leave
    
    -- Notes
    notes TEXT,
    
    -- Audit
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    
    CONSTRAINT unique_project_user UNIQUE(project_id, user_id)
);

CREATE INDEX idx_team_members_project ON project_team_members(project_id);
CREATE INDEX idx_team_members_user ON project_team_members(user_id);
CREATE INDEX idx_team_members_role ON project_team_members(role);
CREATE INDEX idx_team_members_status ON project_team_members(member_status);

-- =============================================
-- 13. PROJECT_TASK_COMMENTS - Task discussions
-- =============================================
CREATE TABLE project_task_comments (
    comment_id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES project_tasks(task_id) ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES project_task_comments(comment_id) ON DELETE CASCADE,
    
    -- Comment Details
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(50) DEFAULT 'comment', -- comment, status_update, question, solution
    
    -- Mentioned Users
    mentioned_users INTEGER[], -- Array of user_ids
    
    -- Attachments
    attachments JSONB, -- Array of attachment objects
    
    -- Audit
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_comments_task ON project_task_comments(task_id);
CREATE INDEX idx_comments_parent ON project_task_comments(parent_comment_id);
CREATE INDEX idx_comments_created_by ON project_task_comments(created_by);

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger 1: Update project completion percentage based on tasks
CREATE OR REPLACE FUNCTION update_project_completion()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects p
    SET 
        completion_percentage = (
            SELECT COALESCE(AVG(completion_percentage), 0)
            FROM project_tasks
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND is_active = TRUE
        ),
        tasks_total = (
            SELECT COUNT(*)
            FROM project_tasks
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND is_active = TRUE
        ),
        tasks_completed = (
            SELECT COUNT(*)
            FROM project_tasks
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND task_status = 'completed'
            AND is_active = TRUE
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_completion
AFTER INSERT OR UPDATE OR DELETE ON project_tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_completion();

-- Trigger 2: Update project actual cost from time entries and expenses
CREATE OR REPLACE FUNCTION update_project_costs()
RETURNS TRIGGER AS $$
DECLARE
    v_project_id INTEGER;
BEGIN
    -- Get project_id from the affected record
    v_project_id := COALESCE(NEW.project_id, OLD.project_id);
    
    UPDATE projects
    SET 
        actual_cost = (
            -- Time entry costs
            SELECT COALESCE(SUM(billable_amount), 0)
            FROM project_time_entries
            WHERE project_id = v_project_id
        ) + (
            -- Expense costs
            SELECT COALESCE(SUM(expense_amount), 0)
            FROM project_expenses
            WHERE project_id = v_project_id
            AND expense_status = 'approved'
        ),
        total_hours_logged = (
            SELECT COALESCE(SUM(hours_worked), 0)
            FROM project_time_entries
            WHERE project_id = v_project_id
        ),
        billable_hours = (
            SELECT COALESCE(SUM(hours_worked), 0)
            FROM project_time_entries
            WHERE project_id = v_project_id
            AND is_billable = TRUE
        ),
        non_billable_hours = (
            SELECT COALESCE(SUM(hours_worked), 0)
            FROM project_time_entries
            WHERE project_id = v_project_id
            AND is_billable = FALSE
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE project_id = v_project_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_costs_time
AFTER INSERT OR UPDATE OR DELETE ON project_time_entries
FOR EACH ROW
EXECUTE FUNCTION update_project_costs();

CREATE TRIGGER trigger_update_project_costs_expense
AFTER INSERT OR UPDATE OR DELETE ON project_expenses
FOR EACH ROW
EXECUTE FUNCTION update_project_costs();

-- Trigger 3: Update task actual hours from time entries
CREATE OR REPLACE FUNCTION update_task_hours()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE project_tasks
    SET 
        actual_hours = (
            SELECT COALESCE(SUM(hours_worked), 0)
            FROM project_time_entries
            WHERE task_id = COALESCE(NEW.task_id, OLD.task_id)
        ),
        remaining_hours = GREATEST(
            estimated_hours - (
                SELECT COALESCE(SUM(hours_worked), 0)
                FROM project_time_entries
                WHERE task_id = COALESCE(NEW.task_id, OLD.task_id)
            ), 
            0
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE task_id = COALESCE(NEW.task_id, OLD.task_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_task_hours
AFTER INSERT OR UPDATE OR DELETE ON project_time_entries
FOR EACH ROW
WHEN (NEW.task_id IS NOT NULL OR OLD.task_id IS NOT NULL)
EXECUTE FUNCTION update_task_hours();

-- Trigger 4: Update timestamps
CREATE OR REPLACE FUNCTION update_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_projects_updated
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_project_timestamp();

CREATE TRIGGER trigger_phases_updated
BEFORE UPDATE ON project_phases
FOR EACH ROW
EXECUTE FUNCTION update_project_timestamp();

CREATE TRIGGER trigger_tasks_updated
BEFORE UPDATE ON project_tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_timestamp();

-- Trigger 5: Update team size
CREATE OR REPLACE FUNCTION update_team_size()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET 
        team_size = (
            SELECT COUNT(*)
            FROM project_team_members
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND is_active = TRUE
            AND member_status = 'active'
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_size
AFTER INSERT OR UPDATE OR DELETE ON project_team_members
FOR EACH ROW
EXECUTE FUNCTION update_team_size();

-- =============================================
-- VIEWS
-- =============================================

-- View 1: Project Dashboard Summary
CREATE VIEW project_dashboard_summary AS
SELECT 
    p.project_id,
    p.project_code,
    p.project_name,
    p.project_type,
    p.project_status,
    p.health_status,
    p.completion_percentage,
    p.planned_start_date,
    p.planned_end_date,
    p.actual_start_date,
    p.budget_amount,
    p.actual_cost,
    p.budget_variance,
    p.total_hours_logged,
    p.billable_hours,
    p.team_size,
    p.tasks_total,
    p.tasks_completed,
    c.customer_name,
    pm.full_name as project_manager_name,
    -- Progress metrics
    CASE 
        WHEN p.planned_end_date < CURRENT_DATE AND p.project_status != 'completed' THEN 'overdue'
        WHEN p.planned_end_date - CURRENT_DATE <= 7 AND p.project_status = 'active' THEN 'due_soon'
        ELSE 'on_schedule'
    END as schedule_status,
    -- Budget metrics
    CASE 
        WHEN p.actual_cost > p.budget_amount THEN 'over_budget'
        WHEN p.actual_cost > p.budget_amount * 0.9 THEN 'near_budget'
        ELSE 'within_budget'
    END as budget_status,
    -- Task metrics
    (p.tasks_total - p.tasks_completed) as tasks_remaining,
    CASE 
        WHEN p.tasks_total > 0 THEN ROUND((p.tasks_completed::DECIMAL / p.tasks_total * 100), 2)
        ELSE 0
    END as task_completion_rate
FROM projects p
LEFT JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN users pm ON p.project_manager_id = pm.user_id
WHERE p.is_active = TRUE;

-- View 2: Project Task Timeline (for Gantt charts)
CREATE VIEW project_task_timeline AS
SELECT 
    t.task_id,
    t.project_id,
    p.project_name,
    t.task_name,
    t.task_status,
    t.planned_start_date,
    t.planned_end_date,
    t.actual_start_date,
    t.actual_end_date,
    t.completion_percentage,
    t.assigned_to,
    u.full_name as assigned_to_name,
    t.parent_task_id,
    t.estimated_hours,
    t.actual_hours,
    ph.phase_name,
    -- Dependencies
    (
        SELECT json_agg(json_build_object(
            'depends_on_task_id', depends_on_task_id,
            'dependency_type', dependency_type,
            'lag_days', lag_days
        ))
        FROM project_task_dependencies
        WHERE task_id = t.task_id
    ) as dependencies,
    -- Duration in days
    CASE 
        WHEN t.planned_start_date IS NOT NULL AND t.planned_end_date IS NOT NULL 
        THEN t.planned_end_date - t.planned_start_date + 1
        ELSE NULL
    END as planned_duration_days,
    -- Progress indicator
    CASE 
        WHEN t.task_status = 'completed' THEN 'completed'
        WHEN t.planned_end_date < CURRENT_DATE THEN 'overdue'
        WHEN t.planned_start_date > CURRENT_DATE THEN 'upcoming'
        ELSE 'in_progress'
    END as timeline_status
FROM project_tasks t
JOIN projects p ON t.project_id = p.project_id
LEFT JOIN users u ON t.assigned_to = u.user_id
LEFT JOIN project_phases ph ON t.phase_id = ph.phase_id
WHERE t.is_active = TRUE
ORDER BY t.project_id, t.planned_start_date;

-- View 3: Resource Utilization
CREATE VIEW project_resource_utilization AS
SELECT 
    r.resource_id,
    r.resource_name,
    r.resource_type,
    r.role,
    r.daily_capacity_hours,
    r.weekly_capacity_hours,
    r.cost_per_hour,
    r.billing_rate_per_hour,
    -- Current allocations
    COUNT(DISTINCT ra.project_id) as active_projects,
    SUM(ra.allocated_hours) as total_allocated_hours,
    SUM(ra.allocation_percentage) as total_allocation_percentage,
    -- Time logged
    (
        SELECT COALESCE(SUM(hours_worked), 0)
        FROM project_time_entries te
        WHERE te.resource_id = r.resource_id
        AND te.entry_date >= CURRENT_DATE - INTERVAL '30 days'
    ) as hours_logged_last_30_days,
    -- Revenue
    (
        SELECT COALESCE(SUM(billable_amount), 0)
        FROM project_time_entries te
        WHERE te.resource_id = r.resource_id
        AND te.is_billable = TRUE
        AND te.entry_date >= CURRENT_DATE - INTERVAL '30 days'
    ) as revenue_last_30_days,
    -- Utilization calculation
    CASE 
        WHEN r.weekly_capacity_hours > 0 THEN
            ROUND((
                (SELECT COALESCE(SUM(hours_worked), 0)
                FROM project_time_entries te
                WHERE te.resource_id = r.resource_id
                AND te.entry_date >= CURRENT_DATE - INTERVAL '7 days')
                / (r.weekly_capacity_hours) * 100
            ), 2)
        ELSE 0
    END as weekly_utilization_percentage,
    -- Availability status
    CASE 
        WHEN r.is_available = FALSE THEN 'unavailable'
        WHEN SUM(ra.allocation_percentage) >= 100 THEN 'fully_allocated'
        WHEN SUM(ra.allocation_percentage) >= 80 THEN 'mostly_allocated'
        ELSE 'available'
    END as availability_status
FROM project_resources r
LEFT JOIN project_resource_allocations ra ON r.resource_id = ra.resource_id
    AND ra.allocation_status = 'active'
    AND ra.allocation_start_date <= CURRENT_DATE
    AND ra.allocation_end_date >= CURRENT_DATE
WHERE r.is_active = TRUE
GROUP BY r.resource_id, r.resource_name, r.resource_type, r.role, 
    r.daily_capacity_hours, r.weekly_capacity_hours, r.cost_per_hour, r.billing_rate_per_hour;

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Sample Projects
INSERT INTO projects (
    project_code, project_name, project_description, project_type, project_category,
    project_manager_id, planned_start_date, planned_end_date, project_status,
    budget_amount, billing_type, priority, is_active, created_by
) VALUES
('PROJ-2024-001', 'ERP System Enhancement', 'Upgrade ERP system with new modules', 'internal', 'software', 
 1, '2024-12-01', '2025-03-31', 'active', 150000.00, 'fixed_price', 'high', TRUE, 1),
('PROJ-2024-002', 'Website Redesign - Client A', 'Complete website redesign and development', 'client', 'web_development',
 1, '2024-12-15', '2025-02-28', 'planning', 75000.00, 'time_and_material', 'medium', TRUE, 1),
('PROJ-2024-003', 'Mobile App Development', 'iOS and Android mobile application', 'client', 'mobile_development',
 1, '2025-01-01', '2025-06-30', 'planning', 200000.00, 'milestone_based', 'high', TRUE, 1);

-- Sample Resources
INSERT INTO project_resources (
    resource_type, resource_name, resource_code, user_id, role,
    daily_capacity_hours, weekly_capacity_hours, cost_per_hour, billing_rate_per_hour,
    is_available, created_at
) VALUES
('human', 'John Smith', 'RES-001', 1, 'Senior Developer', 8.00, 40.00, 50.00, 150.00, TRUE, CURRENT_TIMESTAMP),
('human', 'Sarah Johnson', 'RES-002', 2, 'UI/UX Designer', 8.00, 40.00, 45.00, 120.00, TRUE, CURRENT_TIMESTAMP),
('human', 'Mike Chen', 'RES-003', 1, 'Project Manager', 8.00, 40.00, 60.00, 180.00, TRUE, CURRENT_TIMESTAMP),
('equipment', 'Development Server', 'RES-004', NULL, NULL, NULL, NULL, 5.00, 10.00, TRUE, CURRENT_TIMESTAMP);

-- Sample Phases for Project 1
INSERT INTO project_phases (
    project_id, phase_name, phase_description, phase_order,
    planned_start_date, planned_end_date, phase_status, phase_budget
) VALUES
(1, 'Planning & Requirements', 'Gather requirements and create project plan', 1, '2024-12-01', '2024-12-15', 'in_progress', 20000.00),
(1, 'Design', 'System design and architecture', 2, '2024-12-16', '2025-01-15', 'not_started', 30000.00),
(1, 'Development', 'Core development phase', 3, '2025-01-16', '2025-03-15', 'not_started', 80000.00),
(1, 'Testing & Deployment', 'QA testing and production deployment', 4, '2025-03-16', '2025-03-31', 'not_started', 20000.00);

-- Sample Milestones
INSERT INTO project_milestones (
    project_id, phase_id, milestone_name, milestone_description,
    planned_date, milestone_status, is_payment_milestone, payment_percentage
) VALUES
(1, 1, 'Requirements Signed Off', 'Client approval of requirements document', '2024-12-15', 'pending', TRUE, 25.00),
(1, 2, 'Design Approved', 'Design mockups and architecture approved', '2025-01-15', 'pending', TRUE, 25.00),
(1, 3, 'Development Complete', 'All features developed and ready for testing', '2025-03-15', 'pending', TRUE, 30.00),
(1, 4, 'Go Live', 'System deployed to production', '2025-03-31', 'pending', TRUE, 20.00);

-- Sample Tasks
INSERT INTO project_tasks (
    project_id, phase_id, task_name, task_description, assigned_to,
    planned_start_date, planned_end_date, estimated_hours, task_status,
    priority, task_type, is_billable, completion_percentage, created_by
) VALUES
(1, 1, 'Requirements Gathering', 'Conduct stakeholder interviews and document requirements', 1,
 '2024-12-01', '2024-12-05', 40.00, 'in_progress', 'high', 'task', TRUE, 60.00, 1),
(1, 1, 'Create Project Plan', 'Develop detailed project plan and timeline', 1,
 '2024-12-06', '2024-12-10', 20.00, 'todo', 'high', 'task', TRUE, 0.00, 1),
(1, 1, 'Risk Assessment', 'Identify and document project risks', 1,
 '2024-12-11', '2024-12-15', 16.00, 'todo', 'medium', 'task', TRUE, 0.00, 1);

-- Sample Team Members
INSERT INTO project_team_members (
    project_id, user_id, resource_id, role, permission_level,
    can_edit_project, can_approve_time, allocation_percentage, hourly_rate, billing_rate, created_by
) VALUES
(1, 1, 3, 'Project Manager', 'manager', TRUE, TRUE, 50.00, 60.00, 180.00, 1),
(1, 1, 1, 'Lead Developer', 'member', FALSE, FALSE, 100.00, 50.00, 150.00, 1),
(1, 2, 2, 'UI/UX Designer', 'member', FALSE, FALSE, 75.00, 45.00, 120.00, 1);

-- Sample Time Entries
INSERT INTO project_time_entries (
    project_id, task_id, user_id, resource_id, entry_date,
    hours_worked, is_billable, billing_rate, work_description,
    activity_type, is_approved, created_by
) VALUES
(1, 1, 1, 1, '2024-12-02', 8.00, TRUE, 150.00, 'Conducted stakeholder interviews', 'meeting', TRUE, 1),
(1, 1, 1, 1, '2024-12-03', 6.50, TRUE, 150.00, 'Documented functional requirements', 'documentation', TRUE, 1),
(1, 1, 1, 1, '2024-12-04', 7.00, TRUE, 150.00, 'Created user stories and acceptance criteria', 'documentation', FALSE, 1);

-- Sample Budgets
INSERT INTO project_budgets (
    project_id, budget_category, budget_subcategory,
    budgeted_amount, actual_amount, forecasted_amount, created_by
) VALUES
(1, 'Labor', 'Development', 100000.00, 3225.00, 98000.00, 1),
(1, 'Labor', 'Design', 30000.00, 0.00, 28000.00, 1),
(1, 'Software', 'Licenses', 15000.00, 0.00, 15000.00, 1),
(1, 'Infrastructure', 'Cloud Hosting', 5000.00, 0.00, 4500.00, 1);

-- Sample Expenses
INSERT INTO project_expenses (
    project_id, expense_date, expense_category, expense_description,
    expense_amount, submitted_by, is_billable, expense_status, approved_by
) VALUES
(1, '2024-12-03', 'Software', 'Development tools subscription', 299.99, 1, TRUE, 'approved', 1),
(1, '2024-12-04', 'Travel', 'Client meeting travel expenses', 450.00, 1, TRUE, 'approved', 1);

-- Sample Documents
INSERT INTO project_documents (
    project_id, phase_id, document_name, document_description, document_type,
    file_name, file_type, file_url, version, document_status, uploaded_by
) VALUES
(1, 1, 'Requirements Specification', 'Functional and non-functional requirements', 'specification',
 'requirements_v1.pdf', 'pdf', '/documents/proj-001/requirements_v1.pdf', '1.0', 'draft', 1),
(1, 1, 'Project Charter', 'Project charter and stakeholder agreement', 'contract',
 'charter_v1.pdf', 'pdf', '/documents/proj-001/charter_v1.pdf', '1.0', 'approved', 1);

-- =============================================
-- GRANT PERMISSIONS (if needed)
-- =============================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO erp_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO erp_user;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Project Management System Installation Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables Created: 13';
    RAISE NOTICE '  - projects';
    RAISE NOTICE '  - project_phases';
    RAISE NOTICE '  - project_milestones';
    RAISE NOTICE '  - project_tasks';
    RAISE NOTICE '  - project_task_dependencies';
    RAISE NOTICE '  - project_resources';
    RAISE NOTICE '  - project_resource_allocations';
    RAISE NOTICE '  - project_time_entries';
    RAISE NOTICE '  - project_budgets';
    RAISE NOTICE '  - project_expenses';
    RAISE NOTICE '  - project_documents';
    RAISE NOTICE '  - project_team_members';
    RAISE NOTICE '  - project_task_comments';
    RAISE NOTICE '';
    RAISE NOTICE 'Triggers Created: 5';
    RAISE NOTICE '  - Project completion percentage calculation';
    RAISE NOTICE '  - Project cost tracking';
    RAISE NOTICE '  - Task hours tracking';
    RAISE NOTICE '  - Timestamp updates';
    RAISE NOTICE '  - Team size updates';
    RAISE NOTICE '';
    RAISE NOTICE 'Views Created: 3';
    RAISE NOTICE '  - project_dashboard_summary';
    RAISE NOTICE '  - project_task_timeline';
    RAISE NOTICE '  - project_resource_utilization';
    RAISE NOTICE '';
    RAISE NOTICE 'Sample Data: 25+ records loaded';
    RAISE NOTICE '  - 3 projects';
    RAISE NOTICE '  - 4 resources';
    RAISE NOTICE '  - 4 phases';
    RAISE NOTICE '  - 4 milestones';
    RAISE NOTICE '  - 3 tasks';
    RAISE NOTICE '  - 3 team members';
    RAISE NOTICE '  - 3 time entries';
    RAISE NOTICE '  - 4 budgets';
    RAISE NOTICE '  - 2 expenses';
    RAISE NOTICE '  - 2 documents';
    RAISE NOTICE '==============================================';
END $$;
