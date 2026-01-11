import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/metrics/overview - Get quality KPIs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const productId = searchParams.get('product_id');

    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const end = endDate || new Date().toISOString().split('T')[0];

    // Calculate First Pass Yield
    const fpyResult = await pool.query(`
      SELECT * FROM calculate_first_pass_yield($1, $2, $3)
    `, [productId, start, end]);

    // Calculate Defect Rate
    const defectRateResult = await pool.query(`
      SELECT * FROM calculate_defect_rate($1, $2)
    `, [start, end]);

    // Calculate OQC Pass Rate
    const oqcResult = await pool.query(`
      SELECT * FROM calculate_oqc_pass_rate($1, $2)
    `, [start, end]);

    // Get NCR statistics
    const ncrStatsResult = await pool.query(`
      SELECT 
        COUNT(*) AS total_ncrs,
        COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_ncrs,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_ncrs,
        COUNT(CASE WHEN severity = 'critical' THEN 1 END) AS critical_ncrs,
        AVG(EXTRACT(EPOCH FROM (closed_date - detected_date))/86400)::numeric(10,1) AS avg_closure_days
      FROM ncrs
      WHERE detected_date BETWEEN $1 AND $2
    `, [start, end]);

    // Get CAPA statistics
    const capaStatsResult = await pool.query(`
      SELECT 
        COUNT(*) AS total_capas,
        COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_capas,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) AS closed_capas,
        COUNT(CASE WHEN effectiveness_verified = true THEN 1 END) AS effective_capas,
        COUNT(CASE WHEN due_date < CURRENT_DATE AND status NOT IN ('closed', 'cancelled') THEN 1 END) AS overdue_capas
      FROM capas
      WHERE created_at BETWEEN $1 AND $2
    `, [start, end]);

    // Get SPC out-of-control points
    const spcStatsResult = await pool.query(`
      SELECT 
        COUNT(DISTINCT sm.chart_id) AS active_charts,
        COUNT(*) AS total_measurements,
        COUNT(CASE WHEN sm.is_out_of_control THEN 1 END) AS out_of_control_count,
        ROUND(
          (COUNT(CASE WHEN sm.is_out_of_control THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) AS out_of_control_percentage
      FROM spc_measurements sm
      JOIN spc_charts sc ON sc.id = sm.chart_id
      WHERE sm.measured_at BETWEEN $1 AND $2
        AND sc.is_active = true
    `, [start, end]);

    // Get inspection statistics
    const inspectionStatsResult = await pool.query(`
      SELECT 
        COUNT(*) AS total_inspections,
        COUNT(CASE WHEN overall_result = 'accepted' THEN 1 END) AS accepted_count,
        COUNT(CASE WHEN overall_result = 'rejected' THEN 1 END) AS rejected_count,
        ROUND(
          (COUNT(CASE WHEN overall_result = 'accepted' THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100,
          2
        ) AS acceptance_rate,
        inspection_type,
        COUNT(*) AS type_count
      FROM inspections
      WHERE inspection_date BETWEEN $1 AND $2
      GROUP BY inspection_type
    `, [start, end]);

    return NextResponse.json({
      period: {
        start_date: start,
        end_date: end,
      },
      first_pass_yield: fpyResult.rows,
      defect_rate: defectRateResult.rows[0] || {},
      oqc_pass_rate: oqcResult.rows,
      ncr_statistics: ncrStatsResult.rows[0] || {},
      capa_statistics: capaStatsResult.rows[0] || {},
      spc_statistics: spcStatsResult.rows[0] || {},
      inspection_statistics: {
        summary: inspectionStatsResult.rows.reduce((acc, row) => {
          acc.total_inspections = (acc.total_inspections || 0) + parseInt(row.type_count);
          acc.accepted_count = (acc.accepted_count || 0) + parseInt(row.accepted_count || 0);
          acc.rejected_count = (acc.rejected_count || 0) + parseInt(row.rejected_count || 0);
          return acc;
        }, {} as any),
        by_type: inspectionStatsResult.rows,
      },
    });
  } catch (error: any) {
    console.error('Error fetching quality metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality metrics', details: error.message },
      { status: 500 }
    );
  }
}
