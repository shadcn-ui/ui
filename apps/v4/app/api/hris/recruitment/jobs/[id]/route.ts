import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET /api/hris/recruitment/jobs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    
    const result = await client.query(
      `SELECT 
        jp.*,
        d.name as department_name,
        p.title as position_title,
        (SELECT COUNT(*) FROM job_applications WHERE job_posting_id = jp.id) as application_count
      FROM job_postings jp
      LEFT JOIN departments d ON jp.department_id = d.id
      LEFT JOIN positions p ON jp.position_id = p.id
      WHERE jp.id = $1`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Job posting not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ job: result.rows[0] })
  } catch (error: any) {
    console.error("Error fetching job posting:", error)
    return NextResponse.json(
      { error: "Failed to fetch job posting", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// PUT /api/hris/recruitment/jobs/[id]
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
      title: body.title,
      department_id: body.department_id,
      position_id: body.position_id,
      employment_type: body.employment_type,
      location: body.location,
      salary_min: body.salary_min,
      salary_max: body.salary_max,
      openings: body.openings,
      description: body.description,
      requirements: body.requirements,
      status: body.status,
      posted_date: body.posted_date,
      closing_date: body.closing_date,
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
        `UPDATE job_postings 
         SET ${updateFields.join(", ")}
         WHERE id = $${paramIndex}`,
        updateValues
      )
    }
    
    const result = await client.query(
      `SELECT jp.*, d.name as department_name, p.title as position_title
       FROM job_postings jp
       LEFT JOIN departments d ON jp.department_id = d.id
       LEFT JOIN positions p ON jp.position_id = p.id
       WHERE jp.id = $1`,
      [id]
    )
    
    await client.query("COMMIT")
    
    return NextResponse.json({
      message: "Job posting updated successfully",
      job: result.rows[0],
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Error updating job posting:", error)
    return NextResponse.json(
      { error: "Failed to update job posting", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE /api/hris/recruitment/jobs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    
    await client.query("BEGIN")
    
    // Check if there are applications
    const appCount = await client.query(
      "SELECT COUNT(*) as count FROM job_applications WHERE job_posting_id = $1",
      [id]
    )
    
    if (parseInt(appCount.rows[0].count) > 0) {
      // Soft delete - change status to Closed
      await client.query(
        `UPDATE job_postings 
         SET status = 'Closed',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [id]
      )
    } else {
      // Hard delete if no applications
      await client.query("DELETE FROM job_postings WHERE id = $1", [id])
    }
    
    await client.query("COMMIT")
    
    return NextResponse.json({
      message: "Job posting deleted successfully",
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Error deleting job posting:", error)
    return NextResponse.json(
      { error: "Failed to delete job posting", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
