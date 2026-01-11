-- Issue logging for explainable failures
CREATE TABLE IF NOT EXISTS issue_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  type TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  error_code TEXT NOT NULL,
  human_message TEXT NOT NULL,
  suggested_next_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  period_id INTEGER,
  source TEXT,
  metadata JSONB DEFAULT '{}',
  resolution_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_issue_logs_status ON issue_logs(status);
CREATE INDEX IF NOT EXISTS idx_issue_logs_period ON issue_logs(period_id);
CREATE INDEX IF NOT EXISTS idx_issue_logs_error_code ON issue_logs(error_code);
CREATE INDEX IF NOT EXISTS idx_issue_logs_created_at ON issue_logs(created_at DESC);
