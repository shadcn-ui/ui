-- If `opening_balance` is not set, initialize it to current_balance
BEGIN;

ALTER TABLE IF EXISTS accounts
  ADD COLUMN IF NOT EXISTS opening_balance numeric;

UPDATE accounts
SET opening_balance = COALESCE(opening_balance, current_balance, 0),
    updated_at = NOW()
WHERE opening_balance IS NULL OR opening_balance IS DISTINCT FROM current_balance;

COMMIT;
