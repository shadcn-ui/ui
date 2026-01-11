import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * POST /api/crm/cases/:id/comments
 * Add a comment to a case
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);
    const body = await request.json();
    const { comment_text, is_internal = false, is_solution = false, created_by } = body;

    if (!comment_text) {
      return NextResponse.json(
        { error: 'comment_text is required' },
        { status: 400 }
      );
    }

    // Check if case exists
    const caseCheck = await pool.query(
      'SELECT case_id, first_response_at, status FROM crm_cases WHERE case_id = $1 AND is_active = true',
      [caseId]
    );
    if (caseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const caseData = caseCheck.rows[0];

    // Insert comment
    const insertQuery = `
      INSERT INTO crm_case_comments (
        case_id, comment_text, is_internal, is_solution, created_by
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      caseId,
      comment_text,
      is_internal,
      is_solution,
      created_by,
    ]);

    // Update first response time if this is the first response
    if (!caseData.first_response_at && !is_internal) {
      const now = new Date();
      await pool.query(
        `UPDATE crm_cases 
         SET first_response_at = $1,
             response_time_minutes = EXTRACT(EPOCH FROM ($1 - created_at))/60
         WHERE case_id = $2`,
        [now, caseId]
      );
    }

    // If marked as solution and case is not resolved, update case status
    if (is_solution && !['resolved', 'closed'].includes(caseData.status)) {
      const now = new Date();
      await pool.query(
        `UPDATE crm_cases 
         SET status = 'resolved',
             resolved_at = $1,
             resolution_time_minutes = EXTRACT(EPOCH FROM ($1 - created_at))/60
         WHERE case_id = $2`,
        [now, caseId]
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
