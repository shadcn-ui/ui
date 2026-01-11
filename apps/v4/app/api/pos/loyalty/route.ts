import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/pos/loyalty/calculate - Calculate loyalty points and rewards for a transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      subtotal,
      items, // [{ product_id, quantity, unit_price }]
      points_to_redeem = 0,
    } = body;

    if (!customer_id || subtotal === undefined) {
      return NextResponse.json(
        { success: false, error: "customer_id and subtotal are required" },
        { status: 400 }
      );
    }

    // Get customer with loyalty tier
    const customerResult = await pool.query(
      `SELECT 
        c.*,
        lt.tier_name,
        lt.points_multiplier,
        lt.discount_percentage,
        lt.min_points,
        lt.benefits
      FROM customers c
      LEFT JOIN loyalty_tiers lt ON c.loyalty_tier_id = lt.id
      WHERE c.id = $1`,
      [parseInt(customer_id)]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];
    const currentPoints = parseInt(customer.loyalty_points) || 0;
    const pointsMultiplier = parseFloat(customer.points_multiplier) || 1.0;
    const tierDiscount = parseFloat(customer.discount_percentage) || 0;

    // Check if customer has enough points to redeem
    if (points_to_redeem > currentPoints) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient points. Customer has ${currentPoints} points, trying to redeem ${points_to_redeem}`,
        },
        { status: 400 }
      );
    }

    // Calculate points to earn (typically 1 point per dollar spent)
    // Points are earned on subtotal after discounts but before redemption
    const pointsEarned = Math.floor(subtotal * pointsMultiplier);

    // Calculate redemption value (typically 1 point = $0.01 or configurable)
    const pointRedemptionValue = await pool.query(
      `SELECT value FROM system_settings WHERE key = 'loyalty_point_value' LIMIT 1`
    );
    const pointValue = parseFloat(pointRedemptionValue.rows[0]?.value || "0.01");
    const redemptionAmount = points_to_redeem * pointValue;

    // Calculate tier discount amount
    const tierDiscountAmount = (subtotal * tierDiscount) / 100;

    // Calculate new points balance
    const newPointsBalance = currentPoints - points_to_redeem + pointsEarned;

    // Check for tier upgrade
    const tierUpgradeResult = await pool.query(
      `SELECT 
        id, 
        tier_name, 
        min_points,
        points_multiplier,
        discount_percentage,
        benefits
      FROM loyalty_tiers
      WHERE min_points <= $1
      AND (max_points IS NULL OR max_points >= $1)
      ORDER BY min_points DESC
      LIMIT 1`,
      [newPointsBalance]
    );

    let tierUpgrade = null;
    if (tierUpgradeResult.rows.length > 0) {
      const newTier = tierUpgradeResult.rows[0];
      if (newTier.id !== customer.loyalty_tier_id) {
        tierUpgrade = {
          from_tier: customer.tier_name,
          to_tier: newTier.tier_name,
          new_benefits: newTier.benefits,
          new_discount: newTier.discount_percentage,
          new_multiplier: newTier.points_multiplier,
        };
      }
    }

    // Check for available rewards
    const availableRewardsResult = await pool.query(
      `SELECT 
        id,
        reward_name,
        description,
        points_required,
        discount_type,
        discount_value,
        valid_from,
        valid_until,
        usage_limit,
        times_used
      FROM loyalty_rewards
      WHERE points_required <= $1
      AND is_active = true
      AND (valid_from IS NULL OR valid_from <= CURRENT_DATE)
      AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
      AND (usage_limit IS NULL OR times_used < usage_limit)
      ORDER BY points_required DESC`,
      [newPointsBalance]
    );

    return NextResponse.json({
      success: true,
      loyalty_calculation: {
        customer: {
          id: customer.id,
          name: customer.name,
          current_points: currentPoints,
          tier: customer.tier_name,
          tier_discount_percentage: tierDiscount,
        },
        transaction: {
          subtotal: subtotal,
          points_to_redeem: points_to_redeem,
          redemption_amount: redemptionAmount,
          tier_discount_amount: tierDiscountAmount,
          points_earned: pointsEarned,
          new_points_balance: newPointsBalance,
        },
        tier_upgrade: tierUpgrade,
        available_rewards: availableRewardsResult.rows,
      },
    });

  } catch (error: any) {
    console.error("Error calculating loyalty points:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/pos/loyalty/customer - Get customer loyalty information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");

    if (!customerId && !phone && !email) {
      return NextResponse.json(
        { success: false, error: "customer_id, phone, or email is required" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        c.*,
        lt.tier_name,
        lt.points_multiplier,
        lt.discount_percentage,
        lt.min_points,
        lt.max_points,
        lt.benefits,
        (
          SELECT COUNT(*)
          FROM pos_transactions
          WHERE customer_id = c.id 
          AND transaction_status = 'completed'
        ) as total_transactions,
        (
          SELECT COALESCE(SUM(grand_total), 0)
          FROM pos_transactions
          WHERE customer_id = c.id 
          AND transaction_status = 'completed'
        ) as lifetime_value
      FROM customers c
      LEFT JOIN loyalty_tiers lt ON c.loyalty_tier_id = lt.id
      WHERE 1=1
    `;

    const params: any[] = [];
    if (customerId) {
      params.push(parseInt(customerId));
      query += ` AND c.id = $${params.length}`;
    } else if (phone) {
      params.push(phone);
      query += ` AND c.phone = $${params.length}`;
    } else if (email) {
      params.push(email);
      query += ` AND c.email = $${params.length}`;
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    const customer = result.rows[0];

    // Get loyalty transaction history
    const historyResult = await pool.query(
      `SELECT 
        id,
        transaction_type,
        points_change,
        points_balance_after,
        reference_type,
        reference_id,
        description,
        created_at
      FROM loyalty_point_transactions
      WHERE customer_id = $1
      ORDER BY created_at DESC
      LIMIT 20`,
      [customer.id]
    );

    // Get next tier information
    const nextTierResult = await pool.query(
      `SELECT 
        id,
        tier_name,
        min_points,
        points_multiplier,
        discount_percentage,
        benefits
      FROM loyalty_tiers
      WHERE min_points > $1
      ORDER BY min_points ASC
      LIMIT 1`,
      [customer.loyalty_points || 0]
    );

    const nextTier = nextTierResult.rows.length > 0 ? nextTierResult.rows[0] : null;
    const pointsToNextTier = nextTier ? nextTier.min_points - (customer.loyalty_points || 0) : null;

    return NextResponse.json({
      success: true,
      customer: {
        ...customer,
        total_transactions: parseInt(customer.total_transactions),
        lifetime_value: parseFloat(customer.lifetime_value),
        points_to_next_tier: pointsToNextTier,
        next_tier: nextTier,
      },
      loyalty_history: historyResult.rows,
    });

  } catch (error: any) {
    console.error("Error fetching customer loyalty info:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
