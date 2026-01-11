import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/depreciation - List depreciation records
// POST /api/assets/depreciation/calculate - Calculate depreciation for period
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const asset_id = searchParams.get("asset_id");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const is_posted = searchParams.get("is_posted");

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (asset_id) {
      conditions.push(`dr.asset_id = $${paramCount}`);
      params.push(asset_id);
      paramCount++;
    }

    if (year) {
      conditions.push(`dr.depreciation_year = $${paramCount}`);
      params.push(parseInt(year));
      paramCount++;
    }

    if (month) {
      conditions.push(`dr.depreciation_month = $${paramCount}`);
      params.push(parseInt(month));
      paramCount++;
    }

    if (is_posted !== null) {
      conditions.push(`dr.is_posted = $${paramCount}`);
      params.push(is_posted === "true");
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        dr.*,
        a.asset_number,
        a.asset_name,
        a.purchase_price,
        ac.category_name
      FROM asset_depreciation_records dr
      LEFT JOIN assets a ON dr.asset_id = a.asset_id
      LEFT JOIN asset_categories ac ON a.category_id = ac.category_id
      ${whereClause}
      ORDER BY dr.depreciation_year DESC, dr.depreciation_month DESC, a.asset_number
    `;

    const result = await client.query(query, params);

    // Get summary
    const statsQuery = `
      SELECT 
        COUNT(*) as total_records,
        SUM(depreciation_amount) as total_depreciation,
        SUM(opening_book_value) as total_opening_value,
        SUM(closing_book_value) as total_closing_value
      FROM asset_depreciation_records dr
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params);

    return NextResponse.json({
      depreciation_records: result.rows,
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching depreciation records:", error);
    return NextResponse.json(
      { error: "Failed to fetch depreciation records", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const body = await request.json();
    const { year, month, asset_ids, calculated_by } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: "Missing required fields: year, month" },
        { status: 400 }
      );
    }

    const period_start_date = new Date(year, month - 1, 1);
    const period_end_date = new Date(year, month, 0);

    // Get assets to depreciate
    let assetConditions = ["a.asset_status NOT IN ('disposed', 'retired')"];
    const assetParams: any[] = [];
    
    if (asset_ids && asset_ids.length > 0) {
      assetConditions.push(`a.asset_id = ANY($1)`);
      assetParams.push(asset_ids);
    }

    const assetsQuery = `
      SELECT 
        a.asset_id,
        a.asset_number,
        a.purchase_price,
        a.depreciation_method,
        a.useful_life_years,
        a.salvage_value,
        a.depreciation_start_date,
        a.accumulated_depreciation,
        a.current_book_value
      FROM assets a
      WHERE ${assetConditions.join(" AND ")}
        AND a.depreciation_start_date IS NOT NULL
        AND a.depreciation_start_date <= $${assetParams.length + 1}
    `;
    assetParams.push(period_end_date);

    const assetsResult = await client.query(assetsQuery, assetParams);
    const records = [];

    for (const asset of assetsResult.rows) {
      // Check if already calculated for this period
      const existingQuery = `
        SELECT * FROM asset_depreciation_records
        WHERE asset_id = $1 AND depreciation_year = $2 AND depreciation_month = $3
      `;
      const existingResult = await client.query(existingQuery, [asset.asset_id, year, month]);

      if (existingResult.rows.length > 0) {
        continue; // Skip if already calculated
      }

      // Calculate depreciation based on method
      let depreciation_amount = 0;
      let depreciation_rate = 0;
      const opening_book_value = asset.current_book_value || asset.purchase_price;
      const depreciable_amount = asset.purchase_price - asset.salvage_value;

      if (asset.depreciation_method === "straight_line") {
        const annual_depreciation = depreciable_amount / asset.useful_life_years;
        depreciation_amount = annual_depreciation / 12; // Monthly
        depreciation_rate = (1 / asset.useful_life_years) * 100;
      } else if (asset.depreciation_method === "declining_balance") {
        depreciation_rate = (1 / asset.useful_life_years) * 100;
        const annual_depreciation = opening_book_value * (depreciation_rate / 100);
        depreciation_amount = annual_depreciation / 12;
      } else if (asset.depreciation_method === "double_declining") {
        depreciation_rate = (2 / asset.useful_life_years) * 100;
        const annual_depreciation = opening_book_value * (depreciation_rate / 100);
        depreciation_amount = annual_depreciation / 12;
      }

      // Ensure we don't depreciate below salvage value
      const new_accumulated = (asset.accumulated_depreciation || 0) + depreciation_amount;
      if (new_accumulated > depreciable_amount) {
        depreciation_amount = depreciable_amount - (asset.accumulated_depreciation || 0);
      }

      const accumulated_depreciation = (asset.accumulated_depreciation || 0) + depreciation_amount;
      const closing_book_value = asset.purchase_price - accumulated_depreciation;

      // Calculate remaining life
      const start_date = new Date(asset.depreciation_start_date);
      const months_elapsed = (year - start_date.getFullYear()) * 12 + (month - start_date.getMonth() - 1);
      const remaining_life_years = asset.useful_life_years - (months_elapsed / 12);

      // Insert depreciation record
      const insertQuery = `
        INSERT INTO asset_depreciation_records (
          asset_id, depreciation_year, depreciation_month,
          period_start_date, period_end_date, opening_book_value,
          depreciation_method, depreciation_rate, depreciation_amount,
          accumulated_depreciation, closing_book_value,
          useful_life_years, remaining_life_years, salvage_value,
          calculated_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        asset.asset_id,
        year,
        month,
        period_start_date,
        period_end_date,
        opening_book_value,
        asset.depreciation_method,
        depreciation_rate,
        depreciation_amount,
        accumulated_depreciation,
        closing_book_value,
        asset.useful_life_years,
        remaining_life_years > 0 ? remaining_life_years : 0,
        asset.salvage_value,
        calculated_by || null,
      ]);

      records.push(result.rows[0]);
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: `Calculated depreciation for ${records.length} assets`,
      records,
    }, { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error calculating depreciation:", error);
    return NextResponse.json(
      { error: "Failed to calculate depreciation", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
