# Workflow Automation - API Testing Guide

## 🧪 Complete API Testing with Postman/cURL

This guide provides step-by-step instructions to test all workflow automation APIs.

---

## Prerequisites

1. **Application Running:** Ensure Ocean ERP is running at `http://localhost:4000`
2. **Database:** PostgreSQL with workflow automation tables created
3. **Test User:** Create a test user or use existing user UUID

---

## 📋 Test Data Setup

### Get Your User ID
```bash
psql postgresql://marfreax@localhost:5432/ocean-erp -c "SELECT id, email, first_name, last_name FROM users LIMIT 5;"
```

Save a few user UUIDs for testing (you'll need at least 2 users for approvals).

---

## 1️⃣ Workflow Definitions API

### Test 1.1: Create Purchase Order Approval Workflow

**Endpoint:** `POST /api/workflows/definitions`

```bash
curl -X POST http://localhost:4000/api/workflows/definitions \
-H "Content-Type: application/json" \
-d '{
  "name": "Purchase Order Approval - Test",
  "description": "Two-level approval for PO above $10,000",
  "module": "purchase",
  "document_type": "purchase_order",
  "trigger_event": "on_create",
  "is_active": true,
  "created_by": "YOUR_USER_UUID_HERE",
  "steps": [
    {
      "step_name": "Manager Approval",
      "step_order": 1,
      "step_type": "approval",
      "approver_type": "user",
      "approver_user_id": "MANAGER_UUID_HERE",
      "timeout_hours": 48,
      "is_parallel": false,
      "require_all_approvals": true
    },
    {
      "step_name": "Finance Approval",
      "step_order": 2,
      "step_type": "approval",
      "approver_type": "user",
      "approver_user_id": "FINANCE_UUID_HERE",
      "timeout_hours": 24,
      "is_parallel": false,
      "require_all_approvals": true
    }
  ]
}'
```

**Expected Response:**
```json
{
  "success": true,
  "workflow": {
    "id": 1,
    "name": "Purchase Order Approval - Test",
    "steps": [...]
  }
}
```

**Save the workflow ID** for next tests!

---

### Test 1.2: List All Workflows

```bash
curl http://localhost:4000/api/workflows/definitions
```

**Expected:** Array of workflows with step counts

---

### Test 1.3: Filter by Module

```bash
curl "http://localhost:4000/api/workflows/definitions?module=purchase&is_active=true"
```

---

## 2️⃣ Workflow Instances API

### Test 2.1: Start a Workflow

**Endpoint:** `POST /api/workflows/instances`

```bash
curl -X POST http://localhost:4000/api/workflows/instances \
-H "Content-Type: application/json" \
-d '{
  "workflow_id": 1,
  "document_type": "purchase_order",
  "document_id": 999,
  "initiated_by": "YOUR_USER_UUID_HERE",
  "metadata": {
    "total_amount": 15000,
    "supplier": "Test Supplier Ltd"
  }
}'
```

**Expected Response:**
```json
{
  "success": true,
  "instance": {
    "id": 1,
    "workflow_id": 1,
    "status": "in_progress",
    "current_step_id": 1
  },
  "message": "Workflow started successfully"
}
```

**Save the instance ID!**

---

### Test 2.2: Get Workflow Instance Details

```bash
curl http://localhost:4000/api/workflows/instances/1
```

**Expected:** Complete workflow with steps, approvals, and history

---

### Test 2.3: List All Active Workflows

```bash
curl "http://localhost:4000/api/workflows/instances?status=in_progress"
```

---

## 3️⃣ Workflow Approvals API

### Test 3.1: Get Pending Approvals for Manager

```bash
curl "http://localhost:4000/api/workflows/approvals?user_id=MANAGER_UUID_HERE&status=pending"
```

**Expected Response:**
```json
{
  "approvals": [
    {
      "approval_id": 1,
      "document_type": "purchase_order",
      "document_id": 999,
      "workflow_name": "Purchase Order Approval - Test",
      "step_name": "Manager Approval",
      "initiated_by_name": "John Doe",
      "due_at": "2025-01-15T10:00:00Z",
      "is_escalated": false
    }
  ],
  "count": 1
}
```

**Save the approval_id!**

---

### Test 3.2: Approve First Step

```bash
curl -X POST http://localhost:4000/api/workflows/approvals/1/approve \
-H "Content-Type: application/json" \
-d '{
  "user_id": "MANAGER_UUID_HERE",
  "comments": "Approved. Budget is available."
}'
```

**Expected:**
```json
{
  "success": true,
  "message": "Approval processed successfully"
}
```

**Result:** Workflow should move to step 2 (Finance Approval)

---

### Test 3.3: Get Pending Approvals for Finance

```bash
curl "http://localhost:4000/api/workflows/approvals?user_id=FINANCE_UUID_HERE&status=pending"
```

**Expected:** Now Finance user should see the approval

---

### Test 3.4: Reject Workflow

```bash
curl -X POST http://localhost:4000/api/workflows/approvals/2/reject \
-H "Content-Type: application/json" \
-d '{
  "user_id": "FINANCE_UUID_HERE",
  "comments": "Budget exceeded for this quarter"
}'
```

**Expected:**
```json
{
  "success": true,
  "message": "Workflow rejected successfully"
}
```

**Result:** Workflow status should change to 'rejected'

---

### Test 3.5: Delegate Approval

Start another workflow first, then delegate:

```bash
curl -X POST http://localhost:4000/api/workflows/approvals/3/delegate \
-H "Content-Type: application/json" \
-d '{
  "user_id": "ORIGINAL_APPROVER_UUID",
  "delegate_to_user_id": "DELEGATE_UUID",
  "comments": "I am on leave this week"
}'
```

---

## 4️⃣ Email Automation API

### Test 4.1: Get Email Templates

```bash
curl http://localhost:4000/api/emails/templates
```

**Expected:** 4 pre-configured templates

---

### Test 4.2: Send Email with Template

```bash
curl -X POST http://localhost:4000/api/emails/send \
-H "Content-Type: application/json" \
-d '{
  "to_email": "test@company.com",
  "to_name": "Test User",
  "template_code": "approval_request",
  "template_variables": {
    "user_name": "John Smith",
    "document_type": "Purchase Order",
    "document_id": "PO-123",
    "amount": "$15,000",
    "approval_link": "http://localhost:4000/erp/workflows/approvals"
  },
  "priority": "high"
}'
```

**Expected:**
```json
{
  "success": true,
  "email": {
    "id": 1,
    "status": "pending",
    "to_email": "test@company.com"
  },
  "message": "Email queued successfully"
}
```

---

### Test 4.3: Send Direct Email (No Template)

```bash
curl -X POST http://localhost:4000/api/emails/send \
-H "Content-Type: application/json" \
-d '{
  "to_email": "manager@company.com",
  "to_name": "Jane Manager",
  "subject": "Urgent: Approval Required",
  "body_html": "<h2>Hello Jane!</h2><p>You have a pending approval.</p>",
  "priority": "high"
}'
```

---

### Test 4.4: Check Email Queue

```bash
curl "http://localhost:4000/api/emails/send?status=pending&limit=10"
```

**Expected:** List of queued emails

---

## 5️⃣ Business Rules Engine API

### Test 5.1: Create Low Stock Alert Rule

```bash
curl -X POST http://localhost:4000/api/rules \
-H "Content-Type: application/json" \
-d '{
  "name": "Low Stock Alert - Test",
  "description": "Send alert when stock below 10 units",
  "module": "inventory",
  "event_type": "stock_updated",
  "conditions": {
    "operator": "AND",
    "rules": [
      {
        "field": "quantity",
        "operator": "less_than",
        "value": "10"
      },
      {
        "field": "product.is_active",
        "operator": "equals",
        "value": true
      }
    ]
  },
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to_email": "inventory@company.com",
        "subject": "Low Stock Alert: {{product_name}}",
        "body": "Product {{product_name}} has only {{quantity}} units left.",
        "priority": "high"
      }
    },
    {
      "type": "create_notification",
      "config": {
        "user_id": "INVENTORY_MANAGER_UUID",
        "notification_type": "warning",
        "title": "Low Stock Alert",
        "message": "{{product_name}} is running low ({{quantity}} units)"
      }
    }
  ],
  "priority": 10,
  "is_active": true,
  "created_by": "YOUR_USER_UUID"
}'
```

**Expected:**
```json
{
  "success": true,
  "rule": {
    "id": 1,
    "name": "Low Stock Alert - Test"
  }
}
```

---

### Test 5.2: Execute Business Rules

```bash
curl -X POST http://localhost:4000/api/rules/execute \
-H "Content-Type: application/json" \
-d '{
  "module": "inventory",
  "event_type": "stock_updated",
  "entity_type": "product",
  "entity_id": 789,
  "data": {
    "product_id": 789,
    "product_name": "Test Widget A",
    "quantity": 8,
    "product": {
      "is_active": true
    }
  }
}'
```

**Expected:**
```json
{
  "success": true,
  "rules_evaluated": 1,
  "rules_triggered": 1,
  "executed_actions": [
    {
      "rule_id": 1,
      "rule_name": "Low Stock Alert - Test",
      "actions": [
        {
          "action_type": "send_email",
          "success": true
        },
        {
          "action_type": "create_notification",
          "success": true
        }
      ]
    }
  ]
}
```

**Result:** Email should be queued, notification should be created

---

### Test 5.3: List All Rules

```bash
curl "http://localhost:4000/api/rules?module=inventory&is_active=true"
```

---

## 6️⃣ Notifications API

### Test 6.1: Get User Notifications

```bash
curl "http://localhost:4000/api/notifications?user_id=YOUR_USER_UUID&is_read=false&limit=20"
```

**Expected:**
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "warning",
      "title": "Low Stock Alert",
      "message": "Test Widget A is running low (8 units)",
      "is_read": false,
      "created_at": "2025-01-13T10:00:00Z"
    }
  ],
  "count": 1,
  "unread_count": 1
}
```

---

### Test 6.2: Create Notification

```bash
curl -X POST http://localhost:4000/api/notifications \
-H "Content-Type: application/json" \
-d '{
  "user_id": "YOUR_USER_UUID",
  "type": "info",
  "title": "System Update",
  "message": "The system will be under maintenance tonight.",
  "link": "/erp/settings"
}'
```

---

### Test 6.3: Mark Notification as Read

```bash
curl -X PATCH http://localhost:4000/api/notifications/1/read
```

---

### Test 6.4: Mark All as Read

```bash
curl -X POST http://localhost:4000/api/notifications/mark-all-read \
-H "Content-Type: application/json" \
-d '{
  "user_id": "YOUR_USER_UUID"
}'
```

**Expected:**
```json
{
  "success": true,
  "marked_count": 5,
  "message": "5 notifications marked as read"
}
```

---

## 🎯 End-to-End Test Scenario

### Complete Purchase Order Approval Flow

**Step 1:** Create workflow definition (Test 1.1)
**Step 2:** Start workflow instance (Test 2.1)
**Step 3:** Manager checks pending approvals (Test 3.1)
**Step 4:** Manager approves (Test 3.2)
**Step 5:** Finance checks pending approvals (Test 3.3)
**Step 6:** Finance approves (similar to 3.2)
**Step 7:** Check workflow completion (Test 2.2)

**Expected Final State:**
- Workflow status: `approved`
- All approvals: `approved`
- Complete history logged
- Emails sent to all parties
- Notifications created

---

## 🔍 Database Verification

### Check Workflow History

```bash
psql postgresql://marfreax@localhost:5432/ocean-erp -c "
SELECT 
  wh.action,
  u.first_name || ' ' || u.last_name as performed_by,
  wh.comments,
  wh.created_at
FROM workflow_history wh
LEFT JOIN users u ON wh.performed_by = u.id
WHERE wh.instance_id = 1
ORDER BY wh.created_at ASC;
"
```

### Check Email Queue

```bash
psql postgresql://marfreax@localhost:5432/ocean-erp -c "
SELECT id, to_email, subject, status, priority, created_at
FROM email_queue
ORDER BY created_at DESC
LIMIT 10;
"
```

### Check Business Rule Logs

```bash
psql postgresql://marfreax@localhost:5432/ocean-erp -c "
SELECT 
  brl.id,
  br.name as rule_name,
  brl.entity_type,
  brl.entity_id,
  brl.conditions_met,
  brl.executed_at
FROM business_rule_logs brl
JOIN business_rules br ON brl.rule_id = br.id
ORDER BY brl.executed_at DESC
LIMIT 10;
"
```

---

## 🐛 Troubleshooting

### Issue: "User not found" errors
**Solution:** Make sure you're using valid UUID values from the users table

### Issue: Workflow not progressing
**Solution:** Check `workflow_instances.status` and `workflow_history` for errors

### Issue: Emails not sent
**Solution:** Emails are queued, not sent immediately. Check `email_queue` table

### Issue: Rules not triggering
**Solution:** Verify conditions match exactly, check `business_rule_logs`

---

## 📊 Performance Testing

### Create 100 Workflow Instances

```bash
for i in {1..100}; do
  curl -X POST http://localhost:4000/api/workflows/instances \
  -H "Content-Type: application/json" \
  -d "{\"workflow_id\": 1, \"document_type\": \"purchase_order\", \"document_id\": $i, \"initiated_by\": \"YOUR_USER_UUID\"}"
done
```

### Measure Query Performance

```bash
psql postgresql://marfreax@localhost:5432/ocean-erp -c "
EXPLAIN ANALYZE
SELECT * FROM workflow_approvals wa
JOIN workflow_instances wi ON wa.instance_id = wi.id
WHERE wa.approver_id = 'YOUR_USER_UUID' AND wa.status = 'pending';
"
```

---

## ✅ Test Checklist

- [ ] Created workflow definition with 2+ steps
- [ ] Started workflow instance successfully
- [ ] Retrieved pending approvals for user
- [ ] Approved workflow step
- [ ] Rejected workflow
- [ ] Delegated approval to another user
- [ ] Sent email with template
- [ ] Sent direct email
- [ ] Created business rule
- [ ] Executed business rule successfully
- [ ] Created notification
- [ ] Marked notification as read
- [ ] Verified complete workflow in database
- [ ] Checked email queue
- [ ] Reviewed business rule logs

---

**Happy Testing!** 🚀

If you encounter any issues, check:
1. Console logs in terminal running Next.js
2. PostgreSQL logs
3. API response error messages
4. Database table contents directly
