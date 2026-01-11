"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { Building2, Save, Image as ImageIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/registry/new-york-v4/ui/alert"

interface CompanySettings {
  id?: number
  company_name: string
  address: string
  city: string
  phone: string
  email: string
  logo_url: string | null
  website: string | null
  tax_id: string | null
}

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    logo_url: null,
    website: null,
    tax_id: null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/company-settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      const res = await fetch('/api/company-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        setMessage({ type: 'success', text: 'Company settings saved successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
      }
    } catch (error) {
      console.error('Save error:', error)
      setMessage({ type: 'error', text: 'An error occurred while saving.' })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/company-settings/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()

      if (!res.ok || !data?.url) {
        setUploadError(data?.error || 'Failed to upload logo. Please try again.')
        return
      }

      setSettings((prev) => ({ ...prev, logo_url: data.url }))
      setMessage({ type: 'success', text: 'Logo uploaded. Click Save Settings to persist.' })
    } catch (error) {
      console.error('Logo upload error:', error)
      setUploadError('An error occurred while uploading the logo.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const triggerLogoUpload = () => fileInputRef.current?.click()

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-muted-foreground">Configure your company information for quotations and invoices</p>
        </div>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>This information will appear on exported quotations and invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  placeholder="Ocean ERP"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="info@oceanerp.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Jl. Raya No. 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City & Province *</Label>
                <Input
                  id="city"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  placeholder="Jakarta, DKI Jakarta 12345"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={settings.website || ''}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value || null })}
                    placeholder="www.oceanerp.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID / NPWP (Optional)</Label>
                  <Input
                    id="tax_id"
                    value={settings.tax_id || ''}
                    onChange={(e) => setSettings({ ...settings, tax_id: e.target.value || null })}
                    placeholder="00.000.000.0-000.000"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Company Logo
            </CardTitle>
            <CardDescription>Upload your company logo for export documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Logo Requirements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Recommended size: 200x60 pixels (aspect ratio 10:3)</li>
                  <li>Maximum dimensions: 400x120 pixels</li>
                  <li>Formats: PNG, JPG, or SVG</li>
                  <li>Transparent background recommended for PNG</li>
                  <li>File size: Maximum 500KB</li>
                </ul>
              </AlertDescription>
            </Alert>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              className="hidden"
              onChange={handleLogoFileChange}
            />

            <div className="space-y-2">
              <Label>Upload Logo File</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="secondary" onClick={triggerLogoUpload} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {settings.logo_url ? 'Logo selected. Remember to save settings.' : 'No logo uploaded yet.'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG, or SVG up to 500KB.</p>
              {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                value={settings.logo_url || ''}
                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value || null })}
                placeholder="https://your-domain.com/logo.png or /uploads/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL of your logo image. You can upload it to your server or use an external URL.
              </p>
            </div>

            {settings.logo_url && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <p className="text-sm font-medium mb-2">Logo Preview:</p>
                <div className="bg-white p-4 rounded border inline-block">
                  <img 
                    src={settings.logo_url} 
                    alt="Company Logo" 
                    className="max-h-[60px] max-w-[200px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Logo not found</text></svg>'
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={loadSettings} disabled={saving}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
