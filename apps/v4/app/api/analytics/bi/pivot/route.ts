import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface PivotRequest {
  fact_table: 'sales' | 'inventory' | 'production' | 'shipments' | 'purchases';
  rows: string[];
  columns: string[];
  values: string[];
  aggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  filters?: Record<string, any>;
  time_period?: {
    start_date?: string;
    end_date?: string;
  };
}

/**
 * @swagger
 * /api/analytics/bi/pivot:
 *   post:
 *     summary: Generate pivot tables with dynamic rows and columns
 *     description: Creates cross-tabulation reports with aggregated metrics
 *     tags: [Business Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fact_table
 *               - rows
 *               - columns
 *               - values
 *             properties:
 *               fact_table:
 *                 type: string
 *                 enum: [sales, inventory, production, shipments, purchases]
 *               rows:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["product.category", "product.subcategory"]
 *               columns:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["time.year", "time.quarter"]
 *               values:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["total_amount", "quantity"]
 *               aggregation:
 *                 type: string
 *                 enum: [SUM, AVG, COUNT, MIN, MAX]
 *                 default: SUM
 *               filters:
 *                 type: object
 *               time_period:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                   end_date:
 *                     type: string
 *     responses:
 *       200:
 *         description: Pivot table data
 */
export async function POST(request: Request) {
  try {
    const body: PivotRequest = await request.json();
    
    const {
      fact_table,
      rows = [],
      columns = [],
      values = [],
      aggregation = 'SUM',
      filters = {},
      time_period
    } = body;

    // Validate required fields
    if (!fact_table || rows.length === 0 || columns.length === 0 || values.length === 0) {
      return NextResponse.json(
        { error: 'fact_table, rows, columns, and values are required' },
        { status: 400 }
      );
    }

    // Map fact tables
    const factTableMap: Record<string, string> = {
      'sales': 'fact_sales',
      'inventory': 'fact_inventory',
      'production': 'fact_production',
      'shipments': 'fact_shipments',
      'purchases': 'fact_purchases'
    };

    const actualFactTable = factTableMap[fact_table];
    if (!actualFactTable) {
      return NextResponse.json(
        { error: `Invalid fact_table: ${fact_table}` },
        { status: 400 }
      );
    }

    // Dimension mapping (reuse from query endpoint)
    const dimensionMap: Record<string, { table: string; key: string; column: string }> = {
      'product.category': { table: 'dim_product', key: 'product_key', column: 'category' },
      'product.subcategory': { table: 'dim_product', key: 'product_key', column: 'subcategory' },
      'product.brand': { table: 'dim_product', key: 'product_key', column: 'brand' },
      'product.product_name': { table: 'dim_product', key: 'product_key', column: 'product_name' },
      
      'customer.region': { table: 'dim_customer', key: 'customer_key', column: 'region' },
      'customer.country': { table: 'dim_customer', key: 'customer_key', column: 'country' },
      'customer.customer_segment': { table: 'dim_customer', key: 'customer_key', column: 'customer_segment' },
      'customer.customer_name': { table: 'dim_customer', key: 'customer_key', column: 'customer_name' },
      
      'time.year': { table: 'dim_time', key: 'time_key', column: 'year' },
      'time.quarter': { table: 'dim_time', key: 'time_key', column: 'quarter' },
      'time.month': { table: 'dim_time', key: 'time_key', column: 'month' },
      'time.month_name': { table: 'dim_time', key: 'time_key', column: 'month_name' },
      'time.year_month': { table: 'dim_time', key: 'time_key', column: 'year_month' },
      'time.year_quarter': { table: 'dim_time', key: 'time_key', column: 'year_quarter' },
      
      'location.region': { table: 'dim_location', key: 'location_key', column: 'region' },
      'location.country': { table: 'dim_location', key: 'location_key', column: 'country' },
      'location.location_name': { table: 'dim_location', key: 'location_key', column: 'location_name' },
      
      'supplier.supplier_name': { table: 'dim_supplier', key: 'supplier_key', column: 'supplier_name' },
      'employee.full_name': { table: 'dim_employee', key: 'employee_key', column: 'full_name' },
      'employee.department': { table: 'dim_employee', key: 'employee_key', column: 'department' }
    };

    // Build query to get raw data
    const neededJoins = new Set<string>();
    const selectParts: string[] = [];
    const groupByParts: string[] = [];

    // Add row dimensions
    rows.forEach((row, idx) => {
      const dimInfo = dimensionMap[row];
      if (dimInfo) {
        selectParts.push(`${dimInfo.table}.${dimInfo.column} as row_${idx}`);
        groupByParts.push(`${dimInfo.table}.${dimInfo.column}`);
        neededJoins.add(dimInfo.table);
      }
    });

    // Add column dimensions
    columns.forEach((col, idx) => {
      const dimInfo = dimensionMap[col];
      if (dimInfo) {
        selectParts.push(`${dimInfo.table}.${dimInfo.column} as col_${idx}`);
        groupByParts.push(`${dimInfo.table}.${dimInfo.column}`);
        neededJoins.add(dimInfo.table);
      }
    });

    // Add value aggregations
    values.forEach((val, idx) => {
      selectParts.push(`${aggregation}(${actualFactTable}.${val}) as value_${idx}`);
    });

    // Build joins
    const joins: string[] = [];
    
    if (neededJoins.has('dim_product')) {
      joins.push(`LEFT JOIN dim_product ON ${actualFactTable}.product_key = dim_product.product_key AND dim_product.is_current = TRUE`);
    }
    if (neededJoins.has('dim_customer')) {
      joins.push(`LEFT JOIN dim_customer ON ${actualFactTable}.customer_key = dim_customer.customer_key AND dim_customer.is_current = TRUE`);
    }
    if (neededJoins.has('dim_time')) {
      joins.push(`LEFT JOIN dim_time ON ${actualFactTable}.time_key = dim_time.time_key`);
    }
    if (neededJoins.has('dim_location')) {
      joins.push(`LEFT JOIN dim_location ON ${actualFactTable}.location_key = dim_location.location_key`);
    }
    if (neededJoins.has('dim_supplier')) {
      joins.push(`LEFT JOIN dim_supplier ON ${actualFactTable}.supplier_key = dim_supplier.supplier_key`);
    }
    if (neededJoins.has('dim_employee')) {
      joins.push(`LEFT JOIN dim_employee ON ${actualFactTable}.employee_key = dim_employee.employee_key`);
    }

    // Build WHERE clause
    const whereClauses: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Add custom filters
    Object.entries(filters).forEach(([key, value]) => {
      const dimInfo = dimensionMap[key];
      if (dimInfo) {
        whereClauses.push(`${dimInfo.table}.${dimInfo.column} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    });

    // Add time period
    if (time_period) {
      if (time_period.start_date) {
        whereClauses.push(`dim_time.full_date >= $${paramIndex}`);
        params.push(time_period.start_date);
        paramIndex++;
      }
      if (time_period.end_date) {
        whereClauses.push(`dim_time.full_date <= $${paramIndex}`);
        params.push(time_period.end_date);
        paramIndex++;
      }
    }

    // Build SQL
    let sqlQuery = `
      SELECT ${selectParts.join(', ')}
      FROM ${actualFactTable}
      ${joins.join(' ')}
    `;

    if (whereClauses.length > 0) {
      sqlQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    sqlQuery += ` GROUP BY ${groupByParts.join(', ')}`;
    sqlQuery += ` ORDER BY ${groupByParts.join(', ')}`;

    // Execute query
    const startTime = Date.now();
    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    // Transform results into pivot structure
    const pivotData: Record<string, any> = {};
    const columnValues = new Set<string>();
    const rowKeys = new Set<string>();

    result.rows.forEach(row => {
      // Build row key from all row dimensions
      const rowKey = rows.map((_, idx) => row[`row_${idx}`]).join(' | ');
      rowKeys.add(rowKey);

      // Build column key from all column dimensions
      const colKey = columns.map((_, idx) => row[`col_${idx}`]).join(' | ');
      columnValues.add(colKey);

      // Store the value
      if (!pivotData[rowKey]) {
        pivotData[rowKey] = {};
      }
      
      // Store each value metric
      values.forEach((val, idx) => {
        const valueKey = `${colKey}_${val}`;
        pivotData[rowKey][valueKey] = row[`value_${idx}`];
      });
    });

    // Convert to array format for easier rendering
    const pivotRows = Array.from(rowKeys).map(rowKey => {
      const rowData: Record<string, any> = { row: rowKey };
      
      Array.from(columnValues).forEach(colKey => {
        values.forEach(val => {
          const valueKey = `${colKey}_${val}`;
          rowData[colKey] = pivotData[rowKey][valueKey] || 0;
        });
      });
      
      return rowData;
    });

    // Calculate totals
    const totals: Record<string, number> = {};
    Array.from(columnValues).forEach(colKey => {
      let total = 0;
      pivotRows.forEach(row => {
        total += parseFloat(row[colKey]) || 0;
      });
      totals[colKey] = total;
    });

    return NextResponse.json({
      pivot: {
        rows: rows,
        columns: columns,
        values: values,
        aggregation: aggregation
      },
      data: pivotRows,
      column_headers: Array.from(columnValues),
      row_count: rowKeys.size,
      column_count: columnValues.size,
      totals: totals,
      metadata: {
        execution_time_ms: executionTime,
        total_cells: rowKeys.size * columnValues.size
      }
    });

  } catch (error) {
    console.error('Error in pivot table API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
