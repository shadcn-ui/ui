import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/customers/quick - Quick customer lookup for POS
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");
    const membershipNumber = searchParams.get("membership_number");
    const query = searchParams.get("q");

    if (!phone && !email && !membershipNumber && !query) {
      return NextResponse.json(
        { success: false, error: "At least one search parameter is required (phone, email, membership_number, or q)" },
        { status: 400 }
      );
    }

    let sql = `
      SELECT 
        c.id,
        c.customer_number,
        c.company_name as name,
        c.contact_first_name,
        c.contact_last_name,
        CONCAT(c.contact_first_name, ' ', c.contact_last_name) as contact_person,
        c.contact_email as email,
        c.contact_phone as phone,
        c.billing_address,
        c.shipping_address,
        c.credit_limit,
        c.current_balance,
        c.payment_terms,
        c.is_active,
        0 as loyalty_points,
        'Standard' as tier_name,
        0 as tier_discount,
        1.0 as tier_points_multiplier
      FROM customers c
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Exact match searches (priority)
    if (phone) {
      sql += ` AND c.contact_phone = $${paramIndex}`;
      params.push(phone);
      paramIndex++;
    }

    if (email) {
      sql += ` AND c.contact_email = $${paramIndex}`;
      params.push(email);
      paramIndex++;
    }

    if (membershipNumber) {
      sql += ` AND c.customer_number = $${paramIndex}`;
      params.push(membershipNumber);
      paramIndex++;
    }

    // Fuzzy search (fallback)
    if (query && !phone && !email && !membershipNumber) {
      sql += ` AND (
        c.company_name ILIKE $${paramIndex}
        OR c.contact_first_name ILIKE $${paramIndex}
        OR c.contact_last_name ILIKE $${paramIndex}
        OR c.contact_phone ILIKE $${paramIndex}
        OR c.contact_email ILIKE $${paramIndex}
        OR c.customer_number ILIKE $${paramIndex}
      )`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    sql += ` AND (c.is_active = true OR c.is_active IS NULL)
             ORDER BY c.created_at DESC
             LIMIT 10`;

    const result = await pool.query(sql, params);

    // For each customer, get their recent purchase history
    const customersWithHistory = await Promise.all(
      result.rows.map(async (customer) => {
        const recentPurchases = await pool.query(
          `SELECT 
            so.id,
            so.order_number,
            so.order_date,
            so.total_amount,
            so.status
          FROM sales_orders so
          WHERE so.customer_id = $1
          ORDER BY so.order_date DESC
          LIMIT 5`,
          [customer.id]
        );

        return {
          ...customer,
          recent_purchases: recentPurchases.rows,
          total_orders: 0,
          total_revenue: 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: customersWithHistory,
      count: customersWithHistory.length,
    });
  } catch (error: any) {
    console.error("Error searching customers:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/pos/customers/quick - Quick create walk-in customer
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { contact_person, phone, email } = body;

    // Validation
    if (!contact_person || !phone) {
      return NextResponse.json(
        { success: false, error: "contact_person and phone are required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Check if customer already exists
    const existing = await client.query(
      `SELECT id FROM customers WHERE phone = $1 OR mobile = $1`,
      [phone]
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Customer with this phone number already exists", customer_id: existing.rows[0].id },
        { status: 400 }
      );
    }

    // Generate customer number
    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM customers`
    );
    const customerCount = parseInt(countResult.rows[0].count) + 1;
    const customerNumber = `CUST-${String(customerCount).padStart(6, '0')}`;

    // Get Bronze tier (default)
    const tierResult = await client.query(
      `SELECT id FROM membership_tiers WHERE tier_code = 'BRONZE' LIMIT 1`
    );
    const bronzeTierId = tierResult.rows[0]?.id;

    // Create customer
    const result = await client.query(
      `INSERT INTO customers (
        customer_number, contact_person, phone, email,
        customer_type, customer_status, payment_terms,
        membership_tier_id, membership_joined_date, loyalty_points,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, 'Individual', 'Active', 'Cash', $5, CURRENT_DATE, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *`,
      [customerNumber, contact_person, phone, email, bronzeTierId]
    );

    await client.query("COMMIT");

    // Fetch complete customer data with tier info
    const customerData = await pool.query(
      `SELECT 
        c.*,
        mt.tier_name,
        mt.tier_level,
        mt.discount_percentage as tier_discount,
        mt.points_multiplier
      FROM customers c
      LEFT JOIN membership_tiers mt ON c.membership_tier_id = mt.id
      WHERE c.id = $1`,
      [result.rows[0].id]
    );

    return NextResponse.json({
      success: true,
      data: customerData.rows[0],
      message: "Customer created successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
