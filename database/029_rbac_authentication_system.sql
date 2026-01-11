-- =====================================================
-- RBAC (Role-Based Access Control) System
-- Complete authentication and authorization schema
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. PERMISSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module VARCHAR(100) NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(module, resource, action)
);

-- =====================================================
-- 3. ROLE PERMISSIONS (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  granted_by UUID REFERENCES users(id),
  PRIMARY KEY (role_id, permission_id)
);

-- =====================================================
-- 4. USER ROLES (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  PRIMARY KEY (user_id, role_id)
);

-- =====================================================
-- 5. PASSWORD RESET TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. EMAIL VERIFICATION TOKENS
-- =====================================================
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 7. USER SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) NOT NULL UNIQUE,
  ip_address VARCHAR(50),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 8. ACCESS LOGS (Audit Trail)
-- =====================================================
CREATE TABLE IF NOT EXISTS access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  page_path VARCHAR(500),
  action VARCHAR(100),
  ip_address VARCHAR(50),
  user_agent TEXT,
  access_granted BOOLEAN,
  denied_reason TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. LOGIN ATTEMPTS (Security)
-- =====================================================
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  ip_address VARCHAR(50),
  success BOOLEAN DEFAULT false,
  failure_reason VARCHAR(255),
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_accessed_at ON access_logs(accessed_at);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);

-- =====================================================
-- ALTER USERS TABLE
-- =====================================================
-- Add authentication fields to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- SEED SYSTEM ROLES
-- =====================================================
INSERT INTO roles (id, name, display_name, description, is_system_role) VALUES
  (uuid_generate_v4(), 'super_admin', 'Super Administrator', 'Full system access with all permissions', true),
  (uuid_generate_v4(), 'admin', 'Administrator', 'Administrative access to most system features', true),
  (uuid_generate_v4(), 'sales_manager', 'Sales Manager', 'Manage sales team and view all sales data', true),
  (uuid_generate_v4(), 'sales_rep', 'Sales Representative', 'Manage own leads and opportunities', true),
  (uuid_generate_v4(), 'accountant', 'Accountant', 'Full access to accounting and finance', true),
  (uuid_generate_v4(), 'hr_manager', 'HR Manager', 'Manage human resources and employee data', true),
  (uuid_generate_v4(), 'operations_manager', 'Operations Manager', 'Manage operations and inventory', true),
  (uuid_generate_v4(), 'product_manager', 'Product Manager', 'Manage products and catalog', true),
  (uuid_generate_v4(), 'warehouse_staff', 'Warehouse Staff', 'Manage inventory and warehouse operations', true),
  (uuid_generate_v4(), 'viewer', 'Viewer', 'Read-only access to permitted modules', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SEED PERMISSIONS
-- =====================================================
INSERT INTO permissions (module, resource, action, description) VALUES
  -- Dashboard
  ('dashboard', 'overview', 'view', 'View dashboard overview'),
  
  -- Sales
  ('sales', 'leads', 'create', 'Create new leads'),
  ('sales', 'leads', 'read_all', 'View all leads'),
  ('sales', 'leads', 'read_own', 'View own leads only'),
  ('sales', 'leads', 'update', 'Update leads'),
  ('sales', 'leads', 'delete', 'Delete leads'),
  ('sales', 'leads', 'assign', 'Assign leads to users'),
  ('sales', 'opportunities', 'create', 'Create opportunities'),
  ('sales', 'opportunities', 'read_all', 'View all opportunities'),
  ('sales', 'opportunities', 'read_own', 'View own opportunities'),
  ('sales', 'opportunities', 'update', 'Update opportunities'),
  ('sales', 'customers', 'create', 'Create customers'),
  ('sales', 'customers', 'read', 'View customers'),
  ('sales', 'customers', 'update', 'Update customers'),
  
  -- Products
  ('products', 'catalog', 'create', 'Create products'),
  ('products', 'catalog', 'read', 'View products'),
  ('products', 'catalog', 'update', 'Update products'),
  ('products', 'catalog', 'delete', 'Delete products'),
  ('products', 'inventory', 'adjust', 'Adjust inventory levels'),
  ('products', 'inventory', 'view', 'View inventory'),
  
  -- Accounting
  ('accounting', 'invoices', 'create', 'Create invoices'),
  ('accounting', 'invoices', 'read', 'View invoices'),
  ('accounting', 'invoices', 'approve', 'Approve invoices'),
  ('accounting', 'journal_entries', 'create', 'Create journal entries'),
  ('accounting', 'journal_entries', 'read', 'View journal entries'),
  ('accounting', 'reports', 'view', 'View financial reports'),
  ('accounting', 'chart_of_accounts', 'manage', 'Manage chart of accounts'),
  
  -- HRIS
  ('hris', 'employees', 'create', 'Create employee records'),
  ('hris', 'employees', 'read_all', 'View all employee records'),
  ('hris', 'employees', 'read_own', 'View own employee record'),
  ('hris', 'employees', 'update', 'Update employee records'),
  ('hris', 'attendance', 'manage', 'Manage attendance records'),
  ('hris', 'payroll', 'process', 'Process payroll'),
  ('hris', 'payroll', 'view', 'View payroll information'),
  
  -- Operations
  ('operations', 'work_orders', 'create', 'Create work orders'),
  ('operations', 'work_orders', 'read', 'View work orders'),
  ('operations', 'work_orders', 'approve', 'Approve work orders'),
  ('operations', 'inventory', 'manage', 'Manage inventory'),
  ('operations', 'production', 'manage', 'Manage production'),
  
  -- Analytics
  ('analytics', 'sales', 'view', 'View sales analytics'),
  ('analytics', 'financial', 'view', 'View financial analytics'),
  ('analytics', 'hr', 'view', 'View HR analytics'),
  ('analytics', 'operations', 'view', 'View operations analytics'),
  
  -- Settings
  ('settings', 'company', 'manage', 'Manage company settings'),
  ('settings', 'users', 'create', 'Create users'),
  ('settings', 'users', 'read', 'View users'),
  ('settings', 'users', 'update', 'Update users'),
  ('settings', 'users', 'delete', 'Delete users'),
  ('settings', 'roles', 'manage', 'Manage roles and permissions'),
  ('settings', 'master_data', 'manage', 'Manage master data'),
  
  -- Reports
  ('reports', 'sales', 'view', 'View sales reports'),
  ('reports', 'financial', 'view', 'View financial reports'),
  ('reports', 'operations', 'view', 'View operations reports'),
  ('reports', 'custom', 'create', 'Create custom reports')
ON CONFLICT (module, resource, action) DO NOTHING;

-- =====================================================
-- ASSIGN PERMISSIONS TO ROLES
-- =====================================================

-- Super Admin - All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin - Most permissions except critical system settings
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin'
  AND p.action NOT IN ('delete')
ON CONFLICT DO NOTHING;

-- Sales Manager - Full sales access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'sales_manager'
  AND (
    (p.module = 'sales' AND p.resource IN ('leads', 'opportunities', 'customers'))
    OR (p.module = 'products' AND p.action = 'read')
    OR (p.module = 'analytics' AND p.resource = 'sales')
    OR (p.module = 'reports' AND p.resource = 'sales')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Sales Rep - Own sales data only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'sales_rep'
  AND (
    (p.module = 'sales' AND p.action LIKE '%own%')
    OR (p.module = 'sales' AND p.resource IN ('leads', 'opportunities') AND p.action = 'create')
    OR (p.module = 'products' AND p.action = 'read')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Accountant - Full accounting access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'accountant'
  AND (
    (p.module = 'accounting')
    OR (p.module = 'analytics' AND p.resource = 'financial')
    OR (p.module = 'reports' AND p.resource = 'financial')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- HR Manager - Full HR access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'hr_manager'
  AND (
    (p.module = 'hris')
    OR (p.module = 'settings' AND p.resource = 'users')
    OR (p.module = 'analytics' AND p.resource = 'hr')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Operations Manager - Operations and inventory
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'operations_manager'
  AND (
    (p.module = 'operations')
    OR (p.module = 'products' AND p.resource = 'inventory')
    OR (p.module = 'analytics' AND p.resource = 'operations')
    OR (p.module = 'reports' AND p.resource = 'operations')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Product Manager - Product management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'product_manager'
  AND (
    (p.module = 'products')
    OR (p.module = 'operations' AND p.action = 'read')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Warehouse Staff - Inventory management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'warehouse_staff'
  AND (
    (p.module = 'products' AND p.resource = 'inventory')
    OR (p.module = 'operations' AND p.resource = 'inventory')
    OR (p.module = 'dashboard')
  )
ON CONFLICT DO NOTHING;

-- Viewer - Read only access
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'viewer'
  AND p.action IN ('read', 'view', 'read_own')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ASSIGN ROLES TO EXISTING USERS
-- =====================================================
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM users u
CROSS JOIN roles r
WHERE u.role = r.name
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for roles table
DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to check user permissions
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_module VARCHAR,
  p_resource VARCHAR,
  p_action VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > CURRENT_TIMESTAMP)
      AND p.module = p_module
      AND p.resource = p_resource
      AND p.action = p_action
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE roles IS 'System and custom user roles';
COMMENT ON TABLE permissions IS 'Granular permissions for resources and actions';
COMMENT ON TABLE role_permissions IS 'Maps permissions to roles (many-to-many)';
COMMENT ON TABLE user_roles IS 'Maps users to roles with optional expiration (many-to-many)';
COMMENT ON TABLE password_reset_tokens IS 'Tokens for password reset functionality';
COMMENT ON TABLE email_verification_tokens IS 'Tokens for email verification';
COMMENT ON TABLE user_sessions IS 'Active user sessions for session management';
COMMENT ON TABLE access_logs IS 'Audit trail of page and resource access';
COMMENT ON TABLE login_attempts IS 'Track login attempts for security monitoring';

-- =====================================================
-- STATUS MESSAGE
-- =====================================================
SELECT 'RBAC System Setup Complete!' as status,
       (SELECT COUNT(*) FROM roles) as roles_created,
       (SELECT COUNT(*) FROM permissions) as permissions_created,
       (SELECT COUNT(*) FROM role_permissions) as role_permission_mappings;
