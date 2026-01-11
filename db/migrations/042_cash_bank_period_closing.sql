-- Cash & Bank period closing guardrails
-- Adds cash_closed flags and enforces blocking cash/bank activity after close.

BEGIN;

ALTER TABLE accounting_periods
  ADD COLUMN IF NOT EXISTS cash_closed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cash_closed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS cash_closed_by UUID;

-- Immutable helper to identify cash/bank accounts (by type or subtype)
CREATE OR REPLACE FUNCTION is_cash_bank_account(account_id_in chart_of_accounts.id%TYPE)
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    UPPER(account_type) IN ('CASH','BANK')
    OR account_subtype ILIKE '%cash%'
    OR account_subtype ILIKE '%bank%'
  , false)
  FROM chart_of_accounts
  WHERE id = account_id_in;
$$ LANGUAGE SQL IMMUTABLE;

-- Block postings to cash/bank accounts when the period containing the JE date is cash-closed
CREATE OR REPLACE FUNCTION block_closed_cash_bank()
RETURNS TRIGGER AS $$
DECLARE
  p RECORD;
  je_id bigint;
  je_date date;
  acct_id chart_of_accounts.id%TYPE;
BEGIN
  je_id := COALESCE(NEW.journal_entry_id, OLD.journal_entry_id);
  acct_id := COALESCE(NEW.account_id, OLD.account_id);

  -- If no journal entry context, allow (defensive)
  IF je_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT entry_date INTO je_date FROM journal_entries WHERE id = je_id;

  -- Resolve the period by entry date
  SELECT id, cash_closed INTO p
  FROM accounting_periods
  WHERE je_date BETWEEN start_date AND end_date
  ORDER BY end_date DESC
  LIMIT 1;

  IF p.cash_closed IS TRUE AND is_cash_bank_account(acct_id) THEN
    RAISE EXCEPTION 'Cash/Bank closed. Adjust next period only.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_block_closed_cash_bank ON journal_entry_lines;
CREATE TRIGGER trg_block_closed_cash_bank
BEFORE INSERT OR UPDATE OR DELETE ON journal_entry_lines
FOR EACH ROW
EXECUTE FUNCTION block_closed_cash_bank();

-- Append-only audit log for cash/bank closing
CREATE TABLE IF NOT EXISTS cash_bank_close_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id INTEGER NOT NULL REFERENCES accounting_periods(id),
  closed_by UUID NOT NULL,
  closed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  snapshot JSONB NOT NULL,
  snapshot_hash TEXT NOT NULL,
  validation JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION block_cash_bank_close_audit_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'cash_bank_close_audit is append-only';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_block_cash_bank_close_audit_update ON cash_bank_close_audit;
CREATE TRIGGER trg_block_cash_bank_close_audit_update
BEFORE UPDATE OR DELETE ON cash_bank_close_audit
FOR EACH ROW
EXECUTE FUNCTION block_cash_bank_close_audit_mutation();

COMMIT;
