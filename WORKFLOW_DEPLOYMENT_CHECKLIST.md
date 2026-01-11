# Workflow Engine - Deployment Checklist

## Pre-Deployment

### ✅ Code Review
- [ ] Review `apps/v4/lib/workflow-engine.ts` for logic correctness
- [ ] Verify API routes handle errors properly
- [ ] Check UI components render correctly
- [ ] Validate TypeScript types are correct
- [ ] Ensure imports resolve properly

### ✅ Database Preparation
- [ ] Backup current database
- [ ] Test migrations on development database first
- [ ] Verify no conflicts with existing tables
- [ ] Check indexes are created properly
- [ ] Validate foreign key relationships

---

## Deployment Steps

### 1. Database Migration

```bash
# Connect to database
psql -h localhost -U postgres -d ocean-erp

# Run workflow system schema
\i database/030_workflow_automation_system.sql

# Seed workflow definitions
\i database/034_seed_workflow_definitions.sql

# Verify tables created
\dt workflow_*

# Check workflow definitions
SELECT id, name, module, document_type FROM workflow_definitions;
```

**Expected Output:**
- 10 workflow tables created
- 7 workflow definitions inserted
- 18 workflow steps configured

- [ ] Schema migration successful
- [ ] Seed data inserted
- [ ] All indexes created
- [ ] No errors in logs

---

### 2. Role Configuration

**Required Roles:**
```sql
-- Verify these roles exist in your system
SELECT name FROM roles WHERE name IN (
  'procurement_manager',
  'finance_director',
  'finance_manager',
  'sales_manager',
  'sales_director',
  'ceo',
  'hr_manager',
  'warehouse_manager',
  'inventory_controller',
  'quality_manager',
  'production_manager',
  'asset_manager'
);
```

**Create Missing Roles:**
```sql
-- Example:
INSERT INTO roles (id, name, description)
VALUES 
  (gen_random_uuid(), 'procurement_manager', 'Procurement Manager'),
  (gen_random_uuid(), 'finance_director', 'Finance Director')
ON CONFLICT (name) DO NOTHING;
```

- [ ] All required roles exist
- [ ] Roles have appropriate permissions
- [ ] Users assigned to roles

---

### 3. Test Users Setup

**Create Test Users for Each Role:**
```sql
-- Example: Assign user to role
INSERT INTO user_roles (user_id, role_id)
SELECT 
  u.id,
  r.id
FROM users u
CROSS JOIN roles r
WHERE u.email = 'test.manager@company.com'
  AND r.name = 'procurement_manager';
```

- [ ] Test users created
- [ ] Users assigned to roles
- [ ] Manager hierarchies configured (if using HRIS)

---

### 4. Application Deployment

**Backend:**
```bash
# Navigate to app directory
cd apps/v4

# Install dependencies (if needed)
pnpm install

# Build application
pnpm build

# Restart application
pm2 restart ocean-erp
# or
pnpm start
```

- [ ] Application builds successfully
- [ ] No TypeScript errors
- [ ] Server starts without errors
- [ ] API routes accessible

---

### 5. Verification Tests

#### Test 1: Workflow Definition Check
```bash
curl http://localhost:4000/api/workflows/definitions
```
**Expected:** List of 7 workflow definitions

- [ ] API returns workflow definitions
- [ ] All 7 workflows present
- [ ] Workflows marked as active

#### Test 2: Create Test Document
```bash
# Create a test purchase order
curl -X POST http://localhost:4000/api/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "po_number": "TEST-001",
    "supplier_id": 1,
    "total_amount": 15000,
    "created_by": "user-uuid",
    "status": "Pending Approval"
  }'
```

- [ ] Document created successfully
- [ ] Workflow instance created
- [ ] Approval tasks generated

#### Test 3: Check Workflow Instance
```sql
SELECT * FROM workflow_instances 
WHERE document_type = 'purchase_order' 
ORDER BY created_at DESC LIMIT 1;
```

- [ ] Instance record exists
- [ ] Status is 'in_progress' or 'pending'
- [ ] Current step ID is set

#### Test 4: Verify Approvals
```sql
SELECT * FROM workflow_approvals 
WHERE instance_id = (
  SELECT id FROM workflow_instances 
  ORDER BY created_at DESC LIMIT 1
);
```

- [ ] Approval records created
- [ ] Approver assigned correctly
- [ ] Status is 'pending'

#### Test 5: Test Approval Flow
```bash
# Get approval ID
APPROVAL_ID=$(psql -t -c "SELECT id FROM workflow_approvals WHERE status='pending' LIMIT 1")

# Approve
curl -X POST http://localhost:4000/api/workflows/approvals/$APPROVAL_ID/approve \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "approver-uuid",
    "comments": "Test approval"
  }'
```

- [ ] Approval processes successfully
- [ ] Workflow advances to next step (or completes)
- [ ] History record created

#### Test 6: UI Components
**Manual Test:**
1. Navigate to `/erp/workflows/approvals`
2. Verify page loads
3. Check pending approvals display
4. Test approve/reject buttons

- [ ] Approval page loads
- [ ] Pending approvals shown
- [ ] Approve/reject buttons work
- [ ] Comments field functions

---

### 6. Integration Verification

#### Purchase Orders
- [ ] Create PO → workflow starts
- [ ] Approval routing correct based on amount
- [ ] Approval updates PO status

#### Quotations
- [ ] Create quotation → workflow starts
- [ ] Approval routing correct based on value
- [ ] Approval updates quotation status

#### Other Modules (if implemented)
- [ ] Leave requests workflow
- [ ] Expense claims workflow
- [ ] Inventory adjustments workflow
- [ ] Quality inspections workflow
- [ ] Asset transfers workflow

---

## Post-Deployment

### 7. Performance Monitoring

```sql
-- Check workflow performance
SELECT 
  wd.name,
  COUNT(wi.id) as total_instances,
  COUNT(CASE WHEN wi.status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN wi.status = 'rejected' THEN 1 END) as rejected,
  COUNT(CASE WHEN wi.status = 'in_progress' THEN 1 END) as in_progress,
  AVG(EXTRACT(EPOCH FROM (wi.completed_at - wi.initiated_at))/3600) as avg_hours
FROM workflow_definitions wd
LEFT JOIN workflow_instances wi ON wd.id = wi.workflow_id
GROUP BY wd.id, wd.name;
```

- [ ] Workflows completing successfully
- [ ] Average approval time acceptable
- [ ] No stuck workflows
- [ ] Database queries performant

### 8. User Training

**Prepare:**
- [ ] User guide distributed
- [ ] Demo session scheduled
- [ ] FAQs prepared
- [ ] Support contact info provided

**Train on:**
- [ ] Viewing pending approvals
- [ ] Approving/rejecting documents
- [ ] Adding comments
- [ ] Delegating approvals
- [ ] Understanding workflow status

### 9. Monitoring Setup

**Set up alerts for:**
- [ ] Workflows stuck > 7 days
- [ ] Approval SLA breaches
- [ ] High rejection rates
- [ ] Database errors
- [ ] API failures

**Dashboard Metrics:**
- [ ] Total active workflows
- [ ] Average approval time
- [ ] Approval vs rejection ratio
- [ ] Top approvers by volume
- [ ] Workflows by status

### 10. Documentation

- [ ] Update system documentation
- [ ] Create workflow diagrams
- [ ] Document approval thresholds
- [ ] Record role assignments
- [ ] Publish API documentation

---

## Rollback Plan (If Needed)

### Emergency Rollback

**1. Stop application**
```bash
pm2 stop ocean-erp
```

**2. Restore database backup**
```bash
psql -d ocean-erp < backup_before_workflow.sql
```

**3. Revert code changes**
```bash
git revert {commit-hash}
git push
```

**4. Restart application**
```bash
pm2 start ocean-erp
```

- [ ] Rollback procedure documented
- [ ] Backup verified
- [ ] Team notified of rollback
- [ ] Root cause identified

---

## Success Criteria

### Must Have (Go/No-Go)
- ✅ All database migrations successful
- ✅ No critical errors in logs
- ✅ Test workflows complete end-to-end
- ✅ API endpoints respond correctly
- ✅ UI components render properly

### Should Have
- ✅ All 7 workflows configured
- ✅ Role assignments complete
- ✅ Performance acceptable (< 1s response time)
- ✅ User training materials ready
- ✅ Monitoring dashboard setup

### Nice to Have
- ✅ Email notifications configured
- ✅ Mobile-responsive UI
- ✅ Analytics dashboard
- ✅ Automated tests passing
- ✅ Documentation complete

---

## Issue Log

### Known Issues
| Issue | Severity | Workaround | Status |
|-------|----------|------------|--------|
| _None yet_ | - | - | - |

### Deployment Notes
| Date | Note | By |
|------|------|-----|
| 2025-12-12 | Initial deployment | Dev Team |

---

## Sign-Off

### Deployment Approval

**Developer:**
- Name: _________________
- Date: _________________
- Signature: _________________

**QA:**
- Name: _________________
- Date: _________________
- Signature: _________________

**Product Owner:**
- Name: _________________
- Date: _________________
- Signature: _________________

---

## Contact Information

**For Technical Issues:**
- Developer: dev-team@company.com
- On-call: +1-XXX-XXX-XXXX

**For Business Issues:**
- Product Owner: product@company.com
- Support: support@company.com

---

## Post-Deployment Review (7 Days)

**Schedule:** _________________

**Review:**
- [ ] User feedback collected
- [ ] Performance metrics analyzed
- [ ] Issues identified and logged
- [ ] Improvements planned
- [ ] Documentation updated

---

**Deployment Date:** _________________  
**Version:** 1.0.0  
**Status:** ⏳ Pending / ✅ Complete / ❌ Rollback
