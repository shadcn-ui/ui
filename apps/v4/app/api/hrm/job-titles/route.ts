import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/job-titles - List job titles
// POST /api/hrm/job-titles - Create new job title
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const job_family = searchParams.get("job_family");
    const min_level = searchParams.get("min_level");
    const max_level = searchParams.get("max_level");
    const search = searchParams.get("search");

    let conditions = ["is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (job_family) {
      conditions.push(`job_family = $${paramCount}`);
      params.push(job_family);
      paramCount++;
    }

    if (min_level) {
      conditions.push(`job_level >= $${paramCount}`);
      params.push(min_level);
      paramCount++;
    }

    if (max_level) {
      conditions.push(`job_level <= $${paramCount}`);
      params.push(max_level);
      paramCount++;
    }

    if (search) {
      conditions.push(`(job_title_name ILIKE $${paramCount} OR job_title_code ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        jt.*,
        sg.grade_name as salary_grade_name,
        sg.grade_code as salary_grade_code,
        (
          SELECT COUNT(*) FROM hrm_employees 
          WHERE job_title_id = jt.job_title_id AND is_active = true
        ) as employee_count,
        (
          SELECT COUNT(*) FROM hrm_positions 
          WHERE job_title_id = jt.job_title_id AND is_active = true
        ) as position_count
      FROM hrm_job_titles jt
      LEFT JOIN hrm_salary_grades sg ON jt.salary_grade_id = sg.salary_grade_id
      ${whereClause}
      ORDER BY jt.job_level, jt.job_family, jt.job_title_name
    `;

    const result = await client.query(query, params);

    // Get summary by job family
    const summaryQuery = `
      SELECT 
        job_family,
        COUNT(*) as title_count,
        MIN(job_level) as min_level,
        MAX(job_level) as max_level,
        AVG(min_salary) as avg_min_salary,
        AVG(max_salary) as avg_max_salary
      FROM hrm_job_titles
      WHERE is_active = true
      GROUP BY job_family
      ORDER BY job_family
    `;
    const summaryResult = await client.query(summaryQuery);

    return NextResponse.json({
      job_titles: result.rows,
      summary_by_family: summaryResult.rows,
    });
  } catch (error: any) {
    console.error("Error fetching job titles:", error);
    return NextResponse.json(
      { error: "Failed to fetch job titles", details: error.message },
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
      job_title_name,
      job_level,
      job_family,
    } = body;

    if (!job_title_name || !job_level || !job_family) {
      return NextResponse.json(
        {
          error: "Missing required fields: job_title_name, job_level, job_family",
        },
        { status: 400 }
      );
    }

    // Generate job title code
    const maxCodeResult = await client.query(`
      SELECT job_title_code 
      FROM hrm_job_titles 
      ORDER BY job_title_id DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (maxCodeResult.rows.length > 0) {
      const lastCode = maxCodeResult.rows[0].job_title_code;
      const numMatch = lastCode.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }

    const job_title_code = `JT${String(nextNumber).padStart(3, "0")}`;

    const insertQuery = `
      INSERT INTO hrm_job_titles (
        job_title_code, job_title_name, job_level, job_family,
        description, responsibilities, required_qualifications, preferred_qualifications,
        salary_grade_id, min_salary, max_salary
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      job_title_code,
      job_title_name,
      job_level,
      job_family,
      body.description || null,
      body.responsibilities || null,
      body.required_qualifications || null,
      body.preferred_qualifications || null,
      body.salary_grade_id || null,
      body.min_salary || null,
      body.max_salary || null,
    ]);

    // Fetch complete job title data
    const completeQuery = `
      SELECT 
        jt.*,
        sg.grade_name as salary_grade_name,
        sg.grade_code as salary_grade_code
      FROM hrm_job_titles jt
      LEFT JOIN hrm_salary_grades sg ON jt.salary_grade_id = sg.salary_grade_id
      WHERE jt.job_title_id = $1
    `;
    const completeResult = await client.query(completeQuery, [result.rows[0].job_title_id]);

    return NextResponse.json(completeResult.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating job title:", error);
    return NextResponse.json(
      { error: "Failed to create job title", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
