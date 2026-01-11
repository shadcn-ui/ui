import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/purchase-orders/[id]/invoice
 * Record and match invoice with PO (3-way match)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const poId = parseInt(routeParams.id);
    const body = await request.json();

    const {
      invoice_number,
      invoice_date,
      due_date,
      subtotal,
      tax_amount = 0,
      shipping_amount = 0,
      total_amount,
      approved_by,
    } = body;

    if (!invoice_number || !invoice_date || !total_amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get PO details
    const poResult = await query(
      `SELECT * FROM purchase_orders WHERE id = $1`,
      [poId]
    );

    if (poResult.rows.length === 0) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    const po = poResult.rows[0];

    // 3-Way Match: PO Amount vs Invoice Amount
    const price_variance = parseFloat(total_amount) - parseFloat(po.total_amount);
    const variance_percentage = (price_variance / parseFloat(po.total_amount)) * 100;

    // Get receipt quantities
    const receiptResult = await query(
      `SELECT 
        SUM(poi.quantity) AS po_quantity,
        COALESCE(SUM(plr.received_quantity), 0) AS received_quantity
      FROM purchase_order_items poi
      LEFT JOIN po_line_receipts plr ON plr.purchase_order_item_id = poi.id
      WHERE poi.purchase_order_id = $1`,
      [poId]
    );

    const { po_quantity, received_quantity } = receiptResult.rows[0];
    const quantity_variance = parseFloat(received_quantity) - parseFloat(po_quantity);

    // Determine match status
    let match_status = "matched";
    let variance_reason = "";

    if (Math.abs(variance_percentage) > 5) {
      match_status = "variance";
      variance_reason = `Price variance: ${variance_percentage.toFixed(2)}% (${price_variance >= 0 ? '+' : ''}$${price_variance.toFixed(2)})`;
    }

    if (quantity_variance !== 0) {
      match_status = "variance";
      variance_reason += (variance_reason ? "; " : "") + `Quantity variance: ${quantity_variance} units`;
    }

    if (parseFloat(received_quantity) === 0) {
      match_status = "disputed";
      variance_reason = "No goods received yet";
    }

    // Create invoice record
    const invoiceResult = await query(
      `INSERT INTO po_invoices (
        purchase_order_id, invoice_number, supplier_id,
        invoice_date, due_date, subtotal, tax_amount, shipping_amount,
        total_amount, match_status, price_variance, quantity_variance,
        variance_reason, approved_by, approved_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
                CASE WHEN $10 = 'matched' THEN CURRENT_DATE ELSE NULL END)
      RETURNING *`,
      [
        poId,
        invoice_number,
        po.supplier_id,
        invoice_date,
        due_date,
        subtotal,
        tax_amount,
        shipping_amount,
        total_amount,
        match_status,
        price_variance,
        quantity_variance,
        variance_reason || null,
        match_status === "matched" ? approved_by : null,
      ]
    );

    const invoice = invoiceResult.rows[0];

    // If matched, update PO status
    if (match_status === "matched") {
      await query(
        `UPDATE purchase_orders SET status = 'invoiced' WHERE id = $1`,
        [poId]
      );
    }

    return NextResponse.json({
      message: "Invoice recorded successfully",
      invoice,
      three_way_match: {
        status: match_status,
        po_amount: parseFloat(po.total_amount),
        invoice_amount: parseFloat(total_amount),
        price_variance,
        variance_percentage: variance_percentage.toFixed(2),
        po_quantity: parseFloat(po_quantity),
        received_quantity: parseFloat(received_quantity),
        quantity_variance,
        variance_reason,
        requires_approval: match_status !== "matched",
      },
    });
  } catch (error: any) {
    console.error("Error recording invoice:", error);
    return NextResponse.json(
      { error: "Failed to record invoice", details: error.message },
      { status: 500 }
    );
  }
}
