import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/pos/transactions - Process complete checkout
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      session_id,
      terminal_id,
      warehouse_id,
      customer_id,
      cashier_id,
      items, // [{ product_id, quantity, unit_price, discount, batch_id? }]
      payments, // [{ method, amount, provider?, reference? }]
      loyalty_points_to_redeem = 0,
      notes,
      offline_transaction = false,
    } = body;

    // Validation
    if (!session_id || !terminal_id || !warehouse_id || !cashier_id || !items || !payments) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one item is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Verify session is open
    const sessionCheck = await client.query(
      `SELECT id, session_status FROM pos_sessions WHERE id = $1`,
      [session_id]
    );

    if (sessionCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    if (sessionCheck.rows[0].session_status !== 'open') {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Session is not open" },
        { status: 400 }
      );
    }

    // Get tax configuration
    const taxConfig = await client.query(
      `SELECT tax_rate FROM tax_configurations 
       WHERE is_default = true AND is_active = true LIMIT 1`
    );
    const taxRate = parseFloat(taxConfig.rows[0]?.tax_rate || 0);

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let itemDiscount = 0;

    for (const item of items) {
      const itemTotal = item.quantity * item.unit_price;
      const itemDiscountAmount = item.discount || 0;
      subtotal += itemTotal - itemDiscountAmount;
      itemDiscount += itemDiscountAmount;

      // Check if product is taxable
      const productResult = await client.query(
        `SELECT is_taxable FROM products WHERE id = $1`,
        [item.product_id]
      );
      
      if (productResult.rows[0]?.is_taxable) {
        taxAmount += (itemTotal - itemDiscountAmount) * (taxRate / 100);
      }
    }

    // Calculate loyalty discount if points are being redeemed
    let loyaltyDiscount = 0;
    let pointsRedeemed = 0;

    if (customer_id && loyalty_points_to_redeem > 0) {
      // Get customer's loyalty points and redemption rate
      const customerResult = await client.query(
        `SELECT loyalty_points FROM customers WHERE id = $1`,
        [customer_id]
      );

      const availablePoints = customerResult.rows[0]?.loyalty_points || 0;

      if (availablePoints < loyalty_points_to_redeem) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: `Insufficient loyalty points. Available: ${availablePoints}` },
          { status: 400 }
        );
      }

      // Get redemption rate
      const redemptionConfig = await client.query(
        `SELECT redemption_rate, min_points_to_redeem 
         FROM loyalty_points_config WHERE is_active = true LIMIT 1`
      );

      const redemptionRate = parseFloat(redemptionConfig.rows[0]?.redemption_rate || 1000);
      const minPoints = parseInt(redemptionConfig.rows[0]?.min_points_to_redeem || 100);

      if (loyalty_points_to_redeem < minPoints) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: `Minimum ${minPoints} points required for redemption` },
          { status: 400 }
        );
      }

      loyaltyDiscount = loyalty_points_to_redeem * redemptionRate;
      pointsRedeemed = loyalty_points_to_redeem;
    }

    const totalAmount = subtotal + taxAmount - loyaltyDiscount;

    // Validate payment amounts
    const totalPayment = payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0);
    
    if (Math.abs(totalPayment - totalAmount) > 0.01) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { 
          success: false, 
          error: `Payment amount (${totalPayment}) does not match total (${totalAmount})` 
        },
        { status: 400 }
      );
    }

    // Generate order number
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const orderCountResult = await client.query(
      `SELECT COUNT(*) as count FROM sales_orders WHERE order_number LIKE $1`,
      [`SO-${today}%`]
    );
    const orderCount = parseInt(orderCountResult.rows[0].count) + 1;
    const orderNumber = `SO-${today}-${String(orderCount).padStart(5, '0')}`;

    // Create sales order
    const salesOrderResult = await client.query(
      `INSERT INTO sales_orders (
        order_number, customer_id, order_date, order_status,
        subtotal, tax_amount, discount_amount, total_amount,
        payment_status, notes, created_by, created_at
      ) VALUES ($1, $2, CURRENT_TIMESTAMP, 'Completed', $3, $4, $5, $6, 'Paid', $7, $8, CURRENT_TIMESTAMP)
      RETURNING id`,
      [orderNumber, customer_id, subtotal, taxAmount, itemDiscount + loyaltyDiscount, totalAmount, notes, cashier_id]
    );

    const salesOrderId = salesOrderResult.rows[0].id;

    // Create sales order items
    for (const item of items) {
      await client.query(
        `INSERT INTO sales_order_items (
          sales_order_id, product_id, quantity, unit_price, 
          discount, total_price, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
        [
          salesOrderId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.discount || 0,
          (item.quantity * item.unit_price) - (item.discount || 0)
        ]
      );

      // Update product stock (deduct from current_stock)
      await client.query(
        `UPDATE products SET 
          current_stock = current_stock - $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2`,
        [item.quantity, item.product_id]
      );

      // Update batch quantity if batch tracking
      if (item.batch_id) {
        await client.query(
          `UPDATE product_batches SET
            quantity_remaining = quantity_remaining - $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $2`,
          [item.quantity, item.batch_id]
        );
      }
    }

    // Generate transaction number
    const txnCountResult = await client.query(
      `SELECT COUNT(*) as count FROM pos_transactions WHERE transaction_number LIKE $1`,
      [`TXN-${today}%`]
    );
    const txnCount = parseInt(txnCountResult.rows[0].count) + 1;
    const transactionNumber = `TXN-${today}-${String(txnCount).padStart(5, '0')}`;

    // Calculate tender and change (for cash payments)
    const cashPayment = payments.find((p: any) => p.method === 'cash');
    const tenderAmount = cashPayment ? parseFloat(cashPayment.amount) : totalAmount;
    const changeAmount = cashPayment ? Math.max(0, tenderAmount - totalAmount) : 0;

    // Create POS transaction
    const posTransactionResult = await client.query(
      `INSERT INTO pos_transactions (
        transaction_number, session_id, terminal_id, warehouse_id,
        sales_order_id, customer_id, cashier_id, transaction_type,
        subtotal, tax_amount, discount_amount, loyalty_points_redeemed,
        loyalty_discount, total_amount, tender_amount, change_amount,
        payment_status, transaction_status, notes, offline_transaction,
        synced_at, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, 'sale', $8, $9, $10, $11, $12, $13, $14, $15,
        'paid', 'completed', $16, $17, $18, CURRENT_TIMESTAMP
      ) RETURNING id`,
      [
        transactionNumber, session_id, terminal_id, warehouse_id,
        salesOrderId, customer_id, cashier_id,
        subtotal, taxAmount, itemDiscount, pointsRedeemed, loyaltyDiscount,
        totalAmount, tenderAmount, changeAmount, notes, offline_transaction,
        offline_transaction ? null : 'CURRENT_TIMESTAMP'
      ]
    );

    const posTransactionId = posTransactionResult.rows[0].id;

    // Create payment records
    for (const payment of payments) {
      await client.query(
        `INSERT INTO pos_payments (
          pos_transaction_id, payment_method, payment_provider, amount,
          reference_number, card_last_four, card_type, ewallet_provider,
          qris_reference, payment_status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'completed', CURRENT_TIMESTAMP)`,
        [
          posTransactionId,
          payment.method,
          payment.provider || null,
          payment.amount,
          payment.reference || null,
          payment.card_last_four || null,
          payment.card_type || null,
          payment.ewallet_provider || null,
          payment.qris_reference || null
        ]
      );
    }

    // Generate receipt number
    const receiptNumber = `RCP-${transactionNumber.substring(4)}`;
    
    await client.query(
      `INSERT INTO pos_receipts (
        receipt_number, pos_transaction_id, receipt_type, receipt_format,
        created_at
      ) VALUES ($1, $2, 'sale', 'thermal', CURRENT_TIMESTAMP)`,
      [receiptNumber, posTransactionId]
    );

    // Process loyalty points
    if (customer_id) {
      // Deduct redeemed points
      if (pointsRedeemed > 0) {
        await client.query(
          `UPDATE customers SET
            loyalty_points = loyalty_points - $1,
            points_redeemed_lifetime = points_redeemed_lifetime + $1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $2`,
          [pointsRedeemed, customer_id]
        );

        // Record redemption
        await client.query(
          `INSERT INTO loyalty_points_history (
            customer_id, transaction_type, points_amount, 
            transaction_reference, sales_order_id, created_by, created_at
          ) VALUES ($1, 'redeem', $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
          [customer_id, -pointsRedeemed, transactionNumber, salesOrderId, cashier_id]
        );
      }

      // Calculate and award new points
      const loyaltyConfig = await client.query(
        `SELECT earning_rate, points_expiry_days FROM loyalty_points_config 
         WHERE is_active = true LIMIT 1`
      );

      const earningRate = parseFloat(loyaltyConfig.rows[0]?.earning_rate || 0.0001);
      const expiryDays = parseInt(loyaltyConfig.rows[0]?.points_expiry_days || 365);

      // Get customer's tier multiplier
      const tierResult = await client.query(
        `SELECT mt.points_multiplier 
         FROM customers c
         JOIN membership_tiers mt ON c.membership_tier_id = mt.id
         WHERE c.id = $1`,
        [customer_id]
      );

      const tierMultiplier = parseFloat(tierResult.rows[0]?.points_multiplier || 1.0);
      const basePoints = Math.floor(totalAmount * earningRate);
      const pointsEarned = Math.floor(basePoints * tierMultiplier);

      if (pointsEarned > 0) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);

        await client.query(
          `UPDATE customers SET
            loyalty_points = loyalty_points + $1,
            points_earned_lifetime = points_earned_lifetime + $1,
            lifetime_purchase_value = lifetime_purchase_value + $2,
            annual_purchase_value = annual_purchase_value + $2,
            last_purchase_date = CURRENT_DATE,
            transaction_count = transaction_count + 1,
            total_orders = total_orders + 1,
            total_revenue = total_revenue + $2,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $3`,
          [pointsEarned, totalAmount, customer_id]
        );

        // Record points earned
        await client.query(
          `INSERT INTO loyalty_points_history (
            customer_id, transaction_type, points_amount,
            transaction_reference, sales_order_id, expiry_date,
            created_by, created_at
          ) VALUES ($1, 'earn', $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,
          [customer_id, pointsEarned, transactionNumber, salesOrderId, expiryDate.toISOString().split('T')[0], cashier_id]
        );
      }
    }

    await client.query("COMMIT");

    // Fetch complete transaction data
    const completeTransaction = await pool.query(
      `SELECT 
        pt.*,
        t.terminal_name,
        w.name as warehouse_name,
        c.contact_person as customer_name,
        c.loyalty_points as customer_loyalty_points,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name
      FROM pos_transactions pt
      JOIN pos_terminals t ON pt.terminal_id = t.id
      JOIN warehouses w ON pt.warehouse_id = w.id
      LEFT JOIN customers c ON pt.customer_id = c.id
      JOIN users u ON pt.cashier_id = u.id
      WHERE pt.id = $1`,
      [posTransactionId]
    );

    return NextResponse.json({
      success: true,
      data: {
        transaction: completeTransaction.rows[0],
        sales_order_id: salesOrderId,
        order_number: orderNumber,
        receipt_number: receiptNumber,
        points_earned: customer_id ? Math.floor(totalAmount * 0.0001) : 0,
      },
      message: "Transaction completed successfully",
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/pos/transactions - Get transaction history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const warehouseId = searchParams.get("warehouse_id");
    const customerId = searchParams.get("customer_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    const limit = parseInt(searchParams.get("limit") || "100");

    let query = `
      SELECT 
        pt.*,
        t.terminal_name,
        w.name as warehouse_name,
        c.contact_person as customer_name,
        CONCAT(u.first_name, ' ', u.last_name) as cashier_name,
        s.session_number
      FROM pos_transactions pt
      JOIN pos_terminals t ON pt.terminal_id = t.id
      JOIN warehouses w ON pt.warehouse_id = w.id
      LEFT JOIN customers c ON pt.customer_id = c.id
      JOIN users u ON pt.cashier_id = u.id
      JOIN pos_sessions s ON pt.session_id = s.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (sessionId) {
      query += ` AND pt.session_id = $${paramIndex}`;
      params.push(parseInt(sessionId));
      paramIndex++;
    }

    if (warehouseId) {
      query += ` AND pt.warehouse_id = $${paramIndex}`;
      params.push(parseInt(warehouseId));
      paramIndex++;
    }

    if (customerId) {
      query += ` AND pt.customer_id = $${paramIndex}`;
      params.push(parseInt(customerId));
      paramIndex++;
    }

    if (startDate) {
      query += ` AND DATE(pt.created_at) >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND DATE(pt.created_at) <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY pt.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
