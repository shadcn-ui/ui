import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/ecommerce/inventory/sync - Sync inventory between ERP and e-commerce
// GET /api/ecommerce/inventory/sync - Get sync status and history
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const storefront_id = searchParams.get("storefront_id");

    let whereConditions = ["1=1"];
    let params: any[] = [];
    let paramCount = 1;

    if (storefront_id) {
      params.push(storefront_id);
      whereConditions.push(`ep.storefront_id = $${paramCount++}`);
    }

    const whereClause = whereConditions.join(" AND ");

    // Get inventory sync status
    const query = `
      SELECT 
        ep.ecommerce_product_id,
        ep.product_name,
        ep.erp_sku,
        ep.external_sku,
        ep.inventory_quantity as ecommerce_inventory,
        ep.sync_status,
        ep.last_synced_at,
        es.storefront_name,
        es.platform_type,
        CASE 
          WHEN ep.inventory_quantity < ep.low_stock_threshold THEN 'low_stock'
          WHEN ep.inventory_quantity = 0 THEN 'out_of_stock'
          ELSE 'in_stock'
        END as stock_status
      FROM ecommerce_products ep
      LEFT JOIN ecommerce_storefronts es ON ep.storefront_id = es.storefront_id
      WHERE ${whereClause}
      AND ep.inventory_tracked = true
      ORDER BY ep.last_synced_at ASC NULLS FIRST
      LIMIT 100
    `;

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN inventory_quantity < low_stock_threshold THEN 1 ELSE 0 END) as low_stock_count,
        SUM(CASE WHEN inventory_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_count,
        SUM(CASE WHEN sync_status = 'synced' THEN 1 ELSE 0 END) as synced_count,
        SUM(CASE WHEN sync_status = 'pending' THEN 1 ELSE 0 END) as pending_sync_count,
        MAX(last_synced_at) as last_sync_time
      FROM ecommerce_products ep
      WHERE ${whereClause}
      AND inventory_tracked = true
    `;
    const statsResult = await client.query(statsQuery, params);

    return NextResponse.json({
      products: result.rows,
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching inventory sync status:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory sync status", details: error.message },
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
    const { storefront_id, product_updates, direction, sync_all } = body;

    if (!storefront_id || !direction) {
      return NextResponse.json(
        { error: "Missing required fields: storefront_id, direction (erp_to_store or store_to_erp)" },
        { status: 400 }
      );
    }

    let updatedCount = 0;
    let errorCount = 0;
    let errors: any[] = [];

    if (sync_all) {
      // Sync all products for the storefront
      if (direction === "erp_to_store") {
        // Get ERP inventory and update e-commerce products
        // This would typically connect to your ERP products table
        const syncQuery = `
          UPDATE ecommerce_products ep
          SET 
            inventory_quantity = COALESCE(
              (SELECT quantity_on_hand FROM products p WHERE p.sku = ep.erp_sku),
              ep.inventory_quantity
            ),
            sync_status = 'synced',
            last_synced_at = CURRENT_TIMESTAMP
          WHERE ep.storefront_id = $1
          AND ep.erp_sku IS NOT NULL
          AND ep.inventory_tracked = true
          RETURNING ecommerce_product_id
        `;

        const result = await client.query(syncQuery, [storefront_id]);
        updatedCount = result.rowCount || 0;
      } else if (direction === "store_to_erp") {
        // This would update your ERP inventory from e-commerce data
        // Implementation depends on your ERP structure
        return NextResponse.json({
          message: "Store to ERP sync requires custom implementation",
          direction: "store_to_erp",
        }, { status: 501 });
      }
    } else if (product_updates && Array.isArray(product_updates)) {
      // Sync specific products
      for (const update of product_updates) {
        try {
          const {
            ecommerce_product_id,
            external_product_id,
            inventory_quantity,
          } = update;

          let updateQuery: string;
          let params_array: any[];

          if (ecommerce_product_id) {
            updateQuery = `
              UPDATE ecommerce_products
              SET 
                inventory_quantity = $1,
                sync_status = 'synced',
                last_synced_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
              WHERE ecommerce_product_id = $2
              RETURNING ecommerce_product_id, product_name
            `;
            params_array = [inventory_quantity, ecommerce_product_id];
          } else if (external_product_id) {
            updateQuery = `
              UPDATE ecommerce_products
              SET 
                inventory_quantity = $1,
                sync_status = 'synced',
                last_synced_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
              WHERE storefront_id = $2 AND external_product_id = $3
              RETURNING ecommerce_product_id, product_name
            `;
            params_array = [inventory_quantity, storefront_id, external_product_id];
          } else {
            errorCount++;
            errors.push({
              error: "Missing product identifier",
              update,
            });
            continue;
          }

          const result = await client.query(updateQuery, params_array);

          if (result.rowCount && result.rowCount > 0) {
            updatedCount++;
          } else {
            errorCount++;
            errors.push({
              error: "Product not found",
              update,
            });
          }
        } catch (error: any) {
          errorCount++;
          errors.push({
            error: error.message,
            update,
          });
        }
      }
    } else {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Either sync_all=true or product_updates array is required" },
        { status: 400 }
      );
    }

    await client.query("COMMIT");

    // Update storefront last sync time
    await client.query(
      `UPDATE ecommerce_storefronts 
       SET last_inventory_sync_at = CURRENT_TIMESTAMP 
       WHERE storefront_id = $1`,
      [storefront_id]
    );

    return NextResponse.json({
      message: "Inventory sync completed",
      updated_count: updatedCount,
      error_count: errorCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error syncing inventory:", error);
    return NextResponse.json(
      { error: "Failed to sync inventory", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
