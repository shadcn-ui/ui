# Company Settings - Dynamic Export Header

## Overview
The Company Settings feature allows administrators to configure company information that appears on exported quotations and invoices. This makes the export documents dynamic and customizable without code changes.

## Features

### Configurable Fields
1. **Company Name** - Your business name (required)
2. **Company Logo** - Upload or link to your logo image
3. **Address** - Street address (required)
4. **City & Province** - Location details with postal code (required)
5. **Phone** - Contact phone number (required)
6. **Email** - Contact email address (required)
7. **Website** - Company website URL (optional)
8. **Tax ID / NPWP** - Tax identification number (optional)

## Logo Requirements

### Recommended Specifications
- **Dimensions**: 200x60 pixels (aspect ratio 10:3)
- **Maximum Size**: 400x120 pixels
- **Formats**: PNG, JPG, or SVG
- **Background**: Transparent PNG recommended
- **File Size**: Maximum 500KB

### Logo Usage
- Enter the full URL of your logo image
- Can be hosted on your server: `/uploads/logo.png`
- Or use external URL: `https://your-domain.com/logo.png`
- Logo will appear in the header of all exported documents

## Accessing Company Settings

### Navigation
1. Go to **Settings** > **Company Settings**
2. Or directly visit: `/erp/settings/company`

### Editing Settings
1. Fill in all required fields (marked with *)
2. Optionally add logo URL, website, and tax ID
3. Preview your logo if URL is provided
4. Click **Save Settings** to apply changes
5. Use **Reset** button to reload current settings

## Database Schema

```sql
CREATE TABLE company_settings (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website VARCHAR(255),
  tax_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### GET /api/company-settings
Fetch current company settings.

**Response:**
```json
{
  "settings": {
    "id": 1,
    "company_name": "Ocean ERP",
    "address": "Jl. Raya No. 123",
    "city": "Jakarta, DKI Jakarta 12345",
    "phone": "+62 21 1234 5678",
    "email": "info@oceanerp.com",
    "logo_url": "https://example.com/logo.png",
    "website": "www.oceanerp.com",
    "tax_id": "00.000.000.0-000.000"
  }
}
```

### POST /api/company-settings
Create or update company settings.

**Request Body:**
```json
{
  "company_name": "Ocean ERP",
  "address": "Jl. Raya No. 123",
  "city": "Jakarta, DKI Jakarta 12345",
  "phone": "+62 21 1234 5678",
  "email": "info@oceanerp.com",
  "logo_url": "https://example.com/logo.png",
  "website": "www.oceanerp.com",
  "tax_id": "00.000.000.0-000.000"
}
```

## Export Integration

### How It Works
1. When exporting a quotation, the system fetches the latest company settings
2. If logo URL is provided, it displays the logo image
3. If no logo, it displays the company name as text
4. All company details appear in the export header
5. Settings are cached per export for performance

### Export Document Structure
```
┌─────────────────────────────────────┐
│ [Logo or Company Name]              │
│ Address                             │
│ City, Province                      │
│ Phone | Email                       │
│ Website | Tax ID                    │
├─────────────────────────────────────┤
│        QUOTATION #Q-001             │
│                                     │
│ Customer Information                │
│ Line Items Table                    │
│ Total                               │
│ Terms & Conditions                  │
└─────────────────────────────────────┘
```

## Migration

Run the migration script to create the table:

```bash
psql -U mac -d ocean_erp -f scripts/migrations/create_company_settings.sql
```

Default settings will be inserted automatically if the table is empty.

## Best Practices

### Logo Guidelines
1. **Use high-quality images** - Avoid pixelated or low-resolution logos
2. **Maintain aspect ratio** - Keep 10:3 ratio for best results
3. **Test print output** - Always preview exported PDF before distribution
4. **Use transparent backgrounds** - PNG with transparency looks more professional
5. **Optimize file size** - Compress images to load faster

### Information Accuracy
1. **Keep contact details updated** - Ensure phone and email are current
2. **Use professional email** - Company domain email preferred
3. **Format consistently** - Use consistent formatting for addresses
4. **Include postal codes** - Add complete address with postal code
5. **Verify tax ID** - Ensure tax identification is correct

## Troubleshooting

### Logo Not Displaying
- Check if URL is accessible publicly
- Verify image format (PNG, JPG, SVG only)
- Ensure file size is under 500KB
- Check image dimensions (max 400x120px)
- Test URL in browser first

### Settings Not Saving
- Check database connection
- Verify all required fields are filled
- Check browser console for errors
- Ensure proper permissions on server

### Export Shows Default Values
- Save settings first before exporting
- Refresh the page after saving
- Check if database migration ran successfully
- Verify API endpoint is accessible

## Future Enhancements

Planned improvements:
- [ ] Multiple company profiles for multi-tenant systems
- [ ] Logo upload directly from UI (without external URL)
- [ ] Custom color themes for exports
- [ ] Additional footer text customization
- [ ] Invoice-specific settings separate from quotations
- [ ] Signature image for authorized person

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review database logs for errors
3. Test API endpoints directly
4. Contact system administrator

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Database**: PostgreSQL 12+  
**Framework**: Next.js 15
