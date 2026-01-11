import { NextResponse } from "next/server"
import { pool } from "@/lib/db"

export async function GET() {
  const client = await pool.connect()
  
  try {
    const query = `
      SELECT 
        id,
        name as holiday_name,
        date as holiday_date,
        description
      FROM public_holidays
      WHERE EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
      ORDER BY date
    `

    const result = await client.query(query)

    return NextResponse.json({
      holidays: result.rows,
    })
  } catch (error) {
    console.error("Error fetching public holidays:", error)
    return NextResponse.json(
      { error: "Failed to fetch public holidays" },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
