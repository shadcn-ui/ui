import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/pos/products/search - Fast product search for POS
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const warehouseId = searchParams.get("warehouse_id");
    const barcode = searchParams.get("barcode");
    const categoryId = searchParams.get("category_id");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!query && !barcode) {
      return NextResponse.json(
        { success: false, error: "Search query (q) or barcode is required" },
        { status: 400 }
      );
    }

    let sql = `
      SELECT 
        p.id,
        p.sku,
        p.barcode,
        p.name,
        p.description,
        p.category_id,
        p.brand,
        p.unit_price,
        p.cost_price,
        p.min_stock_level,
        p.max_stock_level,
        p.current_stock,
        p.is_taxable,
        p.requires_batch_tracking,
        p.treatment_type,
        p.treatment_duration,
        p.is_active,
        p.size,
        p.skin_type_suitable,
        p.concerns_addressed,
        p.is_vegan,
        p.is_halal,
        p.created_at,
        p.updated_at,
        pc.name as category_name,
        p.current_stock as available_quantity,
        0 as reserved_quantity
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Search by barcode (exact match)
    if (barcode) {
      sql += ` AND p.barcode = $${paramIndex}`;
      params.push(barcode);
      paramIndex++;
    }
    // Search by name or SKU (fuzzy match)
    else if (query) {
      sql += ` AND (
        p.name ILIKE $${paramIndex} 
        OR p.sku ILIKE $${paramIndex}
        OR p.brand ILIKE $${paramIndex}
      )`;
      params.push(`%${query}%`);
      paramIndex++;
    }

    // Filter by category
    if (categoryId) {
      sql += ` AND p.category_id = $${paramIndex}`;
      params.push(categoryId);
      paramIndex++;
    }

    // Only show products with stock (or treatments which don't track stock)
    sql += ` AND (p.current_stock > 0 OR p.treatment_type IS NOT NULL)`;

    sql += ` ORDER BY p.name ASC
      LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(sql, params);

    // Calculate selling price with tax for each product
    const taxResult = await pool.query(
      `SELECT tax_rate FROM tax_configurations 
       WHERE is_default = true AND is_active = true LIMIT 1`
    );
    const taxRate = taxResult.rows[0]?.tax_rate || 0;

    const products = result.rows.map(product => ({
      ...product,
      price_with_tax: product.is_taxable 
        ? parseFloat(product.unit_price) * (1 + parseFloat(taxRate) / 100)
        : parseFloat(product.unit_price),
      tax_rate: product.is_taxable ? taxRate : 0,
      in_stock: product.treatment_type || (product.available_quantity - product.reserved_quantity) > 0,
    }));

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
