import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/ecommerce/products/[id] - Get product details
// PUT /api/ecommerce/products/[id] - Update product
// DELETE /api/ecommerce/products/[id] - Delete product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const productId = params.id;

    const query = `
      SELECT 
        ep.*,
        es.storefront_name,
        es.platform_type,
        es.platform_url,
        ec.category_name,
        ec.category_path,
        (
          SELECT json_agg(json_build_object(
            'variant_id', variant_id,
            'variant_name', variant_name,
            'external_variant_id', external_variant_id,
            'price', price,
            'inventory_quantity', inventory_quantity,
            'option1_name', option1_name,
            'option1_value', option1_value,
            'option2_name', option2_name,
            'option2_value', option2_value,
            'option3_name', option3_name,
            'option3_value', option3_value,
            'is_available', is_available
          ))
          FROM ecommerce_product_variants
          WHERE ecommerce_product_id = ep.ecommerce_product_id
        ) as variants,
        (
          SELECT COUNT(*)
          FROM ecommerce_order_items eoi
          WHERE eoi.ecommerce_product_id = ep.ecommerce_product_id
        ) as total_orders,
        (
          SELECT SUM(eoi.quantity)
          FROM ecommerce_order_items eoi
          WHERE eoi.ecommerce_product_id = ep.ecommerce_product_id
        ) as total_quantity_sold
      FROM ecommerce_products ep
      LEFT JOIN ecommerce_storefronts es ON ep.storefront_id = es.storefront_id
      LEFT JOIN ecommerce_categories ec ON ep.ecommerce_category_id = ec.ecommerce_category_id
      WHERE ep.ecommerce_product_id = $1
    `;

    const result = await client.query(query, [productId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const productId = params.id;
    const body = await request.json();
    const {
      product_name,
      short_description,
      long_description,
      price,
      compare_at_price,
      inventory_quantity,
      ecommerce_category_id,
      weight,
      featured_image_url,
      image_urls,
      meta_title,
      meta_description,
      is_published,
      is_featured,
      is_on_sale,
      tags,
      custom_fields,
      updated_by,
    } = body;

    const updateFields = [];
    const params_array: any[] = [];
    let paramCount = 1;

    if (product_name !== undefined) {
      updateFields.push(`product_name = $${paramCount++}`);
      params_array.push(product_name);
    }
    if (short_description !== undefined) {
      updateFields.push(`short_description = $${paramCount++}`);
      params_array.push(short_description);
    }
    if (long_description !== undefined) {
      updateFields.push(`long_description = $${paramCount++}`);
      params_array.push(long_description);
    }
    if (price !== undefined) {
      updateFields.push(`price = $${paramCount++}`);
      params_array.push(price);
    }
    if (compare_at_price !== undefined) {
      updateFields.push(`compare_at_price = $${paramCount++}`);
      params_array.push(compare_at_price);
    }
    if (inventory_quantity !== undefined) {
      updateFields.push(`inventory_quantity = $${paramCount++}`);
      params_array.push(inventory_quantity);
    }
    if (ecommerce_category_id !== undefined) {
      updateFields.push(`ecommerce_category_id = $${paramCount++}`);
      params_array.push(ecommerce_category_id);
    }
    if (weight !== undefined) {
      updateFields.push(`weight = $${paramCount++}`);
      params_array.push(weight);
    }
    if (featured_image_url !== undefined) {
      updateFields.push(`featured_image_url = $${paramCount++}`);
      params_array.push(featured_image_url);
    }
    if (image_urls !== undefined) {
      updateFields.push(`image_urls = $${paramCount++}`);
      params_array.push(JSON.stringify(image_urls));
    }
    if (meta_title !== undefined) {
      updateFields.push(`meta_title = $${paramCount++}`);
      params_array.push(meta_title);
    }
    if (meta_description !== undefined) {
      updateFields.push(`meta_description = $${paramCount++}`);
      params_array.push(meta_description);
    }
    if (is_published !== undefined) {
      updateFields.push(`is_published = $${paramCount++}`);
      params_array.push(is_published);
    }
    if (is_featured !== undefined) {
      updateFields.push(`is_featured = $${paramCount++}`);
      params_array.push(is_featured);
    }
    if (is_on_sale !== undefined) {
      updateFields.push(`is_on_sale = $${paramCount++}`);
      params_array.push(is_on_sale);
    }
    if (tags !== undefined) {
      updateFields.push(`tags = $${paramCount++}`);
      params_array.push(tags);
    }
    if (custom_fields !== undefined) {
      updateFields.push(`custom_fields = $${paramCount++}`);
      params_array.push(JSON.stringify(custom_fields));
    }
    if (updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramCount++}`);
      params_array.push(updated_by);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    updateFields.push(`sync_status = 'pending'`); // Mark as needing sync
    params_array.push(productId);

    const query = `
      UPDATE ecommerce_products
      SET ${updateFields.join(", ")}
      WHERE ecommerce_product_id = $${paramCount++}
      RETURNING *
    `;

    const result = await client.query(query, params_array);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = await pool.connect();

  try {
    const productId = params.id;

    // Check if product has orders
    const checkQuery = `
      SELECT COUNT(*) as order_count
      FROM ecommerce_order_items
      WHERE ecommerce_product_id = $1
    `;
    const checkResult = await client.query(checkQuery, [productId]);

    if (parseInt(checkResult.rows[0].order_count) > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with existing orders. Consider unpublishing instead." },
        { status: 400 }
      );
    }

    // Delete product (this will cascade to variants)
    const deleteQuery = `
      DELETE FROM ecommerce_products
      WHERE ecommerce_product_id = $1
      RETURNING ecommerce_product_id, product_name
    `;

    const result = await client.query(deleteQuery, [productId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
