import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/nurture-workflows
 * List nurture workflows
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let whereConditions = ['w.is_active = true'];
    const values: any[] = [];
    let valueIndex = 1;

    if (status) {
      whereConditions.push(`w.status = $${valueIndex}`);
      values.push(status);
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const query = `
      SELECT 
        w.*,
        (SELECT COUNT(*) FROM crm_lead_nurture_steps WHERE workflow_id = w.workflow_id AND is_active = true) as step_count,
        CASE 
          WHEN w.total_enrolled > 0 THEN ROUND((w.total_completed::numeric / w.total_enrolled * 100), 2)
          ELSE 0
        END as completion_rate
      FROM crm_lead_nurture_workflows w
      ${whereClause}
      ORDER BY w.created_at DESC
    `;

    const result = await pool.query(query, values);

    return NextResponse.json({
      workflows: result.rows,
    });
  } catch (error) {
    console.error('Error fetching nurture workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nurture workflows' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/nurture-workflows
 * Create nurture workflow
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workflow_name,
      description,
      trigger_type,
      trigger_score_min,
      trigger_score_max,
      status = 'draft',
    } = body;

    if (!workflow_name || !trigger_type) {
      return NextResponse.json(
        { error: 'Missing required fields: workflow_name, trigger_type' },
        { status: 400 }
      );
    }

    // Generate workflow code
    const codeResult = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(workflow_code FROM 5) AS INTEGER)), 0) + 1 as next_number
       FROM crm_lead_nurture_workflows 
       WHERE workflow_code LIKE 'WF-%'`
    );
    const nextNumber = codeResult.rows[0].next_number;
    const workflowCode = `WF-${String(nextNumber).padStart(6, '0')}`;

    const insertQuery = `
      INSERT INTO crm_lead_nurture_workflows (
        workflow_name, workflow_code, description, trigger_type,
        trigger_score_min, trigger_score_max, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      workflow_name,
      workflowCode,
      description,
      trigger_type,
      trigger_score_min,
      trigger_score_max,
      status,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating nurture workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create nurture workflow' },
      { status: 500 }
    );
  }
}
