import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/cart/[id] - Get specific held cart with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get cart details
    const cartResult = await pool.query(
      `SELECT 
        hc.*,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        c.name as customer_name,
        c.phone as customer_phone,
        c.email as customer_email,
        c.loyalty_points as customer_loyalty_points
      FROM held_carts hc
      LEFT JOIN users u ON hc.cashier_id = u.id
      LEFT JOIN customers c ON hc.customer_id = c.id
      WHERE hc.id = $1`,
      [parseInt(id)]
    );

    if (cartResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    const cart = cartResult.rows[0];

    // Get cart items with product details
    const itemsResult = await pool.query(
      `SELECT 
        hci.*,
        p.name as product_name,
        p.sku,
        p.barcode,
        p.primary_image_url,
        p.unit_of_measure,
        pb.batch_number,
        pb.expiry_date,
        pc.name as category_name
      FROM held_cart_items hci
      JOIN products p ON hci.product_id = p.id
      LEFT JOIN product_batches pb ON hci.batch_id = pb.id
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE hci.held_cart_id = $1
      ORDER BY hci.id ASC`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      cart: {
        ...cart,
        items: itemsResult.rows,
      },
    });

  } catch (error: any) {
    console.error("Error fetching cart details:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/pos/cart/[id] - Update cart status (retrieve/cancel)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();

  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // 'retrieve' or 'cancel'

    if (!action || !['retrieve', 'cancel'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be 'retrieve' or 'cancel'" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    const status = action === 'retrieve' ? 'retrieved' : 'cancelled';
    const timestampField = action === 'retrieve' ? 'retrieved_at' : 'cancelled_at';

    const result = await client.query(
      `UPDATE held_carts 
       SET status = $1, ${timestampField} = CURRENT_TIMESTAMP
       WHERE id = $2 AND status = 'held'
       RETURNING *`,
      [status, parseInt(id)]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Cart not found or already processed" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      cart: result.rows[0],
      message: `Cart ${action}d successfully`,
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
