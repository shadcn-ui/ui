-- Advanced Reporting System
-- Created: December 2025
-- Purpose: Custom report builder, scheduled reports, and analytics dashboards

-- Report Definitions
CREATE TABLE IF NOT EXISTS report_definitions (
    id SERIAL PRIMARY KEY,
    report_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'sales', 'inventory', 'financial', 'customer', 'operations'
    report_type VARCHAR(50) NOT NULL, -- 'table', 'chart', 'dashboard', 'pivot'
    data_source VARCHAR(100) NOT NULL, -- Table or view name
    query_config JSONB NOT NULL, -- {columns: [], filters: [], groupBy: [], orderBy: []}
    chart_config JSONB, -- {type: 'bar', xAxis: 'date', yAxis: 'amount', ...}
    parameters JSONB, -- [{name: 'start_date', type: 'date', required: true}]
    output_formats VARCHAR(100)[] DEFAULT ARRAY['pdf', 'excel', 'csv'], -- Supported export formats
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Schedules
CREATE TABLE IF NOT EXISTS report_schedules (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES report_definitions(id) ON DELETE CASCADE,
    schedule_name VARCHAR(200) NOT NULL,
    frequency VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
    schedule_time TIME NOT NULL, -- Time to run (e.g., 08:00:00)
    schedule_day VARCHAR(20), -- For weekly: 'monday', For monthly: '1', '15', 'last'
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    parameters JSONB, -- Parameter values for the report
    recipients VARCHAR(500)[], -- Email addresses to send to
    output_format VARCHAR(20) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP,
    next_run_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Execution History
CREATE TABLE IF NOT EXISTS report_executions (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES report_definitions(id),
    schedule_id INTEGER REFERENCES report_schedules(id),
    executed_by UUID REFERENCES users(id),
    parameters JSONB,
    execution_time_ms INTEGER, -- Time taken to generate
    row_count INTEGER, -- Number of rows in result
    file_size INTEGER, -- Size in bytes
    file_path VARCHAR(500), -- Path to generated file
    output_format VARCHAR(20),
    status VARCHAR(50) DEFAULT 'success', -- 'success', 'failed', 'partial'
    error_message TEXT,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Definitions
CREATE TABLE IF NOT EXISTS dashboards (
    id SERIAL PRIMARY KEY,
    dashboard_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'executive', 'sales', 'operations', 'finance'
    layout_config JSONB NOT NULL, -- {widgets: [{id, position, size, reportId}]}
    refresh_interval INTEGER DEFAULT 300, -- Seconds, 0 = no auto-refresh
    is_default BOOLEAN DEFAULT false,
    role_ids INTEGER[], -- Roles that can access this dashboard
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Widgets (KPI Cards, Charts, Tables)
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id SERIAL PRIMARY KEY,
    dashboard_id INTEGER REFERENCES dashboards(id) ON DELETE CASCADE,
    widget_code VARCHAR(50) NOT NULL,
    widget_type VARCHAR(50) NOT NULL, -- 'kpi', 'chart', 'table', 'gauge', 'trend'
    title VARCHAR(200) NOT NULL,
    report_id INTEGER REFERENCES report_definitions(id),
    position JSONB NOT NULL, -- {row: 0, col: 0, width: 4, height: 2}
    config JSONB, -- Widget-specific configuration
    data_refresh_interval INTEGER DEFAULT 300, -- Seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dashboard_id, widget_code)
);

-- User Saved Reports
CREATE TABLE IF NOT EXISTS user_saved_reports (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    report_id INTEGER REFERENCES report_definitions(id) ON DELETE CASCADE,
    saved_name VARCHAR(200),
    parameters JSONB, -- User's saved parameter values
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, report_id, saved_name)
);

-- Indexes
CREATE INDEX idx_report_definitions_category ON report_definitions(category);
CREATE INDEX idx_report_definitions_code ON report_definitions(report_code);
CREATE INDEX idx_report_schedules_next_run ON report_schedules(next_run_at) WHERE is_active = true;
CREATE INDEX idx_report_executions_report ON report_executions(report_id, executed_at);
CREATE INDEX idx_report_executions_user ON report_executions(executed_by, executed_at);
CREATE INDEX idx_dashboards_code ON dashboards(dashboard_code);
CREATE INDEX idx_dashboard_widgets_dashboard ON dashboard_widgets(dashboard_id);
CREATE INDEX idx_user_saved_reports_user ON user_saved_reports(user_id);

-- Seed Data: Pre-configured Reports
INSERT INTO report_definitions (report_code, name, description, category, report_type, data_source, query_config, chart_config, parameters) VALUES
('SALES_DAILY', 'Daily Sales Report', 'Daily sales summary with payment breakdown', 'sales', 'table', 'pos_transactions', 
 '{"columns": ["transaction_date", "grand_total", "payment_status"], "groupBy": ["transaction_date"], "orderBy": [{"field": "transaction_date", "direction": "DESC"}]}',
 '{"type": "line", "xAxis": "transaction_date", "yAxis": "grand_total"}',
 '[{"name": "start_date", "type": "date", "required": true}, {"name": "end_date", "type": "date", "required": true}]'),

('INVENTORY_STOCK', 'Stock Level Report', 'Current inventory levels with reorder alerts', 'inventory', 'table', 'inventory',
 '{"columns": ["product_name", "quantity", "reorder_level", "warehouse"], "filters": [{"field": "quantity", "operator": "<=", "value": "reorder_level"}]}',
 '{"type": "bar", "xAxis": "product_name", "yAxis": "quantity"}',
 '[{"name": "warehouse_id", "type": "select", "required": false}]'),

('CUSTOMER_SALES', 'Top Customers Report', 'Top customers by sales volume and frequency', 'customer', 'table', 'customers',
 '{"columns": ["name", "total_purchases", "lifetime_value"], "orderBy": [{"field": "lifetime_value", "direction": "DESC"}], "limit": 50}',
 '{"type": "bar", "xAxis": "name", "yAxis": "lifetime_value"}',
 '[{"name": "period", "type": "select", "options": ["month", "quarter", "year"], "required": true}]'),

('FINANCIAL_SUMMARY', 'Financial Summary', 'Revenue, expenses, and profit summary', 'financial', 'dashboard', 'journal_entries',
 '{"columns": ["account_type", "debit_total", "credit_total", "balance"], "groupBy": ["account_type"]}',
 '{"type": "pie", "nameField": "account_type", "valueField": "balance"}',
 '[{"name": "start_date", "type": "date", "required": true}, {"name": "end_date", "type": "date", "required": true}]');

-- Seed Data: Executive Dashboard
INSERT INTO dashboards (dashboard_code, name, description, category, layout_config, is_default) VALUES
('EXEC_DASHBOARD', 'Executive Dashboard', 'High-level business metrics and KPIs', 'executive',
 '{"widgets": [
    {"id": "revenue_kpi", "position": {"row": 0, "col": 0, "width": 3, "height": 1}},
    {"id": "orders_kpi", "position": {"row": 0, "col": 3, "width": 3, "height": 1}},
    {"id": "customers_kpi", "position": {"row": 0, "col": 6, "width": 3, "height": 1}},
    {"id": "profit_kpi", "position": {"row": 0, "col": 9, "width": 3, "height": 1}},
    {"id": "sales_trend", "position": {"row": 1, "col": 0, "width": 8, "height": 3}},
    {"id": "top_products", "position": {"row": 1, "col": 8, "width": 4, "height": 3}}
  ]}',
 true);

-- Auto-update timestamp triggers
CREATE OR REPLACE FUNCTION update_reporting_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_definitions_timestamp
    BEFORE UPDATE ON report_definitions
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

CREATE TRIGGER update_report_schedules_timestamp
    BEFORE UPDATE ON report_schedules
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

CREATE TRIGGER update_dashboards_timestamp
    BEFORE UPDATE ON dashboards
    FOR EACH ROW EXECUTE FUNCTION update_reporting_timestamp();

-- Function: Calculate next run time for scheduled reports
CREATE OR REPLACE FUNCTION calculate_next_run_time(
    p_frequency VARCHAR,
    p_schedule_time TIME,
    p_schedule_day VARCHAR,
    p_last_run TIMESTAMP
) RETURNS TIMESTAMP AS $$
DECLARE
    v_next_run TIMESTAMP;
    v_base_date DATE;
BEGIN
    v_base_date := COALESCE(DATE(p_last_run), CURRENT_DATE);
    
    CASE p_frequency
        WHEN 'daily' THEN
            v_next_run := v_base_date + INTERVAL '1 day' + p_schedule_time;
        WHEN 'weekly' THEN
            v_next_run := v_base_date + INTERVAL '1 week' + p_schedule_time;
        WHEN 'monthly' THEN
            IF p_schedule_day = 'last' THEN
                v_next_run := (DATE_TRUNC('month', v_base_date) + INTERVAL '2 month - 1 day')::DATE + p_schedule_time;
            ELSE
                v_next_run := (DATE_TRUNC('month', v_base_date) + INTERVAL '1 month')::DATE + (p_schedule_day::INTEGER - 1) * INTERVAL '1 day' + p_schedule_time;
            END IF;
        WHEN 'quarterly' THEN
            v_next_run := (DATE_TRUNC('quarter', v_base_date) + INTERVAL '3 month')::DATE + p_schedule_time;
        ELSE
            v_next_run := CURRENT_TIMESTAMP + INTERVAL '1 day';
    END CASE;
    
    -- If next run is in the past, calculate from current timestamp
    IF v_next_run <= CURRENT_TIMESTAMP THEN
        RETURN calculate_next_run_time(p_frequency, p_schedule_time, p_schedule_day, CURRENT_TIMESTAMP);
    END IF;
    
    RETURN v_next_run;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE report_definitions IS 'Custom report definitions with query and chart configurations';
COMMENT ON TABLE report_schedules IS 'Scheduled report execution with email delivery';
COMMENT ON TABLE report_executions IS 'History of report executions for audit and file access';
COMMENT ON TABLE dashboards IS 'Dashboard layouts with widget positioning';
COMMENT ON TABLE dashboard_widgets IS 'Individual widgets within dashboards';
