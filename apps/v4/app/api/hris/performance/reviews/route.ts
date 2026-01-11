import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT 
        pr.*,
        e.employee_number,
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        d.name as department_name,
        CONCAT(reviewer.first_name, ' ', reviewer.last_name) as reviewer_name
      FROM performance_reviews pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN users reviewer ON pr.reviewer_id = reviewer.id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`pr.status = $${values.length + 1}`)
      values.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY pr.review_date DESC`

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_reviews,
        COUNT(CASE WHEN status IN ('Draft', 'In Progress') THEN 1 END) as pending_reviews,
        COALESCE(AVG(overall_rating), 0) as average_rating
      FROM performance_reviews
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      reviews: result.rows,
      stats: {
        total_reviews: parseInt(stats.total_reviews),
        completed_reviews: parseInt(stats.completed_reviews),
        pending_reviews: parseInt(stats.pending_reviews),
        average_rating: parseFloat(stats.average_rating),
      },
    })
  } catch (error) {
    console.error("Error fetching performance reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch performance reviews" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

export async function POST(request: Request) {
  const client = await pool.connect()

  try {
    const body = await request.json()
    const {
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      overall_rating,
      technical_skills,
      communication_skills,
      teamwork,
      leadership,
      problem_solving,
      strengths,
      areas_for_improvement,
      goals_next_period,
      comments,
      status = "Draft",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO performance_reviews (
        employee_id,
        reviewer_id,
        review_period_start,
        review_period_end,
        overall_rating,
        technical_skills,
        communication_skills,
        teamwork,
        leadership,
        problem_solving,
        strengths,
        areas_for_improvement,
        goals_next_period,
        comments,
        status,
        review_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_DATE)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      employee_id,
      reviewer_id,
      review_period_start,
      review_period_end,
      overall_rating,
      technical_skills,
      communication_skills,
      teamwork,
      leadership,
      problem_solving,
      strengths,
      areas_for_improvement,
      goals_next_period,
      comments,
      status,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { review: result.rows[0], message: "Performance review created successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating performance review:", error)
    return NextResponse.json(
      { error: "Failed to create performance review" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
