import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/positions - List positions with filtering
// POST /api/hrm/positions - Create new position
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const organization_id = searchParams.get("organization_id");
    const department_id = searchParams.get("department_id");
    const job_title_id = searchParams.get("job_title_id");
    const employment_type = searchParams.get("employment_type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = ["p.is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (organization_id) {
      conditions.push(`p.organization_id = $${paramCount}`);
      params.push(organization_id);
      paramCount++;
    }

    if (department_id) {
      conditions.push(`p.department_id = $${paramCount}`);
      params.push(department_id);
      paramCount++;
    }

    if (job_title_id) {
      conditions.push(`p.job_title_id = $${paramCount}`);
      params.push(job_title_id);
      paramCount++;
    }

    if (employment_type) {
      conditions.push(`p.employment_type = $${paramCount}`);
      params.push(employment_type);
      paramCount++;
    }

    if (status) {
      conditions.push(`p.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_positions p
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get positions with related data
    params.push(limit, offset);
    const positionsQuery = `
      SELECT 
        p.*,
        o.organization_name,
        d.department_name,
        jt.job_title_name, jt.job_level, jt.job_family,
        sg.grade_name as salary_grade_name,
        rp.position_name as reports_to_position_name,
        (p.headcount - p.filled_count) as vacant_count,
        CASE 
          WHEN p.headcount > 0 THEN ROUND((p.filled_count::DECIMAL / p.headcount * 100), 1)
          ELSE 0
        END as fill_rate
      FROM hrm_positions p
      LEFT JOIN hrm_organizations o ON p.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON p.department_id = d.department_id
      LEFT JOIN hrm_job_titles jt ON p.job_title_id = jt.job_title_id
      LEFT JOIN hrm_salary_grades sg ON p.salary_grade_id = sg.salary_grade_id
      LEFT JOIN hrm_positions rp ON p.reports_to_position_id = rp.position_id
      ${whereClause}
      ORDER BY 
        CASE p.status
          WHEN 'approved' THEN 1
          WHEN 'on_hold' THEN 2
          WHEN 'filled' THEN 3
          ELSE 4
        END,
        p.position_code
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(positionsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_positions,
        SUM(headcount) as total_headcount,
        SUM(filled_count) as total_filled,
        SUM(headcount - filled_count) as total_vacant,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'on_hold' THEN 1 END) as on_hold_count,
        COUNT(CASE WHEN status = 'filled' THEN 1 END) as filled_count,
        COUNT(CASE WHEN employment_type = 'full_time' THEN 1 END) as full_time_positions,
        CASE 
          WHEN SUM(headcount) > 0 THEN ROUND((SUM(filled_count)::DECIMAL / SUM(headcount) * 100), 1)
          ELSE 0
        END as overall_fill_rate
      FROM hrm_positions
      WHERE is_active = true
    `;
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      positions: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();

    const {
      position_name,
      organization_id,
      department_id,
      job_title_id,
      employment_type,
    } = body;

    if (!position_name || !organization_id || !department_id || !job_title_id || !employment_type) {
      return NextResponse.json(
        {
          error: "Missing required fields: position_name, organization_id, department_id, job_title_id, employment_type",
        },
        { status: 400 }
      );
    }

    // Generate position code
    const maxCodeResult = await client.query(`
      SELECT position_code 
      FROM hrm_positions 
      ORDER BY position_id DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (maxCodeResult.rows.length > 0) {
      const lastCode = maxCodeResult.rows[0].position_code;
      const numMatch = lastCode.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }

    const position_code = `POS-${String(nextNumber).padStart(4, "0")}`;

    const insertQuery = `
      INSERT INTO hrm_positions (
        position_code, position_name, organization_id, department_id, job_title_id,
        reports_to_position_id, employment_type, position_type,
        headcount, salary_grade_id, budgeted_salary,
        status, approved_date, approved_by,
        description, requirements, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      position_code,
      position_name,
      organization_id,
      department_id,
      job_title_id,
      body.reports_to_position_id || null,
      employment_type,
      body.position_type || "permanent",
      body.headcount || 1,
      body.salary_grade_id || null,
      body.budgeted_salary || null,
      body.status || "draft",
      body.approved_date || null,
      body.approved_by || null,
      body.description || null,
      body.requirements || null,
      body.created_by || null,
    ]);

    // Fetch complete position data
    const completeQuery = `
      SELECT 
        p.*,
        o.organization_name,
        d.department_name,
        jt.job_title_name, jt.job_level, jt.job_family,
        sg.grade_name as salary_grade_name,
        rp.position_name as reports_to_position_name
      FROM hrm_positions p
      LEFT JOIN hrm_organizations o ON p.organization_id = o.organization_id
      LEFT JOIN hrm_departments d ON p.department_id = d.department_id
      LEFT JOIN hrm_job_titles jt ON p.job_title_id = jt.job_title_id
      LEFT JOIN hrm_salary_grades sg ON p.salary_grade_id = sg.salary_grade_id
      LEFT JOIN hrm_positions rp ON p.reports_to_position_id = rp.position_id
      WHERE p.position_id = $1
    `;
    const completeResult = await client.query(completeQuery, [result.rows[0].position_id]);

    return NextResponse.json(completeResult.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: "Failed to create position", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
