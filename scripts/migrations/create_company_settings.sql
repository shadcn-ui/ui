-- Create company_settings table for dynamic company information in exports

CREATE TABLE IF NOT EXISTS company_settings (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL DEFAULT 'Ocean ERP',
  address TEXT NOT NULL DEFAULT 'Your Company Address',
  city VARCHAR(255) NOT NULL DEFAULT 'City, Province 12345',
  phone VARCHAR(50) NOT NULL DEFAULT '+62 xxx xxxx xxxx',
  email VARCHAR(255) NOT NULL DEFAULT 'info@oceanerp.com',
  logo_url TEXT,
  website VARCHAR(255),
  tax_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_company_settings_created ON company_settings(created_at DESC);

-- Insert default settings if table is empty
INSERT INTO company_settings (company_name, address, city, phone, email, logo_url, website, tax_id)
SELECT 'Ocean ERP', 'Your Company Address', 'City, Province 12345', '+62 xxx xxxx xxxx', 'info@oceanerp.com', NULL, NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM company_settings);

-- Add comment to table
COMMENT ON TABLE company_settings IS 'Stores company information used in quotations and invoice exports';
COMMENT ON COLUMN company_settings.logo_url IS 'URL or path to company logo image. Recommended: 200x60px (10:3 ratio), max 400x120px';
COMMENT ON COLUMN company_settings.tax_id IS 'Tax identification number (NPWP for Indonesian companies)';
