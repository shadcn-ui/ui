-- Migration: Create stock_movements table
-- Date: 2025-12-11

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id INTEGER,
  from_warehouse_id INTEGER,
  to_warehouse_id INTEGER,
  movement_type VARCHAR(100) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost NUMERIC(15,2) DEFAULT 0,
  total_value NUMERIC(18,4) DEFAULT 0,
  balance_before INTEGER,
  balance_after INTEGER,
  batch_number VARCHAR(100),
  serial_numbers TEXT,
  reference_type VARCHAR(100),
  reference_id UUID,
  reference_number VARCHAR(100),
  from_location_id INTEGER,
  to_location_id INTEGER,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  movement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_movement_date ON stock_movements (movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements (product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_warehouse_id ON stock_movements (warehouse_id);
