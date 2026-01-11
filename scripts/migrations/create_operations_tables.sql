-- Operations Management Module Database Schema
-- Creates tables for Manufacturing, Production Planning, Quality Control, Logistics, Supply Chain, and Project Management

-- ============================================
-- 1. MANUFACTURING MODULE
-- ============================================

-- Work Orders Table
CREATE TABLE IF NOT EXISTS work_orders (
  id SERIAL PRIMARY KEY,
  work_order_number VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
  start_date DATE,
  due_date DATE,
  progress INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bill of Materials (BOM)
CREATE TABLE IF NOT EXISTS bill_of_materials (
  id SERIAL PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  component_name VARCHAR(255) NOT NULL,
  quantity_required DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50),
  cost_per_unit DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Production Lines
CREATE TABLE IF NOT EXISTS production_lines (
  id SERIAL PRIMARY KEY,
  line_name VARCHAR(100) UNIQUE NOT NULL,
  capacity INTEGER,
  status VARCHAR(50) DEFAULT 'Active',
  efficiency_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. PRODUCTION PLANNING MODULE
-- ============================================

-- Production Schedules
CREATE TABLE IF NOT EXISTS production_schedules (
  id SERIAL PRIMARY KEY,
  schedule_number VARCHAR(50) UNIQUE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  planned_quantity INTEGER NOT NULL,
  production_line_id INTEGER REFERENCES production_lines(id),
  scheduled_date DATE NOT NULL,
  shift VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Capacity Planning
CREATE TABLE IF NOT EXISTS capacity_planning (
  id SERIAL PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  production_line_id INTEGER REFERENCES production_lines(id),
  available_capacity INTEGER,
  planned_capacity INTEGER,
  actual_capacity INTEGER,
  utilization_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. QUALITY CONTROL MODULE
-- ============================================

-- Quality Inspections
CREATE TABLE IF NOT EXISTS quality_inspections (
  id SERIAL PRIMARY KEY,
  inspection_number VARCHAR(50) UNIQUE NOT NULL,
  work_order_id INTEGER REFERENCES work_orders(id),
  product_name VARCHAR(255) NOT NULL,
  inspection_date DATE NOT NULL,
  inspector_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  result VARCHAR(50),
  pass_quantity INTEGER,
  fail_quantity INTEGER,
  defect_description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality Standards
CREATE TABLE IF NOT EXISTS quality_standards (
  id SERIAL PRIMARY KEY,
  standard_name VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  acceptance_criteria TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Non-Conformance Reports (NCR)
CREATE TABLE IF NOT EXISTS non_conformance_reports (
  id SERIAL PRIMARY KEY,
  ncr_number VARCHAR(50) UNIQUE NOT NULL,
  inspection_id INTEGER REFERENCES quality_inspections(id),
  issue_description TEXT NOT NULL,
  severity VARCHAR(50),
  root_cause TEXT,
  corrective_action TEXT,
  status VARCHAR(50) DEFAULT 'Open',
  reported_date DATE NOT NULL,
  closed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. LOGISTICS MODULE
-- ============================================

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  shipment_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  destination_address TEXT NOT NULL,
  shipping_method VARCHAR(100),
  carrier_name VARCHAR(100),
  tracking_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Preparing',
  shipment_date DATE,
  estimated_delivery DATE,
  actual_delivery DATE,
  total_weight DECIMAL(10,2),
  total_cost DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment Items
CREATE TABLE IF NOT EXISTS shipment_items (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  warehouse_name VARCHAR(100) UNIQUE NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  manager_name VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. SUPPLY CHAIN MODULE
-- ============================================

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  supplier_name VARCHAR(255) UNIQUE NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  category VARCHAR(100),
  rating DECIMAL(3,2),
  status VARCHAR(50) DEFAULT 'Active',
  payment_terms VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id INTEGER REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_delivery DATE,
  status VARCHAR(50) DEFAULT 'Draft',
  total_amount DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id SERIAL PRIMARY KEY,
  po_id INTEGER REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2),
  total_price DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Performance
CREATE TABLE IF NOT EXISTS supplier_performance (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  evaluation_date DATE NOT NULL,
  on_time_delivery_rate DECIMAL(5,2),
  quality_rate DECIMAL(5,2),
  response_time_days INTEGER,
  overall_score DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. PROJECT MANAGEMENT MODULE
-- ============================================

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_number VARCHAR(50) UNIQUE NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Planning',
  priority VARCHAR(20) DEFAULT 'Medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  progress INTEGER DEFAULT 0,
  manager_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Tasks
CREATE TABLE IF NOT EXISTS project_tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to VARCHAR(100),
  status VARCHAR(50) DEFAULT 'To Do',
  priority VARCHAR(20) DEFAULT 'Medium',
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2),
  progress INTEGER DEFAULT 0,
  parent_task_id INTEGER REFERENCES project_tasks(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  milestone_name VARCHAR(255) NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  actual_date DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Resources
CREATE TABLE IF NOT EXISTS project_resources (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  resource_name VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  quantity INTEGER,
  cost_per_unit DECIMAL(15,2),
  total_cost DECIMAL(15,2),
  allocated_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_created ON work_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_production_schedules_date ON production_schedules(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_quality_inspections_date ON quality_inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_date ON shipments(shipment_date);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON project_tasks(status);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE work_orders IS 'Manufacturing work orders for production tracking';
COMMENT ON TABLE production_schedules IS 'Production planning and scheduling';
COMMENT ON TABLE quality_inspections IS 'Quality control inspections and testing';
COMMENT ON TABLE shipments IS 'Logistics and delivery management';
COMMENT ON TABLE suppliers IS 'Supply chain supplier management';
COMMENT ON TABLE projects IS 'Project management and tracking';
