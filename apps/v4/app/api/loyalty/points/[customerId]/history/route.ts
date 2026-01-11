import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/loyalty/points/[customerId]/history - Get customer's points history
export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const customerId = parseInt(params.customerId);

    // Get customer info with tier
    const customerResult = await pool.query(
      `SELECT 
        c.id,
        c.contact_person,
        c.membership_number,
        c.loyalty_points,
        c.points_earned_lifetime,
        c.points_redeemed_lifetime,
        c.lifetime_purchase_value,
        c.membership_joined_date,
        mt.tier_name,
        mt.tier_level,
        mt.points_multiplier,
        mt.discount_percentage
      FROM customers c
      LEFT JOIN membership_tiers mt ON c.membership_tier_id = mt.id
      WHERE c.id = $1`,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Get points history
    const historyResult = await pool.query(
      `SELECT 
        lph.*,
        CONCAT(u.first_name, ' ', u.last_name) as created_by_name,
        so.order_number
      FROM loyalty_points_history lph
      LEFT JOIN users u ON lph.created_by = u.id
      LEFT JOIN sales_orders so ON lph.sales_order_id = so.id
      WHERE lph.customer_id = $1
      ORDER BY lph.created_at DESC
      LIMIT 100`,
      [customerId]
    );

    // Get points expiring soon (within 30 days)
    const expiringResult = await pool.query(
      `SELECT 
        SUM(points_amount) as expiring_points,
        MIN(expiry_date) as earliest_expiry
      FROM loyalty_points_history
      WHERE customer_id = $1
      AND transaction_type = 'earn'
      AND expiry_date IS NOT NULL
      AND expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'`,
      [customerId]
    );

    return NextResponse.json({
      success: true,
      data: {
        customer: customerResult.rows[0],
        history: historyResult.rows,
        expiring_soon: expiringResult.rows[0],
      },
    });
  } catch (error: any) {
    console.error("Error fetching points history:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
