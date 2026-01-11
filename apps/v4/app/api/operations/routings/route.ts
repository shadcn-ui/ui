import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * GET /api/operations/routings
 * Get production routes
 * 
 * Query params:
 * - id?: number - Get specific route
 * - product_id?: number - Filter by product
 * - limit?: number (default 100)
 */
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const product_id = searchParams.get('product_id');
    const limit = searchParams.get('limit') || '100';

    if (id) {
      // Get specific route with operations
      const routeQuery = `
        SELECT 
          pr.*,
          p.name as product_name,
          p.sku as product_code
        FROM production_routes pr
        LEFT JOIN products p ON p.id = pr.product_id
        WHERE pr.id = $1
      `;
      
      const routeResult = await client.query(routeQuery, [id]);
      
      if (routeResult.rows.length === 0) {
        return NextResponse.json({ error: 'Production route not found' }, { status: 404 });
      }

      // Get operations for this route
      const operationsQuery = `
        SELECT 
          pro.*,
          w.workstation_name,
          w.workstation_code,
          w.cost_per_hour as workstation_cost_per_hour
        FROM production_route_operations pro
        LEFT JOIN workstations w ON w.id = pro.workstation_id
        WHERE pro.route_id = $1
        ORDER BY pro.sequence_number
      `;
      
      const operationsResult = await client.query(operationsQuery, [id]);

      // Calculate total time and cost
      const totals = operationsResult.rows.reduce(
        (acc, op) => ({
          total_setup_time: acc.total_setup_time + (op.setup_time_minutes || 0),
          total_run_time_per_unit: acc.total_run_time_per_unit + (parseFloat(op.run_time_per_unit) || 0),
          total_labor_hours_per_unit: acc.total_labor_hours_per_unit + (parseFloat(op.labor_hours_per_unit) || 0),
          total_labor_cost_per_unit: acc.total_labor_cost_per_unit + 
            ((parseFloat(op.labor_hours_per_unit) || 0) * (parseFloat(op.labor_cost_per_hour) || 0))
        }),
        { total_setup_time: 0, total_run_time_per_unit: 0, total_labor_hours_per_unit: 0, total_labor_cost_per_unit: 0 }
      );

      return NextResponse.json({
        route: routeResult.rows[0],
        operations: operationsResult.rows,
        totals
      });
    }

    // List routes
    let query = `
      SELECT 
        pr.*,
        p.name as product_name,
        p.sku as product_code,
        (SELECT COUNT(*) FROM production_route_operations WHERE route_id = pr.id) as operations_count
      FROM production_routes pr
      LEFT JOIN products p ON p.id = pr.product_id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (product_id) {
      paramCount++;
      query += ` AND pr.product_id = $${paramCount}`;
      params.push(product_id);
    }

    query += ` ORDER BY pr.created_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await client.query(query, params);

    return NextResponse.json({
      routes: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching production routes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch production routes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * POST /api/operations/routings
 * Create a new production route
 * 
 * Body:
 * - route_code: string
 * - route_name: string
 * - product_id?: number
 * - is_default?: boolean
 * - description?: string
 * - operations?: Array<{
 *     sequence_number: number,
 *     operation_name: string,
 *     operation_type: string,
 *     workstation_id?: number,
 *     setup_time_minutes?: number,
 *     run_time_per_unit?: number,
 *     labor_cost_per_hour?: number,
 *     labor_hours_per_unit?: number,
 *     description?: string
 *   }>
 */
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const body = await request.json();
    const {
      route_code,
      route_name,
      product_id,
      is_default = false,
      description,
      operations = []
    } = body;

    if (!route_code || !route_name) {
      return NextResponse.json(
        { error: 'Route code and name are required' },
        { status: 400 }
      );
    }

    // If this is set as default, unset other default routes for the same product
    if (is_default && product_id) {
      await client.query(
        'UPDATE production_routes SET is_default = false WHERE product_id = $1',
        [product_id]
      );
    }

    // Create route
    const routeResult = await client.query(`
      INSERT INTO production_routes (
        route_code,
        route_name,
        product_id,
        is_default,
        description,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *
    `, [route_code, route_name, product_id || null, is_default, description || null]);

    const routeId = routeResult.rows[0].id;

    // Create operations
    const createdOperations = [];
    for (const op of operations) {
      const opResult = await client.query(`
        INSERT INTO production_route_operations (
          route_id,
          sequence_number,
          operation_name,
          operation_type,
          workstation_id,
          setup_time_minutes,
          run_time_per_unit,
          labor_cost_per_hour,
          labor_hours_per_unit,
          description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        routeId,
        op.sequence_number,
        op.operation_name,
        op.operation_type,
        op.workstation_id || null,
        op.setup_time_minutes || 0,
        op.run_time_per_unit || 0,
        op.labor_cost_per_hour || 0,
        op.labor_hours_per_unit || 0,
        op.description || null
      ]);
      
      createdOperations.push(opResult.rows[0]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Production route created successfully',
      route: routeResult.rows[0],
      operations: createdOperations
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating production route:', error);
    return NextResponse.json(
      { error: 'Failed to create production route', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * PATCH /api/operations/routings?id=123
 * Update a production route
 * 
 * Body:
 * - route_name?: string
 * - is_default?: boolean
 * - description?: string
 * - is_active?: boolean
 */
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { route_name, is_default, description, is_active } = body;

    // Get current route
    const currentRoute = await client.query('SELECT * FROM production_routes WHERE id = $1', [id]);
    
    if (currentRoute.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    // If setting as default, unset other defaults for the same product
    if (is_default && currentRoute.rows[0].product_id) {
      await client.query(
        'UPDATE production_routes SET is_default = false WHERE product_id = $1 AND id != $2',
        [currentRoute.rows[0].product_id, id]
      );
    }

    const updateFields: string[] = [];
    const params: any[] = [];
    let paramCount = 0;

    if (route_name !== undefined) {
      updateFields.push(`route_name = $${++paramCount}`);
      params.push(route_name);
    }

    if (is_default !== undefined) {
      updateFields.push(`is_default = $${++paramCount}`);
      params.push(is_default);
    }

    if (description !== undefined) {
      updateFields.push(`description = $${++paramCount}`);
      params.push(description);
    }

    if (is_active !== undefined) {
      updateFields.push(`is_active = $${++paramCount}`);
      params.push(is_active);
    }

    if (updateFields.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const query = `
      UPDATE production_routes
      SET ${updateFields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;

    const result = await client.query(query, params);

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Production route updated successfully',
      route: result.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating production route:', error);
    return NextResponse.json(
      { error: 'Failed to update production route', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/operations/routings?id=123
 * Delete a production route
 */
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Route ID is required' }, { status: 400 });
    }

    // Check if route is being used in any work orders
    const usageCheck = await client.query(`
      SELECT COUNT(*) as count 
      FROM work_order_operations woo
      JOIN production_route_operations pro ON pro.id = woo.operation_id
      WHERE pro.route_id = $1
    `, [id]);

    if (parseInt(usageCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete route that is used in work orders. Consider deactivating instead.' },
        { status: 400 }
      );
    }

    const result = await client.query(
      'DELETE FROM production_routes WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Production route deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting production route:', error);
    return NextResponse.json(
      { error: 'Failed to delete production route', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
