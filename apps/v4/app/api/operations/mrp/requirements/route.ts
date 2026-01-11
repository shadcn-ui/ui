import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * GET /api/operations/mrp/requirements
 * Get material requirements and shortages
 * 
 * Query params:
 * - work_order_id?: number - Filter by work order
 * - product_id?: number - Filter by product
 * - status?: string - Filter by status (open, in_progress, resolved)
 * - limit?: number - Limit results (default 100)
 */
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const work_order_id = searchParams.get('work_order_id');
    const product_id = searchParams.get('product_id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '100';

    let query = `
      SELECT 
        msi.*,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        p.current_stock,
        p.cost_price,
        wo.wo_number,
        wo.planned_start_date,
        wo.status as work_order_status,
        mc.run_date,
        u.first_name || ' ' || u.last_name as resolved_by_name
      FROM mrp_shortage_items msi
      JOIN products p ON p.id = msi.product_id
      LEFT JOIN work_orders wo ON wo.id = msi.work_order_id
      JOIN mrp_calculations mc ON mc.id = msi.mrp_calculation_id
      LEFT JOIN users u ON u.id = msi.resolved_by
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (work_order_id) {
      paramCount++;
      query += ` AND msi.work_order_id = $${paramCount}`;
      params.push(work_order_id);
    }

    if (product_id) {
      paramCount++;
      query += ` AND msi.product_id = $${paramCount}`;
      params.push(product_id);
    }

    if (status) {
      paramCount++;
      query += ` AND msi.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY msi.shortage_quantity DESC, wo.planned_start_date ASC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await client.query(query, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_shortages,
        COUNT(*) FILTER (WHERE status = 'open') as open_shortages,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_shortages,
        SUM(shortage_quantity * p.cost_price) as total_shortage_value,
        COUNT(DISTINCT product_id) as unique_products_short,
        COUNT(DISTINCT work_order_id) as affected_work_orders
      FROM mrp_shortage_items msi
      JOIN products p ON p.id = msi.product_id
      WHERE msi.status = 'open'
    `;
    
    const statsResult = await client.query(statsQuery);

    // Get top shortage products
    const topShortagesQuery = `
      SELECT 
        p.id,
        p.name as product_name,
        p.sku as product_code,
        SUM(msi.shortage_quantity) as total_shortage,
        COUNT(DISTINCT msi.work_order_id) as affected_wos,
        p.current_stock,
        p.cost_price,
        SUM(msi.shortage_quantity * p.cost_price) as shortage_value
      FROM mrp_shortage_items msi
      JOIN products p ON p.id = msi.product_id
      WHERE msi.status = 'open'
      GROUP BY p.id, p.name, p.sku, p.current_stock, p.cost_price
      ORDER BY shortage_value DESC
      LIMIT 10
    `;
    
    const topShortagesResult = await client.query(topShortagesQuery);

    return NextResponse.json({
      requirements: result.rows,
      statistics: statsResult.rows[0],
      top_shortages: topShortagesResult.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching MRP requirements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MRP requirements', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * PATCH /api/operations/mrp/requirements
 * Update shortage item status
 * 
 * Body:
 * - id: number - Shortage item ID
 * - status: string - New status (open, in_progress, resolved)
 * - resolved_by?: number - User ID
 * - notes?: string
 */
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    const { id, status, resolved_by, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    updateFields.push(`status = $${++paramCount}`);
    params.push(status);

    if (status === 'resolved') {
      updateFields.push(`resolved_at = CURRENT_TIMESTAMP`);
      if (resolved_by) {
        updateFields.push(`resolved_by = $${++paramCount}`);
        params.push(resolved_by);
      }
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${++paramCount}`);
      params.push(notes);
    }

    params.push(id); // Last param is the ID for WHERE clause

    const query = `
      UPDATE mrp_shortage_items
      SET ${updateFields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;

    const result = await client.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Shortage item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Shortage item updated successfully',
      item: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating shortage item:', error);
    return NextResponse.json(
      { error: 'Failed to update shortage item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
