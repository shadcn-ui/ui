# Ocean ERP - Comprehensive Workflow Engine

## Overview

The Ocean ERP Workflow Engine is a powerful, flexible approval and automation system that can be applied across all modules. It provides configurable multi-step approval flows, conditional routing, delegation, escalation, and comprehensive audit trails.

## Architecture

### Core Components

1. **Workflow Engine Library** (`apps/v4/lib/workflow-engine.ts`)
   - Core workflow logic and orchestration
   - Condition evaluator for dynamic routing
   - Approver resolver for role and hierarchy-based assignments
   - Workflow state machine

2. **API Routes** (`apps/v4/app/api/workflows/`)
   - `/api/workflows/start` - Initialize workflows
   - `/api/workflows/approvals` - List pending approvals
   - `/api/workflows/approvals/[id]/approve` - Approve workflow step
   - `/api/workflows/approvals/[id]/reject` - Reject workflow
   - `/api/workflows/approvals/[id]/delegate` - Delegate approval
   - `/api/workflows/instances` - Track workflow instances

3. **UI Components** (`apps/v4/components/workflow/`)
   - `WorkflowStatusBadge` - Display workflow status
   - `WorkflowApprovalCard` - Approval interface for documents

4. **Database Schema** (`database/030_workflow_automation_system.sql`)
   - Workflow definitions and steps
   - Workflow instances and approvals
   - Workflow history and audit trail
   - Email templates and notifications

## Integrated Modules

### 1. Purchase Orders
- **Document Type**: `purchase_order`
- **Workflow**: Amount-based approval routing
  - < $10,000: Department Manager
  - $10,000 - $50,000: Procurement Manager
  - ≥ $50,000: Finance Director
- **Implementation**: Auto-starts when PO status is "Pending Approval"

### 2. Quotations
- **Document Type**: `quotation`
- **Workflow**: Value-based approval routing
  - < $25,000: Sales Manager
  - $25,000 - $100,000: Sales Director
  - ≥ $100,000: CEO
- **Implementation**: Auto-starts when quotation is submitted

### 3. Leave Requests
- **Document Type**: `leave_request`
- **Workflow**: Manager hierarchy with HR oversight
  - Step 1: Direct Manager approval (all requests)
  - Step 2: HR Manager approval (> 5 days)
- **Implementation**: Uses manager hierarchy from HRIS

### 4. Expense Claims
- **Document Type**: `expense_claim`
- **Workflow**: Amount-based approval
  - < $1,000: Manager approval
  - $1,000 - $5,000: Finance Manager
  - ≥ $5,000: Finance Director
- **Implementation**: Tracks employee expenses

### 5. Inventory Adjustments
- **Document Type**: `inventory_adjustment`
- **Workflow**: Two-tier approval
  - All adjustments: Warehouse Manager
  - High-value (≥ $5,000): Inventory Controller
- **Implementation**: Prevents unauthorized stock changes

### 6. Quality Inspections
- **Document Type**: `quality_inspection`
- **Workflow**: Quality assurance flow
  - All inspections: Quality Manager review
  - Failed inspections: Production Manager approval
- **Implementation**: Ensures quality oversight

### 7. Asset Transfers
- **Document Type**: `asset_transfer`
- **Workflow**: Asset protection flow
  - All transfers: Asset Manager approval
  - High-value assets (≥ $10,000): Finance approval
- **Implementation**: Tracks asset movements

## Key Features

### 1. Conditional Routing
Workflows can route based on document data:
```json
{
  "field": "total_amount",
  "operator": "gte",
  "value": 10000
}
```

Supported operators:
- `eq`, `neq` - Equality
- `gt`, `gte`, `lt`, `lte` - Comparisons
- `in`, `not_in` - Array membership
- `contains`, `starts_with`, `ends_with` - String operations

### 2. Dynamic Approvers
Multiple approver resolution strategies:
- **Role-based**: `role:procurement_manager`
- **User-specific**: Direct user ID
- **Manager hierarchy**: `manager_of(document.created_by)`
- **Dynamic expressions**: Complex logic evaluation

### 3. Parallel Approvals
- Support for multiple concurrent approvers
- Configurable: require all or any approver

### 4. Escalation & Timeouts
- Automatic escalation after timeout period
- Configurable timeout hours per step
- Escalation to designated users

### 5. Delegation
- Temporary approval delegation
- Audit trail of delegations
- Maintains workflow continuity

### 6. Comprehensive Audit Trail
- All actions recorded with timestamp
- User tracking for accountability
- Comments and reasoning captured

## Usage

### Starting a Workflow

```typescript
import { WorkflowEngine } from '@/lib/workflow-engine'
import { pool } from '@/lib/db'

const instance = await WorkflowEngine.startWorkflow(
  'purchase_order',  // document_type
  123,               // document_id
  'user-uuid',       // initiated_by
  {                  // document_data
    total_amount: 15000,
    supplier_id: 456,
    created_by: 'user-uuid'
  },
  pool
)
```

### Processing Approvals

```typescript
const success = await WorkflowEngine.processApproval(
  approvalId,
  userId,
  'approved',        // or 'rejected'
  'Looks good to me',
  pool
)
```

### Using Workflow Components

```tsx
import { WorkflowApprovalCard } from '@/components/workflow/WorkflowApprovalCard'
import { WorkflowStatusBadge } from '@/components/workflow/WorkflowStatusBadge'

// In your component
<WorkflowApprovalCard
  documentType="purchase_order"
  documentId={poId}
  userId={currentUserId}
  onApprovalComplete={() => refetch()}
/>

<WorkflowStatusBadge status={workflow.status} />
```

## Configuration

### Creating Custom Workflows

1. **Define Workflow** in database:
```sql
INSERT INTO workflow_definitions (name, module, document_type, trigger_event)
VALUES ('Custom Approval', 'my_module', 'my_document', 'on_create');
```

2. **Add Workflow Steps**:
```sql
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression, conditions
) VALUES (
  1, 1, 'Manager Approval', 'approval',
  'manager', 'manager_of(document.created_by)',
  '{"field": "amount", "operator": "lt", "value": 5000}'::jsonb
);
```

3. **Integrate into Module**:
```typescript
// In your API route after creating document
await WorkflowEngine.startWorkflow(
  'my_document',
  documentId,
  userId,
  documentData,
  pool
)
```

## Database Schema

### workflow_definitions
- Reusable workflow templates
- Module and document type mapping
- Version control

### workflow_steps
- Sequential or parallel steps
- Conditional logic
- Approver configuration
- Timeout and escalation settings

### workflow_instances
- Active workflow executions
- Current step tracking
- Status and completion tracking

### workflow_approvals
- Pending approval tasks
- Due dates and escalation
- Approver assignments

### workflow_history
- Complete audit trail
- All actions and decisions
- User comments and reasoning

## Best Practices

1. **Always provide meaningful comments** when approving/rejecting
2. **Set realistic timeout periods** for approval steps
3. **Use role-based approvers** for flexibility
4. **Test workflows** with sample documents before production
5. **Monitor pending approvals** regularly
6. **Configure escalation paths** for critical workflows
7. **Document custom workflows** for team understanding

## API Reference

### GET /api/workflows/approvals
Get pending approvals for a user.

**Query Parameters:**
- `user_id` (required): UUID of the user
- `status` (optional): Filter by status (default: 'pending')

**Response:**
```json
{
  "success": true,
  "approvals": [
    {
      "approval_id": 1,
      "workflow_name": "Purchase Order Approval",
      "document_type": "purchase_order",
      "document_id": 123,
      "step_name": "Manager Approval",
      "due_at": "2025-12-15T10:00:00Z"
    }
  ]
}
```

### POST /api/workflows/approvals/{id}/approve
Approve a workflow step.

**Body:**
```json
{
  "user_id": "user-uuid",
  "comments": "Approved - budget verified"
}
```

### POST /api/workflows/approvals/{id}/reject
Reject a workflow.

**Body:**
```json
{
  "user_id": "user-uuid",
  "comments": "Budget exceeded for this quarter"
}
```

### POST /api/workflows/approvals/{id}/delegate
Delegate approval to another user.

**Body:**
```json
{
  "user_id": "user-uuid",
  "delegate_to_user_id": "other-user-uuid",
  "comments": "Out of office - delegating to team lead"
}
```

## Troubleshooting

### Workflow Not Starting
1. Check if workflow definition exists for document_type
2. Verify workflow is active (`is_active = true`)
3. Check database logs for errors
4. Ensure user permissions are correct

### Approvals Not Appearing
1. Verify approver resolution logic
2. Check if conditions are being met
3. Ensure workflow_approvals records are created
4. Check user ID matches approver_id

### Step Not Progressing
1. Check if all required approvals are complete
2. Verify `require_all_approvals` setting
3. Check for rejected approvals
4. Review workflow_history for debugging

## Future Enhancements

- [ ] Email notifications for pending approvals
- [ ] SMS notifications for urgent approvals
- [ ] Workflow analytics and reporting
- [ ] Workflow designer UI
- [ ] Mobile app integration
- [ ] Conditional branching (if/else paths)
- [ ] Workflow versioning and rollback
- [ ] Integration with external approval systems
- [ ] Automated actions (e.g., send email, create document)
- [ ] SLA tracking and monitoring

## Support

For issues or questions:
1. Check this documentation
2. Review database logs
3. Check workflow_history table for audit trail
4. Contact development team

---

**Version:** 1.0.0  
**Last Updated:** December 12, 2025  
**Modules Integrated:** 7  
**Status:** Production Ready ✅
