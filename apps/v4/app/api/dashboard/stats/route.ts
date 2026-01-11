import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // Get total revenue
      const revenueResult = await client.query(
        'SELECT COALESCE(SUM(total_amount), 0) as total FROM sales_orders'
      );
      const totalRevenue = parseFloat(revenueResult.rows[0].total);

      // Get active orders count
      const activeOrdersResult = await client.query(
        `SELECT COUNT(*) as total FROM sales_orders 
         WHERE status NOT IN ('completed', 'cancelled', 'closed')`
      );
      const activeOrders = parseInt(activeOrdersResult.rows[0].total);

      // Get inventory items count
      const inventoryResult = await client.query(
        'SELECT COUNT(*) as total FROM products WHERE is_active = true'
      );
      const inventoryItems = parseInt(inventoryResult.rows[0].total);

      // Get active employees count
      const employeesResult = await client.query(
        `SELECT COUNT(*) as total FROM employees 
         WHERE employment_status = 'active'`
      );
      const activeEmployees = parseInt(employeesResult.rows[0].total);

      // Product module stats
      const productStatsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM products WHERE is_active = true) as total_products,
          (SELECT COUNT(*) FROM products WHERE current_stock > 0) as in_stock,
          (SELECT COUNT(*) FROM products WHERE current_stock <= min_stock_level AND current_stock > 0) as low_stock
      `);
      const productStats = productStatsResult.rows[0];

      // Operations stats
      const operationsStatsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM production_schedules WHERE status = 'in_progress') as active_production,
          (SELECT COUNT(*) FROM quality_inspections WHERE status = 'pending') as pending_inspections
      `).catch(() => ({ rows: [{ active_production: 0, pending_inspections: 0 }] }));
      const operationsStats = operationsStatsResult.rows[0];

      // Accounting stats
      const accountingStatsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM chart_of_accounts) as total_accounts,
          (SELECT COUNT(*) FROM journal_entries) as journal_entries,
          (SELECT COALESCE(SUM(CASE WHEN account_type = 'Asset' THEN balance ELSE 0 END), 0) FROM chart_of_accounts) as total_assets
      `);
      const accountingStats = accountingStatsResult.rows[0];

      // Sales stats
      const salesStatsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM leads) as total_leads,
          (SELECT COUNT(*) FROM opportunities) as total_opportunities,
          (SELECT COUNT(*) FROM sales_orders WHERE status NOT IN ('completed', 'cancelled', 'closed')) as active_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE)) as monthly_revenue
      `);
      const salesStats = salesStatsResult.rows[0];

      // HRIS stats
      const hrisStatsResult = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM employees) as total_employees,
          (SELECT COUNT(*) FROM employees WHERE employment_status = 'active') as active_employees,
          (SELECT COUNT(*) FROM leave_requests WHERE status = 'pending') as pending_leave
      `).catch(() => ({ rows: [{ total_employees: 0, active_employees: 0, pending_leave: 0 }] }));
      const hrisStats = hrisStatsResult.rows[0];

      return NextResponse.json({
        // Top level stats
        totalRevenue,
        activeOrders,
        inventoryItems,
        activeEmployees,
        
        // Module specific stats
        sales: {
          totalLeads: parseInt(salesStats.total_leads),
          totalOpportunities: parseInt(salesStats.total_opportunities),
          activeOrders: parseInt(salesStats.active_orders),
          monthlyRevenue: parseFloat(salesStats.monthly_revenue)
        },
        products: {
          total: parseInt(productStats.total_products),
          inStock: parseInt(productStats.in_stock),
          lowStock: parseInt(productStats.low_stock)
        },
        operations: {
          activeProduction: parseInt(operationsStats.active_production || 0),
          pendingInspections: parseInt(operationsStats.pending_inspections || 0)
        },
        accounting: {
          totalAccounts: parseInt(accountingStats.total_accounts),
          journalEntries: parseInt(accountingStats.journal_entries),
          totalAssets: parseFloat(accountingStats.total_assets)
        },
        hris: {
          totalEmployees: parseInt(hrisStats.total_employees),
          activeEmployees: parseInt(hrisStats.active_employees),
          pendingLeave: parseInt(hrisStats.pending_leave || 0)
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
