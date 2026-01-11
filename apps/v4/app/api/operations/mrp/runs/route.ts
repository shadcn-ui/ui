import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * GET /api/operations/mrp/runs
 * Get MRP calculation history
 * 
 * Query params:
 * - id?: number - Get specific MRP run
 * - status?: string - Filter by status (running, completed, failed)
 * - limit?: number - Limit results (default 50)
 */
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '50';

    if (id) {
      // Get specific MRP run with details
      const runQuery = `
        SELECT 
          mc.*,
          u.first_name || ' ' || u.last_name as run_by_name,
          wo.wo_number
        FROM mrp_calculations mc
        LEFT JOIN users u ON mc.run_by = u.id
        LEFT JOIN work_orders wo ON mc.work_order_id = wo.id
        WHERE mc.id = $1
      `;
      
      const runResult = await client.query(runQuery, [id]);
      
      if (runResult.rows.length === 0) {
        return NextResponse.json({ error: 'MRP run not found' }, { status: 404 });
      }

      // Get shortage items for this run
      const shortagesQuery = `
        SELECT 
          msi.*,
          p.name as product_name,
          p.sku as product_code,
          p.unit_of_measure,
          p.current_stock,
          wo.wo_number,
          wo.planned_start_date
        FROM mrp_shortage_items msi
        JOIN products p ON p.id = msi.product_id
        LEFT JOIN work_orders wo ON wo.id = msi.work_order_id
        WHERE msi.mrp_calculation_id = $1
        ORDER BY msi.shortage_quantity DESC
      `;
      
      const shortagesResult = await client.query(shortagesQuery, [id]);

      return NextResponse.json({
        run: runResult.rows[0],
        shortages: shortagesResult.rows
      });
    }

    // List MRP runs
    let query = `
      SELECT 
        mc.*,
        u.first_name || ' ' || u.last_name as run_by_name,
        wo.wo_number,
        (SELECT COUNT(*) FROM mrp_shortage_items WHERE mrp_calculation_id = mc.id) as shortages_count
      FROM mrp_calculations mc
      LEFT JOIN users u ON mc.run_by = u.id
      LEFT JOIN work_orders wo ON mc.work_order_id = wo.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND mc.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY mc.run_date DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_runs,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_runs,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_runs,
        COUNT(*) FILTER (WHERE status = 'running') as running_runs,
        SUM(total_shortages_found) as total_shortages_all_time,
        AVG(execution_time_seconds) as avg_execution_time
      FROM mrp_calculations
      WHERE run_date >= CURRENT_DATE - INTERVAL '30 days'
    `;
    
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      runs: result.rows,
      statistics: statsResult.rows[0],
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching MRP runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MRP runs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/operations/mrp/runs?id=123
 * Delete an MRP calculation run (and its shortage items via CASCADE)
 */
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'MRP run ID is required' }, { status: 400 });
    }

    const result = await client.query(
      'DELETE FROM mrp_calculations WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'MRP run not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'MRP run deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting MRP run:', error);
    return NextResponse.json(
      { error: 'Failed to delete MRP run', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
