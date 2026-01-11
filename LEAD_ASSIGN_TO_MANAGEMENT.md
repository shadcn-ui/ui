# 📋 Lead Management - "Assign To" User Management Guide

**Date:** 25 November 2025  
**Module:** Lead Management → Assign To Field  

---

## 🎯 Where to Manage "Assign To" Users

The **"Assign To"** dropdown in Lead Management shows users from the **Users** table in your database. To add, edit, or delete users who can be assigned to leads, you have **two options**:

---

## ✅ Option 1: User Management Page (Recommended)

### Location
Navigate to: **Settings → User Management**

**URL:** `/erp/settings/users`

**File:** `/apps/v4/app/(erp)/erp/settings/users/page.tsx`

### Current Status
⚠️ **This page is currently a UI mockup** - It shows sample data but is not yet connected to the database.

### What This Page Shows
- List of all users with search functionality
- User details: Name, Email, Role, Status, Last Login
- Action buttons: Edit User, Manage Permissions, Delete User
- "Add New User" button in the top-right corner

### To Make It Functional
You need to:
1. Connect the page to the `/api/users` endpoint
2. Implement the "Add New User" functionality
3. Implement the "Edit User" functionality
4. Implement the "Delete User" functionality

---

## ✅ Option 2: Direct Database Management

### Using PostgreSQL Directly

#### View Current Users Who Can Be Assigned
```sql
SELECT 
    id,
    first_name,
    last_name,
    email,
    role,
    is_active
FROM users
WHERE (is_active IS NULL OR is_active = true)
  AND (role IN ('Sales Representative', 'Account Manager', 
                'Sales Manager', 'Business Development', 'Sales Director')
       OR role IS NULL)
ORDER BY first_name, last_name;
```

#### Add a New User
```sql
INSERT INTO users (
    first_name, 
    last_name, 
    email, 
    role, 
    is_active,
    created_at
) VALUES (
    'John',
    'Doe',
    'john.doe@ocean-erp.com',
    'Sales Representative',
    true,
    NOW()
);
```

#### Edit a User
```sql
UPDATE users 
SET 
    first_name = 'Jane',
    last_name = 'Smith',
    role = 'Sales Manager',
    updated_at = NOW()
WHERE email = 'john.doe@ocean-erp.com';
```

#### Deactivate a User (Soft Delete)
```sql
UPDATE users 
SET 
    is_active = false,
    updated_at = NOW()
WHERE email = 'john.doe@ocean-erp.com';
```

#### Delete a User (Hard Delete - Use with Caution)
```sql
DELETE FROM users 
WHERE email = 'john.doe@ocean-erp.com';
```

---

## 🔍 How "Assign To" Works

### 1. Lead Form (`/erp/sales/leads/new`)
**File:** `/apps/v4/app/(erp)/erp/sales/leads/new/page.tsx`

When you create or edit a lead, the "Assigned To" dropdown is populated by calling the lookup API:

```typescript
// API Call
const response = await fetch('/api/leads/lookup')
const result = await response.json()

// Users are stored in:
result.data.users
```

### 2. Lookup API (`/api/leads/lookup`)
**File:** `/apps/v4/app/api/leads/lookup/route.ts`

This API fetches users with these criteria:
- **Active users only** (`is_active = true` or `is_active IS NULL`)
- **Sales-related roles only**:
  - Sales Representative
  - Account Manager
  - Sales Manager
  - Business Development
  - Sales Director
  - Users with no role assigned (`role IS NULL`)

```typescript
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.first_name || ' ' || u.last_name as full_name,
    u.email,
    u.role
FROM users u
WHERE (u.is_active IS NULL OR u.is_active = true)
    AND (u.role IN ('Sales Representative', 'Account Manager', 
                    'Sales Manager', 'Business Development', 'Sales Director')
         OR u.role IS NULL)
ORDER BY u.first_name, u.last_name
```

### 3. Database Table Structure

```sql
-- Users table (simplified)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Quick Start: Add a New Sales Rep

### Using psql Terminal
```bash
psql -U mac ocean_erp -c "
INSERT INTO users (first_name, last_name, email, role, is_active) 
VALUES ('Ahmad', 'Fauzi', 'ahmad.fauzi@ocean-erp.com', 'Sales Representative', true);
"
```

### Verify the User Appears
1. Navigate to: **Sales → Leads → Create New Lead**
2. Scroll to "Lead Management" section
3. Check the "Assigned To" dropdown
4. You should see "Ahmad Fauzi" in the list

---

## 📊 Current Users in Database

To check who's currently in your system:

```bash
psql -U mac ocean_erp -c "
SELECT 
    id,
    first_name || ' ' || last_name as full_name,
    email,
    role,
    COALESCE(is_active::text, 'NULL') as active
FROM users
ORDER BY id;
"
```

---

## 🛠️ Implementation Tasks (To Make UI Functional)

### Priority 1: User Management API
Create `/apps/v4/app/api/users/route.ts` with:
- `GET` - Fetch all users
- `POST` - Create new user
- `PUT` - Update user
- `DELETE` - Delete/deactivate user

### Priority 2: Update User Management Page
Modify `/apps/v4/app/(erp)/erp/settings/users/page.tsx` to:
1. Fetch real users from API on page load
2. Implement "Add New User" modal/form
3. Implement "Edit User" modal/form
4. Implement "Delete User" confirmation dialog
5. Add real-time search and filtering

### Priority 3: User Form Component
Create `/apps/v4/app/(erp)/erp/settings/users/components/user-form.tsx` with:
- First Name, Last Name fields
- Email field (unique, validated)
- Role dropdown (Sales Representative, Sales Manager, etc.)
- Active/Inactive toggle
- Save/Cancel buttons

### Example User Form Fields
```typescript
interface UserFormData {
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
}

const roleOptions = [
  'Sales Representative',
  'Account Manager',
  'Sales Manager',
  'Business Development',
  'Sales Director',
  'Administrator',
  'Operations Manager'
]
```

---

## 🎨 UI Enhancement Suggestions

### Current Lead Form Shows Debug Info
In `/apps/v4/app/(erp)/erp/sales/leads/new/page.tsx` (around line 457), there's debug information shown:

```typescript
<div className="text-xs text-gray-500 mb-2">
  Loading: {isLoadingLookup ? 'Yes' : 'No'} | 
  Users count: {lookupData.users?.length || 0} | 
  API called: {lookupData.users ? 'Yes' : 'No'}
</div>
```

**Recommendation:** Remove this debug info in production or hide it behind a feature flag.

---

## 📝 Sample SQL Scripts

### Add Multiple Indonesian Sales Reps
```sql
INSERT INTO users (first_name, last_name, email, role, is_active) VALUES
('Budi', 'Santoso', 'budi.santoso@ocean-erp.com', 'Sales Representative', true),
('Siti', 'Rahmawati', 'siti.rahmawati@ocean-erp.com', 'Sales Representative', true),
('Ahmad', 'Wijaya', 'ahmad.wijaya@ocean-erp.com', 'Account Manager', true),
('Dewi', 'Kusuma', 'dewi.kusuma@ocean-erp.com', 'Sales Manager', true),
('Andi', 'Pratama', 'andi.pratama@ocean-erp.com', 'Sales Representative', true);
```

### Update User Roles
```sql
-- Promote to Sales Manager
UPDATE users 
SET role = 'Sales Manager', updated_at = NOW()
WHERE email = 'budi.santoso@ocean-erp.com';

-- Change to Account Manager
UPDATE users 
SET role = 'Account Manager', updated_at = NOW()
WHERE email = 'siti.rahmawati@ocean-erp.com';
```

### View Users with Their Lead Assignments
```sql
SELECT 
    u.id,
    u.first_name || ' ' || u.last_name as sales_rep,
    u.email,
    u.role,
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.status_id IN (
        SELECT id FROM lead_statuses WHERE name IN ('New', 'Contacted')
    ) THEN 1 END) as active_leads
FROM users u
LEFT JOIN leads l ON u.id = l.assigned_to
WHERE u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.email, u.role
ORDER BY total_leads DESC;
```

---

## ⚠️ Important Notes

1. **Email Must Be Unique**: The email field has a unique constraint in the database
2. **Role-Based Filtering**: Only users with sales-related roles appear in "Assign To"
3. **Soft Delete**: Use `is_active = false` instead of deleting users to maintain data integrity
4. **Lead Assignment**: When you delete/deactivate a user, their existing lead assignments remain in the database
5. **No Password Required**: The current users table doesn't have a password field - this may need to be added for authentication

---

## 🔐 Security Considerations

When implementing the User Management functionality:

1. **Authentication**: Ensure only administrators can access user management
2. **Authorization**: Add role-based access control (RBAC)
3. **Validation**: Validate email format and uniqueness
4. **Audit Trail**: Log all user creation/modification/deletion actions
5. **Password Management**: If adding authentication, use bcrypt or similar for password hashing

---

## 📞 Quick Reference

| Task | Method | Location |
|------|--------|----------|
| **Add User** | Database SQL | `psql -U mac ocean_erp` |
| **Edit User** | Database SQL | `psql -U mac ocean_erp` |
| **View Users** | User Management Page | `/erp/settings/users` (needs implementation) |
| **Assign Lead** | Lead Form | `/erp/sales/leads/new` ✅ Working |
| **View Assignments** | Lead List | `/erp/sales/leads/list` |

---

## ✅ Summary

**Current Status:**
- ✅ "Assign To" dropdown in Lead form is **working**
- ✅ Users can be managed via **direct database access**
- ⚠️ User Management UI exists but needs **database integration**

**Recommended Next Steps:**
1. Use database SQL commands to add users (quick solution)
2. Implement User Management API endpoints
3. Connect User Management page to API
4. Add create/edit/delete user functionality to UI

---

**Need Help?** 
- Database queries above
- API implementation in `/api/users/route.ts`
- User Management page in `/erp/settings/users`

**Last Updated:** 25 November 2025
