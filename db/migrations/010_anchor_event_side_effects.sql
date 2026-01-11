-- Migration: Anchor event side-effect traceability
-- Adds source_event_id tracking to accounting and inventory tables for idempotent, auditable writes

-- Journal entries and lines
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS source_event_id UUID;
ALTER TABLE journal_entry_lines ADD COLUMN IF NOT EXISTS source_event_id UUID;
CREATE INDEX IF NOT EXISTS idx_journal_entries_source_event ON journal_entries(source_event_id);
CREATE INDEX IF NOT EXISTS idx_journal_lines_source_event ON journal_entry_lines(source_event_id);

-- Stock movements
ALTER TABLE stock_movements ADD COLUMN IF NOT EXISTS source_event_id UUID;
CREATE INDEX IF NOT EXISTS idx_stock_movements_source_event ON stock_movements(source_event_id);

-- Sales orders and lines
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS source_event_id UUID;
ALTER TABLE sales_order_items ADD COLUMN IF NOT EXISTS source_event_id UUID;
CREATE INDEX IF NOT EXISTS idx_sales_orders_source_event ON sales_orders(source_event_id);
CREATE INDEX IF NOT EXISTS idx_sales_order_items_source_event ON sales_order_items(source_event_id);

-- Inventory snapshots table may also need source linkage (optional)
ALTER TABLE inventory_snapshots ADD COLUMN IF NOT EXISTS source_event_id UUID;
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_source_event ON inventory_snapshots(source_event_id);
