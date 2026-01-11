import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/metrics/trends - Get quality trends over time
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const groupBy = searchParams.get('group_by') || 'week'; // day, week, month

    const start = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    // Determine date truncation based on groupBy
    let dateTrunc = 'week';
    if (groupBy === 'day') dateTrunc = 'day';
    else if (groupBy === 'month') dateTrunc = 'month';

    // NCR trends
    const ncrTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, detected_date) AS period,
        COUNT(*) AS ncr_count,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) AS critical_count,
        COUNT(CASE WHEN severity = 'major' THEN 1 END) AS major_count,
        COUNT(CASE WHEN severity = 'minor' THEN 1 END) AS minor_count,
        SUM(quantity_affected) AS total_quantity_affected,
        SUM(cost_impact) AS total_cost_impact
      FROM ncrs
      WHERE detected_date BETWEEN $2 AND $3
      GROUP BY DATE_TRUNC($1, detected_date)
      ORDER BY period
    `, [dateTrunc, start, end]);

    // FPY trends
    const fpyTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, i.inspection_date) AS period,
        COUNT(*) AS total_inspected,
        COUNT(CASE WHEN i.overall_result = 'accepted' THEN 1 END) AS total_passed,
        ROUND(
          (COUNT(CASE WHEN i.overall_result = 'accepted' THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) AS first_pass_yield
      FROM inspections i
      WHERE i.inspection_date BETWEEN $2 AND $3
        AND i.inspection_type = 'final'
      GROUP BY DATE_TRUNC($1, i.inspection_date)
      ORDER BY period
    `, [dateTrunc, start, end]);

    // Defect rate trends (per million opportunities)
    const defectTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, i.inspection_date) AS period,
        COUNT(*) AS total_inspections,
        SUM(i.quantity_inspected) AS total_quantity,
        SUM(i.quantity_rejected) AS total_defects,
        ROUND(
          (SUM(i.quantity_rejected)::numeric / NULLIF(SUM(i.quantity_inspected), 0)) * 1000000,
          0
        ) AS dpmo
      FROM inspections i
      WHERE i.inspection_date BETWEEN $2 AND $3
      GROUP BY DATE_TRUNC($1, i.inspection_date)
      ORDER BY period
    `, [dateTrunc, start, end]);

    // CAPA effectiveness trends
    const capaTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, c.created_at) AS period,
        COUNT(*) AS capas_created,
        COUNT(CASE WHEN c.status = 'closed' THEN 1 END) AS capas_closed,
        COUNT(CASE WHEN c.effectiveness_verified = true THEN 1 END) AS capas_effective,
        ROUND(
          (COUNT(CASE WHEN c.effectiveness_verified = true THEN 1 END)::numeric / 
           NULLIF(COUNT(CASE WHEN c.status = 'closed' THEN 1 END), 0)) * 100,
          2
        ) AS effectiveness_rate
      FROM capas c
      WHERE c.created_at BETWEEN $2 AND $3
      GROUP BY DATE_TRUNC($1, c.created_at)
      ORDER BY period
    `, [dateTrunc, start, end]);

    // SPC out-of-control trends
    const spcTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, sm.measured_at) AS period,
        COUNT(*) AS total_measurements,
        COUNT(CASE WHEN sm.is_out_of_control THEN 1 END) AS out_of_control_count,
        ROUND(
          (COUNT(CASE WHEN sm.is_out_of_control THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) AS out_of_control_percentage
      FROM spc_measurements sm
      JOIN spc_charts sc ON sc.id = sm.chart_id
      WHERE sm.measured_at BETWEEN $2 AND $3
        AND sc.is_active = true
      GROUP BY DATE_TRUNC($1, sm.measured_at)
      ORDER BY period
    `, [dateTrunc, start, end]);

    // Inspection pass rate trends by type
    const inspectionTrendsResult = await pool.query(`
      SELECT 
        DATE_TRUNC($1, i.inspection_date) AS period,
        i.inspection_type,
        COUNT(*) AS total_inspections,
        COUNT(CASE WHEN i.overall_result = 'accepted' THEN 1 END) AS accepted_count,
        ROUND(
          (COUNT(CASE WHEN i.overall_result = 'accepted' THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) AS pass_rate
      FROM inspections i
      WHERE i.inspection_date BETWEEN $2 AND $3
      GROUP BY DATE_TRUNC($1, i.inspection_date), i.inspection_type
      ORDER BY period, i.inspection_type
    `, [dateTrunc, start, end]);

    return NextResponse.json({
      period: {
        start_date: start,
        end_date: end,
        group_by: groupBy,
      },
      ncr_trends: ncrTrendsResult.rows,
      fpy_trends: fpyTrendsResult.rows,
      defect_trends: defectTrendsResult.rows,
      capa_trends: capaTrendsResult.rows,
      spc_trends: spcTrendsResult.rows,
      inspection_trends: inspectionTrendsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching quality trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality trends', details: error.message },
      { status: 500 }
    );
  }
}
