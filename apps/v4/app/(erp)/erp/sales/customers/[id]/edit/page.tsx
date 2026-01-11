"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Label } from '@/registry/new-york-v4/ui/label'
import { Textarea } from '@/registry/new-york-v4/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/registry/new-york-v4/ui/select'
import { ArrowLeft, Building2, User, Mail, Phone, MapPin } from 'lucide-react'

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    billing_address: '',
    billing_city: '',
    billing_state: '',
    billing_country: '',
    credit_limit: '',
    payment_terms: '',
    customer_type: 'Business',
    status: 'Active',
  })

  useEffect(() => {
    if (id) fetchCustomer()
  }, [id])

  const fetchCustomer = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/customers/${id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      const c = data.customer
      setFormData({
        company_name: c.company_name || '',
        contact_person: c.contact_person || '',
        email: c.email || '',
        phone: c.phone || '',
        billing_address: c.billing_address || '',
        billing_city: c.billing_city || '',
        billing_state: c.billing_state || '',
        billing_country: c.billing_country || '',
        credit_limit: c.credit_limit != null ? String(c.credit_limit) : '',
        payment_terms: c.payment_terms || '',
        customer_type: c.customer_type || 'Business',
        status: c.status || 'Active',
      })
    } catch (err) {
      console.error(err)
      alert('Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((p: any) => ({ ...p, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // split contact_person
      let firstName = ''
      let lastName = ''
      if (formData.contact_person) {
        const parts = formData.contact_person.split(' ')
        firstName = parts.shift() || ''
        lastName = parts.join(' ')
      }

      const payload: any = {
        company_name: formData.company_name,
        contact_first_name: firstName || null,
        contact_last_name: lastName || null,
        contact_email: formData.email || null,
        contact_phone: formData.phone || null,
        billing_address: formData.billing_address || null,
        billing_city: formData.billing_city || null,
        billing_state: formData.billing_state || null,
        billing_country: formData.billing_country || null,
        customer_type: formData.customer_type,
        payment_terms: formData.payment_terms || null,
        is_active: formData.status === 'Active',
      }

      if (formData.credit_limit !== '') {
        payload.credit_limit = parseFloat(formData.credit_limit)
      }

      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Update failed')
      }

      router.push(`/erp/sales/customers/${id}`)
    } catch (err) {
      console.error(err)
      alert(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-4">
        <Link href={`/erp/sales/customers/${id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Customer</h1>
          <p className="text-muted-foreground">Update customer details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Basic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input name="company_name" value={formData.company_name} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input name="contact_person" value={formData.contact_person} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <Label htmlFor="billing_address">Billing Address</Label>
              <Textarea name="billing_address" value={formData.billing_address} onChange={handleChange} rows={2} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>City</Label>
                <Input name="billing_city" value={formData.billing_city} onChange={handleChange} />
              </div>
              <div>
                <Label>State</Label>
                <Input name="billing_state" value={formData.billing_state} onChange={handleChange} />
              </div>
              <div>
                <Label>Country</Label>
                <Input name="billing_country" value={formData.billing_country} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Credit Limit</Label>
                <Input name="credit_limit" value={formData.credit_limit} onChange={handleChange} />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Input name="payment_terms" value={formData.payment_terms} onChange={handleChange} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.customer_type} onValueChange={(v) => setFormData((p:any)=>({ ...p, customer_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.push(`/erp/sales/customers/${id}`)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
