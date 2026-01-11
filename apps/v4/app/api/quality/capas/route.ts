import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

// GET /api/quality/capas - List and search CAPAs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const capaType = searchParams.get('capa_type');
    const assignedTo = searchParams.get('assigned_to');
    const overdue = searchParams.get('overdue') === 'true';
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = `
      SELECT 
        c.*,
        COUNT(DISTINCT ca.id) AS action_count,
        COUNT(DISTINCT CASE WHEN ca.status = 'completed' THEN ca.id END) AS completed_action_count,
        COUNT(DISTINCT cv.id) AS verification_count,
        CASE 
          WHEN c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled') THEN true
          ELSE false
        END AS is_overdue
      FROM capas c
      LEFT JOIN capa_actions ca ON ca.capa_id = c.id
      LEFT JOIN capa_verifications cv ON cv.capa_id = c.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      query += ` AND c.priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    if (capaType) {
      query += ` AND c.capa_type = $${paramIndex}`;
      params.push(capaType);
      paramIndex++;
    }

    if (assignedTo) {
      query += ` AND c.assigned_to = $${paramIndex}`;
      params.push(parseInt(assignedTo));
      paramIndex++;
    }

    if (overdue) {
      query += ` AND c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled')`;
    }

    if (startDate) {
      query += ` AND c.created_at >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND c.created_at <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += `
      GROUP BY c.id
      ORDER BY 
        CASE WHEN c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled') THEN 0 ELSE 1 END,
        c.priority DESC,
        c.due_date ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM capas c WHERE 1=1`;
    const countParams: any[] = [];
    let countIndex = 1;

    if (status) {
      countQuery += ` AND c.status = $${countIndex}`;
      countParams.push(status);
      countIndex++;
    }
    if (priority) {
      countQuery += ` AND c.priority = $${countIndex}`;
      countParams.push(priority);
      countIndex++;
    }
    if (capaType) {
      countQuery += ` AND c.capa_type = $${countIndex}`;
      countParams.push(capaType);
      countIndex++;
    }
    if (assignedTo) {
      countQuery += ` AND c.assigned_to = $${countIndex}`;
      countParams.push(parseInt(assignedTo));
      countIndex++;
    }
    if (overdue) {
      countQuery += ` AND c.due_date < CURRENT_DATE AND c.status NOT IN ('closed', 'cancelled')`;
    }

    const countResult = await pool.query(countQuery, countParams);

    return NextResponse.json({
      capas: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit,
        offset,
        hasMore: offset + limit < parseInt(countResult.rows[0].count),
      },
    });
  } catch (error: any) {
    console.error('Error fetching CAPAs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CAPAs', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/quality/capas - Create new CAPA
export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      capa_type,
      priority,
      source,
      source_reference,
      ncr_id,
      problem_statement,
      root_cause,
      root_cause_analysis_method,
      assigned_to,
      due_date,
      created_by,
      actions = [],
    } = body;

    if (!title || !capa_type || !priority || !problem_statement || !assigned_to || !due_date || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Generate CAPA number
    const capaNumberResult = await client.query(`
      SELECT COALESCE(MAX(CAST(SUBSTRING(capa_number FROM 6) AS INTEGER)), 0) + 1 AS next_number
      FROM capas
      WHERE capa_number LIKE 'CAPA-%'
    `);
    const capaNumber = `CAPA-${String(capaNumberResult.rows[0].next_number).padStart(6, '0')}`;

    // Insert CAPA
    const capaResult = await client.query(`
      INSERT INTO capas (
        capa_number,
        title,
        description,
        capa_type,
        priority,
        status,
        source,
        source_reference,
        ncr_id,
        problem_statement,
        root_cause,
        root_cause_analysis_method,
        assigned_to,
        due_date,
        created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      capaNumber,
      title,
      description,
      capa_type,
      priority,
      'open',
      source,
      source_reference,
      ncr_id,
      problem_statement,
      root_cause,
      root_cause_analysis_method,
      assigned_to,
      due_date,
      created_by,
    ]);

    const capa = capaResult.rows[0];

    // Insert CAPA actions
    if (actions.length > 0) {
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        await client.query(`
          INSERT INTO capa_actions (
            capa_id,
            action_sequence,
            action_description,
            responsible_person,
            due_date,
            status
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          capa.id,
          i + 1,
          action.action_description,
          action.responsible_person,
          action.due_date,
          'pending',
        ]);
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'CAPA created successfully',
      capa: {
        ...capa,
        actions_added: actions.length,
      },
    }, { status: 201 });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating CAPA:', error);
    return NextResponse.json(
      { error: 'Failed to create CAPA', details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
