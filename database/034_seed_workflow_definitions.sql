-- =====================================================
-- Ocean ERP - Workflow Definitions Seeding
-- =====================================================
-- This migration seeds default workflow definitions for all modules

-- Clear existing workflow data (for clean reinstall)
TRUNCATE TABLE workflow_history CASCADE;
TRUNCATE TABLE workflow_approvals CASCADE;
TRUNCATE TABLE workflow_instances CASCADE;
TRUNCATE TABLE workflow_steps CASCADE;
TRUNCATE TABLE workflow_definitions CASCADE;

-- =====================================================
-- 1. PURCHASE ORDERS WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Purchase Order Approval',
  'Standard purchase order approval workflow based on amount thresholds',
  'procurement',
  'purchase_order',
  'on_create',
  true,
  1
) RETURNING id AS po_workflow_id \gset

-- Step 1: Department Manager Approval (< $10,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type, 
  approver_type, approver_expression, 
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :po_workflow_id, 1, 'Department Manager Approval', 'approval',
  'manager', 'manager_of(document.created_by)',
  false, true, 48,
  '{"field": "total_amount", "operator": "lt", "value": 10000}'::jsonb
);

-- Step 2: Procurement Manager Approval ($10,000 - $50,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :po_workflow_id, 2, 'Procurement Manager Approval', 'approval',
  'role', 'role:procurement_manager',
  false, true, 48,
  '{"and": [{"field": "total_amount", "operator": "gte", "value": 10000}, {"field": "total_amount", "operator": "lt", "value": 50000}]}'::jsonb
);

-- Step 3: Finance Director Approval (>= $50,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :po_workflow_id, 3, 'Finance Director Approval', 'approval',
  'role', 'role:finance_director',
  false, true, 72,
  '{"field": "total_amount", "operator": "gte", "value": 50000}'::jsonb
);

-- =====================================================
-- 2. QUOTATION APPROVAL WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Quotation Approval',
  'Quotation approval workflow based on total value',
  'sales',
  'quotation',
  'on_create',
  true,
  1
) RETURNING id AS quot_workflow_id \gset

-- Step 1: Sales Manager Approval (< $25,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :quot_workflow_id, 1, 'Sales Manager Approval', 'approval',
  'role', 'role:sales_manager',
  false, true, 24,
  '{"field": "total_value", "operator": "lt", "value": 25000}'::jsonb
);

-- Step 2: Sales Director Approval ($25,000 - $100,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :quot_workflow_id, 2, 'Sales Director Approval', 'approval',
  'role', 'role:sales_director',
  false, true, 48,
  '{"and": [{"field": "total_value", "operator": "gte", "value": 25000}, {"field": "total_value", "operator": "lt", "value": 100000}]}'::jsonb
);

-- Step 3: CEO Approval (>= $100,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :quot_workflow_id, 3, 'CEO Approval', 'approval',
  'role', 'role:ceo',
  false, true, 72,
  '{"field": "total_value", "operator": "gte", "value": 100000}'::jsonb
);

-- =====================================================
-- 3. LEAVE REQUEST WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Leave Request Approval',
  'Employee leave request approval through manager hierarchy',
  'hrm',
  'leave_request',
  'on_create',
  true,
  1
) RETURNING id AS leave_workflow_id \gset

-- Step 1: Direct Manager Approval
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours
) VALUES (
  :leave_workflow_id, 1, 'Manager Approval', 'approval',
  'manager', 'manager_of(document.employee_id)',
  false, true, 24
);

-- Step 2: HR Manager Approval (for extended leave > 5 days)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :leave_workflow_id, 2, 'HR Manager Approval', 'approval',
  'role', 'role:hr_manager',
  false, true, 48,
  '{"field": "days_requested", "operator": "gt", "value": 5}'::jsonb
);

-- =====================================================
-- 4. EXPENSE CLAIM WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Expense Claim Approval',
  'Employee expense claim approval workflow',
  'finance',
  'expense_claim',
  'on_create',
  true,
  1
) RETURNING id AS expense_workflow_id \gset

-- Step 1: Manager Approval (< $1,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :expense_workflow_id, 1, 'Manager Approval', 'approval',
  'manager', 'manager_of(document.employee_id)',
  false, true, 48,
  '{"field": "total_amount", "operator": "lt", "value": 1000}'::jsonb
);

-- Step 2: Finance Manager Approval ($1,000 - $5,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :expense_workflow_id, 2, 'Finance Manager Approval', 'approval',
  'role', 'role:finance_manager',
  false, true, 48,
  '{"and": [{"field": "total_amount", "operator": "gte", "value": 1000}, {"field": "total_amount", "operator": "lt", "value": 5000}]}'::jsonb
);

-- Step 3: Finance Director Approval (>= $5,000)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :expense_workflow_id, 3, 'Finance Director Approval', 'approval',
  'role', 'role:finance_director',
  false, true, 72,
  '{"field": "total_amount", "operator": "gte", "value": 5000}'::jsonb
);

-- =====================================================
-- 5. INVENTORY ADJUSTMENT WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Inventory Adjustment Approval',
  'Stock adjustment approval workflow',
  'inventory',
  'inventory_adjustment',
  'on_create',
  true,
  1
) RETURNING id AS inv_adj_workflow_id \gset

-- Step 1: Warehouse Manager Approval
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours
) VALUES (
  :inv_adj_workflow_id, 1, 'Warehouse Manager Approval', 'approval',
  'role', 'role:warehouse_manager',
  false, true, 24
);

-- Step 2: Inventory Controller Approval (large adjustments)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :inv_adj_workflow_id, 2, 'Inventory Controller Approval', 'approval',
  'role', 'role:inventory_controller',
  false, true, 48,
  '{"field": "adjustment_value", "operator": "gte", "value": 5000}'::jsonb
);

-- =====================================================
-- 6. QUALITY INSPECTION WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Quality Inspection Approval',
  'Quality inspection results approval workflow',
  'quality',
  'quality_inspection',
  'on_complete',
  true,
  1
) RETURNING id AS quality_workflow_id \gset

-- Step 1: Quality Manager Review
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours
) VALUES (
  :quality_workflow_id, 1, 'Quality Manager Review', 'approval',
  'role', 'role:quality_manager',
  false, true, 24
);

-- Step 2: Production Manager Approval (for failures)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :quality_workflow_id, 2, 'Production Manager Approval', 'approval',
  'role', 'role:production_manager',
  false, true, 48,
  '{"field": "result", "operator": "eq", "value": "failed"}'::jsonb
);

-- =====================================================
-- 7. ASSET TRANSFER WORKFLOW
-- =====================================================

INSERT INTO workflow_definitions (name, description, module, document_type, trigger_event, is_active, version)
VALUES (
  'Asset Transfer Approval',
  'Asset transfer between locations approval workflow',
  'assets',
  'asset_transfer',
  'on_create',
  true,
  1
) RETURNING id AS asset_transfer_workflow_id \gset

-- Step 1: Asset Manager Approval
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours
) VALUES (
  :asset_transfer_workflow_id, 1, 'Asset Manager Approval', 'approval',
  'role', 'role:asset_manager',
  false, true, 48
);

-- Step 2: Finance Approval (high-value assets)
INSERT INTO workflow_steps (
  workflow_id, step_order, step_name, step_type,
  approver_type, approver_expression,
  is_parallel, require_all_approvals, timeout_hours,
  conditions
) VALUES (
  :asset_transfer_workflow_id, 2, 'Finance Approval', 'approval',
  'role', 'role:finance_manager',
  false, true, 48,
  '{"field": "asset_value", "operator": "gte", "value": 10000}'::jsonb
);

-- =====================================================
-- SUMMARY
-- =====================================================

-- Display created workflows
SELECT 
  id,
  name,
  module,
  document_type,
  (SELECT COUNT(*) FROM workflow_steps WHERE workflow_id = workflow_definitions.id) as steps_count
FROM workflow_definitions
ORDER BY module, name;

COMMENT ON TABLE workflow_definitions IS 'Workflow definitions seeded with default approval flows for all major modules';
