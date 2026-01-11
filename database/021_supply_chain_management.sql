-- =====================================================
-- Phase 4: Supply Chain Optimization - Database Schema
-- =====================================================
-- Created: December 2, 2025
-- Description: Comprehensive supply chain management system
--              Supplier scorecards, RFQs, dynamic reorder points,
--              contract management, procurement workflows
-- =====================================================

-- =====================================================
-- 1. SUPPLIER PERFORMANCE & SCORECARDS
-- =====================================================

-- Supplier scorecard criteria
CREATE TABLE IF NOT EXISTS supplier_scorecard_criteria (
    id SERIAL PRIMARY KEY,
    criteria_name VARCHAR(100) NOT NULL,
    criteria_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    weight NUMERIC(5,2) NOT NULL DEFAULT 20.00, -- Percentage weight
    calculation_method VARCHAR(50), -- 'automatic', 'manual', 'formula'
    formula TEXT, -- SQL formula for automatic calculation
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE supplier_scorecard_criteria IS 'Scoring criteria for supplier evaluation';

-- Supplier performance scores
CREATE TABLE IF NOT EXISTS supplier_scorecards (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    evaluation_period_start DATE NOT NULL,
    evaluation_period_end DATE NOT NULL,
    overall_score NUMERIC(5,2), -- 0-100
    grade VARCHAR(10), -- 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'
    rank INTEGER, -- Ranking among all suppliers
    total_spend NUMERIC(15,2),
    total_orders INTEGER,
    evaluated_by INTEGER REFERENCES users(id),
    evaluation_date DATE,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'final', 'approved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_id, evaluation_period_start, evaluation_period_end)
);

COMMENT ON TABLE supplier_scorecards IS 'Supplier performance scorecards by period';

-- Individual criteria scores
CREATE TABLE IF NOT EXISTS supplier_scorecard_details (
    id SERIAL PRIMARY KEY,
    scorecard_id INTEGER NOT NULL REFERENCES supplier_scorecards(id) ON DELETE CASCADE,
    criteria_id INTEGER NOT NULL REFERENCES supplier_scorecard_criteria(id),
    score NUMERIC(5,2), -- 0-100
    weight NUMERIC(5,2), -- Percentage weight (can override default)
    weighted_score NUMERIC(5,2), -- score * weight / 100
    actual_value NUMERIC(15,2), -- Actual metric value (e.g., 95% for on-time)
    target_value NUMERIC(15,2), -- Target metric value
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE supplier_scorecard_details IS 'Detailed scores by criteria';

-- NOTE: supplier_performance_metrics table already exists in database
-- Using existing table with columns: period_start, period_end, on_time_delivery_rate, quality_score, etc.

-- =====================================================
-- 2. DYNAMIC REORDER POINTS & INVENTORY OPTIMIZATION
-- =====================================================

-- Reorder point calculation rules
CREATE TABLE IF NOT EXISTS reorder_point_rules (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    supplier_id INTEGER REFERENCES suppliers(id), -- Primary supplier
    calculation_method VARCHAR(50) DEFAULT 'dynamic', -- 'static', 'dynamic', 'statistical'
    
    -- Demand data
    avg_daily_demand NUMERIC(12,4),
    demand_std_dev NUMERIC(12,4),
    demand_variability_coefficient NUMERIC(8,4), -- Coefficient of variation
    
    -- Lead time data
    avg_lead_time_days NUMERIC(8,2),
    lead_time_std_dev_days NUMERIC(8,2),
    lead_time_variability NUMERIC(8,4),
    
    -- Service level & safety stock
    service_level_target NUMERIC(5,2) DEFAULT 95.00, -- Percentage
    safety_stock_quantity NUMERIC(12,4),
    reorder_point NUMERIC(12,4),
    
    -- Economic order quantity
    order_cost NUMERIC(10,2), -- Cost per order
    holding_cost_percentage NUMERIC(5,2) DEFAULT 25.00, -- Annual holding cost %
    eoq NUMERIC(12,4), -- Economic Order Quantity
    
    -- Review period
    review_period_days INTEGER DEFAULT 7,
    last_calculated_date DATE,
    next_review_date DATE,
    
    -- Overrides
    manual_override BOOLEAN DEFAULT false,
    manual_reorder_point NUMERIC(12,4),
    manual_safety_stock NUMERIC(12,4),
    override_reason TEXT,
    override_by INTEGER REFERENCES users(id),
    override_date DATE,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, supplier_id)
);

COMMENT ON TABLE reorder_point_rules IS 'Dynamic reorder point calculation rules';

CREATE INDEX idx_reorder_rules_product ON reorder_point_rules(product_id);
CREATE INDEX idx_reorder_rules_review ON reorder_point_rules(next_review_date) WHERE is_active = true;

-- Reorder point calculation history
CREATE TABLE IF NOT EXISTS reorder_point_history (
    id SERIAL PRIMARY KEY,
    rule_id INTEGER NOT NULL REFERENCES reorder_point_rules(id),
    calculated_date DATE NOT NULL,
    reorder_point NUMERIC(12,4),
    safety_stock NUMERIC(12,4),
    eoq NUMERIC(12,4),
    avg_demand NUMERIC(12,4),
    avg_lead_time NUMERIC(8,2),
    service_level NUMERIC(5,2),
    calculation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reorder_history_rule ON reorder_point_history(rule_id, calculated_date DESC);

-- =====================================================
-- 3. REQUEST FOR QUOTATION (RFQ) SYSTEM
-- =====================================================

-- RFQ headers
CREATE TABLE IF NOT EXISTS rfqs (
    id SERIAL PRIMARY KEY,
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    rfq_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'blanket', 'spot_buy', 'contract_renewal'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'issued', 'in_progress', 'evaluating', 'awarded', 'cancelled'
    
    -- Dates
    issue_date DATE,
    response_deadline DATE,
    expected_award_date DATE,
    
    -- Requirements
    delivery_location VARCHAR(255),
    payment_terms VARCHAR(100),
    required_certifications TEXT[],
    special_requirements TEXT,
    
    -- Vendor targeting
    vendor_selection_method VARCHAR(50) DEFAULT 'invited', -- 'invited', 'open', 'prequalified'
    min_supplier_score NUMERIC(5,2), -- Minimum scorecard score to participate
    
    created_by INTEGER NOT NULL REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    awarded_to_supplier_id INTEGER REFERENCES suppliers(id),
    awarded_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE rfqs IS 'Request for Quotation headers';

CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_deadline ON rfqs(response_deadline) WHERE status IN ('issued', 'in_progress');

-- NOTE: rfq_items table already exists, referencing rfq_requests table
-- Adding missing columns
ALTER TABLE rfq_items 
ADD COLUMN IF NOT EXISTS line_number INTEGER,
ADD COLUMN IF NOT EXISTS unit_of_measure VARCHAR(20),
ADD COLUMN IF NOT EXISTS target_price NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS required_delivery_date DATE;

CREATE INDEX IF NOT EXISTS idx_rfq_items_rfq_id ON rfq_items(rfq_id);

-- NOTE: rfq_suppliers table already exists
-- Adding missing columns
ALTER TABLE rfq_suppliers 
ADD COLUMN IF NOT EXISTS invited_date DATE,
ADD COLUMN IF NOT EXISTS invitation_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS response_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS declined_reason TEXT,
ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT false;

-- Supplier quotes/responses
CREATE TABLE IF NOT EXISTS rfq_quotes (
    id SERIAL PRIMARY KEY,
    rfq_id INTEGER NOT NULL REFERENCES rfqs(id),
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    quote_number VARCHAR(50),
    quote_date DATE NOT NULL,
    valid_until DATE,
    
    -- Totals
    total_amount NUMERIC(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Terms
    payment_terms VARCHAR(100),
    lead_time_days INTEGER,
    warranty_terms TEXT,
    shipping_terms VARCHAR(50), -- 'FOB', 'CIF', 'EXW', etc.
    
    -- Evaluation
    technical_score NUMERIC(5,2), -- 0-100
    commercial_score NUMERIC(5,2), -- 0-100
    overall_score NUMERIC(5,2), -- 0-100
    rank INTEGER,
    is_recommended BOOLEAN DEFAULT false,
    
    notes TEXT,
    submitted_date TIMESTAMP,
    evaluated_by INTEGER REFERENCES users(id),
    evaluation_date DATE,
    
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'accepted', 'rejected'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rfq_id, supplier_id)
);

COMMENT ON TABLE rfq_quotes IS 'Supplier quotes in response to RFQs';

CREATE INDEX idx_rfq_quotes_rfq ON rfq_quotes(rfq_id);
CREATE INDEX idx_rfq_quotes_supplier ON rfq_quotes(supplier_id);

-- Quote line items
CREATE TABLE IF NOT EXISTS rfq_quote_items (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER NOT NULL REFERENCES rfq_quotes(id) ON DELETE CASCADE,
    rfq_item_id INTEGER NOT NULL REFERENCES rfq_items(id),
    unit_price NUMERIC(15,2) NOT NULL,
    quantity NUMERIC(12,4) NOT NULL,
    line_total NUMERIC(15,2) NOT NULL,
    lead_time_days INTEGER,
    proposed_delivery_date DATE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rfq_quote_items_quote ON rfq_quote_items(quote_id);

-- =====================================================
-- 4. PURCHASE ORDER TRACKING & MANAGEMENT
-- =====================================================

-- Enhanced purchase order statuses
CREATE TABLE IF NOT EXISTS po_status_history (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    status VARCHAR(50) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_po_status_history_po ON po_status_history(purchase_order_id, changed_at DESC);

-- PO delivery tracking
CREATE TABLE IF NOT EXISTS po_deliveries (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    scheduled_date DATE,
    actual_delivery_date DATE,
    carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    delivery_status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_transit', 'delivered', 'delayed', 'cancelled'
    
    -- Receipt info
    received_by INTEGER REFERENCES users(id),
    received_date DATE,
    receiving_notes TEXT,
    
    -- Quality inspection
    inspection_required BOOLEAN DEFAULT true,
    inspection_id INTEGER REFERENCES inspections(id),
    inspection_status VARCHAR(50), -- 'pending', 'passed', 'failed', 'conditional'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_deliveries_po ON po_deliveries(purchase_order_id);
CREATE INDEX idx_po_deliveries_status ON po_deliveries(delivery_status);

-- PO line item receipts
CREATE TABLE IF NOT EXISTS po_line_receipts (
    id SERIAL PRIMARY KEY,
    purchase_order_item_id INTEGER NOT NULL REFERENCES purchase_order_items(id),
    delivery_id INTEGER REFERENCES po_deliveries(id),
    received_quantity NUMERIC(12,4) NOT NULL,
    accepted_quantity NUMERIC(12,4),
    rejected_quantity NUMERIC(12,4),
    rejection_reason TEXT,
    lot_number VARCHAR(50),
    serial_numbers TEXT[],
    received_date DATE NOT NULL,
    received_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_line_receipts_item ON po_line_receipts(purchase_order_item_id);
CREATE INDEX idx_po_line_receipts_delivery ON po_line_receipts(delivery_id);

-- Invoice matching (3-way match: PO, Receipt, Invoice)
CREATE TABLE IF NOT EXISTS po_invoices (
    id SERIAL PRIMARY KEY,
    purchase_order_id INTEGER NOT NULL REFERENCES purchase_orders(id),
    invoice_number VARCHAR(50) NOT NULL,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    invoice_date DATE NOT NULL,
    due_date DATE,
    
    -- Amounts
    subtotal NUMERIC(15,2) NOT NULL,
    tax_amount NUMERIC(15,2) DEFAULT 0,
    shipping_amount NUMERIC(15,2) DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Matching status
    match_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'matched', 'variance', 'disputed'
    price_variance NUMERIC(15,2),
    quantity_variance NUMERIC(12,4),
    variance_reason TEXT,
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'partial', 'paid', 'overdue'
    payment_date DATE,
    payment_reference VARCHAR(100),
    
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(supplier_id, invoice_number)
);

CREATE INDEX idx_po_invoices_po ON po_invoices(purchase_order_id);
CREATE INDEX idx_po_invoices_supplier ON po_invoices(supplier_id);
CREATE INDEX idx_po_invoices_status ON po_invoices(match_status, payment_status);

-- =====================================================
-- 5. CONTRACT MANAGEMENT
-- =====================================================

-- Supplier contracts
CREATE TABLE IF NOT EXISTS supplier_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_name VARCHAR(255) NOT NULL,
    supplier_id INTEGER NOT NULL REFERENCES suppliers(id),
    contract_type VARCHAR(50), -- 'blanket', 'framework', 'spot', 'consignment'
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT false,
    renewal_notice_days INTEGER DEFAULT 90,
    
    -- Financial terms
    total_contract_value NUMERIC(15,2),
    minimum_order_value NUMERIC(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_terms VARCHAR(100),
    
    -- Terms & conditions
    delivery_terms VARCHAR(100),
    warranty_terms TEXT,
    penalty_clauses TEXT,
    termination_clauses TEXT,
    
    -- Status & compliance
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_approval', 'active', 'expired', 'terminated'
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- 'compliant', 'non_compliant', 'at_risk'
    
    -- Document management
    document_id INTEGER REFERENCES quality_documents(id),
    signed_by_supplier BOOLEAN DEFAULT false,
    signed_by_company BOOLEAN DEFAULT false,
    
    created_by INTEGER NOT NULL REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE supplier_contracts IS 'Supplier contracts and agreements';

CREATE INDEX idx_contracts_supplier ON supplier_contracts(supplier_id);
CREATE INDEX idx_contracts_status ON supplier_contracts(status);
CREATE INDEX idx_contracts_expiry ON supplier_contracts(end_date) WHERE status = 'active';

-- Contract pricing agreements
CREATE TABLE IF NOT EXISTS contract_pricing (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES supplier_contracts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    unit_price NUMERIC(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Volume discounts
    min_quantity NUMERIC(12,4),
    max_quantity NUMERIC(12,4),
    discount_percentage NUMERIC(5,2),
    
    -- Validity
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    
    -- Lead time agreement
    agreed_lead_time_days INTEGER,
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contract_id, product_id, valid_from)
);

CREATE INDEX idx_contract_pricing_contract ON contract_pricing(contract_id);
CREATE INDEX idx_contract_pricing_product ON contract_pricing(product_id);

-- Contract performance tracking
CREATE TABLE IF NOT EXISTS contract_performance (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES supplier_contracts(id),
    evaluation_date DATE NOT NULL,
    
    -- Utilization
    total_spend_to_date NUMERIC(15,2),
    utilization_percentage NUMERIC(5,2), -- % of contract value used
    orders_placed INTEGER,
    
    -- Performance
    on_time_delivery_rate NUMERIC(5,2),
    quality_compliance_rate NUMERIC(5,2),
    pricing_variance NUMERIC(15,2), -- Actual vs. contracted price
    
    -- Savings
    cost_savings NUMERIC(15,2),
    cost_avoidance NUMERIC(15,2),
    
    compliance_issues INTEGER DEFAULT 0,
    performance_score NUMERIC(5,2), -- 0-100
    
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contract_id, evaluation_date)
);

CREATE INDEX idx_contract_performance_contract ON contract_performance(contract_id, evaluation_date DESC);

-- =====================================================
-- 6. PURCHASE REQUISITIONS & APPROVAL WORKFLOWS
-- =====================================================

-- NOTE: purchase_requisitions table already exists
-- Adding missing columns to existing table
ALTER TABLE purchase_requisitions 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS requisition_type VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS department_id INTEGER,
ADD COLUMN IF NOT EXISTS cost_center VARCHAR(50),
ADD COLUMN IF NOT EXISTS project_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS estimated_total NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS budget_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS budget_remaining NUMERIC(15,2),
ADD COLUMN IF NOT EXISTS required_by_date DATE,
ADD COLUMN IF NOT EXISTS delivery_location VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_approval_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS approval_chain JSONB,
ADD COLUMN IF NOT EXISTS converted_to_po BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS po_id INTEGER REFERENCES purchase_orders(id),
ADD COLUMN IF NOT EXISTS conversion_date DATE,
ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;

COMMENT ON TABLE purchase_requisitions IS 'Internal purchase requisitions';

-- Add indexes if they don't exist (some may already exist)
CREATE INDEX IF NOT EXISTS idx_pr_required_by_date ON purchase_requisitions(required_by_date) WHERE status IN ('approved', 'pending_approval');

-- NOTE: purchase_requisition_items table already exists
-- Adding missing columns to existing table
ALTER TABLE purchase_requisition_items 
ADD COLUMN IF NOT EXISTS line_number INTEGER,
ADD COLUMN IF NOT EXISTS unit_of_measure VARCHAR(20),
ADD COLUMN IF NOT EXISTS suggested_supplier_id INTEGER REFERENCES suppliers(id),
ADD COLUMN IF NOT EXISTS justification TEXT;

-- Add index on pr_id (existing column name)
CREATE INDEX IF NOT EXISTS idx_pr_items_pr_id ON purchase_requisition_items(pr_id);

-- PR approval history
CREATE TABLE IF NOT EXISTS pr_approvals (
    id SERIAL PRIMARY KEY,
    pr_id INTEGER NOT NULL REFERENCES purchase_requisitions(id),
    approval_level INTEGER NOT NULL,
    approver_id INTEGER NOT NULL REFERENCES users(id),
    approval_action VARCHAR(20) NOT NULL, -- 'approved', 'rejected', 'returned'
    approval_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    amount_approved NUMERIC(15,2)
);

CREATE INDEX IF NOT EXISTS idx_pr_approvals_pr_id ON pr_approvals(pr_id, approval_level);

-- =====================================================
-- 7. SUPPLY CHAIN ANALYTICS
-- =====================================================

-- Spend analysis cube
CREATE TABLE IF NOT EXISTS spend_analysis (
    id SERIAL PRIMARY KEY,
    analysis_date DATE NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(id),
    product_id INTEGER REFERENCES products(id),
    category_id INTEGER,
    department_id INTEGER,
    
    -- Spend metrics
    total_spend NUMERIC(15,2),
    order_count INTEGER,
    avg_order_value NUMERIC(15,2),
    
    -- Supplier concentration
    supplier_spend_percentage NUMERIC(5,2),
    is_single_source BOOLEAN,
    
    -- Contract compliance
    contract_spend NUMERIC(15,2),
    non_contract_spend NUMERIC(15,2),
    maverick_buying_percentage NUMERIC(5,2),
    
    -- Savings
    cost_savings NUMERIC(15,2),
    cost_avoidance NUMERIC(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(analysis_date, supplier_id, product_id)
);

CREATE INDEX idx_spend_analysis_date ON spend_analysis(analysis_date DESC);
CREATE INDEX idx_spend_analysis_supplier ON spend_analysis(supplier_id, analysis_date DESC);

-- =====================================================
-- VIEWS FOR DASHBOARDS
-- =====================================================

-- Supplier ranking view (using existing supplier_performance_metrics structure)
CREATE OR REPLACE VIEW v_supplier_rankings AS
SELECT 
    s.id AS supplier_id,
    s.name AS supplier_name,
    s.supplier_code,
    sc.overall_score,
    sc.grade,
    sc.rank,
    sc.total_spend,
    sc.total_orders,
    sc.evaluation_period_start,
    sc.evaluation_period_end,
    spm.on_time_delivery_rate,
    spm.quality_score,
    spm.average_lead_time,
    COUNT(DISTINCT po.id) AS active_po_count,
    COALESCE(SUM(po.total), 0) AS ytd_spend
FROM suppliers s
LEFT JOIN supplier_scorecards sc ON sc.supplier_id = s.id 
    AND sc.status = 'final'
    AND sc.evaluation_period_end = (
        SELECT MAX(evaluation_period_end) 
        FROM supplier_scorecards 
        WHERE supplier_id = s.id AND status = 'final'
    )
LEFT JOIN supplier_performance_metrics spm ON spm.supplier_id = s.id
    AND spm.period_end = (
        SELECT MAX(period_end)
        FROM supplier_performance_metrics
        WHERE supplier_id = s.id
    )
LEFT JOIN purchase_orders po ON po.supplier_id = s.id
    AND po.status NOT IN ('cancelled', 'closed')
    AND EXTRACT(YEAR FROM po.order_date) = EXTRACT(YEAR FROM CURRENT_DATE)
WHERE s.is_active = true
GROUP BY s.id, s.name, s.supplier_code, sc.overall_score, sc.grade, sc.rank,
         sc.total_spend, sc.total_orders, sc.evaluation_period_start, 
         sc.evaluation_period_end, spm.on_time_delivery_rate, spm.quality_score,
         spm.average_lead_time
ORDER BY sc.rank NULLS LAST, sc.overall_score DESC NULLS LAST;

COMMENT ON VIEW v_supplier_rankings IS 'Current supplier rankings with key metrics';

-- Active RFQs dashboard
CREATE OR REPLACE VIEW v_rfq_dashboard AS
SELECT 
    r.id AS rfq_id,
    r.rfq_number,
    r.title,
    r.status,
    r.issue_date,
    r.response_deadline,
    CASE 
        WHEN r.response_deadline < CURRENT_DATE THEN 'Overdue'
        WHEN r.response_deadline <= CURRENT_DATE + 3 THEN 'Due Soon'
        ELSE 'On Track'
    END AS deadline_status,
    COUNT(DISTINCT rs.supplier_id) AS invited_suppliers,
    COUNT(DISTINCT rq.id) AS quotes_received,
    COALESCE(AVG(rq.total_amount), 0) AS avg_quote_amount,
    MIN(rq.total_amount) AS lowest_quote_amount,
    r.created_by,
    r.created_at
FROM rfqs r
LEFT JOIN rfq_suppliers rs ON rs.rfq_id = r.id
LEFT JOIN rfq_quotes rq ON rq.rfq_id = r.id
WHERE r.status IN ('issued', 'in_progress', 'evaluating')
GROUP BY r.id, r.rfq_number, r.title, r.status, r.issue_date, 
         r.response_deadline, r.created_by, r.created_at
ORDER BY r.response_deadline;

COMMENT ON VIEW v_rfq_dashboard IS 'Active RFQs with response status';

-- Purchase requisition approval queue (using existing column names)
CREATE OR REPLACE VIEW v_pr_approval_queue AS
SELECT 
    pr.id AS requisition_id,
    pr.pr_number,
    COALESCE(pr.title, pr.purpose) AS title,
    pr.priority,
    pr.requested_by,
    COALESCE(pr.estimated_total, pr.total_estimated_cost) AS estimated_total,
    COALESCE(pr.required_by_date, pr.required_date) AS required_by_date,
    COALESCE(pr.current_approval_level, 0) AS current_approval_level,
    pr.status,
    EXTRACT(DAYS FROM (CURRENT_DATE - pr.created_at::date)) AS days_pending,
    CASE 
        WHEN COALESCE(pr.required_by_date, pr.required_date) < CURRENT_DATE + 7 THEN 'Urgent'
        WHEN COALESCE(pr.required_by_date, pr.required_date) < CURRENT_DATE + 14 THEN 'High Priority'
        ELSE 'Normal'
    END AS urgency,
    COUNT(pri.id) AS item_count
FROM purchase_requisitions pr
LEFT JOIN purchase_requisition_items pri ON pri.pr_id = pr.id
WHERE pr.status IN ('pending_approval')
GROUP BY pr.id, pr.pr_number, pr.title, pr.purpose, pr.priority, pr.requested_by,
         pr.estimated_total, pr.total_estimated_cost, pr.required_by_date, pr.required_date,
         pr.current_approval_level, pr.status, pr.created_at
ORDER BY 
    CASE pr.priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
    END,
    COALESCE(pr.required_by_date, pr.required_date);

COMMENT ON VIEW v_pr_approval_queue IS 'Pending purchase requisitions for approval';

-- =====================================================
-- SEED DATA
-- =====================================================

-- Supplier scorecard criteria (standard criteria)
INSERT INTO supplier_scorecard_criteria (criteria_name, criteria_code, weight, calculation_method, description) VALUES
('Quality Performance', 'QUALITY', 30.00, 'automatic', 'PPM defect rate and incoming inspection pass rate'),
('On-Time Delivery', 'DELIVERY', 25.00, 'automatic', 'Percentage of orders delivered on time'),
('Lead Time Performance', 'LEAD_TIME', 15.00, 'automatic', 'Adherence to quoted lead times'),
('Price Competitiveness', 'PRICE', 15.00, 'manual', 'Price comparison vs. market and competitors'),
('Responsiveness', 'RESPONSE', 10.00, 'manual', 'Response time to quotes and issues'),
('Documentation & Compliance', 'COMPLIANCE', 5.00, 'manual', 'Completeness of documentation and regulatory compliance')
ON CONFLICT (criteria_code) DO NOTHING;

COMMENT ON DATABASE ocean-erp IS 'Ocean ERP - Phase 4 Supply Chain Management implemented';
