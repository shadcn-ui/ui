import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/workflows/approvals/[id]/delegate - Delegate an approval to another user
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const approvalId = params.id;
    const body = await request.json();
    const { user_id, delegate_to_user_id, comments } = body;

    if (!user_id || !delegate_to_user_id) {
      return NextResponse.json(
        { error: 'user_id and delegate_to_user_id are required' },
        { status: 400 }
      );
    }

    await query('BEGIN');

    try {
      // Get approval details
      const approvalResult = await query(
        `SELECT wa.*
        FROM workflow_approvals wa
        WHERE wa.id = $1 AND wa.approver_id = $2 AND wa.status = 'pending'`,
        [approvalId, user_id]
      );

      if (approvalResult.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'Approval not found or already processed' },
          { status: 404 }
        );
      }

      const approval = approvalResult.rows[0];

      // Check if delegate user exists
      const delegateExists = await query(
        `SELECT id FROM users WHERE id = $1`,
        [delegate_to_user_id]
      );

      if (delegateExists.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'Delegate user not found' },
          { status: 404 }
        );
      }

      // Update approval to new approver
      await query(
        `UPDATE workflow_approvals
        SET approver_id = $1, delegated_from = $2, updated_at = NOW()
        WHERE id = $3`,
        [delegate_to_user_id, user_id, approvalId]
      );

      // Log in workflow history
      await query(
        `INSERT INTO workflow_history
        (instance_id, step_id, action, performed_by, comments)
        VALUES ($1, $2, 'delegated', $3, $4)`,
        [
          approval.instance_id,
          approval.step_id,
          user_id,
          `Delegated to user ${delegate_to_user_id}. ${comments || ''}`
        ]
      );

      // TODO: Send notification to delegate user
      // TODO: Update approval_delegations table if permanent delegation

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Approval delegated successfully'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error delegating approval:', error);
    return NextResponse.json(
      { error: 'Failed to delegate approval', details: error.message },
      { status: 500 }
    );
  }
}
