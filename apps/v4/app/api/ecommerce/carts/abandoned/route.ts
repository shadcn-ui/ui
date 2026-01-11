import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/carts/abandoned - List abandoned carts
// POST /api/ecommerce/carts/abandoned/recover - Send recovery emails
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const storefront_id = searchParams.get("storefront_id");
    const min_value = searchParams.get("min_value"); // Minimum cart value
    const days_abandoned = searchParams.get("days_abandoned") || "7";
    const recovery_sent = searchParams.get("recovery_sent");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let whereConditions = ["ec.is_abandoned = true", "ec.converted_to_order = false"];
    let params: any[] = [];
    let paramCount = 1;

    if (storefront_id) {
      params.push(storefront_id);
      whereConditions.push(`ec.storefront_id = $${paramCount++}`);
    }

    if (min_value) {
      params.push(parseFloat(min_value));
      whereConditions.push(`ec.total_amount >= $${paramCount++}`);
    }

    if (days_abandoned) {
      params.push(parseInt(days_abandoned));
      whereConditions.push(`ec.abandoned_at >= CURRENT_TIMESTAMP - ($${paramCount++} || ' days')::interval`);
    }

    if (recovery_sent !== null && recovery_sent !== undefined) {
      params.push(recovery_sent === "true");
      whereConditions.push(`ec.recovery_email_sent = $${paramCount++}`);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ecommerce_carts ec
      WHERE ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get abandoned carts
    params.push(limit, offset);
    const query = `
      SELECT 
        ec.*,
        es.storefront_name,
        es.platform_type,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - ec.abandoned_at)) / 3600 as hours_abandoned,
        EXTRACT(DAY FROM (CURRENT_TIMESTAMP - ec.abandoned_at)) as days_abandoned
      FROM ecommerce_carts ec
      LEFT JOIN ecommerce_storefronts es ON ec.storefront_id = es.storefront_id
      WHERE ${whereClause}
      ORDER BY ec.total_amount DESC, ec.abandoned_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_abandoned_carts,
        SUM(total_amount) as potential_revenue,
        AVG(total_amount) as average_cart_value,
        SUM(CASE WHEN recovery_email_sent THEN 1 ELSE 0 END) as recovery_emails_sent,
        SUM(CASE WHEN converted_to_order THEN 1 ELSE 0 END) as recovered_carts,
        SUM(CASE WHEN converted_to_order THEN total_amount ELSE 0 END) as recovered_revenue
      FROM ecommerce_carts
      WHERE ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, params.length - 2));

    return NextResponse.json({
      carts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching abandoned carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch abandoned carts", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { cart_ids, storefront_id, email_template, send_all } = body;

    if (!email_template) {
      return NextResponse.json(
        { error: "Missing required field: email_template" },
        { status: 400 }
      );
    }

    let affectedCarts = 0;
    let emailsSent = 0;
    let errors: any[] = [];

    if (send_all && storefront_id) {
      // Send recovery emails to all eligible carts
      const updateQuery = `
        UPDATE ecommerce_carts
        SET 
          recovery_email_sent = true,
          recovery_email_sent_at = CURRENT_TIMESTAMP,
          recovery_email_count = recovery_email_count + 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE storefront_id = $1
        AND is_abandoned = true
        AND converted_to_order = false
        AND customer_email IS NOT NULL
        AND (recovery_email_sent = false OR recovery_email_count < 3)
        RETURNING cart_id, customer_email, total_amount
      `;

      const result = await client.query(updateQuery, [storefront_id]);
      affectedCarts = result.rowCount || 0;
      emailsSent = affectedCarts;

      // Here you would integrate with your email service
      // For now, we just mark as sent
    } else if (cart_ids && Array.isArray(cart_ids)) {
      // Send recovery emails to specific carts
      for (const cartId of cart_ids) {
        try {
          const updateQuery = `
            UPDATE ecommerce_carts
            SET 
              recovery_email_sent = true,
              recovery_email_sent_at = CURRENT_TIMESTAMP,
              recovery_email_count = recovery_email_count + 1,
              updated_at = CURRENT_TIMESTAMP
            WHERE cart_id = $1
            AND is_abandoned = true
            AND converted_to_order = false
            AND customer_email IS NOT NULL
            RETURNING cart_id, customer_email, total_amount, checkout_url
          `;

          const result = await client.query(updateQuery, [cartId]);

          if (result.rowCount && result.rowCount > 0) {
            affectedCarts++;
            emailsSent++;

            // Here you would send the actual email
            // For example, using SendGrid, AWS SES, etc.
            // await sendRecoveryEmail(result.rows[0], email_template);
          } else {
            errors.push({
              cart_id: cartId,
              error: "Cart not found or not eligible for recovery",
            });
          }
        } catch (error: any) {
          errors.push({
            cart_id: cartId,
            error: error.message,
          });
        }
      }
    } else {
      return NextResponse.json(
        { error: "Either cart_ids array or send_all=true with storefront_id is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Recovery emails processed",
      affected_carts: affectedCarts,
      emails_sent: emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("Error sending recovery emails:", error);
    return NextResponse.json(
      { error: "Failed to send recovery emails", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
