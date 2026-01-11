# Phase 6: Analytics & Intelligence - Quick Reference Guide

**Ocean ERP Analytics System**  
**Version:** 1.0 | **Date:** December 3, 2025

---

## 🚀 Quick Start

### Core Capabilities
1. **Real-time KPIs** - Track key metrics across all operations
2. **Executive Dashboards** - Configurable widgets and charts
3. **Automated Reports** - Scheduled email delivery
4. **Demand Forecasting** - Predict product demand 90 days ahead
5. **Revenue Projections** - Financial forecasting
6. **Anomaly Detection** - Auto-detect unusual patterns

---

## 📊 API Endpoints Summary

### KPIs & Metrics (7 endpoints)
```bash
# List all KPIs with latest values
GET /api/analytics/kpis?include_metrics=true

# Calculate KPIs for today
POST /api/analytics/kpis/calculate
{
  "start_date": "2025-12-03",
  "end_date": "2025-12-03"
}

# Get KPI historical trend (30 days)
GET /api/analytics/kpis/[id]/history?start_date=2025-11-03&end_date=2025-12-03

# Get all active alerts
GET /api/analytics/alerts?is_resolved=false&severity=critical

# Resolve an alert
PATCH /api/analytics/alerts/[id]/resolve
{
  "resolved_by": 1,
  "resolution_notes": "Issue fixed by restarting service"
}
```

### Dashboards (4 endpoints)
```bash
# List all dashboards
GET /api/analytics/dashboards?include_widgets=true

# Create new dashboard
POST /api/analytics/dashboards
{
  "dashboard_code": "sales_daily",
  "dashboard_name": "Daily Sales Dashboard",
  "dashboard_type": "sales",
  "widgets": [
    {
      "widget_code": "revenue_card",
      "widget_name": "Today's Revenue",
      "widget_type": "kpi_card",
      "data_source_type": "kpi",
      "kpi_id": 1,
      "grid_position_x": 0,
      "grid_position_y": 0,
      "grid_width": 3,
      "grid_height": 2
    }
  ]
}

# Get real-time dashboard data
GET /api/analytics/dashboards/[id]/data?start_date=2025-11-03&end_date=2025-12-03

# Add widget to dashboard
POST /api/analytics/dashboards/[id]/widgets
{
  "widget_code": "orders_chart",
  "widget_name": "Orders Trend",
  "widget_type": "chart_line",
  "data_source_type": "query",
  "query_sql": "SELECT DATE(created_at) as date, COUNT(*) as orders FROM sales_orders GROUP BY date",
  "widget_config": {
    "chartType": "line",
    "xAxis": "date",
    "yAxis": "orders"
  }
}
```

### Reports (5 endpoints)
```bash
# List all reports
GET /api/analytics/reports

# Create report template
POST /api/analytics/reports
{
  "report_code": "sales_monthly",
  "report_name": "Monthly Sales Report",
  "report_category": "sales",
  "query_sql": "SELECT * FROM sales_orders WHERE DATE(created_at) BETWEEN :start_date AND :end_date",
  "report_format": "pdf",
  "parameters": {
    "start_date": { "type": "date", "required": true },
    "end_date": { "type": "date", "required": true }
  }
}

# Generate report (preview)
GET /api/analytics/reports/[id]/generate?start_date=2025-11-01&end_date=2025-11-30&limit=100

# Generate report (full with file)
POST /api/analytics/reports/[id]/generate
{
  "parameters": {
    "start_date": "2025-11-01",
    "end_date": "2025-11-30"
  },
  "output_format": "excel",
  "executed_by": 1
}

# Schedule report
POST /api/analytics/reports/[id]/schedule
{
  "schedule_name": "Monthly Sales - Auto",
  "schedule_frequency": "monthly",
  "schedule_day_of_month": 1,
  "schedule_time": "08:00",
  "parameters": {
    "start_date": "first_day_last_month",
    "end_date": "last_day_last_month"
  },
  "output_format": "pdf",
  "email_recipients": ["cfo@company.com", "sales@company.com"],
  "email_subject": "Monthly Sales Report - {{month}}",
  "email_body": "Please find attached the monthly sales report."
}

# Get execution history
GET /api/analytics/reports/executions?status=completed&limit=20
```

### Forecasting (4 endpoints)
```bash
# List forecast models
GET /api/analytics/forecasts/models

# Generate demand forecast
POST /api/analytics/forecasts/demand
{
  "product_ids": [1, 2, 3],
  "forecast_horizon_days": 90,
  "model_type": "linear_regression",
  "training_period_days": 365
}

# Generate revenue forecast
POST /api/analytics/forecasts/revenue
{
  "forecast_horizon_days": 30,
  "model_type": "exponential_smoothing",
  "training_period_days": 180
}

# Check forecast accuracy
GET /api/analytics/forecasts/[model_id]/accuracy?start_date=2025-09-01&end_date=2025-12-01
```

### Anomaly Detection (3 endpoints)
```bash
# List detected anomalies
GET /api/analytics/anomalies?is_resolved=false&severity=critical

# Run anomaly detection
POST /api/analytics/anomalies/detect
{
  "start_date": "2025-11-26",
  "end_date": "2025-12-03"
}

# Investigate and resolve anomaly
PATCH /api/analytics/anomalies/[id]
{
  "is_investigated": true,
  "investigation_notes": "Analyzed data and found marketing campaign caused spike",
  "root_cause": "Black Friday promotion",
  "is_resolved": true,
  "resolution_action": "Expected behavior - marked as resolved",
  "investigated_by": 1,
  "resolved_by": 1
}

# Mark as false positive
PATCH /api/analytics/anomalies/[id]
{
  "is_false_positive": true,
  "false_positive_reason": "Testing data - not real anomaly"
}
```

---

## 📈 Common Use Cases

### 1. Daily Executive Dashboard
```javascript
// Create executive dashboard
const dashboard = {
  dashboard_code: "exec_daily",
  dashboard_name: "Executive Dashboard",
  dashboard_type: "executive",
  refresh_interval_seconds: 300,
  widgets: [
    {
      widget_code: "revenue_today",
      widget_name: "Today's Revenue",
      widget_type: "kpi_card",
      data_source_type: "kpi",
      kpi_id: 1, // revenue_daily KPI
      grid_position_x: 0,
      grid_position_y: 0,
      grid_width: 3,
      grid_height: 2
    },
    {
      widget_code: "orders_today",
      widget_name: "Orders Today",
      widget_type: "kpi_card",
      data_source_type: "kpi",
      kpi_id: 2, // orders_daily KPI
      grid_position_x: 3,
      grid_position_y: 0,
      grid_width: 3,
      grid_height: 2
    },
    {
      widget_code: "revenue_trend",
      widget_name: "30-Day Revenue Trend",
      widget_type: "chart_line",
      data_source_type: "query",
      query_sql: `
        SELECT DATE(created_at) as date, SUM(total_amount) as revenue
        FROM sales_orders
        WHERE status = 'completed'
          AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
      grid_position_x: 0,
      grid_position_y: 2,
      grid_width: 6,
      grid_height: 4
    }
  ]
};

// POST to /api/analytics/dashboards
```

### 2. Automated Weekly Sales Report
```javascript
// Create and schedule report
const report = {
  report_code: "sales_weekly",
  report_name: "Weekly Sales Summary",
  report_category: "sales",
  query_sql: `
    SELECT 
      customer_name,
      COUNT(*) as order_count,
      SUM(total_amount) as total_revenue,
      AVG(total_amount) as avg_order_value
    FROM sales_orders
    WHERE DATE(created_at) BETWEEN :start_date AND :end_date
      AND status IN ('completed', 'shipped')
    GROUP BY customer_name
    ORDER BY total_revenue DESC
  `,
  report_format: "excel"
};

// POST to /api/analytics/reports
// Then schedule:
const schedule = {
  schedule_name: "Weekly Sales - Every Monday",
  schedule_frequency: "weekly",
  schedule_day_of_week: 1, // Monday
  schedule_time: "09:00",
  parameters: {
    start_date: "last_week_monday",
    end_date: "last_week_sunday"
  },
  email_recipients: ["sales@company.com", "manager@company.com"],
  email_subject: "Weekly Sales Report",
  email_body: "Attached is your weekly sales summary."
};

// POST to /api/analytics/reports/[id]/schedule
```

### 3. Product Demand Forecasting
```javascript
// Generate 90-day forecast for top products
const forecast = await fetch('/api/analytics/forecasts/demand', {
  method: 'POST',
  body: JSON.stringify({
    product_ids: [101, 102, 103, 104, 105],
    forecast_horizon_days: 90,
    model_type: 'linear_regression',
    training_period_days: 365
  })
});

// Result includes daily forecasts with confidence intervals
// Use for inventory planning, procurement, production scheduling
```

### 4. Anomaly Monitoring
```javascript
// Set up hourly anomaly detection (cron job)
const checkAnomalies = async () => {
  const result = await fetch('/api/analytics/anomalies/detect', {
    method: 'POST',
    body: JSON.stringify({
      start_date: getYesterday(),
      end_date: getToday()
    })
  });
  
  const { anomalies } = await result.json();
  
  // Send alerts for critical anomalies
  const critical = anomalies.filter(a => a.severity === 'critical');
  if (critical.length > 0) {
    await sendSlackAlert(critical);
    await sendEmailAlert(critical);
  }
};

// Schedule: every hour
```

---

## 🎯 Pre-configured KPIs

| KPI Code | Name | Target | Good | Formula |
|----------|------|--------|------|---------|
| `revenue_daily` | Daily Revenue | $50,000 | >= | SUM(total_amount) |
| `orders_daily` | Daily Orders | 100 | >= | COUNT(*) |
| `avg_order_value` | Avg Order Value | $500 | >= | AVG(total_amount) |
| `on_time_delivery` | On-Time Delivery % | 95% | >= | (on_time / total) × 100 |
| `inventory_turnover` | Inventory Turnover | 6 | >= | COGS / Avg Inventory |
| `gross_margin` | Gross Margin % | 40% | >= | (Revenue - COGS) / Revenue × 100 |
| `customer_acquisition` | New Customers | 10/day | >= | COUNT(DISTINCT new) |
| `defect_rate` | Defect Rate % | 2% | <= | (rejected / total) × 100 |
| `production_efficiency` | Production Efficiency % | 90% | >= | (actual / planned) × 100 |
| `stockout_rate` | Stockout Rate % | 5% | <= | (out_of_stock / total) × 100 |

---

## 🔧 Statistical Models

### Moving Average
- **Best for:** Stable patterns, short-term forecasts
- **Window:** 7 days (default)
- **Formula:** `Forecast = Average(last N values)`
- **Use case:** Weekly sales forecasting

### Exponential Smoothing
- **Best for:** Trends, adapting to changes
- **Alpha (α):** 0.3 (weight for recent data)
- **Formula:** `St = α × Yt + (1-α) × St-1`
- **Use case:** Demand with seasonal patterns

### Linear Regression
- **Best for:** Growth/decline trends
- **Formula:** `y = mx + b`
- **Calculates:** Slope and intercept from historical data
- **Use case:** Revenue projections, long-term planning

### Confidence Intervals
- **Level:** 95% (default)
- **Formula:** `[forecast ± 1.96 × σ]`
- **Interpretation:** 95% chance actual value falls within range

---

## 🚨 Anomaly Detection Methods

### Z-Score (Standard Deviation)
```
z = (x - μ) / σ
Threshold: |z| > 3.0
```
- Detects: Statistical outliers
- Good for: Normal distributions
- Sensitivity: High = 2.5, Medium = 3.0, Low = 3.5

### IQR (Interquartile Range)
```
IQR = Q3 - Q1
Outlier: x < Q1 - 1.5×IQR or x > Q3 + 1.5×IQR
```
- Detects: Robust outliers
- Good for: Non-normal distributions
- Sensitivity: Multiplier 1.5 (default)

### Threshold
```
Alert if: value > threshold
```
- Detects: Known limit breaches
- Good for: Budget constraints, capacity limits
- Sensitivity: User-defined threshold

### Moving Average Deviation
```
deviation = |current - moving_average|
Alert if: deviation > sensitivity × σ
```
- Detects: Trend breaks, pattern changes
- Good for: Time-series data
- Sensitivity: Low = 2.5σ, Medium = 2.0σ, High = 1.5σ

---

## 📊 Dashboard Widget Types

| Widget Type | Data Source | Use Case |
|-------------|-------------|----------|
| `kpi_card` | KPI | Single metric display with variance |
| `chart_line` | Query/KPI | Trend over time |
| `chart_bar` | Query | Comparisons (e.g., sales by product) |
| `chart_pie` | Query | Distribution (e.g., revenue by region) |
| `chart_area` | Query | Volume over time |
| `table` | Query | Detailed data lists |
| `gauge` | KPI | Progress toward target |
| `sparkline` | KPI | Inline trend indicator |
| `trend` | KPI | Up/down/stable with percentage |
| `scorecard` | Multiple KPIs | Executive summary |

---

## ⚡ Performance Tips

### Dashboard Optimization
- Use `include_widgets=true` only when needed
- Set appropriate `refresh_interval_seconds` (300-600s)
- Use materialized views for complex aggregations
- Cache static reference data

### Report Performance
- Add `LIMIT` to preview queries
- Use indexed columns in WHERE clauses
- Parameterize dates for reusability
- Schedule heavy reports during off-hours

### Forecast Efficiency
- Limit `training_period_days` for faster processing
- Batch forecast multiple products in one request
- Use simple models (moving average) for daily updates
- Save complex models (linear regression) for weekly runs

### Anomaly Detection
- Start with threshold method for known limits
- Use Z-score for continuous monitoring
- Set appropriate sensitivity (don't over-alert)
- Schedule detection during low-traffic periods

---

## 🔐 Security & Access

### Role-Based Access
- **Executive:** View all dashboards and reports
- **Manager:** View department-specific analytics
- **Analyst:** Create reports and forecasts
- **User:** View assigned dashboards only

### API Authentication
All endpoints require authentication token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/analytics/kpis
```

---

## 🆘 Troubleshooting

### KPI Calculation Fails
- Check SQL syntax in `calculation_method`
- Verify data source table exists
- Ensure date parameters are correct format

### Dashboard Not Loading
- Check browser console for errors
- Verify widget `query_sql` is valid
- Test query directly in database

### Forecast Accuracy Low
- Increase `training_period_days`
- Try different `model_type`
- Check for data quality issues (gaps, outliers)
- Review actual values are being updated

### Too Many Anomalies
- Reduce sensitivity level
- Increase threshold values
- Mark false positives to improve learning
- Consider seasonal adjustments

---

## 📞 Support

**Documentation:** `/PHASE_6_COMPLETE.md`  
**API Reference:** Coming soon (OpenAPI specs)  
**Issue Reporting:** GitHub Issues  
**Feature Requests:** Product team

---

**Last Updated:** December 3, 2025  
**Version:** 1.0  
**Phase 6 Status:** Core Complete ✅
