import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/cart - Get held/saved carts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const terminalId = searchParams.get("terminal_id");
    const cashierId = searchParams.get("cashier_id");

    if (!sessionId && !terminalId) {
      return NextResponse.json(
        { success: false, error: "Either session_id or terminal_id is required" },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        hc.*,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        c.name as customer_name,
        c.phone as customer_phone
      FROM held_carts hc
      LEFT JOIN users u ON hc.cashier_id = u.id
      LEFT JOIN customers c ON hc.customer_id = c.id
      WHERE hc.status = 'held'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (sessionId) {
      query += ` AND hc.session_id = $${paramIndex}`;
      params.push(parseInt(sessionId));
      paramIndex++;
    } else if (terminalId) {
      query += ` AND hc.terminal_id = $${paramIndex}`;
      params.push(parseInt(terminalId));
      paramIndex++;
    }

    if (cashierId) {
      query += ` AND hc.cashier_id = $${paramIndex}`;
      params.push(parseInt(cashierId));
      paramIndex++;
    }

    query += ` ORDER BY hc.held_at DESC`;

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      carts: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching held carts:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/pos/cart - Save/hold a cart
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      session_id,
      terminal_id,
      cashier_id,
      customer_id,
      items, // [{ product_id, quantity, unit_price, discount, tax_rate, batch_id?, notes? }]
      cart_name,
      notes,
    } = body;

    // Validation
    if (!session_id || !terminal_id || !cashier_id || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Calculate cart totals
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    for (const item of items) {
      const itemSubtotal = item.quantity * item.unit_price;
      const itemDiscount = item.discount || 0;
      const itemTax = item.tax_rate
        ? (itemSubtotal - itemDiscount) * (item.tax_rate / 100)
        : 0;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    }

    const grandTotal = subtotal - totalDiscount + totalTax;

    // Generate cart reference
    const cartRef = `CART-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Insert held cart
    const cartResult = await client.query(
      `INSERT INTO held_carts (
        cart_reference, session_id, terminal_id, cashier_id, customer_id,
        cart_name, subtotal, discount_amount, tax_amount, grand_total,
        notes, status, held_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'held', CURRENT_TIMESTAMP)
      RETURNING *`,
      [
        cartRef,
        session_id,
        terminal_id,
        cashier_id,
        customer_id || null,
        cart_name || `Cart ${cartRef}`,
        subtotal,
        totalDiscount,
        totalTax,
        grandTotal,
        notes || null,
      ]
    );

    const cart = cartResult.rows[0];

    // Insert cart items
    for (const item of items) {
      await client.query(
        `INSERT INTO held_cart_items (
          held_cart_id, product_id, batch_id, quantity, 
          unit_price, discount_amount, tax_rate, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          cart.id,
          item.product_id,
          item.batch_id || null,
          item.quantity,
          item.unit_price,
          item.discount || 0,
          item.tax_rate || 0,
          item.notes || null,
        ]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      cart,
      message: "Cart saved successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE /api/pos/cart - Delete/clear a held cart
export async function DELETE(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cart_id");

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: "cart_id is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Delete cart items
    await client.query(
      `DELETE FROM held_cart_items WHERE held_cart_id = $1`,
      [parseInt(cartId)]
    );

    // Delete cart
    const result = await client.query(
      `DELETE FROM held_carts WHERE id = $1 RETURNING *`,
      [parseInt(cartId)]
    );

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Cart not found" },
        { status: 404 }
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Cart deleted successfully",
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error deleting cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
