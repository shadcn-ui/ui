import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface OLAPQueryRequest {
  fact_table: 'sales' | 'inventory' | 'production' | 'shipments' | 'purchases';
  dimensions: string[];
  measures: string[];
  filters?: Record<string, any>;
  time_period?: {
    start_date?: string;
    end_date?: string;
    period_type?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  }[];
  limit?: number;
}

/**
 * @swagger
 * /api/analytics/bi/query:
 *   post:
 *     summary: Execute OLAP-style analytical queries
 *     description: Supports slice, dice, drill-down, and roll-up operations on fact tables
 *     tags: [Business Intelligence]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fact_table
 *               - dimensions
 *               - measures
 *             properties:
 *               fact_table:
 *                 type: string
 *                 enum: [sales, inventory, production, shipments, purchases]
 *               dimensions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["product.category", "customer.region", "time.year"]
 *               measures:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["SUM(total_amount)", "COUNT(*)", "AVG(margin_percentage)"]
 *               filters:
 *                 type: object
 *                 example: {"product.category": "Electronics", "time.year": 2025}
 *               time_period:
 *                 type: object
 *                 properties:
 *                   start_date:
 *                     type: string
 *                   end_date:
 *                     type: string
 *                   period_type:
 *                     type: string
 *                     enum: [day, week, month, quarter, year]
 *               sort:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     column:
 *                       type: string
 *                     direction:
 *                       type: string
 *                       enum: [asc, desc]
 *               limit:
 *                 type: integer
 *                 default: 1000
 *     responses:
 *       200:
 *         description: Query results
 */
export async function POST(request: Request) {
  try {
    const body: OLAPQueryRequest = await request.json();
    
    const {
      fact_table,
      dimensions = [],
      measures = [],
      filters = {},
      time_period,
      sort = [],
      limit = 1000
    } = body;

    // Validate required fields
    if (!fact_table || dimensions.length === 0 || measures.length === 0) {
      return NextResponse.json(
        { error: 'fact_table, dimensions, and measures are required' },
        { status: 400 }
      );
    }

    // Map fact tables to actual table names
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

    // Map dimension paths to joins and columns
    const dimensionMap: Record<string, { table: string; key: string; column: string }> = {
      'product.product_key': { table: 'dim_product', key: 'product_key', column: 'product_key' },
      'product.product_code': { table: 'dim_product', key: 'product_key', column: 'product_code' },
      'product.product_name': { table: 'dim_product', key: 'product_key', column: 'product_name' },
      'product.category': { table: 'dim_product', key: 'product_key', column: 'category' },
      'product.subcategory': { table: 'dim_product', key: 'product_key', column: 'subcategory' },
      'product.brand': { table: 'dim_product', key: 'product_key', column: 'brand' },
      
      'customer.customer_key': { table: 'dim_customer', key: 'customer_key', column: 'customer_key' },
      'customer.customer_name': { table: 'dim_customer', key: 'customer_key', column: 'customer_name' },
      'customer.customer_segment': { table: 'dim_customer', key: 'customer_key', column: 'customer_segment' },
      'customer.region': { table: 'dim_customer', key: 'customer_key', column: 'region' },
      'customer.country': { table: 'dim_customer', key: 'customer_key', column: 'country' },
      'customer.city': { table: 'dim_customer', key: 'customer_key', column: 'city' },
      
      'time.time_key': { table: 'dim_time', key: 'time_key', column: 'time_key' },
      'time.full_date': { table: 'dim_time', key: 'time_key', column: 'full_date' },
      'time.year': { table: 'dim_time', key: 'time_key', column: 'year' },
      'time.quarter': { table: 'dim_time', key: 'time_key', column: 'quarter' },
      'time.month': { table: 'dim_time', key: 'time_key', column: 'month' },
      'time.month_name': { table: 'dim_time', key: 'time_key', column: 'month_name' },
      'time.week_of_year': { table: 'dim_time', key: 'time_key', column: 'week_of_year' },
      'time.day_name': { table: 'dim_time', key: 'time_key', column: 'day_name' },
      'time.year_month': { table: 'dim_time', key: 'time_key', column: 'year_month' },
      
      'location.location_key': { table: 'dim_location', key: 'location_key', column: 'location_key' },
      'location.location_name': { table: 'dim_location', key: 'location_key', column: 'location_name' },
      'location.location_type': { table: 'dim_location', key: 'location_key', column: 'location_type' },
      'location.city': { table: 'dim_location', key: 'location_key', column: 'city' },
      'location.region': { table: 'dim_location', key: 'location_key', column: 'region' },
      'location.country': { table: 'dim_location', key: 'location_key', column: 'country' },
      
      'supplier.supplier_key': { table: 'dim_supplier', key: 'supplier_key', column: 'supplier_key' },
      'supplier.supplier_name': { table: 'dim_supplier', key: 'supplier_key', column: 'supplier_name' },
      'supplier.supplier_type': { table: 'dim_supplier', key: 'supplier_key', column: 'supplier_type' },
      'supplier.performance_rating': { table: 'dim_supplier', key: 'supplier_key', column: 'performance_rating' },
      
      'employee.employee_key': { table: 'dim_employee', key: 'employee_key', column: 'employee_key' },
      'employee.full_name': { table: 'dim_employee', key: 'employee_key', column: 'full_name' },
      'employee.department': { table: 'dim_employee', key: 'employee_key', column: 'department' },
      'employee.role': { table: 'dim_employee', key: 'employee_key', column: 'role' }
    };

    // Build SELECT clause with dimensions and measures
    const selectParts: string[] = [];
    const neededJoins = new Set<string>();

    // Add dimensions to SELECT
    dimensions.forEach((dim, idx) => {
      const dimInfo = dimensionMap[dim];
      if (dimInfo) {
        selectParts.push(`${dimInfo.table}.${dimInfo.column} as dim_${idx}`);
        neededJoins.add(dimInfo.table);
      } else {
        // Try as direct column from fact table
        selectParts.push(`${actualFactTable}.${dim} as dim_${idx}`);
      }
    });

    // Add measures to SELECT (validate they're aggregate functions)
    measures.forEach((measure, idx) => {
      selectParts.push(`${measure} as measure_${idx}`);
    });

    // Build JOIN clauses
    const joins: string[] = [];
    
    if (neededJoins.has('dim_product') && (actualFactTable === 'fact_sales' || actualFactTable === 'fact_inventory' || actualFactTable === 'fact_production' || actualFactTable === 'fact_purchases')) {
      joins.push(`LEFT JOIN dim_product ON ${actualFactTable}.product_key = dim_product.product_key AND dim_product.is_current = TRUE`);
    }
    
    if (neededJoins.has('dim_customer') && (actualFactTable === 'fact_sales' || actualFactTable === 'fact_shipments')) {
      joins.push(`LEFT JOIN dim_customer ON ${actualFactTable}.customer_key = dim_customer.customer_key AND dim_customer.is_current = TRUE`);
    }
    
    if (neededJoins.has('dim_time')) {
      joins.push(`LEFT JOIN dim_time ON ${actualFactTable}.time_key = dim_time.time_key`);
    }
    
    if (neededJoins.has('dim_location') && actualFactTable !== 'fact_shipments') {
      joins.push(`LEFT JOIN dim_location ON ${actualFactTable}.location_key = dim_location.location_key`);
    }
    
    if (neededJoins.has('dim_supplier') && actualFactTable === 'fact_purchases') {
      joins.push(`LEFT JOIN dim_supplier ON ${actualFactTable}.supplier_key = dim_supplier.supplier_key`);
    }
    
    if (neededJoins.has('dim_employee') && actualFactTable === 'fact_sales') {
      joins.push(`LEFT JOIN dim_employee ON ${actualFactTable}.employee_key = dim_employee.employee_key`);
    }

    // Build WHERE clause from filters
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

    // Add time period filter
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

    // Build GROUP BY clause (all dimensions)
    const groupByParts: string[] = [];
    dimensions.forEach((dim, idx) => {
      groupByParts.push(`dim_${idx}`);
    });

    // Build ORDER BY clause
    const orderByParts: string[] = [];
    if (sort.length > 0) {
      sort.forEach(s => {
        // Find if it's a dimension or measure
        const dimIdx = dimensions.findIndex(d => d.endsWith(`.${s.column}`) || d === s.column);
        if (dimIdx >= 0) {
          orderByParts.push(`dim_${dimIdx} ${s.direction.toUpperCase()}`);
        } else {
          const measureIdx = measures.findIndex(m => m.includes(s.column));
          if (measureIdx >= 0) {
            orderByParts.push(`measure_${measureIdx} ${s.direction.toUpperCase()}`);
          }
        }
      });
    }

    // Build final query
    let sqlQuery = `
      SELECT ${selectParts.join(', ')}
      FROM ${actualFactTable}
      ${joins.join(' ')}
    `;

    if (whereClauses.length > 0) {
      sqlQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (groupByParts.length > 0) {
      sqlQuery += ` GROUP BY ${groupByParts.join(', ')}`;
    }

    if (orderByParts.length > 0) {
      sqlQuery += ` ORDER BY ${orderByParts.join(', ')}`;
    }

    sqlQuery += ` LIMIT ${limit}`;

    // Execute query
    const startTime = Date.now();
    const result = await query(sqlQuery, params);
    const executionTime = Date.now() - startTime;

    // Format results with dimension and measure names
    const formattedRows = result.rows.map(row => {
      const formatted: Record<string, any> = {};
      
      dimensions.forEach((dim, idx) => {
        formatted[dim] = row[`dim_${idx}`];
      });
      
      measures.forEach((measure, idx) => {
        formatted[measure] = row[`measure_${idx}`];
      });
      
      return formatted;
    });

    return NextResponse.json({
      query: {
        fact_table,
        dimensions,
        measures,
        filters,
        time_period
      },
      results: formattedRows,
      metadata: {
        row_count: result.rowCount,
        execution_time_ms: executionTime,
        sql_query: sqlQuery.trim()
      }
    });

  } catch (error) {
    console.error('Error in OLAP query API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
