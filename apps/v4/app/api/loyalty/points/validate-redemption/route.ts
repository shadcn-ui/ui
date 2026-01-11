import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/loyalty/points/validate-redemption - Validate if customer can redeem points
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, points_to_redeem } = body;

    if (!customer_id || !points_to_redeem) {
      return NextResponse.json(
        { success: false, error: "customer_id and points_to_redeem are required" },
        { status: 400 }
      );
    }

    // Get customer's available points
    const customerResult = await pool.query(
      `SELECT loyalty_points FROM customers WHERE id = $1`,
      [customer_id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const availablePoints = customerResult.rows[0].loyalty_points;

    // Get redemption configuration
    const configResult = await pool.query(
      `SELECT redemption_rate, min_points_to_redeem, max_points_per_transaction
       FROM loyalty_points_config WHERE is_active = true LIMIT 1`
    );

    const config = configResult.rows[0];
    const redemptionRate = parseFloat(config.redemption_rate);
    const minPoints = parseInt(config.min_points_to_redeem);
    const maxPoints = config.max_points_per_transaction ? parseInt(config.max_points_per_transaction) : null;

    // Validation
    const errors = [];
    
    if (points_to_redeem > availablePoints) {
      errors.push(`Insufficient points. Available: ${availablePoints}`);
    }

    if (points_to_redeem < minPoints) {
      errors.push(`Minimum ${minPoints} points required`);
    }

    if (maxPoints && points_to_redeem > maxPoints) {
      errors.push(`Maximum ${maxPoints} points allowed per transaction`);
    }

    const discountAmount = points_to_redeem * redemptionRate;
    const canRedeem = errors.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        can_redeem: canRedeem,
        available_points: availablePoints,
        points_to_redeem: points_to_redeem,
        discount_amount: discountAmount,
        redemption_rate: redemptionRate,
        errors: errors,
      },
    });
  } catch (error: any) {
    console.error("Error validating redemption:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
