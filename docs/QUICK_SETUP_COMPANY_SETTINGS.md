# Quick Setup Guide: Dynamic Company Settings for Exports

## ✨ What's New?

Your quotation exports can now display **your own company information** instead of default placeholders! 

## 🎯 Quick Start (3 Steps)

### Step 1: Access Company Settings
Navigate to: **`/erp/settings/company`**

Direct URL: `http://localhost:4000/erp/settings/company`

### Step 2: Fill in Your Company Details

**Required Fields:**
- ✅ Company Name (e.g., "Ocean ERP Indonesia")
- ✅ Address (e.g., "Jl. Sudirman No. 123")
- ✅ City & Province (e.g., "Jakarta Selatan, DKI Jakarta 12190")
- ✅ Phone (e.g., "+62 21 1234 5678")
- ✅ Email (e.g., "contact@oceanerp.com")

**Optional Fields:**
- 🔖 Company Logo URL
- 🌐 Website
- 📋 Tax ID / NPWP

### Step 3: Save and Test
1. Click **"Save Settings"**
2. Go to any quotation
3. Click **"Export PDF"**
4. Your company info now appears! 🎉

## 🖼️ Adding Your Logo

### Logo Specifications
```
✓ Recommended: 200×60 pixels (ratio 10:3)
✓ Maximum: 400×120 pixels
✓ Format: PNG, JPG, or SVG
✓ Size: Max 500KB
✓ Best: PNG with transparent background
```

### How to Add Logo

**Option 1: Upload to Your Server**
```
1. Upload logo to /public/uploads/logo.png
2. In Company Settings, enter: /uploads/logo.png
3. Save and test
```

**Option 2: Use External URL**
```
1. Upload to image hosting service
2. Get direct image URL
3. Enter URL in Company Settings
4. Save and test
```

**Example URLs:**
- Local: `/uploads/ocean-logo.png`
- External: `https://yourdomain.com/assets/logo.png`
- CDN: `https://cdn.example.com/logos/company.png`

## 📋 Example Configuration

```
Company Name: PT Ocean ERP Indonesia
Address: Jl. Sudirman Kav. 52-53
City: Jakarta Selatan, DKI Jakarta 12190
Phone: +62 21 5790 1234
Email: info@oceanerp.co.id
Logo URL: /uploads/ocean-logo.png
Website: www.oceanerp.co.id
Tax ID: 01.234.567.8-901.000
```

## ✅ Verification Checklist

After saving settings, verify by:

- [ ] Settings saved successfully (green success message)
- [ ] Logo preview appears (if logo URL provided)
- [ ] All fields are filled correctly
- [ ] No spelling errors in contact info
- [ ] Open any quotation
- [ ] Click "Export PDF"
- [ ] Company info displays correctly
- [ ] Logo appears in header (if provided)
- [ ] Print or save as PDF to test final output

## 🔍 Troubleshooting

### Logo Not Showing?
```
Problem: Logo URL entered but image doesn't appear

Solutions:
✓ Check if URL is publicly accessible
✓ Test URL directly in browser
✓ Verify image format (PNG/JPG/SVG only)
✓ Check file size (must be under 500KB)
✓ Ensure correct path (/uploads/ vs /public/uploads/)
```

### Changes Not Appearing in Export?
```
Problem: Updated settings but export still shows old info

Solutions:
✓ Refresh the browser page (Ctrl+F5 or Cmd+Shift+R)
✓ Clear browser cache
✓ Check if "Save Settings" was clicked
✓ Verify green success message appeared
✓ Try opening export in new browser tab
```

### Settings Won't Save?
```
Problem: Error when clicking Save button

Solutions:
✓ Check all required fields are filled
✓ Verify database is running
✓ Check browser console for error messages
✓ Ensure server is running (http://localhost:4000)
✓ Restart development server if needed
```

## 💡 Pro Tips

1. **Test Before Distributing**
   - Always export and review PDF before sending to clients
   - Check print layout using browser's print preview
   - Verify all information is accurate and professional

2. **Logo Best Practices**
   - Use high-resolution images for sharp print quality
   - Transparent background PNG looks more professional
   - Test logo on both screen and printed output
   - Keep logo simple and readable at small sizes

3. **Contact Information**
   - Use professional email with company domain
   - Include country code in phone numbers
   - Format addresses consistently
   - Update NPWP/Tax ID if applicable

4. **Regular Updates**
   - Review company settings quarterly
   - Update contact info when changed
   - Replace logo if rebranding
   - Keep tax ID current

## 📱 Mobile Access

The Company Settings page is responsive and works on:
- ✅ Desktop browsers
- ✅ Tablets
- ✅ Mobile phones

Simply navigate to `/erp/settings/company` on any device.

## 🔐 Security Note

Only administrators should have access to Company Settings as it affects all exported documents company-wide.

## 📞 Need Help?

If you encounter issues:
1. Check the [full documentation](./COMPANY_SETTINGS.md)
2. Review database connection
3. Check server logs
4. Contact system administrator

---

**Happy Exporting! 🎉**

Your professional quotations are just three steps away!
