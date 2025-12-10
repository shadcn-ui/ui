-- Ensure core accounting `accounts` exist (idempotent)
-- Creates 1110 (Cash), 1300 (Accounts Receivable), 4100 (Sales Revenue) if missing

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = '1110') THEN
    INSERT INTO accounts (id, account_number, account_name, account_type, is_active, created_at)
    VALUES (uuid_generate_v4(), '1110', 'Cash and Cash Equivalents', 'Asset', true, NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = '1300') THEN
    INSERT INTO accounts (id, account_number, account_name, account_type, is_active, created_at)
    VALUES (uuid_generate_v4(), '1300', 'Accounts Receivable', 'Asset', true, NOW());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_number = '4100') THEN
    INSERT INTO accounts (id, account_number, account_name, account_type, is_active, created_at)
    VALUES (uuid_generate_v4(), '4100', 'Sales Revenue', 'Revenue', true, NOW());
  END IF;
END
$$;

-- Optional: show results
SELECT id, account_number, account_name FROM accounts WHERE account_number IN ('1110','1300','4100');
