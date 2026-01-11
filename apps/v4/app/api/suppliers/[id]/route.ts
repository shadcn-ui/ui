import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  user: process.env.DB_USER || "mac",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ocean-erp",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "5432"),
})

// GET /api/suppliers/[id] - Get single supplier details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supplierId = params.id

    const result = await pool.query(
      `SELECT 
        s.*,
        CONCAT(creator.first_name, ' ', creator.last_name) as created_by_name,
        CONCAT(updater.first_name, ' ', updater.last_name) as updated_by_name
      FROM suppliers s
      LEFT JOIN users creator ON s.created_by = creator.id
      LEFT JOIN users updater ON s.updated_by = updater.id
      WHERE s.id = $1`,
      [supplierId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching supplier:", error)
    return NextResponse.json(
      { error: "Failed to fetch supplier" },
      { status: 500 }
    )
  }
}

// PUT /api/suppliers/[id] - Update supplier
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supplierId = params.id
    const body = await request.json()
    const {
      company_name,
      contact_person,
      email,
      phone,
      website,
      address,
      city,
      state,
      country,
      postal_code,
      tax_id,
      payment_terms,
      currency,
      credit_limit,
      status,
      rating,
      notes,
      tags,
      updated_by,
    } = body

    const result = await pool.query(
      `UPDATE suppliers SET
        company_name = COALESCE($1, company_name),
        contact_person = COALESCE($2, contact_person),
        email = COALESCE($3, email),
        phone = COALESCE($4, phone),
        website = COALESCE($5, website),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        state = COALESCE($8, state),
        country = COALESCE($9, country),
        postal_code = COALESCE($10, postal_code),
        tax_id = COALESCE($11, tax_id),
        payment_terms = COALESCE($12, payment_terms),
        currency = COALESCE($13, currency),
        credit_limit = COALESCE($14, credit_limit),
        status = COALESCE($15, status),
        rating = COALESCE($16, rating),
        notes = COALESCE($17, notes),
        tags = COALESCE($18, tags),
        updated_at = NOW(),
        updated_by = $19
      WHERE id = $20
      RETURNING *`,
      [
        company_name, contact_person, email, phone, website,
        address, city, state, country, postal_code, tax_id,
        payment_terms, currency, credit_limit, status, rating,
        notes, tags, updated_by, supplierId
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating supplier:", error)
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    )
  }
}

// DELETE /api/suppliers/[id] - Delete supplier (soft delete)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supplierId = params.id

    // Soft delete by setting status to Inactive
    const result = await pool.query(
      `UPDATE suppliers SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [supplierId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supplier deactivated successfully" 
    })
  } catch (error) {
    console.error("Error deleting supplier:", error)
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    )
  }
}
