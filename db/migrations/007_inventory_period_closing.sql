-- Migration: Inventory Period Closing
-- Enforces inventory close aligned with accounting period close
-- - Adds inventory_closed flags to accounting_periods
-- - Creates inventory_period_closings + inventory_snapshots (immutable)
-- - Blocks stock movements in closed periods

-- =============================================================
-- 1) Table: inventory_period_closings
-- =============================================================
CREATE TABLE IF NOT EXISTS inventory_period_closings (
  id SERIAL PRIMARY KEY,
  period_id INTEGER NOT NULL REFERENCES accounting_periods(id) ON DELETE CASCADE,
  closed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  closed_by UUID NOT NULL REFERENCES users(id),
  total_qty NUMERIC(18,3) DEFAULT 0,
  total_value NUMERIC(18,4) DEFAULT 0,
  snapshot_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_inventory_period UNIQUE (period_id)
);

-- =============================================================
-- 2) Table: inventory_snapshots (immutable)
-- =============================================================
CREATE TABLE IF NOT EXISTS inventory_snapshots (
  id SERIAL PRIMARY KEY,
  period_id INTEGER NOT NULL REFERENCES accounting_periods(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_id INTEGER REFERENCES warehouses(id),
  quantity NUMERIC(18,3) NOT NULL,
  unit_cost NUMERIC(18,4) DEFAULT 0,
  total_cost NUMERIC(18,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_inventory_snapshot UNIQUE (period_id, item_id, warehouse_id)
);

-- Prevent modification/deletion of snapshots
CREATE OR REPLACE FUNCTION prevent_inventory_snapshot_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Inventory snapshots are immutable and cannot be changed';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_inventory_snapshot_update
BEFORE UPDATE ON inventory_snapshots
FOR EACH ROW
EXECUTE FUNCTION prevent_inventory_snapshot_modification();

CREATE TRIGGER trigger_prevent_inventory_snapshot_delete
BEFORE DELETE ON inventory_snapshots
FOR EACH ROW
EXECUTE FUNCTION prevent_inventory_snapshot_modification();

-- =============================================================
-- 3) Extend accounting_periods with inventory close flags
-- =============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounting_periods' AND column_name = 'inventory_closed'
  ) THEN
    ALTER TABLE accounting_periods ADD COLUMN inventory_closed BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounting_periods' AND column_name = 'inventory_closed_at'
  ) THEN
    ALTER TABLE accounting_periods ADD COLUMN inventory_closed_at TIMESTAMP WITH TIME ZONE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounting_periods' AND column_name = 'inventory_closed_by'
  ) THEN
    ALTER TABLE accounting_periods ADD COLUMN inventory_closed_by UUID REFERENCES users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'accounting_periods' AND column_name = 'inventory_closing_id'
  ) THEN
    ALTER TABLE accounting_periods ADD COLUMN inventory_closing_id INTEGER REFERENCES inventory_period_closings(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'accounting_periods' AND constraint_name = 'check_inventory_closed'
  ) THEN
    ALTER TABLE accounting_periods
    ADD CONSTRAINT check_inventory_closed CHECK (
      (inventory_closed = false) OR 
      (inventory_closed = true AND inventory_closed_at IS NOT NULL AND inventory_closed_by IS NOT NULL)
    );
  END IF;
END $$;

-- =============================================================
-- 4) Trigger: block stock/inventory movements in closed periods
-- =============================================================
CREATE OR REPLACE FUNCTION block_inventory_movements_when_closed()
RETURNS TRIGGER AS $$
DECLARE
  v_period RECORD;
  v_movement_date DATE;
BEGIN
  v_movement_date := COALESCE(
    CASE WHEN TG_TABLE_NAME = 'stock_movements' THEN NEW.movement_date::date ELSE NEW.created_at::date END,
    CURRENT_DATE
  );

  SELECT id, period_name, start_date, end_date, inventory_closed
  INTO v_period
  FROM accounting_periods
  WHERE v_movement_date BETWEEN start_date AND end_date
  LIMIT 1;

  IF v_period.inventory_closed THEN
    RAISE EXCEPTION 'Inventory period % (% - %) is closed. Post corrections in the next open period.', v_period.period_name, v_period.start_date, v_period.end_date;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to current and legacy movement tables
CREATE TRIGGER block_closed_stock_movements
BEFORE INSERT OR UPDATE ON stock_movements
FOR EACH ROW
EXECUTE FUNCTION block_inventory_movements_when_closed();

CREATE TRIGGER block_closed_inventory_movements
BEFORE INSERT OR UPDATE ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION block_inventory_movements_when_closed();

-- =============================================================
-- 5) Indexes
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_period ON inventory_snapshots(period_id);
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_item ON inventory_snapshots(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_snapshots_wh ON inventory_snapshots(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_period_closings_period ON inventory_period_closings(period_id);
CREATE INDEX IF NOT EXISTS idx_inventory_period_closings_closed_at ON inventory_period_closings(closed_at);

-- =============================================================
-- 6) Comments
-- =============================================================
COMMENT ON TABLE inventory_period_closings IS 'Inventory period close header with totals and snapshot hash';
COMMENT ON TABLE inventory_snapshots IS 'Immutable per-item, per-warehouse inventory snapshot at close';
COMMENT ON FUNCTION block_inventory_movements_when_closed IS 'Prevents stock movements from posting into closed inventory periods';
COMMENT ON FUNCTION prevent_inventory_snapshot_modification IS 'Guards immutability of inventory snapshots';
