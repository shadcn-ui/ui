'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Plus, Search, Building2, Mail, Phone, DollarSign } from 'lucide-react'

interface Customer {
  id: string
  customer_number: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  customer_type: string
  credit_limit?: number
  payment_terms?: string
  total_orders: number
  total_revenue?: number
  tags?: string[]
  status: string
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  'Individual': 'bg-blue-100 text-blue-800',
  'Business': 'bg-purple-100 text-purple-800',
  'Enterprise': 'bg-indigo-100 text-indigo-800',
}

const STATUS_COLORS: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Inactive': 'bg-gray-100 text-gray-800',
  'Prospect': 'bg-yellow-100 text-yellow-800',
  'Blocked': 'bg-red-100 text-red-800',
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(20)
  const [total, setTotal] = useState<number>(0)
  const [lastResponseCount, setLastResponseCount] = useState<number | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers(1)
  }, [])

  // refetch when search, status, sort or limit changes
  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(1), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, sortBy, sortDir, limit])

  const fetchCustomers = async (pageNum?: number) => {
    const p = pageNum ?? page
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(p))
      params.set('limit', String(limit))
      params.set('sort_by', sortBy)
      params.set('sort_dir', sortDir)
      if (searchTerm) params.set('q', searchTerm)
      if (filterStatus !== 'all') params.set('status', filterStatus)
      // type is not supported server-side; keep for future

      const url = `/api/customers?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      setCustomers(data.customers || [])
      setTotal(data.total || 0)
      setPage(p)
      setLastResponseCount(Array.isArray(data.customers) ? data.customers.length : null)
      setLastError(null)
    } catch (error) {
      console.error('Error fetching customers:', error)
      setLastError(error instanceof Error ? error.message : String(error))
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Rp0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading customers...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Link href="/erp/sales/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, number, email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Individual">Individual</option>
                <option value="Business">Business</option>
                <option value="Enterprise">Enterprise</option>
              </select>
              <select
                className="px-3 py-2 border rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Prospect">Prospect</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Showing {customers.length} of {total} customers (page {page})
          </div>

            <div className="flex items-center gap-3 mb-3">
            <label className="text-sm text-muted-foreground">Sort:</label>
            <select
              className="px-2 py-1 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Newest</option>
              <option value="company_name">Company Name</option>
              <option value="total_revenue">Total Revenue</option>
            </select>
            <button
              className="px-2 py-1 border rounded-md"
              onClick={() => { setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); fetchCustomers(1) }}
              type="button"
            >
              {sortDir === 'asc' ? 'Asc' : 'Desc'}
            </button>
            <div className="ml-auto">
              <Button variant="ghost" onClick={() => fetchCustomers(1)}>Refresh</Button>
            </div>
          </div>

            {/* Debug info to help diagnose empty results */}
            <div className="text-sm text-muted-foreground mb-3">
              {lastError ? (
                <div className="text-red-400">Fetch error: {lastError}</div>
              ) : lastResponseCount !== null ? (
                <div>API returned {lastResponseCount} customers (total: {total})</div>
              ) : (
                <div>Waiting for API...</div>
              )}
            </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">No customers found</td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-slate-50/2">
                      <td className="p-3 align-top">
                        <div className="font-semibold">{customer.company_name}</div>
                        <div className="text-sm text-muted-foreground">{customer.customer_number}</div>
                      </td>
                      <td className="p-3 align-top">
                        <div className="text-sm">{customer.contact_person || '—'}</div>
                        <div className="text-sm text-muted-foreground">{customer.email || customer.phone || '—'}</div>
                      </td>
                      <td className="p-3 align-top">
                        <Badge className={TYPE_COLORS[customer.customer_type] || ''}>{customer.customer_type}</Badge>
                      </td>
                      <td className="p-3 align-top">
                        <Badge className={STATUS_COLORS[customer.status] || ''}>{customer.status}</Badge>
                      </td>
                      <td className="p-3 align-top">{customer.total_orders || 0}</td>
                      <td className="p-3 align-top">{formatCurrency(customer.total_revenue)}</td>
                      <td className="p-3 align-top">
                        <div className="flex gap-2">
                          <Link href={`/erp/sales/customers/${customer.id}`}>
                            <Button size="sm">View</Button>
                          </Link>
                          <Link href={`/erp/sales/customers/${customer.id}/edit`}>
                            <Button size="sm" variant="outline">Edit</Button>
                          </Link>
                          <Button size="sm" variant="destructive" onClick={async (e) => {
                            e.preventDefault()
                            if (!confirm('Delete this customer?')) return
                            try {
                              const res = await fetch(`/api/customers/${customer.id}`, { method: 'DELETE' })
                              if (!res.ok) throw new Error('Delete failed')
                              setCustomers(prev => prev.filter(c => c.id !== customer.id))
                            } catch (err) {
                              console.error(err)
                              alert('Failed to delete customer')
                            }
                          }}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {total > 0 ? (
                <>
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
                </>
              ) : (
                <>No results</>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Per page:</label>
              <select
                className="px-2 py-1 border rounded-md"
                value={limit}
                onChange={(e) => { setLimit(parseInt(e.target.value)); fetchCustomers(1) }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchCustomers(Math.max(1, page - 1))}>Prev</Button>
              <div className="px-2 text-sm">Page {page} / {Math.max(1, Math.ceil(total / limit))}</div>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / limit) || total === 0} onClick={() => fetchCustomers(Math.min(Math.ceil(total / limit), page + 1))}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
