import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets - List assets
// POST /api/assets - Create new asset
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("category_id");
    const asset_status = searchParams.get("asset_status");
    const location_id = searchParams.get("location_id");
    const assigned_to_employee_id = searchParams.get("assigned_to_employee_id");
    const assigned_to_department_id = searchParams.get("assigned_to_department_id");
    const search = searchParams.get("search");
    const barcode = searchParams.get("barcode");
    const qr_code = searchParams.get("qr_code");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let conditions = [];
    const params: any[] = [];
    let paramCount = 1;

    if (category_id) {
      conditions.push(`a.category_id = $${paramCount}`);
      params.push(category_id);
      paramCount++;
    }

    if (asset_status) {
      conditions.push(`a.asset_status = $${paramCount}`);
      params.push(asset_status);
      paramCount++;
    }

    if (location_id) {
      conditions.push(`a.current_location_id = $${paramCount}`);
      params.push(location_id);
      paramCount++;
    }

    if (assigned_to_employee_id) {
      conditions.push(`a.assigned_to_employee_id = $${paramCount}`);
      params.push(assigned_to_employee_id);
      paramCount++;
    }

    if (assigned_to_department_id) {
      conditions.push(`a.assigned_to_department_id = $${paramCount}`);
      params.push(assigned_to_department_id);
      paramCount++;
    }

    if (barcode) {
      conditions.push(`a.barcode = $${paramCount}`);
      params.push(barcode);
      paramCount++;
    }

    if (qr_code) {
      conditions.push(`a.qr_code = $${paramCount}`);
      params.push(qr_code);
      paramCount++;
    }

    if (search) {
      conditions.push(`(
        a.asset_number ILIKE $${paramCount} OR 
        a.asset_name ILIKE $${paramCount} OR 
        a.serial_number ILIKE $${paramCount} OR 
        a.barcode ILIKE $${paramCount}
      )`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM assets a
      ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get assets
    params.push(limit, offset);
    const assetsQuery = `
      SELECT 
        a.*,
        ac.category_name,
        ac.category_code,
        l.location_name,
        l.location_code,
        e.first_name || ' ' || e.last_name as assigned_employee_name,
        d.department_name,
        (
          SELECT COUNT(*) 
          FROM asset_maintenance_records mr
          WHERE mr.asset_id = a.asset_id
        ) as maintenance_count,
        (
          SELECT MAX(maintenance_date)
          FROM asset_maintenance_records mr
          WHERE mr.asset_id = a.asset_id AND mr.maintenance_status = 'completed'
        ) as last_completed_maintenance
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id = ac.category_id
      LEFT JOIN asset_locations l ON a.current_location_id = l.location_id
      LEFT JOIN hrm_employees e ON a.assigned_to_employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON a.assigned_to_department_id = d.department_id
      ${whereClause}
      ORDER BY a.asset_number
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    const result = await client.query(assetsQuery, params);

    // Get summary statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_assets,
        COUNT(CASE WHEN asset_status = 'available' THEN 1 END) as available_count,
        COUNT(CASE WHEN asset_status = 'in_use' THEN 1 END) as in_use_count,
        COUNT(CASE WHEN asset_status = 'under_maintenance' THEN 1 END) as maintenance_count,
        COUNT(CASE WHEN asset_status = 'disposed' THEN 1 END) as disposed_count,
        SUM(purchase_price) as total_purchase_value,
        SUM(current_book_value) as total_book_value,
        SUM(accumulated_depreciation) as total_depreciation
      FROM assets a
      ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, -2));

    return NextResponse.json({
      assets: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets", details: error.message },
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
      asset_name,
      category_id,
      asset_type,
      asset_status,
      condition_status,
      current_location_id,
      purchase_date,
      purchase_price,
      purchase_order_number,
      supplier_name,
      depreciation_method,
      useful_life_years,
      salvage_value,
      depreciation_start_date,
      barcode,
      qr_code,
      serial_number,
      model_number,
      manufacturer,
      warranty_expiry_date,
      warranty_provider,
      is_insured,
      insurance_policy_number,
      insurance_value,
      assigned_to_employee_id,
      assigned_to_department_id,
      maintenance_frequency_days,
      description,
      specifications,
      notes,
      tags,
      created_by,
    } = body;

    if (!asset_name || !category_id || !purchase_price) {
      return NextResponse.json(
        { error: "Missing required fields: asset_name, category_id, purchase_price" },
        { status: 400 }
      );
    }

    // Generate asset number
    const sequenceQuery = `
      SELECT COALESCE(MAX(CAST(SUBSTRING(asset_number FROM '[0-9]+') AS INTEGER)), 0) + 1 as next_num
      FROM assets
      WHERE asset_number ~ '^ASSET-[0-9]{5}$'
    `;
    const sequenceResult = await client.query(sequenceQuery);
    const asset_number = `ASSET-${String(sequenceResult.rows[0].next_num).padStart(5, "0")}`;

    // Calculate initial book value
    const current_book_value = purchase_price;

    // Calculate next maintenance date if frequency provided
    let next_maintenance_date = null;
    if (maintenance_frequency_days && depreciation_start_date) {
      const startDate = new Date(depreciation_start_date);
      startDate.setDate(startDate.getDate() + maintenance_frequency_days);
      next_maintenance_date = startDate.toISOString().split("T")[0];
    }

    // Insert asset
    const insertQuery = `
      INSERT INTO assets (
        asset_number, asset_name, category_id, asset_type, asset_status,
        condition_status, current_location_id, purchase_date, purchase_price,
        purchase_order_number, supplier_name, depreciation_method,
        useful_life_years, salvage_value, depreciation_start_date,
        current_book_value, barcode, qr_code, serial_number,
        model_number, manufacturer, warranty_expiry_date,
        warranty_provider, is_insured, insurance_policy_number,
        insurance_value, assigned_to_employee_id, assigned_to_department_id,
        maintenance_frequency_days, next_maintenance_date,
        description, specifications, notes, tags, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32, $33, $34, $35
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      asset_number,
      asset_name,
      category_id,
      asset_type || "equipment",
      asset_status || "available",
      condition_status || "good",
      current_location_id || null,
      purchase_date || null,
      purchase_price,
      purchase_order_number || null,
      supplier_name || null,
      depreciation_method || "straight_line",
      useful_life_years || 5,
      salvage_value || 0,
      depreciation_start_date || purchase_date || null,
      current_book_value,
      barcode || null,
      qr_code || null,
      serial_number || null,
      model_number || null,
      manufacturer || null,
      warranty_expiry_date || null,
      warranty_provider || null,
      is_insured || false,
      insurance_policy_number || null,
      insurance_value || null,
      assigned_to_employee_id || null,
      assigned_to_department_id || null,
      maintenance_frequency_days || null,
      next_maintenance_date,
      description || null,
      specifications || null,
      notes || null,
      tags || null,
      created_by || null,
    ]);

    return NextResponse.json({
      message: "Asset created successfully",
      asset: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
