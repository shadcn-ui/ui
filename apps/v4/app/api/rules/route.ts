import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/rules - Get all business rules
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const module = searchParams.get('module');
    const event_type = searchParams.get('event_type');
    const is_active = searchParams.get('is_active');

    let sql = `
      SELECT
        br.*,
        u.name as created_by_name
      FROM business_rules br
      LEFT JOIN users u ON br.created_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (module) {
      sql += ` AND br.module = $${paramIndex}`;
      params.push(module);
      paramIndex++;
    }

    if (event_type) {
      sql += ` AND br.event_type = $${paramIndex}`;
      params.push(event_type);
      paramIndex++;
    }

    if (is_active !== null) {
      sql += ` AND br.is_active = $${paramIndex}`;
      params.push(is_active === 'true');
      paramIndex++;
    }

    sql += ' ORDER BY br.priority DESC, br.name ASC';

    const result = await query(sql, params);

    return NextResponse.json({
      rules: result.rows,
      count: result.rows.length
    });

  } catch (error: any) {
    console.error('Error fetching business rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business rules', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/rules - Create new business rule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      module,
      event_type,
      conditions,
      actions,
      priority = 0,
      is_active = true,
      created_by
    } = body;

    if (!name || !module || !event_type || !conditions || !actions) {
      return NextResponse.json(
        { error: 'name, module, event_type, conditions, and actions are required' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO business_rules
      (name, description, module, event_type, conditions, actions, priority, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        name,
        description,
        module,
        event_type,
        JSON.stringify(conditions),
        JSON.stringify(actions),
        priority,
        is_active,
        created_by
      ]
    );

    return NextResponse.json({
      success: true,
      rule: result.rows[0]
    });

  } catch (error: any) {
    console.error('Error creating business rule:', error);
    return NextResponse.json(
      { error: 'Failed to create business rule', details: error.message },
      { status: 500 }
    );
  }
}
