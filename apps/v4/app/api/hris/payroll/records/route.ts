import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET(request: Request) {
  const client = await pool.connect()
  
  try {
    const { searchParams } = new URL(request.url)
    const periodId = searchParams.get("period_id")

    if (!periodId) {
      return NextResponse.json(
        { error: "Period ID is required" },
        { status: 400 }
      )
    }

    const query = `
      SELECT 
        pr.*,
        e.employee_number,
        CONCAT(u.first_name, ' ', u.last_name) as employee_name,
        d.name as department_name,
        p.title as position_title
      FROM payroll_records pr
      JOIN employees e ON pr.employee_id = e.id
      JOIN users u ON e.user_id = u.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN positions p ON e.position_id = p.id
      WHERE pr.period_id = $1
      ORDER BY u.first_name, u.last_name
    `

    const result = await client.query(query, [periodId])

    return NextResponse.json({
      records: result.rows,
    })
  } catch (error) {
    console.error("Error fetching payroll records:", error)
    return NextResponse.json(
      { error: "Failed to fetch payroll records" },
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
      period_id,
      employee_id,
      basic_salary,
      allowances = 0,
      overtime_pay = 0,
      bonuses = 0,
      other_earnings = 0,
    } = body

    await client.query("BEGIN")

    // Calculate gross salary
    const gross_salary = 
      parseFloat(basic_salary) + 
      parseFloat(allowances) + 
      parseFloat(overtime_pay) + 
      parseFloat(bonuses) + 
      parseFloat(other_earnings)

    // Calculate BPJS Kesehatan (1% employee, 4% company)
    const bpjs_kesehatan_employee = gross_salary * 0.01
    const bpjs_kesehatan_company = gross_salary * 0.04

    // Calculate BPJS Ketenagakerjaan (2% employee, 3.7% company)
    const bpjs_ketenagakerjaan_employee = gross_salary * 0.02
    const bpjs_ketenagakerjaan_company = gross_salary * 0.037

    // Calculate JHT (2% employee, 3.7% company)
    const jht_employee = gross_salary * 0.02
    const jht_company = gross_salary * 0.037

    // Calculate JKK (company only, varies by risk - using 0.24% default)
    const jkk_company = gross_salary * 0.0024

    // Calculate JKM (company only, 0.3%)
    const jkm_company = gross_salary * 0.003

    // Calculate PPh 21 (simplified progressive tax)
    // This is a simplified calculation - actual PPh 21 is more complex
    let tax_deduction = 0
    const taxable_income = gross_salary - (bpjs_kesehatan_employee + bpjs_ketenagakerjaan_employee + jht_employee)
    
    if (taxable_income <= 5000000) {
      tax_deduction = taxable_income * 0.05
    } else if (taxable_income <= 50000000) {
      tax_deduction = 250000 + (taxable_income - 5000000) * 0.15
    } else if (taxable_income <= 250000000) {
      tax_deduction = 7000000 + (taxable_income - 50000000) * 0.25
    } else if (taxable_income <= 500000000) {
      tax_deduction = 57000000 + (taxable_income - 250000000) * 0.30
    } else {
      tax_deduction = 132000000 + (taxable_income - 500000000) * 0.35
    }

    // Calculate total deductions
    const total_deductions = 
      bpjs_kesehatan_employee + 
      bpjs_ketenagakerjaan_employee + 
      jht_employee + 
      tax_deduction

    // Calculate net salary
    const net_salary = gross_salary - total_deductions

    const insertQuery = `
      INSERT INTO payroll_records (
        period_id,
        employee_id,
        basic_salary,
        allowances,
        overtime_pay,
        bonuses,
        other_earnings,
        gross_salary,
        bpjs_kesehatan_employee,
        bpjs_kesehatan_company,
        bpjs_ketenagakerjaan_employee,
        bpjs_ketenagakerjaan_company,
        jht_employee,
        jht_company,
        jkk_company,
        jkm_company,
        tax_deduction,
        other_deductions,
        total_deductions,
        net_salary,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `

    const result = await client.query(insertQuery, [
      period_id,
      employee_id,
      basic_salary,
      allowances,
      overtime_pay,
      bonuses,
      other_earnings,
      gross_salary,
      bpjs_kesehatan_employee,
      bpjs_kesehatan_company,
      bpjs_ketenagakerjaan_employee,
      bpjs_ketenagakerjaan_company,
      jht_employee,
      jht_company,
      jkk_company,
      jkm_company,
      tax_deduction,
      0, // other_deductions
      total_deductions,
      net_salary,
      "Calculated",
    ])

    await client.query("COMMIT")

    return NextResponse.json(
      { 
        record: result.rows[0], 
        message: "Payroll record created successfully",
        calculations: {
          gross_salary,
          bpjs_kesehatan_employee,
          bpjs_ketenagakerjaan_employee,
          jht_employee,
          tax_deduction,
          total_deductions,
          net_salary,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating payroll record:", error)
    return NextResponse.json(
      { error: "Failed to create payroll record" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
