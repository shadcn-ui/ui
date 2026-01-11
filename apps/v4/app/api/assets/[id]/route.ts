import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/assets/[id] - Get asset details
// PUT /api/assets/[id] - Update asset
// DELETE /api/assets/[id] - Delete asset (soft delete)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;

    const query = `
      SELECT 
        a.*,
        ac.category_name,
        ac.category_code,
        ac.requires_maintenance,
        l.location_name,
        l.location_code,
        l.building,
        l.floor,
        e.first_name || ' ' || e.last_name as assigned_employee_name,
        e.email as assigned_employee_email,
        d.department_name,
        (
          SELECT json_agg(
            json_build_object(
              'assignment_id', aa.assignment_id,
              'assigned_to_employee_name', ae.first_name || ' ' || ae.last_name,
              'assignment_date', aa.assignment_date,
              'return_date', aa.actual_return_date,
              'status', aa.assignment_status
            ) ORDER BY aa.assignment_date DESC
          )
          FROM asset_assignments aa
          LEFT JOIN hrm_employees ae ON aa.assigned_to_employee_id = ae.employee_id
          WHERE aa.asset_id = a.asset_id
        ) as assignment_history,
        (
          SELECT json_agg(
            json_build_object(
              'maintenance_id', mr.maintenance_id,
              'maintenance_date', mr.maintenance_date,
              'maintenance_type', mr.maintenance_type,
              'status', mr.maintenance_status,
              'total_cost', mr.total_cost
            ) ORDER BY mr.maintenance_date DESC
          )
          FROM asset_maintenance_records mr
          WHERE mr.asset_id = a.asset_id
        ) as maintenance_history,
        (
          SELECT SUM(depreciation_amount)
          FROM asset_depreciation_records dr
          WHERE dr.asset_id = a.asset_id
        ) as total_depreciation_posted
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id = ac.category_id
      LEFT JOIN asset_locations l ON a.current_location_id = l.location_id
      LEFT JOIN hrm_employees e ON a.assigned_to_employee_id = e.employee_id
      LEFT JOIN hrm_departments d ON a.assigned_to_department_id = d.department_id
      WHERE a.asset_id = $1
    `;

    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ asset: result.rows[0] });
  } catch (error: any) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    const updatableFields = [
      "asset_name",
      "asset_status",
      "condition_status",
      "current_location_id",
      "assigned_to_employee_id",
      "assigned_to_department_id",
      "depreciation_method",
      "useful_life_years",
      "salvage_value",
      "warranty_expiry_date",
      "warranty_provider",
      "is_insured",
      "insurance_policy_number",
      "insurance_value",
      "maintenance_frequency_days",
      "description",
      "specifications",
      "notes",
      "tags",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const updateQuery = `
      UPDATE assets
      SET ${updates.join(", ")}
      WHERE asset_id = $${paramCount}
      RETURNING *
    `;

    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Asset updated successfully",
      asset: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;

    // Soft delete - mark as disposed
    const deleteQuery = `
      UPDATE assets
      SET 
        asset_status = 'disposed',
        disposal_date = CURRENT_DATE,
        updated_at = NOW()
      WHERE asset_id = $1
      RETURNING *
    `;

    const result = await client.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Asset marked as disposed",
      asset: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
