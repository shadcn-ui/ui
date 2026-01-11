import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/rfqs/[id]
 * Get a specific RFQ with all details
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const rfqId = parseInt(routeParams.id);

    const result = await query(
      `SELECT 
        r.*,
        u.name AS created_by_name,
        pr.pr_number,
        (
          SELECT json_agg(
            json_build_object(
              'id', ri.id,
              'product_id', ri.product_id,
              'product_name', p.name,
              'product_sku', p.sku,
              'description', ri.description,
              'quantity', ri.quantity,
              'unit', ri.unit,
              'specifications', ri.specifications,
              'notes', ri.notes
            )
          )
          FROM rfq_items ri
          LEFT JOIN products p ON p.id = ri.product_id
          WHERE ri.rfq_id = r.id
        ) AS items,
        (
          SELECT json_agg(
            json_build_object(
              'supplier_id', rs.supplier_id,
              'supplier_name', s.company_name,
              'supplier_code', s.supplier_code,
              'status', rs.status,
              'sent_date', rs.sent_date,
              'has_responded', EXISTS(
                SELECT 1 FROM supplier_quotations sq 
                WHERE sq.rfq_id = r.id AND sq.supplier_id = rs.supplier_id
              )
            )
          )
          FROM rfq_suppliers rs
          JOIN suppliers s ON s.id = rs.supplier_id
          WHERE rs.rfq_id = r.id
        ) AS invited_suppliers
      FROM rfq_requests r
      LEFT JOIN users u ON u.id = r.created_by
      LEFT JOIN purchase_requisitions pr ON pr.id = r.pr_id
      WHERE r.id = $1`,
      [rfqId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    return NextResponse.json({ rfq: result.rows[0] });
  } catch (error: any) {
    console.error("Error fetching RFQ:", error);
    return NextResponse.json(
      { error: "Failed to fetch RFQ", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/supply-chain/rfqs/[id]
 * Update an RFQ
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const rfqId = parseInt(routeParams.id);
    const body = await request.json();

    const { title, description, response_deadline, terms_and_conditions, status, notes } = body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (title) {
      updates.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }

    if (response_deadline) {
      updates.push(`response_deadline = $${paramIndex}`);
      values.push(response_deadline);
      paramIndex++;
    }

    if (terms_and_conditions !== undefined) {
      updates.push(`terms_and_conditions = $${paramIndex}`);
      values.push(terms_and_conditions);
      paramIndex++;
    }

    if (status) {
      updates.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;

      // If status is being set to 'sent', record sent date
      if (status === 'sent') {
        updates.push(`issue_date = CURRENT_DATE`);
      }
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      values.push(notes);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(rfqId);

    await query(
      `UPDATE rfq_requests SET ${updates.join(", ")} WHERE id = $${paramIndex}`,
      values
    );

    // Fetch updated RFQ
    const result = await query(
      `SELECT 
        r.*,
        u.name AS created_by_name,
        (SELECT COUNT(*) FROM rfq_items WHERE rfq_id = r.id) AS item_count,
        (SELECT COUNT(*) FROM rfq_suppliers WHERE rfq_id = r.id) AS supplier_count
      FROM rfq_requests r
      LEFT JOIN users u ON u.id = r.created_by
      WHERE r.id = $1`,
      [rfqId]
    );

    return NextResponse.json({
      message: "RFQ updated successfully",
      rfq: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating RFQ:", error);
    return NextResponse.json(
      { error: "Failed to update RFQ", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/supply-chain/rfqs/[id]
 * Delete an RFQ (only if status is draft)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const rfqId = parseInt(routeParams.id);

    // Check status
    const checkResult = await query(
      `SELECT status FROM rfq_requests WHERE id = $1`,
      [rfqId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    if (checkResult.rows[0].status !== "draft") {
      return NextResponse.json(
        { error: "Only draft RFQs can be deleted" },
        { status: 400 }
      );
    }

    await query(`DELETE FROM rfq_requests WHERE id = $1`, [rfqId]);

    return NextResponse.json({ message: "RFQ deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting RFQ:", error);
    return NextResponse.json(
      { error: "Failed to delete RFQ", details: error.message },
      { status: 500 }
    );
  }
}
