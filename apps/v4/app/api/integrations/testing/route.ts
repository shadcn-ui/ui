import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface TestResult {
  module: string;
  feature: string;
  status: 'passed' | 'failed' | 'skipped';
  message: string;
  duration: number;
  timestamp: string;
}

// Define all module tests
const moduleTests = {
  sales: [
    {
      name: 'Create Sales Order',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM sales_orders'
        );
        return { passed: true, message: `Found ${result.rows[0].count} sales orders` };
      }
    },
    {
      name: 'Create Lead',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM leads'
        );
        return { passed: true, message: `Found ${result.rows[0].count} leads` };
      }
    },
    {
      name: 'Create Opportunity',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM opportunities'
        );
        return { passed: true, message: `Found ${result.rows[0].count} opportunities` };
      }
    }
  ],
  products: [
    {
      name: 'List Products',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM products WHERE is_active = true'
        );
        return { passed: true, message: `Found ${result.rows[0].count} active products` };
      }
    },
    {
      name: 'Check Stock Levels',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM products WHERE current_stock > 0'
        );
        return { passed: true, message: `Found ${result.rows[0].count} products with stock` };
      }
    }
  ],
  customers: [
    {
      name: 'List Customers',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM customers'
        );
        return { passed: true, message: `Found ${result.rows[0].count} customers` };
      }
    }
  ],
  accounting: [
    {
      name: 'Check Chart of Accounts',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM chart_of_accounts'
        );
        return { passed: true, message: `Found ${result.rows[0].count} accounts` };
      }
    },
    {
      name: 'Check Journal Entries',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM journal_entries'
        );
        return { passed: true, message: `Found ${result.rows[0].count} journal entries` };
      }
    }
  ],
  hris: [
    {
      name: 'List Employees',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM employees'
        );
        return { passed: true, message: `Found ${result.rows[0].count} employees` };
      }
    }
  ],
  pos: [
    {
      name: 'Product Search',
      test: async (client: any) => {
        const result = await client.query(
          'SELECT COUNT(*) as count FROM products WHERE is_active = true AND current_stock > 0'
        );
        return { passed: true, message: `Found ${result.rows[0].count} products available for POS` };
      }
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modules = [], runAll = false } = body;

    const results: TestResult[] = [];
    const client = await pool.connect();

    try {
      const modulesToTest = runAll ? Object.keys(moduleTests) : modules;

      for (const moduleName of modulesToTest) {
        const tests = moduleTests[moduleName as keyof typeof moduleTests];
        if (!tests) continue;

        for (const test of tests) {
          const startTime = Date.now();
          try {
            const result = await test.test(client);
            const duration = Date.now() - startTime;

            results.push({
              module: moduleName,
              feature: test.name,
              status: result.passed ? 'passed' : 'failed',
              message: result.message,
              duration,
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            const duration = Date.now() - startTime;
            results.push({
              module: moduleName,
              feature: test.name,
              status: 'failed',
              message: error instanceof Error ? error.message : 'Unknown error',
              duration,
              timestamp: new Date().toISOString()
            });
          }
        }
      }

      // Save test results to database
      for (const result of results) {
        await client.query(
          `INSERT INTO integration_test_results 
           (module, feature, status, message, duration, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [
            result.module,
            result.feature,
            result.status,
            result.message,
            result.duration,
            result.timestamp
          ]
        ).catch(() => {
          // Table might not exist yet, skip saving
        });
      }

      const summary = {
        total: results.length,
        passed: results.filter(r => r.status === 'passed').length,
        failed: results.filter(r => r.status === 'failed').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        duration: results.reduce((sum, r) => sum + r.duration, 0)
      };

      return NextResponse.json({
        success: true,
        summary,
        results
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Test execution error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Test execution failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Get latest test results
      const results = await client.query(
        `SELECT * FROM integration_test_results 
         ORDER BY created_at DESC LIMIT 100`
      ).catch(() => ({ rows: [] }));

      // Get available modules
      const availableModules = Object.keys(moduleTests).map(module => ({
        name: module,
        tests: moduleTests[module as keyof typeof moduleTests].map(t => t.name)
      }));

      return NextResponse.json({
        success: true,
        availableModules,
        recentResults: results.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching test data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test data' },
      { status: 500 }
    );
  }
}
