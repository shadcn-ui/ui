import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/disposal - List disposal records
// POST /api/assets/disposal - Create disposal record
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const asset_id = searchParams.get("asset_id");
    const disposal_method = searchParams.get("disposal_method");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (asset_id) {
      conditions.push(`d.asset_id = $${paramCount}`);
      params.push(asset_id);
      paramCount++;
    }

    if (disposal_method) {
      conditions.push(`d.disposal_method = $${paramCount}`);
      params.push(disposal_method);
      paramCount++;
    }

    if (start_date) {
      conditions.push(`d.disposal_date >= $${paramCount}`);
      params.push(start_date);
      paramCount++;
    }

    if (end_date) {
      conditions.push(`d.disposal_date <= $${paramCount}`);
      params.push(end_date);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        d.*,
        a.asset_number,
        a.asset_name,
        a.purchase_price,
        ac.category_name,
        e.first_name || ' ' || e.last_name as disposed_by_name,
        ap.first_name || ' ' || ap.last_name as approved_by_name
      FROM asset_disposal d
      LEFT JOIN assets a ON d.asset_id = a.asset_id
      LEFT JOIN asset_categories ac ON a.category_id = ac.category_id
      LEFT JOIN hrm_employees e ON d.disposed_by = e.employee_id
      LEFT JOIN hrm_employees ap ON d.approved_by = ap.employee_id
      ${whereClause}
      ORDER BY d.disposal_date DESC
    `;

    const result = await client.query(query, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_disposals,
        SUM(book_value_at_disposal) as total_book_value,
        SUM(disposal_proceeds) as total_proceeds,
        SUM(disposal_costs) as total_costs,
        SUM(gain_loss) as total_gain_loss
      FROM asset_disposal d
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params);

    return NextResponse.json({
      disposal_records: result.rows,
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching disposal records:", error);
    return NextResponse.json(
      { error: "Failed to fetch disposal records", details: error.message },
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
    const {
      asset_id,
      disposal_date,
      disposal_method,
      disposal_reason,
      disposal_proceeds,
      disposal_costs,
      buyer_name,
      buyer_contact,
      sale_invoice_number,
      disposed_by,
      disposal_company,
      approved_by,
      approved_date,
      environmental_clearance,
      notes,
      created_by,
    } = body;

    if (!asset_id || !disposal_date || !disposal_method) {
      return NextResponse.json(
        { error: "Missing required fields: asset_id, disposal_date, disposal_method" },
        { status: 400 }
      );
    }

    // Get asset's current book value
    const assetQuery = `
      SELECT current_book_value FROM assets WHERE asset_id = $1
    `;
    const assetResult = await client.query(assetQuery, [asset_id]);

    if (assetResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    const book_value_at_disposal = assetResult.rows[0].current_book_value || 0;

    // Generate disposal number
    const sequenceQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(disposal_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_num
      FROM asset_disposal
      WHERE disposal_number ~ '^DISP-[0-9]{6}$'
    `;
    const sequenceResult = await client.query(sequenceQuery);
    const disposal_number = `DISP-${String(sequenceResult.rows[0].next_num).padStart(6, "0")}`;

    // Insert disposal record
    const insertQuery = `
      INSERT INTO asset_disposal (
        disposal_number, asset_id, disposal_date, disposal_method,
        disposal_reason, book_value_at_disposal, disposal_proceeds,
        disposal_costs, buyer_name, buyer_contact, sale_invoice_number,
        disposed_by, disposal_company, approved_by, approved_date,
        environmental_clearance, notes, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      disposal_number,
      asset_id,
      disposal_date,
      disposal_method,
      disposal_reason || null,
      book_value_at_disposal,
      disposal_proceeds || 0,
      disposal_costs || 0,
      buyer_name || null,
      buyer_contact || null,
      sale_invoice_number || null,
      disposed_by || null,
      disposal_company || null,
      approved_by || null,
      approved_date || null,
      environmental_clearance || false,
      notes || null,
      created_by || null,
    ]);

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Disposal record created successfully. Asset marked as disposed.",
      disposal_record: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating disposal record:", error);
    return NextResponse.json(
      { error: "Failed to create disposal record", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
