import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PUT /api/assets/transfers/[id] - Update transfer status (approve/complete/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const { id } = params;
    const body = await request.json();
    const { action, approved_by, transferred_by, received_by, notes } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing required field: action" },
        { status: 400 }
      );
    }

    let updateQuery = "";
    let updateParams: any[] = [];

    if (action === "approve") {
      updateQuery = `
        UPDATE asset_transfers
        SET 
          transfer_status = 'approved',
          approved_by = $1,
          approved_date = NOW(),
          updated_at = NOW()
        WHERE transfer_id = $2
        RETURNING *
      `;
      updateParams = [approved_by, id];
    } else if (action === "reject") {
      updateQuery = `
        UPDATE asset_transfers
        SET 
          transfer_status = 'rejected',
          approved_by = $1,
          approved_date = NOW(),
          notes = $2,
          updated_at = NOW()
        WHERE transfer_id = $3
        RETURNING *
      `;
      updateParams = [approved_by, notes, id];
    } else if (action === "start_transfer") {
      updateQuery = `
        UPDATE asset_transfers
        SET 
          transfer_status = 'in_transit',
          transferred_by = $1,
          transfer_date = NOW(),
          updated_at = NOW()
        WHERE transfer_id = $2 AND transfer_status = 'approved'
        RETURNING *
      `;
      updateParams = [transferred_by, id];
    } else if (action === "complete") {
      updateQuery = `
        UPDATE asset_transfers
        SET 
          transfer_status = 'completed',
          received_by = $1,
          received_date = NOW(),
          updated_at = NOW()
        WHERE transfer_id = $2 AND transfer_status = 'in_transit'
        RETURNING *
      `;
      updateParams = [received_by, id];
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', 'start_transfer', or 'complete'" },
        { status: 400 }
      );
    }

    const result = await client.query(updateQuery, updateParams);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Transfer not found or invalid status for this action" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Transfer ${action} successful`,
      transfer: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { error: "Failed to update transfer", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
