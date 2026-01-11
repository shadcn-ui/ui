"use client"

import { useState, useEffect } from "react"
import {
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  ShoppingCart,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react"

interface PurchaseOrder {
  id: number
  po_number: string
  supplier_name: string
  order_date: string
  expected_delivery_date: string
  status: string
  total_amount: string
  total_received: string
  fulfillment_percentage: string
  items_count: string
}

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ summary: "true" })
      const response = await fetch(`/api/purchase-orders?${params.toString()}`)
      const data = await response.json()
      // Ensure data is always an array
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching purchase orders:", error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(num)) return "Rp0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "approved":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "ordered":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      case "partially received":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "received":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return ""
    }
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Approved").length
  const totalValue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || "0"), 0)
  const receivedValue = orders.reduce((sum, o) => sum + parseFloat(o.total_received || "0"), 0)
  const avgFulfillment = orders.reduce((sum, o) => sum + parseFloat(o.fulfillment_percentage || "0"), 0) / (orders.length || 1)

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/product">Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Purchase Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage supplier purchase orders
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create PO
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                All orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(receivedValue)}</div>
              <p className="text-xs text-muted-foreground">
                Value received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue - receivedValue)}</div>
              <p className="text-xs text-muted-foreground">
                To be received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fulfillment</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgFulfillment.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                Average rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search by PO number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Ordered">Ordered</SelectItem>
                  <SelectItem value="Partially Received">Partially Received</SelectItem>
                  <SelectItem value="Received">Received</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
            <CardDescription>
              All purchase orders with fulfillment tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading purchase orders...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const fulfillment = parseFloat(order.fulfillment_percentage || "0")
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">
                          {order.po_number}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.supplier_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.order_date)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(order.expected_delivery_date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{order.items_count}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(order.total_received)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full ${
                                  fulfillment === 100
                                    ? "bg-green-500"
                                    : fulfillment > 0
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                                }`}
                                style={{ width: `${fulfillment}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {fulfillment.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            {order.status !== "Received" && order.status !== "Cancelled" && (
                              <Button size="sm">
                                Receive
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Summary</CardTitle>
            <CardDescription>
              Breakdown of orders by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {["Pending", "Approved", "Ordered", "Partially Received", "Received", "Cancelled"].map((status) => {
                const count = orders.filter(o => o.status === status).length
                const value = orders
                  .filter(o => o.status === status)
                  .reduce((sum, o) => sum + parseFloat(o.total_amount || "0"), 0)
                
                return (
                  <Card key={status}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{status}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{count}</div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(value)}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
