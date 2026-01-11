import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * GET /api/operations/work-orders/[id]/materials
 * Get materials for a specific work order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const workOrderId = params.id;

    const query = `
      SELECT 
        wom.*,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        p.current_stock,
        p.cost_price,
        w.name as warehouse_name,
        (wom.required_quantity - wom.reserved_quantity) as unreserved_quantity,
        (wom.reserved_quantity - wom.issued_quantity) as pending_issue_quantity,
        CASE 
          WHEN p.current_stock >= (wom.required_quantity - wom.reserved_quantity) THEN 'sufficient'
          ELSE 'insufficient'
        END as availability_status
      FROM work_order_materials wom
      JOIN products p ON p.id = wom.product_id
      LEFT JOIN warehouses w ON w.id = wom.warehouse_id
      WHERE wom.work_order_id = $1
      ORDER BY wom.id
    `;
    
    const result = await client.query(query, [workOrderId]);

    // Get reservations for these materials
    const reservationsQuery = `
      SELECT 
        mr.*,
        p.name as product_name,
        p.sku as product_code,
        w.name as warehouse_name,
        u1.first_name || ' ' || u1.last_name as reserved_by_name,
        u2.first_name || ' ' || u2.last_name as released_by_name
      FROM material_reservations mr
      JOIN products p ON p.id = mr.product_id
      LEFT JOIN warehouses w ON w.id = mr.warehouse_id
      LEFT JOIN users u1 ON u1.id = mr.reserved_by
      LEFT JOIN users u2 ON u2.id = mr.released_by
      WHERE mr.work_order_id = $1
      ORDER BY mr.reservation_date DESC
    `;
    
    const reservationsResult = await client.query(reservationsQuery, [workOrderId]);

    // Get summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_materials,
        SUM(line_total) as total_material_cost,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'reserved') as reserved_count,
        COUNT(*) FILTER (WHERE status = 'issued') as issued_count,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count
      FROM work_order_materials
      WHERE work_order_id = $1
    `;
    
    const summaryResult = await client.query(summaryQuery, [workOrderId]);

    return NextResponse.json({
      materials: result.rows,
      reservations: reservationsResult.rows,
      summary: summaryResult.rows[0]
    });

  } catch (error) {
    console.error('Error fetching work order materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work order materials', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * POST /api/operations/work-orders/[id]/materials
 * Add a material to a work order
 * 
 * Body:
 * - product_id: number
 * - required_quantity: number
 * - warehouse_id?: number
 * - notes?: string
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const workOrderId = params.id;
    const body = await request.json();
    const { product_id, required_quantity, warehouse_id, notes } = body;

    if (!product_id || !required_quantity) {
      return NextResponse.json(
        { error: 'Product ID and required quantity are required' },
        { status: 400 }
      );
    }

    // Get product cost
    const productResult = await client.query(
      'SELECT cost_price FROM products WHERE id = $1',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const unitCost = productResult.rows[0].cost_price || 0;
    const lineTotal = unitCost * required_quantity;

    const result = await client.query(`
      INSERT INTO work_order_materials (
        work_order_id,
        product_id,
        required_quantity,
        unit_cost,
        line_total,
        warehouse_id,
        notes,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
    `, [
      workOrderId,
      product_id,
      required_quantity,
      unitCost,
      lineTotal,
      warehouse_id || null,
      notes || null
    ]);

    return NextResponse.json({
      success: true,
      message: 'Material added successfully',
      material: result.rows[0]
    });

  } catch (error) {
    console.error('Error adding work order material:', error);
    return NextResponse.json(
      { error: 'Failed to add material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * PATCH /api/operations/work-orders/[id]/materials?material_id=123
 * Update a work order material
 * 
 * Body:
 * - required_quantity?: number
 * - status?: string
 * - notes?: string
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('material_id');

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { required_quantity, status, notes } = body;

    const updateFields: string[] = [];
    const queryParams: any[] = [];
    let paramCount = 0;

    if (required_quantity !== undefined) {
      // Recalculate line total
      const productResult = await client.query(
        'SELECT cost_price FROM products WHERE id = (SELECT product_id FROM work_order_materials WHERE id = $1)',
        [materialId]
      );
      
      if (productResult.rows.length > 0) {
        const unitCost = productResult.rows[0].cost_price || 0;
        const lineTotal = unitCost * required_quantity;
        
        updateFields.push(`required_quantity = $${++paramCount}`);
        queryParams.push(required_quantity);
        updateFields.push(`line_total = $${++paramCount}`);
        queryParams.push(lineTotal);
      }
    }

    if (status) {
      updateFields.push(`status = $${++paramCount}`);
      queryParams.push(status);
    }

    if (notes !== undefined) {
      updateFields.push(`notes = $${++paramCount}`);
      queryParams.push(notes);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    queryParams.push(materialId);

    const query = `
      UPDATE work_order_materials
      SET ${updateFields.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;

    const result = await client.query(query, queryParams);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Material updated successfully',
      material: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating work order material:', error);
    return NextResponse.json(
      { error: 'Failed to update material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * DELETE /api/operations/work-orders/[id]/materials?material_id=123
 * Delete a work order material
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('material_id');

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    // Check if there are active reservations
    const reservationsCheck = await client.query(
      'SELECT COUNT(*) as count FROM material_reservations WHERE work_order_material_id = $1 AND status = $2',
      [materialId, 'active']
    );

    if (parseInt(reservationsCheck.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete material with active reservations. Release reservations first.' },
        { status: 400 }
      );
    }

    const result = await client.query(
      'DELETE FROM work_order_materials WHERE id = $1 RETURNING id',
      [materialId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting work order material:', error);
    return NextResponse.json(
      { error: 'Failed to delete material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
