import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/documents - List quality documents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const documentType = searchParams.get('document_type');
    const status = searchParams.get('status');
    const departmentId = searchParams.get('department_id');

    let query = `
      SELECT 
        qd.*,
        dv.version_number AS current_version,
        dv.effective_date AS current_effective_date,
        COUNT(DISTINCT dv2.id) AS version_count,
        COUNT(DISTINCT da.id) AS approval_count
      FROM quality_documents qd
      LEFT JOIN document_versions dv ON dv.id = qd.current_version_id
      LEFT JOIN document_versions dv2 ON dv2.document_id = qd.id
      LEFT JOIN document_approvals da ON da.version_id = dv.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (documentType) {
      query += ` AND qd.document_type = $${paramIndex}`;
      params.push(documentType);
      paramIndex++;
    }

    if (status) {
      query += ` AND qd.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (departmentId) {
      query += ` AND qd.department_id = $${paramIndex}`;
      params.push(parseInt(departmentId));
      paramIndex++;
    }

    query += `
      GROUP BY qd.id, dv.version_number, dv.effective_date
      ORDER BY qd.document_number
    `;

    const result = await pool.query(query, params);

    return NextResponse.json({
      documents: result.rows,
    });
  } catch (error: any) {
    console.error('Error fetching quality documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality documents', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/documents - Create/upload quality document
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      document_number,
      document_title,
      document_type,
      department_id,
      description,
      file_path,
      file_size,
      version_number,
      change_description,
      created_by,
    } = body;

    if (!document_number || !document_title || !document_type || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert document
    const documentResult = await client.query(`
      INSERT INTO quality_documents (
        document_number,
        document_title,
        document_type,
        department_id,
        description,
        status,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, 'draft', $6)
      RETURNING *
    `, [
      document_number,
      document_title,
      document_type,
      department_id,
      description,
      created_by,
    ]);

    const document = documentResult.rows[0];

    // Create initial version
    const versionResult = await client.query(`
      INSERT INTO document_versions (
        document_id,
        version_number,
        file_path,
        file_size,
        change_description,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      document.id,
      version_number || '1.0',
      file_path,
      file_size,
      change_description || 'Initial version',
      created_by,
    ]);

    const version = versionResult.rows[0];

    // Update document with current version
    await client.query(`
      UPDATE quality_documents
      SET current_version_id = $1
      WHERE id = $2
    `, [version.id, document.id]);

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Quality document created successfully',
      document: {
        ...document,
        current_version_id: version.id,
        version: version,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating quality document:', error);
    return NextResponse.json(
      { error: 'Failed to create quality document', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
