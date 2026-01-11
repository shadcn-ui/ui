import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/projects/expenses - List project expenses
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const project_id = searchParams.get('project_id');
    const expense_status = searchParams.get('expense_status');
    const submitted_by = searchParams.get('submitted_by');
    const expense_category = searchParams.get('expense_category');
    const from_date = searchParams.get('from_date');
    const to_date = searchParams.get('to_date');

    let conditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (project_id) {
      conditions.push(`e.project_id = $${paramIndex++}`);
      params.push(project_id);
    }

    if (expense_status) {
      conditions.push(`e.expense_status = $${paramIndex++}`);
      params.push(expense_status);
    }

    if (submitted_by) {
      conditions.push(`e.submitted_by = $${paramIndex++}`);
      params.push(submitted_by);
    }

    if (expense_category) {
      conditions.push(`e.expense_category = $${paramIndex++}`);
      params.push(expense_category);
    }

    if (from_date) {
      conditions.push(`e.expense_date >= $${paramIndex++}`);
      params.push(from_date);
    }

    if (to_date) {
      conditions.push(`e.expense_date <= $${paramIndex++}`);
      params.push(to_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
      `SELECT e.*, p.project_name, p.project_code, pt.task_name
       FROM project_expenses e
       JOIN projects p ON e.project_id = p.project_id
       LEFT JOIN project_tasks pt ON e.task_id = pt.task_id
       ${whereClause}
       ORDER BY e.expense_date DESC, e.created_at DESC`,
      params
    );

    // Calculate statistics
    const stats = await query(
      `SELECT 
        COUNT(*) as total_expenses,
        SUM(expense_amount) as total_amount,
        SUM(CASE WHEN expense_status = 'approved' THEN expense_amount ELSE 0 END) as approved_amount,
        SUM(CASE WHEN expense_status = 'submitted' THEN expense_amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN is_billable = TRUE THEN billable_amount ELSE 0 END) as total_billable,
        SUM(CASE WHEN is_invoiced = FALSE AND is_billable = TRUE THEN billable_amount ELSE 0 END) as unbilled_amount
       FROM project_expenses e
       ${whereClause}`,
      params
    );

    return NextResponse.json({
      expenses: result.rows,
      statistics: stats.rows[0]
    });

  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/projects/expenses - Submit expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      project_id, task_id, budget_id, expense_date, expense_category,
      expense_description, expense_amount, currency = 'USD',
      submitted_by, vendor_name, receipt_number, receipt_url,
      is_billable = true, is_reimbursable = false, markup_percentage = 0,
      payment_method
    } = body;

    if (!project_id || !expense_date || !expense_category || !expense_description || !expense_amount || !submitted_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const billable_amount = is_billable ? expense_amount * (1 + markup_percentage / 100) : null;

    const result = await query(
      `INSERT INTO project_expenses (
        project_id, task_id, budget_id, expense_date, expense_category,
        expense_description, expense_amount, currency, submitted_by,
        vendor_name, receipt_number, receipt_url,
        is_billable, is_reimbursable, markup_percentage, billable_amount,
        payment_method, expense_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'submitted')
      RETURNING *`,
      [project_id, task_id, budget_id, expense_date, expense_category,
       expense_description, expense_amount, currency, submitted_by,
       vendor_name, receipt_number, receipt_url,
       is_billable, is_reimbursable, markup_percentage, billable_amount,
       payment_method]
    );

    return NextResponse.json({
      message: 'Expense submitted successfully',
      expense: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting expense:', error);
    return NextResponse.json(
      { error: 'Failed to submit expense', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/projects/expenses/approve - Approve expenses
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { expense_ids, approved_by, action = 'approve', rejection_reason } = body;

    if (!expense_ids || !Array.isArray(expense_ids) || expense_ids.length === 0 || !approved_by) {
      return NextResponse.json(
        { error: 'expense_ids (array) and approved_by are required' },
        { status: 400 }
      );
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const placeholders = expense_ids.map((_, i) => `$${i + 1}`).join(', ');

    const updateQuery = `
      UPDATE project_expenses
      SET expense_status = $${expense_ids.length + 1}, 
          approved_by = $${expense_ids.length + 2}, 
          approved_at = CURRENT_TIMESTAMP,
          rejection_reason = $${expense_ids.length + 3},
          updated_at = CURRENT_TIMESTAMP
      WHERE expense_id IN (${placeholders}) AND expense_status = 'submitted'
      RETURNING *
    `;

    const result = await query(updateQuery, [...expense_ids, newStatus, approved_by, rejection_reason || null]);

    return NextResponse.json({
      message: `${result.rows.length} expense(s) ${action}d successfully`,
      expenses: result.rows
    });

  } catch (error: any) {
    console.error('Error approving expenses:', error);
    return NextResponse.json(
      { error: 'Failed to approve expenses', details: error.message },
      { status: 500 }
    );
  }
}
