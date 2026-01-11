import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/workflows/instances/[id] - Get workflow instance details with history
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const instanceId = params.id;

    // Get instance details
    const instanceResult = await query(
      `SELECT
        wi.*,
        wd.name as workflow_name,
        wd.description as workflow_description,
        wd.module,
        ws.name as current_step_name,
        ws.step_order as current_step_order,
        u.name as initiated_by_name
      FROM workflow_instances wi
      JOIN workflow_definitions wd ON wi.workflow_id = wd.id
      LEFT JOIN workflow_steps ws ON wi.current_step_id = ws.id
      LEFT JOIN users u ON wi.initiated_by = u.id
      WHERE wi.id = $1`,
      [instanceId]
    );

    if (instanceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Workflow instance not found' },
        { status: 404 }
      );
    }

    const instance = instanceResult.rows[0];

    // Get all steps for this workflow
    const stepsResult = await query(
      `SELECT * FROM workflow_steps
      WHERE workflow_id = $1
      ORDER BY step_order ASC`,
      [instance.workflow_id]
    );

    // Get all approvals for this instance
    const approvalsResult = await query(
      `SELECT
        wa.*,
        ws.name as step_name,
        ws.step_order,
        u.name as approver_name,
        u2.name as delegated_from_name
      FROM workflow_approvals wa
      JOIN workflow_steps ws ON wa.step_id = ws.id
      JOIN users u ON wa.approver_id = u.id
      LEFT JOIN users u2 ON wa.delegated_from = u2.id
      WHERE wa.instance_id = $1
      ORDER BY ws.step_order ASC, wa.assigned_at ASC`,
      [instanceId]
    );

    // Get workflow history
    const historyResult = await query(
      `SELECT
        wh.*,
        ws.name as step_name,
        ws.step_order,
        u.name as performed_by_name
      FROM workflow_history wh
      LEFT JOIN workflow_steps ws ON wh.step_id = ws.id
      LEFT JOIN users u ON wh.performed_by = u.id
      WHERE wh.instance_id = $1
      ORDER BY wh.created_at DESC`,
      [instanceId]
    );

    return NextResponse.json({
      instance,
      steps: stepsResult.rows,
      approvals: approvalsResult.rows,
      history: historyResult.rows
    });

  } catch (error: any) {
    console.error('Error fetching workflow instance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow instance', details: error.message },
      { status: 500 }
    );
  }
}
