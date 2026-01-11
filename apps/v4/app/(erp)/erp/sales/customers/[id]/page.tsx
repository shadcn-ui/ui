'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs'
import { ArrowLeft, Building2, Mail, Phone, MapPin, DollarSign, Edit, Trash2, Package, FileText, Users } from 'lucide-react'

interface Customer {
  id: number
  customer_number: string
  company_name: string
  contact_person?: string
  email?: string
  phone?: string
  mobile?: string
  website?: string
  billing_address?: string
  billing_city?: string
  billing_state?: string
  billing_country?: string
  billing_postal_code?: string
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_country?: string
  shipping_postal_code?: string
  customer_type: string
  industry?: string
  tax_id?: string
  credit_limit?: number
  payment_terms?: string
  currency?: string
  notes?: string
  tags?: string[]
  status: string
  total_orders: number
  total_revenue?: number
  created_at: string
}

interface Order {
  id: number
  order_number: string
  total_amount: number
  status: string
  payment_status: string
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

const ORDER_STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'Confirmed': 'bg-blue-100 text-blue-800',
  'Processing': 'bg-indigo-100 text-indigo-800',
  'Shipped': 'bg-purple-100 text-purple-800',
  'Delivered': 'bg-green-100 text-green-800',
  'Cancelled': 'bg-red-100 text-red-800',
  'On Hold': 'bg-orange-100 text-orange-800',
}

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchCustomer()
      fetchOrders()
    }
  }, [params.id])

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch customer')
      const data = await response.json()
      setCustomer(data.customer)
    } catch (error) {
      console.error('Error fetching customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/sales-orders?customer_id=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete customer')
      router.push('/erp/sales/customers')
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Failed to delete customer')
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Rp0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatAddress = (address?: string, city?: string, state?: string, country?: string, postal?: string) => {
    const parts = [address, city, state, country, postal].filter(Boolean)
    return parts.length > 0 ? parts.join(', ') : 'N/A'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading customer...</div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Customer Not Found</h1>
          <Link href="/erp/sales/customers">
            <Button>Back to Customers</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/erp/sales/customers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{customer.company_name}</h1>
              <Badge className={TYPE_COLORS[customer.customer_type] || ''}>
                {customer.customer_type}
              </Badge>
              <Badge className={STATUS_COLORS[customer.status] || ''}>
                {customer.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{customer.customer_number}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Link href={`/erp/sales/customers/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.total_orders || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.total_revenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Credit Limit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(customer.credit_limit)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Payment Terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customer.payment_terms || 'N/A'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            <Building2 className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="mr-2 h-4 w-4" />
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="mr-2 h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="notes">
            <FileText className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {customer.contact_person && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.contact_person}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.mobile} (Mobile)</span>
                  </div>
                )}
                {customer.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">🌐</span>
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {customer.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {customer.industry && (
                  <div>
                    <span className="text-muted-foreground">Industry: </span>
                    <span className="font-medium">{customer.industry}</span>
                  </div>
                )}
                {customer.tax_id && (
                  <div>
                    <span className="text-muted-foreground">Tax ID: </span>
                    <span className="font-medium">{customer.tax_id}</span>
                  </div>
                )}
                {customer.currency && (
                  <div>
                    <span className="text-muted-foreground">Currency: </span>
                    <span className="font-medium">{customer.currency}</span>
                  </div>
                )}
                {customer.tags && customer.tags.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Tags: </span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {customer.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {formatAddress(
                    customer.billing_address,
                    customer.billing_city,
                    customer.billing_state,
                    customer.billing_country,
                    customer.billing_postal_code
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {formatAddress(
                    customer.shipping_address,
                    customer.shipping_city,
                    customer.shipping_state,
                    customer.shipping_country,
                    customer.shipping_postal_code
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No orders found for this customer
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link key={order.id} href={`/erp/sales/orders/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{order.order_number}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(order.total_amount)}</div>
                          <div className="flex gap-2 mt-1">
                            <Badge className={ORDER_STATUS_COLORS[order.status] || ''}>
                              {order.status}
                            </Badge>
                            <Badge variant="outline">{order.payment_status}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contact Persons</CardTitle>
                <Button size="sm">Add Contact</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Contact management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer Notes</CardTitle>
                <Button size="sm">Add Note</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Notes timeline coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
