"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { FileText, Plus, MoreVertical, Eye, Edit, Trash2, Send, Download } from "lucide-react"

interface Quotation {
  id: number
  reference_number?: string
  customer: string
  total_value: number
  status?: string
  valid_until?: string
  created_at: string
}

const getStatusBadge = (status?: string) => {
  const statusLower = (status || 'draft').toLowerCase()
  
  if (statusLower === 'sent') {
    return <Badge variant="default" className="bg-blue-500">Sent</Badge>
  } else if (statusLower === 'accepted') {
    return <Badge variant="default" className="bg-green-500">Accepted</Badge>
  } else if (statusLower === 'rejected') {
    return <Badge variant="destructive">Rejected</Badge>
  } else if (statusLower === 'expired') {
    return <Badge variant="secondary">Expired</Badge>
  } else {
    return <Badge variant="outline">Draft</Badge>
  }
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const res = await fetch('/api/quotations')
        const data = await res.json()
        if (res.ok) {
          setQuotations(data.quotations || [])
        } else {
          console.error('Failed to fetch quotations', data)
        }
      } catch (e) {
        console.error('Error fetching quotations', e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuotations()
  }, [])

  const handleDelete = async (id: number, refNumber: string) => {
    if (!confirm(`Are you sure you want to delete quotation ${refNumber}? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setQuotations(quotations.filter(q => q.id !== id))
        alert('Quotation deleted successfully')
      } else {
        const data = await res.json()
        alert(`Failed to delete: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete quotation')
    }
  }

  const handleExport = (id: number) => {
    window.open(`/api/quotations/${id}/export`, '_blank')
  }

  const handleSendEmail = async (id: number, customer: string) => {
    const email = prompt(`Send quotation to ${customer}. Enter email address:`)
    if (!email) return

    try {
      const res = await fetch(`/api/quotations/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email })
      })
      const data = await res.json()
      alert(data.message || data.error || 'Email sent!')
    } catch (error) {
      console.error('Send error:', error)
      alert('Failed to send email')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">Loading quotations...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Quotations
          </h1>
          <p className="text-muted-foreground">Create and manage sales quotations</p>
        </div>
        <div>
          <Button asChild>
            <Link href="/erp/sales/quotations/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Quotation
            </Link>
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All Quotations</CardTitle>
          <CardDescription>List of generated sales quotations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No quotations found. Create your first quotation to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  quotations.map(q => (
                    <TableRow key={q.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/erp/sales/quotations/${q.id}`} className="font-medium text-blue-600 hover:underline">
                          {q.reference_number || `Q-${q.id}`}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{q.customer}</TableCell>
                      <TableCell className="text-right font-semibold">
                        Rp{Number(q.total_value).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                      </TableCell>
                      <TableCell>{getStatusBadge(q.status)}</TableCell>
                      <TableCell>{q.valid_until ? new Date(q.valid_until).toLocaleDateString('id-ID') : '—'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(q.created_at).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push(`/erp/sales/quotations/${q.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/erp/sales/quotations/${q.id}/edit`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleExport(q.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(q.id, q.customer)}>
                              <Send className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(q.id, q.reference_number || `Q-${q.id}`)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
