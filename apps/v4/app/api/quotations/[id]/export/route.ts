import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  user: process.env.DB_USER || 'mac',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ocean-erp',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quotationId = Number(id)
  try {
    const client = await pool.connect()
    try {
      const qRes = await client.query('SELECT * FROM quotations WHERE id = $1', [quotationId])
      if (qRes.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const quotation = qRes.rows[0]
      const itemsRes = await client.query('SELECT * FROM quotation_items WHERE quotation_id = $1 ORDER BY id', [quotationId])
      const items = itemsRes.rows

      // Fetch company settings
      const settingsRes = await client.query('SELECT * FROM company_settings ORDER BY id DESC LIMIT 1')
      const companySettings = settingsRes.rows.length > 0 ? settingsRes.rows[0] : {
        company_name: 'Ocean ERP',
        address: 'Your Company Address',
        city: 'City, Province 12345',
        phone: '+62 xxx xxxx xxxx',
        email: 'info@oceanerp.com',
        logo_url: null,
        website: null,
        tax_id: null
      }

      // Format currency in Indonesian Rupiah
      const formatRupiah = (value: number) => {
        return 'Rp' + value.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      }

      // Format date in Indonesian
      const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }

      // Generate line items HTML with row numbers
      const rowsHtml = items.map((it, index) => `
        <tr>
          <td style="text-align: center; color: #666;">${index + 1}</td>
          <td>${it.description}</td>
          <td style="text-align: center;">${it.quantity}</td>
          <td style="text-align: right;">${formatRupiah(Number(it.unit_price))}</td>
          <td style="text-align: right; font-weight: 600;">${formatRupiah(Number(it.line_total))}</td>
        </tr>
      `).join('')

      // Professional HTML export with Indonesian formatting
      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Quotation ${quotation.reference_number || 'Q-' + quotation.id}</title>
  <style>
    @media print {
      @page { margin: 1.5cm; }
      body { margin: 0; }
      .no-print { display: none; }
    }
    
    * { box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    
    .document {
      background: white;
      padding: 40px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
    }
    
    .company-info {
      flex: 1;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
      margin: 0 0 8px 0;
    }
    
    .company-details {
      font-size: 12px;
      color: #666;
      line-height: 1.5;
    }
    
    .document-title {
      text-align: right;
      flex: 1;
    }
    
    .document-title h1 {
      margin: 0;
      font-size: 32px;
      color: #1e293b;
      font-weight: 700;
    }
    
    .document-title .ref-number {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }
    
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .info-block h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      margin: 0 0 8px 0;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .info-block p {
      margin: 4px 0;
      font-size: 14px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-draft { background: #f1f5f9; color: #475569; }
    .status-sent { background: #dbeafe; color: #1e40af; }
    .status-approved { background: #dcfce7; color: #15803d; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      font-size: 14px;
    }
    
    thead {
      background: #f8fafc;
      border-top: 2px solid #e2e8f0;
      border-bottom: 2px solid #e2e8f0;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #475569;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    
    tbody tr:hover {
      background: #f8fafc;
    }
    
    .totals-section {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    
    .totals-table {
      width: 350px;
    }
    
    .totals-table table {
      margin: 0;
    }
    
    .totals-table td {
      border: none;
      padding: 8px 12px;
    }
    
    .subtotal-row {
      font-size: 14px;
      color: #64748b;
    }
    
    .total-row {
      background: #f8fafc;
      border-top: 2px solid #e2e8f0;
      font-size: 18px;
      font-weight: 700;
      color: #2563eb;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      text-align: center;
    }
    
    .terms {
      margin-top: 30px;
      padding: 20px;
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      font-size: 12px;
      color: #475569;
    }
    
    .terms h4 {
      margin: 0 0 8px 0;
      color: #1e293b;
      font-size: 13px;
    }
    
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .print-button:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  
  <div class="document">
    <div class="header">
      <div class="company-info">
        ${companySettings.logo_url ? `
        <div style="margin-bottom: 12px;">
          <img src="${companySettings.logo_url}" alt="${companySettings.company_name}" style="max-height: 60px; max-width: 200px; object-fit: contain;" />
        </div>
        ` : `<h2 class="company-name">${companySettings.company_name}</h2>`}
        <div class="company-details">
          ${companySettings.address}<br>
          ${companySettings.city}<br>
          Phone: ${companySettings.phone}<br>
          Email: ${companySettings.email}
          ${companySettings.website ? `<br>Website: ${companySettings.website}` : ''}
          ${companySettings.tax_id ? `<br>NPWP: ${companySettings.tax_id}` : ''}
        </div>
      </div>
      <div class="document-title">
        <h1>QUOTATION</h1>
        <div class="ref-number">#${quotation.reference_number || 'Q-' + quotation.id}</div>
      </div>
    </div>
    
    <div class="info-section">
      <div class="info-block">
        <h3>Customer</h3>
        <p style="font-size: 16px; font-weight: 600;">${quotation.customer}</p>
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Quotation Details</h3>
        <p><strong>Date:</strong> ${formatDate(quotation.created_at)}</p>
        ${quotation.valid_until ? `<p><strong>Valid Until:</strong> ${formatDate(quotation.valid_until)}</p>` : ''}
        <p><strong>Status:</strong> <span class="status-badge status-${(quotation.status || 'draft').toLowerCase()}">${quotation.status || 'Draft'}</span></p>
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">#</th>
          <th>Description</th>
          <th style="width: 80px; text-align: center;">Quantity</th>
          <th style="width: 150px; text-align: right;">Unit Price</th>
          <th style="width: 150px; text-align: right;">Line Total</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    
    <div class="totals-section">
      <div class="totals-table">
        <table>
          <tr class="subtotal-row">
            <td>Subtotal (${items.length} ${items.length === 1 ? 'item' : 'items'})</td>
            <td style="text-align: right;">${formatRupiah(Number(quotation.total_value))}</td>
          </tr>
          <tr class="total-row">
            <td><strong>TOTAL</strong></td>
            <td style="text-align: right;"><strong>${formatRupiah(Number(quotation.total_value))}</strong></td>
          </tr>
        </table>
      </div>
    </div>
    
    <div class="terms">
      <h4>Terms & Conditions</h4>
      <p>1. Quotation ini berlaku hingga tanggal yang tertera di atas.</p>
      <p>2. Harga belum termasuk pajak (jika berlaku).</p>
      <p>3. Pembayaran dilakukan sesuai kesepakatan.</p>
      <p>4. Barang yang sudah dibeli tidak dapat dikembalikan.</p>
    </div>
    
    <div class="footer">
      <p>Thank you for your business!</p>
      <p style="margin-top: 8px; font-size: 11px;">Generated on ${formatDate(new Date().toISOString())}</p>
    </div>
  </div>
</body>
</html>`

      return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Export error', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
