import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/inspections - List inspections
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const inspectionType = searchParams.get('inspection_type');
    const status = searchParams.get('status');
    const result = searchParams.get('result');
    const productId = searchParams.get('product_id');
    const workOrderId = searchParams.get('work_order_id');
    const inspectorId = searchParams.get('inspector_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
      SELECT 
        i.*,
        it.template_name,
        COUNT(DISTINCT ir.id) AS result_count,
        COUNT(DISTINCT CASE WHEN ir.result = 'pass' THEN ir.id END) AS passed_count,
        COUNT(DISTINCT CASE WHEN ir.result = 'fail' THEN ir.id END) AS failed_count
      FROM inspections i
      LEFT JOIN inspection_templates it ON it.id = i.template_id
      LEFT JOIN inspection_results ir ON ir.inspection_id = i.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (inspectionType) {
      query += ` AND i.inspection_type = $${paramIndex}`;
      params.push(inspectionType);
      paramIndex++;
    }

    if (status) {
      query += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (result) {
      query += ` AND i.overall_result = $${paramIndex}`;
      params.push(result);
      paramIndex++;
    }

    if (productId) {
      query += ` AND i.product_id = $${paramIndex}`;
      params.push(parseInt(productId));
      paramIndex++;
    }

    if (workOrderId) {
      query += ` AND i.work_order_id = $${paramIndex}`;
      params.push(parseInt(workOrderId));
      paramIndex++;
    }

    if (inspectorId) {
      query += ` AND i.inspector_id = $${paramIndex}`;
      params.push(parseInt(inspectorId));
      paramIndex++;
    }

    if (startDate) {
      query += ` AND i.inspection_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND i.inspection_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += `
      GROUP BY i.id, it.template_name
      ORDER BY i.inspection_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result_data = await pool.query(query, params);

    return NextResponse.json({
      inspections: result_data.rows,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspections', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/inspections - Create inspection
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      template_id,
      inspection_type,
      product_id,
      work_order_id,
      purchase_order_id,
      lot_number,
      batch_number,
      quantity_inspected,
      inspector_id,
      inspection_date,
      results = [],
    } = body;

    if (!inspection_type || !inspector_id) {
      return NextResponse.json(
        { error: 'Missing required fields (inspection_type, inspector_id)' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert inspection header
    const inspectionResult = await client.query(`
      INSERT INTO inspections (
        template_id,
        inspection_type,
        product_id,
        work_order_id,
        purchase_order_id,
        lot_number,
        batch_number,
        quantity_inspected,
        inspector_id,
        inspection_date,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'in_progress')
      RETURNING *
    `, [
      template_id,
      inspection_type,
      product_id,
      work_order_id,
      purchase_order_id,
      lot_number,
      batch_number,
      quantity_inspected,
      inspector_id,
      inspection_date || new Date(),
    ]);

    const inspection = inspectionResult.rows[0];

    // If results provided, insert them
    if (results.length > 0) {
      for (const resultItem of results) {
        await client.query(`
          INSERT INTO inspection_results (
            inspection_id,
            template_item_id,
            measured_value,
            result,
            notes
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          inspection.id,
          resultItem.template_item_id,
          resultItem.measured_value,
          resultItem.result,
          resultItem.notes,
        ]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Inspection created successfully',
      inspection: {
        ...inspection,
        results_added: results.length,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      { error: 'Failed to create inspection', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
