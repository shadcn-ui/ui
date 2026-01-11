import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = `
      SELECT 
        tp.*,
        COUNT(DISTINCT te.id) as enrolled_count
      FROM training_programs tp
      LEFT JOIN training_enrollments te ON tp.id = te.program_id
    `

    const conditions: string[] = []
    const values: any[] = []

    if (status && status !== "all") {
      conditions.push(`tp.status = $${values.length + 1}`)
      values.push(status)
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }

    query += `
      GROUP BY tp.id
      ORDER BY tp.start_date DESC
    `

    const result = await client.query(query, values)

    // Calculate statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_programs,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) as active_programs,
        (SELECT COUNT(*) FROM training_enrollments) as total_enrollments,
        ROUND(
          COALESCE(
            (SELECT COUNT(*) FROM training_enrollments WHERE status = 'Completed')::numeric / 
            NULLIF((SELECT COUNT(*) FROM training_enrollments), 0)::numeric * 100
          , 0)
        ) as completion_rate
      FROM training_programs
    `
    const statsResult = await client.query(statsQuery)
    const stats = statsResult.rows[0]

    return NextResponse.json({
      programs: result.rows,
      stats: {
        total_programs: parseInt(stats.total_programs),
        active_programs: parseInt(stats.active_programs),
        total_enrollments: parseInt(stats.total_enrollments),
        completion_rate: parseInt(stats.completion_rate),
      },
    })
  } catch (error) {
    console.error("Error fetching training programs:", error)
    return NextResponse.json(
      { error: "Failed to fetch training programs" },
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
      program_name,
      description,
      trainer,
      start_date,
      end_date,
      duration_hours,
      location,
      max_participants,
      status = "Planned",
    } = body

    await client.query("BEGIN")

    const insertQuery = `
      INSERT INTO training_programs (
        program_name,
        description,
        trainer,
        start_date,
        end_date,
        duration_hours,
        location,
        max_participants,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      program_name,
      description,
      trainer,
      start_date,
      end_date,
      duration_hours,
      location,
      max_participants,
      status,
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { program: result.rows[0], message: "Training program created successfully" },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating training program:", error)
    return NextResponse.json(
      { error: "Failed to create training program" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
