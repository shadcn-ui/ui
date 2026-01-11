# Phase 2: Quick Reference Guide

⚡ **Quick access to Phase 2 features, APIs, and common tasks**

---

## 🚀 Quick Start

### Access UI Dashboards

```
Gantt Scheduler:    /erp/operations/manufacturing/scheduler
MPS Planning:       /erp/operations/manufacturing/mps
Capacity Monitor:   /erp/operations/manufacturing/capacity
```

### Base API URL

```
http://localhost:4000/api/operations/
```

---

## 📊 API Quick Reference

### Capacity Planning

```bash
# Calculate capacity
GET /capacity/workstations?workstation_id={uuid}&date={YYYY-MM-DD}

# Create allocation
POST /capacity/allocations
Body: { workstation_id, allocation_date, available_minutes, allocated_minutes }

# Get utilization
GET /capacity/utilization?start_date={date}&end_date={date}

# Check conflicts
GET /capacity/conflicts?schedule_id={id}&severity={high|medium|low}
```

### Production Scheduling

```bash
# Create schedule
POST /schedules
Body: { schedule_name, start_date, end_date, work_order_ids[] }

# Auto-schedule
POST /schedules/{id}/auto-schedule
Body: { method: "forward"|"backward", consider_capacity: true }

# Get Gantt data
GET /schedules/{id}/gantt

# Update assignment
PATCH /schedules/{id}/assignments
Body: { assignment_id, updates: { scheduled_start_time, ... } }
```

### Demand Forecasting

```bash
# Generate forecast
GET /forecasting/generate?product_id={id}&method={auto|sma|es|lr}&forecast_periods=12

# Save forecast
POST /forecasting/generate
Body: { product_id, forecast_name, method, forecast_periods }

# Check accuracy
GET /forecasting/accuracy?forecast_id={id}
```

---

## 🔧 Common SQL Queries

### Check Capacity Utilization

```sql
SELECT 
  w.name,
  w.code,
  SUM(ca.allocated_minutes) AS allocated,
  SUM(ca.available_minutes) AS available,
  ROUND(AVG(ca.utilization_percentage), 2) AS avg_utilization
FROM capacity_allocations ca
JOIN workstations w ON w.id = ca.workstation_id
WHERE ca.allocation_date >= CURRENT_DATE - 7
GROUP BY w.id, w.name, w.code
ORDER BY avg_utilization DESC;
```

### View Schedule Progress

```sql
SELECT 
  ps.schedule_name,
  COUNT(sa.id) AS total_assignments,
  SUM(CASE WHEN wo.status = 'completed' THEN 1 ELSE 0 END) AS completed,
  SUM(CASE WHEN wo.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
  ROUND(
    SUM(CASE WHEN wo.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(sa.id),
    2
  ) AS completion_pct
FROM production_schedules ps
JOIN schedule_assignments sa ON sa.schedule_id = ps.id
JOIN work_orders wo ON wo.id = sa.work_order_id
WHERE ps.id = 5
GROUP BY ps.id, ps.schedule_name;
```

### Find Bottlenecks

```sql
SELECT 
  w.name,
  w.code,
  ROUND(AVG(ca.utilization_percentage), 2) AS avg_utilization,
  COUNT(CASE WHEN ca.utilization_percentage >= 100 THEN 1 END) AS overloaded_days
FROM capacity_allocations ca
JOIN workstations w ON w.id = ca.workstation_id
WHERE ca.allocation_date >= CURRENT_DATE - 30
GROUP BY w.id, w.name, w.code
HAVING AVG(ca.utilization_percentage) >= 85
ORDER BY avg_utilization DESC;
```

### Explode BOM

```sql
-- Get all components for a product
SELECT * FROM explode_bom_multilevel(
  (SELECT id FROM bill_of_materials WHERE product_code = 'YOUR-SKU'),
  10  -- max 10 levels
);
```

### Check Forecast Accuracy

```sql
SELECT 
  df.forecast_name,
  df.forecast_method,
  COUNT(dfd.id) AS data_points,
  ROUND(AVG(ABS(dfd.forecast_quantity - dfd.actual_quantity)), 2) AS mae,
  ROUND(
    AVG(ABS(dfd.forecast_quantity - dfd.actual_quantity) / NULLIF(dfd.actual_quantity, 0)) * 100,
    2
  ) AS mape
FROM demand_forecasts df
JOIN demand_forecast_details dfd ON dfd.forecast_id = df.id
WHERE dfd.actual_quantity IS NOT NULL
AND df.product_id = 123
GROUP BY df.id, df.forecast_name, df.forecast_method;
```

---

## 🎯 Decision Tables

### Choose Forecasting Method

| Demand Pattern | Best Method | Parameters |
|----------------|-------------|------------|
| Stable, no trend | SMA | periods: 6-12 |
| Strong upward/downward trend | Linear Regression | periods: 12-18 |
| Some variability | Exponential Smoothing | alpha: 0.2-0.3 |
| Highly erratic | Exponential Smoothing | alpha: 0.1-0.2 |
| Unknown/Mixed | Auto | Let system choose |

### Interpret Utilization

| Utilization % | Status | Color | Action |
|---------------|--------|-------|--------|
| ≥100% | Overloaded | 🔴 Red | Immediate action: reassign work |
| 85-99% | High | 🟠 Orange | Monitor closely, prepare backup |
| 60-84% | Optimal | 🟢 Green | Maintain current load |
| 30-59% | Low | 🔵 Blue | Can add more work |
| <30% | Idle | ⚪ Gray | Reassign resource or add work |

### Forecast Accuracy Rating

| MAPE % | Rating | Interpretation | Action |
|--------|--------|----------------|--------|
| <10% | Excellent | Highly accurate | Use confidently |
| 10-20% | Good | Reliable for planning | Safe to use |
| 20-30% | Fair | Use with caution | Monitor closely |
| >30% | Poor | Not reliable | Review method/data |

### Choose Scheduling Method

| Scenario | Method | Capacity | Optimize For |
|----------|--------|----------|--------------|
| Make-to-Stock | Forward | Finite | Earliest completion |
| Make-to-Order | Backward | Finite | Meet due date |
| Capacity planning | Forward | Infinite | Show true demand |
| Rush orders | Forward | Finite | Resource utilization |

---

## 📋 Common Tasks

### Task 1: Create and Schedule Production

```bash
# 1. Create schedule
curl -X POST http://localhost:4000/api/operations/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_name": "Week 49",
    "start_date": "2025-12-02",
    "end_date": "2025-12-08",
    "work_order_ids": [101, 102, 103]
  }'

# 2. Auto-schedule
curl -X POST http://localhost:4000/api/operations/schedules/5/auto-schedule \
  -H "Content-Type: application/json" \
  -d '{
    "method": "forward",
    "consider_capacity": true,
    "optimize_for": "earliest_completion"
  }'

# 3. View in Gantt
# Go to: /erp/operations/manufacturing/scheduler
```

### Task 2: Monitor and Resolve Bottlenecks

```bash
# 1. Check utilization
curl "http://localhost:4000/api/operations/capacity/utilization?start_date=2025-11-02&end_date=2025-12-02"

# 2. Identify bottlenecks (≥85% utilization)
# Response shows which workstations are overloaded

# 3. Find alternatives
curl "http://localhost:4000/api/operations/capacity/workstations"

# 4. Reassign via scheduler UI or API
curl -X PATCH http://localhost:4000/api/operations/schedules/5/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "assignment_id": 10,
    "updates": {
      "workstation_id": "new-uuid"
    }
  }'
```

### Task 3: Generate and Monitor Forecast

```bash
# 1. Generate forecast with auto-method
curl "http://localhost:4000/api/operations/forecasting/generate?product_id=123&method=auto&forecast_periods=12"

# 2. Save forecast
curl -X POST http://localhost:4000/api/operations/forecasting/generate \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 123,
    "forecast_name": "December Forecast",
    "method": "auto",
    "forecast_periods": 12,
    "created_by": 1
  }'

# 3. Check accuracy after period ends
curl "http://localhost:4000/api/operations/forecasting/accuracy?forecast_id=45"
```

### Task 4: Create MPS for Product Family

```bash
# 1. Create family
curl -X POST http://localhost:4000/api/operations/mps/product-families \
  -H "Content-Type: application/json" \
  -d '{
    "family_name": "Laptops",
    "family_code": "LAPTOP"
  }'

# 2. Add members
curl -X POST http://localhost:4000/api/operations/mps/product-families/1/members \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 123,
    "allocation_percentage": 60
  }'

# 3. Create MPS
curl -X POST http://localhost:4000/api/operations/mps/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_name": "Q1 2026 Laptops",
    "product_family_id": 1,
    "start_period": "2026-01-01",
    "end_period": "2026-03-31",
    "planned_quantity": 1000
  }'
```

---

## 🐛 Quick Troubleshooting

### No capacity available for scheduling

```sql
-- Check shift schedules
SELECT * FROM workstation_shifts WHERE is_active = true;

-- Check allocations
SELECT * FROM capacity_allocations 
WHERE allocation_date = CURRENT_DATE;

-- Reset allocations if needed
DELETE FROM capacity_allocations 
WHERE allocation_date >= CURRENT_DATE;
```

### Forecast accuracy poor

```sql
-- Check data points
SELECT COUNT(*) FROM demand_forecast_details
WHERE product_id = 123 AND actual_quantity IS NOT NULL;
-- Need minimum 6-12 periods

-- Try different method
-- If SMA fails, try LR; if LR fails, try ES
```

### BOM not exploding

```sql
-- Check BOM structure
SELECT * FROM bom_items 
WHERE bom_id = (SELECT id FROM bill_of_materials WHERE product_code = 'YOUR-SKU');

-- Verify phantom flags
UPDATE bom_items SET is_phantom = true 
WHERE component_code IN ('SUB-ASSEMBLY-CODE');

-- Re-explode
SELECT * FROM explode_bom_multilevel(bom_id, 10);
```

### Gantt shows wrong dates

```sql
-- Check schedule window
SELECT start_date, end_date FROM production_schedules WHERE id = 5;

-- Check assignments
SELECT scheduled_start_time, scheduled_end_time 
FROM schedule_assignments WHERE schedule_id = 5;

-- Reschedule if needed
DELETE FROM schedule_assignments WHERE schedule_id = 5;
-- Then run auto-schedule again
```

---

## 📊 Status Codes Reference

### Work Order Status

- `draft` - Created, not released
- `released` - Ready for production
- `in_progress` - Being manufactured
- `completed` - Finished
- `on_hold` - Temporarily paused
- `cancelled` - Cancelled

### Schedule Status

- `draft` - Created, not finalized
- `scheduled` - Auto-scheduled
- `active` - In execution
- `completed` - All WOs done
- `cancelled` - Cancelled

### Conflict Severity

- `high` - Critical impact, immediate action
- `medium` - Notable impact, plan resolution
- `low` - Minor impact, monitor

---

## 🔑 Key Formulas

### Utilization %

```
Utilization = (Allocated Minutes / Available Minutes) × 100
```

### MAE (Mean Absolute Error)

```
MAE = Σ|Forecast - Actual| / n
```

### MAPE (Mean Absolute Percentage Error)

```
MAPE = (Σ|Forecast - Actual| / Actual) / n × 100
```

### Simple Moving Average

```
SMA = Σ(last N periods) / N
```

### Exponential Smoothing

```
Forecast_t = α × Actual_t-1 + (1-α) × Forecast_t-1
```

### Linear Regression

```
Forecast = slope × period + intercept
Where: slope = Σ[(x-x̄)(y-ȳ)] / Σ(x-x̄)²
```

---

## 🎨 UI Color Codes

### Task Status (Gantt)

- 🟢 **Green:** Completed
- 🔵 **Blue:** In Progress
- 🟣 **Purple:** Scheduled
- ⚪ **Gray:** Pending
- 🔴 **Red:** Critical Path

### Utilization (Capacity)

- 🔴 **Red:** Overloaded (≥100%)
- 🟠 **Orange:** High (85-99%)
- 🟢 **Green:** Optimal (60-84%)
- 🔵 **Blue:** Low (30-59%)
- ⚪ **Gray:** Idle (<30%)

### Priority Badges

- 🔴 **Red:** Urgent
- 🟠 **Orange:** High
- 🟡 **Yellow:** Normal
- 🔵 **Blue:** Low

---

## 📱 Keyboard Shortcuts (UI)

| Action | Shortcut |
|--------|----------|
| Refresh data | `Ctrl/Cmd + R` |
| Switch view (Gantt/List) | `Tab` |
| Select date range | `D` |
| Export to CSV | `Ctrl/Cmd + E` |
| Print view | `Ctrl/Cmd + P` |

---

## 📚 Documentation Links

- **Full Guide:** `/PHASE_2_COMPLETE_GUIDE.md`
- **Phase 1 MRP:** `/docs/OPERATIONS_MRP_USER_GUIDE.md`
- **API Reference:** `/docs/OPERATIONS_MRP_API.md`
- **Database Schema:** `/database/016_phase2_scheduling_capacity.sql`

---

## 📞 Quick Support

**Common Issues:**
1. Capacity errors → Check shift schedules
2. Forecast poor → Try different method
3. BOM not working → Check phantom flags
4. Gantt dates wrong → Verify schedule window

**Performance Tips:**
- Cache capacity data for 5 minutes
- Use indexed queries for large datasets
- Batch schedule updates
- Monitor slow queries in pg_stat_statements

---

**Last Updated:** December 2, 2025  
**Phase 2 Version:** 1.0  
**Status:** ✅ Complete
