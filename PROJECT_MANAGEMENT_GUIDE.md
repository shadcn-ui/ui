# Project Management System - Quick Reference Guide

**Version:** 1.0  
**Last Updated:** December 2024

---

## 🚀 Quick Start (5 Minutes)

### 1. Create Your First Project

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "project_code": "DEMO-001",
    "project_name": "Demo Project",
    "planned_start_date": "2025-01-01",
    "planned_end_date": "2025-03-31",
    "budget_amount": 50000,
    "created_by": 1
  }'
```

### 2. Add Team Member

```bash
curl -X POST http://localhost:4000/api/projects/team \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "user_id": 2,
    "role": "Developer",
    "permission_level": "member"
  }'
```

### 3. Create Task

```bash
curl -X POST http://localhost:4000/api/projects/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_name": "Setup Environment",
    "assigned_to": 2,
    "estimated_hours": 8,
    "created_by": 1
  }'
```

### 4. Log Time

```bash
curl -X POST http://localhost:4000/api/projects/time-entries \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_id": 1,
    "user_id": 2,
    "entry_date": "2025-01-02",
    "hours_worked": 6,
    "work_description": "Completed environment setup",
    "created_by": 2
  }'
```

### 5. View Dashboard

```bash
curl "http://localhost:4000/api/projects/analytics?project_id=1"
```

---

## 📋 Common Workflows

### Workflow 1: Monthly Project Review

```bash
# 1. Get project status
curl "http://localhost:4000/api/projects/1"

# 2. Check financial health
curl "http://localhost:4000/api/projects/analytics?type=financial&project_id=1"

# 3. Review team utilization
curl "http://localhost:4000/api/projects/analytics?type=resources"

# 4. Check upcoming deadlines
curl "http://localhost:4000/api/projects/analytics?type=timeline"

# 5. Review pending approvals
curl "http://localhost:4000/api/projects/time-entries?is_approved=false&project_id=1"
curl "http://localhost:4000/api/projects/expenses?expense_status=submitted&project_id=1"
```

---

### Workflow 2: Weekly Time Approval

```bash
# 1. List all pending time entries
curl "http://localhost:4000/api/projects/time-entries?is_approved=false&from_date=2025-01-01&to_date=2025-01-07"

# 2. Approve all entries for the week
curl -X PUT http://localhost:4000/api/projects/time-entries/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approve_all_for_user": true,
    "user_id": 2,
    "from_date": "2025-01-01",
    "to_date": "2025-01-07",
    "approved_by": 1
  }'

# 3. Verify approval
curl "http://localhost:4000/api/projects/time-entries?is_approved=true&from_date=2025-01-01"
```

---

### Workflow 3: Task Management with Dependencies

```bash
# 1. Create Phase 1 task
TASK1=$(curl -X POST http://localhost:4000/api/projects/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_name": "Design Database Schema",
    "estimated_hours": 16,
    "priority": "high",
    "created_by": 1
  }' | jq -r '.data.task_id')

# 2. Create Phase 2 task (depends on Phase 1)
TASK2=$(curl -X POST http://localhost:4000/api/projects/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_name": "Implement Database",
    "estimated_hours": 24,
    "priority": "high",
    "created_by": 1
  }' | jq -r '.data.task_id')

# 3. Create dependency (Task 2 starts when Task 1 finishes)
curl -X POST http://localhost:4000/api/projects/task-dependencies \
  -H "Content-Type: application/json" \
  -d "{
    \"task_id\": $TASK2,
    \"depends_on_task_id\": $TASK1,
    \"dependency_type\": \"finish_to_start\",
    \"lag_days\": 0
  }"

# 4. View task with dependencies
curl "http://localhost:4000/api/projects/tasks/$TASK2"
```

---

### Workflow 4: Budget Management

```bash
# 1. Set up budget categories
curl -X POST http://localhost:4000/api/projects/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "budget_category": "labor",
    "budget_subcategory": "development",
    "budgeted_amount": 100000,
    "created_by": 1
  }'

# 2. Track expenses
curl -X POST http://localhost:4000/api/projects/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "expense_date": "2025-01-05",
    "expense_category": "Software",
    "expense_description": "Development tools",
    "expense_amount": 500,
    "submitted_by": 2,
    "is_billable": true
  }'

# 3. Monitor budget vs actual
curl "http://localhost:4000/api/projects/budgets?project_id=1"

# 4. Check financial health
curl "http://localhost:4000/api/projects/analytics?type=financial"
```

---

### Workflow 5: Resource Allocation

```bash
# 1. Check available resources
curl "http://localhost:4000/api/projects/resources?is_available=true&resource_type=human"

# 2. Allocate resource to project
curl -X POST http://localhost:4000/api/projects/resource-allocations \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "resource_id": 1,
    "allocation_start_date": "2025-01-01",
    "allocation_end_date": "2025-03-31",
    "allocation_percentage": 50,
    "role_in_project": "Senior Developer"
  }'

# 3. Check utilization
curl "http://localhost:4000/api/projects/analytics?type=resources"
```

---

## 🎯 Key Features Guide

### Gantt Chart Data

Get timeline data for Gantt charts:

```bash
# Get all tasks with dependencies for project
curl "http://localhost:4000/api/projects/tasks?project_id=1" | jq '
  .data.tasks[] | {
    id: .task_id,
    name: .task_name,
    start: .planned_start_date,
    end: .planned_end_date,
    progress: .completion_percentage,
    dependencies: .dependency_count
  }
'

# Get detailed task with all dependencies
curl "http://localhost:4000/api/projects/tasks/1" | jq '.data.dependencies'
```

---

### Project Health Monitoring

```sql
-- SQL Query for health dashboard
SELECT 
  project_name,
  health_status,
  completion_percentage,
  budget_variance,
  (planned_end_date - CURRENT_DATE) as days_remaining,
  CASE 
    WHEN planned_end_date < CURRENT_DATE AND project_status = 'active' 
    THEN 'OVERDUE'
    WHEN planned_end_date - CURRENT_DATE <= 7 
    THEN 'DUE SOON'
    ELSE 'ON SCHEDULE'
  END as schedule_status
FROM projects
WHERE is_active = TRUE
ORDER BY health_status DESC, days_remaining ASC;
```

---

### Milestone Tracking

```bash
# List all project milestones
curl "http://localhost:4000/api/projects/1" | jq '.data.milestones'

# Create payment milestone
curl -X POST http://localhost:4000/api/projects/milestones \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "milestone_name": "Phase 1 Complete",
    "milestone_type": "payment",
    "planned_date": "2025-02-01",
    "is_payment_milestone": true,
    "payment_percentage": 30,
    "requires_approval": true
  }'

# Mark milestone as achieved
curl -X PUT http://localhost:4000/api/projects/milestones/1 \
  -H "Content-Type: application/json" \
  -d '{
    "milestone_status": "achieved",
    "actual_date": "2025-02-01",
    "approved_by": 1
  }'
```

---

### Time Tracking Best Practices

```bash
# Log daily work
curl -X POST http://localhost:4000/api/projects/time-entries \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_id": 5,
    "user_id": 2,
    "entry_date": "2025-01-10",
    "start_time": "09:00:00",
    "end_time": "17:30:00",
    "hours_worked": 7.5,
    "is_billable": true,
    "billing_rate": 150,
    "work_description": "Implemented authentication module",
    "activity_type": "development",
    "work_location": "office"
  }'

# Track overtime
curl -X POST http://localhost:4000/api/projects/time-entries \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "task_id": 5,
    "user_id": 2,
    "entry_date": "2025-01-10",
    "hours_worked": 3,
    "is_overtime": true,
    "overtime_multiplier": 1.5,
    "work_description": "Emergency bug fix",
    "created_by": 2
  }'
```

---

## 📊 Reporting Examples

### 1. Portfolio Dashboard

```bash
curl "http://localhost:4000/api/projects/analytics" | jq '{
  total_projects: .data.project_stats.total_projects,
  active_projects: .data.project_stats.active_projects,
  on_track: .data.project_stats.on_track_projects,
  at_risk: .data.project_stats.at_risk_projects,
  total_budget: .data.project_stats.total_budget,
  total_cost: .data.project_stats.total_actual_cost
}'
```

### 2. Financial Report

```bash
curl "http://localhost:4000/api/projects/analytics?type=financial&from_date=2025-01-01&to_date=2025-01-31" | jq '{
  total_budget: .data.financial_summary.total_budget,
  total_cost: .data.financial_summary.total_cost,
  variance: .data.financial_summary.total_variance,
  billed: .data.financial_summary.total_billed,
  unbilled: .data.financial_summary.total_unbilled
}'
```

### 3. Team Performance

```bash
curl "http://localhost:4000/api/projects/analytics?type=resources" | jq '
  .data.top_performers[] | {
    resource: .resource_name,
    projects: .active_project_count,
    hours: .hours_logged_last_30_days,
    revenue: .revenue_last_30_days
  }
'
```

### 4. Overdue Projects

```bash
curl "http://localhost:4000/api/projects/analytics?type=timeline" | jq '
  .data.overdue_projects[] | {
    project: .project_name,
    days_overdue: .days_overdue,
    completion: .completion_percentage
  }
'
```

---

## 🔍 Advanced Queries

### Find Blocked Tasks

```bash
curl "http://localhost:4000/api/projects/tasks?is_blocked=true" | jq '
  .data.tasks[] | {
    task: .task_name,
    reason: .blocked_reason,
    blocked_since: .blocked_date
  }
'
```

### Projects Over Budget

```bash
curl "http://localhost:4000/api/projects?is_active=true" | jq '
  .data.projects[] | select(.budget_variance < 0) | {
    project: .project_name,
    budget: .budget_amount,
    actual: .actual_cost,
    overrun: (.budget_variance * -1)
  }
'
```

### Resource Capacity Report

```bash
curl "http://localhost:4000/api/projects/analytics?type=resources" | jq '
  .data.resource_utilization[] | select(.availability_status == "available") | {
    resource: .resource_name,
    utilization: .weekly_utilization_percentage,
    projects: .active_project_count
  }
'
```

### Upcoming Deadlines (Next 2 Weeks)

```bash
curl "http://localhost:4000/api/projects/tasks?project_id=1" | jq '
  .data.tasks[] | 
  select(.due_date != null) |
  select((.due_date | fromdateiso8601) < (now + (14 * 86400))) |
  {
    task: .task_name,
    due: .due_date,
    assigned_to: .assigned_to,
    completion: .completion_percentage
  }
'
```

---

## ⚙️ Configuration Examples

### Project Types & Categories

**Project Types:**
- `internal` - Internal company projects
- `client` - Client projects
- `maintenance` - Ongoing maintenance
- `development` - New development
- `consulting` - Consulting services
- `support` - Support projects

**Billing Types:**
- `fixed_price` - Fixed price contract
- `time_and_material` - Hourly billing
- `milestone_based` - Payment on milestones
- `retainer` - Monthly retainer

**Priority Levels:**
- `low` - Low priority
- `medium` - Medium priority
- `high` - High priority (default)
- `critical` - Critical/urgent

---

### Task Dependencies Types

**finish_to_start (FS)** - Most common
```
Task A: ████████
Task B:         ████████
```
Task B starts when Task A finishes

**start_to_start (SS)**
```
Task A: ████████
Task B: ████████
```
Task B starts when Task A starts

**finish_to_finish (FF)**
```
Task A: ████████
Task B:     ████████
```
Task B finishes when Task A finishes

**start_to_finish (SF)** - Rare
```
Task A: ████████
Task B: ████
```
Task B finishes when Task A starts

---

## 🛠️ Troubleshooting

### Issue: Time Entry Not Approved

**Check approval status:**
```bash
curl "http://localhost:4000/api/projects/time-entries?time_entry_id=123"
```

**Approve manually:**
```bash
curl -X PUT http://localhost:4000/api/projects/time-entries/approve \
  -H "Content-Type: application/json" \
  -d '{"time_entry_ids": [123], "approved_by": 1}'
```

---

### Issue: Task Cannot Be Deleted

**Check dependencies:**
```bash
curl "http://localhost:4000/api/projects/tasks/123" | jq '.data.blocking_tasks'
```

**Solution:** Complete or remove dependent tasks first, then delete

---

### Issue: Budget Variance Not Updating

**Triggers should auto-update, but you can manually recalculate:**
```sql
-- Recalculate project costs
UPDATE projects p
SET 
  actual_cost = (
    SELECT COALESCE(SUM(te.billable_amount), 0)
    FROM project_time_entries te
    WHERE te.project_id = p.project_id
  ) + (
    SELECT COALESCE(SUM(e.expense_amount), 0)
    FROM project_expenses e
    WHERE e.project_id = p.project_id 
      AND e.expense_status = 'approved'
  ),
  budget_variance = budget_amount - actual_cost
WHERE project_id = 1;
```

---

### Issue: Resource Shows As Unavailable

**Check resource status:**
```bash
curl "http://localhost:4000/api/projects/resources/1"
```

**Update availability:**
```bash
curl -X PUT http://localhost:4000/api/projects/resources/1 \
  -H "Content-Type: application/json" \
  -d '{
    "is_available": true,
    "available_from": "2025-01-01",
    "available_until": "2025-12-31"
  }'
```

---

## 📚 SQL Cheat Sheet

### Most Common Queries

```sql
-- Active projects summary
SELECT 
  project_name,
  completion_percentage,
  health_status,
  budget_variance,
  team_size
FROM projects
WHERE is_active = TRUE AND project_status = 'active';

-- Tasks by assignee
SELECT 
  u.user_name,
  COUNT(*) as task_count,
  SUM(CASE WHEN t.task_status = 'completed' THEN 1 ELSE 0 END) as completed,
  SUM(t.estimated_hours) as total_hours
FROM project_tasks t
JOIN users u ON t.assigned_to = u.user_id
WHERE t.is_active = TRUE
GROUP BY u.user_id, u.user_name;

-- Billable hours by project (last 30 days)
SELECT 
  p.project_name,
  SUM(te.hours_worked) as hours,
  SUM(te.billable_amount) as revenue
FROM project_time_entries te
JOIN projects p ON te.project_id = p.project_id
WHERE te.entry_date >= CURRENT_DATE - INTERVAL '30 days'
  AND te.is_billable = TRUE
  AND te.is_approved = TRUE
GROUP BY p.project_id, p.project_name;

-- Resource utilization
SELECT * FROM project_resource_utilization
ORDER BY weekly_utilization_percentage DESC;

-- Budget vs actual by category
SELECT 
  budget_category,
  SUM(budgeted_amount) as budgeted,
  SUM(actual_amount) as actual,
  SUM(variance_amount) as variance
FROM project_budgets
WHERE project_id = 1
GROUP BY budget_category;
```

---

## 🎓 Best Practices

### 1. Project Planning
- Define clear milestones with payment terms
- Set realistic budgets with 10-15% contingency
- Break work into 4-16 hour tasks
- Identify dependencies early

### 2. Time Tracking
- Log time daily (not weekly)
- Provide detailed work descriptions
- Mark overtime separately
- Submit for approval within 48 hours

### 3. Task Management
- Update task status daily
- Set realistic estimates
- Use subtasks for complex work
- Flag blockers immediately

### 4. Budget Control
- Review weekly variance reports
- Approve expenses within 24 hours
- Track committed costs (POs issued)
- Monitor utilization vs capacity

### 5. Team Collaboration
- Use task comments for discussions
- Tag team members with @mentions
- Upload documents to project repository
- Update task progress regularly

---

## 📞 Support & Resources

**Full Documentation:** `/PHASE_7_TASK_9_COMPLETE.md`

**Database Schema:** `/database/022_phase7_project_management.sql`

**API Endpoints:** 10 routes in `/apps/v4/app/api/projects/`

**Sample Data:** Included in schema file for testing

---

*Last Updated: December 2024*  
*Ocean ERP v4 - Project Management Module*
