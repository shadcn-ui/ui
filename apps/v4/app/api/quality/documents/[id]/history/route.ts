import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/documents/[id]/history - Get document version history
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const documentId = parseInt(routeParams.id);

    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Fetch document
    const documentResult = await pool.query(`
      SELECT * FROM quality_documents WHERE id = $1
    `, [documentId]);

    if (documentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = documentResult.rows[0];

    // Fetch all versions with approval status
    const versionsResult = await pool.query(`
      SELECT 
        dv.*,
        COUNT(DISTINCT da.id) AS approval_count,
        COUNT(DISTINCT CASE WHEN da.approval_status = 'approved' THEN da.id END) AS approved_count,
        COUNT(DISTINCT CASE WHEN da.approval_status = 'rejected' THEN da.id END) AS rejected_count,
        CASE WHEN dv.id = $2 THEN true ELSE false END AS is_current
      FROM document_versions dv
      LEFT JOIN document_approvals da ON da.version_id = dv.id
      WHERE dv.document_id = $1
      GROUP BY dv.id
      ORDER BY dv.created_at DESC
    `, [documentId, document.current_version_id]);

    // For each version, get approval details
    const versionsWithApprovals = await Promise.all(
      versionsResult.rows.map(async (version: any) => {
        const approvalsResult = await pool.query(`
          SELECT *
          FROM document_approvals
          WHERE version_id = $1
          ORDER BY approval_date DESC
        `, [version.id]);

        return {
          ...version,
          approvals: approvalsResult.rows,
        };
      })
    );

    return NextResponse.json({
      document,
      versions: versionsWithApprovals,
      total_versions: versionsResult.rows.length,
    });
  } catch (error: any) {
    console.error('Error fetching document history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document history', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/documents/[id]/history - Create new version
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const routeParams = await context.params;
    const documentId = parseInt(routeParams.id);
    const body = await request.json();

    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: 'Invalid document ID' },
        { status: 400 }
      );
    }

    const {
      version_number,
      file_path,
      file_size,
      change_description,
      created_by,
    } = body;

    if (!version_number || !file_path || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Check document exists
    const documentResult = await client.query(`
      SELECT * FROM quality_documents WHERE id = $1
    `, [documentId]);

    if (documentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Supersede old version
    if (documentResult.rows[0].current_version_id) {
      await client.query(`
        UPDATE document_versions
        SET superseded_date = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [documentResult.rows[0].current_version_id]);
    }

    // Create new version
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
      documentId,
      version_number,
      file_path,
      file_size,
      change_description,
      created_by,
    ]);

    const version = versionResult.rows[0];

    // Update document
    await client.query(`
      UPDATE quality_documents
      SET 
        current_version_id = $1,
        status = 'draft',
        approved_by = NULL,
        approved_date = NULL
      WHERE id = $2
    `, [version.id, documentId]);

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'New document version created successfully',
      version,
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating document version:', error);
    return NextResponse.json(
      { error: 'Failed to create document version', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
