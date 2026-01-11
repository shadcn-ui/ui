import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/integrations/shipping/tracking - Track shipment
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("tracking_number");
    const shipmentId = searchParams.get("shipment_id");

    if (!trackingNumber && !shipmentId) {
      return NextResponse.json(
        { success: false, error: "tracking_number or shipment_id is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Find shipment
    let shipmentQuery = `
      SELECT so.*, ic.credentials, ip.provider_name, ip.base_url
      FROM shipping_orders so
      JOIN integration_configs ic ON so.integration_id = ic.id
      JOIN integration_providers ip ON ic.provider_id = ip.id
      WHERE 1=1
    `;

    const params: any[] = [];
    if (trackingNumber) {
      shipmentQuery += ` AND so.tracking_number = $1`;
      params.push(trackingNumber);
    } else {
      shipmentQuery += ` AND so.id = $1`;
      params.push(parseInt(shipmentId!));
    }

    const shipmentResult = await client.query(shipmentQuery, params);

    if (shipmentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Shipment not found" },
        { status: 404 }
      );
    }

    const shipment = shipmentResult.rows[0];
    const credentials = shipment.credentials;
    const providerName = shipment.provider_name.toLowerCase();
    let trackingResponse: any;
    let trackingHistory: any[] = [];

    // Track via provider
    if (providerName === 'jne') {
      // JNE Tracking API
      const apiUrl = `${shipment.base_url}/api/tracking`;
      
      const response = await fetch(`${apiUrl}?awb=${shipment.tracking_number}&username=${credentials.username}&api_key=${credentials.api_key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      trackingResponse = await response.json();

      if (response.ok && trackingResponse.status === 'success') {
        const history = trackingResponse.history || [];
        
        // Map tracking history
        trackingHistory = history.map((h: any) => ({
          status: h.status,
          location: h.city,
          description: h.desc,
          timestamp: new Date(h.date),
        }));

        // Update shipment status
        const latestStatus = history[0]?.status.toLowerCase();
        let newStatus = shipment.status;
        if (latestStatus?.includes('delivered')) {
          newStatus = 'delivered';
        } else if (latestStatus?.includes('transit') || latestStatus?.includes('on process')) {
          newStatus = 'in_transit';
        } else if (latestStatus?.includes('picked')) {
          newStatus = 'picked_up';
        }

        await client.query(
          `UPDATE shipping_orders 
           SET status = $1, delivered_at = CASE WHEN $1 = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
           WHERE id = $2`,
          [newStatus, shipment.id]
        );

        shipment.status = newStatus;
      }

    } else if (providerName === 'j&t express') {
      // J&T Express Tracking API
      const apiUrl = `${shipment.base_url}/api/tracking`;
      
      const response = await fetch(`${apiUrl}?awb=${shipment.tracking_number}&username=${credentials.username}&api_key=${credentials.api_key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      trackingResponse = await response.json();

      if (response.ok && trackingResponse.success) {
        const history = trackingResponse.details || [];
        
        trackingHistory = history.map((h: any) => ({
          status: h.status,
          location: h.city,
          description: h.description,
          timestamp: new Date(h.date),
        }));

        const latestStatus = history[0]?.status.toLowerCase();
        let newStatus = shipment.status;
        if (latestStatus?.includes('delivered')) {
          newStatus = 'delivered';
        } else if (latestStatus?.includes('on the way') || latestStatus?.includes('transit')) {
          newStatus = 'in_transit';
        } else if (latestStatus?.includes('picked')) {
          newStatus = 'picked_up';
        }

        await client.query(
          `UPDATE shipping_orders 
           SET status = $1, delivered_at = CASE WHEN $1 = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
           WHERE id = $2`,
          [newStatus, shipment.id]
        );

        shipment.status = newStatus;
      }

    } else if (providerName === 'sicepat') {
      // SiCepat Tracking API
      const apiUrl = `${shipment.base_url}/public/v1/tracking`;
      
      const response = await fetch(`${apiUrl}?waybill_id=${shipment.tracking_number}&auth_key=${credentials.api_key}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      trackingResponse = await response.json();

      if (response.ok && trackingResponse.status === 200) {
        const history = trackingResponse.sicepat.track_history || [];
        
        trackingHistory = history.map((h: any) => ({
          status: h.status,
          location: h.city,
          description: h.description,
          timestamp: new Date(h.date_time),
        }));

        const latestStatus = history[0]?.status.toLowerCase();
        let newStatus = shipment.status;
        if (latestStatus?.includes('delivered') || latestStatus?.includes('diterima')) {
          newStatus = 'delivered';
        } else if (latestStatus?.includes('on delivery') || latestStatus?.includes('transit')) {
          newStatus = 'in_transit';
        } else if (latestStatus?.includes('picked')) {
          newStatus = 'picked_up';
        }

        await client.query(
          `UPDATE shipping_orders 
           SET status = $1, delivered_at = CASE WHEN $1 = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
           WHERE id = $2`,
          [newStatus, shipment.id]
        );

        shipment.status = newStatus;
      }
    }

    // Save tracking history
    for (const track of trackingHistory) {
      await client.query(
        `INSERT INTO shipping_tracking_history (
          shipping_id, status, location, description, status_timestamp
        ) VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (shipping_id, status_timestamp) DO NOTHING`,
        [shipment.id, track.status, track.location, track.description, track.timestamp]
      );
    }

    // Log API call
    await client.query(
      `INSERT INTO integration_api_logs (
        integration_id, endpoint, http_method, response_status, response_body
      ) VALUES ($1, 'tracking', 'GET', 200, $2)`,
      [shipment.integration_id, JSON.stringify(trackingResponse)]
    );

    await client.query("COMMIT");

    // Get full tracking history from database
    const historyResult = await client.query(
      `SELECT * FROM shipping_tracking_history 
       WHERE shipping_id = $1 
       ORDER BY status_timestamp DESC`,
      [shipment.id]
    );

    return NextResponse.json({
      success: true,
      shipment: {
        id: shipment.id,
        order_id: shipment.order_id,
        tracking_number: shipment.tracking_number,
        status: shipment.status,
        destination_address: shipment.destination_address,
        destination_contact: shipment.destination_contact,
        estimated_cost: shipment.estimated_cost,
        created_at: shipment.created_at,
        delivered_at: shipment.delivered_at,
      },
      tracking_history: historyResult.rows,
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error tracking shipment:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// POST /api/integrations/shipping/tracking/webhook - Handle shipping webhooks
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");

    await client.query("BEGIN");

    let trackingNumber: string | undefined;
    let status: string | undefined;
    let location: string | undefined;
    let description: string | undefined;

    // Parse webhook based on provider
    if (provider === 'jne') {
      trackingNumber = body.awb;
      status = body.status;
      location = body.city;
      description = body.description;
    } else if (provider === 'jt') {
      trackingNumber = body.awb_no;
      status = body.status;
      location = body.city;
      description = body.description;
    } else if (provider === 'sicepat') {
      trackingNumber = body.waybill_id;
      status = body.status;
      location = body.city;
      description = body.description;
    }

    if (!trackingNumber) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { success: false, error: "Invalid webhook data" },
        { status: 400 }
      );
    }

    // Find shipment
    const shipmentResult = await client.query(
      `SELECT * FROM shipping_orders WHERE tracking_number = $1`,
      [trackingNumber]
    );

    if (shipmentResult.rows.length > 0) {
      const shipment = shipmentResult.rows[0];

      // Update status
      let newStatus = shipment.status;
      const statusLower = status?.toLowerCase() || '';
      if (statusLower.includes('delivered') || statusLower.includes('diterima')) {
        newStatus = 'delivered';
      } else if (statusLower.includes('transit') || statusLower.includes('on delivery')) {
        newStatus = 'in_transit';
      } else if (statusLower.includes('picked')) {
        newStatus = 'picked_up';
      } else if (statusLower.includes('cancel') || statusLower.includes('return')) {
        newStatus = 'cancelled';
      }

      await client.query(
        `UPDATE shipping_orders 
         SET status = $1, delivered_at = CASE WHEN $1 = 'delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END
         WHERE id = $2`,
        [newStatus, shipment.id]
      );

      // Add tracking history
      await client.query(
        `INSERT INTO shipping_tracking_history (
          shipping_id, status, location, description, status_timestamp
        ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [shipment.id, status, location, description]
      );

      // Log webhook
      await client.query(
        `INSERT INTO integration_webhooks (
          integration_id, webhook_type, payload, status, processed_at
        ) VALUES ($1, 'shipping_update', $2, 'processed', CURRENT_TIMESTAMP)`,
        [shipment.integration_id, JSON.stringify(body)]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: "Webhook processed",
    });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error processing shipping webhook:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
