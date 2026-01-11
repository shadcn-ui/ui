import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Build query with filters
    let query = `
      SELECT 
        jp.*,
        d.name as department_name,
        p.title as position_title,
        COUNT(ja.id) as application_count
      FROM job_postings jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN positions p ON jp.position_id = p.id
      LEFT JOIN job_applications ja ON jp.id = ja.job_posting_id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`jp.status = $${values.length + 1}`)
      values.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += `
      GROUP BY jp.id, d.name, p.title
      ORDER BY jp.posted_date DESC
    `

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(CASE WHEN status = 'Published' THEN 1 END) as published_jobs,
        (SELECT COUNT(*) FROM job_applications) as total_applications,
        (SELECT COUNT(*) FROM job_applications WHERE status = 'New') as new_applications
      FROM job_postings
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      jobs: result.rows,
      stats: {
        total_jobs: parseInt(stats.total_jobs),
        published_jobs: parseInt(stats.published_jobs),
        total_applications: parseInt(stats.total_applications),
        new_applications: parseInt(stats.new_applications),
      },
    })
  } catch (error) {
    console.error("Error fetching job postings:", error)
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
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
      title,
      department_id,
      position_id,
      description,
      requirements,
      employment_type,
      location,
      salary_min,
      salary_max,
      openings,
      closing_date,
      status = "Draft",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO job_postings (
        title,
        department_id,
        position_id,
        description,
        requirements,
        employment_type,
        location,
        salary_min,
        salary_max,
        openings,
        closing_date,
        status,
        posted_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      title,
      department_id,
      position_id,
      description,
      requirements,
      employment_type,
      location,
      salary_min,
      salary_max,
      openings,
      closing_date,
      status,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { job_posting: result.rows[0], message: "Job posting created successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating job posting:", error)
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
