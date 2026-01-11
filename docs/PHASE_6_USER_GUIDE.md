# Phase 6: Analytics & Intelligence - User Guide

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [KPI Management](#kpi-management)
3. [Executive Dashboards](#executive-dashboards)
4. [Advanced Reporting](#advanced-reporting)
5. [Predictive Analytics](#predictive-analytics)
6. [Anomaly Detection](#anomaly-detection)
7. [Business Intelligence](#business-intelligence)
8. [Prescriptive Analytics](#prescriptive-analytics)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Ocean ERP instance running
- Database with populated transaction data
- User account with analytics permissions

### First Steps

1. **Access the Analytics Dashboard**
   ```
   Navigate to: /erp/analytics
   ```

2. **View Your First KPI**
   ```bash
   curl http://localhost:3000/api/analytics/dashboard
   ```

3. **Generate Your First Report**
   ```bash
   curl -X POST http://localhost:3000/api/analytics/reports/generate \
     -H "Content-Type: application/json" \
     -d '{
       "report_type": "sales_summary",
       "format": "json",
       "date_range": {
         "start_date": "2024-01-01",
         "end_date": "2024-12-31"
       }
     }'
   ```

---

## 📊 KPI Management

### What are KPIs?

Key Performance Indicators (KPIs) are measurable values that demonstrate how effectively your business is achieving key objectives.

### Creating a KPI

**Step 1: Define Your KPI**
```bash
curl -X POST http://localhost:3000/api/analytics/kpis \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Revenue",
    "category": "sales",
    "calculation_method": "automatic",
    "target_value": 100000,
    "unit": "USD",
    "formula": "SELECT SUM(total_amount) FROM sales_orders WHERE EXTRACT(MONTH FROM order_date) = EXTRACT(MONTH FROM CURRENT_DATE)"
  }'
```

**Step 2: Monitor KPI Performance**
```bash
curl http://localhost:3000/api/analytics/kpis/calculate?kpi_id=1
```

**Response Example:**
```json
{
  "calculations": [
    {
      "kpi_id": 1,
      "current_value": 95000,
      "target_value": 100000,
      "performance_percentage": 95.0,
      "trend": "up",
      "vs_last_period": 8.5
    }
  ]
}
```

### KPI Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Sales** | Revenue and sales metrics | Revenue, Conversion Rate, Average Order Value |
| **Operations** | Operational efficiency | On-Time Delivery, Production Yield, Cycle Time |
| **Finance** | Financial health | Gross Margin, Net Profit, ROI |
| **Customer** | Customer satisfaction | NPS, Retention Rate, Churn Rate |
| **Inventory** | Stock management | Turnover Rate, Stockout Rate, Carrying Cost |

### Viewing KPI History

Track KPI trends over time:
```bash
curl "http://localhost:3000/api/analytics/kpis/history?kpi_id=1&start_date=2024-01-01&end_date=2024-12-31"
```

---

## 📈 Executive Dashboards

### Default Dashboard

Access the main executive dashboard:
```bash
curl http://localhost:3000/api/analytics/dashboard
```

**What You'll See:**
- 📊 KPI summary cards
- 📉 Trend charts
- 🔔 Recent alerts
- 📊 Top performers/bottom performers

### Creating Custom Dashboards

**Step 1: Design Your Layout**
```bash
curl -X POST http://localhost:3000/api/analytics/dashboards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sales Performance Dashboard",
    "layout": "grid",
    "widgets": [
      {
        "type": "kpi_card",
        "config": { "kpi_id": 1 },
        "position": { "row": 0, "col": 0, "width": 3, "height": 2 }
      },
      {
        "type": "trend_chart",
        "config": { "metric": "revenue", "period": 30 },
        "position": { "row": 0, "col": 3, "width": 6, "height": 4 }
      },
      {
        "type": "alert_list",
        "config": { "severity": ["high", "critical"] },
        "position": { "row": 2, "col": 0, "width": 9, "height": 3 }
      }
    ]
  }'
```

### Widget Types

| Widget Type | Description | Configuration |
|------------|-------------|---------------|
| **kpi_card** | Single KPI display | `{ kpi_id: 1 }` |
| **trend_chart** | Line/bar chart | `{ metric: "revenue", period: 30 }` |
| **pie_chart** | Distribution chart | `{ dimension: "category" }` |
| **alert_list** | Recent alerts | `{ severity: ["high"] }` |
| **table** | Data table | `{ data_source: "top_products" }` |

---

## 📋 Advanced Reporting

### Report Types

#### 1. Sales Summary Report
```bash
curl -X POST http://localhost:3000/api/analytics/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "sales_summary",
    "format": "pdf",
    "date_range": {
      "start_date": "2024-01-01",
      "end_date": "2024-12-31"
    },
    "filters": {
      "region": "North America",
      "category": "Electronics"
    }
  }'
```

#### 2. Inventory Status Report
```bash
curl -X POST http://localhost:3000/api/analytics/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "inventory_status",
    "format": "excel",
    "filters": {
      "warehouse_id": 1,
      "stock_level": "low"
    }
  }'
```

#### 3. Financial Overview Report
```bash
curl -X POST http://localhost:3000/api/analytics/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "financial_overview",
    "format": "csv",
    "date_range": {
      "start_date": "2024-Q1",
      "end_date": "2024-Q4"
    }
  }'
```

### Scheduling Recurring Reports

Set up automated weekly reports:
```bash
curl -X POST http://localhost:3000/api/analytics/reports/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "sales_summary",
    "frequency": "weekly",
    "schedule": "Monday 8:00 AM",
    "format": "pdf",
    "recipients": [
      "ceo@company.com",
      "sales@company.com"
    ],
    "filters": {
      "date_range": "last_week"
    }
  }'
```

### Export Formats

| Format | Use Case | File Size | Best For |
|--------|----------|-----------|----------|
| **JSON** | API integration | Small | Automated processing |
| **PDF** | Presentations | Medium | Executive reports |
| **Excel** | Data analysis | Large | Detailed analysis |
| **CSV** | Import/export | Small | Data transfer |

---

## 🔮 Predictive Analytics

### Demand Forecasting

Predict future product demand:
```bash
curl "http://localhost:3000/api/analytics/forecast/demand?product_id=101&forecast_days=30"
```

**Response:**
```json
{
  "forecast": [
    {
      "date": "2025-01-01",
      "predicted_demand": 45.2,
      "confidence_interval": { "lower": 38.5, "upper": 52.0 }
    },
    {
      "date": "2025-01-02",
      "predicted_demand": 47.8,
      "confidence_interval": { "lower": 40.1, "upper": 55.5 }
    }
  ],
  "model_metrics": {
    "mae": 3.2,
    "mape": 7.5,
    "rmse": 4.1,
    "accuracy": 92.5
  }
}
```

### Understanding Forecast Metrics

| Metric | Meaning | Good Value | Interpretation |
|--------|---------|------------|----------------|
| **MAE** | Mean Absolute Error | < 5% of avg demand | Average prediction error |
| **MAPE** | Mean Absolute Percentage Error | < 10% | Percentage error |
| **RMSE** | Root Mean Square Error | < MAE × 1.5 | Penalizes large errors |
| **Accuracy** | Forecast accuracy | > 85% | Overall reliability |

### Revenue Forecasting

Forecast business revenue:
```bash
curl "http://localhost:3000/api/analytics/forecast/revenue?forecast_months=3"
```

### Trend Analysis

Identify trends in your data:
```bash
curl "http://localhost:3000/api/analytics/trends?metric=revenue&period=90"
```

**Response:**
```json
{
  "trend": {
    "direction": "up",
    "strength": "strong",
    "slope": 2500.5,
    "r_squared": 0.87
  },
  "insights": [
    "Revenue increasing by $2,500 per day on average",
    "Strong upward trend (R² = 0.87)",
    "Seasonal pattern detected: higher on weekends"
  ]
}
```

---

## 🚨 Anomaly Detection

### Detecting Anomalies

Find unusual patterns in your data:
```bash
curl "http://localhost:3000/api/analytics/anomalies/detect?metric=revenue&lookback_days=90"
```

**Response:**
```json
{
  "anomalies": [
    {
      "date": "2024-11-15",
      "metric": "revenue",
      "value": 45000,
      "expected_value": 85000,
      "deviation": -40000,
      "severity": "critical",
      "description": "Revenue 47% below expected"
    }
  ],
  "statistics": {
    "mean": 85000,
    "std_dev": 8500,
    "threshold_upper": 110250,
    "threshold_lower": 59750
  }
}
```

### Creating Alert Rules

Set up automated alerts:
```bash
curl -X POST http://localhost:3000/api/analytics/alerts/rules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Revenue Drop Alert",
    "metric": "revenue",
    "condition": "below_threshold",
    "threshold": 50000,
    "severity": "high",
    "notification_channels": ["email", "slack"],
    "recipients": ["alerts@company.com"]
  }'
```

### Alert Severity Levels

| Severity | Description | Response Time | Example |
|----------|-------------|---------------|---------|
| **Critical** | Immediate action required | < 15 minutes | System down, major revenue drop |
| **High** | Urgent attention needed | < 1 hour | Stockout on bestseller |
| **Medium** | Should be addressed soon | < 4 hours | KPI off target |
| **Low** | Informational | < 24 hours | Minor variance |

---

## 🧠 Business Intelligence

### OLAP Queries

Perform multi-dimensional analysis:

**Example 1: Revenue by Category and Year**
```bash
curl -X POST http://localhost:3000/api/analytics/bi/query \
  -H "Content-Type: application/json" \
  -d '{
    "fact_table": "sales",
    "dimensions": ["product.category", "time.year", "customer.region"],
    "measures": [
      "SUM(total_amount) as revenue",
      "COUNT(*) as orders",
      "AVG(margin_percentage) as avg_margin"
    ],
    "filters": {
      "time.year": "2024"
    },
    "order_by": ["revenue DESC"],
    "limit": 100
  }'
```

**Example 2: Drill-Down Analysis**
```bash
# Start high-level
curl -X POST http://localhost:3000/api/analytics/bi/query \
  -d '{ "dimensions": ["product.category"], "measures": ["SUM(total_amount)"] }'

# Drill down to subcategory
curl -X POST http://localhost:3000/api/analytics/bi/query \
  -d '{ 
    "dimensions": ["product.category", "product.subcategory"], 
    "measures": ["SUM(total_amount)"],
    "filters": { "product.category": "Electronics" }
  }'

# Drill down to product
curl -X POST http://localhost:3000/api/analytics/bi/query \
  -d '{ 
    "dimensions": ["product.name"], 
    "measures": ["SUM(total_amount)"],
    "filters": { "product.subcategory": "Laptops" }
  }'
```

### Pivot Tables

Create dynamic pivot tables:
```bash
curl -X POST http://localhost:3000/api/analytics/bi/pivot \
  -H "Content-Type: application/json" \
  -d '{
    "fact_table": "sales",
    "pivot": {
      "rows": ["product.category"],
      "columns": ["time.year_quarter"],
      "values": ["total_amount"],
      "aggregation": "SUM"
    }
  }'
```

**Result:**
```
Category        | 2024-Q1 | 2024-Q2 | 2024-Q3 | 2024-Q4 | Total
----------------|---------|---------|---------|---------|--------
Electronics     | 125,000 | 145,000 | 132,000 | 180,000 | 582,000
Furniture       |  85,000 |  92,000 |  88,000 | 110,000 | 375,000
Office Supplies |  42,000 |  48,000 |  45,000 |  55,000 | 190,000
----------------|---------|---------|---------|---------|--------
Total           | 252,000 | 285,000 | 265,000 | 345,000 |1,147,000
```

### Cohort Analysis

Track customer behavior over time:

**Customer Retention**
```bash
curl -X POST http://localhost:3000/api/analytics/bi/cohorts \
  -H "Content-Type: application/json" \
  -d '{
    "cohort_type": "customer_retention",
    "period": "month",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "metric": "retention_rate"
  }'
```

**Interpretation:**
```
Cohort    | Month 0 | Month 1 | Month 2 | Month 3 | Month 6
----------|---------|---------|---------|---------|--------
2024-01   | 100%    | 75%     | 60%     | 55%     | 45%
2024-02   | 100%    | 78%     | 65%     | 58%     | -
2024-03   | 100%    | 80%     | 68%     | -       | -
```

**Insights:**
- 60% of customers return within 2 months
- 45% remain active after 6 months
- Retention improving: 2024-03 cohort performing better

### Funnel Analysis

Track conversion through stages:
```bash
curl -X POST http://localhost:3000/api/analytics/bi/funnels \
  -H "Content-Type: application/json" \
  -d '{
    "funnel_type": "sales_pipeline",
    "start_date": "2024-01-01",
    "end_date": "2024-12-31"
  }'
```

**Result:**
```
Stage         | Count  | Conversion | Dropoff
--------------|--------|------------|--------
Leads         | 10,000 | 100.0%     | -
Quotations    |  4,500 |  45.0%     | 5,500 (55%)
Orders        |  2,700 |  60.0%     | 1,800 (40%)
Completed     |  2,400 |  88.9%     |   300 (11%)
--------------|--------|------------|--------
Overall       |  2,400 |  24.0%     | 7,600 (76%)
```

---

## 🎯 Prescriptive Analytics

### Inventory Reorder Recommendations

Get AI-powered reorder suggestions:
```bash
curl "http://localhost:3000/api/analytics/recommendations/reorder?max_recommendations=20"
```

**Response:**
```json
{
  "recommendations": [
    {
      "product_id": 101,
      "product_name": "Dell Latitude 5420",
      "current_stock": 5,
      "reorder_point": 25,
      "recommended_order_qty": 60,
      "urgency": "high",
      "days_until_stockout": 3,
      "estimated_cost": 45000,
      "confidence_score": 0.9
    }
  ],
  "summary": {
    "critical_count": 2,
    "high_count": 5,
    "total_estimated_cost": 245000
  }
}
```

**Action:** Create purchase order directly:
```bash
curl -X POST http://localhost:3000/api/analytics/recommendations/reorder \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 101,
    "quantity": 60,
    "supplier_id": 42,
    "notes": "Urgent reorder - high demand"
  }'
```

### Dynamic Pricing Recommendations

Optimize product pricing:
```bash
curl "http://localhost:3000/api/analytics/recommendations/pricing?strategy=balanced&category=Electronics"
```

**Pricing Strategies:**

1. **Maximize Revenue** - Increase prices on inelastic products
2. **Maximize Volume** - Discount to drive sales
3. **Competitive** - Match or beat market prices
4. **Balanced** - Optimize for profitability (default)

**Example Response:**
```json
{
  "recommendations": [
    {
      "product_id": 205,
      "product_name": "Logitech MX Master 3",
      "current_price": 99.99,
      "recommended_price": 94.99,
      "price_change_pct": -5.0,
      "expected_impact": {
        "revenue_change_pct": 1.2,
        "volume_change_pct": 6.5,
        "profit_change_pct": 3.8
      },
      "rationale": "High inventory + competitive pressure justifies price reduction"
    }
  ]
}
```

**Apply Recommendation:**
```bash
curl -X POST http://localhost:3000/api/analytics/recommendations/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 205,
    "new_price": 94.99,
    "effective_date": "2025-01-01",
    "notes": "Competitive adjustment based on AI recommendation"
  }'
```

### Routing Optimization

Optimize delivery routes:
```bash
curl "http://localhost:3000/api/analytics/recommendations/routing?optimization_goal=balanced&max_stops=8"
```

**Response:**
```json
{
  "recommendations": [
    {
      "route_id": "ROUTE-001",
      "origin": { "location_name": "Main Warehouse" },
      "stops": [
        { "stop_number": 1, "city": "Oakland", "shipment_ids": [1001, 1002] },
        { "stop_number": 2, "city": "San Jose", "shipment_ids": [1003] }
      ],
      "metrics": {
        "total_distance_km": 145.8,
        "total_duration_hours": 4.5,
        "estimated_cost": 247.90
      },
      "recommended_carrier": {
        "carrier_name": "FedEx Ground",
        "estimated_cost": 235.00
      }
    }
  ]
}
```

### Cost-Saving Opportunities

Identify ways to reduce costs:
```bash
curl "http://localhost:3000/api/analytics/recommendations/cost-savings?category=inventory"
```

**Response:**
```json
{
  "opportunities": [
    {
      "opportunity_id": "INV-EXCESS-1",
      "title": "Excess Inventory Reduction",
      "description": "8 products with >6 months supply",
      "current_cost": 125000,
      "potential_savings": 75000,
      "savings_percentage": 60.0,
      "implementation_difficulty": "medium",
      "actionable_items": [
        "Implement promotional pricing",
        "Reduce reorder quantities",
        "Improve demand forecasting"
      ]
    }
  ],
  "summary": {
    "total_potential_savings": 327000
  }
}
```

---

## ✅ Best Practices

### 1. KPI Management

**DO:**
- ✅ Define clear, measurable KPIs
- ✅ Set realistic targets based on historical data
- ✅ Review KPIs weekly
- ✅ Track trends over time
- ✅ Align KPIs with business objectives

**DON'T:**
- ❌ Track too many KPIs (focus on top 10)
- ❌ Set arbitrary targets without data
- ❌ Ignore negative trends
- ❌ Make KPIs too complex

### 2. Forecasting

**DO:**
- ✅ Use at least 90 days of historical data
- ✅ Consider seasonality
- ✅ Monitor forecast accuracy (MAPE < 10%)
- ✅ Update forecasts regularly
- ✅ Account for external factors (promotions, holidays)

**DON'T:**
- ❌ Forecast with insufficient data
- ❌ Ignore accuracy metrics
- ❌ Treat forecasts as guarantees
- ❌ Forget to validate predictions

### 3. Anomaly Detection

**DO:**
- ✅ Set appropriate thresholds (2-3 standard deviations)
- ✅ Investigate critical anomalies immediately
- ✅ Document root causes
- ✅ Adjust rules based on feedback
- ✅ Use multiple detection methods

**DON'T:**
- ❌ Set overly sensitive thresholds (too many false positives)
- ❌ Ignore repeated anomalies
- ❌ Disable alerts without investigation
- ❌ Rely solely on automated detection

### 4. Recommendations

**DO:**
- ✅ Review high-confidence recommendations first (>0.8)
- ✅ Test recommendations on small scale
- ✅ Track actual vs. predicted outcomes
- ✅ Adjust based on results
- ✅ Consider business context

**DON'T:**
- ❌ Blindly accept all recommendations
- ❌ Ignore low-confidence warnings
- ❌ Implement too many changes at once
- ❌ Forget to measure impact

---

## 🔧 Troubleshooting

### Common Issues

#### Issue 1: "No data returned"
**Cause:** Insufficient historical data  
**Solution:**
- Check date range: ensure transactions exist in period
- Verify ETL jobs completed: `GET /api/analytics/warehouse/metrics`
- Run data quality check: `GET /api/analytics/warehouse/etl/quality`

#### Issue 2: "Forecast accuracy is low (MAPE > 20%)"
**Cause:** Volatile demand or insufficient data  
**Solution:**
- Increase historical period (90 → 180 days)
- Check for data quality issues
- Consider external factors (seasonality, promotions)
- Try different forecasting model

#### Issue 3: "Too many anomaly alerts"
**Cause:** Thresholds too sensitive  
**Solution:**
- Increase threshold (e.g., 2σ → 3σ)
- Adjust seasonality settings
- Filter by severity (only critical/high)
- Review alert rules for relevance

#### Issue 4: "Recommendations seem incorrect"
**Cause:** Low confidence score or data quality  
**Solution:**
- Check confidence score (should be > 0.7)
- Verify input data accuracy
- Review business assumptions
- Test on known scenarios

#### Issue 5: "API performance is slow"
**Cause:** Large data volumes or complex queries  
**Solution:**
- Add filters to reduce data scope
- Use pagination for large result sets
- Check ETL job status
- Verify database indexes exist
- Consider increasing server resources

### Performance Optimization

| Scenario | Current | Optimized | How |
|----------|---------|-----------|-----|
| Dashboard load | 5s | <2s | Add caching, reduce widgets |
| Report generation | 30s | <10s | Pre-aggregate data, use filters |
| OLAP query | 10s | <2s | Add indexes, limit dimensions |
| Forecast | 15s | <5s | Cache recent forecasts |

### Getting Help

**Documentation:**
- Task-specific docs: `/PHASE_6_TASK_X_COMPLETE.md`
- API reference: `/docs/api/phase6-openapi.yaml`
- Integration tests: `/packages/tests/phase6-integration.test.ts`

**Support:**
- GitHub Issues: For bugs and feature requests
- Email: support@ocean-erp.com
- Slack: #analytics channel

---

## 📚 Additional Resources

### Sample Workflows

**Weekly Executive Review:**
1. Check dashboard for KPI status
2. Review critical alerts
3. Generate weekly sales report
4. Review inventory recommendations
5. Act on high-urgency items

**Monthly Business Review:**
1. Generate comprehensive reports (sales, inventory, financial)
2. Analyze trends and forecasts
3. Review cost-saving opportunities
4. Update KPI targets if needed
5. Schedule follow-up actions

**Quarterly Planning:**
1. Run 90-day forecasts
2. Analyze cohort retention
3. Review funnel conversion rates
4. Implement pricing optimizations
5. Plan inventory strategy

### API Examples Collection

See `/docs/api/examples/` for:
- Postman collection
- Python scripts
- JavaScript/TypeScript examples
- cURL commands
- Integration patterns

### Video Tutorials

Coming soon:
- Getting Started with Analytics (10 min)
- KPI Management Deep Dive (20 min)
- Forecasting Best Practices (15 min)
- Advanced BI Queries (25 min)
- Prescriptive Analytics Workshop (30 min)

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Phase 6 Completion:** 100%
