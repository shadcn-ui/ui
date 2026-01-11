import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/storefronts - List storefronts
// POST /api/ecommerce/storefronts - Create storefront configuration
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const platform_type = searchParams.get("platform_type");
    const is_active = searchParams.get("is_active");

    let whereConditions = ["1=1"];
    let params: any[] = [];
    let paramCount = 1;

    if (platform_type) {
      params.push(platform_type);
      whereConditions.push(`platform_type = $${paramCount++}`);
    }

    if (is_active !== null && is_active !== undefined) {
      params.push(is_active === "true");
      whereConditions.push(`is_active = $${paramCount++}`);
    }

    const whereClause = whereConditions.join(" AND ");

    const query = `
      SELECT 
        es.*,
        (SELECT COUNT(*) FROM ecommerce_products WHERE storefront_id = es.storefront_id) as product_count,
        (SELECT COUNT(*) FROM ecommerce_orders WHERE storefront_id = es.storefront_id) as order_count,
        (SELECT COALESCE(SUM(total_amount), 0) FROM ecommerce_orders WHERE storefront_id = es.storefront_id AND order_status IN ('fulfilled', 'processing')) as total_revenue
      FROM ecommerce_storefronts es
      WHERE ${whereClause}
      ORDER BY es.created_at DESC
    `;

    const result = await client.query(query, params);

    return NextResponse.json({
      storefronts: result.rows,
    });
  } catch (error: any) {
    console.error("Error fetching storefronts:", error);
    return NextResponse.json(
      { error: "Failed to fetch storefronts", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      storefront_code,
      storefront_name,
      platform_type,
      platform_url,
      api_endpoint,
      api_key,
      api_secret,
      api_token,
      webhook_secret,
      default_currency,
      default_language,
      timezone,
      auto_sync_products,
      auto_sync_orders,
      auto_sync_inventory,
      auto_sync_customers,
      sync_frequency_minutes,
      auto_create_sales_orders,
      order_prefix,
      is_active,
      created_by,
    } = body;

    if (!storefront_code || !storefront_name || !platform_type) {
      return NextResponse.json(
        { error: "Missing required fields: storefront_code, storefront_name, platform_type" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO ecommerce_storefronts (
        storefront_code, storefront_name, platform_type, platform_url,
        api_endpoint, api_key, api_secret, api_token, webhook_secret,
        default_currency, default_language, timezone,
        auto_sync_products, auto_sync_orders, auto_sync_inventory, auto_sync_customers,
        sync_frequency_minutes, auto_create_sales_orders, order_prefix,
        is_active, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21
      )
      RETURNING *
    `;

    const result = await client.query(insertQuery, [
      storefront_code,
      storefront_name,
      platform_type,
      platform_url || null,
      api_endpoint || null,
      api_key || null,
      api_secret || null,
      api_token || null,
      webhook_secret || null,
      default_currency || 'USD',
      default_language || 'en',
      timezone || 'UTC',
      auto_sync_products !== undefined ? auto_sync_products : true,
      auto_sync_orders !== undefined ? auto_sync_orders : true,
      auto_sync_inventory !== undefined ? auto_sync_inventory : true,
      auto_sync_customers !== undefined ? auto_sync_customers : false,
      sync_frequency_minutes || 15,
      auto_create_sales_orders !== undefined ? auto_create_sales_orders : true,
      order_prefix || null,
      is_active !== undefined ? is_active : true,
      created_by || null,
    ]);

    return NextResponse.json({
      message: "Storefront created successfully",
      storefront: result.rows[0],
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating storefront:", error);
    return NextResponse.json(
      { error: "Failed to create storefront", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
