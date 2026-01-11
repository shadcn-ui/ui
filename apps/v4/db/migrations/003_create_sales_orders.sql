-- Migration: create sales_orders and sales_order_items tables
-- Sales orders are created from quotations or opportunities
-- Run this against your ocean-erp database: psql -U mac -d ocean-erp -f 003_create_sales_orders.sql

CREATE TABLE IF NOT EXISTS sales_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(64) UNIQUE,
  customer VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  billing_address TEXT,
  shipping_address TEXT,
  
  -- Reference to source (quotation or opportunity)
  quotation_id INTEGER REFERENCES quotations(id) ON DELETE SET NULL,
  opportunity_id INTEGER REFERENCES opportunities(id) ON DELETE SET NULL,
  lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
  
  -- Financial details
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  
  -- Order status workflow
  status VARCHAR(32) NOT NULL DEFAULT 'Pending',
  -- Status options: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded
  
  payment_status VARCHAR(32) NOT NULL DEFAULT 'Unpaid',
  -- Payment status: Unpaid, Partial, Paid, Refunded
  
  payment_method VARCHAR(50),
  payment_terms VARCHAR(255),
  
  -- Dates
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Additional info
  notes TEXT,
  internal_notes TEXT,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by INTEGER, -- Could reference users table
  assigned_to INTEGER  -- Sales rep responsible
);

CREATE TABLE IF NOT EXISTS sales_order_items (
  id SERIAL PRIMARY KEY,
  sales_order_id INTEGER NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  
  product_code VARCHAR(100),
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  
  -- Discounts can be applied per item
  discount_percent NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(14,2) DEFAULT 0,
  
  tax_percent NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(14,2) DEFAULT 0,
  
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  
  -- Optional: track inventory
  warehouse_location VARCHAR(100),
  serial_number VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_number ON sales_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders(customer);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_payment_status ON sales_orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON sales_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_sales_orders_quotation_id ON sales_orders(quotation_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_opportunity_id ON sales_orders(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_lead_id ON sales_orders(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_items_order_id ON sales_order_items(sales_order_id);

-- Comments for documentation
COMMENT ON TABLE sales_orders IS 'Main sales orders table tracking customer orders from quotations/opportunities';
COMMENT ON TABLE sales_order_items IS 'Line items for each sales order';
COMMENT ON COLUMN sales_orders.order_number IS 'Unique order reference number (e.g., SO-2025-001)';
COMMENT ON COLUMN sales_orders.status IS 'Order fulfillment status: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded';
COMMENT ON COLUMN sales_orders.payment_status IS 'Payment tracking: Unpaid, Partial, Paid, Refunded';

-- Function to auto-generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'SO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('sales_orders_id_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
BEFORE INSERT ON sales_orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sales_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sales_orders_timestamp
BEFORE UPDATE ON sales_orders
FOR EACH ROW
EXECUTE FUNCTION update_sales_order_timestamp();

CREATE TRIGGER update_sales_order_items_timestamp
BEFORE UPDATE ON sales_order_items
FOR EACH ROW
EXECUTE FUNCTION update_sales_order_timestamp();
