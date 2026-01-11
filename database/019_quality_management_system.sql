-- =====================================================
-- Phase 3: Quality Management System Database Schema
-- =====================================================
-- Created: December 2, 2025
-- Purpose: Quality control, compliance, and NCR/CAPA tracking
-- Tables: 23 new tables for comprehensive quality management

-- =====================================================
-- 1. NCR (Non-Conformance Report) System
-- =====================================================

-- NCR Headers
CREATE TABLE IF NOT EXISTS ncrs (
    id SERIAL PRIMARY KEY,
    ncr_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    ncr_type VARCHAR(50) NOT NULL, -- 'internal', 'supplier', 'customer', 'audit'
    severity VARCHAR(20) NOT NULL, -- 'critical', 'major', 'minor'
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'investigating', 'capa_required', 'closed', 'cancelled'
    
    -- Detection info
    detected_by INTEGER, -- FK to users
    detected_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detection_method VARCHAR(100), -- 'inspection', 'customer_complaint', 'internal_audit', 'production'
    
    -- Product/Process info
    product_id INTEGER, -- FK to products (optional)
    work_order_id INTEGER, -- FK to work_orders (optional)
    supplier_id INTEGER, -- FK to suppliers (optional)
    customer_id INTEGER, -- FK to customers (optional)
    
    -- Containment
    containment_action TEXT,
    containment_date TIMESTAMP,
    
    -- Disposition
    disposition VARCHAR(50), -- 'scrap', 'rework', 'use_as_is', 'return_to_supplier'
    quantity_affected DECIMAL(15,3),
    cost_impact DECIMAL(15,2),
    
    -- Workflow
    assigned_to INTEGER, -- FK to users
    reviewed_by INTEGER, -- FK to users
    approved_by INTEGER, -- FK to users
    approved_date TIMESTAMP,
    closed_by INTEGER, -- FK to users
    closed_date TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_ncr_severity CHECK (severity IN ('critical', 'major', 'minor')),
    CONSTRAINT chk_ncr_status CHECK (status IN ('open', 'investigating', 'capa_required', 'closed', 'cancelled')),
    CONSTRAINT chk_ncr_type CHECK (ncr_type IN ('internal', 'supplier', 'customer', 'audit'))
);

-- NCR Details (for multiple defects in one NCR)
CREATE TABLE IF NOT EXISTS ncr_details (
    id SERIAL PRIMARY KEY,
    ncr_id INTEGER NOT NULL REFERENCES ncrs(id) ON DELETE CASCADE,
    defect_description TEXT NOT NULL,
    defect_category VARCHAR(100), -- 'dimensional', 'cosmetic', 'functional', 'documentation', 'packaging'
    location VARCHAR(255), -- Where the defect was found
    quantity_defective DECIMAL(15,3),
    images JSONB, -- Array of image URLs
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Root Cause Analysis (5 Whys)
CREATE TABLE IF NOT EXISTS ncr_root_causes (
    id SERIAL PRIMARY KEY,
    ncr_id INTEGER NOT NULL REFERENCES ncrs(id) ON DELETE CASCADE,
    why_level INTEGER NOT NULL, -- 1 to 5 (or more)
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_root_cause BOOLEAN DEFAULT false,
    
    -- Root cause categories (Fishbone/Ishikawa)
    category VARCHAR(50), -- 'man', 'machine', 'material', 'method', 'measurement', 'environment'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_why_level CHECK (why_level >= 1 AND why_level <= 10)
);

-- NCR Corrective Actions
CREATE TABLE IF NOT EXISTS ncr_actions (
    id SERIAL PRIMARY KEY,
    ncr_id INTEGER NOT NULL REFERENCES ncrs(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'immediate', 'corrective', 'preventive'
    description TEXT NOT NULL,
    assigned_to INTEGER NOT NULL, -- FK to users
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'verified'
    
    completed_date TIMESTAMP,
    completed_by INTEGER,
    verification_notes TEXT,
    verified_by INTEGER,
    verified_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_action_type CHECK (action_type IN ('immediate', 'corrective', 'preventive')),
    CONSTRAINT chk_action_status CHECK (status IN ('pending', 'in_progress', 'completed', 'verified'))
);

-- =====================================================
-- 2. CAPA (Corrective and Preventive Action) System
-- =====================================================

-- CAPA Headers
CREATE TABLE IF NOT EXISTS capas (
    id SERIAL PRIMARY KEY,
    capa_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    capa_type VARCHAR(20) NOT NULL, -- 'corrective', 'preventive'
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'critical', 'high', 'medium', 'low'
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'pending_verification', 'verified', 'closed', 'cancelled'
    
    -- Origin
    source VARCHAR(50), -- 'ncr', 'audit', 'customer_complaint', 'management_review', 'trend_analysis'
    source_reference VARCHAR(100), -- Link to source (e.g., NCR number)
    ncr_id INTEGER REFERENCES ncrs(id), -- Optional direct link
    
    -- Problem statement
    problem_statement TEXT NOT NULL,
    
    -- Root cause
    root_cause TEXT,
    root_cause_analysis_method VARCHAR(50), -- '5_whys', 'fishbone', 'fmea', 'fault_tree'
    
    -- Workflow
    assigned_to INTEGER NOT NULL, -- FK to users
    due_date DATE NOT NULL,
    extended_due_date DATE,
    extension_reason TEXT,
    
    -- Closure
    effectiveness_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    verified_by INTEGER, -- FK to users
    verification_notes TEXT,
    
    closed_by INTEGER,
    closed_date TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_capa_type CHECK (capa_type IN ('corrective', 'preventive')),
    CONSTRAINT chk_capa_priority CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT chk_capa_status CHECK (status IN ('open', 'in_progress', 'pending_verification', 'verified', 'closed', 'cancelled'))
);

-- CAPA Action Items
CREATE TABLE IF NOT EXISTS capa_actions (
    id SERIAL PRIMARY KEY,
    capa_id INTEGER NOT NULL REFERENCES capas(id) ON DELETE CASCADE,
    action_sequence INTEGER NOT NULL,
    action_description TEXT NOT NULL,
    responsible_person INTEGER NOT NULL, -- FK to users
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'blocked'
    
    completion_date TIMESTAMP,
    completion_notes TEXT,
    evidence JSONB, -- Links to documents, photos, etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_capa_action_status CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked'))
);

-- CAPA Effectiveness Verification
CREATE TABLE IF NOT EXISTS capa_verifications (
    id SERIAL PRIMARY KEY,
    capa_id INTEGER NOT NULL REFERENCES capas(id) ON DELETE CASCADE,
    verification_date DATE NOT NULL,
    verification_method VARCHAR(100), -- 'audit', 'inspection', 'data_analysis', 'review'
    
    -- Metrics before/after
    metric_name VARCHAR(100),
    baseline_value DECIMAL(15,3),
    current_value DECIMAL(15,3),
    target_value DECIMAL(15,3),
    
    is_effective BOOLEAN NOT NULL,
    findings TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    
    verified_by INTEGER NOT NULL, -- FK to users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. Digital Inspection System
-- =====================================================

-- Inspection Templates
CREATE TABLE IF NOT EXISTS inspection_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    inspection_type VARCHAR(50), -- 'incoming', 'in_process', 'final', 'first_article'
    
    product_id INTEGER, -- FK to products (optional - for product-specific templates)
    workstation_id UUID, -- FK to workstations (optional)
    
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL
);

-- Inspection Template Items
CREATE TABLE IF NOT EXISTS inspection_items (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES inspection_templates(id) ON DELETE CASCADE,
    item_sequence INTEGER NOT NULL,
    
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    inspection_method VARCHAR(100), -- 'visual', 'measurement', 'functional_test', 'go_no_go'
    
    -- For measurements
    measurement_type VARCHAR(50), -- 'dimension', 'weight', 'temperature', 'pressure', etc.
    unit_of_measure VARCHAR(20),
    nominal_value DECIMAL(15,6),
    upper_tolerance DECIMAL(15,6),
    lower_tolerance DECIMAL(15,6),
    
    -- For pass/fail
    acceptance_criteria TEXT,
    
    is_critical BOOLEAN DEFAULT false,
    is_required BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inspection Records
CREATE TABLE IF NOT EXISTS inspections (
    id SERIAL PRIMARY KEY,
    inspection_number VARCHAR(50) UNIQUE NOT NULL,
    template_id INTEGER NOT NULL REFERENCES inspection_templates(id),
    
    -- What is being inspected
    work_order_id INTEGER, -- FK to work_orders (optional)
    product_id INTEGER, -- FK to products
    lot_number VARCHAR(100),
    quantity_inspected DECIMAL(15,3) NOT NULL,
    
    -- Inspection details
    inspection_type VARCHAR(50), -- 'incoming', 'in_process', 'final', 'first_article'
    inspection_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    inspector_id INTEGER NOT NULL, -- FK to users
    
    -- Results
    overall_result VARCHAR(20) NOT NULL, -- 'pass', 'fail', 'conditional'
    quantity_accepted DECIMAL(15,3),
    quantity_rejected DECIMAL(15,3),
    
    -- Failure handling
    ncr_created BOOLEAN DEFAULT false,
    ncr_id INTEGER REFERENCES ncrs(id),
    
    notes TEXT,
    attachments JSONB, -- Photos, documents
    
    -- Approval
    approved_by INTEGER, -- FK to users
    approved_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_inspection_result CHECK (overall_result IN ('pass', 'fail', 'conditional'))
);

-- Inspection Results (line items)
CREATE TABLE IF NOT EXISTS inspection_results (
    id SERIAL PRIMARY KEY,
    inspection_id INTEGER NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    inspection_item_id INTEGER NOT NULL REFERENCES inspection_items(id),
    
    -- Measurement or pass/fail
    measured_value DECIMAL(15,6),
    result VARCHAR(20) NOT NULL, -- 'pass', 'fail', 'na'
    
    notes TEXT,
    images JSONB, -- Array of image URLs for defects
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_result CHECK (result IN ('pass', 'fail', 'na'))
);

-- =====================================================
-- 4. SPC (Statistical Process Control) System
-- =====================================================

-- SPC Chart Definitions
CREATE TABLE IF NOT EXISTS spc_charts (
    id SERIAL PRIMARY KEY,
    chart_name VARCHAR(255) NOT NULL,
    chart_code VARCHAR(50) UNIQUE NOT NULL,
    chart_type VARCHAR(50) NOT NULL, -- 'xbar_r', 'xbar_s', 'individuals', 'p_chart', 'c_chart', 'u_chart'
    
    -- What is being measured
    process_name VARCHAR(255) NOT NULL,
    characteristic VARCHAR(255) NOT NULL, -- What characteristic (e.g., "shaft diameter", "cycle time")
    unit_of_measure VARCHAR(20),
    
    product_id INTEGER, -- FK to products (optional)
    workstation_id UUID, -- FK to workstations (optional)
    
    -- Control limits
    target_value DECIMAL(15,6),
    ucl DECIMAL(15,6), -- Upper Control Limit
    lcl DECIMAL(15,6), -- Lower Control Limit
    usl DECIMAL(15,6), -- Upper Specification Limit
    lsl DECIMAL(15,6), -- Lower Specification Limit
    
    -- Sample size
    sample_size INTEGER DEFAULT 5,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_calculated_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_chart_type CHECK (chart_type IN ('xbar_r', 'xbar_s', 'individuals', 'p_chart', 'c_chart', 'u_chart'))
);

-- SPC Measurements
CREATE TABLE IF NOT EXISTS spc_measurements (
    id SERIAL PRIMARY KEY,
    chart_id INTEGER NOT NULL REFERENCES spc_charts(id) ON DELETE CASCADE,
    
    measurement_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sample_number INTEGER NOT NULL,
    subgroup_number INTEGER, -- For grouped data
    
    -- Values
    measured_value DECIMAL(15,6) NOT NULL,
    
    -- Additional data for range charts
    sample_values JSONB, -- Array of individual measurements if applicable
    sample_range DECIMAL(15,6),
    sample_mean DECIMAL(15,6),
    sample_std_dev DECIMAL(15,6),
    
    -- Who measured
    measured_by INTEGER NOT NULL, -- FK to users
    
    -- Out of control flags
    is_out_of_control BOOLEAN DEFAULT false,
    violation_rules TEXT[], -- Array of rule numbers that were violated
    
    -- Context
    work_order_id INTEGER, -- FK to work_orders (optional)
    lot_number VARCHAR(100),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SPC Control Rules
CREATE TABLE IF NOT EXISTS spc_rules (
    id SERIAL PRIMARY KEY,
    rule_number INTEGER NOT NULL UNIQUE,
    rule_name VARCHAR(255) NOT NULL,
    rule_description TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    
    -- Examples:
    -- Rule 1: One point beyond 3 sigma
    -- Rule 2: Nine points in a row on same side of center
    -- Rule 3: Six points in a row, all increasing or decreasing
    -- Rule 4: Fourteen points in a row, alternating up and down
    -- Rule 5: Two out of three points beyond 2 sigma
    -- Rule 6: Four out of five points beyond 1 sigma
    -- Rule 7: Fifteen points in a row within 1 sigma
    -- Rule 8: Eight points in a row beyond 1 sigma
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed SPC Rules
INSERT INTO spc_rules (rule_number, rule_name, rule_description) VALUES
(1, 'Beyond 3 Sigma', 'One point beyond 3 standard deviations from the mean'),
(2, 'Nine Points Same Side', 'Nine consecutive points on the same side of the center line'),
(3, 'Six Points Trending', 'Six consecutive points all increasing or all decreasing'),
(4, 'Fourteen Alternating', 'Fourteen consecutive points alternating up and down'),
(5, 'Two of Three Beyond 2 Sigma', 'Two out of three consecutive points beyond 2 standard deviations'),
(6, 'Four of Five Beyond 1 Sigma', 'Four out of five consecutive points beyond 1 standard deviation'),
(7, 'Fifteen Within 1 Sigma', 'Fifteen consecutive points within 1 standard deviation (too stable)'),
(8, 'Eight Beyond 1 Sigma', 'Eight consecutive points beyond 1 standard deviation on either side')
ON CONFLICT (rule_number) DO NOTHING;

-- =====================================================
-- 5. Supplier Quality Management
-- =====================================================

-- Supplier Quality Ratings
CREATE TABLE IF NOT EXISTS supplier_quality_ratings (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL, -- FK to suppliers
    rating_period_start DATE NOT NULL,
    rating_period_end DATE NOT NULL,
    
    -- Quality metrics
    ppm_rate DECIMAL(15,3), -- Parts Per Million defect rate
    incoming_inspection_pass_rate DECIMAL(5,2), -- Percentage
    ncr_count INTEGER DEFAULT 0,
    critical_ncr_count INTEGER DEFAULT 0,
    
    -- Delivery metrics
    on_time_delivery_rate DECIMAL(5,2), -- Percentage
    lead_time_variance_days DECIMAL(10,2),
    
    -- Cost metrics
    price_variance_percent DECIMAL(5,2),
    total_cost_impact DECIMAL(15,2), -- From quality issues
    
    -- Service metrics
    responsiveness_score INTEGER, -- 1-10
    communication_score INTEGER, -- 1-10
    
    -- Overall score (weighted)
    overall_score DECIMAL(5,2), -- 0-100
    rating_grade VARCHAR(2), -- 'A+', 'A', 'B', 'C', 'D', 'F'
    
    -- Status
    is_approved_supplier BOOLEAN DEFAULT true,
    requires_improvement_plan BOOLEAN DEFAULT false,
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT uk_supplier_period UNIQUE (supplier_id, rating_period_start, rating_period_end)
);

-- Supplier NCRs (for quick linking)
CREATE TABLE IF NOT EXISTS supplier_ncrs (
    id SERIAL PRIMARY KEY,
    ncr_id INTEGER NOT NULL REFERENCES ncrs(id) ON DELETE CASCADE,
    supplier_id INTEGER NOT NULL, -- FK to suppliers
    
    -- Additional supplier-specific info
    supplier_response TEXT,
    supplier_capa_plan TEXT,
    supplier_capa_due_date DATE,
    supplier_capa_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_ncr_supplier UNIQUE (ncr_id, supplier_id)
);

-- =====================================================
-- 6. Compliance & Standards Management
-- =====================================================

-- Compliance Standards (ISO, FDA, etc.)
CREATE TABLE IF NOT EXISTS compliance_standards (
    id SERIAL PRIMARY KEY,
    standard_code VARCHAR(50) UNIQUE NOT NULL, -- 'ISO_9001_2015', 'ISO_13485_2016', 'FDA_21CFR820'
    standard_name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50),
    effective_date DATE,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed common standards
INSERT INTO compliance_standards (standard_code, standard_name, description, version, effective_date) VALUES
('ISO_9001_2015', 'ISO 9001:2015', 'Quality Management Systems - Requirements', '2015', '2015-09-15'),
('ISO_13485_2016', 'ISO 13485:2016', 'Medical Devices - Quality Management Systems', '2016', '2016-03-01'),
('FDA_21CFR820', 'FDA 21 CFR Part 820', 'Quality System Regulation (Medical Devices)', '2022', '1996-10-07'),
('IATF_16949', 'IATF 16949:2016', 'Automotive Quality Management System', '2016', '2016-10-01')
ON CONFLICT (standard_code) DO NOTHING;

-- Compliance Requirements
CREATE TABLE IF NOT EXISTS compliance_requirements (
    id SERIAL PRIMARY KEY,
    standard_id INTEGER NOT NULL REFERENCES compliance_standards(id) ON DELETE CASCADE,
    requirement_number VARCHAR(50) NOT NULL, -- e.g., "4.1", "7.2.3"
    requirement_title VARCHAR(255) NOT NULL,
    requirement_text TEXT NOT NULL,
    
    category VARCHAR(100), -- 'context', 'leadership', 'planning', 'support', 'operation', 'evaluation', 'improvement'
    is_critical BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uk_standard_req UNIQUE (standard_id, requirement_number)
);

-- Compliance Evidence
CREATE TABLE IF NOT EXISTS compliance_evidence (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER NOT NULL REFERENCES compliance_requirements(id) ON DELETE CASCADE,
    
    evidence_type VARCHAR(50), -- 'document', 'record', 'procedure', 'training', 'audit'
    evidence_title VARCHAR(255) NOT NULL,
    evidence_description TEXT,
    
    document_id INTEGER, -- FK to quality_documents (if applicable)
    file_url VARCHAR(500),
    
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'expired', 'obsolete'
    expiration_date DATE,
    
    uploaded_by INTEGER NOT NULL, -- FK to users
    uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    approved_by INTEGER, -- FK to users
    approved_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Audits
CREATE TABLE IF NOT EXISTS compliance_audits (
    id SERIAL PRIMARY KEY,
    audit_number VARCHAR(50) UNIQUE NOT NULL,
    audit_type VARCHAR(50) NOT NULL, -- 'internal', 'external', 'certification', 'surveillance'
    standard_id INTEGER REFERENCES compliance_standards(id),
    
    audit_title VARCHAR(255) NOT NULL,
    audit_date DATE NOT NULL,
    auditor_name VARCHAR(255),
    auditor_organization VARCHAR(255),
    
    -- Scope
    scope_description TEXT,
    areas_audited TEXT[],
    
    -- Results
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'report_issued'
    overall_result VARCHAR(50), -- 'conforming', 'minor_nc', 'major_nc', 'critical_nc'
    
    findings_count INTEGER DEFAULT 0,
    major_findings INTEGER DEFAULT 0,
    minor_findings INTEGER DEFAULT 0,
    observations INTEGER DEFAULT 0,
    
    -- Report
    report_url VARCHAR(500),
    report_issued_date DATE,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_due_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL
);

-- =====================================================
-- 7. Document Control System
-- =====================================================

-- Quality Documents
CREATE TABLE IF NOT EXISTS quality_documents (
    id SERIAL PRIMARY KEY,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    document_title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'procedure', 'work_instruction', 'form', 'specification', 'policy'
    
    category VARCHAR(100), -- 'quality_manual', 'procedures', 'work_instructions', 'forms', 'specifications'
    
    current_version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'in_review', 'approved', 'obsolete'
    
    -- Owner
    owner_id INTEGER NOT NULL, -- FK to users
    department VARCHAR(100),
    
    -- Dates
    effective_date DATE,
    review_frequency_months INTEGER DEFAULT 12,
    next_review_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    CONSTRAINT chk_doc_type CHECK (document_type IN ('procedure', 'work_instruction', 'form', 'specification', 'policy')),
    CONSTRAINT chk_doc_status CHECK (status IN ('draft', 'in_review', 'approved', 'obsolete'))
);

-- Document Versions
CREATE TABLE IF NOT EXISTS document_versions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES quality_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    
    change_description TEXT NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    file_hash VARCHAR(100), -- SHA-256 for integrity
    
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_approval', 'approved', 'superseded', 'obsolete'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER NOT NULL,
    
    approved_by INTEGER, -- FK to users
    approved_date TIMESTAMP,
    
    superseded_date TIMESTAMP,
    
    CONSTRAINT uk_doc_version UNIQUE (document_id, version_number)
);

-- Document Approvals (for approval workflow)
CREATE TABLE IF NOT EXISTS document_approvals (
    id SERIAL PRIMARY KEY,
    version_id INTEGER NOT NULL REFERENCES document_versions(id) ON DELETE CASCADE,
    
    approver_id INTEGER NOT NULL, -- FK to users
    approver_role VARCHAR(100), -- 'quality_manager', 'engineering_manager', 'executive'
    approval_sequence INTEGER NOT NULL,
    
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    comments TEXT,
    
    approved_date TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_approval_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- NCR indexes
CREATE INDEX IF NOT EXISTS idx_ncrs_status ON ncrs(status);
CREATE INDEX IF NOT EXISTS idx_ncrs_severity ON ncrs(severity);
CREATE INDEX IF NOT EXISTS idx_ncrs_detected_date ON ncrs(detected_date);
CREATE INDEX IF NOT EXISTS idx_ncrs_product ON ncrs(product_id);
CREATE INDEX IF NOT EXISTS idx_ncrs_supplier ON ncrs(supplier_id);
CREATE INDEX IF NOT EXISTS idx_ncrs_assigned ON ncrs(assigned_to);

-- CAPA indexes
CREATE INDEX IF NOT EXISTS idx_capas_status ON capas(status);
CREATE INDEX IF NOT EXISTS idx_capas_priority ON capas(priority);
CREATE INDEX IF NOT EXISTS idx_capas_due_date ON capas(due_date);
CREATE INDEX IF NOT EXISTS idx_capas_assigned ON capas(assigned_to);
CREATE INDEX IF NOT EXISTS idx_capas_ncr ON capas(ncr_id);

-- Inspection indexes
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_inspections_product ON inspections(product_id);
CREATE INDEX IF NOT EXISTS idx_inspections_result ON inspections(overall_result);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector ON inspections(inspector_id);

-- SPC indexes
CREATE INDEX IF NOT EXISTS idx_spc_measurements_chart ON spc_measurements(chart_id, measurement_date);
CREATE INDEX IF NOT EXISTS idx_spc_measurements_ooc ON spc_measurements(is_out_of_control) WHERE is_out_of_control = true;

-- Document indexes
CREATE INDEX IF NOT EXISTS idx_quality_docs_status ON quality_documents(status);
CREATE INDEX IF NOT EXISTS idx_quality_docs_type ON quality_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_doc_versions_doc ON document_versions(document_id, version_number);

-- Compliance indexes
CREATE INDEX IF NOT EXISTS idx_compliance_evidence_req ON compliance_evidence(requirement_id);
CREATE INDEX IF NOT EXISTS idx_compliance_audits_date ON compliance_audits(audit_date);

-- =====================================================
-- Views for Common Queries
-- =====================================================

-- Open NCRs Summary
CREATE OR REPLACE VIEW v_open_ncrs AS
SELECT 
    n.id,
    n.ncr_number,
    n.title,
    n.ncr_type,
    n.severity,
    n.status,
    n.detected_date,
    n.assigned_to,
    COUNT(na.id) AS action_count,
    COUNT(CASE WHEN na.status = 'completed' THEN 1 END) AS completed_actions
FROM ncrs n
LEFT JOIN ncr_actions na ON na.ncr_id = n.id
WHERE n.status NOT IN ('closed', 'cancelled')
GROUP BY n.id;

-- CAPA Dashboard
CREATE OR REPLACE VIEW v_capa_dashboard AS
SELECT 
    c.id,
    c.capa_number,
    c.title,
    c.capa_type,
    c.priority,
    c.status,
    c.due_date,
    c.assigned_to,
    COUNT(ca.id) AS action_count,
    COUNT(CASE WHEN ca.status = 'completed' THEN 1 END) AS completed_actions,
    CASE 
        WHEN c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled') THEN true
        ELSE false
    END AS is_overdue
FROM capas c
LEFT JOIN capa_actions ca ON ca.capa_id = c.id
WHERE c.status NOT IN ('closed', 'cancelled')
GROUP BY c.id;

-- Quality Metrics Summary
CREATE OR REPLACE VIEW v_quality_metrics AS
SELECT 
    COUNT(CASE WHEN n.detected_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS ncrs_last_30_days,
    COUNT(CASE WHEN n.severity = 'critical' AND n.detected_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS critical_ncrs_last_30_days,
    COUNT(CASE WHEN c.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) AS capas_last_30_days,
    COUNT(CASE WHEN c.status = 'open' THEN 1 END) AS open_capas,
    COUNT(CASE WHEN c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled') THEN 1 END) AS overdue_capas
FROM ncrs n
FULL OUTER JOIN capas c ON true;

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE ncrs IS 'Non-Conformance Reports for quality issues';
COMMENT ON TABLE capas IS 'Corrective and Preventive Actions';
COMMENT ON TABLE spc_charts IS 'Statistical Process Control chart definitions';
COMMENT ON TABLE spc_measurements IS 'SPC measurement data points';
COMMENT ON TABLE inspections IS 'Quality inspection records';
COMMENT ON TABLE compliance_standards IS 'ISO and regulatory standards (e.g., ISO 9001, FDA 21 CFR 820)';
COMMENT ON TABLE quality_documents IS 'Controlled quality documents with version control';

-- =====================================================
-- End of Quality Management System Schema
-- =====================================================
