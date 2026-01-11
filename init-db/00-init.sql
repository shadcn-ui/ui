-- Ocean ERP Database Schema
-- Created: $(date)
-- Description: Complete database schema for Ocean ERP system

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS & AUTHENTICATION TABLES
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SALES MODULE TABLES
-- =====================================================

-- Lead Sources lookup table
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lead Status lookup table
CREATE TABLE lead_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    color VARCHAR(7) DEFAULT '#6B7280', -- Hex color code
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255) NOT NULL,
    job_title VARCHAR(100),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'US', -- ISO country code
    source_id UUID REFERENCES lead_sources(id),
    status_id UUID REFERENCES lead_statuses(id),
    assigned_to UUID REFERENCES users(id),
    estimated_value DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    last_contacted TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    lead_id UUID REFERENCES leads(id),
    stage VARCHAR(50) NOT NULL DEFAULT 'prospecting',
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    amount DECIMAL(15,2) NOT NULL,
    expected_close_date DATE,
    assigned_to UUID REFERENCES users(id),
    description TEXT,
    notes TEXT,
    is_closed BOOLEAN DEFAULT false,
    is_won BOOLEAN DEFAULT false,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_number VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_first_name VARCHAR(100),
    contact_last_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_zip_code VARCHAR(20),
    billing_country VARCHAR(2) DEFAULT 'US',
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip_code VARCHAR(20),
    shipping_country VARCHAR(2) DEFAULT 'US',
    tax_id VARCHAR(50),
    credit_limit DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PRODUCT MODULE TABLES
-- =====================================================

-- Product Categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES product_categories(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES product_categories(id),
    unit_price DECIMAL(15,2) NOT NULL,
    cost_price DECIMAL(15,2) DEFAULT 0,
    weight DECIMAL(10,3),
    dimensions VARCHAR(100), -- e.g., "10x5x3 inches"
    barcode VARCHAR(100),
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Locations
CREATE TABLE inventory_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'US',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Movements
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    location_id UUID NOT NULL REFERENCES inventory_locations(id),
    movement_type VARCHAR(50) NOT NULL, -- 'in', 'out', 'transfer', 'adjustment'
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(15,2),
    reference_type VARCHAR(50), -- 'purchase_order', 'sales_order', 'adjustment', etc.
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- OPERATIONS MODULE TABLES
-- =====================================================

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_number VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_first_name VARCHAR(100),
    contact_last_name VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'US',
    tax_id VARCHAR(50),
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, confirmed, received, cancelled
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Orders
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    opportunity_id UUID REFERENCES opportunities(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, confirmed, shipped, delivered, cancelled
    order_date DATE NOT NULL,
    expected_ship_date DATE,
    actual_ship_date DATE,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Order Items
CREATE TABLE sales_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    shipped_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACCOUNTING MODULE TABLES
-- =====================================================

-- Chart of Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, revenue, expense
    parent_id UUID REFERENCES accounts(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entry_number VARCHAR(50) UNIQUE NOT NULL,
    entry_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(100),
    total_debit DECIMAL(15,2) DEFAULT 0,
    total_credit DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- draft, posted, reversed
    created_by UUID REFERENCES users(id),
    posted_by UUID REFERENCES users(id),
    posted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Journal Entry Lines
CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    sales_order_id UUID REFERENCES sales_orders(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    paid_amount DECIMAL(15,2) DEFAULT 0,
    balance_due DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    line_total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    invoice_id UUID REFERENCES invoices(id),
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- cash, check, credit_card, bank_transfer, etc.
    reference VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- HRIS (Human Resources) MODULE TABLES
-- =====================================================

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    budget DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Positions
CREATE TABLE job_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    department_id UUID NOT NULL REFERENCES departments(id),
    description TEXT,
    requirements TEXT,
    salary_min DECIMAL(15,2),
    salary_max DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id),
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    position_id UUID REFERENCES job_positions(id),
    manager_id UUID REFERENCES employees(id),
    hire_date DATE NOT NULL,
    termination_date DATE,
    salary DECIMAL(15,2),
    employment_type VARCHAR(50) DEFAULT 'full_time', -- full_time, part_time, contract, intern
    employment_status VARCHAR(50) DEFAULT 'active', -- active, terminated, on_leave
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'US',
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Time Tracking
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    entry_date DATE NOT NULL,
    clock_in TIMESTAMP WITH TIME ZONE,
    clock_out TIMESTAMP WITH TIME ZONE,
    break_minutes INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN clock_in IS NOT NULL AND clock_out IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (clock_out - clock_in)) / 3600 - (break_minutes / 60.0)
            ELSE 0 
        END
    ) STORED,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll
CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., "January 2024", "2024-01"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, calculated, approved, paid
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Records
CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_period_id UUID NOT NULL REFERENCES payroll_periods(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    regular_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    regular_pay DECIMAL(15,2) DEFAULT 0,
    overtime_pay DECIMAL(15,2) DEFAULT 0,
    gross_pay DECIMAL(15,2) DEFAULT 0,
    tax_deductions DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    net_pay DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);

-- Leads indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_company ON leads(company);
CREATE INDEX idx_leads_status_id ON leads(status_id);
CREATE INDEX idx_leads_source_id ON leads(source_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);

-- Products indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);

-- Orders indexes
CREATE INDEX idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_sales_orders_order_number ON sales_orders(order_number);
CREATE INDEX idx_sales_orders_customer_id ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);

-- Accounting indexes
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_journal_entries_entry_date ON journal_entries(entry_date);

-- Employee indexes
CREATE INDEX idx_employees_employee_number ON employees(employee_number);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_time_entries_employee_id ON time_entries(employee_id);
CREATE INDEX idx_time_entries_entry_date ON time_entries(entry_date);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables that have updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_locations_updated_at BEFORE UPDATE ON inventory_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_order_items_updated_at BEFORE UPDATE ON purchase_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON sales_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sales_order_items_updated_at BEFORE UPDATE ON sales_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_positions_updated_at BEFORE UPDATE ON job_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_periods_updated_at BEFORE UPDATE ON payroll_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();-- =====================================================
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
-- Ocean ERP Database Seed Data
-- Initial data for Ocean ERP system

-- =====================================================
-- LEAD SOURCES SEED DATA
-- =====================================================

INSERT INTO lead_sources (id, name, description) VALUES
    (uuid_generate_v4(), 'Website', 'Leads from website contact forms and inquiries'),
    (uuid_generate_v4(), 'Referral', 'Leads from customer referrals and word of mouth'),
    (uuid_generate_v4(), 'LinkedIn', 'Leads from LinkedIn outreach and connections'),
    (uuid_generate_v4(), 'Cold Call', 'Leads from cold calling campaigns'),
    (uuid_generate_v4(), 'Email Campaign', 'Leads from email marketing campaigns'),
    (uuid_generate_v4(), 'Trade Show', 'Leads from trade shows and industry events'),
    (uuid_generate_v4(), 'Social Media', 'Leads from social media platforms'),
    (uuid_generate_v4(), 'Advertisement', 'Leads from online and offline advertising'),
    (uuid_generate_v4(), 'Other', 'Other lead sources not categorized above');

-- =====================================================
-- LEAD STATUSES SEED DATA
-- =====================================================

INSERT INTO lead_statuses (id, name, description, sort_order, color) VALUES
    (uuid_generate_v4(), 'New', 'Newly created lead, not yet contacted', 1, '#3B82F6'),
    (uuid_generate_v4(), 'Contacted', 'Initial contact made with the lead', 2, '#8B5CF6'),
    (uuid_generate_v4(), 'Qualified', 'Lead has been qualified as potential customer', 3, '#06B6D4'),
    (uuid_generate_v4(), 'Opportunity', 'Lead converted to sales opportunity', 4, '#10B981'),
    (uuid_generate_v4(), 'Won', 'Lead successfully converted to customer', 5, '#22C55E'),
    (uuid_generate_v4(), 'Lost', 'Lead was not converted, opportunity lost', 6, '#EF4444');

-- =====================================================
-- USERS SEED DATA
-- =====================================================

INSERT INTO users (id, email, first_name, last_name, phone, role, department, password_hash) VALUES
    (uuid_generate_v4(), 'admin@ocean-erp.com', 'Admin', 'User', '+1-555-0001', 'admin', 'IT', '$2a$10$hash_placeholder_admin'),
    (uuid_generate_v4(), 'sarah.johnson@ocean-erp.com', 'Sarah', 'Johnson', '+1-555-0101', 'sales_manager', 'Sales', '$2a$10$hash_placeholder_sarah'),
    (uuid_generate_v4(), 'mike.wilson@ocean-erp.com', 'Mike', 'Wilson', '+1-555-0102', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_mike'),
    (uuid_generate_v4(), 'alex.chen@ocean-erp.com', 'Alex', 'Chen', '+1-555-0103', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_alex'),
    (uuid_generate_v4(), 'lisa.taylor@ocean-erp.com', 'Lisa', 'Taylor', '+1-555-0104', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_lisa'),
    (uuid_generate_v4(), 'david.brown@ocean-erp.com', 'David', 'Brown', '+1-555-0105', 'sales_rep', 'Sales', '$2a$10$hash_placeholder_david'),
    (uuid_generate_v4(), 'emily.davis@ocean-erp.com', 'Emily', 'Davis', '+1-555-0201', 'product_manager', 'Product', '$2a$10$hash_placeholder_emily'),
    (uuid_generate_v4(), 'john.smith@ocean-erp.com', 'John', 'Smith', '+1-555-0301', 'operations_manager', 'Operations', '$2a$10$hash_placeholder_john'),
    (uuid_generate_v4(), 'maria.garcia@ocean-erp.com', 'Maria', 'Garcia', '+1-555-0401', 'accountant', 'Accounting', '$2a$10$hash_placeholder_maria'),
    (uuid_generate_v4(), 'robert.lee@ocean-erp.com', 'Robert', 'Lee', '+1-555-0501', 'hr_manager', 'Human Resources', '$2a$10$hash_placeholder_robert');

-- =====================================================
-- DEPARTMENTS SEED DATA
-- =====================================================

INSERT INTO departments (id, name, description, budget) VALUES
    (uuid_generate_v4(), 'Sales', 'Sales and business development department', 500000.00),
    (uuid_generate_v4(), 'Product', 'Product development and management', 750000.00),
    (uuid_generate_v4(), 'Operations', 'Operations and supply chain management', 400000.00),
    (uuid_generate_v4(), 'Accounting', 'Finance and accounting department', 300000.00),
    (uuid_generate_v4(), 'Human Resources', 'HR and employee management', 250000.00),
    (uuid_generate_v4(), 'IT', 'Information technology and systems', 600000.00),
    (uuid_generate_v4(), 'Marketing', 'Marketing and communications', 400000.00);

-- =====================================================
-- PRODUCT CATEGORIES SEED DATA
-- =====================================================

INSERT INTO product_categories (id, name, description) VALUES
    (uuid_generate_v4(), 'Software', 'Software products and licenses'),
    (uuid_generate_v4(), 'Hardware', 'Physical hardware products'),
    (uuid_generate_v4(), 'Services', 'Professional services and consulting'),
    (uuid_generate_v4(), 'Training', 'Training and educational services'),
    (uuid_generate_v4(), 'Support', 'Technical support and maintenance');

-- =====================================================
-- INVENTORY LOCATIONS SEED DATA
-- =====================================================

INSERT INTO inventory_locations (id, name, address, city, state, zip_code, country) VALUES
    (uuid_generate_v4(), 'Main Warehouse', '123 Industrial Blvd', 'Los Angeles', 'CA', '90210', 'US'),
    (uuid_generate_v4(), 'East Coast Distribution', '456 Commerce St', 'New York', 'NY', '10001', 'US'),
    (uuid_generate_v4(), 'Retail Store - Downtown', '789 Main St', 'San Francisco', 'CA', '94102', 'US');

-- =====================================================
-- ACCOUNTS (CHART OF ACCOUNTS) SEED DATA
-- =====================================================

-- Assets
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '1000', 'Assets', 'asset', 'Main Assets Account'),
    (uuid_generate_v4(), '1100', 'Current Assets', 'asset', 'Current Assets'),
    (uuid_generate_v4(), '1110', 'Cash and Cash Equivalents', 'asset', 'Cash accounts'),
    (uuid_generate_v4(), '1120', 'Accounts Receivable', 'asset', 'Money owed by customers'),
    (uuid_generate_v4(), '1130', 'Inventory', 'asset', 'Inventory assets'),
    (uuid_generate_v4(), '1200', 'Fixed Assets', 'asset', 'Fixed Assets'),
    (uuid_generate_v4(), '1210', 'Equipment', 'asset', 'Office and production equipment'),
    (uuid_generate_v4(), '1220', 'Furniture', 'asset', 'Office furniture'),
    (uuid_generate_v4(), '1230', 'Vehicles', 'asset', 'Company vehicles');

-- Liabilities
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '2000', 'Liabilities', 'liability', 'Main Liabilities Account'),
    (uuid_generate_v4(), '2100', 'Current Liabilities', 'liability', 'Current Liabilities'),
    (uuid_generate_v4(), '2110', 'Accounts Payable', 'liability', 'Money owed to suppliers'),
    (uuid_generate_v4(), '2120', 'Accrued Expenses', 'liability', 'Accrued expenses'),
    (uuid_generate_v4(), '2130', 'Short Term Loans', 'liability', 'Short term debt'),
    (uuid_generate_v4(), '2200', 'Long Term Liabilities', 'liability', 'Long term debt and obligations');

-- Equity
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '3000', 'Equity', 'equity', 'Owner''s Equity'),
    (uuid_generate_v4(), '3100', 'Retained Earnings', 'equity', 'Accumulated earnings'),
    (uuid_generate_v4(), '3200', 'Owner''s Capital', 'equity', 'Owner''s invested capital');

-- Revenue
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '4000', 'Revenue', 'revenue', 'Main Revenue Account'),
    (uuid_generate_v4(), '4100', 'Sales Revenue', 'revenue', 'Revenue from sales'),
    (uuid_generate_v4(), '4200', 'Service Revenue', 'revenue', 'Revenue from services'),
    (uuid_generate_v4(), '4300', 'Other Revenue', 'revenue', 'Other income sources');

-- Expenses
INSERT INTO accounts (id, account_number, account_name, account_type, description) VALUES
    (uuid_generate_v4(), '5000', 'Expenses', 'expense', 'Main Expenses Account'),
    (uuid_generate_v4(), '5100', 'Cost of Goods Sold', 'expense', 'Direct costs of products'),
    (uuid_generate_v4(), '5200', 'Operating Expenses', 'expense', 'Operating expenses'),
    (uuid_generate_v4(), '5210', 'Salaries and Wages', 'expense', 'Employee compensation'),
    (uuid_generate_v4(), '5220', 'Rent', 'expense', 'Office and warehouse rent'),
    (uuid_generate_v4(), '5230', 'Utilities', 'expense', 'Electricity, water, internet'),
    (uuid_generate_v4(), '5240', 'Office Supplies', 'expense', 'Office supplies and materials'),
    (uuid_generate_v4(), '5250', 'Marketing', 'expense', 'Marketing and advertising'),
    (uuid_generate_v4(), '5260', 'Travel', 'expense', 'Business travel expenses'),
    (uuid_generate_v4(), '5270', 'Professional Services', 'expense', 'Legal, accounting, consulting');

-- =====================================================
-- SAMPLE LEADS DATA
-- =====================================================

-- Get IDs for foreign key references
WITH source_refs AS (
    SELECT 
        (SELECT id FROM lead_sources WHERE name = 'Website') as website_id,
        (SELECT id FROM lead_sources WHERE name = 'Referral') as referral_id,
        (SELECT id FROM lead_sources WHERE name = 'LinkedIn') as linkedin_id,
        (SELECT id FROM lead_sources WHERE name = 'Cold Call') as coldcall_id,
        (SELECT id FROM lead_sources WHERE name = 'Trade Show') as tradeshow_id
),
status_refs AS (
    SELECT 
        (SELECT id FROM lead_statuses WHERE name = 'New') as new_id,
        (SELECT id FROM lead_statuses WHERE name = 'Contacted') as contacted_id,
        (SELECT id FROM lead_statuses WHERE name = 'Qualified') as qualified_id,
        (SELECT id FROM lead_statuses WHERE name = 'Opportunity') as opportunity_id,
        (SELECT id FROM lead_statuses WHERE name = 'Won') as won_id
),
user_refs AS (
    SELECT 
        (SELECT id FROM users WHERE email = 'sarah.johnson@ocean-erp.com') as sarah_id,
        (SELECT id FROM users WHERE email = 'mike.wilson@ocean-erp.com') as mike_id,
        (SELECT id FROM users WHERE email = 'alex.chen@ocean-erp.com') as alex_id,
        (SELECT id FROM users WHERE email = 'lisa.taylor@ocean-erp.com') as lisa_id,
        (SELECT id FROM users WHERE email = 'david.brown@ocean-erp.com') as david_id
)
INSERT INTO leads (
    first_name, last_name, email, phone, company, job_title, website,
    address, city, state, zip_code, country,
    source_id, status_id, assigned_to, estimated_value, notes, last_contacted
)
SELECT * FROM (
    VALUES
        ('John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001', 'TechCorp Solutions', 'CTO', 'https://techcorp.com',
         '123 Tech Ave', 'San Francisco', 'CA', '94105', 'US',
         (SELECT website_id FROM source_refs), (SELECT new_id FROM status_refs), (SELECT sarah_id FROM user_refs), 
         25000.00, 'Interested in our enterprise software solution', '2024-10-20'::timestamp),
        
        ('Emily', 'Johnson', 'emily.j@innovate.co', '+1-555-1002', 'Innovate Inc', 'VP of Operations', 'https://innovate.co',
         '456 Innovation Blvd', 'Austin', 'TX', '73301', 'US',
         (SELECT linkedin_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT mike_id FROM user_refs),
         45000.00, 'Looking for supply chain optimization tools', '2024-10-18'::timestamp),
        
        ('Michael', 'Davis', 'mdavis@startupxyz.com', '+1-555-1003', 'StartupXYZ', 'Founder', 'https://startupxyz.com',
         '789 Startup St', 'Seattle', 'WA', '98101', 'US',
         (SELECT referral_id FROM source_refs), (SELECT qualified_id FROM status_refs), (SELECT alex_id FROM user_refs),
         15000.00, 'Referred by existing customer, very interested', '2024-10-15'::timestamp),
        
        ('Sarah', 'Wilson', 'sarah.wilson@retailplus.com', '+1-555-1004', 'RetailPlus', 'IT Director', 'https://retailplus.com',
         '321 Commerce Way', 'Chicago', 'IL', '60601', 'US',
         (SELECT coldcall_id FROM source_refs), (SELECT opportunity_id FROM status_refs), (SELECT lisa_id FROM user_refs),
         75000.00, 'Ready to move forward with implementation', '2024-10-22'::timestamp),
        
        ('Robert', 'Brown', 'rbrown@manufacturing.net', '+1-555-1005', 'Manufacturing Solutions', 'Plant Manager', 'https://manufacturing.net',
         '654 Industrial Pkwy', 'Detroit', 'MI', '48201', 'US',
         (SELECT tradeshow_id FROM source_refs), (SELECT won_id FROM status_refs), (SELECT david_id FROM user_refs),
         120000.00, 'Contract signed, implementation starting next month', '2024-10-23'::timestamp),
        
        ('Amanda', 'Garcia', 'a.garcia@healthtech.org', '+1-555-1006', 'HealthTech Solutions', 'Chief Technology Officer', 'https://healthtech.org',
         '987 Medical Center Dr', 'Boston', 'MA', '02101', 'US',
         (SELECT website_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT sarah_id FROM user_refs),
         95000.00, 'Evaluating multiple vendors, promising discussions', '2024-10-19'::timestamp),
        
        ('James', 'Lee', 'james.lee@financegroup.com', '+1-555-1007', 'Finance Group LLC', 'CFO', 'https://financegroup.com',
         '246 Wall Street', 'New York', 'NY', '10005', 'US',
         (SELECT linkedin_id FROM source_refs), (SELECT new_id FROM status_refs), (SELECT mike_id FROM user_refs),
         65000.00, 'Initial inquiry about accounting modules', '2024-10-21'::timestamp),
        
        ('Lisa', 'Anderson', 'l.anderson@edutech.edu', '+1-555-1008', 'EduTech University', 'VP of Technology', 'https://edutech.edu',
         '135 Campus Drive', 'Palo Alto', 'CA', '94301', 'US',
         (SELECT referral_id FROM source_refs), (SELECT qualified_id FROM status_refs), (SELECT alex_id FROM user_refs),
         40000.00, 'Looking for student management system integration', '2024-10-17'::timestamp),
        
        ('David', 'Martinez', 'dmartinez@logistics.pro', '+1-555-1009', 'Logistics Pro', 'Operations Director', 'https://logistics.pro',
         '369 Transport Ave', 'Atlanta', 'GA', '30301', 'US',
         (SELECT tradeshow_id FROM source_refs), (SELECT opportunity_id FROM status_refs), (SELECT lisa_id FROM user_refs),
         85000.00, 'Impressed with demo, preparing proposal', '2024-10-16'::timestamp),
        
        ('Jennifer', 'Taylor', 'jtaylor@consulting.biz', '+1-555-1010', 'Taylor Consulting', 'Managing Partner', 'https://consulting.biz',
         '852 Professional Plaza', 'Denver', 'CO', '80201', 'US',
         (SELECT coldcall_id FROM source_refs), (SELECT contacted_id FROM status_refs), (SELECT david_id FROM user_refs),
         30000.00, 'Interested in project management features', '2024-10-14'::timestamp)
) AS lead_data;

-- =====================================================
-- SAMPLE PRODUCTS DATA
-- =====================================================

WITH category_refs AS (
    SELECT 
        (SELECT id FROM product_categories WHERE name = 'Software') as software_id,
        (SELECT id FROM product_categories WHERE name = 'Hardware') as hardware_id,
        (SELECT id FROM product_categories WHERE name = 'Services') as services_id,
        (SELECT id FROM product_categories WHERE name = 'Training') as training_id,
        (SELECT id FROM product_categories WHERE name = 'Support') as support_id
)
INSERT INTO products (
    sku, name, description, category_id, unit_price, cost_price, 
    weight, dimensions, barcode, min_stock_level, max_stock_level, current_stock
)
SELECT * FROM (
    VALUES
        ('SW-ERP-001', 'Ocean ERP Enterprise License', 'Full enterprise ERP system license for unlimited users', 
         (SELECT software_id FROM category_refs), 15000.00, 3000.00, NULL, NULL, NULL, 5, 50, 25),
        
        ('SW-ERP-002', 'Ocean ERP Professional License', 'Professional ERP system license for up to 50 users',
         (SELECT software_id FROM category_refs), 8000.00, 1500.00, NULL, NULL, NULL, 10, 100, 45),
        
        ('SW-ERP-003', 'Ocean ERP Standard License', 'Standard ERP system license for up to 10 users',
         (SELECT software_id FROM category_refs), 3000.00, 600.00, NULL, NULL, NULL, 20, 200, 85),
        
        ('HW-SRV-001', 'Enterprise Server', 'High-performance server for ERP hosting',
         (SELECT hardware_id FROM category_refs), 12000.00, 8000.00, 25.5, '19x24x3.5 inches', '123456789012', 2, 10, 6),
        
        ('HW-WKS-001', 'Professional Workstation', 'High-end workstation for power users',
         (SELECT hardware_id FROM category_refs), 3500.00, 2200.00, 15.2, '18x16x8 inches', '123456789013', 5, 25, 12),
        
        ('SVC-IMP-001', 'ERP Implementation Service', 'Professional implementation and setup service',
         (SELECT services_id FROM category_refs), 5000.00, 2000.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SVC-CST-001', 'ERP Customization Service', 'Custom development and configuration service',
         (SELECT services_id FROM category_refs), 2500.00, 1000.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('TRN-ADM-001', 'Administrator Training Course', '3-day intensive administrator training',
         (SELECT training_id FROM category_refs), 1500.00, 300.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('TRN-USR-001', 'End User Training Course', '1-day end user training session',
         (SELECT training_id FROM category_refs), 500.00, 100.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SUP-STD-001', 'Standard Support Package', 'Standard technical support package - 1 year',
         (SELECT support_id FROM category_refs), 2400.00, 600.00, NULL, NULL, NULL, 0, 0, 0),
        
        ('SUP-PRM-001', 'Premium Support Package', 'Premium 24/7 technical support package - 1 year',
         (SELECT support_id FROM category_refs), 4800.00, 1200.00, NULL, NULL, NULL, 0, 0, 0)
) AS product_data;

-- =====================================================
-- SAMPLE CUSTOMERS DATA
-- =====================================================

INSERT INTO customers (
    customer_number, company_name, contact_first_name, contact_last_name, 
    contact_email, contact_phone, billing_address, billing_city, billing_state, 
    billing_zip_code, billing_country, tax_id, credit_limit, payment_terms
) VALUES
    ('CUST-001', 'TechCorp Solutions', 'John', 'Smith', 'john.smith@techcorp.com', '+1-555-1001',
     '123 Tech Ave', 'San Francisco', 'CA', '94105', 'US', '12-3456789', 50000.00, 'Net 30'),
    
    ('CUST-002', 'Manufacturing Solutions', 'Robert', 'Brown', 'rbrown@manufacturing.net', '+1-555-1005',
     '654 Industrial Pkwy', 'Detroit', 'MI', '48201', 'US', '98-7654321', 150000.00, 'Net 30'),
    
    ('CUST-003', 'RetailPlus Inc', 'Sarah', 'Wilson', 'sarah.wilson@retailplus.com', '+1-555-1004',
     '321 Commerce Way', 'Chicago', 'IL', '60601', 'US', '55-1234567', 75000.00, 'Net 15'),
    
    ('CUST-004', 'HealthTech Solutions', 'Amanda', 'Garcia', 'a.garcia@healthtech.org', '+1-555-1006',
     '987 Medical Center Dr', 'Boston', 'MA', '02101', 'US', '77-9876543', 100000.00, 'Net 30'),
    
    ('CUST-005', 'EduTech University', 'Lisa', 'Anderson', 'l.anderson@edutech.edu', '+1-555-1008',
     '135 Campus Drive', 'Palo Alto', 'CA', '94301', 'US', 'EXEMPT', 60000.00, 'Net 45');

-- =====================================================
-- JOB POSITIONS SEED DATA
-- =====================================================

WITH dept_refs AS (
    SELECT 
        (SELECT id FROM departments WHERE name = 'Sales') as sales_id,
        (SELECT id FROM departments WHERE name = 'Product') as product_id,
        (SELECT id FROM departments WHERE name = 'Operations') as operations_id,
        (SELECT id FROM departments WHERE name = 'Accounting') as accounting_id,
        (SELECT id FROM departments WHERE name = 'Human Resources') as hr_id,
        (SELECT id FROM departments WHERE name = 'IT') as it_id,
        (SELECT id FROM departments WHERE name = 'Marketing') as marketing_id
)
INSERT INTO job_positions (title, department_id, description, salary_min, salary_max)
SELECT * FROM (
    VALUES
        ('Sales Manager', (SELECT sales_id FROM dept_refs), 'Lead and manage sales team', 80000.00, 120000.00),
        ('Sales Representative', (SELECT sales_id FROM dept_refs), 'Sell products and services to customers', 45000.00, 75000.00),
        ('Product Manager', (SELECT product_id FROM dept_refs), 'Manage product development and strategy', 90000.00, 140000.00),
        ('Software Developer', (SELECT product_id FROM dept_refs), 'Develop and maintain software products', 70000.00, 120000.00),
        ('Operations Manager', (SELECT operations_id FROM dept_refs), 'Manage operations and supply chain', 75000.00, 110000.00),
        ('Warehouse Supervisor', (SELECT operations_id FROM dept_refs), 'Supervise warehouse operations', 40000.00, 60000.00),
        ('Accountant', (SELECT accounting_id FROM dept_refs), 'Handle accounting and financial tasks', 50000.00, 80000.00),
        ('Financial Analyst', (SELECT accounting_id FROM dept_refs), 'Analyze financial data and create reports', 60000.00, 90000.00),
        ('HR Manager', (SELECT hr_id FROM dept_refs), 'Manage human resources functions', 70000.00, 100000.00),
        ('HR Specialist', (SELECT hr_id FROM dept_refs), 'Handle HR administrative tasks', 45000.00, 65000.00),
        ('IT Manager', (SELECT it_id FROM dept_refs), 'Manage IT infrastructure and systems', 85000.00, 125000.00),
        ('System Administrator', (SELECT it_id FROM dept_refs), 'Maintain and support IT systems', 55000.00, 85000.00),
        ('Marketing Manager', (SELECT marketing_id FROM dept_refs), 'Develop and execute marketing strategies', 75000.00, 110000.00),
        ('Marketing Specialist', (SELECT marketing_id FROM dept_refs), 'Execute marketing campaigns and activities', 45000.00, 70000.00)
) AS position_data;

-- Success message
SELECT 'Ocean ERP database has been successfully seeded with initial data!' AS status;