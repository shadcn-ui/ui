# 📡 Ocean ERP API Reference

**Version:** 4.0.0  
**Base URL:** `http://localhost:4000/api` (Development)  
**Production URL:** `https://api.ocean-erp.com/v4`

---

## 🚀 Quick Start

### Making Your First API Call

```bash
# List all projects
curl http://localhost:4000/api/projects

# Create a new lead
curl -X POST http://localhost:4000/api/crm/leads \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "lead_source": "website"
  }'

# Get project analytics
curl http://localhost:4000/api/projects/analytics?type=dashboard
```

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Rate Limiting](#rate-limiting)
3. [Error Handling](#error-handling)
4. [Pagination](#pagination)
5. [Filtering & Search](#filtering--search)
6. [API Endpoints](#api-endpoints)
   - [CRM APIs](#crm-apis)
   - [Sales APIs](#sales-apis)
   - [Support APIs](#support-apis)
   - [Marketing APIs](#marketing-apis)
   - [HRM APIs](#hrm-apis)
   - [Asset APIs](#asset-apis)
   - [E-commerce APIs](#e-commerce-apis)
   - [Project Management APIs](#project-management-apis)
   - [Analytics APIs](#analytics-apis)

---

## 🔐 Authentication

Currently, Ocean ERP APIs are accessible without authentication in development mode. Production deployments should implement one of the following:

### API Key Authentication (Recommended)

```bash
curl -H "X-API-Key: your-api-key-here" \
  http://localhost:4000/api/projects
```

### JWT Authentication (Future)

```bash
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:4000/api/projects
```

---

## ⚡ Rate Limiting

**Limits:**
- 100 requests per minute per IP address
- 200 burst capacity
- Limits apply per endpoint

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1638360000
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

---

## ❌ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Resource already exists
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

---

## 📄 Pagination

All list endpoints support pagination:

**Request:**
```bash
GET /api/projects?page=2&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": true
    }
  }
}
```

**Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

---

## 🔍 Filtering & Search

### Search

Most list endpoints support text search:

```bash
GET /api/crm/leads?search=john
```

Searches across multiple fields (name, email, company, etc.)

### Filtering

Filter by specific fields:

```bash
# Single filter
GET /api/projects?project_status=active

# Multiple filters
GET /api/projects?project_status=active&health_status=at_risk

# Date range
GET /api/projects/time-entries?from_date=2025-01-01&to_date=2025-01-31
```

### Sorting

```bash
GET /api/projects?sort=created_at&order=desc
```

---

## 📡 API Endpoints

---

## 👥 CRM APIs

### Leads

#### List Leads
```http
GET /api/crm/leads
```

**Query Parameters:**
- `page` (integer) - Page number
- `limit` (integer) - Items per page
- `search` (string) - Search term
- `lead_status` (string) - Filter by status: new, contacted, qualified, unqualified, converted, lost
- `lead_source` (string) - Filter by source: website, referral, cold_call, social_media, event
- `is_active` (boolean) - Filter active leads

**Response:**
```json
{
  "success": true,
  "data": {
    "leads": [
      {
        "lead_id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-0100",
        "company_name": "Tech Corp",
        "job_title": "CTO",
        "lead_source": "website",
        "lead_status": "new",
        "lead_score": 75,
        "estimated_value": 50000.00,
        "created_at": "2025-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    },
    "statistics": {
      "total_leads": 150,
      "by_status": {
        "new": 50,
        "contacted": 30,
        "qualified": 40,
        "converted": 20,
        "lost": 10
      },
      "avg_lead_score": 65,
      "total_estimated_value": 2500000
    }
  }
}
```

#### Create Lead
```http
POST /api/crm/leads
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-0100",
  "company_name": "Tech Corp",
  "job_title": "CTO",
  "lead_source": "website",
  "industry": "Technology",
  "estimated_value": 50000,
  "notes": "Interested in ERP solution",
  "created_by": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "lead_id": 151,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "lead_status": "new",
    "created_at": "2025-01-15T14:30:00Z"
  },
  "message": "Lead created successfully"
}
```

#### Get Lead by ID
```http
GET /api/crm/leads/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lead_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "interactions": [
      {
        "interaction_id": 1,
        "interaction_type": "call",
        "subject": "Initial contact",
        "interaction_date": "2025-01-02T09:00:00Z"
      }
    ],
    "activities": [
      {
        "activity_type": "status_change",
        "description": "Status changed to contacted",
        "created_at": "2025-01-02T09:30:00Z"
      }
    ]
  }
}
```

#### Update Lead
```http
PUT /api/crm/leads/{id}
```

**Request Body:**
```json
{
  "lead_status": "qualified",
  "lead_score": 85,
  "notes": "Budget confirmed, moving to qualified"
}
```

#### Delete Lead
```http
DELETE /api/crm/leads/{id}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

#### Convert Lead
```http
POST /api/crm/leads/{id}/convert
```

**Request Body:**
```json
{
  "create_contact": true,
  "create_company": true,
  "create_opportunity": true,
  "converted_by": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "contact_id": 45,
    "company_id": 12,
    "opportunity_id": 78
  },
  "message": "Lead converted successfully"
}
```

---

### Contacts

#### List Contacts
```http
GET /api/crm/contacts
```

**Query Parameters:**
- `page`, `limit`, `search`
- `contact_type` (string) - customer, prospect, partner, vendor
- `company_id` (integer) - Filter by company

#### Create Contact
```http
POST /api/crm/contacts
```

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@company.com",
  "phone": "+1-555-0101",
  "company_id": 12,
  "job_title": "VP of Operations",
  "department": "Operations",
  "contact_type": "customer",
  "is_primary": true,
  "created_by": 1
}
```

---

### Companies

#### List Companies
```http
GET /api/crm/companies
```

**Query Parameters:**
- `company_type` (string) - customer, prospect, partner, vendor
- `industry` (string) - Filter by industry

#### Create Company
```http
POST /api/crm/companies
```

**Request Body:**
```json
{
  "company_name": "Tech Innovations Ltd",
  "company_type": "customer",
  "industry": "Technology",
  "company_size": "51-200",
  "annual_revenue": 5000000,
  "website": "https://techinnovations.com",
  "phone": "+1-555-0300",
  "email": "info@techinnovations.com",
  "billing_address": "123 Tech Street",
  "billing_city": "San Francisco",
  "billing_state": "CA",
  "billing_postal_code": "94105",
  "billing_country": "USA",
  "created_by": 1
}
```

---

### Interactions

#### List Interactions
```http
GET /api/crm/interactions
```

**Query Parameters:**
- `lead_id`, `contact_id`, `company_id`
- `interaction_type` (string) - call, email, meeting, note

#### Create Interaction
```http
POST /api/crm/interactions
```

**Request Body:**
```json
{
  "lead_id": 1,
  "interaction_type": "call",
  "interaction_date": "2025-01-15T10:00:00Z",
  "subject": "Follow-up call",
  "notes": "Discussed pricing and timeline",
  "outcome": "positive",
  "duration_minutes": 30,
  "next_action": "Send proposal",
  "next_action_date": "2025-01-16",
  "created_by": 1
}
```

---

## 📊 Project Management APIs

### Projects

#### List Projects
```http
GET /api/projects
```

**Query Parameters:**
- `page`, `limit`, `search`
- `project_status` - planning, active, on_hold, completed, cancelled
- `health_status` - on_track, at_risk, delayed, critical
- `project_type` - internal, client, maintenance, development
- `project_manager_id` (integer)
- `customer_id` (integer)

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "project_id": 1,
        "project_code": "PROJ-2025-001",
        "project_name": "ERP Implementation",
        "project_status": "active",
        "health_status": "on_track",
        "completion_percentage": 65,
        "budget_amount": 100000,
        "actual_cost": 45000,
        "budget_variance": 55000,
        "team_size": 5,
        "tasks_total": 50,
        "tasks_completed": 32,
        "days_until_deadline": 45,
        "is_overdue": false
      }
    ],
    "pagination": {...},
    "statistics": {
      "total_projects": 25,
      "active_projects": 15,
      "completed_projects": 8,
      "on_track_projects": 10,
      "at_risk_projects": 3,
      "delayed_projects": 2,
      "total_budget": 2500000,
      "total_actual_cost": 1800000,
      "avg_completion_percentage": 72
    }
  }
}
```

#### Create Project
```http
POST /api/projects
```

**Request Body:**
```json
{
  "project_code": "PROJ-2025-002",
  "project_name": "Website Redesign",
  "project_description": "Complete website redesign and modernization",
  "project_type": "client",
  "project_category": "web_development",
  "customer_id": 5,
  "project_manager_id": 2,
  "planned_start_date": "2025-02-01",
  "planned_end_date": "2025-05-31",
  "budget_amount": 75000,
  "billing_type": "fixed_price",
  "priority": "high",
  "tags": ["website", "redesign", "urgent"],
  "created_by": 1
}
```

#### Get Project Details
```http
GET /api/projects/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "project_id": 1,
    "project_code": "PROJ-2025-001",
    "project_name": "ERP Implementation",
    "completion_percentage": 65,
    "phases": [
      {
        "phase_id": 1,
        "phase_name": "Planning",
        "completion_percentage": 100
      },
      {
        "phase_id": 2,
        "phase_name": "Development",
        "completion_percentage": 60
      }
    ],
    "milestones": [
      {
        "milestone_id": 1,
        "milestone_name": "Requirements Signed Off",
        "milestone_status": "achieved",
        "planned_date": "2025-01-15",
        "actual_date": "2025-01-14"
      }
    ],
    "tasks_summary": {
      "total": 50,
      "todo": 10,
      "in_progress": 8,
      "completed": 32
    },
    "team_members": [
      {
        "user_id": 2,
        "role": "Project Manager",
        "allocation_percentage": 100
      }
    ],
    "budget_breakdown": [
      {
        "category": "labor",
        "budgeted": 60000,
        "actual": 35000,
        "variance": 25000
      }
    ],
    "recent_activities": [...]
  }
}
```

---

### Tasks

#### List Tasks
```http
GET /api/projects/tasks
```

**Query Parameters:**
- `project_id` (integer) - Required or optional filter
- `phase_id` (integer)
- `assigned_to` (integer) - User ID
- `task_status` - todo, in_progress, in_review, blocked, completed, cancelled
- `priority` - low, medium, high, critical
- `is_blocked` (boolean)
- `is_billable` (boolean)

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "task_id": 1,
        "task_code": "TASK-001",
        "task_name": "Setup Development Environment",
        "project_name": "ERP Implementation",
        "phase_name": "Planning",
        "task_status": "completed",
        "priority": "high",
        "completion_percentage": 100,
        "estimated_hours": 16,
        "actual_hours": 14,
        "assigned_to": 2,
        "due_date": "2025-01-05",
        "is_overdue": false,
        "dependency_count": 0,
        "total_hours_logged": 14
      }
    ],
    "statistics": {
      "total_tasks": 50,
      "todo": 10,
      "in_progress": 8,
      "completed": 32,
      "blocked": 0,
      "overdue": 2,
      "total_estimated_hours": 800,
      "total_actual_hours": 520,
      "avg_completion_percentage": 65
    }
  }
}
```

#### Create Task
```http
POST /api/projects/tasks
```

**Request Body:**
```json
{
  "project_id": 1,
  "phase_id": 2,
  "task_name": "Implement Authentication",
  "task_description": "Build JWT-based authentication system",
  "task_type": "feature",
  "priority": "high",
  "estimated_hours": 24,
  "assigned_to": 3,
  "planned_start_date": "2025-01-20",
  "due_date": "2025-01-27",
  "is_billable": true,
  "billable_rate": 150,
  "tags": ["authentication", "security"],
  "created_by": 1
}
```

#### Get Task Details
```http
GET /api/projects/tasks/{id}
```

**Response includes:**
- Complete task information
- Dependencies (tasks this depends on)
- Blocking tasks (tasks depending on this)
- Time entries (last 20)
- Comments (threaded)
- Subtasks (child tasks)

#### Update Task
```http
PUT /api/projects/tasks/{id}
```

**Request Body:**
```json
{
  "task_status": "completed",
  "completion_percentage": 100,
  "actual_hours": 22
}
```

**Smart Handling:**
- Sets `completed_at` when status = 'completed'
- Auto-sets completion_percentage to 100 on completion
- Clears blocking info when is_blocked = false

---

### Time Tracking

#### List Time Entries
```http
GET /api/projects/time-entries
```

**Query Parameters:**
- `project_id`, `task_id`, `user_id`
- `is_billable` (boolean)
- `is_approved` (boolean)
- `is_invoiced` (boolean)
- `from_date`, `to_date` (YYYY-MM-DD)
- `activity_type` - development, design, testing, meeting, documentation

**Response includes statistics:**
- Total entries and hours
- Billable/non-billable breakdown
- Approved/pending hours
- Total billable amount
- Unbilled amount

#### Log Time Entry
```http
POST /api/projects/time-entries
```

**Request Body:**
```json
{
  "project_id": 1,
  "task_id": 5,
  "user_id": 3,
  "entry_date": "2025-01-15",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "hours_worked": 7.5,
  "is_billable": true,
  "billing_rate": 150,
  "work_description": "Implemented authentication module with JWT",
  "activity_type": "development",
  "work_location": "office",
  "is_overtime": false,
  "created_by": 3
}
```

**Validation:**
- hours_worked must be between 0 and 24
- task must belong to project
- Auto-calculates billable_amount

#### Approve Time Entries
```http
PUT /api/projects/time-entries/approve
```

**Bulk Approval (Specific Entries):**
```json
{
  "time_entry_ids": [1, 2, 3, 4, 5],
  "approved_by": 1
}
```

**Bulk Approval (All for User):**
```json
{
  "approve_all_for_user": true,
  "user_id": 3,
  "from_date": "2025-01-01",
  "to_date": "2025-01-07",
  "approved_by": 1
}
```

---

### Resources

#### List Resources
```http
GET /api/projects/resources
```

**Query Parameters:**
- `resource_type` - human, equipment, material, facility, software
- `is_available` (boolean)
- `role` (string)

#### Create Resource
```http
POST /api/projects/resources
```

**Request Body:**
```json
{
  "resource_type": "human",
  "resource_name": "John Developer",
  "user_id": 3,
  "role": "Senior Developer",
  "skill_set": ["JavaScript", "TypeScript", "React", "Node.js"],
  "daily_capacity_hours": 8,
  "weekly_capacity_hours": 40,
  "cost_per_hour": 50,
  "billing_rate_per_hour": 150,
  "is_available": true,
  "location": "San Francisco",
  "timezone": "America/Los_Angeles",
  "created_by": 1
}
```

---

### Budgets

#### List Budgets
```http
GET /api/projects/budgets?project_id=1
```

**Categories:**
- labor, materials, equipment, software, travel, overhead

#### Create Budget
```http
POST /api/projects/budgets
```

**Request Body:**
```json
{
  "project_id": 1,
  "budget_category": "labor",
  "budget_subcategory": "development",
  "budgeted_amount": 50000,
  "description": "Development team labor costs",
  "created_by": 1
}
```

---

### Expenses

#### List Expenses
```http
GET /api/projects/expenses
```

**Query Parameters:**
- `project_id`, `expense_status`, `submitted_by`
- `expense_category` - Software, Hardware, Travel, Meals, etc.
- `from_date`, `to_date`

#### Submit Expense
```http
POST /api/projects/expenses
```

**Request Body:**
```json
{
  "project_id": 1,
  "task_id": 5,
  "expense_date": "2025-01-15",
  "expense_category": "Software",
  "expense_description": "Development tools license",
  "expense_amount": 500,
  "currency": "USD",
  "submitted_by": 3,
  "vendor_name": "JetBrains",
  "receipt_number": "INV-12345",
  "receipt_url": "https://...",
  "is_billable": true,
  "markup_percentage": 20,
  "is_reimbursable": false
}
```

**Auto-calculates:**
- `billable_amount = expense_amount * (1 + markup_percentage / 100)`

#### Approve/Reject Expenses
```http
PUT /api/projects/expenses/approve
```

**Request Body:**
```json
{
  "expense_ids": [1, 2, 3],
  "action": "approve",
  "approved_by": 1,
  "rejection_reason": null
}
```

---

### Documents

#### List Documents
```http
GET /api/projects/documents?project_id=1
```

#### Upload Document
```http
POST /api/projects/documents
```

**Request Body:**
```json
{
  "project_id": 1,
  "task_id": 5,
  "document_name": "Requirements Specification",
  "document_type": "specification",
  "file_name": "requirements_v1.0.pdf",
  "file_url": "https://storage.../requirements.pdf",
  "file_size_bytes": 1024000,
  "file_type": "application/pdf",
  "version": "1.0",
  "is_latest_version": true,
  "access_level": "project_team",
  "tags": ["requirements", "specification"],
  "uploaded_by": 1
}
```

---

### Analytics

#### Portfolio Dashboard
```http
GET /api/projects/analytics
GET /api/projects/analytics?type=dashboard
```

**Returns:**
- Overall project statistics
- Task statistics
- Milestone summary
- Projects grouped by status and health
- Top projects by budget
- Recent activities

#### Financial Analytics
```http
GET /api/projects/analytics?type=financial&from_date=2025-01-01&to_date=2025-12-31
```

**Returns:**
- Financial summary (budget, cost, variance, billed/unbilled)
- Budget by category
- Expenses by category
- Revenue analysis

#### Resource Analytics
```http
GET /api/projects/analytics?type=resources
```

**Returns:**
- Resource utilization data
- Top performers (last 30 days)
- Team distribution by role

#### Timeline Analytics
```http
GET /api/projects/analytics?type=timeline
```

**Returns:**
- Upcoming deadlines (next 20 projects)
- Overdue projects
- Upcoming milestones

#### Project-Specific Dashboard
```http
GET /api/projects/analytics?project_id=1
```

**Returns:**
- Complete project dashboard
- Gantt chart timeline data
- Budget breakdown
- Team members
- Recent time entries

---

## 📚 Additional Resources

### OpenAPI Specification
- **File:** `/docs/api/openapi.yaml`
- **Swagger UI:** http://localhost:4000/api-docs (when configured)

### Postman Collection
- **File:** `/postman/Ocean-ERP-API.postman_collection.json`
- Import into Postman for easy testing

### Code Examples
- **JavaScript/Node.js:** `/docs/api/examples/javascript`
- **Python:** `/docs/api/examples/python`
- **cURL:** Included in this documentation

---

## 🔄 Changelog

### Version 4.0.0 (December 2025)
- ✅ Added 80+ API endpoints across 9 modules
- ✅ Complete Project Management APIs
- ✅ Comprehensive CRM APIs
- ✅ Full analytics and reporting
- ✅ OpenAPI 3.0 specification

---

*Last Updated: December 4, 2025*  
*Ocean ERP v4 - Complete API Reference*
