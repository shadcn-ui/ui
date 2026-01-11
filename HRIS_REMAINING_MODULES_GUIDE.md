# 🚀 HRIS CRUD Quick Implementation Guide

**Status:** Employees ✅ | Recruitment ✅ | Payroll APIs ✅ | 3 modules remaining

This guide provides exact code templates for completing the remaining modules quickly.

---

## 📦 Completed So Far

### ✅ Employees (380 lines) - COMPLETE
- Full CRUD with 10 fields
- Soft delete (status → "Terminated")
- Statistics: Total, Active, Probation, Inactive

### ✅ Recruitment (738 lines) - COMPLETE
- Job postings CRUD (11 fields)
- Applications status updates
- Two tabs: Jobs & Applications
- Statistics: Total Jobs, Published, Total Applications, New Apps

### ✅ Payroll APIs - COMPLETE
- `/api/hris/payroll/periods/[id]/route.ts` (155 lines)
- `/api/hris/payroll/records/[id]/route.ts` (150 lines)

---

## 🎯 Template Pattern (Use for all remaining modules)

### Structure Overview
All modules follow this **exact structure**:

```typescript
"use client";

// 1. IMPORTS (lines 1-38)
import { useState, useEffect } from "react";
import { UI components } from "@/registry/new-york-v4/ui/...";
import { Icons } from "lucide-react";
import { toast } from "sonner";

// 2. INTERFACES (lines 40-80)
interface MainEntity { id, fields... }
interface SubEntity { id, fields... } // If dual entity
interface Lookups { departments, positions, etc }

// 3. COMPONENT STATE (lines 82-120)
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [dialogs, setDialogs] = useState({ create, edit, view, delete });
const [selected, setSelected] = useState(null);
const [formData, setFormData] = useState({ fields });

// 4. DATA FETCHING (lines 122-150)
useEffect(() => { fetchData(); }, []);
const fetchData = async () => { /* API calls */ };

// 5. CRUD HANDLERS (lines 152-300)
const handleCreate = async () => { /* POST */ };
const handleUpdate = async () => { /* PUT */ };
const handleDelete = async () => { /* DELETE */ };
const openEdit = (item) => { /* Populate form */ };

// 6. STATISTICS (lines 302-320)
const total = data.length;
const filtered = data.filter(condition);
const calculated = someCalculation();

// 7. JSX RENDER (lines 322-end)
return (
  <div>
    {/* Header */}
    {/* Statistics Cards (4 cards) */}
    {/* Search Bar */}
    {/* Tabs (if dual entity) */}
    {/* Data Table */}
    {/* Dialogs (Create, Edit, View, Delete) */}
  </div>
);
```

---

## 🔧 Module-Specific Configurations

### 3️⃣ PAYROLL MODULE
**File:** `/apps/v4/app/(erp)/erp/hris/payroll/page.tsx`  
**Lines:** ~500 (more complex due to workflow)

#### Main Entities:
- **PayrollPeriod**: period_name, start_date, end_date, payment_date, status (Draft/Calculated/Approved/Paid)
- **PayrollRecord**: employee_id, basic_salary, allowances, overtime_pay, deductions, tax, gross_salary, net_salary

#### Form Fields:
```typescript
// Period Form
{
  period_name: "", // e.g., "January 2024"
  start_date: "",
  end_date: "",
  payment_date: "",
  status: "Draft" // Workflow: Draft → Calculated → Approved → Paid
}

// Record Form (read-mostly, edit for adjustments)
{
  basic_salary: "",
  allowances: "",
  overtime_pay: "",
  deductions: "",
  tax: "",
  notes: ""
}
```

#### Statistics (4 cards):
- Total Periods
- Processed Periods (Approved/Paid)
- Total Gross Pay (sum of all records in current period)
- Total Net Pay (sum of net_salary)

#### Special Features:
- **Status Workflow Buttons:** 
  ```typescript
  if (status === "Draft") show "Calculate" button
  if (status === "Calculated") show "Approve" button
  if (status === "Approved") show "Mark Paid" button
  ```
- **Period Details Dialog:** Shows all records in that period
- **Edit Record:** Adjust salary components, auto-recalc gross/net

#### Two Tabs:
1. **Periods** - Main payroll periods table
2. **Records** - Individual employee payroll records

---

### 4️⃣ PERFORMANCE MODULE
**File:** `/apps/v4/app/(erp)/erp/hris/performance/page.tsx`  
**Lines:** ~350

#### Main Entity:
- **PerformanceReview**: employee_id, review_period (Q1/Q2/Q3/Q4/Annual), review_date, rating (1-5), reviewer_id, comments, status (Draft/Completed)

#### Form Fields:
```typescript
{
  employee_id: "",
  review_period: "Q1", // Select: Q1, Q2, Q3, Q4, Annual
  review_date: "",
  rating: "", // Number 1-5 (use star input or number)
  reviewer_id: "", // Current user or select reviewer
  comments: "",
  goals_achieved: "",
  areas_for_improvement: "",
  status: "Draft"
}
```

#### Statistics (4 cards):
- Total Reviews
- Completed Reviews
- Average Rating (calculate mean of all completed)
- Pending Reviews (Draft status)

#### Special Features:
- **5-Star Rating Display:** 
  ```typescript
  {Array.from({length: 5}).map((_, i) => (
    <Star key={i} className={i < rating ? "fill-yellow-500" : ""} />
  ))}
  ```
- **Employee Selector:** Dropdown with employees
- **Period Selector:** Q1 2024, Q2 2024, etc.

#### Single Entity (No tabs)

---

### 5️⃣ TRAINING MODULE
**File:** `/apps/v4/app/(erp)/erp/hris/training/page.tsx`  
**Lines:** ~380

#### Main Entities:
- **TrainingProgram**: program_name, description, duration (hours), capacity, start_date, end_date, status (Draft/Active/Completed)
- **TrainingEnrollment**: program_id, employee_id, enrollment_date, completion_date, status (Enrolled/In Progress/Completed/Cancelled), score, certificate_issued

#### Form Fields:
```typescript
// Program Form
{
  program_name: "",
  description: "",
  duration: "", // Hours
  capacity: "", // Max participants
  start_date: "",
  end_date: "",
  trainer_name: "",
  status: "Draft"
}

// Enrollment Form (mainly status updates)
{
  status: "", // Enrolled → In Progress → Completed/Cancelled
  enrollment_date: "",
  completion_date: "",
  score: "",
  certificate_issued: false,
  notes: ""
}
```

#### Statistics (4 cards):
- Total Programs
- Active Programs
- Total Enrollments
- Completion Rate (Completed / Total * 100)

#### Special Features:
- **Capacity Warning:** If enrollments >= capacity, show badge "Full"
- **Progress Tracking:** Show completion % per program
- **Certificate Badge:** Show checkmark if certificate_issued = true

#### Two Tabs:
1. **Programs** - Training program catalog
2. **Enrollments** - Employee enrollment records

---

### 6️⃣ LEAVE MODULE
**File:** `/apps/v4/app/(erp)/erp/hris/leave/page.tsx`  
**Lines:** ~420

#### Main Entity:
- **LeaveRequest**: employee_id, leave_type_id, start_date, end_date, days_requested, reason, status (Pending/Approved/Rejected/Cancelled), approver_id, approver_notes, approved_date

#### Form Fields:
```typescript
{
  employee_id: "",
  leave_type_id: "", // From leave_types: Annual, Sick, Maternity, etc.
  start_date: "",
  end_date: "",
  days_requested: "", // Auto-calc from date range
  reason: "",
  status: "Pending" // Workflow: Pending → Approved/Rejected
}

// Approval Form (manager view)
{
  status: "Approved", // or Rejected
  approver_notes: "",
  approved_date: new Date()
}
```

#### Statistics (4 cards):
- Total Requests
- Pending Requests
- Approved Requests
- Rejected Requests

#### Special Features:
- **Balance Check:** 
  ```typescript
  const balance = await fetch(`/api/hris/leave/balances/${employee_id}`);
  if (days_requested > balance.available) {
    toast.error("Insufficient leave balance");
  }
  ```
- **Approve/Reject Buttons:** Special action buttons in table
- **Date Range Calc:** Auto-calculate days_requested from dates
- **Color Coding:** 
  - Pending: Yellow
  - Approved: Green
  - Rejected: Red
  - Cancelled: Gray

#### Single Entity (No tabs needed)

---

## 🎨 Common UI Elements

### Status Badge Colors
```typescript
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    // Universal
    Active: "bg-green-500",
    Inactive: "bg-gray-500",
    Draft: "bg-gray-500",
    Pending: "bg-yellow-500",
    Completed: "bg-green-500",
    Cancelled: "bg-red-500",
    
    // Payroll
    Calculated: "bg-blue-500",
    Approved: "bg-purple-500",
    Paid: "bg-green-500",
    
    // Recruitment
    Published: "bg-green-500",
    Closed: "bg-red-500",
    New: "bg-blue-500",
    Screening: "bg-yellow-500",
    Interview: "bg-purple-500",
    Offer: "bg-orange-500",
    Hired: "bg-green-500",
    Rejected: "bg-red-500",
    
    // Leave
    "In Progress": "bg-blue-500",
  };
  return colors[status] || "bg-gray-500";
};
```

### Statistics Card Template
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Card Title</CardTitle>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
  </CardContent>
</Card>
```

### Dialog Template
```tsx
<Dialog open={createOpen} onOpenChange={setCreateOpen}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Create {Entity}</DialogTitle>
      <DialogDescription>Add new {entity}</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form fields */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleCreate}>Create</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## ⚡ Quick API Checklist

### Performance Module - Need to create:
- ✅ List: `/api/hris/performance/reviews/route.ts` (already exists?)
- ⏳ CRUD: `/api/hris/performance/reviews/[id]/route.ts` (170 lines)

### Training Module - Need to create:
- ✅ List programs: `/api/hris/training/programs/route.ts`
- ⏳ CRUD programs: `/api/hris/training/programs/[id]/route.ts` (160 lines)
- ✅ List enrollments: `/api/hris/training/enrollments/route.ts`
- ⏳ CRUD enrollments: `/api/hris/training/enrollments/[id]/route.ts` (140 lines)

### Leave Module - Need to create:
- ✅ List: `/api/hris/leave/requests/route.ts`
- ⏳ CRUD: `/api/hris/leave/requests/[id]/route.ts` (180 lines)
- ⏳ Balance check: `/api/hris/leave/balances/[employee_id]/route.ts` (50 lines)

---

## 🚦 Implementation Priority

1. **PAYROLL PAGE** (most complex, 500 lines) - NEXT
2. **LEAVE PAGE** (high frequency use, 420 lines)
3. **PERFORMANCE PAGE** (quarterly use, 350 lines)
4. **TRAINING PAGE** (moderate use, 380 lines)

---

## ⏱️ Time Estimates

| Module | APIs | Page | Testing | Total |
|--------|------|------|---------|-------|
| Payroll | ✅ Done | 45 min | 10 min | 55 min |
| Performance | 20 min | 30 min | 10 min | 60 min |
| Training | 25 min | 35 min | 10 min | 70 min |
| Leave | 25 min | 40 min | 10 min | 75 min |

**Total remaining: ~4.3 hours**

---

## ✅ Completion Checklist

### For Each Module:
- [ ] Create API [id] routes (GET, PUT, DELETE)
- [ ] Backup original page to `.readonly.backup`
- [ ] Create new CRUD page with correct imports
- [ ] Add Create dialog with form validation
- [ ] Add Edit dialog (pre-filled form)
- [ ] Add View dialog (read-only details)
- [ ] Add Delete dialog with confirmation
- [ ] Implement search/filter
- [ ] Add 4 statistics cards
- [ ] Test compilation (no errors)
- [ ] Test runtime (CRUD operations work)

### Final Testing:
- [ ] Create operation works for all modules
- [ ] Edit operation saves changes
- [ ] Delete has confirmation and works
- [ ] Search filters data correctly
- [ ] Statistics calculate properly
- [ ] Toast notifications appear
- [ ] No console errors
- [ ] Responsive design works

---

## 🔗 Reference Files

- **Template:** `/apps/v4/app/(erp)/erp/hris/employees/page.tsx`
- **Advanced:** `/apps/v4/app/(erp)/erp/hris/recruitment/page.tsx`
- **API Pattern:** `/api/hris/employees/[id]/route.ts`

---

**Last Updated:** After Payroll APIs completion  
**Next Step:** Create Payroll page (~500 lines) or delegate remaining to developer with this guide
