import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/products - List e-commerce products with sync status
// POST /api/ecommerce/products - Sync products from storefront to ERP
export async function GET(request: NextRequest) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const storefront_id = searchParams.get("storefront_id");
    const sync_status = searchParams.get("sync_status");
    const is_published = searchParams.get("is_published");
    const category_id = searchParams.get("category_id");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    let whereConditions = ["1=1"];
    let params: any[] = [];
    let paramCount = 1;

    if (storefront_id) {
      params.push(storefront_id);
      whereConditions.push(`ep.storefront_id = $${paramCount++}`);
    }

    if (sync_status) {
      params.push(sync_status);
      whereConditions.push(`ep.sync_status = $${paramCount++}`);
    }

    if (is_published !== null && is_published !== undefined) {
      params.push(is_published === "true");
      whereConditions.push(`ep.is_published = $${paramCount++}`);
    }

    if (category_id) {
      params.push(category_id);
      whereConditions.push(`ep.ecommerce_category_id = $${paramCount++}`);
    }

    if (search) {
      params.push(`%${search}%`);
      whereConditions.push(`(ep.product_name ILIKE $${paramCount} OR ep.erp_sku ILIKE $${paramCount} OR ep.external_sku ILIKE $${paramCount})`);
      paramCount++;
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ecommerce_products ep
      WHERE ${whereClause}
    `;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get products
    params.push(limit, offset);
    const query = `
      SELECT 
        ep.*,
        es.storefront_name,
        es.platform_type,
        ec.category_name,
        ec.category_path,
        (
          SELECT COUNT(*)
          FROM ecommerce_product_variants epv
          WHERE epv.ecommerce_product_id = ep.ecommerce_product_id
        ) as variant_count,
        (
          SELECT COUNT(*)
          FROM ecommerce_order_items eoi
          WHERE eoi.ecommerce_product_id = ep.ecommerce_product_id
        ) as order_count
      FROM ecommerce_products ep
      LEFT JOIN ecommerce_storefronts es ON ep.storefront_id = es.storefront_id
      LEFT JOIN ecommerce_categories ec ON ep.ecommerce_category_id = ec.ecommerce_category_id
      WHERE ${whereClause}
      ORDER BY ep.created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount++}
    `;

    const result = await client.query(query, params);

    // Get statistics
    const statsQuery = `
      SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN sync_status = 'synced' THEN 1 ELSE 0 END) as synced_count,
        SUM(CASE WHEN sync_status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN sync_status = 'error' THEN 1 ELSE 0 END) as error_count,
        SUM(CASE WHEN is_published THEN 1 ELSE 0 END) as published_count,
        SUM(inventory_quantity) as total_inventory
      FROM ecommerce_products
      WHERE ${whereClause}
    `;
    const statsResult = await client.query(statsQuery, params.slice(0, params.length - 2));

    return NextResponse.json({
      products: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      statistics: statsResult.rows[0],
    });
  } catch (error: any) {
    console.error("Error fetching e-commerce products:", error);
    return NextResponse.json(
      { error: "Failed to fetch e-commerce products", details: error.message },
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
      storefront_id,
      external_product_id,
      external_sku,
      product_name,
      short_description,
      long_description,
      price,
      compare_at_price,
      inventory_quantity,
      ecommerce_category_id,
      erp_product_id,
      erp_sku,
      weight,
      featured_image_url,
      image_urls,
      meta_title,
      meta_description,
      is_published,
      tags,
      specifications,
      created_by,
    } = body;

    if (!storefront_id || !product_name) {
      return NextResponse.json(
        { error: "Missing required fields: storefront_id, product_name" },
        { status: 400 }
      );
    }

    // Check if product already exists
    const existingQuery = `
      SELECT ecommerce_product_id 
      FROM ecommerce_products 
      WHERE storefront_id = $1 
      AND (external_product_id = $2 OR (erp_sku IS NOT NULL AND erp_sku = $3))
    `;
    const existingResult = await client.query(existingQuery, [
      storefront_id,
      external_product_id,
      erp_sku,
    ]);

    if (existingResult.rows.length > 0) {
      // Update existing product
      const updateQuery = `
        UPDATE ecommerce_products
        SET 
          product_name = $1,
          short_description = $2,
          long_description = $3,
          price = $4,
          compare_at_price = $5,
          inventory_quantity = $6,
          ecommerce_category_id = $7,
          weight = $8,
          featured_image_url = $9,
          image_urls = $10,
          meta_title = $11,
          meta_description = $12,
          is_published = $13,
          tags = $14,
          custom_fields = $15,
          sync_status = 'synced',
          last_synced_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP,
          updated_by = $16
        WHERE ecommerce_product_id = $17
        RETURNING *
      `;

      const result = await client.query(updateQuery, [
        product_name,
        short_description || null,
        long_description || null,
        price || null,
        compare_at_price || null,
        inventory_quantity || 0,
        ecommerce_category_id || null,
        weight || null,
        featured_image_url || null,
        image_urls ? JSON.stringify(image_urls) : null,
        meta_title || null,
        meta_description || null,
        is_published || false,
        tags || null,
        specifications ? JSON.stringify(specifications) : null,
        created_by || null,
        existingResult.rows[0].ecommerce_product_id,
      ]);

      return NextResponse.json({
        message: "Product updated successfully",
        product: result.rows[0],
        action: "updated",
      });
    } else {
      // Create new product
      const insertQuery = `
        INSERT INTO ecommerce_products (
          storefront_id, external_product_id, external_sku, erp_product_id, erp_sku,
          product_name, short_description, long_description,
          price, compare_at_price, inventory_quantity, ecommerce_category_id,
          weight, featured_image_url, image_urls,
          meta_title, meta_description, is_published, tags, custom_fields,
          sync_status, last_synced_at, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          'synced', CURRENT_TIMESTAMP, $21
        )
        RETURNING *
      `;

      const result = await client.query(insertQuery, [
        storefront_id,
        external_product_id || null,
        external_sku || null,
        erp_product_id || null,
        erp_sku || null,
        product_name,
        short_description || null,
        long_description || null,
        price || null,
        compare_at_price || null,
        inventory_quantity || 0,
        ecommerce_category_id || null,
        weight || null,
        featured_image_url || null,
        image_urls ? JSON.stringify(image_urls) : null,
        meta_title || null,
        meta_description || null,
        is_published || false,
        tags || null,
        specifications ? JSON.stringify(specifications) : null,
        created_by || null,
      ]);

      return NextResponse.json({
        message: "Product created successfully",
        product: result.rows[0],
        action: "created",
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error("Error syncing e-commerce product:", error);
    return NextResponse.json(
      { error: "Failed to sync e-commerce product", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
