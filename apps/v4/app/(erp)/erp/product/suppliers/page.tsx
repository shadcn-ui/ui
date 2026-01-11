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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Star,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react"

interface Supplier {
  id: number
  supplier_code: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  city: string
  state: string
  country: string
  payment_terms: string
  status: string
  rating: string
  total_orders: string
  total_purchase_value: string
  on_time_delivery_rate: string
  last_order_date: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ summary: "true" })
      const response = await fetch(`/api/suppliers?${params.toString()}`)
      const data = await response.json()
      
      // Check if response is an error object or array
      if (Array.isArray(data)) {
        setSuppliers(data)
      } else if (data.error) {
        console.error("API error:", data.error)
        setSuppliers([])
      } else {
        setSuppliers([])
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(num)) return "Rp0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const formatRating = (rating: string | number) => {
    const num = typeof rating === "string" ? parseFloat(rating) : rating
    return num.toFixed(1)
  }

  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter(s => s.status === "Active").length
  const totalOrders = suppliers.reduce((sum, s) => sum + parseInt(s.total_orders || "0"), 0)
  const totalValue = suppliers.reduce((sum, s) => sum + parseFloat(s.total_purchase_value || "0"), 0)
  const avgRating = suppliers.reduce((sum, s) => sum + parseFloat(s.rating || "0"), 0) / (suppliers.length || 1)

  const filteredSuppliers = suppliers.filter(s =>
    s.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.supplier_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <BreadcrumbPage>Suppliers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Supplier Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage supplier relationships and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/erp/product/suppliers/performance">
                View Performance Dashboard
              </a>
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                {activeSuppliers} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                Purchase orders
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
                Purchase value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRating(avgRating)}</div>
              <p className="text-xs text-muted-foreground">
                Out of 5.0
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalOrders > 0 ? totalValue / totalOrders : 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per order
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search suppliers by name, code, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading suppliers...</div>
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{supplier.company_name}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {supplier.supplier_code}
                      </CardDescription>
                    </div>
                    <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                      {supplier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.contact_person}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{supplier.phone}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{formatRating(supplier.rating)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Orders</span>
                      <span className="font-medium">{supplier.total_orders || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Value</span>
                      <span className="font-medium">{formatCurrency(supplier.total_purchase_value)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">On-time Delivery</span>
                      <span className="font-medium text-green-600">
                        {parseFloat(supplier.on_time_delivery_rate || "0").toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Create PO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>
              Detailed supplier metrics and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>On-time %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-mono text-sm">
                      {supplier.supplier_code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {supplier.company_name}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{supplier.contact_person}</div>
                        <div className="text-xs text-muted-foreground">{supplier.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {supplier.city}, {supplier.state}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{formatRating(supplier.rating)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {supplier.total_orders || 0}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(supplier.total_purchase_value)}
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">
                        {parseFloat(supplier.on_time_delivery_rate || "0").toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
