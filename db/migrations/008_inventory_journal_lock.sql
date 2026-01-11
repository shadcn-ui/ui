-- Migration: Enforce inventory journal immutability after inventory close
-- Adds helper is_inventory_account(account_id)
-- Adds trigger to block journal lines for closed inventory periods with audit logging

-- 1) Helper: classify inventory-related accounts
CREATE OR REPLACE FUNCTION is_inventory_account(p_account_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_subtype TEXT;
BEGIN
  SELECT UPPER(account_subtype)
  INTO v_subtype
  FROM chart_of_accounts
  WHERE id = p_account_id;

  RETURN v_subtype IN ('INVENTORY', 'INVENTORY_CLEARING', 'INVENTORY CLEARING', 'COGS');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2) Trigger to block inventory-impacting journal lines when inventory period is closed
CREATE OR REPLACE FUNCTION block_inventory_journal_lines_when_closed()
RETURNS TRIGGER AS $$
DECLARE
  v_entry RECORD;
  v_period RECORD;
  v_actor UUID;
BEGIN
  -- Pull journal header
  SELECT je.id, je.entry_date, je.created_by, je.posted_by
  INTO v_entry
  FROM journal_entries je
  WHERE je.id = NEW.journal_entry_id
  FOR UPDATE;

  -- If no header found, let constraint elsewhere handle
  IF v_entry.id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Locate period for the entry date
  SELECT id, inventory_closed
  INTO v_period
  FROM accounting_periods
  WHERE v_entry.entry_date::date BETWEEN start_date AND end_date
  LIMIT 1;

  IF v_period.id IS NULL THEN
    RETURN NEW; -- No defined period; do not block here
  END IF;

  -- Block if inventory is closed and account is inventory-related
  IF v_period.inventory_closed = true AND is_inventory_account(NEW.account_id) THEN
    v_actor := COALESCE(v_entry.posted_by, v_entry.created_by, (
      SELECT id FROM users ORDER BY created_at ASC LIMIT 1
    ));

    PERFORM log_audit_event(
      'JOURNAL_BLOCKED',
      'CLOSING',
      v_actor,
      v_period.id,
      v_entry.id,
      NULL,
      jsonb_build_object(
        'reason', 'INVENTORY_PERIOD_LOCK',
        'account_id', NEW.account_id
      ),
      NULL
    );

    RAISE EXCEPTION 'Inventory is closed for this period. Adjust via next period.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_block_inventory_journal_lines ON journal_entry_lines;
CREATE TRIGGER trg_block_inventory_journal_lines
BEFORE INSERT ON journal_entry_lines
FOR EACH ROW
EXECUTE FUNCTION block_inventory_journal_lines_when_closed();
