import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const department = searchParams.get('department');
    
    // 1. Overall procurement statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT pr.id) as total_prs,
        COUNT(DISTINCT CASE WHEN pr.status = 'draft' THEN pr.id END) as draft_prs,
        COUNT(DISTINCT CASE WHEN pr.status = 'pending_approval' THEN pr.id END) as pending_prs,
        COUNT(DISTINCT CASE WHEN pr.status = 'approved' THEN pr.id END) as approved_prs,
        COUNT(DISTINCT CASE WHEN pr.status = 'rejected' THEN pr.id END) as rejected_prs,
        COALESCE(SUM(pr.total_estimated_cost), 0) as total_pr_value,
        
        COUNT(DISTINCT rfq.id) as total_rfqs,
        COUNT(DISTINCT CASE WHEN rfq.status = 'draft' THEN rfq.id END) as draft_rfqs,
        COUNT(DISTINCT CASE WHEN rfq.status = 'sent' THEN rfq.id END) as sent_rfqs,
        COUNT(DISTINCT CASE WHEN rfq.status = 'completed' THEN rfq.id END) as completed_rfqs,
        
        COUNT(DISTINCT sq.id) as total_quotations,
        COUNT(DISTINCT CASE WHEN sq.status = 'accepted' THEN sq.id END) as accepted_quotations,
        COALESCE(SUM(CASE WHEN sq.status = 'accepted' THEN sq.total_amount ELSE 0 END), 0) as total_accepted_value,
        
        COUNT(DISTINCT po.id) as total_pos,
        COUNT(DISTINCT CASE WHEN po.status = 'draft' THEN po.id END) as draft_pos,
        COUNT(DISTINCT CASE WHEN po.status = 'approved' THEN po.id END) as approved_pos,
        COUNT(DISTINCT CASE WHEN po.status = 'received' THEN po.id END) as received_pos,
        COALESCE(SUM(po.total_amount), 0) as total_po_value
      FROM purchase_requisitions pr
      LEFT JOIN rfq_requests rfq ON rfq.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      LEFT JOIN supplier_quotations sq ON sq.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      LEFT JOIN purchase_orders po ON po.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      WHERE pr.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      ${department ? "AND pr.department = $1" : ''}
    `;
    
    const statsResult = await client.query(
      statsQuery,
      department ? [department] : []
    );
    const stats = statsResult.rows[0];
    
    // 2. Spending by department (simplified - only PR estimated costs)
    const departmentSpendingQuery = `
      SELECT 
        pr.department,
        COUNT(DISTINCT pr.id) as pr_count,
        COALESCE(SUM(pr.total_estimated_cost), 0) as estimated_spend,
        0 as actual_spend
      FROM purchase_requisitions pr
      WHERE pr.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      ${department ? "AND pr.department = $1" : ''}
      GROUP BY pr.department
      ORDER BY estimated_spend DESC
    `;
    
    const departmentSpendingResult = await client.query(
      departmentSpendingQuery,
      department ? [department] : []
    );
    
    // 3. Top suppliers by value
    const topSuppliersQuery = `
      SELECT 
        s.id,
        s.company_name,
        COUNT(DISTINCT po.id) as po_count,
        COALESCE(SUM(po.total_amount), 0) as total_value,
        COALESCE(AVG(spm.overall_rating), 0) as avg_rating,
        COALESCE(AVG(spm.on_time_delivery_rate), 0) as on_time_rate
      FROM suppliers s
      LEFT JOIN purchase_orders po ON po.supplier_id = s.id AND po.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      LEFT JOIN supplier_performance_metrics spm ON spm.supplier_id = s.id
      GROUP BY s.id, s.company_name
      HAVING COUNT(DISTINCT po.id) > 0
      ORDER BY total_value DESC
      LIMIT 10
    `;
    
    const topSuppliersResult = await client.query(topSuppliersQuery);
    
    // 4. Spending trend (by month)
    const spendingTrendQuery = `
      SELECT 
        TO_CHAR(po.order_date, 'YYYY-MM') as month,
        COUNT(DISTINCT po.id) as po_count,
        COALESCE(SUM(po.total_amount), 0) as total_amount
      FROM purchase_orders po
      WHERE po.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      ${department ? "AND po.department = $1" : ''}
      GROUP BY TO_CHAR(po.order_date, 'YYYY-MM')
      ORDER BY month
    `;
    
    const spendingTrendResult = await client.query(
      spendingTrendQuery,
      department ? [department] : []
    );
    
    // 5. PR to PO conversion rate
    const conversionQuery = `
      SELECT 
        COUNT(DISTINCT pr.id) as total_prs,
        COUNT(DISTINCT CASE WHEN pr.converted_to_po_id IS NOT NULL THEN pr.id END) as converted_prs,
        ROUND(
          CAST(COUNT(DISTINCT CASE WHEN pr.converted_to_po_id IS NOT NULL THEN pr.id END) AS NUMERIC) / 
          NULLIF(COUNT(DISTINCT pr.id), 0) * 100, 
          2
        ) as conversion_rate
      FROM purchase_requisitions pr
      WHERE pr.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      ${department ? "AND pr.department = $1" : ''}
    `;
    
    const conversionResult = await client.query(
      conversionQuery,
      department ? [department] : []
    );
    
    // 6. Average procurement cycle time (simplified - PO creation to delivery)
    const cycleTimeQuery = `
      SELECT 
        AVG(EXTRACT(DAY FROM (po.expected_delivery_date::timestamp - po.order_date::timestamp))) as avg_order_to_delivery_days,
        AVG(EXTRACT(DAY FROM (po.actual_delivery_date::timestamp - po.order_date::timestamp))) as avg_actual_delivery_days
      FROM purchase_orders po
      WHERE po.created_at >= CURRENT_DATE - INTERVAL '${period} days'
      AND po.status IN ('completed', 'delivered')
      AND po.expected_delivery_date IS NOT NULL
    `;
    
    const cycleTimeResult = await client.query(
      cycleTimeQuery
    );
    
    // 7. Budget utilization
    const budgetQuery = `
      SELECT 
        budget_code,
        budget_name,
        department,
        total_budget,
        allocated_amount,
        committed_amount,
        spent_amount,
        available_amount,
        ROUND((spent_amount / NULLIF(total_budget, 0)) * 100, 2) as utilization_percent
      FROM procurement_budgets
      WHERE period_start <= CURRENT_DATE AND period_end >= CURRENT_DATE
      ${department ? "AND department = $1" : ''}
      ORDER BY utilization_percent DESC
    `;
    
    const budgetResult = await client.query(
      budgetQuery,
      department ? [department] : []
    );
    
    // 8. Supplier performance summary
    const performanceQuery = `
      SELECT 
        s.id,
        s.company_name,
        spm.total_orders,
        spm.total_value,
        spm.on_time_delivery_rate,
        spm.quality_score,
        spm.overall_rating
      FROM supplier_performance_metrics spm
      INNER JOIN suppliers s ON s.id = spm.supplier_id
      WHERE spm.period_start >= CURRENT_DATE - INTERVAL '${period} days'
      ORDER BY spm.overall_rating DESC
      LIMIT 10
    `;
    
    const performanceResult = await client.query(performanceQuery);
    
    // 9. Price trend analysis
    const priceTrendQuery = `
      SELECT 
        p.id as product_id,
        p.name as product_name,
        s.company_name as supplier_name,
        pph.price,
        pph.effective_date,
        LAG(pph.price) OVER (PARTITION BY pph.product_id, pph.supplier_id ORDER BY pph.effective_date) as previous_price,
        ROUND(
          ((pph.price - LAG(pph.price) OVER (PARTITION BY pph.product_id, pph.supplier_id ORDER BY pph.effective_date)) / 
          NULLIF(LAG(pph.price) OVER (PARTITION BY pph.product_id, pph.supplier_id ORDER BY pph.effective_date), 0)) * 100,
          2
        ) as price_change_percent
      FROM product_price_history pph
      INNER JOIN products p ON p.id = pph.product_id
      INNER JOIN suppliers s ON s.id = pph.supplier_id
      WHERE pph.effective_date >= CURRENT_DATE - INTERVAL '${period} days'
      ORDER BY pph.effective_date DESC
      LIMIT 20
    `;
    
    const priceTrendResult = await client.query(priceTrendQuery);
    
    // Compile analytics response
    const analytics = {
      summary: stats,
      departmentSpending: departmentSpendingResult.rows,
      topSuppliers: topSuppliersResult.rows,
      spendingTrend: spendingTrendResult.rows,
      conversion: conversionResult.rows[0],
      cycleTime: cycleTimeResult.rows[0],
      budgets: budgetResult.rows,
      supplierPerformance: performanceResult.rows,
      priceTrends: priceTrendResult.rows,
      period: period,
      department: department
    };
    
    return NextResponse.json(analytics);
  } catch (error: any) {
    console.error('Error fetching procurement analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch procurement analytics', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
