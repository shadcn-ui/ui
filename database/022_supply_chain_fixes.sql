-- =====================================================
-- Phase 4: Supply Chain - Quick Fixes
-- =====================================================

-- Fix pr_approvals index
DROP INDEX IF EXISTS idx_pr_approvals_requisition;
CREATE INDEX IF NOT EXISTS idx_pr_approvals_pr_id ON pr_approvals(pr_id, approval_level);

-- Fix supplier_rankings view (use company_name instead of name)
DROP VIEW IF EXISTS v_supplier_rankings;
CREATE OR REPLACE VIEW v_supplier_rankings AS
SELECT 
    s.id AS supplier_id,
    s.company_name AS supplier_name,
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
WHERE s.status = 'Active'
GROUP BY s.id, s.company_name, s.supplier_code, sc.overall_score, sc.grade, sc.rank,
         sc.total_spend, sc.total_orders, sc.evaluation_period_start, 
         sc.evaluation_period_end, spm.on_time_delivery_rate, spm.quality_score,
         spm.average_lead_time
ORDER BY sc.rank NULLS LAST, sc.overall_score DESC NULLS LAST;

COMMENT ON VIEW v_supplier_rankings IS 'Current supplier rankings with key metrics';

-- Fix PR approval queue view (fix EXTRACT syntax)
DROP VIEW IF EXISTS v_pr_approval_queue;
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
    (CURRENT_DATE - pr.created_at::date) AS days_pending,
    CASE 
        WHEN COALESCE(pr.required_by_date, pr.required_date) < CURRENT_DATE + INTERVAL '7 days' THEN 'Urgent'
        WHEN COALESCE(pr.required_by_date, pr.required_date) < CURRENT_DATE + INTERVAL '14 days' THEN 'High Priority'
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

-- Verify tables created
SELECT 
    'Supply Chain Tables' AS category,
    COUNT(*) AS table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN (
        'supplier_scorecard_criteria',
        'supplier_scorecards',
        'supplier_scorecard_details',
        'reorder_point_rules',
        'reorder_point_history',
        'rfqs',
        'rfq_items',
        'rfq_suppliers',
        'rfq_quotes',
        'rfq_quote_items',
        'po_status_history',
        'po_deliveries',
        'po_line_receipts',
        'po_invoices',
        'supplier_contracts',
        'contract_pricing',
        'contract_performance',
        'pr_approvals',
        'spend_analysis'
    );
