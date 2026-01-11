import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/integrations/shipping/create - Create shipment order
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      integration_id,
      order_id,
      service_type,
      origin_city,
      origin_address,
      origin_contact,
      origin_phone,
      destination_city,
      destination_address,
      destination_contact,
      destination_phone,
      destination_postal_code,
      weight,
      length,
      width,
      height,
      item_value,
      is_cod,
      cod_amount,
      notes,
    } = body;

    // Validation
    if (!integration_id || !order_id || !destination_address || !weight) {
      return NextResponse.json(
        { success: false, error: "integration_id, order_id, destination_address, and weight are required" },
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

    // Create shipment record
    const shipmentResult = await client.query(
      `INSERT INTO shipping_orders (
        integration_id, order_id, service_type, origin_city, origin_address,
        origin_contact, origin_phone, destination_city, destination_address,
        destination_contact, destination_phone, destination_postal_code,
        weight, length, width, height, item_value, is_cod, cod_amount, notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 'pending')
      RETURNING *`,
      [
        integration_id, order_id, service_type || 'REG',
        origin_city || 'Jakarta', origin_address || '', origin_contact || '',
        origin_phone || '', destination_city || '', destination_address,
        destination_contact || '', destination_phone || '', destination_postal_code || '',
        weight, length || 0, width || 0, height || 0,
        item_value || 0, is_cod || false, cod_amount || 0, notes || null,
      ]
    );

    const shipment = shipmentResult.rows[0];
    let shippingResponse: any;

    // Create shipment via provider
    if (providerName === 'jne') {
      // JNE API
      const apiUrl = `${config.base_url}/api/order/create`;
      
      const shippingData = {
        username: credentials.username,
        api_key: credentials.api_key,
        OLSHOP_BRANCH: credentials.branch_code,
        OLSHOP_CUST: credentials.customer_code,
        OLSHOP_ORDERID: order_id,
        OLSHOP_REF: `REF-${shipment.id}`,
        SHIPPER_NAME: origin_contact || credentials.shipper_name,
        SHIPPER_ADDR1: origin_address,
        SHIPPER_CITY: origin_city,
        SHIPPER_PHONE: origin_phone,
        RECEIVER_NAME: destination_contact,
        RECEIVER_ADDR1: destination_address,
        RECEIVER_CITY: destination_city,
        RECEIVER_ZIP: destination_postal_code,
        RECEIVER_PHONE: destination_phone,
        QTY: 1,
        WEIGHT: weight,
        GOODSDESC: notes || 'Package',
        INSURANCE: item_value > 0 ? 'Y' : 'N',
        INSVALUE: item_value || 0,
        SERVICECODE: service_type || 'REG',
        COD: is_cod ? 'Y' : 'N',
        CODVALUE: cod_amount || 0,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });

      shippingResponse = await response.json();

      if (response.ok && shippingResponse.status === 'success') {
        await client.query(
          `UPDATE shipping_orders 
           SET tracking_number = $1, shipping_label_url = $2, 
               estimated_cost = $3, status = 'created', provider_response = $4
           WHERE id = $5`,
          [
            shippingResponse.cnote_no,
            shippingResponse.label_url,
            parseFloat(shippingResponse.price || 0),
            JSON.stringify(shippingResponse),
            shipment.id
          ]
        );

        shipment.tracking_number = shippingResponse.cnote_no;
        shipment.shipping_label_url = shippingResponse.label_url;
        shipment.estimated_cost = parseFloat(shippingResponse.price || 0);
        shipment.status = 'created';
      } else {
        await client.query(
          `UPDATE shipping_orders 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [shippingResponse.message || 'Unknown error', shipment.id]
        );
      }

    } else if (providerName === 'j&t express') {
      // J&T Express API
      const apiUrl = `${config.base_url}/api/order/create`;
      
      const shippingData = {
        customerid: credentials.customer_id,
        username: credentials.username,
        api_key: credentials.api_key,
        orderid: order_id,
        shipper_name: origin_contact || credentials.shipper_name,
        shipper_contact: origin_phone,
        shipper_addr: origin_address,
        origin_code: credentials.origin_code,
        receiver_name: destination_contact,
        receiver_phone: destination_phone,
        receiver_addr: destination_address,
        receiver_zip: destination_postal_code,
        receiver_area: destination_city,
        qty: 1,
        weight: weight,
        goodsdesc: notes || 'Package',
        servicetype: service_type || '1', // 1=Regular
        insurance: item_value > 0 ? 1 : 0,
        insvalue: item_value || 0,
        cod: is_cod ? 1 : 0,
        codamount: cod_amount || 0,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });

      shippingResponse = await response.json();

      if (response.ok && shippingResponse.success) {
        await client.query(
          `UPDATE shipping_orders 
           SET tracking_number = $1, shipping_label_url = $2, 
               estimated_cost = $3, status = 'created', provider_response = $4
           WHERE id = $5`,
          [
            shippingResponse.awb_no,
            shippingResponse.label_url,
            parseFloat(shippingResponse.freight || 0),
            JSON.stringify(shippingResponse),
            shipment.id
          ]
        );

        shipment.tracking_number = shippingResponse.awb_no;
        shipment.shipping_label_url = shippingResponse.label_url;
        shipment.estimated_cost = parseFloat(shippingResponse.freight || 0);
        shipment.status = 'created';
      } else {
        await client.query(
          `UPDATE shipping_orders 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [shippingResponse.message || 'Unknown error', shipment.id]
        );
      }

    } else if (providerName === 'sicepat') {
      // SiCepat API
      const apiUrl = `${config.base_url}/public/v1/order`;
      
      const shippingData = {
        auth_key: credentials.api_key,
        reference_number: order_id,
        pickup_address_id: credentials.pickup_address_id,
        destination_name: destination_contact,
        destination_address: destination_address,
        destination_phone: destination_phone,
        destination_postal_code: destination_postal_code,
        destination_city: destination_city,
        weight: weight,
        dimension: {
          length: length || 0,
          width: width || 0,
          height: height || 0,
        },
        item_value: item_value || 0,
        description: notes || 'Package',
        service_type: service_type || 'REGULER',
        cod: is_cod,
        cod_value: cod_amount || 0,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingData),
      });

      shippingResponse = await response.json();

      if (response.ok && shippingResponse.status === 200) {
        await client.query(
          `UPDATE shipping_orders 
           SET tracking_number = $1, shipping_label_url = $2, 
               estimated_cost = $3, status = 'created', provider_response = $4
           WHERE id = $5`,
          [
            shippingResponse.sicepat.waybill_id,
            shippingResponse.sicepat.label_url,
            parseFloat(shippingResponse.sicepat.tariff || 0),
            JSON.stringify(shippingResponse),
            shipment.id
          ]
        );

        shipment.tracking_number = shippingResponse.sicepat.waybill_id;
        shipment.shipping_label_url = shippingResponse.sicepat.label_url;
        shipment.estimated_cost = parseFloat(shippingResponse.sicepat.tariff || 0);
        shipment.status = 'created';
      } else {
        await client.query(
          `UPDATE shipping_orders 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [shippingResponse.message || 'Unknown error', shipment.id]
        );
      }
    }

    // Log API call
    await client.query(
      `INSERT INTO integration_api_logs (
        integration_id, endpoint, http_method, request_body, 
        response_status, response_body
      ) VALUES ($1, $2, 'POST', $3, 200, $4)`,
      [integration_id, 'create_shipment', JSON.stringify(body), JSON.stringify(shippingResponse)]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      shipment: shipment,
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/integrations/shipping - Get shipment orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integration_id");
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = `
      SELECT so.*, ip.provider_name
      FROM shipping_orders so
      JOIN integration_configs ic ON so.integration_id = ic.id
      JOIN integration_providers ip ON ic.provider_id = ip.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (integrationId) {
      query += ` AND so.integration_id = $${paramIndex}`;
      params.push(parseInt(integrationId));
      paramIndex++;
    }

    if (orderId) {
      query += ` AND so.order_id = $${paramIndex}`;
      params.push(orderId);
      paramIndex++;
    }

    if (status) {
      query += ` AND so.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY so.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      shipments: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching shipments:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
