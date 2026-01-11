import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/categories - List asset categories
// POST /api/assets/categories - Create category
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const query = `
      SELECT 
        ac.*,
        pc.category_name as parent_category_name,
        (
          SELECT COUNT(*) 
          FROM assets a 
          WHERE a.category_id = ac.category_id
        ) as asset_count
      FROM asset_categories ac
      LEFT JOIN asset_categories pc ON ac.parent_category_id = pc.category_id
      WHERE ac.is_active = true
      ORDER BY ac.category_name
    `;

    const result = await client.query(query);

    return NextResponse.json({
      categories: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
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
      category_code,
      category_name,
      parent_category_id,
      description,
      default_useful_life_years,
      default_depreciation_method,
      default_salvage_value_percent,
      requires_maintenance,
      maintenance_frequency_days,
      created_by,
    } = body;

    if (!category_code || !category_name) {
      return NextResponse.json(
        { error: "Missing required fields: category_code, category_name" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO asset_categories (
        category_code, category_name, parent_category_id, description,
        default_useful_life_years, default_depreciation_method,
        default_salvage_value_percent, requires_maintenance,
        maintenance_frequency_days, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      category_code,
      category_name,
      parent_category_id || null,
      description || null,
      default_useful_life_years || 5,
      default_depreciation_method || "straight_line",
      default_salvage_value_percent || 10,
      requires_maintenance || false,
      maintenance_frequency_days || null,
      created_by || null,
    ]);

    return NextResponse.json({
      message: "Category created successfully",
      category: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
