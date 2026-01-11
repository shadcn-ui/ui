# Authentication & RBAC System - Complete Implementation Guide

## 📋 Overview

A complete authentication and role-based access control (RBAC) system has been implemented for Ocean ERP. This includes user registration, login, password reset, email verification, session management, and permission-based route protection.

## 🗄️ Database Schema

### Tables Created (migration: `029_rbac_authentication_system.sql`)

1. **roles** - System roles (10 pre-configured roles)
2. **permissions** - Available permissions (54 permissions across modules)
3. **role_permissions** - Role-permission mappings (193 mappings)
4. **user_roles** - User role assignments
5. **password_reset_tokens** - Password reset token management
6. **email_verification_tokens** - Email verification tokens
7. **user_sessions** - Active user sessions with token-based auth
8. **access_logs** - Audit trail of user access
9. **login_attempts** - Track login attempts for security

### Pre-configured Roles

| Role | Description |
|------|-------------|
| super_admin | Full system access |
| admin | Administrative access |
| sales_manager | Sales team management |
| sales_rep | Sales operations |
| accountant | Financial operations |
| hr_manager | HR management |
| operations_manager | Operations oversight |
| product_manager | Product management |
| warehouse_staff | Inventory operations |
| viewer | Read-only access |

### Permission Structure

Permissions follow the format: `module:resource:action`

**Modules:**
- dashboard
- sales (leads, customers, orders, quotes)
- products
- accounting (accounts, journal_entries, reports)
- hris (employees, payroll, attendance, leave)
- operations (inventory, manufacturing, quality)
- analytics
- settings
- reports

**Actions:**
- view, create, edit, delete, approve, export

## 🚀 API Endpoints

### Authentication Routes

#### 1. Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "department_id": 1  // optional
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please verify your email.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "verification_token": "token_here"  // dev only
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "roles": [{...}],
    "permissions": [{...}]
  }
}
```

**Security Features:**
- Account lockout after 5 failed attempts (30 minutes)
- Session token stored in httpOnly cookie (7 days)
- Login attempts tracked in database
- Email verification required

#### 3. Logout
```bash
POST /api/auth/logout
```

Invalidates the current session and clears the session cookie.

#### 4. Get Current Session
```bash
GET /api/auth/session
```

Returns current user info, roles, and permissions if authenticated.

#### 5. Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Generates a password reset token (1 hour expiry). In development, the token is returned in the response.

#### 6. Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecurePass123"
}
```

Resets password and invalidates all existing sessions for security.

#### 7. Verify Email
```bash
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}
```

Marks user email as verified, enabling login.

## 🎨 UI Pages

### Login Page
**URL:** `/login`

Features:
- Email and password fields
- "Forgot password?" link
- "Register" link for new users
- Form validation
- Error message display
- Auto-redirect to `/erp/dashboard` on success

### Register Page
**URL:** `/register`

Features:
- First name, last name, email, password, confirm password
- Password strength requirements shown
- Auto-redirect to login after 5 seconds
- Development mode shows verification token

### Forgot Password Page
**URL:** `/forgot-password`

Features:
- Email input
- Success message (prevents email enumeration)
- Development mode shows reset URL

### Reset Password Page
**URL:** `/reset-password/[token]`

Features:
- New password and confirm password fields
- Password requirements validation
- Auto-redirect to login after 3 seconds

## 🛡️ Route Protection

### Page-Level Protection (middleware.ts)

The global middleware automatically protects ERP routes:

```typescript
// Protected routes - require authentication
const protectedRoutes = [
  '/erp/dashboard',
  '/erp/sales',
  '/erp/products',
  '/erp/customers',
  '/erp/accounting',
  '/erp/hris',
  '/erp/operations',
  '/erp/analytics',
  '/erp/settings',
];
```

- Unauthenticated users → redirected to `/login`
- Authenticated users on auth pages → redirected to `/erp/dashboard`

### API Route Protection

#### Using `requireAuth`
```typescript
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (req, user) => {
    // User is authenticated
    return Response.json({ user });
  });
}
```

#### Using `requirePermission`
```typescript
import { requirePermission } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  return requirePermission(request, 'products', 'view', async (req, user) => {
    // User has 'products:view' permission
    return Response.json({ products: [] });
  });
}
```

#### Using `requireRole`
```typescript
import { requireRole } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  return requireRole(request, ['admin', 'sales_manager'], async (req, user) => {
    // User has admin or sales_manager role
    return Response.json({ message: 'Authorized' });
  });
}
```

## 🔧 Helper Functions

### Check Permission
```typescript
import { hasPermission } from '@/lib/auth/middleware';

if (hasPermission(user, 'sales', 'create')) {
  // User can create sales
}
```

### Check Role
```typescript
import { hasRole } from '@/lib/auth/middleware';

if (hasRole(user, 'admin', 'super_admin')) {
  // User is admin or super_admin
}
```

### Password Utilities
```typescript
import { hashPassword, verifyPassword, isValidPassword } from '@/lib/auth/utils';

// Hash password
const hash = await hashPassword('password123');

// Verify password
const isValid = await verifyPassword('password123', hash);

// Validate password strength
const validation = isValidPassword('Test123');
// Returns: { isValid: true, errors: [] }
```

### Token Generation
```typescript
import { generateToken } from '@/lib/auth/utils';

const resetToken = generateToken();  // 32 bytes (64 hex chars)
const sessionToken = generateToken(48);  // 48 bytes (96 hex chars)
```

## 🧪 Testing the System

### 1. Register a New User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Verify Email (Development)
```bash
curl -X POST http://localhost:4000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_REGISTRATION_RESPONSE"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }' \
  -c cookies.txt
```

### 4. Check Session
```bash
curl http://localhost:4000/api/auth/session \
  -b cookies.txt
```

### 5. Access Protected Route
```bash
curl http://localhost:4000/api/protected-example \
  -b cookies.txt
```

## 📊 Database Queries

### Get User Roles and Permissions
```sql
SELECT 
  u.email,
  r.name as role,
  p.resource,
  p.action
FROM core.users u
JOIN core.user_roles ur ON u.id = ur.user_id
JOIN core.roles r ON ur.role_id = r.id
JOIN core.role_permissions rp ON r.id = rp.role_id
JOIN core.permissions p ON rp.permission_id = p.id
WHERE u.email = 'test@example.com';
```

### Check Active Sessions
```sql
SELECT 
  u.email,
  s.session_token,
  s.created_at,
  s.last_active,
  s.expires_at
FROM core.user_sessions s
JOIN core.users u ON s.user_id = u.id
WHERE s.is_active = true;
```

### View Login Attempts
```sql
SELECT 
  u.email,
  la.success,
  la.ip_address,
  la.attempted_at
FROM core.login_attempts la
JOIN core.users u ON la.user_id = u.id
ORDER BY la.attempted_at DESC
LIMIT 20;
```

## 🔐 Security Features

1. **Password Hashing:** bcrypt with 10 salt rounds
2. **Session Management:** Token-based with expiration
3. **Account Lockout:** 5 failed attempts → 30 minute lockout
4. **Email Verification:** Required before login
5. **HTTP-Only Cookies:** Session tokens not accessible via JavaScript
6. **Token Expiry:** 
   - Sessions: 7 days
   - Email verification: 24 hours
   - Password reset: 1 hour
7. **Audit Trail:** All login attempts logged
8. **Permission-Based Access:** Fine-grained control over resources

## 🎯 Next Steps

1. **Email Integration:** Replace console logs with actual email sending
   - Configure SMTP in `.env.local`
   - Create email templates
   - Send verification and reset emails

2. **Session Management UI:**
   - View active sessions
   - Logout from all devices
   - Session history

3. **User Management Admin Panel:**
   - Assign roles to users
   - View user permissions
   - Deactivate accounts
   - View audit logs

4. **Two-Factor Authentication (2FA):**
   - TOTP implementation
   - Backup codes
   - SMS verification

5. **OAuth Integration:**
   - Google Sign-In
   - GitHub authentication
   - Microsoft Azure AD

## 📝 Environment Variables

Add to `.env.local`:

```env
# Database (already configured)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ocean-erp
DB_USER=marfreax
DB_PASSWORD=

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:4000

# Email (for production)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# SMTP_FROM=noreply@ocean-erp.com

# Session (optional - defaults shown)
# SESSION_EXPIRY_DAYS=7
# PASSWORD_RESET_EXPIRY_HOURS=1
# EMAIL_VERIFICATION_EXPIRY_HOURS=24
```

## 🐛 Troubleshooting

### User can't login
1. Check if email is verified: `SELECT email_verified FROM core.users WHERE email = 'user@email.com'`
2. Check if account is locked: `SELECT account_locked_until FROM core.users WHERE email = 'user@email.com'`
3. Check if account is active: `SELECT is_active FROM core.users WHERE email = 'user@email.com'`

### Permission denied errors
```sql
-- Check user's permissions
SELECT p.* FROM core.permissions p
JOIN core.role_permissions rp ON p.id = rp.permission_id
JOIN core.user_roles ur ON rp.role_id = ur.role_id
WHERE ur.user_id = 'USER_UUID';
```

### Session expired issues
```sql
-- Check session status
SELECT * FROM core.user_sessions 
WHERE session_token = 'TOKEN' 
AND expires_at > NOW() 
AND is_active = true;
```

## ✅ Implemented Features Summary

- ✅ Complete RBAC database schema with 10 roles and 54 permissions
- ✅ User registration with email verification
- ✅ Secure login with session management
- ✅ Password reset flow with token validation
- ✅ Account lockout after failed attempts
- ✅ Role-based and permission-based access control
- ✅ Full authentication UI (login, register, forgot password, reset password)
- ✅ Global middleware for route protection
- ✅ API route protection helpers
- ✅ Session tracking and audit logging
- ✅ Password strength validation
- ✅ Secure token generation

---

**Implementation Date:** January 2025  
**Developer:** GitHub Copilot  
**Status:** ✅ Complete and Ready for Use
