import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/integrations/whatsapp/send - Send WhatsApp message
export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      integration_id,
      recipient_phone,
      recipient_name,
      message_type,
      template_name,
      template_params,
      message_body,
      media_url,
      priority,
      scheduled_at,
    } = body;

    // Validation
    if (!integration_id || !recipient_phone) {
      return NextResponse.json(
        { success: false, error: "integration_id and recipient_phone are required" },
        { status: 400 }
      );
    }

    if (message_type === 'template' && !template_name) {
      return NextResponse.json(
        { success: false, error: "template_name is required for template messages" },
        { status: 400 }
      );
    }

    if (message_type === 'text' && !message_body) {
      return NextResponse.json(
        { success: false, error: "message_body is required for text messages" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Get integration config
    const configResult = await client.query(
      `SELECT ic.*, ip.base_url 
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

    // Queue message
    const messageResult = await client.query(
      `INSERT INTO whatsapp_messages (
        integration_id, recipient_phone, recipient_name, message_type,
        template_name, template_params, message_body, media_url,
        priority, scheduled_at, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        integration_id,
        recipient_phone,
        recipient_name || null,
        message_type || 'text',
        template_name || null,
        template_params ? JSON.stringify(template_params) : null,
        message_body || null,
        media_url || null,
        priority || 'normal',
        scheduled_at || null,
        scheduled_at ? 'pending' : 'pending',
      ]
    );

    const message = messageResult.rows[0];

    // If not scheduled, send immediately
    if (!scheduled_at) {
      try {
        const apiUrl = `${config.base_url}/v1/${credentials.phone_number_id}/messages`;
        
        let messageData: any = {
          messaging_product: 'whatsapp',
          to: recipient_phone,
        };

        if (message_type === 'template') {
          messageData.type = 'template';
          messageData.template = {
            name: template_name,
            language: { code: 'id' }, // Indonesian
            components: template_params ? [
              {
                type: 'body',
                parameters: template_params.map((p: any) => ({ type: 'text', text: p })),
              }
            ] : [],
          };
        } else if (message_type === 'text') {
          messageData.type = 'text';
          messageData.text = { body: message_body };
        } else if (message_type === 'image') {
          messageData.type = 'image';
          messageData.image = { link: media_url };
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${credentials.access_token}`,
          },
          body: JSON.stringify(messageData),
        });

        const responseData = await response.json();

        if (response.ok) {
          // Update message status
          await client.query(
            `UPDATE whatsapp_messages 
             SET status = 'sent', provider_message_id = $1, sent_at = CURRENT_TIMESTAMP
             WHERE id = $2`,
            [responseData.messages[0].id, message.id]
          );

          message.status = 'sent';
          message.provider_message_id = responseData.messages[0].id;
        } else {
          // Update with error
          await client.query(
            `UPDATE whatsapp_messages 
             SET status = 'failed', error_message = $1
             WHERE id = $2`,
            [responseData.error?.message || 'Unknown error', message.id]
          );

          message.status = 'failed';
          message.error_message = responseData.error?.message;
        }

        // Log API call
        await client.query(
          `INSERT INTO integration_api_logs (
            integration_id, endpoint, http_method, request_body, 
            response_status, response_body
          ) VALUES ($1, $2, 'POST', $3, $4, $5)`,
          [
            integration_id,
            apiUrl,
            JSON.stringify(messageData),
            response.status,
            JSON.stringify(responseData),
          ]
        );

      } catch (apiError: any) {
        console.error("WhatsApp API error:", apiError);
        await client.query(
          `UPDATE whatsapp_messages 
           SET status = 'failed', error_message = $1
           WHERE id = $2`,
          [apiError.message, message.id]
        );
        message.status = 'failed';
        message.error_message = apiError.message;
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      message: message,
    }, { status: 201 });

  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error sending WhatsApp message:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET /api/integrations/whatsapp/messages - Get message history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get("integration_id");
    const phone = searchParams.get("phone");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = `
      SELECT * FROM whatsapp_messages
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (integrationId) {
      query += ` AND integration_id = $${paramIndex}`;
      params.push(parseInt(integrationId));
      paramIndex++;
    }

    if (phone) {
      query += ` AND recipient_phone = $${paramIndex}`;
      params.push(phone);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    return NextResponse.json({
      success: true,
      messages: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching WhatsApp messages:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
