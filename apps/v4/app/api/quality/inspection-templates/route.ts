import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/inspection-templates - List templates
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const inspectionType = searchParams.get('inspection_type');
    const productId = searchParams.get('product_id');
    const isActive = searchParams.get('is_active');

    let query = `
      SELECT 
        it.*,
        COUNT(ii.id) AS item_count
      FROM inspection_templates it
      LEFT JOIN inspection_items ii ON ii.template_id = it.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (inspectionType) {
      query += ` AND it.inspection_type = $${paramIndex}`;
      params.push(inspectionType);
      paramIndex++;
    }

    if (productId) {
      query += ` AND it.product_id = $${paramIndex}`;
      params.push(parseInt(productId));
      paramIndex++;
    }

    if (isActive !== null) {
      query += ` AND it.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    query += `
      GROUP BY it.id
      ORDER BY it.template_name
    `;

    const result = await pool.query(query, params);

    return NextResponse.json({
      templates: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching inspection templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspection templates', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/inspection-templates - Create template
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      template_name,
      description,
      inspection_type,
      product_id,
      revision,
      items = [],
      created_by,
    } = body;

    if (!template_name || !inspection_type || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields (template_name, inspection_type, created_by)' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert template
    const templateResult = await client.query(`
      INSERT INTO inspection_templates (
        template_name,
        description,
        inspection_type,
        product_id,
        revision,
        is_active,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, true, $6)
      RETURNING *
    `, [
      template_name,
      description,
      inspection_type,
      product_id,
      revision || '1.0',
      created_by,
    ]);

    const template = templateResult.rows[0];

    // Insert template items
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await client.query(`
          INSERT INTO inspection_items (
            template_id,
            item_sequence,
            item_description,
            characteristic_type,
            specification,
            tolerance_upper,
            tolerance_lower,
            measurement_unit,
            is_critical,
            acceptance_criteria
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          template.id,
          i + 1,
          item.item_description,
          item.characteristic_type,
          item.specification,
          item.tolerance_upper,
          item.tolerance_lower,
          item.measurement_unit,
          item.is_critical || false,
          item.acceptance_criteria,
        ]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Inspection template created successfully',
      template: {
        ...template,
        items_added: items.length,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating inspection template:', error);
    return NextResponse.json(
      { error: 'Failed to create inspection template', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
