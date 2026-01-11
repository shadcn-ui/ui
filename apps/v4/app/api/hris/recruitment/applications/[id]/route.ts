import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET /api/hris/recruitment/applications/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    
    const result = await client.query(
      `SELECT 
        ja.*,
        jp.title as job_title
      FROM job_applications ja
      LEFT JOIN job_postings jp ON ja.job_posting_id = jp.id
      WHERE ja.id = $1`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ application: result.rows[0] })
  } catch (error: any) {
    console.error("Error fetching application:", error)
    return NextResponse.json(
      { error: "Failed to fetch application", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// PUT /api/hris/recruitment/applications/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    const body = await request.json()
    
    await client.query("BEGIN")
    
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1
    
    const fieldMap: { [key: string]: any } = {
      status: body.status,
      stage: body.stage,
      rating: body.rating,
      notes: body.notes,
      interview_date: body.interview_date,
      offer_date: body.offer_date,
      hired_date: body.hired_date,
      rejection_reason: body.rejection_reason,
    }
    
    for (const [field, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`)
        updateValues.push(value)
        paramIndex++
      }
    }
    
    if (updateFields.length > 0) {
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
      updateValues.push(id)
      
      await client.query(
        `UPDATE job_applications 
         SET ${updateFields.join(", ")}
         WHERE id = $${paramIndex}`,
        updateValues
      )
    }
    
    const result = await client.query(
      `SELECT ja.*, jp.title as job_title
       FROM job_applications ja
       LEFT JOIN job_postings jp ON ja.job_posting_id = jp.id
       WHERE ja.id = $1`,
      [id]
    )
    
    await client.query("COMMIT")
    
    return NextResponse.json({
      message: "Application updated successfully",
      application: result.rows[0],
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Error updating application:", error)
    return NextResponse.json(
      { error: "Failed to update application", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE /api/hris/recruitment/applications/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    
    await client.query("DELETE FROM job_applications WHERE id = $1", [id])
    
    return NextResponse.json({
      message: "Application deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting application:", error)
    return NextResponse.json(
      { error: "Failed to delete application", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
