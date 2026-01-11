# Module Integration Guide - Workflow Automation

This guide shows how to integrate workflow automation into existing Ocean ERP modules.

---

## 📦 Purchase Orders Integration

### Trigger approval workflow when PO is created above $10,000

**File:** `apps/v4/app/api/purchase-orders/route.ts`

```typescript
import { startWorkflow, shouldTriggerWorkflow, sendNotification } from '@/lib/workflow-helpers';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { supplier_id, items, total_amount, created_by } = body;

  // Create purchase order
  const result = await query(
    `INSERT INTO purchase_orders (supplier_id, total_amount, status, created_by)
    VALUES ($1, $2, 'pending_approval', $3)
    RETURNING *`,
    [supplier_id, total_amount, created_by]
  );

  const purchaseOrder = result.rows[0];

  // Check if workflow should be triggered
  if (total_amount >= 10000) {
    const workflowId = await shouldTriggerWorkflow('purchase', 'purchase_order', 'on_create');
    
    if (workflowId) {
      try {
        await startWorkflow({
          workflowId,
          documentType: 'purchase_order',
          documentId: purchaseOrder.id,
          initiatedBy: created_by,
          metadata: {
            total_amount,
            supplier_id,
            requires_approval: true
          }
        });

        // Notify user that approval is required
        await sendNotification({
          userId: created_by,
          type: 'info',
          title: 'Approval Required',
          message: `Purchase Order #${purchaseOrder.id} has been submitted for approval`,
          link: `/erp/purchase-orders/${purchaseOrder.id}`
        });

        console.log(`Workflow started for PO #${purchaseOrder.id}`);
      } catch (error) {
        console.error('Failed to start workflow:', error);
        // Continue even if workflow fails - don't block PO creation
      }
    }
  }

  return NextResponse.json({ success: true, purchaseOrder });
}
```

---

## 💰 Expenses Integration

### Auto-approve expenses under $100, require approval for higher amounts

**File:** `apps/v4/app/api/expenses/route.ts`

```typescript
import { startWorkflow, executeBusinessRules, sendNotification } from '@/lib/workflow-helpers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { employee_id, amount, category, description, created_by } = body;

  // Create expense
  const result = await query(
    `INSERT INTO expenses (employee_id, amount, category, description, status, created_by)
    VALUES ($1, $2, $3, $4, 'pending', $5)
    RETURNING *`,
    [employee_id, amount, category, description, created_by]
  );

  const expense = result.rows[0];

  // Auto-approve small expenses
  if (amount < 100) {
    await query(
      `UPDATE expenses SET status = 'approved', approved_at = NOW() WHERE id = $1`,
      [expense.id]
    );

    await sendNotification({
      userId: created_by,
      type: 'success',
      title: 'Expense Auto-Approved',
      message: `Your expense of $${amount} has been automatically approved`,
      link: `/erp/expenses/${expense.id}`
    });
  } else {
    // Start approval workflow for larger expenses
    const workflowId = await shouldTriggerWorkflow('expenses', 'expense', 'on_create');
    
    if (workflowId) {
      await startWorkflow({
        workflowId,
        documentType: 'expense',
        documentId: expense.id,
        initiatedBy: created_by,
        metadata: { amount, category }
      });
    }
  }

  // Execute business rules (e.g., budget checks, policy violations)
  try {
    await executeBusinessRules({
      module: 'expenses',
      eventType: 'expense_created',
      entityId: expense.id,
      entityType: 'expense',
      data: {
        employee_id,
        amount,
        category,
        description
      }
    });
  } catch (error) {
    console.error('Failed to execute business rules:', error);
  }

  return NextResponse.json({ success: true, expense });
}
```

---

## 📦 Inventory Integration

### Low stock alerts using business rules

**File:** `apps/v4/app/api/inventory/update-stock/route.ts`

```typescript
import { executeBusinessRules } from '@/lib/workflow-helpers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { product_id, quantity_change, reason } = body;

  // Update stock
  const result = await query(
    `UPDATE products 
    SET quantity = quantity + $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *`,
    [quantity_change, product_id]
  );

  const product = result.rows[0];

  // Execute business rules for stock alerts
  try {
    await executeBusinessRules({
      module: 'inventory',
      eventType: 'stock_updated',
      entityId: product.id,
      entityType: 'product',
      data: {
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        sku: product.sku,
        product: {
          is_active: product.is_active
        }
      }
    });
  } catch (error) {
    console.error('Failed to execute stock rules:', error);
  }

  return NextResponse.json({ success: true, product });
}
```

**Required Business Rule Setup:**

Create this rule via Admin UI (`/erp/settings/workflows`):

```json
{
  "name": "Low Stock Alert",
  "module": "inventory",
  "event_type": "stock_updated",
  "conditions": {
    "operator": "AND",
    "rules": [
      {"field": "quantity", "operator": "less_than", "value": "10"},
      {"field": "product.is_active", "operator": "equals", "value": true}
    ]
  },
  "actions": [
    {
      "type": "send_email",
      "config": {
        "to_email": "inventory@company.com",
        "subject": "Low Stock Alert: {{product_name}}",
        "body": "Product {{product_name}} (SKU: {{sku}}) has only {{quantity}} units left.",
        "priority": "high"
      }
    },
    {
      "type": "create_notification",
      "config": {
        "user_id": "INVENTORY_MANAGER_UUID",
        "notification_type": "warning",
        "title": "Low Stock Alert",
        "message": "{{product_name}} is running low ({{quantity}} units)",
        "link": "/erp/products/{{product_id}}"
      }
    }
  ]
}
```

---

## 💼 Sales Quotations Integration

### Send approval email when quotation is created

**File:** `apps/v4/app/api/quotations/route.ts`

```typescript
import { queueEmail, sendNotification } from '@/lib/workflow-helpers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customer_id, items, total_amount, sales_person_id } = body;

  // Create quotation
  const result = await query(
    `INSERT INTO quotations (customer_id, total_amount, status, sales_person_id)
    VALUES ($1, $2, 'draft', $3)
    RETURNING *`,
    [customer_id, total_amount, sales_person_id]
  );

  const quotation = result.rows[0];

  // Get customer email
  const customerResult = await query(
    `SELECT email, name FROM customers WHERE id = $1`,
    [customer_id]
  );
  const customer = customerResult.rows[0];

  // Queue email to customer
  try {
    await queueEmail({
      toEmail: customer.email,
      toName: customer.name,
      templateCode: 'quotation_created',
      templateVariables: {
        customer_name: customer.name,
        quotation_id: quotation.id,
        total_amount: total_amount.toFixed(2),
        view_link: `https://erp.company.com/quotations/${quotation.id}`
      },
      priority: 'normal'
    });

    // Notify sales person
    await sendNotification({
      userId: sales_person_id,
      type: 'success',
      title: 'Quotation Created',
      message: `Quotation #${quotation.id} for ${customer.name} has been created`,
      link: `/erp/quotations/${quotation.id}`
    });
  } catch (error) {
    console.error('Failed to send notifications:', error);
  }

  return NextResponse.json({ success: true, quotation });
}
```

---

## 👥 HR Leave Requests Integration

### Multi-level approval for leave requests

**File:** `apps/v4/app/api/hr/leave-requests/route.ts`

```typescript
import { startWorkflow, sendNotification } from '@/lib/workflow-helpers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { employee_id, leave_type, start_date, end_date, reason } = body;

  // Create leave request
  const result = await query(
    `INSERT INTO leave_requests 
    (employee_id, leave_type, start_date, end_date, reason, status)
    VALUES ($1, $2, $3, $4, $5, 'pending')
    RETURNING *`,
    [employee_id, leave_type, start_date, end_date, reason]
  );

  const leaveRequest = result.rows[0];

  // Start approval workflow
  const workflowId = await shouldTriggerWorkflow('hr', 'leave_request', 'on_create');
  
  if (workflowId) {
    try {
      await startWorkflow({
        workflowId,
        documentType: 'leave_request',
        documentId: leaveRequest.id,
        initiatedBy: employee_id,
        metadata: {
          leave_type,
          start_date,
          end_date,
          days_count: calculateDays(start_date, end_date)
        }
      });

      await sendNotification({
        userId: employee_id,
        type: 'info',
        title: 'Leave Request Submitted',
        message: `Your leave request from ${start_date} to ${end_date} has been submitted`,
        link: `/erp/hr/leave-requests/${leaveRequest.id}`
      });
    } catch (error) {
      console.error('Failed to start leave approval workflow:', error);
    }
  }

  return NextResponse.json({ success: true, leaveRequest });
}

function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end dates
}
```

---

## 🔧 Common Integration Patterns

### Pattern 1: Conditional Workflow Triggering

```typescript
// Only trigger workflow if conditions are met
if (amount >= threshold) {
  const workflowId = await shouldTriggerWorkflow(module, documentType, 'on_create');
  if (workflowId) {
    await startWorkflow({ /* ... */ });
  }
}
```

### Pattern 2: Workflow + Business Rules

```typescript
// Start workflow for approval
await startWorkflow({ /* ... */ });

// Execute business rules for validation/alerts
await executeBusinessRules({ /* ... */ });
```

### Pattern 3: Error Handling

```typescript
try {
  await startWorkflow({ /* ... */ });
} catch (error) {
  console.error('Workflow failed:', error);
  // Don't block the main operation
  // Log error for investigation
}
```

### Pattern 4: Notification After Workflow Completion

```typescript
// In your approval handler:
if (workflowCompleted) {
  await sendNotification({
    userId: initiator_id,
    type: 'success',
    title: 'Approved',
    message: 'Your request has been approved',
    link: documentLink
  });
}
```

---

## 📝 Setup Checklist

Before integrating workflows into a module:

1. **Create Workflow Definition**
   - Go to `/erp/settings/workflows`
   - Create workflow with appropriate steps
   - Set approvers and timeout rules

2. **Create Email Templates** (if needed)
   - Use API or database to create templates
   - Test template variable substitution

3. **Create Business Rules** (if needed)
   - Define conditions and actions
   - Test rule execution

4. **Update Module Code**
   - Import helper functions
   - Add workflow trigger logic
   - Add error handling
   - Test thoroughly

5. **Test End-to-End**
   - Create test document
   - Verify workflow starts
   - Check notifications sent
   - Test approval flow
   - Verify completion

---

## 🎯 Best Practices

1. **Always use try-catch** - Don't let workflow failures block main operations
2. **Log workflow IDs** - Store `workflow_instance_id` in your document for tracking
3. **Provide user feedback** - Send notifications at key workflow steps
4. **Handle edge cases** - What if no workflow is configured?
5. **Test with real users** - Ensure UUIDs are correct
6. **Monitor performance** - Workflows add database queries
7. **Document workflows** - Keep records of approval chains
8. **Version workflows** - When changing, consider active instances

---

## 🚀 Quick Start

Copy this template into your new API route:

```typescript
import { startWorkflow, shouldTriggerWorkflow, sendNotification } from '@/lib/workflow-helpers';
import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // 1. Create your document
  const result = await query(/* INSERT query */);
  const document = result.rows[0];
  
  // 2. Check if workflow should trigger
  const workflowId = await shouldTriggerWorkflow(
    'YOUR_MODULE',      // e.g., 'purchase'
    'YOUR_DOC_TYPE',    // e.g., 'purchase_order'
    'on_create'         // or 'on_update', 'on_status_change'
  );
  
  // 3. Start workflow if configured
  if (workflowId) {
    try {
      await startWorkflow({
        workflowId,
        documentType: 'YOUR_DOC_TYPE',
        documentId: document.id,
        initiatedBy: body.created_by,
        metadata: { /* any relevant data */ }
      });
      
      // 4. Notify user
      await sendNotification({
        userId: body.created_by,
        type: 'info',
        title: 'Submitted for Approval',
        message: `Your request has been submitted`,
        link: `/erp/YOUR_MODULE/${document.id}`
      });
    } catch (error) {
      console.error('Workflow error:', error);
      // Continue - don't block document creation
    }
  }
  
  return NextResponse.json({ success: true, document });
}
```

---

**Need Help?** Check:
- `WORKFLOW_AUTOMATION_IMPLEMENTATION.md` - Full API documentation
- `WORKFLOW_AUTOMATION_TESTING_GUIDE.md` - Testing examples
- Database tables: `workflow_*`, `email_*`, `business_rules`, `notifications`
