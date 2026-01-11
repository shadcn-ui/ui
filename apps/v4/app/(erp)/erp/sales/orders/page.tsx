"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"

interface SalesOrder {
  id: number
  order_number: string
  customer: string
  total_amount: number
  status: string
  payment_status: string
  order_date: string
  expected_delivery_date?: string
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500",
  Confirmed: "bg-blue-500",
  Processing: "bg-purple-500",
  Shipped: "bg-indigo-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
  Refunded: "bg-gray-500",
}

const PAYMENT_COLORS: Record<string, string> = {
  Unpaid: "bg-red-500",
  Partial: "bg-orange-500",
  Paid: "bg-green-500",
  Refunded: "bg-gray-500",
}

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/sales-orders')
      if (res.ok) {
        const data = await res.json()
        // Normalize status values to capitalized format
        const normalizedOrders = (data.orders || []).map((order: any) => ({
          ...order,
          status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase() || 'Pending',
          payment_status: order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1).toLowerCase() || 'Unpaid',
        }))
        setOrders(normalizedOrders)
      }
    } catch (error) {
      console.error('Failed to load orders', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true
    if (filter === "pending") return order.status === "Pending"
    if (filter === "unpaid") return order.payment_status === "Unpaid"
    return true
  })

  if (loading) {
    return (
      <div className="p-6">
        <div>Loading sales orders...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button asChild>
          <a href="/erp/sales/orders/new">Create Order</a>
        </Button>
      </header>

      <div className="flex gap-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All ({orders.length})
        </Button>
        <Button 
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending ({orders.filter(o => o.status === "Pending").length})
        </Button>
        <Button 
          variant={filter === "unpaid" ? "default" : "outline"}
          onClick={() => setFilter("unpaid")}
        >
          Unpaid ({orders.filter(o => o.payment_status === "Unpaid").length})
        </Button>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No sales orders found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first sales order
              </p>
              <Button asChild>
                <a href="/erp/sales/orders/new">Create Order</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <a 
                        href={`/erp/sales/orders/${order.id}`}
                        className="text-lg font-semibold hover:underline"
                      >
                        {order.order_number}
                      </a>
                      <Badge className={STATUS_COLORS[order.status] || "bg-gray-500"}>
                        {order.status}
                      </Badge>
                      <Badge className={PAYMENT_COLORS[order.payment_status] || "bg-gray-500"}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Customer: {order.customer}</div>
                      <div>Order Date: {new Date(order.order_date).toLocaleDateString()}</div>
                      {order.expected_delivery_date && (
                        <div>Expected Delivery: {new Date(order.expected_delivery_date).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      Rp{parseFloat(order.total_amount.toString()).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      asChild
                    >
                      <a href={`/erp/sales/orders/${order.id}`}>View Details</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
