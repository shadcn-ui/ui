"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
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
import { Label } from "@/registry/new-york-v4/ui/label"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york-v4/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import { usePeriodState } from "@/hooks/use-period-state"
import { isProductionMode } from "@/lib/runtime-flags-client"
import {
  ArrowRightLeft,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Package,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

interface StockMovement {
  id: number
  movement_date: string
  product_name: string
  warehouse_name: string
  movement_type: string
  quantity: number
  quantity_before: number | null
  quantity_after: number | null
  reference_number: string | null
  notes: string | null
  created_by_name: string
}

interface InventoryItem {
  id: number
  product_name: string
  sku: string
  warehouse_name: string
  quantity_on_hand: number
  quantity_reserved: number
  quantity_available: number
  quantity_on_order: number
  unit_cost: string
  inventory_value: string
  reorder_level: number
  reorder_quantity: number
}

export default function StockManagementPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("movements")
  const productionMode = useMemo(() => isProductionMode(), [])
  const productionTooltip = "Disabled in Production Mode"
  const productionHelper = "This action is locked because Ocean ERP is running in Production Mode."
  
  // Transfer form state
  const [transferWarehouse, setTransferWarehouse] = useState("")
  const [transferProduct, setTransferProduct] = useState("")
  const [transferQuantity, setTransferQuantity] = useState("")
  const [transferDate, setTransferDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  
  // Adjustment form state
  const [adjustWarehouse, setAdjustWarehouse] = useState("")
  const [adjustProduct, setAdjustProduct] = useState("")
  const [adjustType, setAdjustType] = useState<"add" | "remove" | "set">("add")
  const [adjustQuantity, setAdjustQuantity] = useState("")
  const [adjustNotes, setAdjustNotes] = useState("")
  const [adjustDate, setAdjustDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const fetchMovements = async () => {
    try {
      const response = await fetch("/api/inventory?type=movements")
      const data = await response.json()
      setMovements(data)
    } catch (error) {
      console.error("Error fetching movements:", error)
    }
  }

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory?type=levels")
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const resolvePeriodId = useCallback(async (movementDate: string) => {
    if (!movementDate) return null
    try {
      const response = await fetch(`/api/accounting/period-status?date=${movementDate}`)
      if (!response.ok) return null
      const data = await response.json()
      return data?.period?.id ? String(data.period.id) : null
    } catch (error) {
      console.error("Error resolving period id for inventory movement:", error)
      return null
    }
  }, [])

  const [transferPeriodId, setTransferPeriodId] = useState<string | null>(null)
  const [adjustPeriodId, setAdjustPeriodId] = useState<string | null>(null)
  const [transferResolving, setTransferResolving] = useState(false)
  const [adjustResolving, setAdjustResolving] = useState(false)
  const [periodError, setPeriodError] = useState<string | null>(null)

  const { state: transferPeriodState, loading: transferPeriodLoading } = usePeriodState(transferPeriodId ?? undefined)
  const { state: adjustPeriodState, loading: adjustPeriodLoading } = usePeriodState(adjustPeriodId ?? undefined)

  const syncTransferPeriod = useCallback(async () => {
    setTransferResolving(true)
    setPeriodError(null)
    const pid = await resolvePeriodId(transferDate)
    if (pid) {
      setTransferPeriodId(pid)
    } else {
      setTransferPeriodId(null)
      setPeriodError("Unable to verify inventory period for this date.")
    }
    setTransferResolving(false)
  }, [resolvePeriodId, transferDate])

  const syncAdjustPeriod = useCallback(async () => {
    setAdjustResolving(true)
    setPeriodError(null)
    const pid = await resolvePeriodId(adjustDate)
    if (pid) {
      setAdjustPeriodId(pid)
    } else {
      setAdjustPeriodId(null)
      setPeriodError("Unable to verify inventory period for this date.")
    }
    setAdjustResolving(false)
  }, [resolvePeriodId, adjustDate])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchMovements(), fetchInventory()])
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    syncTransferPeriod()
  }, [transferDate, syncTransferPeriod])

  useEffect(() => {
    syncAdjustPeriod()
  }, [adjustDate, syncAdjustPeriod])

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    if (isNaN(num)) return "Rp0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const getMovementColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "receipt":
      case "purchase receipt":
      case "transfer in":
      case "adjustment (add)":
        return "text-green-600"
      case "shipment":
      case "sale":
      case "transfer out":
      case "adjustment (remove)":
        return "text-red-600"
      case "adjustment (set)":
      case "count":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "receipt":
      case "purchase receipt":
      case "transfer in":
      case "adjustment (add)":
        return <TrendingUp className="h-4 w-4" />
      case "shipment":
      case "sale":
      case "transfer out":
      case "adjustment (remove)":
        return <TrendingDown className="h-4 w-4" />
      case "adjustment (set)":
      case "count":
        return <RotateCcw className="h-4 w-4" />
      default:
        return <ArrowRightLeft className="h-4 w-4" />
    }
  }

  // Calculate summary metrics
  const totalMovements = movements.length
  const receipts = movements.filter(m => ["Receipt", "Purchase Receipt", "Transfer In", "Adjustment (Add)"].includes(m.movement_type)).length
  const shipments = movements.filter(m => ["Shipment", "Sale", "Transfer Out", "Adjustment (Remove)"].includes(m.movement_type)).length
  const adjustments = movements.filter(m => m.movement_type.includes("Adjustment")).length

  const inventoryClosedHelper =
    "Inventory is closed for this period. Adjustments must be made in the next open period.";
  const inventoryBannerText =
    "This period is closed. Transactions are locked. Use the next open period for adjustments.";

  const transferGuardActive =
    transferResolving ||
    transferPeriodLoading ||
    !transferPeriodId ||
    transferPeriodState.status === "closed" ||
    transferPeriodState.inventoryClosed ||
    !transferPeriodState.canPostInventory ||
    productionMode;

  const adjustGuardActive =
    adjustResolving ||
    adjustPeriodLoading ||
    !adjustPeriodId ||
    adjustPeriodState.status === "closed" ||
    adjustPeriodState.inventoryClosed ||
    !adjustPeriodState.canPostInventory ||
    productionMode;
  const inventoryBannerActive =
    transferGuardActive ||
    adjustGuardActive ||
    transferPeriodLoading ||
    adjustPeriodLoading ||
    transferResolving ||
    adjustResolving ||
    Boolean(periodError) ||
    productionMode;

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
              <BreadcrumbPage>Stock Management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
            <p className="text-sm text-muted-foreground">
              Transfer, adjust, and track inventory movements
            </p>
          </div>

                  <div className="space-y-2">
                    <Label>Movement Date</Label>
                    <Input
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      disabled={productionMode}
                    />
                    {productionMode && (
                      <p className="text-xs text-amber-800">{productionHelper}</p>
                    )}
                  </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Movements</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMovements}</div>
              <p className="text-xs text-muted-foreground">
                All transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receipts</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{receipts}</div>
              <p className="text-xs text-muted-foreground">
                Stock increases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shipments</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{shipments}</div>
              <p className="text-xs text-muted-foreground">
                Stock decreases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
              <RotateCcw className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{adjustments}</div>
              <p className="text-xs text-muted-foreground">
                Manual changes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <TooltipProvider>
        {inventoryBannerActive && (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{productionMode ? "Ocean ERP is running in Production Mode." : inventoryBannerText}</p>
              <p className="text-xs text-amber-800">{productionMode ? productionHelper : "Stock transfers and adjustments are disabled until an open period is selected."}</p>
            </div>
          </div>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="movements">Movement History</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Stock</TabsTrigger>
            <TabsTrigger value="adjust">Adjust Stock</TabsTrigger>
          </TabsList>

          {/* Movement History Tab */}
          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement History</CardTitle>
                <CardDescription>
                  Complete audit trail of all inventory transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading movements...</div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-sm">
                            {formatDate(movement.movement_date)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {movement.product_name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.warehouse_name}
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-1 ${getMovementColor(movement.movement_type)}`}>
                              {getMovementIcon(movement.movement_type)}
                              <span className="text-sm font-medium">{movement.movement_type}</span>
                            </div>
                          </TableCell>
                          <TableCell className={`font-bold ${getMovementColor(movement.movement_type)}`}>
                            {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {movement.quantity_before ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {movement.quantity_after ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {movement.reference_number || "—"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {movement.created_by_name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer Stock Tab */}
          <TabsContent value="transfer" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Stock</CardTitle>
                  <CardDescription>
                    Move inventory between warehouses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={transferProduct} onValueChange={setTransferProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.product_name} ({item.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>From Warehouse</Label>
                      <Select value={transferWarehouse} onValueChange={setTransferWarehouse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Main Warehouse</SelectItem>
                          <SelectItem value="2">East Coast DC</SelectItem>
                          <SelectItem value="3">West Coast DC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>To Warehouse</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Main Warehouse</SelectItem>
                          <SelectItem value="2">East Coast DC</SelectItem>
                          <SelectItem value="3">West Coast DC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity to transfer"
                      value={transferQuantity}
                      onChange={(e) => setTransferQuantity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Input placeholder="Optional notes..." />
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full"
                        disabled={transferGuardActive}
                      >
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        {transferResolving || transferPeriodLoading
                          ? "Checking period..."
                          : "Transfer Stock"}
                      </Button>
                    </TooltipTrigger>
                    {(transferGuardActive) && (
                      <TooltipContent className="max-w-xs text-sm">
                        {productionMode
                          ? productionTooltip
                          : transferResolving || transferPeriodLoading
                            ? "Validating inventory period..."
                            : inventoryClosedHelper}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  {transferGuardActive && !transferResolving && !transferPeriodLoading && (
                    <p className="text-sm text-amber-800">{productionMode ? productionHelper : inventoryClosedHelper}</p>
                  )}
                  {periodError && (
                    <p className="text-sm text-amber-700">{periodError}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Stock Levels</CardTitle>
                  <CardDescription>
                    Available stock by warehouse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Available</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.slice(0, 8).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-sm">
                            {item.product_name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.warehouse_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.quantity_available > 0 ? "default" : "secondary"}>
                              {item.quantity_available}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Adjust Stock Tab */}
          <TabsContent value="adjust" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Adjust Stock Level</CardTitle>
                  <CardDescription>
                    Manually adjust inventory quantities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product</Label>
                    <Select value={adjustProduct} onValueChange={setAdjustProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.product_name} ({item.sku})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Warehouse</Label>
                    <Select value={adjustWarehouse} onValueChange={setAdjustWarehouse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select warehouse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Main Warehouse</SelectItem>
                        <SelectItem value="2">East Coast DC</SelectItem>
                        <SelectItem value="3">West Coast DC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Adjustment Type</Label>
                    <Select value={adjustType} onValueChange={(v) => setAdjustType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-green-600" />
                            <span>Add to Stock</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="remove">
                          <div className="flex items-center gap-2">
                            <Minus className="h-4 w-4 text-red-600" />
                            <span>Remove from Stock</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="set">
                          <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-blue-600" />
                            <span>Set Quantity</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder={adjustType === "set" ? "New quantity" : "Quantity to adjust"}
                      value={adjustQuantity}
                      onChange={(e) => setAdjustQuantity(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Reason (Required)</Label>
                    <Input
                      placeholder="Enter reason for adjustment..."
                      value={adjustNotes}
                      onChange={(e) => setAdjustNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Movement Date</Label>
                    <Input
                      type="date"
                      value={adjustDate}
                      onChange={(e) => setAdjustDate(e.target.value)}
                      disabled={productionMode}
                    />
                    {productionMode && (
                      <p className="text-xs text-amber-800">{productionHelper}</p>
                    )}
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full"
                        variant="default"
                        disabled={adjustGuardActive}
                      >
                        {adjustType === "add" && <Plus className="mr-2 h-4 w-4" />}
                        {adjustType === "remove" && <Minus className="mr-2 h-4 w-4" />}
                        {adjustType === "set" && <RotateCcw className="mr-2 h-4 w-4" />}
                        {adjustResolving || adjustPeriodLoading
                          ? "Checking period..."
                          : "Apply Adjustment"}
                      </Button>
                    </TooltipTrigger>
                    {(adjustGuardActive) && (
                      <TooltipContent className="max-w-xs text-sm">
                        {productionMode
                          ? productionTooltip
                          : adjustResolving || adjustPeriodLoading
                            ? "Validating inventory period..."
                            : inventoryClosedHelper}
                      </TooltipContent>
                    )}
                  </Tooltip>
                  {adjustGuardActive && !adjustResolving && !adjustPeriodLoading && (
                    <p className="text-sm text-amber-800">{productionMode ? productionHelper : inventoryClosedHelper}</p>
                  )}
                  {periodError && (
                    <p className="text-sm text-amber-700">{periodError}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Adjustments</CardTitle>
                  <CardDescription>
                    Latest manual stock adjustments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {movements
                      .filter(m => m.movement_type.includes("Adjustment"))
                      .slice(0, 8)
                      .map((movement) => (
                        <div
                          key={movement.id}
                          className="flex items-start justify-between border-b pb-3 last:border-0"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className={getMovementColor(movement.movement_type)}>
                                {getMovementIcon(movement.movement_type)}
                              </div>
                              <span className="text-sm font-medium">{movement.product_name}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {movement.warehouse_name} • {formatDate(movement.movement_date)}
                            </div>
                            {movement.notes && (
                              <div className="text-xs text-muted-foreground italic">
                                {movement.notes}
                              </div>
                            )}
                          </div>
                          <Badge className={getMovementColor(movement.movement_type)}>
                            {movement.quantity > 0 ? "+" : ""}{movement.quantity}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </TooltipProvider>
      </div>
    </>
  )
}
