import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * GET /api/supply-chain/rfqs/[id]/quotes
 * Get all quotes for an RFQ
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
        sq.*,
        s.company_name AS supplier_name,
        s.supplier_code,
        s.email AS supplier_email,
        (
          SELECT json_agg(
            json_build_object(
              'id', qi.id,
              'rfq_item_id', qi.rfq_item_id,
              'product_id', qi.product_id,
              'description', qi.description,
              'quantity', qi.quantity,
              'unit_price', qi.unit_price,
              'total', qi.total_price,
              'notes', qi.notes
            )
          )
          FROM quotation_items qi
          WHERE qi.quotation_id = sq.id
        ) AS items
      FROM supplier_quotations sq
      JOIN suppliers s ON s.id = sq.supplier_id
      WHERE sq.rfq_id = $1
      ORDER BY sq.total_amount, sq.evaluation_score DESC`,
      [rfqId]
    );

    return NextResponse.json({
      quotes: result.rows,
      quote_count: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/supply-chain/rfqs/[id]/quotes
 * Submit a quote for an RFQ (vendor submission)
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
      supplier_id,
      quote_number,
      valid_until,
      currency = "USD",
      payment_terms,
      delivery_time,
      notes,
      items, // Array of {rfq_item_id, unit_price, quantity, notes}
    } = body;

    if (!supplier_id || !valid_until || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: supplier_id, valid_until, items" },
        { status: 400 }
      );
    }

    // Check if supplier is invited
    const inviteCheck = await query(
      `SELECT id FROM rfq_suppliers WHERE rfq_id = $1 AND supplier_id = $2`,
      [rfqId, supplier_id]
    );

    if (inviteCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Supplier not invited to this RFQ" },
        { status: 403 }
      );
    }

    // Check for existing quote
    const existingQuote = await query(
      `SELECT id FROM supplier_quotations WHERE rfq_id = $1 AND supplier_id = $2`,
      [rfqId, supplier_id]
    );

    if (existingQuote.rows.length > 0) {
      return NextResponse.json(
        { error: "Quote already submitted by this supplier" },
        { status: 409 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += parseFloat(item.unit_price) * parseFloat(item.quantity);
    }

    const tax_amount = subtotal * 0.1; // 10% tax
    const shipping_cost = 0; // Can be provided in body
    const total_amount = subtotal + tax_amount + shipping_cost;

    // Create quotation
    const quoteResult = await query(
      `INSERT INTO supplier_quotations (
        rfq_id, supplier_id, quote_number, quote_date, valid_until,
        currency, subtotal, tax_amount, shipping_cost, total_amount,
        payment_terms, delivery_time, notes, status
      ) VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'received')
      RETURNING *`,
      [
        rfqId,
        supplier_id,
        quote_number || `Q-${Date.now()}`,
        valid_until,
        currency,
        subtotal,
        tax_amount,
        shipping_cost,
        total_amount,
        payment_terms,
        delivery_time,
        notes,
      ]
    );

    const quotation = quoteResult.rows[0];

    // Insert quotation items
    for (const item of items) {
      // Get RFQ item details
      const rfqItemResult = await query(
        `SELECT * FROM rfq_items WHERE id = $1`,
        [item.rfq_item_id]
      );

      if (rfqItemResult.rows.length === 0) continue;

      const rfqItem = rfqItemResult.rows[0];

      await query(
        `INSERT INTO quotation_items (
          quotation_id, rfq_item_id, product_id, description,
          quantity, unit, unit_price, total_price, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          quotation.id,
          item.rfq_item_id,
          rfqItem.product_id,
          rfqItem.description,
          item.quantity,
          rfqItem.unit,
          item.unit_price,
          parseFloat(item.unit_price) * parseFloat(item.quantity),
          item.notes || null,
        ]
      );
    }

    // Update rfq_suppliers status
    await query(
      `UPDATE rfq_suppliers 
       SET status = 'responded' 
       WHERE rfq_id = $1 AND supplier_id = $2`,
      [rfqId, supplier_id]
    );

    // Update RFQ status
    await query(
      `UPDATE rfq_requests 
       SET status = 'receiving_quotes', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'sent'`,
      [rfqId]
    );

    // Fetch complete quote
    const completeResult = await query(
      `SELECT 
        sq.*,
        s.company_name AS supplier_name,
        (
          SELECT json_agg(
            json_build_object(
              'rfq_item_id', qi.rfq_item_id,
              'description', qi.description,
              'quantity', qi.quantity,
              'unit_price', qi.unit_price,
              'total', qi.total_price
            )
          )
          FROM quotation_items qi
          WHERE qi.quotation_id = sq.id
        ) AS items
      FROM supplier_quotations sq
      JOIN suppliers s ON s.id = sq.supplier_id
      WHERE sq.id = $1`,
      [quotation.id]
    );

    return NextResponse.json(
      {
        message: "Quote submitted successfully",
        quote: completeResult.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting quote:", error);
    return NextResponse.json(
      { error: "Failed to submit quote", details: error.message },
      { status: 500 }
    );
  }
}
