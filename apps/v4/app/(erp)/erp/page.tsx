"use client"

import { useEffect, useState } from "react"
import { 
  Users, 
  ShoppingCart, 
  Package, 
  Calculator, 
  Factory,
  TrendingUp,
  DollarSign,
  Activity
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"

interface DashboardStats {
  totalRevenue: number
  activeOrders: number
  inventoryItems: number
  activeEmployees: number
  sales?: {
    totalLeads: number
    totalOpportunities: number
    activeOrders: number
    monthlyRevenue: number
  }
  products?: {
    total: number
    inStock: number
    lowStock: number
  }
  operations?: {
    activeProduction: number
    pendingInspections: number
  }
  accounting?: {
    totalAccounts: number
    journalEntries: number
    totalAssets: number
  }
  hris?: {
    totalEmployees: number
    activeEmployees: number
    pendingLeave: number
  }
}

export default function ERPDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeOrders: 0,
    inventoryItems: 0,
    activeEmployees: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
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
          <h2 className="text-3xl font-bold tracking-tight">Ocean ERP Dashboard</h2>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From all sales orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.activeOrders.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending and processing orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.inventoryItems.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Active products in catalog
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Employees
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats.activeEmployees.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently employed staff
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Modules */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Management
              </CardTitle>
              <CardDescription>
                Manage leads, opportunities, and sales processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Leads:</span>
                  <span className="font-semibold">{loading ? "..." : stats.sales?.totalLeads || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Opportunities:</span>
                  <span className="font-semibold text-blue-600">{loading ? "..." : stats.sales?.totalOpportunities || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Orders:</span>
                  <span className="font-semibold text-green-600">{loading ? "..." : stats.sales?.activeOrders || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monthly Revenue:</span>
                  <span className="font-semibold text-green-600">
                    {loading ? "..." : formatCurrency(stats.sales?.monthlyRevenue || 0)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/leads">View Leads</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/orders">Sales Orders</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/sales/analytics">Sales Analytics</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Management
              </CardTitle>
              <CardDescription>
                Handle inventory, stock, and product catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Products:</span>
                  <span className="font-semibold">{loading ? "..." : stats.products?.total || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">In Stock:</span>
                  <span className="font-semibold text-green-600">{loading ? "..." : stats.products?.inStock || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Low Stock:</span>
                  <span className="font-semibold text-orange-600">{loading ? "..." : stats.products?.lowStock || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/product/catalog">Product Catalog</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/product/inventory">Inventory</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/product/stock">Stock Management</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                Operations
              </CardTitle>
              <CardDescription>
                Manufacturing, logistics, and operations management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Production:</span>
                  <span className="font-semibold">{loading ? "..." : stats.operations?.activeProduction || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Inspections:</span>
                  <span className="font-semibold text-orange-600">{loading ? "..." : stats.operations?.pendingInspections || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/manufacturing">Manufacturing</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/planning">Production Planning</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/operations/logistics">Logistics</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Accounting
              </CardTitle>
              <CardDescription>
                Financial management and accounting operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chart of Accounts:</span>
                  <span className="font-semibold">{loading ? "..." : stats.accounting?.totalAccounts || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Journal Entries:</span>
                  <span className="font-semibold">{loading ? "..." : stats.accounting?.journalEntries || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Assets:</span>
                  <span className="font-semibold text-green-600">
                    {loading ? "..." : formatCurrency(stats.accounting?.totalAssets || 0)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/accounting/chart-of-accounts">Chart of Accounts</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/accounting/general-ledger">General Ledger</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/accounting/reports">Financial Reports</a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Human Resources
              </CardTitle>
              <CardDescription>
                Employee management and HR processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Employees:</span>
                  <span className="font-semibold">{loading ? "..." : stats.hris?.totalEmployees || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Employees:</span>
                  <span className="font-semibold text-green-600">{loading ? "..." : stats.hris?.activeEmployees || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Leave:</span>
                  <span className="font-semibold text-orange-600">{loading ? "..." : stats.hris?.pendingLeave || 0}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/employees">Employees</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/recruitment">Recruitment</a>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="/erp/hris/payroll">Payroll</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}