import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/workflows/definitions - List all workflow definitions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    const isActive = searchParams.get('is_active');

    let sql = `
      SELECT 
        wd.*,
        u.first_name || ' ' || u.last_name as created_by_name,
        COUNT(DISTINCT ws.id) as steps_count,
        COUNT(DISTINCT wi.id) as active_instances_count
      FROM workflow_definitions wd
      LEFT JOIN users u ON wd.created_by = u.id
      LEFT JOIN workflow_steps ws ON ws.workflow_id = wd.id
      LEFT JOIN workflow_instances wi ON wi.workflow_id = wd.id AND wi.status IN ('pending', 'in_progress')
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (module) {
      sql += ` AND wd.module = $${paramIndex}`;
      params.push(module);
      paramIndex++;
    }

    if (isActive !== null) {
      sql += ` AND wd.is_active = $${paramIndex}`;
      params.push(isActive === 'true');
      paramIndex++;
    }

    sql += ` GROUP BY wd.id, u.first_name, u.last_name ORDER BY wd.created_at DESC`;

    const result = await query(sql, params);

    return NextResponse.json({
      workflows: result.rows,
      count: result.rows.length
    });
  } catch (error: any) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/workflows/definitions - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      module,
      document_type,
      trigger_event,
      is_active = true,
      created_by,
      steps = []
    } = body;

    // Validate required fields
    if (!name || !module || !document_type || !trigger_event) {
      return NextResponse.json(
        { error: 'Missing required fields: name, module, document_type, trigger_event' },
        { status: 400 }
      );
    }

    // Start transaction
    await query('BEGIN');

    try {
      // Insert workflow definition
      const workflowResult = await query(
        `INSERT INTO workflow_definitions 
        (name, description, module, document_type, trigger_event, is_active, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [name, description, module, document_type, trigger_event, is_active, created_by]
      );

      const workflowId = workflowResult.rows[0].id;

      // Insert workflow steps
      if (steps.length > 0) {
        for (const step of steps) {
          await query(
            `INSERT INTO workflow_steps
            (workflow_id, step_order, step_name, step_type, approver_type, 
             approver_role_id, approver_user_id, approver_expression,
             is_parallel, require_all_approvals, timeout_hours, 
             escalation_user_id, conditions, actions)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [
              workflowId,
              step.step_order,
              step.step_name,
              step.step_type,
              step.approver_type || null,
              step.approver_role_id || null,
              step.approver_user_id || null,
              step.approver_expression || null,
              step.is_parallel || false,
              step.require_all_approvals !== false, // Default true
              step.timeout_hours || null,
              step.escalation_user_id || null,
              JSON.stringify(step.conditions || {}),
              JSON.stringify(step.actions || [])
            ]
          );
        }
      }

      await query('COMMIT');

      // Fetch complete workflow with steps
      const completeWorkflow = await query(
        `SELECT wd.*, 
          json_agg(
            json_build_object(
              'id', ws.id,
              'step_order', ws.step_order,
              'step_name', ws.step_name,
              'step_type', ws.step_type,
              'approver_type', ws.approver_type,
              'approver_role_id', ws.approver_role_id,
              'approver_user_id', ws.approver_user_id,
              'is_parallel', ws.is_parallel,
              'timeout_hours', ws.timeout_hours
            ) ORDER BY ws.step_order
          ) as steps
        FROM workflow_definitions wd
        LEFT JOIN workflow_steps ws ON ws.workflow_id = wd.id
        WHERE wd.id = $1
        GROUP BY wd.id`,
        [workflowId]
      );

      return NextResponse.json({
        success: true,
        workflow: completeWorkflow.rows[0]
      }, { status: 201 });

    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow', details: error.message },
      { status: 500 }
    );
  }
}
