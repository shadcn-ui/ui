import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/hrm/holidays - List holidays
// POST /api/hrm/holidays - Create holiday
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const holiday_year = searchParams.get("holiday_year") || new Date().getFullYear().toString();
    const organization_id = searchParams.get("organization_id");
    const region = searchParams.get("region");
    const holiday_type = searchParams.get("holiday_type");

    let conditions = [`holiday_year = $1`];
    const params: any[] = [parseInt(holiday_year)];
    let paramCount = 2;

    if (organization_id) {
      conditions.push(`(organization_id = $${paramCount} OR organization_id IS NULL)`);
      params.push(organization_id);
      paramCount++;
    }

    if (region) {
      conditions.push(`(region = $${paramCount} OR region IS NULL)`);
      params.push(region);
      paramCount++;
    }

    if (holiday_type) {
      conditions.push(`holiday_type = $${paramCount}`);
      params.push(holiday_type);
      paramCount++;
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;

    const query = `
      SELECT *
      FROM hrm_holidays
      ${whereClause}
      ORDER BY holiday_date
    `;

    const result = await client.query(query, params);

    // Group by month for better display
    const groupedByMonth: any = {};
    result.rows.forEach((holiday) => {
      const month = new Date(holiday.holiday_date).toLocaleString("default", { month: "long" });
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = [];
      }
      groupedByMonth[month].push(holiday);
    });

    return NextResponse.json({
      holidays: result.rows,
      grouped_by_month: groupedByMonth,
      total: result.rows.length,
      year: parseInt(holiday_year),
    });
  } catch (error: any) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      { error: "Failed to fetch holidays", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      holiday_name,
      holiday_date,
      organization_id,
      holiday_type,
      region,
      country,
      is_mandatory,
      description,
    } = body;

    if (!holiday_name || !holiday_date) {
      return NextResponse.json(
        { error: "Missing required fields: holiday_name, holiday_date" },
        { status: 400 }
      );
    }

    // Extract year from date
    const holiday_year = new Date(holiday_date).getFullYear();

    // Check if holiday already exists for this date and organization
    const checkQuery = `
      SELECT * FROM hrm_holidays 
      WHERE holiday_date = $1 
        AND (organization_id = $2 OR (organization_id IS NULL AND $2 IS NULL))
    `;
    const checkResult = await client.query(checkQuery, [holiday_date, organization_id || null]);

    if (checkResult.rows.length > 0) {
      return NextResponse.json(
        { error: "Holiday already exists for this date" },
        { status: 400 }
      );
    }

    // Insert holiday
    const insertQuery = `
      INSERT INTO hrm_holidays (
        holiday_name, holiday_date, holiday_year,
        organization_id, holiday_type, region, country,
        is_mandatory, description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      holiday_name,
      holiday_date,
      holiday_year,
      organization_id || null,
      holiday_type || "national",
      region || null,
      country || null,
      is_mandatory !== undefined ? is_mandatory : true,
      description || null,
    ]);

    return NextResponse.json({
      message: "Holiday created successfully",
      holiday: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating holiday:", error);
    return NextResponse.json(
      { error: "Failed to create holiday", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
