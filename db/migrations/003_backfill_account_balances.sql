-- Backfill accounts.current_balance from posted journal entries
-- Idempotent: will only update accounts that have matching posted journal entries

BEGIN;

-- Compute balance per account from posted journal entries: debit_amount - credit_amount
WITH agg AS (
  SELECT
    jel.account_id AS account_id,
    SUM(COALESCE(jel.debit_amount,0) - COALESCE(jel.credit_amount,0)) AS balance
  FROM journal_entry_lines jel
  JOIN journal_entries je ON je.id = jel.journal_entry_id
  WHERE je.status = 'Posted'
  GROUP BY jel.account_id
)
UPDATE accounts a
SET current_balance = COALESCE(agg.balance, 0),
    updated_at = NOW()
FROM agg
WHERE a.id = agg.account_id::uuid
;

-- For accounts without posted entries, ensure current_balance is not null
UPDATE accounts
SET current_balance = 0
WHERE current_balance IS NULL;

COMMIT;
