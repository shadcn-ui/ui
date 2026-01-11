-- =====================================================
-- Phase 4: Supply Chain - Final View Fixes
-- =====================================================

-- Fix supplier_rankings view (use total_amount and status = 'Active')
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
    COALESCE(SUM(po.total_amount), 0) AS ytd_spend
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

-- Create index on pr_approvals requisition_id
CREATE INDEX IF NOT EXISTS idx_pr_approvals_requisition_id ON pr_approvals(requisition_id, approval_level);

-- Verify views created
SELECT 
    viewname AS view_name,
    definition IS NOT NULL AS is_defined
FROM pg_views 
WHERE schemaname = 'public' 
    AND viewname IN ('v_supplier_rankings', 'v_rfq_dashboard', 'v_pr_approval_queue')
ORDER BY viewname;

COMMENT ON DATABASE ocean-erp IS 'Ocean ERP - Phase 4 Supply Chain Management Schema Complete';
