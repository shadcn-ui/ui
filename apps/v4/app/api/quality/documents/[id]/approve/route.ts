import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// POST /api/quality/documents/[id]/approve - Approve document
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
      action, // 'submit_for_approval', 'approve', 'reject'
      approved_by,
      approval_notes,
      effective_date,
    } = body;

    if (!action || !approved_by) {
      return NextResponse.json(
        { error: 'action and approved_by are required' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Fetch document
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

    const document = documentResult.rows[0];

    if (action === 'submit_for_approval') {
      // Submit for approval
      await client.query(`
        UPDATE quality_documents
        SET status = 'pending_approval'
        WHERE id = $1
      `, [documentId]);

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'Document submitted for approval',
        document_id: documentId,
        status: 'pending_approval',
      });
    }

    if (action === 'approve') {
      // Create approval record
      await client.query(`
        INSERT INTO document_approvals (
          version_id,
          approved_by,
          approval_status,
          approval_notes
        ) VALUES ($1, $2, 'approved', $3)
      `, [document.current_version_id, approved_by, approval_notes]);

      // Update document status and effective date
      await client.query(`
        UPDATE quality_documents
        SET 
          status = 'approved',
          approved_by = $1,
          approved_date = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [approved_by, documentId]);

      // Update version effective date
      await client.query(`
        UPDATE document_versions
        SET effective_date = $1
        WHERE id = $2
      `, [effective_date || new Date(), document.current_version_id]);

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'Document approved successfully',
        document_id: documentId,
        status: 'approved',
      });
    }

    if (action === 'reject') {
      // Create rejection record
      await client.query(`
        INSERT INTO document_approvals (
          version_id,
          approved_by,
          approval_status,
          approval_notes
        ) VALUES ($1, $2, 'rejected', $3)
      `, [document.current_version_id, approved_by, approval_notes]);

      // Update document status
      await client.query(`
        UPDATE quality_documents
        SET status = 'draft'
        WHERE id = $1
      `, [documentId]);

      await client.query('COMMIT');

      return NextResponse.json({
        message: 'Document rejected',
        document_id: documentId,
        status: 'draft',
        notes: approval_notes,
      });
    }

    await client.query('ROLLBACK');
    return NextResponse.json(
      { error: 'Invalid action. Must be: submit_for_approval, approve, or reject' },
      { status: 400 }
    );
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error processing document approval:', error);
    return NextResponse.json(
      { error: 'Failed to process document approval', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/quality/documents/[id]/approve - Get approval status
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

    // Fetch document with approvals
    const documentResult = await pool.query(`
      SELECT 
        qd.*,
        dv.version_number,
        dv.effective_date
      FROM quality_documents qd
      LEFT JOIN document_versions dv ON dv.id = qd.current_version_id
      WHERE qd.id = $1
    `, [documentId]);

    if (documentResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const document = documentResult.rows[0];

    // Fetch approvals
    const approvalsResult = await pool.query(`
      SELECT da.*
      FROM document_approvals da
      WHERE da.version_id = $1
      ORDER BY da.approval_date DESC
    `, [document.current_version_id]);

    return NextResponse.json({
      document,
      approvals: approvalsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching document approval status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document approval status', details: error.message },
      { status: 500 }
    );
  }
}
