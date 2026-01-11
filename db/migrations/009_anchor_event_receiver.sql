-- Migration: Anchor Event Receiver Support
-- Adds idempotency and event log tables for Anchor integration events

-- 1) Idempotency store to enforce exactly-once semantics per Idempotency-Key
CREATE TABLE IF NOT EXISTS anchor_event_idempotency (
  id SERIAL PRIMARY KEY,
  idempotency_key UUID NOT NULL UNIQUE,
  event_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_body JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anchor_idem_event ON anchor_event_idempotency(event_id);
CREATE INDEX IF NOT EXISTS idx_anchor_idem_type ON anchor_event_idempotency(event_type);

-- 2) Event log for audit + dependency checks
CREATE TABLE IF NOT EXISTS anchor_event_log (
  id SERIAL PRIMARY KEY,
  event_id UUID NOT NULL,
  idempotency_key UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_time TIMESTAMPTZ NOT NULL,
  payload JSONB,
  outcome TEXT NOT NULL, -- ACCEPTED | REJECTED
  reason_code TEXT,
  message TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_anchor_event_log_event_id ON anchor_event_log(event_id);
CREATE INDEX IF NOT EXISTS idx_anchor_event_log_idem ON anchor_event_log(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_anchor_event_log_type ON anchor_event_log(event_type);
CREATE INDEX IF NOT EXISTS idx_anchor_event_log_time ON anchor_event_log(event_time);
CREATE INDEX IF NOT EXISTS idx_anchor_event_log_order ON anchor_event_log((payload->>'order_id'));

-- 3) Comment for clarity
COMMENT ON TABLE anchor_event_idempotency IS 'Stores Anchor idempotency keys and response payloads to guarantee exactly-once processing';
COMMENT ON TABLE anchor_event_log IS 'Immutable ledger of Anchor events and outcomes (accepted/rejected) with payload and reason codes';
