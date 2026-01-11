import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/salary-grades - List salary grades
// POST /api/hrm/salary-grades - Create new salary grade
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const min_level = searchParams.get("min_level");
    const max_level = searchParams.get("max_level");
    const currency = searchParams.get("currency");

    let conditions = ["is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (min_level) {
      conditions.push(`grade_level >= $${paramCount}`);
      params.push(min_level);
      paramCount++;
    }

    if (max_level) {
      conditions.push(`grade_level <= $${paramCount}`);
      params.push(max_level);
      paramCount++;
    }

    if (currency) {
      conditions.push(`currency = $${paramCount}`);
      params.push(currency);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    const query = `
      SELECT 
        sg.*,
        (sg.max_salary - sg.min_salary) as salary_range,
        ROUND(((sg.max_salary - sg.min_salary) / sg.min_salary * 100), 1) as range_percentage,
        (
          SELECT COUNT(*) FROM hrm_employees 
          WHERE salary_grade_id = sg.salary_grade_id AND is_active = true
        ) as employee_count,
        (
          SELECT COUNT(*) FROM hrm_positions 
          WHERE salary_grade_id = sg.salary_grade_id AND is_active = true
        ) as position_count,
        (
          SELECT AVG(current_salary) FROM hrm_employees 
          WHERE salary_grade_id = sg.salary_grade_id AND is_active = true AND current_salary IS NOT NULL
        ) as avg_actual_salary
      FROM hrm_salary_grades sg
      WHERE ${whereClause}
      ORDER BY sg.grade_level
    `;

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_grades,
        MIN(grade_level) as min_grade_level,
        MAX(grade_level) as max_grade_level,
        MIN(min_salary) as lowest_min_salary,
        MAX(max_salary) as highest_max_salary,
        AVG(max_salary - min_salary) as avg_salary_range
      FROM hrm_salary_grades
      WHERE is_active = true
    `;
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      salary_grades: result.rows,
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching salary grades:", error);
    return NextResponse.json(
      { error: "Failed to fetch salary grades", details: error.message },
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
      grade_name,
      grade_level,
      min_salary,
      max_salary,
    } = body;

    if (!grade_name || !grade_level || !min_salary || !max_salary) {
      return NextResponse.json(
        {
          error: "Missing required fields: grade_name, grade_level, min_salary, max_salary",
        },
        { status: 400 }
      );
    }

    if (min_salary >= max_salary) {
      return NextResponse.json(
        {
          error: "min_salary must be less than max_salary",
        },
        { status: 400 }
      );
    }

    // Generate grade code
    const maxCodeResult = await client.query(`
      SELECT grade_code 
      FROM hrm_salary_grades 
      ORDER BY salary_grade_id DESC 
      LIMIT 1
    `);

    let nextNumber = 1;
    if (maxCodeResult.rows.length > 0) {
      const lastCode = maxCodeResult.rows[0].grade_code;
      const numMatch = lastCode.match(/\d+$/);
      if (numMatch) {
        nextNumber = parseInt(numMatch[0]) + 1;
      }
    }

    const grade_code = `G${nextNumber}`;

    const insertQuery = `
      INSERT INTO hrm_salary_grades (
        grade_code, grade_name, grade_level,
        min_salary, max_salary, currency,
        step_count, step_increment,
        description, effective_date, expiry_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      grade_code,
      grade_name,
      grade_level,
      min_salary,
      max_salary,
      body.currency || "USD",
      body.step_count || 5,
      body.step_increment || ((max_salary - min_salary) / (body.step_count || 5)),
      body.description || null,
      body.effective_date || null,
      body.expiry_date || null,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating salary grade:", error);
    return NextResponse.json(
      { error: "Failed to create salary grade", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
