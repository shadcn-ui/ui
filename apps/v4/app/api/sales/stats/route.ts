import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // Get total leads count
      const leadsResult = await client.query('SELECT COUNT(*) as total FROM leads');
      const totalLeads = parseInt(leadsResult.rows[0].total);

      // Get total opportunities count
      const opportunitiesResult = await client.query('SELECT COUNT(*) as total FROM opportunities');
      const totalOpportunities = parseInt(opportunitiesResult.rows[0].total);

      // Get total sales revenue
      const revenueResult = await client.query(
        'SELECT COALESCE(SUM(total_amount), 0) as total FROM sales_orders'
      );
      const totalRevenue = parseFloat(revenueResult.rows[0].total);

      // Calculate conversion rate (customers who made orders / total leads)
      const conversionResult = await client.query(`
        SELECT 
          COUNT(DISTINCT so.customer_id) as converted_customers,
          (SELECT COUNT(*) FROM leads) as total_leads
        FROM sales_orders so
      `);
      
      const convertedCustomers = parseInt(conversionResult.rows[0].converted_customers);
      const totalLeadsForConversion = parseInt(conversionResult.rows[0].total_leads);
      const conversionRate = totalLeadsForConversion > 0 
        ? (convertedCustomers / totalLeadsForConversion) * 100 
        : 0;

      return NextResponse.json({
        totalLeads,
        totalOpportunities,
        totalRevenue,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching sales stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales statistics' },
      { status: 500 }
    );
  }
}
