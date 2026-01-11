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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Warehouse,
  ArrowRightLeft,
  DollarSign,
  Box,
} from "lucide-react"

interface InventoryItem {
  id: number
  product_id: number
  product_name: string
  sku: string
  category_name: string
  warehouse_name: string
  warehouse_code: string
  quantity_on_hand: number
  quantity_reserved: number
  quantity_available: number
  quantity_on_order: number
  unit_cost: string
  total_value: string
  stock_status: string
  location_code: string
  reorder_level: number
}

interface StockMovement {
  id: number
  product_name: string
  sku: string
  warehouse_name: string
  movement_type: string
  quantity: number
  unit_cost: string
  balance_before: number
  balance_after: number
  movement_date: string
  created_by_name: string
  notes: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("levels")

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ type: "levels" })
      if (warehouseFilter !== "all") {
        params.append("warehouse_id", warehouseFilter)
      }

      const response = await fetch(`/api/inventory?${params.toString()}`)
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('Failed fetching inventory (levels):', response.status, response.statusText, text)
        setInventory([])
        return
      }

      const data = await response.json()
      // API should return an array; handle both shaped responses and unexpected payloads
      if (Array.isArray(data)) {
        setInventory(data)
      } else if (Array.isArray(data.inventory)) {
        setInventory(data.inventory)
      } else {
        console.error('Unexpected inventory payload:', data)
        setInventory([])
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovements = async () => {
    try {
      const response = await fetch("/api/inventory?type=movements")
      if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.error('Failed fetching inventory movements:', response.status, response.statusText, text)
        setMovements([])
        return
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        setMovements(data)
      } else if (Array.isArray(data.movements)) {
        setMovements(data.movements)
      } else {
        console.error('Unexpected movements payload:', data)
        setMovements([])
      }
    } catch (error) {
      console.error("Error fetching movements:", error)
    }
  }

  useEffect(() => {
    fetchInventory()
    fetchMovements()
  }, [warehouseFilter])

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-500/10 text-green-600"
      case "Low Stock":
        return "bg-yellow-500/10 text-yellow-600"
      case "Out of Stock":
        return "bg-red-500/10 text-red-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  const getMovementTypeColor = (type: string) => {
    if (type.includes("Receipt") || type.includes("Increase") || type === "Transfer In") {
      return "bg-green-500/10 text-green-600"
    }
    if (type.includes("Shipment") || type.includes("Decrease") || type === "Transfer Out") {
      return "bg-red-500/10 text-red-600"
    }
    return "bg-blue-500/10 text-blue-600"
  }

  // Calculate summary stats
  const totalItems = inventory.reduce((sum, i) => sum + i.quantity_on_hand, 0)
  const totalValue = inventory.reduce((sum, i) => sum + parseFloat(i.total_value || "0"), 0)
  const lowStockCount = inventory.filter(i => i.stock_status === "Low Stock").length
  const outOfStockCount = inventory.filter(i => i.stock_status === "Out of Stock").length

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
              <BreadcrumbPage>Inventory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
            <p className="text-sm text-muted-foreground">
              Monitor stock levels and movements across warehouses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Transfer Stock
            </Button>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Adjust Inventory
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                Total stock value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <TrendingDown className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground">
                Need reordering
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground">
                Urgent attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="levels">Stock Levels</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="lowstock">Low Stock Alert</TabsTrigger>
          </TabsList>

          {/* Stock Levels Tab */}
          <TabsContent value="levels" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Stock Levels by Warehouse</CardTitle>
                    <CardDescription>
                      Current inventory across all locations
                    </CardDescription>
                  </div>
                  <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      <SelectItem value="1">Main Warehouse</SelectItem>
                      <SelectItem value="2">West Coast</SelectItem>
                      <SelectItem value="3">Retail Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading inventory...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>On Hand</TableHead>
                        <TableHead>Reserved</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>On Order</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {item.sku}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.warehouse_name}</div>
                              {item.location_code && (
                                <div className="text-xs text-muted-foreground">
                                  {item.location_code}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.quantity_on_hand}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.quantity_reserved}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-green-600">
                              {item.quantity_available}
                            </span>
                          </TableCell>
                          <TableCell className="text-blue-600">
                            {item.quantity_on_order || 0}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.total_value)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStockStatusColor(item.stock_status)}>
                              {item.stock_status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Movements Tab */}
          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
                <CardDescription>
                  Complete audit trail of inventory transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Warehouse</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="text-sm">
                          {formatDate(movement.movement_date)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movement.product_name}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {movement.sku}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.warehouse_name}
                        </TableCell>
                        <TableCell>
                          <Badge className={getMovementTypeColor(movement.movement_type)}>
                            {movement.movement_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.movement_type.includes("Decrease") ||
                          movement.movement_type.includes("Shipment") ||
                          movement.movement_type === "Transfer Out"
                            ? `-${movement.quantity}`
                            : `+${movement.quantity}`}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {movement.balance_before}
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.balance_after}
                        </TableCell>
                        <TableCell className="text-sm">
                          {movement.created_by_name || "System"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Low Stock Tab */}
          <TabsContent value="lowstock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>
                  Products that need reordering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Level</TableHead>
                      <TableHead>Shortage</TableHead>
                      <TableHead>On Order</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory
                      .filter(item => item.stock_status === "Low Stock" || item.stock_status === "Out of Stock")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.warehouse_name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={item.quantity_available <= 0 ? "text-red-600 font-medium" : "text-yellow-600 font-medium"}>
                              {item.quantity_available}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.reorder_level}
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium">
                              {Math.max(0, item.reorder_level - item.quantity_available)}
                            </span>
                          </TableCell>
                          <TableCell className="text-blue-600">
                            {item.quantity_on_order || 0}
                          </TableCell>
                          <TableCell>
                            <Button size="sm">Create PO</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
