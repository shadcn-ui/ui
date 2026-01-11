import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/purchase-orders/[id]/receive
 * Record receipt of goods for a PO
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
      delivery_number,
      received_by,
      received_date = new Date().toISOString().split('T')[0],
      carrier,
      tracking_number,
      inspection_required = true,
      receiving_notes,
      items, // Array of {po_item_id, received_qty, accepted_qty, rejected_qty, rejection_reason, lot_number}
    } = body;

    if (!delivery_number || !received_by || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create delivery record
    const deliveryResult = await query(
      `INSERT INTO po_deliveries (
        purchase_order_id, delivery_number, actual_delivery_date,
        carrier, tracking_number, delivery_status, received_by,
        received_date, inspection_required, receiving_notes
      ) VALUES ($1, $2, $3, $4, $5, 'delivered', $6, $7, $8, $9)
      RETURNING *`,
      [
        poId,
        delivery_number,
        received_date,
        carrier,
        tracking_number,
        received_by,
        received_date,
        inspection_required,
        receiving_notes,
      ]
    );

    const delivery = deliveryResult.rows[0];

    // Record line item receipts
    for (const item of items) {
      await query(
        `INSERT INTO po_line_receipts (
          purchase_order_item_id, delivery_id, received_quantity,
          accepted_quantity, rejected_quantity, rejection_reason,
          lot_number, received_date, received_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          item.po_item_id,
          delivery.id,
          item.received_qty,
          item.accepted_qty || item.received_qty,
          item.rejected_qty || 0,
          item.rejection_reason || null,
          item.lot_number || null,
          received_date,
          received_by,
        ]
      );

      // Update inventory for accepted quantity
      if (item.accepted_qty > 0) {
        const poItemResult = await query(
          `SELECT product_id FROM purchase_order_items WHERE id = $1`,
          [item.po_item_id]
        );

        if (poItemResult.rows.length > 0) {
          const product_id = poItemResult.rows[0].product_id;

          await query(
            `INSERT INTO inventory (product_id, quantity_on_hand, last_updated)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (product_id) 
             DO UPDATE SET 
               quantity_on_hand = inventory.quantity_on_hand + $2,
               last_updated = CURRENT_TIMESTAMP`,
            [product_id, item.accepted_qty]
          );
        }
      }
    }

    // Check if all items received, update PO status
    const allItemsResult = await query(
      `SELECT 
        SUM(poi.quantity) AS total_ordered,
        COALESCE(SUM(plr.received_quantity), 0) AS total_received
      FROM purchase_order_items poi
      LEFT JOIN po_line_receipts plr ON plr.purchase_order_item_id = poi.id
      WHERE poi.purchase_order_id = $1`,
      [poId]
    );

    const { total_ordered, total_received } = allItemsResult.rows[0];

    if (parseFloat(total_received) >= parseFloat(total_ordered)) {
      await query(
        `UPDATE purchase_orders SET status = 'received' WHERE id = $1`,
        [poId]
      );
    } else {
      await query(
        `UPDATE purchase_orders SET status = 'partially_received' WHERE id = $1`,
        [poId]
      );
    }

    return NextResponse.json({
      message: "Receipt recorded successfully",
      delivery,
      items_received: items.length,
    });
  } catch (error: any) {
    console.error("Error recording receipt:", error);
    return NextResponse.json(
      { error: "Failed to record receipt", details: error.message },
      { status: 500 }
    );
  }
}
