import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/scorecards/criteria
 * Get all scorecard criteria
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const is_active = searchParams.get("is_active");

    let sql = `SELECT * FROM supplier_scorecard_criteria`;
    const params: any[] = [];

    if (is_active !== null) {
      sql += ` WHERE is_active = $1`;
      params.push(is_active === "true");
    }

    sql += ` ORDER BY id`;

    const result = await query(sql, params);

    return NextResponse.json({ criteria: result.rows });
  } catch (error: any) {
    console.error("Error fetching scorecard criteria:", error);
    return NextResponse.json(
      { error: "Failed to fetch scorecard criteria", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/scorecards/criteria
 * Create a new scorecard criterion
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      criteria_name,
      criteria_code,
      description,
      weight,
      calculation_method,
      formula,
    } = body;

    if (!criteria_name || !criteria_code || weight === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: criteria_name, criteria_code, weight" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO supplier_scorecard_criteria (
        criteria_name, criteria_code, description, weight, calculation_method, formula
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [criteria_name, criteria_code, description, weight, calculation_method || "manual", formula]
    );

    return NextResponse.json(
      {
        message: "Scorecard criterion created successfully",
        criterion: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating scorecard criterion:", error);
    return NextResponse.json(
      { error: "Failed to create scorecard criterion", details: error.message },
      { status: 500 }
    );
  }
}
