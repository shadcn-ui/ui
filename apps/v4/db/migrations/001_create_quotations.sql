-- Migration: create quotations and quotation_items
-- Run this against your ocean-erp database (psql -f ...)

CREATE TABLE IF NOT EXISTS quotations (
  id SERIAL PRIMARY KEY,
  reference_number VARCHAR(64),
  customer VARCHAR(255) NOT NULL,
  total_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'Draft',
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_items (
  id SERIAL PRIMARY KEY,
  quotation_id INTEGER NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
  line_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to keep quotations.total_value up to date could be added later.
