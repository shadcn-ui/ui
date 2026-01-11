import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/integrations/payments/create - Create payment transaction
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      integration_id,
      order_id,
      customer_name,
      customer_email,
      customer_phone,
      amount,
      payment_method,
      description,
      callback_url,
      redirect_url,
    } = body;

    // Validation
    if (!integration_id || !order_id || !amount) {
      return NextResponse.json(
        { success: false, error: "integration_id, order_id, and amount are required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Get integration config
    const configResult = await client.query(
      `SELECT ic.*, ip.provider_name, ip.base_url 
       FROM integration_configs ic
       JOIN integration_providers ip ON ic.provider_id = ip.id
       WHERE ic.id = $1 AND ic.is_enabled = true`,
      [integration_id]
    );

    if (configResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Integration not found or disabled" },
        { status: 404 }
      );
    }

    const config = configResult.rows[0];
    const credentials = config.credentials;
    const providerName = config.provider_name.toLowerCase();

    // Create transaction record
    const transactionResult = await client.query(
      `INSERT INTO payment_transactions (
        integration_id, order_id, customer_name, customer_email, 
        customer_phone, amount, payment_method, description, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *`,
      [
        integration_id,
        order_id,
        customer_name || null,
        customer_email || null,
        customer_phone || null,
        amount,
        payment_method || 'auto',
        description || null,
      ]
    );

    const transaction = transactionResult.rows[0];
    let paymentResponse: any;

    // Create payment via provider
    if (providerName === 'midtrans') {
      // Midtrans Snap API
      const apiUrl = `${config.base_url}/v1/transactions`;
      
      const paymentData = {
        transaction_details: {
          order_id: `${order_id}-${transaction.id}`,
          gross_amount: amount,
        },
        customer_details: {
          first_name: customer_name || 'Guest',
          email: customer_email || '',
          phone: customer_phone || '',
        },
        item_details: [
          {
            id: order_id,
            name: description || 'Order Payment',
            price: amount,
            quantity: 1,
          }
        ],
        callbacks: {
          finish: redirect_url || callback_url,
        },
      };

      const serverKey = credentials.server_key;
      const authString = Buffer.from(serverKey + ':').toString('base64');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authString}`,
        },
        body: JSON.stringify(paymentData),
      });

      paymentResponse = await response.json();

      if (response.ok) {
        await client.query(
          `UPDATE payment_transactions 
           SET provider_transaction_id = $1, payment_url = $2, provider_response = $3
           WHERE id = $4`,
          [paymentResponse.token, paymentResponse.redirect_url, JSON.stringify(paymentResponse), transaction.id]
        );

        transaction.provider_transaction_id = paymentResponse.token;
        transaction.payment_url = paymentResponse.redirect_url;
      } else {
        await client.query(
          `UPDATE payment_transactions 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [paymentResponse.error_messages?.join(', ') || 'Unknown error', transaction.id]
        );
      }

      // Log API call
      await client.query(
        `INSERT INTO integration_api_logs (
          integration_id, endpoint, http_method, request_body, 
          response_status, response_body
        ) VALUES ($1, $2, 'POST', $3, $4, $5)`,
        [integration_id, apiUrl, JSON.stringify(paymentData), response.status, JSON.stringify(paymentResponse)]
      );

    } else if (providerName === 'xendit') {
      // Xendit Invoice API
      const apiUrl = `${config.base_url}/v2/invoices`;
      
      const paymentData = {
        external_id: `${order_id}-${transaction.id}`,
        amount: amount,
        payer_email: customer_email || 'no-email@example.com',
        description: description || 'Order Payment',
        invoice_duration: 86400, // 24 hours
        success_redirect_url: redirect_url || callback_url,
        failure_redirect_url: redirect_url || callback_url,
        currency: 'IDR',
        customer: {
          given_names: customer_name || 'Guest',
          email: customer_email || '',
          mobile_number: customer_phone || '',
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(credentials.secret_key + ':').toString('base64')}`,
        },
        body: JSON.stringify(paymentData),
      });

      paymentResponse = await response.json();

      if (response.ok) {
        await client.query(
          `UPDATE payment_transactions 
           SET provider_transaction_id = $1, payment_url = $2, provider_response = $3
           WHERE id = $4`,
          [paymentResponse.id, paymentResponse.invoice_url, JSON.stringify(paymentResponse), transaction.id]
        );

        transaction.provider_transaction_id = paymentResponse.id;
        transaction.payment_url = paymentResponse.invoice_url;
      } else {
        await client.query(
          `UPDATE payment_transactions 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [paymentResponse.message || 'Unknown error', transaction.id]
        );
      }

      // Log API call
      await client.query(
        `INSERT INTO integration_api_logs (
          integration_id, endpoint, http_method, request_body, 
          response_status, response_body
        ) VALUES ($1, $2, 'POST', $3, $4, $5)`,
        [integration_id, apiUrl, JSON.stringify(paymentData), response.status, JSON.stringify(paymentResponse)]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      transaction: transaction,
      payment_url: transaction.payment_url,
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/integrations/payments - Get payment transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integration_id");
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = `
      SELECT pt.*, ip.provider_name
      FROM payment_transactions pt
      JOIN integration_configs ic ON pt.integration_id = ic.id
      JOIN integration_providers ip ON ic.provider_id = ip.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (integrationId) {
      query += ` AND pt.integration_id = $${paramIndex}`;
      params.push(parseInt(integrationId));
      paramIndex++;
    }

    if (orderId) {
      query += ` AND pt.order_id = $${paramIndex}`;
      params.push(orderId);
      paramIndex++;
    }

    if (status) {
      query += ` AND pt.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY pt.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      transactions: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching payment transactions:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
