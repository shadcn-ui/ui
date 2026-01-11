import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/workflows/approvals - Get pending approvals for current user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status') || 'pending';

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        wa.id as approval_id,
        wa.status as approval_status,
        wa.assigned_at,
        wa.due_at,
        wa.is_escalated,
        wi.id as instance_id,
        wi.document_type,
        wi.document_id,
        wi.initiated_at,
        wi.metadata,
        wd.name as workflow_name,
        wd.description as workflow_description,
        ws.step_name,
        ws.step_order,
        u.first_name || ' ' || u.last_name as initiated_by_name,
        u.email as initiated_by_email
      FROM workflow_approvals wa
      JOIN workflow_instances wi ON wa.instance_id = wi.id
      JOIN workflow_definitions wd ON wi.workflow_id = wd.id
      JOIN workflow_steps ws ON wa.step_id = ws.id
      JOIN users u ON wi.initiated_by = u.id
      WHERE wa.approver_id = $1
        AND wa.status = $2
      ORDER BY 
        CASE WHEN wa.is_escalated THEN 0 ELSE 1 END,
        wa.due_at NULLS LAST,
        wa.assigned_at DESC
    `;

    const result = await query(sql, [userId, status]);

    return NextResponse.json({
      approvals: result.rows,
      count: result.rows.length
    });
  } catch (error: any) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approvals', details: error.message },
      { status: 500 }
    );
  }
}
