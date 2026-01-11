# Authentication System - Quick Start Guide

## 🚀 Getting Started

### 1. Start the Application
```bash
cd /Users/marfreax/Github/ocean-erp
pnpm dev
```

The application will be available at: **http://localhost:4000**

### 2. Test the Authentication Flow

#### Option A: Using the UI

1. **Register a new user:**
   - Go to http://localhost:4000/register
   - Fill in: First Name, Last Name, Email, Password
   - Click "Create account"
   - Note the verification token shown (development mode only)

2. **Verify your email:**
   - Use the verification token from registration
   - Send POST request to `/api/auth/verify-email` with the token
   - Or use this curl command:
   ```bash
   curl -X POST http://localhost:4000/api/auth/verify-email \
     -H "Content-Type: application/json" \
     -d '{"token": "YOUR_TOKEN_HERE"}'
   ```

3. **Login:**
   - Go to http://localhost:4000/login
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to `/erp/dashboard`

#### Option B: Using API Directly

```bash
# 1. Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@ocean-erp.com",
    "password": "Demo1234",
    "first_name": "Demo",
    "last_name": "User"
  }'

# Copy the verification_token from the response

# 2. Verify Email
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "PASTE_TOKEN_HERE"}'

# 3. Login (saves session cookie)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@ocean-erp.com",
    "password": "Demo1234"
  }' \
  -c cookies.txt

# 4. Check your session
curl http://localhost:4000/api/auth/session -b cookies.txt

# 5. Logout
curl -X POST http://localhost:4000/api/auth/logout -b cookies.txt
```

## 📁 File Structure

```
apps/v4/
├── app/
│   ├── (auth)/                      # Auth pages
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/[token]/page.tsx
│   └── api/
│       └── auth/                    # Auth API routes
│           ├── register/route.ts   # POST - Register user
│           ├── login/route.ts      # POST - Login
│           ├── logout/route.ts     # POST - Logout
│           ├── session/route.ts    # GET - Get current session
│           ├── forgot-password/route.ts
│           ├── reset-password/route.ts
│           └── verify-email/route.ts
├── lib/
│   └── auth/
│       ├── utils.ts                # Password hashing, tokens
│       └── middleware.ts           # Auth middleware functions
└── middleware.ts                    # Global route protection

database/
└── 029_rbac_authentication_system.sql  # RBAC schema
```

## 🎯 Key Features Implemented

### ✅ Authentication
- User registration with validation
- Email verification
- Secure login with bcrypt password hashing
- Session-based authentication (7-day sessions)
- Password reset flow
- Account lockout after 5 failed attempts

### ✅ Authorization (RBAC)
- 10 pre-configured roles
- 54 permissions across all modules
- Permission-based route protection
- Role-based route protection
- Fine-grained access control

### ✅ Security
- bcrypt password hashing (10 salt rounds)
- HttpOnly cookies for session tokens
- CSRF protection via SameSite cookies
- Account lockout mechanism
- Login attempt tracking
- Session expiration
- Token-based password reset with 1-hour expiry

### ✅ User Interface
- Modern, responsive login page
- Registration form with validation
- Forgot password flow
- Reset password page
- Real-time validation feedback
- Error and success messages

### ✅ Developer Experience
- TypeScript types for all auth functions
- Reusable middleware helpers
- Clean API design
- Comprehensive documentation
- Example implementations

## 🔑 Default Roles & Permissions

### Roles (Assigned on Registration)
New users automatically get the **viewer** role with read-only access.

### All Available Roles:
1. **super_admin** - Full system access
2. **admin** - Administrative access
3. **sales_manager** - Manage sales team
4. **sales_rep** - Handle sales
5. **accountant** - Financial operations
6. **hr_manager** - HR management
7. **operations_manager** - Operations oversight
8. **product_manager** - Product management
9. **warehouse_staff** - Inventory operations
10. **viewer** - Read-only access

### Permission Examples:
- `dashboard:overview:view`
- `sales:leads:create`
- `products:catalog:edit`
- `accounting:reports:view`
- `hris:employees:view`

## 🛡️ Protecting Routes

### Protect a Page (Automatic via middleware.ts)
Pages under these paths are automatically protected:
- `/erp/dashboard`
- `/erp/sales`
- `/erp/products`
- `/erp/accounting`
- `/erp/hris`
- `/erp/operations`

### Protect an API Route

**Require Authentication Only:**
```typescript
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    return Response.json({ data: 'protected' });
  });
}
```

**Require Specific Permission:**
```typescript
import { requirePermission } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  return requirePermission(
    request, 
    'products',  // resource
    'create',    // action
    async (req, user) => {
      // User has 'products:create' permission
      return Response.json({ message: 'Created' });
    }
  );
}
```

**Require Specific Role:**
```typescript
import { requireRole } from '@/lib/auth/middleware';

export async function DELETE(request: NextRequest) {
  return requireRole(
    request,
    ['admin', 'super_admin'],
    async (req, user) => {
      // User is admin or super_admin
      return Response.json({ message: 'Deleted' });
    }
  );
}
```

## 🧪 Testing Checklist

- [ ] Start the dev server: `pnpm dev`
- [ ] Register a new user at `/register`
- [ ] Verify the email using the token
- [ ] Login at `/login`
- [ ] Check that you're redirected to `/erp/dashboard`
- [ ] Try accessing `/erp/sales` (should work if authenticated)
- [ ] Logout and try accessing `/erp/dashboard` (should redirect to login)
- [ ] Test password reset flow
- [ ] Test account lockout (5 failed login attempts)

## 📊 Useful Database Queries

### View all users and their roles
```sql
SELECT 
  u.email,
  u.first_name,
  u.last_name,
  r.display_name as role,
  u.email_verified,
  u.is_active
FROM core.users u
LEFT JOIN core.user_roles ur ON u.id = ur.user_id
LEFT JOIN core.roles r ON ur.role_id = r.id;
```

### Manually verify a user's email
```sql
UPDATE core.users 
SET email_verified = true 
WHERE email = 'user@example.com';
```

### Manually unlock an account
```sql
UPDATE core.users 
SET failed_login_attempts = 0, 
    account_locked_until = NULL 
WHERE email = 'user@example.com';
```

### Assign a role to a user
```sql
-- Get user and role IDs first
SELECT id FROM core.users WHERE email = 'user@example.com';
SELECT id FROM core.roles WHERE name = 'admin';

-- Then assign
INSERT INTO core.user_roles (user_id, role_id, assigned_at, assigned_by)
VALUES ('USER_ID', 'ROLE_ID', NOW(), 'ADMIN_USER_ID');
```

## 🐛 Common Issues & Solutions

### Issue: "Email not verified"
**Solution:** Run the verify-email endpoint with the token, or manually update the database:
```sql
UPDATE core.users SET email_verified = true WHERE email = 'your@email.com';
```

### Issue: "Account is locked"
**Solution:** Wait 30 minutes or manually unlock:
```sql
UPDATE core.users 
SET failed_login_attempts = 0, account_locked_until = NULL 
WHERE email = 'your@email.com';
```

### Issue: Password doesn't meet requirements
**Requirements:**
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

Example valid passwords: `Test1234`, `SecurePass99`, `Admin2024`

## 📚 Additional Resources

- Full documentation: `AUTHENTICATION_IMPLEMENTATION_GUIDE.md`
- Database schema: `database/029_rbac_authentication_system.sql`
- Auth utilities: `apps/v4/lib/auth/utils.ts`
- Auth middleware: `apps/v4/lib/auth/middleware.ts`

---

**Ready to use!** Start the dev server and navigate to http://localhost:4000/register
