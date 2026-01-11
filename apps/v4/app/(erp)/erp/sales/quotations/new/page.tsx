"use client"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/new-york-v4/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/new-york-v4/ui/popover"
import { Button } from "@/registry/new-york-v4/ui/button"

export default function NewQuotationPage() {
  const [leadId, setLeadId] = useState<string | null>(null)
  const router = useRouter()
  const [customer, setCustomer] = useState("")
  const [total, setTotal] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leads, setLeads] = useState<Array<{ id: string; first_name: string; last_name: string; company?: string }>>([])
  const [customersList, setCustomersList] = useState<Array<any>>([])
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [leadOpen, setLeadOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/leads')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        const payload = data.leads || data
        if (Array.isArray(payload)) {
          setLeads(payload.map((l: any) => ({ id: String(l.id), first_name: l.first_name || l.firstName || '', last_name: l.last_name || l.lastName || '', company: l.company || '' })))
        }
      } catch (err) {
        console.error('Failed to fetch leads for quotation customer select', err)
      }
    })()
    ;(async () => {
      try {
        const res = await fetch('/api/customers')
        if (!res.ok) return
        const data = await res.json()
        const payload = data.customers || data
        if (mounted && Array.isArray(payload)) {
          setCustomersList(payload.map((c: any) => ({ id: String(c.id), label: c.company_name || c.name || `${c.contact_person || ''}` })))
        }
      } catch (err) {
        console.error('Failed to fetch customers for quotation select', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const numericTotal = parseFloat(total)
      if (!customer.trim() && !selectedCustomerId) {
        setError('Please select or enter a customer.')
        setIsSubmitting(false)
        return
      }
      if (Number.isNaN(numericTotal) || numericTotal <= 0) {
        setError('Please enter a valid total value (Rp greater than 0).')
        setIsSubmitting(false)
        return
      }

      const body: any = { customer: customer.trim(), total_value: numericTotal, valid_until: validUntil || null }
      if (leadId) body.lead_id = leadId
      if (selectedCustomerId) body.customer_id = selectedCustomerId

      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        router.push('/erp/sales/quotations')
      } else {
        const data = await res.json().catch(() => ({}))
        const message = data?.error || 'Create quotation failed. Please check required fields or try again.'
        setError(message)
        console.error('Create quotation failed', data)
      }
    } catch (err) {
      console.error(err)
      setError('Unexpected error creating quotation. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <header>
        <h1 className="text-2xl font-bold mb-2">Create Quotation</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>New Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {leads.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Select from Existing Lead</label>
                <Popover open={leadOpen} onOpenChange={setLeadOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full text-left rounded-md border px-3 py-2 bg-background text-foreground"
                    >
                      {leadId ? (() => {
                        const l = leads.find(x => x.id === leadId)
                        return l ? `${l.first_name} ${l.last_name}${l.company ? ` — ${l.company}` : ''}` : 'Selected'
                      })() : 'Select existing lead'}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search leads..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No lead found.</CommandEmpty>
                        <CommandGroup>
                          {leads.map((l) => (
                            <CommandItem key={l.id} value={l.id} onSelect={() => {
                              setLeadId(l.id)
                              setCustomer(`${l.first_name} ${l.last_name}${l.company ? ` — ${l.company}` : ''}`)
                              setLeadOpen(false)
                            }}>{`${l.first_name} ${l.last_name}${l.company ? ` — ${l.company}` : ''}`}</CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Customer</label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <button type="button" className="w-full text-left rounded-md border px-3 py-2 bg-background text-foreground">
                    {selectedCustomerId ? (customersList.find(c => c.id === selectedCustomerId)?.label ?? 'Selected') : (customer || 'Select or search customer')}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search customers..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {customersList.map((c) => (
                          <CommandItem key={c.id} value={c.id} onSelect={() => {
                            setSelectedCustomerId(c.id)
                            setCustomer(c.label)
                            setCustomerOpen(false)
                          }}>{c.label}</CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Value (Rp)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                <Input 
                  value={total} 
                  onChange={(e) => setTotal(e.target.value)} 
                  type="number" 
                  step="1" 
                  min="0"
                  className="pl-10"
                  placeholder="0"
                  required 
                />
              </div>
              {total && (
                <p className="text-xs text-muted-foreground mt-1">
                  {Number(total).toLocaleString('id-ID')} Rupiah
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until</label>
              <Input value={validUntil} onChange={(e) => setValidUntil(e.target.value)} type="date" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</Button>
              <Button variant="outline" asChild>
                <a href="/erp/sales/quotations">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
