# HRIS CRUD Implementation Plan

## Current Status
All 6 HRIS modules (Employees, Recruitment, Payroll, Performance, Training, Leave) currently have **READ-ONLY** functionality. They can display data but cannot create, update, or delete records.

## What Needs to Be Added

### 1. **Employees Module** (`/apps/v4/app/(erp)/erp/hris/employees/page.tsx`)

#### CREATE:
- ✅ "Add Employee" button exists but needs functional dialog
- Need form with fields:
  - First Name, Last Name, Email
  - Department (dropdown from departments table)
  - Position (dropdown from positions table)
  - Employment Type (Full-time, Part-time, Contract, Intern)
  - Employment Status (Active, Probation, Notice, Terminated, Resigned)
  - Hire Date (date picker)
  - Phone, Address
  - Basic Salary
  - NPWP (Tax ID)
  - BPJS settings (checkboxes for 5 types)
- API: POST /api/hris/employees

#### UPDATE:
- ✅ "Edit" button exists but routes to non-existent page
- Need dialog with same form as CREATE, pre-filled with current data
- API: PUT /api/hris/employees/[id]

#### DELETE:
- ✅ "Terminate" button exists but does nothing
- Need confirmation dialog
- API: DELETE /api/hris/employees/[id] or PUT to change status

### 2. **Recruitment Module** (`/apps/v4/app/(erp)/erp/hris/recruitment/page.tsx`)

#### CREATE (Job Postings):
- ✅ "Post New Job" button exists but needs dialog
- Need form with fields:
  - Job Title
  - Department (dropdown)
  - Position (dropdown)
  - Employment Type
  - Location
  - Salary Range (min/max)
  - Number of Openings
  - Job Description
  - Requirements
  - Closing Date
- API: POST /api/hris/recruitment/jobs

#### UPDATE (Applications):
- Need ability to update application status
- Status options: New, Screening, Interview, Offer, Hired, Rejected
- Stage options: Applied, Phone Screen, Technical, Final, Offer, Hired
- API: PUT /api/hris/recruitment/applications/[id]

#### CREATE (Interviews):
- Need "Schedule Interview" button
- Form fields: Date, Time, Interviewer, Type, Location/Link
- API: POST /api/hris/recruitment/interviews

### 3. **Payroll Module** (`/apps/v4/app/(erp)/erp/hris/payroll/page.tsx`)

#### CREATE (Payroll Period):
- Need "Create Period" button
- Form fields:
  - Period Name (e.g., "January 2025")
  - Start Date, End Date
  - Payment Date
  - Auto-generate payroll records for all active employees
- API: POST /api/hris/payroll/periods

#### UPDATE (Payroll Records):
- Need "Edit" button for individual payroll records
- Allow editing:
  - Basic Salary
  - Allowances (Transport, Meal, Housing)
  - Overtime Pay
  - Other Deductions
  - BPJS and Tax calculated automatically
- API: PUT /api/hris/payroll/records/[id]

#### PROCESS:
- Need "Process Payroll" button to change status from Draft → Processed → Paid
- API: PUT /api/hris/payroll/periods/[id]/process

### 4. **Performance Module** (`/apps/v4/app/(erp)/erp/hris/performance/page.tsx`)

#### CREATE (Performance Review):
- Need "Create Review" button
- Form fields:
  - Employee (dropdown)
  - Review Period (Q1, Q2, Q3, Q4, Annual)
  - Review Date
  - Reviewer (dropdown)
  - Overall Rating (1-5 stars)
  - Comments
- API: POST /api/hris/performance/reviews

#### UPDATE:
- Need "Edit" button to update ratings and comments
- API: PUT /api/hris/performance/reviews/[id]

#### DELETE:
- Need "Delete" button with confirmation
- API: DELETE /api/hris/performance/reviews/[id]

### 5. **Training Module** (`/apps/v4/app/(erp)/erp/hris/training/page.tsx`)

#### CREATE (Training Program):
- Need "Create Program" button
- Form fields:
  - Program Name
  - Description
  - Category (Technical, Soft Skills, Leadership, Compliance)
  - Duration (hours)
  - Capacity (max participants)
  - Instructor
  - Start Date, End Date
  - Location/Platform
  - Cost per Participant
- API: POST /api/hris/training/programs

#### CREATE (Enrollment):
- Need "Enroll Employee" button
- Select employee, assign to program
- API: POST /api/hris/training/enrollments

#### UPDATE (Completion):
- Need "Mark as Complete" button
- Update status and completion date
- API: PUT /api/hris/training/enrollments/[id]

### 6. **Leave Module** (`/apps/v4/app/(erp)/erp/hris/leave/page.tsx`)

#### CREATE (Leave Request):
- Need "Request Leave" button
- Form fields:
  - Leave Type (dropdown: Annual, Sick, Maternity, Paternity, etc.)
  - Start Date, End Date
  - Number of Days (auto-calculate)
  - Reason/Notes
  - Attachment (optional)
- API: POST /api/hris/leave/requests

#### UPDATE (Approval):
- Need "Approve" and "Reject" buttons
- Add approval notes
- Update status and approver info
- API: PUT /api/hris/leave/requests/[id]/approve or /reject

#### DELETE:
- Need "Cancel" button (only for pending requests)
- API: DELETE /api/hris/leave/requests/[id]

## API Routes That Need UPDATE/DELETE Methods

All current API routes only have GET and POST. Need to add:

1. `/api/hris/employees/[id]/route.ts` - PUT, DELETE
2. `/api/hris/recruitment/jobs/[id]/route.ts` - PUT, DELETE
3. `/api/hris/recruitment/applications/[id]/route.ts` - PUT
4. `/api/hris/payroll/periods/[id]/route.ts` - PUT
5. `/api/hris/payroll/records/[id]/route.ts` - PUT
6. `/api/hris/performance/reviews/[id]/route.ts` - PUT, DELETE
7. `/api/hris/training/programs/[id]/route.ts` - PUT, DELETE
8. `/api/hris/training/enrollments/[id]/route.ts` - PUT
9. `/api/hris/leave/requests/[id]/route.ts` - PUT, DELETE

## Implementation Priority

1. **Employees** - Most critical, foundation for other modules
2. **Leave** - High user demand, frequent operations
3. **Payroll** - Critical for monthly operations
4. **Recruitment** - Important for hiring process
5. **Performance** - Quarterly/annual operations
6. **Training** - Less frequent but important

## Technical Requirements

### Frontend:
- Use shadcn/ui Dialog components for forms
- Add form validation (required fields, email format, date ranges)
- Add loading states during API calls
- Show success/error toasts after operations
- Refresh data after successful create/update/delete
- Add confirmation dialogs for destructive actions

### Backend:
- Implement proper validation in API routes
- Use transactions for related operations
- Return proper HTTP status codes (200, 201, 400, 404, 500)
- Handle foreign key constraints
- Add error logging
- Validate user permissions (future enhancement)

### Database:
- Ensure foreign key relationships are correct
- Add necessary indexes for performance
- Consider soft deletes (is_deleted flag) instead of hard deletes

## Estimated Complexity

- **Simple**: Leave, Training enrollments (just status updates)
- **Medium**: Performance, Recruitment applications
- **Complex**: Employees (many fields), Payroll (calculations), Training programs

## Next Steps

1. Start with Employees module - add CREATE dialog
2. Add UPDATE dialog (reuse form)
3. Add DELETE confirmation
4. Create API routes for PUT/DELETE
5. Test thoroughly
6. Repeat for other modules
