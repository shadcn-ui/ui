-- Migration: Move account balance maintenance from chart_of_accounts -> accounts (UUID)
-- Adds opening_balance/current_balance to `accounts` if missing,
-- and replaces the legacy `update_account_balances` function/trigger to work with `accounts`.

BEGIN;

-- Add balance columns to accounts if they don't exist
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS opening_balance NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_balance NUMERIC DEFAULT 0;

-- Drop the old trigger if it exists (the legacy trigger referenced chart_of_accounts)
DROP TRIGGER IF EXISTS trigger_update_account_balances ON journal_entries;

-- Create a new function that updates balances on `accounts` (UUID)
CREATE OR REPLACE FUNCTION update_account_balances()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Posted' AND (OLD.status IS NULL OR OLD.status != 'Posted') THEN
    -- Update each affected account's current_balance based on posted journal lines
    UPDATE accounts a
    SET current_balance = a.opening_balance + (
      SELECT COALESCE(SUM(
        CASE
          WHEN a.account_type IN ('Asset', 'Expense') THEN jel.debit_amount - jel.credit_amount
          ELSE jel.credit_amount - jel.debit_amount
        END
      ), 0)
      FROM journal_entry_lines jel
      JOIN journal_entries je ON jel.journal_entry_id = je.id
      WHERE jel.account_id = a.id
      AND je.status = 'Posted'
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE a.id IN (
      SELECT DISTINCT account_id FROM journal_entry_lines WHERE journal_entry_id = NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function after journal_entries update
DROP TRIGGER IF EXISTS trigger_update_account_balances ON journal_entries;
CREATE TRIGGER trigger_update_account_balances
AFTER UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_account_balances();

COMMIT;
