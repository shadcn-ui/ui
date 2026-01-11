import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/orders - List e-commerce orders
// POST /api/ecommerce/orders - Import order from e-commerce platform
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const storefront_id = searchParams.get("storefront_id");
    const order_status = searchParams.get("order_status");
    const payment_status = searchParams.get("payment_status");
    const fulfillment_status = searchParams.get("fulfillment_status");
    const import_status = searchParams.get("import_status");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let whereConditions = ["1=1"];
    let params: any[] = [];
    let paramCount = 1;

    if (storefront_id) {
      params.push(storefront_id);
      whereConditions.push(`eo.storefront_id = $${paramCount++}`);
    }

    if (order_status) {
      params.push(order_status);
      whereConditions.push(`eo.order_status = $${paramCount++}`);
    }

    if (payment_status) {
      params.push(payment_status);
      whereConditions.push(`eo.payment_status = $${paramCount++}`);
    }

    if (fulfillment_status) {
      params.push(fulfillment_status);
      whereConditions.push(`eo.fulfillment_status = $${paramCount++}`);
    }

    if (import_status) {
      params.push(import_status);
      whereConditions.push(`eo.import_status = $${paramCount++}`);
    }

    if (from_date) {
      params.push(from_date);
      whereConditions.push(`eo.order_date >= $${paramCount++}`);
    }

    if (to_date) {
      params.push(to_date);
      whereConditions.push(`eo.order_date <= $${paramCount++}`);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ecommerce_orders eo
      WHERE ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get orders
    params.push(limit, offset);
    const query = `
      SELECT 
        eo.*,
        es.storefront_name,
        es.platform_type,
        ec.first_name || ' ' || ec.last_name as customer_name,
        (
          SELECT COUNT(*)
          FROM ecommerce_order_items eoi
          WHERE eoi.ecommerce_order_id = eo.ecommerce_order_id
        ) as item_count,
        (
          SELECT SUM(eoi.quantity)
          FROM ecommerce_order_items eoi
          WHERE eoi.ecommerce_order_id = eo.ecommerce_order_id
        ) as total_items
      FROM ecommerce_orders eo
      LEFT JOIN ecommerce_storefronts es ON eo.storefront_id = es.storefront_id
      LEFT JOIN ecommerce_customers ec ON eo.ecommerce_customer_id = ec.ecommerce_customer_id
      WHERE ${whereClause}
      ORDER BY eo.order_date DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_order_value,
        SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN order_status = 'fulfilled' THEN 1 ELSE 0 END) as fulfilled_orders,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid_orders,
        SUM(CASE WHEN import_status = 'pending' THEN 1 ELSE 0 END) as pending_import
      FROM ecommerce_orders
      WHERE ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, params.length - 2));

    return NextResponse.json({
      orders: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching e-commerce orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch e-commerce orders", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const body = await request.json();
    const {
      storefront_id,
      external_order_id,
      external_order_number,
      external_order_name,
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone,
      order_date,
      subtotal_amount,
      discount_amount,
      shipping_amount,
      tax_amount,
      total_amount,
      currency,
      shipping_address,
      billing_address,
      order_status,
      payment_status,
      fulfillment_status,
      shipping_method,
      payment_method,
      payment_gateway,
      payment_transaction_id,
      tracking_number,
      customer_note,
      line_items,
      create_erp_order,
      created_by,
    } = body;

    if (!storefront_id || !external_order_id || !total_amount) {
      return NextResponse.json(
        { error: "Missing required fields: storefront_id, external_order_id, total_amount" },
        { status: 400 }
      );
    }

    // Check if order already exists
    const existingQuery = `
      SELECT ecommerce_order_id 
      FROM ecommerce_orders 
      WHERE storefront_id = $1 AND external_order_id = $2
    `;
    const existingResult = await client.query(existingQuery, [
      storefront_id,
      external_order_id,
    ]);

    let orderId: number;

    if (existingResult.rows.length > 0) {
      // Update existing order
      orderId = existingResult.rows[0].ecommerce_order_id;

      const updateQuery = `
        UPDATE ecommerce_orders
        SET 
          order_status = $1,
          payment_status = $2,
          fulfillment_status = $3,
          tracking_number = $4,
          last_synced_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE ecommerce_order_id = $5
        RETURNING *
      `;

      await client.query(updateQuery, [
        order_status || 'pending',
        payment_status || 'pending',
        fulfillment_status || 'unfulfilled',
        tracking_number || null,
        orderId,
      ]);
    } else {
      // Find or create customer
      let customerId: number | null = null;

      if (customer_email) {
        const customerQuery = `
          SELECT ecommerce_customer_id
          FROM ecommerce_customers
          WHERE storefront_id = $1 AND email = $2
        `;
        const customerResult = await client.query(customerQuery, [
          storefront_id,
          customer_email,
        ]);

        if (customerResult.rows.length > 0) {
          customerId = customerResult.rows[0].ecommerce_customer_id;
        } else {
          // Create new customer
          const createCustomerQuery = `
            INSERT INTO ecommerce_customers (
              storefront_id, external_email, first_name, last_name, email, phone
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING ecommerce_customer_id
          `;
          const newCustomer = await client.query(createCustomerQuery, [
            storefront_id,
            customer_email,
            customer_first_name || null,
            customer_last_name || null,
            customer_email,
            customer_phone || null,
          ]);
          customerId = newCustomer.rows[0].ecommerce_customer_id;
        }
      }

      // Create new order
      const insertQuery = `
        INSERT INTO ecommerce_orders (
          storefront_id, external_order_id, external_order_number, external_order_name,
          ecommerce_customer_id, customer_email, customer_first_name, customer_last_name, customer_phone,
          order_date, subtotal_amount, discount_amount, shipping_amount, tax_amount, total_amount, currency,
          shipping_first_name, shipping_last_name, shipping_address_line1, shipping_address_line2,
          shipping_city, shipping_state_province, shipping_postal_code, shipping_country, shipping_phone,
          billing_first_name, billing_last_name, billing_address_line1, billing_address_line2,
          billing_city, billing_state_province, billing_postal_code, billing_country, billing_phone,
          order_status, payment_status, fulfillment_status,
          shipping_method, payment_method, payment_gateway, payment_transaction_id,
          tracking_number, customer_note, sync_status, last_synced_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30, $31, $32, $33, $34,
          $35, $36, $37, $38, $39, $40, $41, $42, $43,
          'synced', CURRENT_TIMESTAMP
        )
        RETURNING ecommerce_order_id
      `;

      const result = await client.query(insertQuery, [
        storefront_id,
        external_order_id,
        external_order_number || null,
        external_order_name || null,
        customerId,
        customer_email || null,
        customer_first_name || null,
        customer_last_name || null,
        customer_phone || null,
        order_date || new Date(),
        subtotal_amount || 0,
        discount_amount || 0,
        shipping_amount || 0,
        tax_amount || 0,
        total_amount,
        currency || 'USD',
        shipping_address?.first_name || null,
        shipping_address?.last_name || null,
        shipping_address?.address_line1 || null,
        shipping_address?.address_line2 || null,
        shipping_address?.city || null,
        shipping_address?.state_province || null,
        shipping_address?.postal_code || null,
        shipping_address?.country || null,
        shipping_address?.phone || null,
        billing_address?.first_name || null,
        billing_address?.last_name || null,
        billing_address?.address_line1 || null,
        billing_address?.address_line2 || null,
        billing_address?.city || null,
        billing_address?.state_province || null,
        billing_address?.postal_code || null,
        billing_address?.country || null,
        billing_address?.phone || null,
        order_status || 'pending',
        payment_status || 'pending',
        fulfillment_status || 'unfulfilled',
        shipping_method || null,
        payment_method || null,
        payment_gateway || null,
        payment_transaction_id || null,
        tracking_number || null,
        customer_note || null,
      ]);

      orderId = result.rows[0].ecommerce_order_id;

      // Insert order items
      if (line_items && Array.isArray(line_items)) {
        for (const item of line_items) {
          // Find product by external ID or SKU
          const productQuery = `
            SELECT ecommerce_product_id
            FROM ecommerce_products
            WHERE storefront_id = $1
            AND (external_product_id = $2 OR external_sku = $3)
            LIMIT 1
          `;
          const productResult = await client.query(productQuery, [
            storefront_id,
            item.external_product_id || null,
            item.sku || null,
          ]);

          const productId = productResult.rows.length > 0 
            ? productResult.rows[0].ecommerce_product_id 
            : null;

          const itemQuery = `
            INSERT INTO ecommerce_order_items (
              ecommerce_order_id, ecommerce_product_id, external_item_id, external_product_id,
              product_name, sku, quantity, unit_price, discount_amount, tax_amount, total_amount,
              fulfillment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `;

          await client.query(itemQuery, [
            orderId,
            productId,
            item.external_item_id || null,
            item.external_product_id || null,
            item.product_name,
            item.sku || null,
            item.quantity,
            item.unit_price,
            item.discount_amount || 0,
            item.tax_amount || 0,
            item.total_amount,
            item.fulfillment_status || 'unfulfilled',
          ]);
        }
      }

      // Mark order as imported
      await client.query(
        `UPDATE ecommerce_orders 
         SET import_status = 'imported', imported_at = CURRENT_TIMESTAMP 
         WHERE ecommerce_order_id = $1`,
        [orderId]
      );
    }

    await client.query("COMMIT");

    // Get the complete order
    const orderQuery = `
      SELECT 
        eo.*,
        (
          SELECT json_agg(json_build_object(
            'product_name', product_name,
            'sku', sku,
            'quantity', quantity,
            'unit_price', unit_price,
            'total_amount', total_amount
          ))
          FROM ecommerce_order_items
          WHERE ecommerce_order_id = eo.ecommerce_order_id
        ) as items
      FROM ecommerce_orders eo
      WHERE eo.ecommerce_order_id = $1
    `;
    const orderResult = await client.query(orderQuery, [orderId]);

    return NextResponse.json({
      message: "Order imported successfully",
      order: orderResult.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error importing order:", error);
    return NextResponse.json(
      { error: "Failed to import order", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
