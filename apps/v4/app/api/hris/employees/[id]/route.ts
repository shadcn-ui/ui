import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET /api/hris/employees/[id] - Get single employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    
    const result = await client.query(
      `SELECT 
        e.*,
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        u.first_name,
        u.last_name,
        u.email,
        d.name as department_name,
        p.title as position_title
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE e.id = $1`,
      [id]
    )
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ employee: result.rows[0] })
  } catch (error: any) {
    console.error("Error fetching employee:", error)
    return NextResponse.json(
      { error: "Failed to fetch employee", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// PUT /api/hris/employees/[id] - Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    const body = await request.json()
    
    await client.query("BEGIN")
    
    // Update user information
    if (body.first_name || body.last_name || body.email) {
      await client.query(
        `UPDATE users 
         SET first_name = COALESCE($1, first_name),
             last_name = COALESCE($2, last_name),
             email = COALESCE($3, email),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = (SELECT user_id FROM employees WHERE id = $4)`,
        [body.first_name, body.last_name, body.email, id]
      )
    }
    
    // Update employee information
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1
    
    const fieldMap: { [key: string]: any } = {
      department_id: body.department_id,
      position_id: body.position_id,
      employment_type: body.employment_type,
      employment_status: body.employment_status,
      hire_date: body.hire_date,
      phone: body.phone,
      address: body.address,
      city: body.city,
      province: body.province,
      postal_code: body.postal_code,
      country: body.country,
      date_of_birth: body.date_of_birth,
      place_of_birth: body.place_of_birth,
      nationality: body.nationality,
      marital_status: body.marital_status,
      npwp: body.npwp,
      bank_account: body.bank_account,
      bank_name: body.bank_name,
      emergency_contact_name: body.emergency_contact_name,
      emergency_contact_phone: body.emergency_contact_phone,
      emergency_contact_relation: body.emergency_contact_relation,
      salary: body.salary,
      bpjs_kesehatan: body.bpjs_kesehatan,
      bpjs_ketenagakerjaan: body.bpjs_ketenagakerjaan,
      bpjs_jht: body.bpjs_jht,
      bpjs_jkk: body.bpjs_jkk,
      bpjs_jkm: body.bpjs_jkm,
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
        `UPDATE employees 
         SET ${updateFields.join(", ")}
         WHERE id = $${paramIndex}`,
        updateValues
      )
    }
    
    // Get updated employee
    const result = await client.query(
      `SELECT 
        e.*,
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        u.first_name,
        u.last_name,
        u.email,
        d.name as department_name,
        p.title as position_title
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE e.id = $1`,
      [id]
    )
    
    await client.query("COMMIT")
    
    return NextResponse.json({
      message: "Employee updated successfully",
      employee: result.rows[0],
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Error updating employee:", error)
    return NextResponse.json(
      { error: "Failed to update employee", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

// DELETE /api/hris/employees/[id] - Delete or terminate employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect()
  
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const hardDelete = searchParams.get("hard") === "true"
    
    await client.query("BEGIN")
    
    if (hardDelete) {
      // Hard delete - remove from database
      // Note: This might fail if there are foreign key constraints
      await client.query("DELETE FROM employees WHERE id = $1", [id])
    } else {
      // Soft delete - change status to Terminated
      await client.query(
        `UPDATE employees 
         SET employment_status = 'Terminated',
             termination_date = CURRENT_DATE,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [id]
      )
    }
    
    await client.query("COMMIT")
    
    return NextResponse.json({
      message: hardDelete ? "Employee deleted successfully" : "Employee terminated successfully",
    })
  } catch (error: any) {
    await client.query("ROLLBACK")
    console.error("Error deleting employee:", error)
    return NextResponse.json(
      { error: "Failed to delete employee", details: error.message },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
