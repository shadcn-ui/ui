import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/cases/:id
 * Get case details with comments and history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);

    // Get case details
    const caseQuery = `
      SELECT 
        c.*,
        a.account_name,
        a.account_type,
        con.full_name as contact_name,
        con.email as contact_email,
        con.phone as contact_phone,
        ct.type_name as case_type_name,
        ct.icon as case_type_icon,
        ct.color as case_type_color,
        cp.priority_name,
        cp.priority_level,
        cp.color as priority_color,
        sp.policy_name as sla_policy_name,
        sp.first_response_hours,
        sp.resolution_hours,
        CASE 
          WHEN c.status IN ('resolved', 'closed') THEN false
          WHEN c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due THEN true
          WHEN c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due THEN true
          ELSE false
        END as is_sla_violated,
        CASE
          WHEN c.first_response_due IS NOT NULL AND c.first_response_at IS NULL THEN
            EXTRACT(EPOCH FROM (c.first_response_due - CURRENT_TIMESTAMP))/3600
          ELSE NULL
        END as hours_until_first_response_due,
        CASE
          WHEN c.resolution_due IS NOT NULL AND c.resolved_at IS NULL THEN
            EXTRACT(EPOCH FROM (c.resolution_due - CURRENT_TIMESTAMP))/3600
          ELSE NULL
        END as hours_until_resolution_due
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      LEFT JOIN crm_sla_policies sp ON c.sla_policy_id = sp.sla_policy_id
      WHERE c.case_id = $1 AND c.is_active = true
    `;

    const caseResult = await pool.query(caseQuery, [caseId]);
    if (caseResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const caseData = caseResult.rows[0];

    // Get comments
    const commentsQuery = `
      SELECT 
        cc.*,
        CASE 
          WHEN cc.is_internal THEN 'Internal Note'
          ELSE 'Customer Visible'
        END as visibility_label
      FROM crm_case_comments cc
      WHERE cc.case_id = $1 AND cc.is_active = true
      ORDER BY cc.created_at ASC
    `;
    const commentsResult = await pool.query(commentsQuery, [caseId]);

    // Get attachments
    const attachmentsQuery = `
      SELECT * FROM crm_case_attachments
      WHERE case_id = $1 AND is_active = true
      ORDER BY uploaded_at DESC
    `;
    const attachmentsResult = await pool.query(attachmentsQuery, [caseId]);

    // Get escalations
    const escalationsQuery = `
      SELECT * FROM crm_case_escalations
      WHERE case_id = $1 AND is_active = true
      ORDER BY escalated_at DESC
    `;
    const escalationsResult = await pool.query(escalationsQuery, [caseId]);

    // Get SLA violations
    const violationsQuery = `
      SELECT 
        sv.*,
        sp.policy_name
      FROM crm_sla_violations sv
      JOIN crm_sla_policies sp ON sv.sla_policy_id = sp.sla_policy_id
      WHERE sv.case_id = $1
      ORDER BY sv.violated_at DESC
    `;
    const violationsResult = await pool.query(violationsQuery, [caseId]);

    return NextResponse.json({
      case: caseData,
      comments: commentsResult.rows,
      attachments: attachmentsResult.rows,
      escalations: escalationsResult.rows,
      sla_violations: violationsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching case details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case details' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/crm/cases/:id
 * Update case details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);
    const body = await request.json();

    // Check if case exists
    const checkResult = await pool.query(
      'SELECT case_id, status FROM crm_cases WHERE case_id = $1 AND is_active = true',
      [caseId]
    );
    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const allowedFields = [
      'subject',
      'description',
      'case_type_id',
      'priority_id',
      'status',
      'status_reason',
      'owner_id',
      'team_id',
      'channel',
    ];

    const updateFields: string[] = [];
    const values: any[] = [];
    let valueIndex = 1;

    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updateFields.push(`${key} = $${valueIndex}`);
        values.push(body[key]);
        valueIndex++;
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    values.push(caseId);
    const updateQuery = `
      UPDATE crm_cases
      SET ${updateFields.join(', ')}
      WHERE case_id = $${valueIndex}
      RETURNING *
    `;

    await pool.query(updateQuery, values);

    // Fetch updated case with related data
    const result = await pool.query(
      `SELECT 
        c.*,
        a.account_name,
        con.full_name as contact_name,
        ct.type_name as case_type_name,
        cp.priority_name
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      WHERE c.case_id = $1`,
      [caseId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/crm/cases/:id
 * Soft delete a case
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);

    const result = await pool.query(
      'UPDATE crm_cases SET is_active = false WHERE case_id = $1 AND is_active = true RETURNING case_id',
      [caseId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
