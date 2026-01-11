import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST /api/workflows/approvals/[id]/approve - Approve a workflow step
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

    await query('BEGIN');

    try {
      // Get approval details
      const approvalResult = await query(
        `SELECT wa.*, wi.workflow_id, wi.document_type, wi.document_id, ws.step_order
        FROM workflow_approvals wa
        JOIN workflow_instances wi ON wa.instance_id = wi.id
        JOIN workflow_steps ws ON wa.step_id = ws.id
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
        SET status = 'approved', completed_at = NOW(), updated_at = NOW()
        WHERE id = $1`,
        [approvalId]
      );

      // Log in workflow history
      await query(
        `INSERT INTO workflow_history
        (instance_id, step_id, action, performed_by, comments)
        VALUES ($1, $2, 'approved', $3, $4)`,
        [approval.instance_id, approval.step_id, user_id, comments]
      );

      // Check if all approvals for this step are complete (for parallel approvals)
      const pendingApprovals = await query(
        `SELECT COUNT(*) as pending_count
        FROM workflow_approvals
        WHERE instance_id = $1 AND step_id = $2 AND status = 'pending'`,
        [approval.instance_id, approval.step_id]
      );

      // If no pending approvals, move to next step
      if (parseInt(pendingApprovals.rows[0].pending_count) === 0) {
        // Get next step
        const nextStepResult = await query(
          `SELECT * FROM workflow_steps
          WHERE workflow_id = $1 AND step_order > $2
          ORDER BY step_order ASC
          LIMIT 1`,
          [approval.workflow_id, approval.step_order]
        );

        if (nextStepResult.rows.length > 0) {
          // Move to next step
          const nextStep = nextStepResult.rows[0];

          await query(
            `UPDATE workflow_instances
            SET current_step_id = $1, updated_at = NOW()
            WHERE id = $2`,
            [nextStep.id, approval.instance_id]
          );

          // Create approval records for next step
          const approvers = await getApprovers(nextStep);

          for (const approverId of approvers) {
            const dueDate = nextStep.timeout_hours
              ? new Date(Date.now() + nextStep.timeout_hours * 60 * 60 * 1000)
              : null;

            await query(
              `INSERT INTO workflow_approvals
              (instance_id, step_id, approver_id, due_at)
              VALUES ($1, $2, $3, $4)`,
              [approval.instance_id, nextStep.id, approverId, dueDate]
            );

            // TODO: Send notification to approver
          }
        } else {
          // No more steps, mark workflow as completed
          await query(
            `UPDATE workflow_instances
            SET status = 'approved', completed_at = NOW(), completed_by = $1, updated_at = NOW()
            WHERE id = $2`,
            [user_id, approval.instance_id]
          );

          // TODO: Trigger post-approval actions (update document status, send notifications, etc.)
        }
      }

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Approval processed successfully'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { error: 'Failed to process approval', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get approvers for a step
async function getApprovers(step: any): Promise<number[]> {
  const approvers: number[] = [];

  if (step.approver_type === 'user' && step.approver_user_id) {
    approvers.push(step.approver_user_id);
  } else if (step.approver_type === 'role' && step.approver_role_id) {
    // Get all users with this role
    const result = await query(
      `SELECT id FROM users WHERE role_id = $1 AND id IS NOT NULL`,
      [step.approver_role_id]
    );
    approvers.push(...result.rows.map(r => r.id));
  } else if (step.approver_type === 'dynamic' && step.approver_expression) {
    // TODO: Implement dynamic approver resolution
    // For now, return empty array
  }

  return approvers;
}
