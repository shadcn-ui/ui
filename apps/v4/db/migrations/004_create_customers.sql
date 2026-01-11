-- Migration: create customers and related tables
-- Customers are the entities that purchase from us (converted from leads or direct)
-- Run this: psql -U mac -d ocean-erp -f 004_create_customers.sql

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  customer_number VARCHAR(64) UNIQUE,
  
  -- Basic Information
  company_name VARCHAR(255),
  contact_person VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  website VARCHAR(255),
  
  -- Classification
  customer_type VARCHAR(50) DEFAULT 'Business', -- Business, Individual, Government
  industry VARCHAR(100),
  customer_status VARCHAR(32) DEFAULT 'Active', -- Active, Inactive, Prospect, VIP
  
  -- Addresses
  billing_address TEXT,
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_country VARCHAR(100),
  billing_postal_code VARCHAR(20),
  
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_country VARCHAR(100),
  shipping_postal_code VARCHAR(20),
  
  -- Financial
  credit_limit NUMERIC(14,2) DEFAULT 0,
  payment_terms VARCHAR(100) DEFAULT 'Net 30',
  tax_id VARCHAR(50),
  
  -- Relationship tracking
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  assigned_to INTEGER, -- Sales rep responsible
  
  -- Metrics (can be updated via triggers or calculations)
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC(14,2) DEFAULT 0,
  last_order_date DATE,
  
  -- Additional
  notes TEXT,
  tags TEXT[], -- Array of tags for categorization
  
  -- Audit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER
);

CREATE TABLE IF NOT EXISTS customer_contacts (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  title VARCHAR(100), -- Job title
  email VARCHAR(255),
  phone VARCHAR(50),
  mobile VARCHAR(50),
  
  is_primary BOOLEAN DEFAULT false,
  department VARCHAR(100),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_notes (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  
  note TEXT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'General', -- General, Call, Meeting, Email, Issue
  is_important BOOLEAN DEFAULT false,
  
  created_by INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON customers(customer_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_company_name ON customers(company_name);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(customer_status);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_lead_id ON customers(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id);

-- Comments
COMMENT ON TABLE customers IS 'Main customers table for managing client relationships';
COMMENT ON TABLE customer_contacts IS 'Additional contact persons for each customer';
COMMENT ON TABLE customer_notes IS 'Activity log and notes for customer interactions';

-- Function to auto-generate customer numbers
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_number IS NULL THEN
    NEW.customer_number := 'CUST-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('customers_id_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customer_number
BEFORE INSERT ON customers
FOR EACH ROW
EXECUTE FUNCTION generate_customer_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customer_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customers_timestamp
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_customer_timestamp();

CREATE TRIGGER update_customer_contacts_timestamp
BEFORE UPDATE ON customer_contacts
FOR EACH ROW
EXECUTE FUNCTION update_customer_timestamp();

CREATE TRIGGER update_customer_notes_timestamp
BEFORE UPDATE ON customer_notes
FOR EACH ROW
EXECUTE FUNCTION update_customer_timestamp();

-- Add customer_id to sales_orders if not exists (link orders to customers)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='sales_orders' AND column_name='customer_id'
  ) THEN
    ALTER TABLE sales_orders ADD COLUMN customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL;
    CREATE INDEX idx_sales_orders_customer_id ON sales_orders(customer_id);
  END IF;
END $$;

-- Update customer metrics when orders are created/updated
CREATE OR REPLACE FUNCTION update_customer_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE customers SET
      total_orders = (SELECT COUNT(*) FROM sales_orders WHERE customer_id = NEW.customer_id),
      total_revenue = (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE customer_id = NEW.customer_id),
      last_order_date = (SELECT MAX(order_date) FROM sales_orders WHERE customer_id = NEW.customer_id),
      updated_at = NOW()
    WHERE id = NEW.customer_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE customers SET
      total_orders = (SELECT COUNT(*) FROM sales_orders WHERE customer_id = OLD.customer_id),
      total_revenue = (SELECT COALESCE(SUM(total_amount), 0) FROM sales_orders WHERE customer_id = OLD.customer_id),
      last_order_date = (SELECT MAX(order_date) FROM sales_orders WHERE customer_id = OLD.customer_id),
      updated_at = NOW()
    WHERE id = OLD.customer_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_metrics_on_order
AFTER INSERT OR UPDATE OR DELETE ON sales_orders
FOR EACH ROW
EXECUTE FUNCTION update_customer_metrics();
