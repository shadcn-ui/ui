import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

interface WarehouseMetrics {
  dimension_tables: number;
  fact_tables: number;
  total_sales_records: number;
  total_inventory_records: number;
  date_range_start: string;
  date_range_end: string;
  last_etl_run: string | null;
  data_quality_score: number;
}

/**
 * @swagger
 * /api/analytics/warehouse/metrics:
 *   get:
 *     summary: Get data warehouse metrics and statistics
 *     tags: [Data Warehouse]
 *     responses:
 *       200:
 *         description: Warehouse metrics
 */
export async function GET() {
  try {
    // Get table counts
    const tableCountsQuery = `
      SELECT 
        (SELECT COUNT(DISTINCT product_key) FROM dim_product WHERE is_current = TRUE) as total_products,
        (SELECT COUNT(DISTINCT customer_key) FROM dim_customer WHERE is_current = TRUE) as total_customers,
        (SELECT COUNT(*) FROM dim_location) as total_locations,
        (SELECT COUNT(*) FROM dim_supplier) as total_suppliers,
        (SELECT COUNT(*) FROM dim_employee) as total_employees,
        (SELECT COUNT(*) FROM dim_time) as total_dates,
        (SELECT COUNT(*) FROM fact_sales) as total_sales_records,
        (SELECT COUNT(*) FROM fact_inventory) as total_inventory_records,
        (SELECT COUNT(*) FROM fact_production) as total_production_records,
        (SELECT COUNT(*) FROM fact_shipments) as total_shipment_records,
        (SELECT COUNT(*) FROM fact_purchases) as total_purchase_records
    `;

    const countsResult = await query(tableCountsQuery);
    const counts = countsResult.rows[0];

    // Get date range
    const dateRangeQuery = `
      SELECT 
        MIN(order_date) as start_date,
        MAX(order_date) as end_date
      FROM fact_sales
    `;

    const dateRangeResult = await query(dateRangeQuery);
    const dateRange = dateRangeResult.rows[0];

    // Get last ETL run
    const lastETLQuery = `
      SELECT 
        job_name,
        end_time,
        status,
        rows_inserted,
        rows_updated
      FROM etl_job_log
      WHERE status = 'completed'
      ORDER BY end_time DESC
      LIMIT 1
    `;

    const lastETLResult = await query(lastETLQuery);
    const lastETL = lastETLResult.rows[0];

    // Calculate data quality score
    const qualityQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE check_status = 'passed') * 100.0 / 
        NULLIF(COUNT(*), 0) as quality_score
      FROM etl_data_quality
      WHERE checked_at >= CURRENT_DATE - INTERVAL '7 days'
    `;

    const qualityResult = await query(qualityQuery);
    const quality = qualityResult.rows[0];

    // Get monthly aggregates summary
    const aggregatesQuery = `
      SELECT 
        COUNT(DISTINCT month_key) as months_loaded,
        SUM(total_revenue) as total_revenue,
        SUM(total_orders) as total_orders,
        AVG(avg_order_value) as avg_order_value
      FROM agg_monthly_sales
    `;

    const aggregatesResult = await query(aggregatesQuery);
    const aggregates = aggregatesResult.rows[0];

    // Get storage metrics
    const storageQuery = `
      SELECT 
        pg_size_pretty(pg_total_relation_size('fact_sales')) as fact_sales_size,
        pg_size_pretty(pg_total_relation_size('fact_inventory')) as fact_inventory_size,
        pg_size_pretty(pg_total_relation_size('agg_monthly_sales')) as agg_monthly_sales_size,
        pg_size_pretty(pg_database_size(current_database())) as total_database_size
    `;

    const storageResult = await query(storageQuery);
    const storage = storageResult.rows[0];

    return NextResponse.json({
      dimension_counts: {
        products: parseInt(counts.total_products) || 0,
        customers: parseInt(counts.total_customers) || 0,
        locations: parseInt(counts.total_locations) || 0,
        suppliers: parseInt(counts.total_suppliers) || 0,
        employees: parseInt(counts.total_employees) || 0,
        dates: parseInt(counts.total_dates) || 0
      },
      fact_counts: {
        sales: parseInt(counts.total_sales_records) || 0,
        inventory: parseInt(counts.total_inventory_records) || 0,
        production: parseInt(counts.total_production_records) || 0,
        shipments: parseInt(counts.total_shipment_records) || 0,
        purchases: parseInt(counts.total_purchase_records) || 0
      },
      data_range: {
        start_date: dateRange?.start_date || null,
        end_date: dateRange?.end_date || null,
        days_covered: dateRange?.start_date && dateRange?.end_date 
          ? Math.ceil((new Date(dateRange.end_date).getTime() - new Date(dateRange.start_date).getTime()) / (1000 * 60 * 60 * 24))
          : 0
      },
      last_etl: {
        job_name: lastETL?.job_name || null,
        completed_at: lastETL?.end_time || null,
        status: lastETL?.status || null,
        rows_processed: (parseInt(lastETL?.rows_inserted) || 0) + (parseInt(lastETL?.rows_updated) || 0)
      },
      data_quality: {
        score: parseFloat(quality?.quality_score) || 0,
        status: parseFloat(quality?.quality_score) >= 95 ? 'excellent' : 
                parseFloat(quality?.quality_score) >= 85 ? 'good' : 
                parseFloat(quality?.quality_score) >= 70 ? 'fair' : 'poor'
      },
      aggregates: {
        months_loaded: parseInt(aggregates?.months_loaded) || 0,
        total_revenue: parseFloat(aggregates?.total_revenue) || 0,
        total_orders: parseInt(aggregates?.total_orders) || 0,
        avg_order_value: parseFloat(aggregates?.avg_order_value) || 0
      },
      storage: {
        fact_sales_size: storage?.fact_sales_size || '0 bytes',
        fact_inventory_size: storage?.fact_inventory_size || '0 bytes',
        agg_monthly_sales_size: storage?.agg_monthly_sales_size || '0 bytes',
        total_database_size: storage?.total_database_size || '0 bytes'
      },
      health: {
        dimensions_loaded: (parseInt(counts.total_products) > 0 && parseInt(counts.total_customers) > 0),
        facts_loaded: parseInt(counts.total_sales_records) > 0,
        etl_running: lastETL?.status === 'completed',
        data_quality_ok: parseFloat(quality?.quality_score) >= 70
      }
    });

  } catch (error) {
    console.error('Error in warehouse metrics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
