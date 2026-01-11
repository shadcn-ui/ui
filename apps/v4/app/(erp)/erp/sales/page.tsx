"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Users, FileText, TrendingUp, Target, DollarSign, CreditCard } from "lucide-react"

interface SalesStats {
  totalLeads: number
  totalOpportunities: number
  totalRevenue: number
  conversionRate: number
}

export default function SalesPage() {
  const [stats, setStats] = useState<SalesStats>({
    totalLeads: 0,
    totalOpportunities: 0,
    totalRevenue: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/sales/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching sales stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sales Management</h2>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <a href="/erp/sales/leads/new">Create New Lead</a>
            </Button>
          </div>
        </div>

        {/* Sales Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalLeads.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Active leads in pipeline
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.totalOpportunities.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Open opportunities
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total from all orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : `${stats.conversionRate}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                Leads to customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Modules */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
              <CardDescription>
                Track and manage potential customers and leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/leads">View All Leads</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/leads/new">Create New Lead</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunities</CardTitle>
              <CardDescription>
                Manage sales opportunities and pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/opportunities">View Opportunities</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/opportunities/pipeline">Sales Pipeline</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quotations</CardTitle>
              <CardDescription>
                Create and manage sales quotations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/quotations">View Quotations</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/quotations/new">Create Quotation</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Orders</CardTitle>
              <CardDescription>
                Process and track sales orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/orders">View Orders</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/orders/pending">Pending Orders</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage customer relationships and data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/customers">View Customers</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/customers/new">Add Customer</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                View sales reports and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/analytics">Sales Reports</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/analytics/performance">Performance Metrics</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Point of Sale (POS)</CardTitle>
              <CardDescription>
                Quick checkout and sales processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/pos/checkout">
                    <CreditCard className="mr-2 h-4 w-4" />
                    POS Checkout
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/pos/sessions">View Sessions</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}