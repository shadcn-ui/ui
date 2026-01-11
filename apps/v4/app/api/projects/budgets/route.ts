import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/budgets - List project budgets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const phase_id = searchParams.get('phase_id');
    const budget_category = searchParams.get('budget_category');

    let conditions: string[] = ['is_active = TRUE'];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_id) {
      conditions.push(`project_id = $${paramIndex++}`);
      params.push(project_id);
    }

    if (phase_id) {
      conditions.push(`phase_id = $${paramIndex++}`);
      params.push(phase_id);
    }

    if (budget_category) {
      conditions.push(`budget_category = $${paramIndex++}`);
      params.push(budget_category);
    }

    const result = await query(
      `SELECT b.*, p.project_name, ph.phase_name
       FROM project_budgets b
       JOIN projects p ON b.project_id = p.project_id
       LEFT JOIN project_phases ph ON b.phase_id = ph.phase_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY b.budget_category, b.created_at DESC`,
      params
    );

    // Calculate summary
    const summary = await query(
      `SELECT 
        SUM(budgeted_amount) as total_budgeted,
        SUM(actual_amount) as total_actual,
        SUM(variance_amount) as total_variance,
        SUM(committed_amount) as total_committed
       FROM project_budgets
       WHERE ${conditions.join(' AND ')}`,
      params
    );

    return NextResponse.json({
      budgets: result.rows,
      summary: summary.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/budgets - Create budget
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id, phase_id, budget_category, budget_subcategory,
      budgeted_amount, description, created_by
    } = body;

    if (!project_id || !budget_category || !budgeted_amount) {
      return NextResponse.json(
        { error: 'Missing required fields: project_id, budget_category, budgeted_amount' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO project_budgets (
        project_id, phase_id, budget_category, budget_subcategory,
        budgeted_amount, description, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [project_id, phase_id, budget_category, budget_subcategory, budgeted_amount, description, created_by]
    );

    return NextResponse.json({
      message: 'Budget created successfully',
      budget: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget', details: error.message },
      { status: 500 }
    );
  }
}
