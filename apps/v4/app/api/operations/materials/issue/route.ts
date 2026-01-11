import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * POST /api/operations/materials/issue
 * Issue materials to production (from reservation to actual consumption)
 * 
 * Body:
 * - work_order_material_id: number
 * - quantity: number
 * - issued_by?: number (user ID)
 * - notes?: string
 */
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const body = await request.json();
    const { work_order_material_id, quantity, issued_by, notes } = body;

    if (!work_order_material_id || !quantity) {
      return NextResponse.json(
        { error: 'Work order material ID and quantity are required' },
        { status: 400 }
      );
    }

    // Get work order material details
    const materialResult = await client.query(`
      SELECT 
        wom.*,
        wo.wo_number,
        wo.status as wo_status,
        p.name as product_name,
        p.current_stock
      FROM work_order_materials wom
      JOIN work_orders wo ON wo.id = wom.work_order_id
      JOIN products p ON p.id = wom.product_id
      WHERE wom.id = $1
    `, [work_order_material_id]);

    if (materialResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Work order material not found' }, { status: 404 });
    }

    const material = materialResult.rows[0];

    // Validate quantity
    const maxIssueQty = parseFloat(material.reserved_quantity) - parseFloat(material.issued_quantity);
    if (quantity > maxIssueQty) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        {
          error: 'Issue quantity exceeds reserved quantity',
          details: {
            requested: quantity,
            max_available: maxIssueQty,
            reserved: parseFloat(material.reserved_quantity),
            already_issued: parseFloat(material.issued_quantity)
          }
        },
        { status: 400 }
      );
    }

    // Check inventory
    if (material.current_stock < quantity) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        {
          error: 'Insufficient inventory',
          details: {
            requested: quantity,
            available: material.current_stock
          }
        },
        { status: 400 }
      );
    }

    // Update work_order_materials issued quantity
    await client.query(`
      UPDATE work_order_materials
      SET 
        issued_quantity = issued_quantity + $1,
        status = CASE 
          WHEN issued_quantity + $1 >= required_quantity THEN 'issued'
          WHEN issued_quantity + $1 >= reserved_quantity THEN 'issued'
          ELSE status
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [quantity, work_order_material_id]);

    // Decrement product inventory
    await client.query(`
      UPDATE products
      SET current_stock = current_stock - $1
      WHERE id = $2
    `, [quantity, material.product_id]);

    // Record inventory movement (if inventory_movements table exists)
    try {
      await client.query(`
        INSERT INTO inventory_movements (
          product_id,
          location_id,
          movement_type,
          quantity,
          unit_cost,
          reference_type,
          reference_id,
          notes,
          created_by
        )
        VALUES ($1, $2, 'out', $3, $4, 'work_order', $5, $6, $7)
      `, [
        material.product_id,
        material.warehouse_id || null,
        -quantity, // negative for outbound
        material.unit_cost,
        material.work_order_id,
        notes || `Issued to WO ${material.wo_number}`,
        issued_by || null
      ]);
    } catch (invError) {
      // If inventory_movements doesn't exist, continue anyway
      console.warn('Could not record inventory movement:', invError);
    }

    // Mark related reservations as consumed
    await client.query(`
      UPDATE material_reservations
      SET status = 'consumed'
      WHERE work_order_material_id = $1 
        AND status = 'active'
        AND reserved_quantity <= $2
    `, [work_order_material_id, quantity]);

    await client.query('COMMIT');

    // Get updated material status
    const updatedResult = await client.query(`
      SELECT 
        wom.*,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        p.current_stock,
        wo.wo_number
      FROM work_order_materials wom
      JOIN products p ON p.id = wom.product_id
      JOIN work_orders wo ON wo.id = wom.work_order_id
      WHERE wom.id = $1
    `, [work_order_material_id]);

    return NextResponse.json({
      success: true,
      message: `Successfully issued ${quantity} units to production`,
      material: updatedResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error issuing material:', error);
    return NextResponse.json(
      { error: 'Failed to issue material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * GET /api/operations/materials/issue
 * Get material issuance history
 * 
 * Query params:
 * - work_order_id?: number
 * - product_id?: number
 * - limit?: number (default 100)
 */
export async function GET(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const { searchParams } = new URL(request.url);
    const work_order_id = searchParams.get('work_order_id');
    const product_id = searchParams.get('product_id');
    const limit = searchParams.get('limit') || '100';

    let query = `
      SELECT 
        wom.id,
        wom.work_order_id,
        wom.product_id,
        wom.required_quantity,
        wom.reserved_quantity,
        wom.issued_quantity,
        wom.status,
        wom.unit_cost,
        wom.line_total,
        wom.updated_at as last_issue_date,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        wo.wo_number,
        wo.status as wo_status,
        (wom.required_quantity - wom.issued_quantity) as remaining_to_issue
      FROM work_order_materials wom
      JOIN products p ON p.id = wom.product_id
      JOIN work_orders wo ON wo.id = wom.work_order_id
      WHERE wom.issued_quantity > 0
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (work_order_id) {
      paramCount++;
      query += ` AND wom.work_order_id = $${paramCount}`;
      params.push(work_order_id);
    }

    if (product_id) {
      paramCount++;
      query += ` AND wom.product_id = $${paramCount}`;
      params.push(product_id);
    }

    query += ` ORDER BY wom.updated_at DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT work_order_id) as work_orders_with_issues,
        COUNT(*) as total_material_lines,
        SUM(issued_quantity * unit_cost) as total_issued_value,
        SUM(issued_quantity) as total_units_issued
      FROM work_order_materials
      WHERE issued_quantity > 0
    `;
    
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      issuances: result.rows,
      statistics: statsResult.rows[0],
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching material issuances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issuances', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
