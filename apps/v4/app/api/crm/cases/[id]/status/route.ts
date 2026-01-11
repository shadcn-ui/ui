import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * PUT /api/crm/cases/:id/status
 * Update case status with automatic SLA tracking
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const caseId = parseInt(params.id);
    const body = await request.json();
    const { status, status_reason, owner_id } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'open', 'pending', 'in_progress', 'waiting_customer', 'resolved', 'closed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Get current case state
    const caseCheck = await pool.query(
      'SELECT * FROM crm_cases WHERE case_id = $1 AND is_active = true',
      [caseId]
    );
    if (caseCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    const currentCase = caseCheck.rows[0];
    const now = new Date();

    // Prepare update fields
    const updateFields: string[] = ['status = $1'];
    const values: any[] = [status];
    let valueIndex = 2;

    if (status_reason) {
      updateFields.push(`status_reason = $${valueIndex}`);
      values.push(status_reason);
      valueIndex++;
    }

    if (owner_id !== undefined) {
      updateFields.push(`owner_id = $${valueIndex}`);
      values.push(owner_id);
      valueIndex++;
    }

    // Handle status-specific logic
    if (status === 'resolved' && currentCase.status !== 'resolved') {
      // Case is being resolved
      updateFields.push(`resolved_at = $${valueIndex}`);
      values.push(now);
      valueIndex++;

      updateFields.push(`resolution_time_minutes = EXTRACT(EPOCH FROM ($${valueIndex} - created_at))/60`);
      values.push(now);
      valueIndex++;
    }

    if (status === 'closed' && currentCase.status !== 'closed') {
      // Case is being closed
      updateFields.push(`closed_at = $${valueIndex}`);
      values.push(now);
      valueIndex++;
    }

    if (['resolved', 'closed'].includes(currentCase.status) && !['resolved', 'closed'].includes(status)) {
      // Case is being reopened
      updateFields.push('reopened_count = reopened_count + 1');
      updateFields.push('resolved_at = NULL');
      updateFields.push('closed_at = NULL');
    }

    values.push(caseId);
    const updateQuery = `
      UPDATE crm_cases
      SET ${updateFields.join(', ')},
          updated_at = CURRENT_TIMESTAMP
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
        cp.priority_name,
        sp.policy_name as sla_policy_name,
        CASE 
          WHEN c.status IN ('resolved', 'closed') THEN false
          WHEN c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due THEN true
          WHEN c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due THEN true
          ELSE false
        END as is_sla_violated
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      LEFT JOIN crm_sla_policies sp ON c.sla_policy_id = sp.sla_policy_id
      WHERE c.case_id = $1`,
      [caseId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating case status:', error);
    return NextResponse.json(
      { error: 'Failed to update case status' },
      { status: 500 }
    );
  }
}
