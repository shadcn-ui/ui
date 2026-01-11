import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * POST /api/operations/materials/reserve
 * Reserve materials for a work order
 * 
 * Body:
 * - work_order_id: number
 * - work_order_material_id?: number (optional - if provided, reserve specific material; otherwise reserve all)
 * - product_id: number
 * - quantity: number
 * - warehouse_id?: number
 * - expiry_days?: number (default 7)
 * - reserved_by?: number (user ID)
 */
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const body = await request.json();
    const {
      work_order_id,
      work_order_material_id,
      product_id,
      quantity,
      warehouse_id,
      expiry_days = 7,
      reserved_by
    } = body;

    if (!work_order_id || !product_id || !quantity) {
      return NextResponse.json(
        { error: 'Work order ID, product ID, and quantity are required' },
        { status: 400 }
      );
    }

    // Check material availability
    const availabilityQuery = `
      SELECT 
        p.current_stock,
        p.min_stock_level,
        COALESCE(SUM(mr.reserved_quantity), 0) as total_reserved
      FROM products p
      LEFT JOIN material_reservations mr ON mr.product_id = p.id AND mr.status = 'active'
      WHERE p.id = $1
      GROUP BY p.id, p.current_stock, p.min_stock_level
    `;
    
    const availResult = await client.query(availabilityQuery, [product_id]);
    
    if (availResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { current_stock, min_stock_level, total_reserved } = availResult.rows[0];
    const availableQty = current_stock - parseFloat(total_reserved) - (min_stock_level || 0);

    if (availableQty < quantity) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        {
          error: 'Insufficient inventory available',
          details: {
            requested: quantity,
            available: availableQty,
            current_stock,
            reserved: parseFloat(total_reserved),
            min_stock: min_stock_level || 0
          }
        },
        { status: 400 }
      );
    }

    // Create reservation
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiry_days);

    const reservationResult = await client.query(`
      INSERT INTO material_reservations (
        work_order_id,
        work_order_material_id,
        product_id,
        warehouse_id,
        reserved_quantity,
        reservation_date,
        expiry_date,
        status,
        reserved_by
      )
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, 'active', $7)
      RETURNING *
    `, [
      work_order_id,
      work_order_material_id || null,
      product_id,
      warehouse_id || null,
      quantity,
      expiryDate,
      reserved_by || null
    ]);

    // Update work_order_materials reserved quantity
    if (work_order_material_id) {
      await client.query(`
        UPDATE work_order_materials
        SET 
          reserved_quantity = reserved_quantity + $1,
          status = CASE 
            WHEN reserved_quantity + $1 >= required_quantity THEN 'reserved'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [quantity, work_order_material_id]);
    }

    await client.query('COMMIT');

    // Get the complete reservation with details
    const detailQuery = `
      SELECT 
        mr.*,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        w.name as warehouse_name,
        wo.wo_number,
        u.first_name || ' ' || u.last_name as reserved_by_name
      FROM material_reservations mr
      JOIN products p ON p.id = mr.product_id
      LEFT JOIN warehouses w ON w.id = mr.warehouse_id
      LEFT JOIN work_orders wo ON wo.id = mr.work_order_id
      LEFT JOIN users u ON u.id = mr.reserved_by
      WHERE mr.id = $1
    `;
    
    const detailResult = await client.query(detailQuery, [reservationResult.rows[0].id]);

    return NextResponse.json({
      success: true,
      message: 'Material reserved successfully',
      reservation: detailResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error reserving material:', error);
    return NextResponse.json(
      { error: 'Failed to reserve material', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * PATCH /api/operations/materials/reserve?id=123
 * Release a reservation
 * 
 * Body:
 * - released_by?: number (user ID)
 * - notes?: string
 */
export async function PATCH(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { released_by, notes } = body;

    // Get reservation details
    const reservationResult = await client.query(
      'SELECT * FROM material_reservations WHERE id = $1',
      [id]
    );

    if (reservationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const reservation = reservationResult.rows[0];

    if (reservation.status !== 'active') {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Only active reservations can be released' },
        { status: 400 }
      );
    }

    // Release reservation
    await client.query(`
      UPDATE material_reservations
      SET 
        status = 'released',
        released_at = CURRENT_TIMESTAMP,
        released_by = $1,
        notes = $2
      WHERE id = $3
    `, [released_by || null, notes || null, id]);

    // Update work_order_materials reserved quantity
    if (reservation.work_order_material_id) {
      await client.query(`
        UPDATE work_order_materials
        SET 
          reserved_quantity = GREATEST(0, reserved_quantity - $1),
          status = CASE 
            WHEN reserved_quantity - $1 <= 0 THEN 'pending'
            ELSE status
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [reservation.reserved_quantity, reservation.work_order_material_id]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Reservation released successfully'
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error releasing reservation:', error);
    return NextResponse.json(
      { error: 'Failed to release reservation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

/**
 * GET /api/operations/materials/reserve
 * Get material reservations
 * 
 * Query params:
 * - work_order_id?: number
 * - product_id?: number
 * - status?: string (active, released, expired, consumed)
 * - limit?: number (default 100)
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
        mr.*,
        p.name as product_name,
        p.sku as product_code,
        p.unit_of_measure,
        w.name as warehouse_name,
        wo.wo_number,
        u1.first_name || ' ' || u1.last_name as reserved_by_name,
        u2.first_name || ' ' || u2.last_name as released_by_name,
        CASE 
          WHEN mr.status = 'active' AND mr.expiry_date < CURRENT_TIMESTAMP THEN true
          ELSE false
        END as is_expired
      FROM material_reservations mr
      JOIN products p ON p.id = mr.product_id
      LEFT JOIN warehouses w ON w.id = mr.warehouse_id
      LEFT JOIN work_orders wo ON wo.id = mr.work_order_id
      LEFT JOIN users u1 ON u1.id = mr.reserved_by
      LEFT JOIN users u2 ON u2.id = mr.released_by
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 0;

    if (work_order_id) {
      paramCount++;
      query += ` AND mr.work_order_id = $${paramCount}`;
      params.push(work_order_id);
    }

    if (product_id) {
      paramCount++;
      query += ` AND mr.product_id = $${paramCount}`;
      params.push(product_id);
    }

    if (status) {
      paramCount++;
      query += ` AND mr.status = $${paramCount}`;
      params.push(status);
    }

    query += ` ORDER BY mr.reservation_date DESC LIMIT $${paramCount + 1}`;
    params.push(limit);

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(*) FILTER (WHERE status = 'active') as active_reservations,
        COUNT(*) FILTER (WHERE status = 'active' AND expiry_date < CURRENT_TIMESTAMP) as expired_reservations,
        SUM(reserved_quantity) FILTER (WHERE status = 'active') as total_reserved_quantity
      FROM material_reservations
    `;
    
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      reservations: result.rows,
      statistics: statsResult.rows[0],
      total: result.rows.length
    });

  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
