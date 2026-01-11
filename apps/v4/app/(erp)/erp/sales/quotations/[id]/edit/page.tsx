"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface Quotation {
  id: number
  reference_number?: string
  customer: string
  total_value: number
  status?: string
  valid_until?: string
  notes?: string
  created_at: string
}

export default function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  
  // Form fields
  const [referenceNumber, setReferenceNumber] = useState("")
  const [customer, setCustomer] = useState("")
  const [totalValue, setTotalValue] = useState("")
  const [validUntil, setValidUntil] = useState("")
  const [status, setStatus] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await fetch(`/api/quotations/${resolvedParams.id}`)
        if (res.ok) {
          const data = await res.json()
          const q = data.quotation || data
          setQuotation(q)
          
          // Populate form fields
          setReferenceNumber(q.reference_number || `Q-${q.id}`)
          setCustomer(q.customer || "")
          setTotalValue(q.total_value?.toString() || "")
          setValidUntil(q.valid_until ? new Date(q.valid_until).toISOString().split('T')[0] : "")
          setStatus(q.status || "Draft")
          setNotes(q.notes || "")
        } else {
          console.error('Failed to fetch quotation')
        }
      } catch (error) {
        console.error('Error fetching quotation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotation()
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/quotations/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference_number: referenceNumber,
          customer,
          total_value: parseFloat(totalValue),
          valid_until: validUntil || null,
          status,
          notes,
        })
      })

      if (res.ok) {
        alert('Quotation updated successfully!')
        router.push(`/erp/sales/quotations/${resolvedParams.id}`)
      } else {
        const data = await res.json()
        alert(`Failed to update: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Failed to update quotation')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">Loading quotation...</div>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Quotation not found</p>
          <Button asChild variant="outline">
            <Link href="/erp/sales/quotations">Back to Quotations</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/erp/sales/quotations/${resolvedParams.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Quotation</h1>
            <p className="text-muted-foreground">{referenceNumber}</p>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Reference Number */}
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Q-001"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to auto-generate
                </p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              {/* Customer */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Input
                  id="customer"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="Customer name"
                  required
                />
              </div>

              {/* Valid Until */}
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>

              {/* Total Value */}
              <div className="space-y-2">
                <Label htmlFor="totalValue">Total Value (Rp) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                  <Input
                    id="totalValue"
                    type="number"
                    value={totalValue}
                    onChange={(e) => setTotalValue(e.target.value)}
                    className="pl-10"
                    placeholder="0"
                    step="1"
                    min="0"
                    required
                  />
                </div>
                {totalValue && (
                  <p className="text-xs text-muted-foreground">
                    {Number(totalValue).toLocaleString('id-ID')} Rupiah
                  </p>
                )}
              </div>

              {/* Created Date (Read-only) */}
              <div className="space-y-2">
                <Label>Created Date</Label>
                <Input
                  value={new Date(quotation.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/erp/sales/quotations/${resolvedParams.id}`}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            To manage line items (products/services), go to the{" "}
            <Link 
              href={`/erp/sales/quotations/${resolvedParams.id}`}
              className="text-blue-600 hover:underline font-medium"
            >
              quotation detail page
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
