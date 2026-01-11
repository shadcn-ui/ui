import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/ecommerce/webhooks/orders - Receive order webhooks from e-commerce platforms
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { storefront_code, webhook_event, webhook_signature, data } = body;

    if (!storefront_code || !webhook_event || !data) {
      return NextResponse.json(
        { error: "Missing required fields: storefront_code, webhook_event, data" },
        { status: 400 }
      );
    }

    // Get storefront configuration
    const storefrontQuery = `
      SELECT * FROM ecommerce_storefronts
      WHERE storefront_code = $1 AND is_active = true
    `;
    const storefrontResult = await client.query(storefrontQuery, [storefront_code]);

    if (storefrontResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Storefront not found or inactive" },
        { status: 404 }
      );
    }

    const storefront = storefrontResult.rows[0];

    // Verify webhook signature if provided
    if (webhook_signature && storefront.webhook_secret) {
      const expectedSignature = crypto
        .createHmac("sha256", storefront.webhook_secret)
        .update(JSON.stringify(data))
        .digest("hex");

      if (webhook_signature !== expectedSignature) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    // Process different webhook events
    switch (webhook_event) {
      case "order.created":
      case "order.updated":
        return await handleOrderWebhook(client, storefront.storefront_id, data);

      case "order.cancelled":
        return await handleOrderCancellation(client, storefront.storefront_id, data);

      case "order.fulfilled":
        return await handleOrderFulfillment(client, storefront.storefront_id, data);

      case "product.created":
      case "product.updated":
        return await handleProductWebhook(client, storefront.storefront_id, data);

      case "inventory.updated":
        return await handleInventoryWebhook(client, storefront.storefront_id, data);

      default:
        return NextResponse.json({
          message: "Webhook received but no handler for this event",
          event: webhook_event,
        });
    }
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

async function handleOrderWebhook(client: any, storefrontId: number, orderData: any) {
  try {
    await client.query("BEGIN");

    const {
      id: external_order_id,
      order_number: external_order_number,
      name: external_order_name,
      email: customer_email,
      customer,
      line_items,
      total_price: total_amount,
      subtotal_price: subtotal_amount,
      total_tax: tax_amount,
      total_shipping: shipping_amount,
      total_discounts: discount_amount,
      currency,
      financial_status: payment_status,
      fulfillment_status,
      shipping_address,
      billing_address,
      created_at: order_date,
      note: customer_note,
    } = orderData;

    // Check if order exists
    const existingQuery = `
      SELECT ecommerce_order_id FROM ecommerce_orders
      WHERE storefront_id = $1 AND external_order_id = $2
    `;
    const existing = await client.query(existingQuery, [storefrontId, external_order_id]);

    let orderId: number;

    if (existing.rows.length > 0) {
      // Update existing order
      orderId = existing.rows[0].ecommerce_order_id;

      await client.query(
        `UPDATE ecommerce_orders
         SET order_status = $1, payment_status = $2, fulfillment_status = $3,
             last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE ecommerce_order_id = $4`,
        [
          orderData.status || 'pending',
          payment_status || 'pending',
          fulfillment_status || 'unfulfilled',
          orderId,
        ]
      );
    } else {
      // Create new order
      const insertQuery = `
        INSERT INTO ecommerce_orders (
          storefront_id, external_order_id, external_order_number, external_order_name,
          customer_email, customer_first_name, customer_last_name,
          order_date, subtotal_amount, discount_amount, shipping_amount, tax_amount, total_amount, currency,
          shipping_first_name, shipping_last_name, shipping_address_line1, shipping_city, shipping_postal_code, shipping_country,
          billing_first_name, billing_last_name, billing_address_line1, billing_city, billing_postal_code, billing_country,
          order_status, payment_status, fulfillment_status, customer_note,
          sync_status, last_synced_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
          $27, $28, $29, $30, 'synced', CURRENT_TIMESTAMP
        )
        RETURNING ecommerce_order_id
      `;

      const result = await client.query(insertQuery, [
        storefrontId,
        external_order_id,
        external_order_number,
        external_order_name,
        customer_email,
        customer?.first_name || null,
        customer?.last_name || null,
        order_date || new Date(),
        subtotal_amount || 0,
        discount_amount || 0,
        shipping_amount || 0,
        tax_amount || 0,
        total_amount,
        currency || 'USD',
        shipping_address?.first_name || null,
        shipping_address?.last_name || null,
        shipping_address?.address1 || null,
        shipping_address?.city || null,
        shipping_address?.zip || null,
        shipping_address?.country || null,
        billing_address?.first_name || null,
        billing_address?.last_name || null,
        billing_address?.address1 || null,
        billing_address?.city || null,
        billing_address?.zip || null,
        billing_address?.country || null,
        orderData.status || 'pending',
        payment_status || 'pending',
        fulfillment_status || 'unfulfilled',
        customer_note || null,
      ]);

      orderId = result.rows[0].ecommerce_order_id;

      // Insert line items
      if (line_items && Array.isArray(line_items)) {
        for (const item of line_items) {
          await client.query(
            `INSERT INTO ecommerce_order_items (
              ecommerce_order_id, external_item_id, external_product_id,
              product_name, sku, quantity, unit_price, total_amount,
              fulfillment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              orderId,
              item.id || null,
              item.product_id || null,
              item.name || item.title,
              item.sku || null,
              item.quantity,
              item.price,
              item.quantity * item.price,
              item.fulfillment_status || 'unfulfilled',
            ]
          );
        }
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Order webhook processed successfully",
      order_id: orderId,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function handleOrderCancellation(client: any, storefrontId: number, orderData: any) {
  const { id: external_order_id } = orderData;

  await client.query(
    `UPDATE ecommerce_orders
     SET order_status = 'cancelled', cancelled_at = CURRENT_TIMESTAMP,
         last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE storefront_id = $1 AND external_order_id = $2`,
    [storefrontId, external_order_id]
  );

  return NextResponse.json({
    message: "Order cancellation processed successfully",
  });
}

async function handleOrderFulfillment(client: any, storefrontId: number, orderData: any) {
  const { id: external_order_id, tracking_number } = orderData;

  await client.query(
    `UPDATE ecommerce_orders
     SET fulfillment_status = 'fulfilled', fulfilled_at = CURRENT_TIMESTAMP,
         tracking_number = $1, last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE storefront_id = $2 AND external_order_id = $3`,
    [tracking_number || null, storefrontId, external_order_id]
  );

  return NextResponse.json({
    message: "Order fulfillment processed successfully",
  });
}

async function handleProductWebhook(client: any, storefrontId: number, productData: any) {
  const {
    id: external_product_id,
    title: product_name,
    sku,
    price,
    inventory_quantity,
  } = productData;

  const existingQuery = `
    SELECT ecommerce_product_id FROM ecommerce_products
    WHERE storefront_id = $1 AND external_product_id = $2
  `;
  const existing = await client.query(existingQuery, [storefrontId, external_product_id]);

  if (existing.rows.length > 0) {
    await client.query(
      `UPDATE ecommerce_products
       SET product_name = $1, price = $2, inventory_quantity = $3,
           sync_status = 'synced', last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE ecommerce_product_id = $4`,
      [product_name, price, inventory_quantity, existing.rows[0].ecommerce_product_id]
    );
  } else {
    await client.query(
      `INSERT INTO ecommerce_products (
        storefront_id, external_product_id, external_sku, product_name,
        price, inventory_quantity, sync_status, last_synced_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'synced', CURRENT_TIMESTAMP)`,
      [storefrontId, external_product_id, sku, product_name, price, inventory_quantity]
    );
  }

  return NextResponse.json({
    message: "Product webhook processed successfully",
  });
}

async function handleInventoryWebhook(client: any, storefrontId: number, inventoryData: any) {
  const { product_id: external_product_id, inventory_quantity } = inventoryData;

  await client.query(
    `UPDATE ecommerce_products
     SET inventory_quantity = $1, sync_status = 'synced',
         last_synced_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
     WHERE storefront_id = $2 AND external_product_id = $3`,
    [inventory_quantity, storefrontId, external_product_id]
  );

  return NextResponse.json({
    message: "Inventory webhook processed successfully",
  });
}
