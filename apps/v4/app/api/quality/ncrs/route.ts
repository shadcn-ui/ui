import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/ncrs - List and search NCRs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Query parameters
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const ncrType = searchParams.get('ncr_type');
    const productId = searchParams.get('product_id');
    const supplierId = searchParams.get('supplier_id');
    const assignedTo = searchParams.get('assigned_to');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
      SELECT 
        n.*,
        COUNT(DISTINCT nd.id) AS detail_count,
        COUNT(DISTINCT nrc.id) AS root_cause_count,
        COUNT(DISTINCT na.id) AS action_count,
        COUNT(DISTINCT CASE WHEN na.status = 'completed' THEN na.id END) AS completed_action_count
      FROM ncrs n
      LEFT JOIN ncr_details nd ON nd.ncr_id = n.id
      LEFT JOIN ncr_root_causes nrc ON nrc.ncr_id = n.id
      LEFT JOIN ncr_actions na ON na.ncr_id = n.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND n.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (severity) {
      query += ` AND n.severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }

    if (ncrType) {
      query += ` AND n.ncr_type = $${paramIndex}`;
      params.push(ncrType);
      paramIndex++;
    }

    if (productId) {
      query += ` AND n.product_id = $${paramIndex}`;
      params.push(parseInt(productId));
      paramIndex++;
    }

    if (supplierId) {
      query += ` AND n.supplier_id = $${paramIndex}`;
      params.push(parseInt(supplierId));
      paramIndex++;
    }

    if (assignedTo) {
      query += ` AND n.assigned_to = $${paramIndex}`;
      params.push(parseInt(assignedTo));
      paramIndex++;
    }

    if (startDate) {
      query += ` AND n.detected_date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND n.detected_date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += `
      GROUP BY n.id
      ORDER BY n.detected_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) FROM ncrs n WHERE 1=1`;
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (status) {
      countQuery += ` AND n.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }
    if (severity) {
      countQuery += ` AND n.severity = $${countParamIndex}`;
      countParams.push(severity);
      countParamIndex++;
    }
    if (ncrType) {
      countQuery += ` AND n.ncr_type = $${countParamIndex}`;
      countParams.push(ncrType);
      countParamIndex++;
    }
    if (productId) {
      countQuery += ` AND n.product_id = $${countParamIndex}`;
      countParams.push(parseInt(productId));
      countParamIndex++;
    }
    if (supplierId) {
      countQuery += ` AND n.supplier_id = $${countParamIndex}`;
      countParams.push(parseInt(supplierId));
      countParamIndex++;
    }
    if (assignedTo) {
      countQuery += ` AND n.assigned_to = $${countParamIndex}`;
      countParams.push(parseInt(assignedTo));
      countParamIndex++;
    }
    if (startDate) {
      countQuery += ` AND n.detected_date >= $${countParamIndex}`;
      countParams.push(startDate);
      countParamIndex++;
    }
    if (endDate) {
      countQuery += ` AND n.detected_date <= $${countParamIndex}`;
      countParams.push(endDate);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      ncrs: result.rows,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching NCRs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NCRs', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/ncrs - Create new NCR
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      ncr_type,
      severity,
      detected_by,
      detection_method,
      product_id,
      work_order_id,
      supplier_id,
      customer_id,
      containment_action,
      disposition,
      quantity_affected,
      cost_impact,
      assigned_to,
      created_by,
      details = [], // Array of NCR details
    } = body;

    // Validation
    if (!title || !ncr_type || !severity || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ncr_type, severity, created_by' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Generate NCR number
    const ncrNumberResult = await client.query(`
      SELECT COALESCE(MAX(CAST(SUBSTRING(ncr_number FROM 5) AS INTEGER)), 0) + 1 AS next_number
      FROM ncrs
      WHERE ncr_number LIKE 'NCR-%'
    `);
    const ncrNumber = `NCR-${String(ncrNumberResult.rows[0].next_number).padStart(6, '0')}`;

    // Insert NCR
    const ncrResult = await client.query(`
      INSERT INTO ncrs (
        ncr_number,
        title,
        description,
        ncr_type,
        severity,
        status,
        detected_by,
        detection_method,
        product_id,
        work_order_id,
        supplier_id,
        customer_id,
        containment_action,
        disposition,
        quantity_affected,
        cost_impact,
        assigned_to,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `, [
      ncrNumber,
      title,
      description,
      ncr_type,
      severity,
      'open',
      detected_by,
      detection_method,
      product_id,
      work_order_id,
      supplier_id,
      customer_id,
      containment_action,
      disposition,
      quantity_affected,
      cost_impact,
      assigned_to,
      created_by,
    ]);

    const ncr = ncrResult.rows[0];

    // Insert NCR details if provided
    if (details.length > 0) {
      for (const detail of details) {
        await client.query(`
          INSERT INTO ncr_details (
            ncr_id,
            defect_description,
            defect_category,
            location,
            quantity_defective,
            images
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          ncr.id,
          detail.defect_description,
          detail.defect_category,
          detail.location,
          detail.quantity_defective,
          JSON.stringify(detail.images || []),
        ]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'NCR created successfully',
      ncr: {
        ...ncr,
        details_added: details.length,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating NCR:', error);
    return NextResponse.json(
      { error: 'Failed to create NCR', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
