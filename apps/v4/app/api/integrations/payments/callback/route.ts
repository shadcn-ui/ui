import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/integrations/payments/callback - Handle payment callbacks/webhooks
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider"); // midtrans or xendit

    await client.query("BEGIN");

    if (provider === 'midtrans') {
      // Midtrans webhook format
      const {
        order_id,
        transaction_status,
        fraud_status,
        signature_key,
        gross_amount,
        payment_type,
      } = body;

      // Find transaction
      const transactionResult = await client.query(
        `SELECT pt.*, ic.credentials 
         FROM payment_transactions pt
         JOIN integration_configs ic ON pt.integration_id = ic.id
         WHERE pt.order_id LIKE $1`,
        [`${order_id.split('-')[0]}%`]
      );

      if (transactionResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: "Transaction not found" },
          { status: 404 }
        );
      }

      const transaction = transactionResult.rows[0];
      const credentials = transaction.credentials;

      // Verify signature
      const serverKey = credentials.server_key;
      const expectedSignature = crypto
        .createHash('sha512')
        .update(`${order_id}${transaction_status}${gross_amount}${serverKey}`)
        .digest('hex');

      if (signature_key !== expectedSignature) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: "Invalid signature" },
          { status: 401 }
        );
      }

      // Map Midtrans status to our status
      let newStatus = transaction.status;
      if (transaction_status === 'capture' || transaction_status === 'settlement') {
        newStatus = 'paid';
      } else if (transaction_status === 'pending') {
        newStatus = 'pending';
      } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
        newStatus = 'failed';
      } else if (transaction_status === 'refund') {
        newStatus = 'refunded';
      }

      // Update transaction
      await client.query(
        `UPDATE payment_transactions 
         SET status = $1, paid_at = CASE WHEN $1 = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END,
             payment_method = $2, callback_data = $3
         WHERE id = $4`,
        [newStatus, payment_type, JSON.stringify(body), transaction.id]
      );

      // Log webhook
      await client.query(
        `INSERT INTO integration_webhooks (
          integration_id, webhook_type, payload, status, processed_at
        ) VALUES ($1, 'payment_notification', $2, 'processed', CURRENT_TIMESTAMP)`,
        [transaction.integration_id, JSON.stringify(body)]
      );

    } else if (provider === 'xendit') {
      // Xendit webhook format
      const {
        external_id,
        status,
        paid_amount,
        payment_method,
        payment_channel,
        id: invoice_id,
      } = body;

      // Verify webhook token
      const callbackToken = request.headers.get('x-callback-token');
      
      // Find transaction
      const transactionResult = await client.query(
        `SELECT pt.*, ic.credentials 
         FROM payment_transactions pt
         JOIN integration_configs ic ON pt.integration_id = ic.id
         WHERE pt.order_id LIKE $1`,
        [`${external_id.split('-')[0]}%`]
      );

      if (transactionResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: "Transaction not found" },
          { status: 404 }
        );
      }

      const transaction = transactionResult.rows[0];
      const credentials = transaction.credentials;

      // Verify callback token
      if (callbackToken !== credentials.webhook_token) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { success: false, error: "Invalid callback token" },
          { status: 401 }
        );
      }

      // Map Xendit status to our status
      let newStatus = transaction.status;
      if (status === 'PAID' || status === 'SETTLED') {
        newStatus = 'paid';
      } else if (status === 'PENDING') {
        newStatus = 'pending';
      } else if (status === 'EXPIRED') {
        newStatus = 'failed';
      }

      // Update transaction
      await client.query(
        `UPDATE payment_transactions 
         SET status = $1, paid_at = CASE WHEN $1 = 'paid' THEN CURRENT_TIMESTAMP ELSE paid_at END,
             paid_amount = $2, payment_method = $3, callback_data = $4
         WHERE id = $5`,
        [newStatus, paid_amount, payment_channel, JSON.stringify(body), transaction.id]
      );

      // Log webhook
      await client.query(
        `INSERT INTO integration_webhooks (
          integration_id, webhook_type, payload, status, processed_at
        ) VALUES ($1, 'payment_notification', $2, 'processed', CURRENT_TIMESTAMP)`,
        [transaction.integration_id, JSON.stringify(body)]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Callback processed",
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error processing payment callback:", error);
    
    // Log failed webhook
    try {
      await pool.query(
        `INSERT INTO integration_webhooks (
          webhook_type, payload, status, error_message
        ) VALUES ('payment_notification', $1, 'failed', $2)`,
        [JSON.stringify(await request.json()), error.message]
      );
    } catch (logError) {
      console.error("Error logging webhook:", logError);
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/integrations/payments/callback - Check transaction status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "order_id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT pt.*, ip.provider_name
       FROM payment_transactions pt
       JOIN integration_configs ic ON pt.integration_id = ic.id
       JOIN integration_providers ip ON ic.provider_id = ip.id
       WHERE pt.order_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error checking transaction status:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
