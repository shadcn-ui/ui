import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/performance-reviews - List performance reviews
// POST /api/hrm/performance-reviews - Create new review
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get("employee_id");
    const reviewer_id = searchParams.get("reviewer_id");
    const review_type = searchParams.get("review_type");
    const status = searchParams.get("status");
    const year = searchParams.get("year");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = ["pr.is_active = true"];
    const params: any[] = [];
    let paramCount = 1;

    if (employee_id) {
      conditions.push(`pr.employee_id = $${paramCount}`);
      params.push(employee_id);
      paramCount++;
    }

    if (reviewer_id) {
      conditions.push(`pr.reviewer_id = $${paramCount}`);
      params.push(reviewer_id);
      paramCount++;
    }

    if (review_type) {
      conditions.push(`pr.review_type = $${paramCount}`);
      params.push(review_type);
      paramCount++;
    }

    if (status) {
      conditions.push(`pr.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    if (year) {
      conditions.push(`EXTRACT(YEAR FROM pr.review_period_end) = $${paramCount}`);
      params.push(year);
      paramCount++;
    }

    const whereClause = conditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM hrm_performance_reviews pr
      WHERE ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get reviews
    params.push(limit, offset);
    const reviewsQuery = `
      SELECT 
        pr.*,
        e.employee_number,
        e.first_name || ' ' || e.last_name as employee_name,
        e.work_email as employee_email,
        d.department_name as employee_department,
        jt.job_title_name as employee_job_title,
        r.employee_number as reviewer_employee_number,
        r.first_name || ' ' || r.last_name as reviewer_name
      FROM hrm_performance_reviews pr
      LEFT JOIN hrm_employees e ON pr.employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON e.department_id = d.department_id
      LEFT JOIN hrm_job_titles jt ON e.job_title_id = jt.job_title_id
      LEFT JOIN hrm_employees r ON pr.reviewer_id = r.employee_id
      WHERE ${whereClause}
      ORDER BY pr.review_date DESC NULLS LAST, pr.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(reviewsQuery, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review_count,
        ROUND(AVG(CASE WHEN overall_rating IS NOT NULL THEN overall_rating END), 2) as avg_overall_rating,
        COUNT(CASE WHEN promotion_recommended = true THEN 1 END) as promotion_recommended_count,
        COUNT(CASE WHEN salary_increase_recommended = true THEN 1 END) as salary_increase_recommended_count
      FROM hrm_performance_reviews
      WHERE is_active = true
    `;
    const statsResult = await client.query(statsQuery);

    return NextResponse.json({
      reviews: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching performance reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance reviews", details: error.message },
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
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      review_type,
    } = body;

    if (!employee_id || !reviewer_id || !review_period_start || !review_period_end || !review_type) {
      return NextResponse.json(
        {
          error: "Missing required fields: employee_id, reviewer_id, review_period_start, review_period_end, review_type",
        },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO hrm_performance_reviews (
        employee_id, review_period_start, review_period_end, review_type, review_date,
        reviewer_id, reviewer_relationship,
        overall_rating, goals_achievement_rating, competency_rating, behavior_rating,
        strengths, areas_for_improvement, achievements, goals_next_period, development_plan,
        promotion_recommended, salary_increase_recommended, recommended_increase_percentage,
        training_recommended, status, employee_comments, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      employee_id,
      review_period_start,
      review_period_end,
      review_type,
      body.review_date || null,
      reviewer_id,
      body.reviewer_relationship || "direct_manager",
      body.overall_rating || null,
      body.goals_achievement_rating || null,
      body.competency_rating || null,
      body.behavior_rating || null,
      body.strengths || null,
      body.areas_for_improvement || null,
      body.achievements || null,
      body.goals_next_period || null,
      body.development_plan || null,
      body.promotion_recommended || false,
      body.salary_increase_recommended || false,
      body.recommended_increase_percentage || null,
      body.training_recommended || null,
      body.status || "draft",
      body.employee_comments || null,
      body.created_by || null,
    ]);

    // Fetch complete review data
    const completeQuery = `
      SELECT 
        pr.*,
        e.first_name || ' ' || e.last_name as employee_name,
        r.first_name || ' ' || r.last_name as reviewer_name
      FROM hrm_performance_reviews pr
      LEFT JOIN hrm_employees e ON pr.employee_id = e.employee_id
      LEFT JOIN hrm_employees r ON pr.reviewer_id = r.employee_id
      WHERE pr.review_id = $1
    `;
    const completeResult = await client.query(completeQuery, [result.rows[0].review_id]);

    return NextResponse.json(completeResult.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("Error creating performance review:", error);
    return NextResponse.json(
      { error: "Failed to create performance review", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
