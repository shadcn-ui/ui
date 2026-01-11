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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Warehouse,
  Plus,
  MapPin,
  User,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react"

interface WarehouseData {
  id: number
  code: string
  name: string
  type: string
  city: string
  state: string
  status: string
  is_primary: boolean
  manager_name: string
  phone: string
  email: string
  total_capacity: string
  capacity_unit: string
  product_count: string
  total_items_count: string
  total_inventory_value: string
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWarehouses = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/warehouses")
      const data = await response.json()
      setWarehouses(data)
    } catch (error) {
      console.error("Error fetching warehouses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const totalWarehouses = warehouses.length
  const totalProducts = warehouses.reduce((sum, w) => sum + parseInt(w.product_count || "0"), 0)
  const totalItems = warehouses.reduce((sum, w) => sum + parseInt(w.total_items_count || "0"), 0)
  const totalValue = warehouses.reduce((sum, w) => sum + parseFloat(w.total_inventory_value || "0"), 0)

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
              <BreadcrumbPage>Warehouses</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Warehouse Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage your warehouse locations and inventory
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWarehouses}</div>
              <p className="text-xs text-muted-foreground">
                Active locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Stored</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Unique products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Units in stock
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
                Inventory value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Warehouses List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading warehouses...</div>
            </div>
          ) : (
            warehouses.map((warehouse) => (
              <Card key={warehouse.id} className={warehouse.is_primary ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {warehouse.name}
                        {warehouse.is_primary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {warehouse.code}
                      </CardDescription>
                    </div>
                    <Badge variant={warehouse.status === "Active" ? "default" : "secondary"}>
                      {warehouse.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{warehouse.city}, {warehouse.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{warehouse.manager_name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {warehouse.type}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">Products</div>
                      <div className="font-medium">{warehouse.product_count}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Items</div>
                      <div className="font-medium">{parseInt(warehouse.total_items_count || "0").toLocaleString()}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-muted-foreground text-xs">Inventory Value</div>
                      <div className="font-medium text-lg">
                        {formatCurrency(warehouse.total_inventory_value)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Manage
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
            <CardTitle>Warehouse Details</CardTitle>
            <CardDescription>
              Complete warehouse information and contact details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-mono text-sm">
                      {warehouse.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {warehouse.name}
                      {warehouse.is_primary && (
                        <Badge variant="default" className="ml-2 text-xs">Primary</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{warehouse.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {warehouse.city}, {warehouse.state}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium">{warehouse.manager_name}</div>
                        <div className="text-xs text-muted-foreground">{warehouse.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {warehouse.total_capacity} {warehouse.capacity_unit}
                    </TableCell>
                    <TableCell className="text-sm">
                      {warehouse.product_count} products
                      <div className="text-xs text-muted-foreground">
                        {parseInt(warehouse.total_items_count || "0").toLocaleString()} items
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(warehouse.total_inventory_value)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={warehouse.status === "Active" ? "default" : "secondary"}>
                        {warehouse.status}
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
