import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/compliance/standards - List compliance standards
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const isActive = searchParams.get('is_active');

    let query = `
      SELECT 
        cs.*,
        COUNT(DISTINCT cr.id) AS requirement_count,
        COUNT(DISTINCT ce.id) AS evidence_count,
        COUNT(DISTINCT ca.id) AS audit_count
      FROM compliance_standards cs
      LEFT JOIN compliance_requirements cr ON cr.standard_id = cs.id
      LEFT JOIN compliance_evidence ce ON ce.standard_id = cs.id
      LEFT JOIN compliance_audits ca ON ca.standard_id = cs.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (isActive !== null) {
      query += ` AND cs.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    query += `
      GROUP BY cs.id
      ORDER BY cs.standard_name
    `;

    const result = await pool.query(query, params);

    return NextResponse.json({
      standards: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching compliance standards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compliance standards', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/compliance/standards - Create compliance standard
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      standard_name,
      standard_code,
      version,
      description,
      certification_body,
      certification_date,
      expiry_date,
      requirements = [],
      created_by,
    } = body;

    if (!standard_name || !standard_code || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields (standard_name, standard_code, created_by)' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert standard
    const standardResult = await client.query(`
      INSERT INTO compliance_standards (
        standard_name,
        standard_code,
        version,
        description,
        certification_body,
        certification_date,
        expiry_date,
        is_active,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
      RETURNING *
    `, [
      standard_name,
      standard_code,
      version,
      description,
      certification_body,
      certification_date,
      expiry_date,
      created_by,
    ]);

    const standard = standardResult.rows[0];

    // Insert requirements
    if (requirements.length > 0) {
      for (const req of requirements) {
        await client.query(`
          INSERT INTO compliance_requirements (
            standard_id,
            requirement_number,
            requirement_title,
            requirement_text,
            category,
            is_mandatory,
            compliance_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          standard.id,
          req.requirement_number,
          req.requirement_title,
          req.requirement_text,
          req.category,
          req.is_mandatory !== false,
          'pending',
        ]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Compliance standard created successfully',
      standard: {
        ...standard,
        requirements_added: requirements.length,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating compliance standard:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance standard', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
