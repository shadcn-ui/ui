import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/rfqs/[id]/award
 * Award the RFQ to a specific supplier quote
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const routeParams = await context.params;
    const rfqId = parseInt(routeParams.id);
    const body = await request.json();

    const {
      quote_id,
      awarded_by,
      create_purchase_order = false,
      po_notes,
    } = body;

    if (!quote_id || !awarded_by) {
      return NextResponse.json(
        { error: "Missing required fields: quote_id, awarded_by" },
        { status: 400 }
      );
    }

    // Get quote details
    const quoteResult = await query(
      `SELECT sq.*, s.id AS supplier_id
       FROM supplier_quotations sq
       JOIN suppliers s ON s.id = sq.supplier_id
       WHERE sq.id = $1 AND sq.rfq_id = $2`,
      [quote_id, rfqId]
    );

    if (quoteResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Quote not found for this RFQ" },
        { status: 404 }
      );
    }

    const quote = quoteResult.rows[0];

    // Update quote status to accepted
    await query(
      `UPDATE supplier_quotations 
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [quote_id]
    );

    // Reject other quotes
    await query(
      `UPDATE supplier_quotations 
       SET status = 'rejected', 
           evaluation_notes = COALESCE(evaluation_notes, '') || ' - Another supplier was awarded',
           updated_at = CURRENT_TIMESTAMP
       WHERE rfq_id = $1 AND id != $2`,
      [rfqId, quote_id]
    );

    // Update RFQ status to completed
    await query(
      `UPDATE rfq_requests 
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [rfqId]
    );

    let purchaseOrder = null;

    // Create purchase order if requested
    if (create_purchase_order) {
      // Generate PO number
      const poNumberResult = await query(
        `SELECT 'PO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
         LPAD((COUNT(*) + 1)::TEXT, 4, '0') AS po_number
         FROM purchase_orders 
         WHERE order_date = CURRENT_DATE`
      );
      const po_number = poNumberResult.rows[0].po_number;

      // Get quote items
      const itemsResult = await query(
        `SELECT * FROM quotation_items WHERE quotation_id = $1`,
        [quote_id]
      );

      // Create PO
      const poResult = await query(
        `INSERT INTO purchase_orders (
          po_number, supplier_id, order_date, expected_delivery_date,
          status, subtotal, tax_amount, total_amount,
          payment_terms, shipping_terms, notes, created_by
        ) VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days',
          'pending', $3, $4, $5, $6, 'FOB', $7, $8)
        RETURNING *`,
        [
          po_number,
          quote.supplier_id,
          quote.subtotal,
          quote.tax_amount,
          quote.total_amount,
          quote.payment_terms || 'Net 30',
          po_notes || `Generated from RFQ ${rfqId}, Quote ${quote.quote_number}`,
          awarded_by,
        ]
      );

      purchaseOrder = poResult.rows[0];

      // Add PO items
      for (const item of itemsResult.rows) {
        await query(
          `INSERT INTO purchase_order_items (
            purchase_order_id, product_id, description, quantity,
            unit_price, total, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            purchaseOrder.id,
            item.product_id,
            item.description,
            item.quantity,
            item.unit_price,
            item.total_price,
            item.notes,
          ]
        );
      }
    }

    return NextResponse.json({
      message: "RFQ awarded successfully",
      rfq_id: rfqId,
      awarded_quote: {
        quote_id,
        supplier_id: quote.supplier_id,
        total_amount: quote.total_amount,
      },
      purchase_order: purchaseOrder
        ? {
            id: purchaseOrder.id,
            po_number: purchaseOrder.po_number,
            status: purchaseOrder.status,
          }
        : null,
    });
  } catch (error: any) {
    console.error("Error awarding RFQ:", error);
    return NextResponse.json(
      { error: "Failed to award RFQ", details: error.message },
      { status: 500 }
    );
  }
}
