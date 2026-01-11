import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/supply-chain/rfqs/[id]/invite
 * Invite suppliers to an RFQ
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
      supplier_ids, // Array of supplier IDs to invite
      auto_select = false, // Auto-select based on scorecards
      min_score = 70, // Minimum scorecard score for auto-selection
      max_suppliers = 10, // Maximum suppliers to auto-select
    } = body;

    // Check if RFQ exists
    const rfqResult = await query(
      `SELECT status FROM rfq_requests WHERE id = $1`,
      [rfqId]
    );

    if (rfqResult.rows.length === 0) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    let suppliersToInvite: number[] = [];

    if (auto_select) {
      // Auto-select suppliers based on scorecards
      const autoResult = await query(
        `SELECT DISTINCT s.id, s.company_name, sc.overall_score, sc.rank
         FROM suppliers s
         LEFT JOIN supplier_scorecards sc ON sc.supplier_id = s.id
           AND sc.status = 'final'
           AND sc.evaluation_period_end = (
             SELECT MAX(evaluation_period_end)
             FROM supplier_scorecards
             WHERE supplier_id = s.id AND status = 'final'
           )
         WHERE s.status = 'Active'
           AND (sc.overall_score >= $1 OR sc.overall_score IS NULL)
         ORDER BY sc.overall_score DESC NULLS LAST, s.company_name
         LIMIT $2`,
        [min_score, max_suppliers]
      );

      suppliersToInvite = autoResult.rows.map((r) => r.id);
    } else if (supplier_ids && supplier_ids.length > 0) {
      suppliersToInvite = supplier_ids;
    } else {
      return NextResponse.json(
        { error: "Either supplier_ids or auto_select must be provided" },
        { status: 400 }
      );
    }

    // Insert invited suppliers
    const invitedSuppliers = [];
    for (const supplierId of suppliersToInvite) {
      const result = await query(
        `INSERT INTO rfq_suppliers (rfq_id, supplier_id, sent_date, status)
         VALUES ($1, $2, CURRENT_DATE, 'pending')
         ON CONFLICT (rfq_id, supplier_id) 
         DO UPDATE SET sent_date = CURRENT_DATE, status = 'pending'
         RETURNING *`,
        [rfqId, supplierId]
      );

      // Get supplier details
      const supplierDetails = await query(
        `SELECT id, company_name, supplier_code, email 
         FROM suppliers WHERE id = $1`,
        [supplierId]
      );

      invitedSuppliers.push({
        ...result.rows[0],
        supplier: supplierDetails.rows[0],
      });
    }

    // Update RFQ status to 'sent' if still draft
    await query(
      `UPDATE rfq_requests 
       SET status = CASE WHEN status = 'draft' THEN 'sent' ELSE status END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [rfqId]
    );

    return NextResponse.json({
      message: `Successfully invited ${invitedSuppliers.length} supplier(s)`,
      invited_suppliers: invitedSuppliers,
      rfq_id: rfqId,
    });
  } catch (error: any) {
    console.error("Error inviting suppliers to RFQ:", error);
    return NextResponse.json(
      { error: "Failed to invite suppliers", details: error.message },
      { status: 500 }
    );
  }
}
