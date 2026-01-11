# Workflow Engine - Quick Reference Guide

## For End Users

### 📋 Viewing Your Pending Approvals

**Navigate to:** `/erp/workflows/approvals`

This page shows all documents waiting for your approval.

### ✅ Approving a Document

1. Open the document detail page
2. Find the "Workflow Status" card
3. Click "Review & Take Action" on your pending approval
4. (Optional) Add approval comments
5. Click "Approve"

### ❌ Rejecting a Document

1. Open the document detail page
2. Find the "Workflow Status" card
3. Click "Review & Take Action"
4. **REQUIRED:** Add rejection reason in comments
5. Click "Reject"

### 👥 Delegating an Approval

**When you're on leave or unavailable:**

1. Go to your pending approval
2. Click "Delegate" (if available)
3. Select the person to delegate to
4. Add delegation reason
5. Confirm delegation

---

## For Developers

### 🔧 Quick Integration (3 Steps)

#### Step 1: Import the Engine
```typescript
import { WorkflowEngine } from '@/lib/workflow-engine'
import { pool } from '@/lib/db'
```

#### Step 2: Start Workflow After Document Creation
```typescript
// In your POST /api/your-documents route
const document = await createDocument(data)

// Start workflow if document requires approval
if (document.status === 'Pending Approval') {
  await WorkflowEngine.startWorkflow(
    'your_document_type',  // e.g., 'purchase_order'
    document.id,
    userId,
    {
      // Data used for conditional routing
      total_amount: document.total,
      created_by: userId
    },
    pool
  )
}
```

#### Step 3: Add UI Component to Detail Page
```tsx
import { WorkflowApprovalCard } from '@/components/workflow/WorkflowApprovalCard'

export default function DocumentDetailPage({ documentId, userId }) {
  return (
    <>
      {/* Your existing content */}
      
      <WorkflowApprovalCard
        documentType="your_document_type"
        documentId={documentId}
        userId={userId}
        onApprovalComplete={() => router.refresh()}
      />
    </>
  )
}
```

### 📊 Status Badge
```tsx
import { WorkflowStatusBadge } from '@/components/workflow/WorkflowStatusBadge'

<WorkflowStatusBadge status={workflow.status} />
```

---

## Workflow Types & Thresholds

### 💰 Purchase Orders
| Amount Range | Approver |
|--------------|----------|
| < $10,000 | Department Manager |
| $10,000 - $50,000 | Procurement Manager |
| ≥ $50,000 | Finance Director |

### 📄 Quotations
| Amount Range | Approver |
|--------------|----------|
| < $25,000 | Sales Manager |
| $25,000 - $100,000 | Sales Director |
| ≥ $100,000 | CEO |

### 🏖️ Leave Requests
| Condition | Approver |
|-----------|----------|
| All requests | Direct Manager |
| > 5 days | + HR Manager |

### 💵 Expense Claims
| Amount Range | Approver |
|--------------|----------|
| < $1,000 | Manager |
| $1,000 - $5,000 | Finance Manager |
| ≥ $5,000 | Finance Director |

### 📦 Inventory Adjustments
| Condition | Approver |
|-----------|----------|
| All adjustments | Warehouse Manager |
| ≥ $5,000 value | + Inventory Controller |

### ✅ Quality Inspections
| Condition | Approver |
|-----------|----------|
| All inspections | Quality Manager |
| Failed inspections | + Production Manager |

### 🏢 Asset Transfers
| Condition | Approver |
|-----------|----------|
| All transfers | Asset Manager |
| ≥ $10,000 value | + Finance Manager |

---

## Common Tasks

### Creating a New Workflow

**1. Define Workflow**
```sql
INSERT INTO workflow_definitions (
  name, module, document_type, trigger_event, is_active
) VALUES (
  'My Document Approval',
  'my_module',
  'my_document',
  'on_create',
  true
) RETURNING id;
```

**2. Add Steps**
```sql
-- Step 1: Manager Approval
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  1, -- workflow_id from above
  1,
  'Manager Approval',
  'approval',
  'manager',
  'manager_of(document.created_by)',
  false,
  true,
  48,
  NULL -- No conditions = always execute
);

-- Step 2: Finance Approval (conditional)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  1,
  2,
  'Finance Approval',
  'approval',
  'role',
  'role:finance_manager',
  false,
  true,
  72,
  '{"field": "total_amount", "operator": "gte", "value": 5000}'::jsonb
);
```

**3. Integrate in Code**
```typescript
await WorkflowEngine.startWorkflow(
  'my_document',
  documentId,
  userId,
  documentData,
  pool
)
```

---

## Condition Operators

### Comparison
- `eq` - Equal to
- `neq` - Not equal to
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal

### Arrays
- `in` - Value in array
- `not_in` - Value not in array

### Strings
- `contains` - Contains substring
- `starts_with` - Starts with
- `ends_with` - Ends with

### Logical
```json
{
  "and": [
    {"field": "amount", "operator": "gte", "value": 1000},
    {"field": "amount", "operator": "lt", "value": 5000}
  ]
}
```

```json
{
  "or": [
    {"field": "priority", "operator": "eq", "value": "high"},
    {"field": "amount", "operator": "gte", "value": 10000}
  ]
}
```

---

## Approver Types

### Role-based
```typescript
approver_type: 'role'
approver_expression: 'role:finance_manager'
```

### User-specific
```typescript
approver_type: 'user'
approver_user_id: 'user-uuid-here'
```

### Manager Hierarchy
```typescript
approver_type: 'manager'
approver_expression: 'manager_of(document.created_by)'
```

### Dynamic Expression
```typescript
approver_type: 'dynamic'
approver_expression: 'manager_of(document.employee_id)'
```

---

## API Quick Reference

### Get My Approvals
```bash
GET /api/workflows/approvals?user_id={userId}&status=pending
```

### Approve
```bash
POST /api/workflows/approvals/{approvalId}/approve
Content-Type: application/json

{
  "user_id": "uuid",
  "comments": "Approved - budget allocated"
}
```

### Reject
```bash
POST /api/workflows/approvals/{approvalId}/reject
Content-Type: application/json

{
  "user_id": "uuid",
  "comments": "Rejected - exceeds quarterly budget"
}
```

### Delegate
```bash
POST /api/workflows/approvals/{approvalId}/delegate
Content-Type: application/json

{
  "user_id": "uuid",
  "delegate_to_user_id": "other-uuid",
  "comments": "On vacation until next week"
}
```

### Start Workflow
```bash
POST /api/workflows/start
Content-Type: application/json

{
  "document_type": "purchase_order",
  "document_id": 123,
  "initiated_by": "user-uuid",
  "document_data": {
    "total_amount": 15000,
    "created_by": "user-uuid"
  }
}
```

---

## Troubleshooting

### Workflow Not Starting
✅ Check workflow definition exists  
✅ Verify `is_active = true`  
✅ Check document_type matches exactly  
✅ Review database logs

### No Approvals Showing
✅ Verify user is assigned as approver  
✅ Check role assignments  
✅ Verify manager hierarchy in HRIS  
✅ Check workflow_approvals table

### Step Not Advancing
✅ All required approvers must approve  
✅ Check `require_all_approvals` setting  
✅ Verify no rejections  
✅ Review workflow_history

### Delegation Not Working
✅ User must be current approver  
✅ Delegate user must exist  
✅ Check approval is still pending  
✅ Verify API response

---

## Best Practices

### ✅ DO
- Always provide meaningful comments
- Test workflows with sample data first
- Set realistic timeout periods
- Use role-based approvers for flexibility
- Document custom workflows
- Monitor pending approvals regularly

### ❌ DON'T
- Skip rejection comments
- Set timeouts too short
- Hardcode user IDs as approvers
- Create circular approval loops
- Ignore escalated approvals
- Delete workflow history

---

## Support

### For Issues
1. Check workflow_history table for audit trail
2. Review database logs
3. Verify user permissions
4. Contact development team

### For New Features
1. Document business requirement
2. Design workflow steps
3. Test with sample data
4. Deploy to production

---

**Quick Links:**
- Full Documentation: `WORKFLOW_ENGINE_DOCUMENTATION.md`
- Implementation Summary: `WORKFLOW_ENGINE_IMPLEMENTATION_SUMMARY.md`
- Approval Dashboard: `/erp/workflows/approvals`
- Database Schema: `database/030_workflow_automation_system.sql`

---

**Version:** 1.0.0  
**Last Updated:** December 12, 2025
