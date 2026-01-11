import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/workflows/approvals/[id]/reject - Reject a workflow step
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const approvalId = params.id;
    const body = await request.json();
    const { user_id, comments } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    if (!comments) {
      return NextResponse.json(
        { error: 'Rejection reason (comments) is required' },
        { status: 400 }
      );
    }

    await query('BEGIN');

    try {
      // Get approval details
      const approvalResult = await query(
        `SELECT wa.*, wi.workflow_id, wi.document_type, wi.document_id
        FROM workflow_approvals wa
        JOIN workflow_instances wi ON wa.instance_id = wi.id
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

      // Update approval status
      await query(
        `UPDATE workflow_approvals
        SET status = 'rejected', completed_at = NOW(), updated_at = NOW()
        WHERE id = $1`,
        [approvalId]
      );

      // Log in workflow history
      await query(
        `INSERT INTO workflow_history
        (instance_id, step_id, action, performed_by, comments)
        VALUES ($1, $2, 'rejected', $3, $4)`,
        [approval.instance_id, approval.step_id, user_id, comments]
      );

      // Mark workflow instance as rejected
      await query(
        `UPDATE workflow_instances
        SET status = 'rejected', completed_at = NOW(), completed_by = $1, updated_at = NOW()
        WHERE id = $2`,
        [user_id, approval.instance_id]
      );

      // Cancel all other pending approvals for this workflow
      await query(
        `UPDATE workflow_approvals
        SET status = 'cancelled', updated_at = NOW()
        WHERE instance_id = $1 AND status = 'pending'`,
        [approval.instance_id]
      );

      // TODO: Send rejection notifications to initiator and other stakeholders
      // TODO: Update document status if needed

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Workflow rejected successfully'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error processing rejection:', error);
    return NextResponse.json(
      { error: 'Failed to process rejection', details: error.message },
      { status: 500 }
    );
  }
}
