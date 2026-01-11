-- Migration: add lead_id to quotations table
-- This allows quotations to reference the lead they originated from

ALTER TABLE quotations 
ADD COLUMN IF NOT EXISTS lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_quotations_lead_id ON quotations(lead_id);

-- Add comment for documentation
COMMENT ON COLUMN quotations.lead_id IS 'Reference to the lead that this quotation was created from';
