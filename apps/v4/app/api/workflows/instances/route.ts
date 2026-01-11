import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/workflows/instances - List workflow instances
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const document_type = searchParams.get('document_type');
    const initiated_by = searchParams.get('initiated_by');

    let sql = `
      SELECT
        wi.*,
        wd.name as workflow_name,
        wd.module,
        ws.name as current_step_name,
        u.name as initiated_by_name
      FROM workflow_instances wi
      JOIN workflow_definitions wd ON wi.workflow_id = wd.id
      LEFT JOIN workflow_steps ws ON wi.current_step_id = ws.id
      LEFT JOIN users u ON wi.initiated_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND wi.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (document_type) {
      sql += ` AND wi.document_type = $${paramIndex}`;
      params.push(document_type);
      paramIndex++;
    }

    if (initiated_by) {
      sql += ` AND wi.initiated_by = $${paramIndex}`;
      params.push(initiated_by);
      paramIndex++;
    }

    sql += ' ORDER BY wi.created_at DESC';

    const result = await query(sql, params);

    return NextResponse.json({
      instances: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Error fetching workflow instances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow instances', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/workflows/instances - Start a new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workflow_id,
      document_type,
      document_id,
      initiated_by,
      metadata
    } = body;

    // Validate required fields
    if (!workflow_id || !document_type || !document_id || !initiated_by) {
      return NextResponse.json(
        { error: 'workflow_id, document_type, document_id, and initiated_by are required' },
        { status: 400 }
      );
    }

    await query('BEGIN');

    try {
      // Get workflow definition
      const workflowResult = await query(
        `SELECT * FROM workflow_definitions WHERE id = $1 AND is_active = true`,
        [workflow_id]
      );

      if (workflowResult.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'Workflow definition not found or inactive' },
          { status: 404 }
        );
      }

      // Get first step
      const firstStepResult = await query(
        `SELECT * FROM workflow_steps
        WHERE workflow_id = $1
        ORDER BY step_order ASC
        LIMIT 1`,
        [workflow_id]
      );

      if (firstStepResult.rows.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'No steps defined for this workflow' },
          { status: 400 }
        );
      }

      const firstStep = firstStepResult.rows[0];

      // Create workflow instance
      const instanceResult = await query(
        `INSERT INTO workflow_instances
        (workflow_id, document_type, document_id, current_step_id, status, initiated_by, metadata)
        VALUES ($1, $2, $3, $4, 'in_progress', $5, $6)
        RETURNING *`,
        [workflow_id, document_type, document_id, firstStep.id, initiated_by, metadata ? JSON.stringify(metadata) : null]
      );

      const instance = instanceResult.rows[0];

      // Create approval records for first step
      const approvers = await getApprovers(firstStep);

      if (approvers.length === 0) {
        await query('ROLLBACK');
        return NextResponse.json(
          { error: 'No approvers found for first step' },
          { status: 400 }
        );
      }

      for (const approverId of approvers) {
        const dueDate = firstStep.timeout_hours
          ? new Date(Date.now() + firstStep.timeout_hours * 60 * 60 * 1000)
          : null;

        await query(
          `INSERT INTO workflow_approvals
          (instance_id, step_id, approver_id, due_at)
          VALUES ($1, $2, $3, $4)`,
          [instance.id, firstStep.id, approverId, dueDate]
        );

        // TODO: Send notification to approver
      }

      // Log workflow start
      await query(
        `INSERT INTO workflow_history
        (instance_id, step_id, action, performed_by, comments)
        VALUES ($1, $2, 'started', $3, 'Workflow initiated')`,
        [instance.id, firstStep.id, initiated_by]
      );

      await query('COMMIT');

      return NextResponse.json({
        success: true,
        instance: instance,
        message: 'Workflow started successfully'
      });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error starting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to start workflow', details: error.message },
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
