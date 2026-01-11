import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mac@localhost:5432/ocean-erp',
});

/**
 * GET /api/crm/cases
 * List cases with filtering and search
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('account_id');
    const status = searchParams.get('status');
    const priorityId = searchParams.get('priority_id');
    const typeId = searchParams.get('case_type_id');
    const ownerId = searchParams.get('owner_id');
    const isEscalated = searchParams.get('is_escalated');
    const slaViolated = searchParams.get('sla_violated');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let whereConditions = ['c.is_active = true'];
    const values: any[] = [];
    let valueIndex = 1;

    if (accountId) {
      whereConditions.push(`c.account_id = $${valueIndex}`);
      values.push(parseInt(accountId));
      valueIndex++;
    }

    if (status) {
      whereConditions.push(`c.status = $${valueIndex}`);
      values.push(status);
      valueIndex++;
    }

    if (priorityId) {
      whereConditions.push(`c.priority_id = $${valueIndex}`);
      values.push(parseInt(priorityId));
      valueIndex++;
    }

    if (typeId) {
      whereConditions.push(`c.case_type_id = $${valueIndex}`);
      values.push(parseInt(typeId));
      valueIndex++;
    }

    if (ownerId) {
      whereConditions.push(`c.owner_id = $${valueIndex}`);
      values.push(parseInt(ownerId));
      valueIndex++;
    }

    if (isEscalated === 'true') {
      whereConditions.push('c.is_escalated = true');
    }

    if (slaViolated === 'true') {
      whereConditions.push(`(
        (c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due) OR
        (c.resolved_at IS NULL AND c.status NOT IN ('resolved', 'closed') AND CURRENT_TIMESTAMP > c.resolution_due)
      )`);
    }

    if (search) {
      whereConditions.push(`(
        c.case_number ILIKE $${valueIndex} OR
        c.subject ILIKE $${valueIndex} OR
        c.description ILIKE $${valueIndex}
      )`);
      values.push(`%${search}%`);
      valueIndex++;
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get cases with related data
    values.push(limit, offset);
    const query = `
      SELECT 
        c.*,
        a.account_name,
        con.full_name as contact_name,
        con.primary_email as contact_email,
        ct.type_name as case_type_name,
        ct.icon as case_type_icon,
        ct.color as case_type_color,
        cp.priority_name,
        cp.priority_level,
        cp.color as priority_color,
        sp.policy_name as sla_policy_name,
        (SELECT COUNT(*) FROM crm_case_comments WHERE case_id = c.case_id) as comment_count,
        (SELECT COUNT(*) FROM crm_case_attachments WHERE case_id = c.case_id) as attachment_count,
        (SELECT COUNT(*) FROM crm_case_escalations WHERE case_id = c.case_id AND is_active = true) as escalation_count,
        CASE 
          WHEN c.status IN ('resolved', 'closed') THEN false
          WHEN c.first_response_at IS NULL AND CURRENT_TIMESTAMP > c.first_response_due THEN true
          WHEN c.resolved_at IS NULL AND CURRENT_TIMESTAMP > c.resolution_due THEN true
          ELSE false
        END as is_sla_violated,
        CASE
          WHEN c.first_response_at IS NULL THEN 
            EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - c.created_at))/3600
          ELSE NULL
        END as hours_since_creation,
        CASE
          WHEN c.first_response_due IS NOT NULL AND c.first_response_at IS NULL THEN
            EXTRACT(EPOCH FROM (c.first_response_due - CURRENT_TIMESTAMP))/3600
          ELSE NULL
        END as hours_until_first_response_due,
        CASE
          WHEN c.resolution_due IS NOT NULL AND c.resolved_at IS NULL THEN
            EXTRACT(EPOCH FROM (c.resolution_due - CURRENT_TIMESTAMP))/3600
          ELSE NULL
        END as hours_until_resolution_due
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      LEFT JOIN crm_sla_policies sp ON c.sla_policy_id = sp.sla_policy_id
      ${whereClause}
      ORDER BY 
        CASE WHEN c.status IN ('resolved', 'closed') THEN 1 ELSE 0 END,
        cp.priority_level DESC,
        c.created_at DESC
      LIMIT $${valueIndex} OFFSET $${valueIndex + 1}
    `;

    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM crm_cases c
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values.slice(0, -2));
    const total = parseInt(countResult.rows[0].total);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_cases,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'open') as open_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'waiting_customer') as waiting_customer_count,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_count,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
        COUNT(*) FILTER (WHERE is_escalated = true) as escalated_count,
        COUNT(*) FILTER (
          WHERE (first_response_at IS NULL AND CURRENT_TIMESTAMP > first_response_due) OR
                (resolved_at IS NULL AND status NOT IN ('resolved', 'closed') AND CURRENT_TIMESTAMP > resolution_due)
        ) as sla_violated_count,
        AVG(CASE WHEN response_time_minutes IS NOT NULL THEN response_time_minutes END) as avg_response_time_minutes,
        AVG(CASE WHEN resolution_time_minutes IS NOT NULL THEN resolution_time_minutes END) as avg_resolution_time_minutes
      FROM crm_cases c
      ${whereClause}
    `;
    const statsResult = await pool.query(statsQuery, values.slice(0, -2));

    return NextResponse.json({
      cases: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: statsResult.rows[0],
    });
  } catch (error) {
    console.error('Error fetching cases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/crm/cases
 * Create a new case
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      account_id,
      contact_id,
      subject,
      description,
      case_type_id,
      priority_id,
      status = 'new',
      channel,
      owner_id,
      sla_policy_id,
      parent_case_id,
    } = body;

    // Validate required fields
    if (!account_id || !subject || !case_type_id || !priority_id) {
      return NextResponse.json(
        { error: 'Missing required fields: account_id, subject, case_type_id, priority_id' },
        { status: 400 }
      );
    }

    // Verify account exists
    const accountCheck = await pool.query(
      'SELECT account_id FROM crm_accounts WHERE account_id = $1 AND is_active = true',
      [account_id]
    );
    if (accountCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Verify case type and priority exist
    const typeCheck = await pool.query(
      'SELECT case_type_id FROM crm_case_types WHERE case_type_id = $1 AND is_active = true',
      [case_type_id]
    );
    if (typeCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Case type not found' },
        { status: 404 }
      );
    }

    const priorityCheck = await pool.query(
      'SELECT priority_id FROM crm_case_priorities WHERE priority_id = $1 AND is_active = true',
      [priority_id]
    );
    if (priorityCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Priority not found' },
        { status: 404 }
      );
    }

    // Auto-assign SLA policy if not provided
    let finalSlaPolicy = sla_policy_id;
    if (!finalSlaPolicy) {
      const slaQuery = await pool.query(
        `SELECT sla_policy_id FROM crm_sla_policies 
         WHERE is_active = true 
         AND (applies_to_case_type_id = $1 OR applies_to_case_type_id IS NULL)
         AND (applies_to_priority_id = $2 OR applies_to_priority_id IS NULL)
         ORDER BY 
           CASE WHEN applies_to_case_type_id IS NOT NULL THEN 1 ELSE 2 END,
           CASE WHEN applies_to_priority_id IS NOT NULL THEN 1 ELSE 2 END
         LIMIT 1`,
        [case_type_id, priority_id]
      );
      if (slaQuery.rows.length > 0) {
        finalSlaPolicy = slaQuery.rows[0].sla_policy_id;
      }
    }

    // Generate case number
    const caseNumberResult = await pool.query(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(case_number FROM 6) AS INTEGER)), 0) + 1 as next_number
       FROM crm_cases 
       WHERE case_number LIKE 'CASE-%'`
    );
    const nextNumber = caseNumberResult.rows[0].next_number;
    const caseNumber = `CASE-${String(nextNumber).padStart(6, '0')}`;

    // Insert case
    const insertQuery = `
      INSERT INTO crm_cases (
        case_number, account_id, contact_id, subject, description,
        case_type_id, priority_id, status, channel, owner_id,
        sla_policy_id, parent_case_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      caseNumber,
      account_id,
      contact_id,
      subject,
      description,
      case_type_id,
      priority_id,
      status,
      channel,
      owner_id,
      finalSlaPolicy,
      parent_case_id,
    ]);

    // Fetch complete case data with related info
    const caseData = await pool.query(
      `SELECT 
        c.*,
        a.account_name,
        con.full_name as contact_name,
        ct.type_name as case_type_name,
        cp.priority_name,
        sp.policy_name as sla_policy_name
      FROM crm_cases c
      JOIN crm_accounts a ON c.account_id = a.account_id
      LEFT JOIN crm_contacts con ON c.contact_id = con.contact_id
      JOIN crm_case_types ct ON c.case_type_id = ct.case_type_id
      JOIN crm_case_priorities cp ON c.priority_id = cp.priority_id
      LEFT JOIN crm_sla_policies sp ON c.sla_policy_id = sp.sla_policy_id
      WHERE c.case_id = $1`,
      [result.rows[0].case_id]
    );

    return NextResponse.json(caseData.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating case:', error);
    return NextResponse.json(
      { error: 'Failed to create case' },
      { status: 500 }
    );
  }
}
