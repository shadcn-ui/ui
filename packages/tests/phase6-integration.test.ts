import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * Phase 6 Analytics & Intelligence - Integration Test Suite
 * 
 * Tests all 30+ analytics endpoints across 9 completed tasks:
 * - Task 2: KPI & Metrics Engine
 * - Task 3: Executive Dashboards
 * - Task 4: Advanced Reporting
 * - Task 5: Predictive Analytics
 * - Task 6: Anomaly Detection
 * - Task 7: Data Warehouse & ETL
 * - Task 8: Business Intelligence APIs
 * - Task 9: Prescriptive Analytics
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  const data = await response.json();
  return { response, data };
}

describe('Phase 6: Analytics & Intelligence - Integration Tests', () => {
  
  // =============================================================================
  // TASK 2: KPI & METRICS ENGINE
  // =============================================================================
  
  describe('Task 2: KPI & Metrics Engine', () => {
    
    describe('GET /api/analytics/kpis', () => {
      it('should fetch all KPIs', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('kpis');
        expect(Array.isArray(data.kpis)).toBe(true);
        expect(data).toHaveProperty('metadata');
      });
      
      it('should filter KPIs by category', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis?category=sales');
        
        expect(response.status).toBe(200);
        expect(data.kpis.every((kpi: any) => kpi.category === 'sales')).toBe(true);
      });
      
      it('should filter KPIs by status', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis?status=active');
        
        expect(response.status).toBe(200);
        expect(data.kpis.every((kpi: any) => kpi.status === 'active')).toBe(true);
      });
    });
    
    describe('POST /api/analytics/kpis', () => {
      it('should create a new KPI', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test KPI',
            category: 'operations',
            calculation_method: 'manual',
            target_value: 100,
            unit: 'units'
          })
        });
        
        expect(response.status).toBe(201);
        expect(data).toHaveProperty('kpi_id');
        expect(data.name).toBe('Test KPI');
      });
      
      it('should reject invalid KPI creation', async () => {
        const { response } = await apiCall('/api/analytics/kpis', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Invalid KPI'
            // Missing required fields
          })
        });
        
        expect(response.status).toBe(400);
      });
    });
    
    describe('GET /api/analytics/kpis/calculate', () => {
      it('should calculate KPI values', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis/calculate');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('calculations');
        expect(Array.isArray(data.calculations)).toBe(true);
        
        if (data.calculations.length > 0) {
          expect(data.calculations[0]).toHaveProperty('kpi_id');
          expect(data.calculations[0]).toHaveProperty('current_value');
          expect(data.calculations[0]).toHaveProperty('target_value');
          expect(data.calculations[0]).toHaveProperty('performance_percentage');
        }
      });
      
      it('should calculate specific KPI', async () => {
        const { response, data } = await apiCall('/api/analytics/kpis/calculate?kpi_id=1');
        
        expect(response.status).toBe(200);
        expect(data.calculations.every((calc: any) => calc.kpi_id === 1)).toBe(true);
      });
    });
    
    describe('GET /api/analytics/kpis/history', () => {
      it('should fetch KPI history', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/kpis/history?start_date=2024-01-01&end_date=2025-12-31'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('history');
        expect(Array.isArray(data.history)).toBe(true);
      });
    });
  });
  
  // =============================================================================
  // TASK 3: EXECUTIVE DASHBOARDS
  // =============================================================================
  
  describe('Task 3: Executive Dashboards', () => {
    
    describe('GET /api/analytics/dashboard', () => {
      it('should fetch dashboard overview', async () => {
        const { response, data } = await apiCall('/api/analytics/dashboard');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('overview');
        expect(data).toHaveProperty('kpi_summary');
        expect(data).toHaveProperty('recent_alerts');
      });
      
      it('should return performance within SLA', async () => {
        const startTime = Date.now();
        const { response } = await apiCall('/api/analytics/dashboard');
        const duration = Date.now() - startTime;
        
        expect(response.status).toBe(200);
        expect(duration).toBeLessThan(2000); // < 2 seconds SLA
      });
    });
    
    describe('GET /api/analytics/dashboards', () => {
      it('should list all dashboards', async () => {
        const { response, data } = await apiCall('/api/analytics/dashboards');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('dashboards');
        expect(Array.isArray(data.dashboards)).toBe(true);
      });
    });
    
    describe('POST /api/analytics/dashboards', () => {
      it('should create custom dashboard', async () => {
        const { response, data } = await apiCall('/api/analytics/dashboards', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Test Dashboard',
            layout: 'grid',
            widgets: [
              { type: 'kpi_card', config: { kpi_id: 1 } }
            ]
          })
        });
        
        expect(response.status).toBe(201);
        expect(data).toHaveProperty('dashboard_id');
        expect(data.name).toBe('Test Dashboard');
      });
    });
  });
  
  // =============================================================================
  // TASK 4: ADVANCED REPORTING
  // =============================================================================
  
  describe('Task 4: Advanced Reporting', () => {
    
    describe('POST /api/analytics/reports/generate', () => {
      it('should generate report', async () => {
        const { response, data } = await apiCall('/api/analytics/reports/generate', {
          method: 'POST',
          body: JSON.stringify({
            report_type: 'sales_summary',
            format: 'json',
            date_range: {
              start_date: '2024-01-01',
              end_date: '2024-12-31'
            }
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('report');
        expect(data).toHaveProperty('metadata');
      });
      
      it('should generate report within performance SLA', async () => {
        const startTime = Date.now();
        const { response } = await apiCall('/api/analytics/reports/generate', {
          method: 'POST',
          body: JSON.stringify({
            report_type: 'sales_summary',
            format: 'json',
            date_range: { start_date: '2024-01-01', end_date: '2024-12-31' }
          })
        });
        const duration = Date.now() - startTime;
        
        expect(response.status).toBe(200);
        expect(duration).toBeLessThan(10000); // < 10 seconds SLA
      });
    });
    
    describe('GET /api/analytics/reports', () => {
      it('should list saved reports', async () => {
        const { response, data } = await apiCall('/api/analytics/reports');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('reports');
        expect(Array.isArray(data.reports)).toBe(true);
      });
    });
    
    describe('POST /api/analytics/reports/schedule', () => {
      it('should schedule recurring report', async () => {
        const { response, data } = await apiCall('/api/analytics/reports/schedule', {
          method: 'POST',
          body: JSON.stringify({
            report_type: 'sales_summary',
            frequency: 'weekly',
            format: 'pdf',
            recipients: ['test@example.com']
          })
        });
        
        expect(response.status).toBe(201);
        expect(data).toHaveProperty('schedule_id');
      });
    });
  });
  
  // =============================================================================
  // TASK 5: PREDICTIVE ANALYTICS
  // =============================================================================
  
  describe('Task 5: Predictive Analytics', () => {
    
    describe('GET /api/analytics/forecast/demand', () => {
      it('should generate demand forecast', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/forecast/demand?product_id=1&forecast_days=30'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('forecast');
        expect(Array.isArray(data.forecast)).toBe(true);
        expect(data).toHaveProperty('model_metrics');
        
        if (data.forecast.length > 0) {
          expect(data.forecast[0]).toHaveProperty('date');
          expect(data.forecast[0]).toHaveProperty('predicted_demand');
          expect(data.forecast[0]).toHaveProperty('confidence_interval');
        }
      });
      
      it('should include accuracy metrics', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/forecast/demand?product_id=1&forecast_days=30'
        );
        
        expect(response.status).toBe(200);
        expect(data.model_metrics).toHaveProperty('mae');
        expect(data.model_metrics).toHaveProperty('mape');
        expect(data.model_metrics).toHaveProperty('rmse');
      });
    });
    
    describe('GET /api/analytics/forecast/revenue', () => {
      it('should forecast revenue', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/forecast/revenue?forecast_months=3'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('forecast');
        expect(Array.isArray(data.forecast)).toBe(true);
      });
    });
    
    describe('GET /api/analytics/trends', () => {
      it('should identify trends', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/trends?metric=revenue&period=90'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('trend');
        expect(data.trend).toHaveProperty('direction');
        expect(data.trend).toHaveProperty('strength');
      });
    });
  });
  
  // =============================================================================
  // TASK 6: ANOMALY DETECTION
  // =============================================================================
  
  describe('Task 6: Anomaly Detection', () => {
    
    describe('GET /api/analytics/anomalies/detect', () => {
      it('should detect anomalies', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/anomalies/detect?metric=revenue&lookback_days=90'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('anomalies');
        expect(Array.isArray(data.anomalies)).toBe(true);
        expect(data).toHaveProperty('statistics');
      });
      
      it('should classify anomaly severity', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/anomalies/detect?metric=revenue'
        );
        
        expect(response.status).toBe(200);
        
        if (data.anomalies.length > 0) {
          expect(data.anomalies[0]).toHaveProperty('severity');
          expect(['low', 'medium', 'high', 'critical']).toContain(
            data.anomalies[0].severity
          );
        }
      });
    });
    
    describe('GET /api/analytics/alerts', () => {
      it('should fetch active alerts', async () => {
        const { response, data } = await apiCall('/api/analytics/alerts?status=active');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('alerts');
        expect(Array.isArray(data.alerts)).toBe(true);
      });
    });
    
    describe('POST /api/analytics/alerts/rules', () => {
      it('should create alert rule', async () => {
        const { response, data } = await apiCall('/api/analytics/alerts/rules', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Revenue Drop Alert',
            metric: 'revenue',
            condition: 'below_threshold',
            threshold: 10000,
            severity: 'high'
          })
        });
        
        expect(response.status).toBe(201);
        expect(data).toHaveProperty('rule_id');
      });
    });
  });
  
  // =============================================================================
  // TASK 7: DATA WAREHOUSE & ETL
  // =============================================================================
  
  describe('Task 7: Data Warehouse & ETL', () => {
    
    describe('GET /api/analytics/warehouse/etl/jobs', () => {
      it('should list ETL jobs', async () => {
        const { response, data } = await apiCall('/api/analytics/warehouse/etl/jobs');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('jobs');
        expect(Array.isArray(data.jobs)).toBe(true);
      });
    });
    
    describe('POST /api/analytics/warehouse/etl/jobs', () => {
      it('should trigger ETL job', async () => {
        const { response, data } = await apiCall('/api/analytics/warehouse/etl/jobs', {
          method: 'POST',
          body: JSON.stringify({
            job_name: 'load_fact_sales',
            incremental: true
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('job_id');
        expect(data).toHaveProperty('status');
      });
      
      it('should complete ETL within SLA', async () => {
        const startTime = Date.now();
        const { response, data } = await apiCall('/api/analytics/warehouse/etl/jobs', {
          method: 'POST',
          body: JSON.stringify({
            job_name: 'load_dim_product',
            incremental: true
          })
        });
        
        expect(response.status).toBe(200);
        
        // Note: Full ETL may take longer, but dimension loads should be quick
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(30000); // < 30 seconds for incremental
      });
    });
    
    describe('GET /api/analytics/warehouse/etl/quality', () => {
      it('should fetch data quality metrics', async () => {
        const { response, data } = await apiCall('/api/analytics/warehouse/etl/quality');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('quality_checks');
        expect(data).toHaveProperty('summary');
      });
    });
    
    describe('GET /api/analytics/warehouse/metrics', () => {
      it('should fetch warehouse metrics', async () => {
        const { response, data } = await apiCall('/api/analytics/warehouse/metrics');
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('dimension_counts');
        expect(data).toHaveProperty('fact_counts');
        expect(data).toHaveProperty('health');
      });
    });
  });
  
  // =============================================================================
  // TASK 8: BUSINESS INTELLIGENCE APIs
  // =============================================================================
  
  describe('Task 8: Business Intelligence APIs', () => {
    
    describe('POST /api/analytics/bi/query', () => {
      it('should execute OLAP query', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/query', {
          method: 'POST',
          body: JSON.stringify({
            fact_table: 'sales',
            dimensions: ['product.category', 'time.year'],
            measures: ['SUM(total_amount) as revenue'],
            time_period: {
              start_date: '2024-01-01',
              end_date: '2024-12-31'
            }
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('results');
        expect(data).toHaveProperty('metadata');
        expect(data.metadata).toHaveProperty('execution_time_ms');
      });
      
      it('should support slice operation', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/query', {
          method: 'POST',
          body: JSON.stringify({
            fact_table: 'sales',
            dimensions: ['product.category', 'time.year'],
            measures: ['SUM(total_amount)'],
            filters: { 'product.category': 'Electronics' }
          })
        });
        
        expect(response.status).toBe(200);
        expect(data.results.every((row: any) => 
          row.product_category === 'Electronics'
        )).toBe(true);
      });
      
      it('should meet performance SLA', async () => {
        const startTime = Date.now();
        const { response } = await apiCall('/api/analytics/bi/query', {
          method: 'POST',
          body: JSON.stringify({
            fact_table: 'sales',
            dimensions: ['time.year'],
            measures: ['SUM(total_amount)']
          })
        });
        const duration = Date.now() - startTime;
        
        expect(response.status).toBe(200);
        expect(duration).toBeLessThan(2000); // < 2 seconds typical
      });
    });
    
    describe('POST /api/analytics/bi/pivot', () => {
      it('should generate pivot table', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/pivot', {
          method: 'POST',
          body: JSON.stringify({
            fact_table: 'sales',
            pivot: {
              rows: ['product.category'],
              columns: ['time.year'],
              values: ['total_amount'],
              aggregation: 'SUM'
            }
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('data');
        expect(data).toHaveProperty('column_headers');
        expect(data).toHaveProperty('totals');
      });
    });
    
    describe('POST /api/analytics/bi/cohorts', () => {
      it('should generate customer retention cohort', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/cohorts', {
          method: 'POST',
          body: JSON.stringify({
            cohort_type: 'customer_retention',
            period: 'month',
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('data');
        expect(data.data).toHaveProperty('cohorts');
      });
      
      it('should generate product repurchase cohort', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/cohorts', {
          method: 'POST',
          body: JSON.stringify({
            cohort_type: 'product_repurchase',
            period: 'month',
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          })
        });
        
        expect(response.status).toBe(200);
        expect(data.data).toHaveProperty('products');
      });
    });
    
    describe('POST /api/analytics/bi/funnels', () => {
      it('should generate sales pipeline funnel', async () => {
        const { response, data } = await apiCall('/api/analytics/bi/funnels', {
          method: 'POST',
          body: JSON.stringify({
            funnel_type: 'sales_pipeline',
            start_date: '2024-01-01',
            end_date: '2024-12-31'
          })
        });
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('stages');
        expect(data).toHaveProperty('summary');
        expect(data.summary).toHaveProperty('overall_conversion_rate');
      });
    });
  });
  
  // =============================================================================
  // TASK 9: PRESCRIPTIVE ANALYTICS
  // =============================================================================
  
  describe('Task 9: Prescriptive Analytics', () => {
    
    describe('GET /api/analytics/recommendations/reorder', () => {
      it('should generate reorder recommendations', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/reorder?max_recommendations=10'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('recommendations');
        expect(data).toHaveProperty('summary');
        expect(Array.isArray(data.recommendations)).toBe(true);
      });
      
      it('should classify urgency correctly', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/reorder'
        );
        
        expect(response.status).toBe(200);
        
        if (data.recommendations.length > 0) {
          data.recommendations.forEach((rec: any) => {
            expect(rec).toHaveProperty('urgency');
            expect(['critical', 'high', 'medium', 'low']).toContain(rec.urgency);
            expect(rec).toHaveProperty('recommended_order_qty');
            expect(rec).toHaveProperty('economic_order_qty');
            expect(rec).toHaveProperty('days_until_stockout');
          });
        }
      });
      
      it('should include confidence scores', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/reorder'
        );
        
        expect(response.status).toBe(200);
        
        if (data.recommendations.length > 0) {
          data.recommendations.forEach((rec: any) => {
            expect(rec).toHaveProperty('confidence_score');
            expect(rec.confidence_score).toBeGreaterThanOrEqual(0);
            expect(rec.confidence_score).toBeLessThanOrEqual(1);
          });
        }
      });
    });
    
    describe('GET /api/analytics/recommendations/pricing', () => {
      it('should generate pricing recommendations', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/pricing?strategy=balanced'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('recommendations');
        expect(data).toHaveProperty('strategy');
        expect(data.strategy).toBe('balanced');
      });
      
      it('should support all pricing strategies', async () => {
        const strategies = ['maximize_revenue', 'maximize_volume', 'competitive', 'balanced'];
        
        for (const strategy of strategies) {
          const { response, data } = await apiCall(
            `/api/analytics/recommendations/pricing?strategy=${strategy}`
          );
          
          expect(response.status).toBe(200);
          expect(data.strategy).toBe(strategy);
        }
      });
      
      it('should calculate expected impact', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/pricing?strategy=balanced'
        );
        
        expect(response.status).toBe(200);
        
        if (data.recommendations.length > 0) {
          expect(data.recommendations[0]).toHaveProperty('expected_impact');
          expect(data.recommendations[0].expected_impact).toHaveProperty('revenue_change_pct');
          expect(data.recommendations[0].expected_impact).toHaveProperty('volume_change_pct');
          expect(data.recommendations[0].expected_impact).toHaveProperty('profit_change_pct');
        }
      });
    });
    
    describe('GET /api/analytics/recommendations/routing', () => {
      it('should generate route recommendations', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/routing?optimization_goal=balanced'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('recommendations');
        expect(data).toHaveProperty('optimization_goal');
      });
      
      it('should include route metrics', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/routing'
        );
        
        expect(response.status).toBe(200);
        
        if (data.recommendations.length > 0) {
          expect(data.recommendations[0]).toHaveProperty('metrics');
          expect(data.recommendations[0].metrics).toHaveProperty('total_distance_km');
          expect(data.recommendations[0].metrics).toHaveProperty('total_duration_hours');
          expect(data.recommendations[0].metrics).toHaveProperty('estimated_cost');
        }
      });
    });
    
    describe('GET /api/analytics/recommendations/cost-savings', () => {
      it('should identify cost-saving opportunities', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/cost-savings'
        );
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty('opportunities');
        expect(data).toHaveProperty('summary');
        expect(Array.isArray(data.opportunities)).toBe(true);
      });
      
      it('should quantify potential savings', async () => {
        const { response, data } = await apiCall(
          '/api/analytics/recommendations/cost-savings'
        );
        
        expect(response.status).toBe(200);
        
        if (data.opportunities.length > 0) {
          data.opportunities.forEach((opp: any) => {
            expect(opp).toHaveProperty('current_cost');
            expect(opp).toHaveProperty('potential_savings');
            expect(opp).toHaveProperty('savings_percentage');
            expect(opp).toHaveProperty('implementation_difficulty');
            expect(opp).toHaveProperty('actionable_items');
          });
        }
      });
      
      it('should filter by category', async () => {
        const categories = ['procurement', 'inventory', 'logistics'];
        
        for (const category of categories) {
          const { response, data } = await apiCall(
            `/api/analytics/recommendations/cost-savings?category=${category}`
          );
          
          expect(response.status).toBe(200);
          
          if (data.opportunities.length > 0) {
            expect(data.opportunities.every((opp: any) => 
              opp.category === category
            )).toBe(true);
          }
        }
      });
    });
  });
  
  // =============================================================================
  // PERFORMANCE BENCHMARKS
  // =============================================================================
  
  describe('Performance Benchmarks', () => {
    
    it('Dashboard load time < 2s', async () => {
      const startTime = Date.now();
      const { response } = await apiCall('/api/analytics/dashboard');
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });
    
    it('Report generation < 10s', async () => {
      const startTime = Date.now();
      const { response } = await apiCall('/api/analytics/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          report_type: 'sales_summary',
          format: 'json',
          date_range: { start_date: '2024-01-01', end_date: '2024-12-31' }
        })
      });
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(10000);
    });
    
    it('OLAP query < 2s', async () => {
      const startTime = Date.now();
      const { response } = await apiCall('/api/analytics/bi/query', {
        method: 'POST',
        body: JSON.stringify({
          fact_table: 'sales',
          dimensions: ['time.year'],
          measures: ['SUM(total_amount)']
        })
      });
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });
    
    it('Forecast generation < 5s', async () => {
      const startTime = Date.now();
      const { response } = await apiCall(
        '/api/analytics/forecast/demand?product_id=1&forecast_days=30'
      );
      const duration = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(5000);
    });
  });
  
  // =============================================================================
  // DATA QUALITY & VALIDATION
  // =============================================================================
  
  describe('Data Quality & Validation', () => {
    
    it('should validate data completeness', async () => {
      const { response, data } = await apiCall('/api/analytics/warehouse/etl/quality');
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('summary');
      
      // Data quality should be good (>85%)
      if (data.summary.quality_score !== undefined) {
        expect(data.summary.quality_score).toBeGreaterThanOrEqual(0.85);
      }
    });
    
    it('should detect data anomalies', async () => {
      const { response, data } = await apiCall(
        '/api/analytics/anomalies/detect?metric=revenue'
      );
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('statistics');
      expect(data.statistics).toHaveProperty('mean');
      expect(data.statistics).toHaveProperty('std_dev');
    });
  });
});
