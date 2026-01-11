import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const jobId = searchParams.get("job_id")

    // Build query with filters
    let query = `
      SELECT 
        ja.*,
        jp.title as job_title
      FROM job_applications ja
      LEFT JOIN job_postings jp ON ja.job_posting_id = jp.id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`ja.status = $${values.length + 1}`)
      values.push(status)
    }

    if (jobId) {
      conditions.push(`ja.job_posting_id = $${values.length + 1}`)
      values.push(jobId)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += ` ORDER BY ja.applied_date DESC`

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_jobs,
        (SELECT COUNT(*) FROM job_postings WHERE status = 'Published') as published_jobs,
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'New' THEN 1 END) as new_applications
      FROM job_applications
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      applications: result.rows,
      stats: {
        total_jobs: parseInt(stats.total_jobs),
        published_jobs: parseInt(stats.published_jobs),
        total_applications: parseInt(stats.total_applications),
        new_applications: parseInt(stats.new_applications),
      },
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
      job_posting_id,
      first_name,
      last_name,
      email,
      phone,
      resume_url,
      cover_letter,
      linkedin_profile,
      portfolio_url,
      years_of_experience,
      current_company,
      current_position,
      expected_salary,
      notice_period,
      status = "New",
      stage = "Initial Review",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO job_applications (
        job_posting_id,
        first_name,
        last_name,
        email,
        phone,
        resume_url,
        cover_letter,
        linkedin_profile,
        portfolio_url,
        years_of_experience,
        current_company,
        current_position,
        expected_salary,
        notice_period,
        status,
        stage,
        applied_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_DATE)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      job_posting_id,
      first_name,
      last_name,
      email,
      phone,
      resume_url,
      cover_letter,
      linkedin_profile,
      portfolio_url,
      years_of_experience,
      current_company,
      current_position,
      expected_salary,
      notice_period,
      status,
      stage,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { application: result.rows[0], message: "Application submitted successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating application:", error)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
