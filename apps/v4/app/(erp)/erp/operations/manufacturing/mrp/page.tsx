"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york-v4/ui/dialog"
import { OperationsNav } from "@/components/operations-nav"
import { 
  Calculator, 
  Play, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Package,
  TrendingDown,
  RefreshCw,
  Eye,
  History,
  Download
} from "lucide-react"

interface MRPCalculation {
  id: number
  run_date: string
  run_by_name: string
  scope: string
  status: string
  total_items_checked: number
  total_shortages_found: number
  execution_time_seconds: number
  wo_number: string
  shortages_count: number
}

interface ShortageItem {
  id: number
  product_code: string
  product_name: string
  unit_of_measure: string
  required_quantity: number
  available_quantity: number
  shortage_quantity: number
  required_date: string
  recommendation: string
  status: string
  wo_number: string
  cost_price: number
}

interface MRPStatistics {
  total_shortages: number
  open_shortages: number
  resolved_shortages: number
  total_shortage_value: number
  unique_products_short: number
  affected_work_orders: number
}

export default function MRPDashboardPage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [mrpRuns, setMrpRuns] = useState<MRPCalculation[]>([])
  const [shortages, setShortages] = useState<ShortageItem[]>([])
  const [statistics, setStatistics] = useState<MRPStatistics | null>(null)
  const [topShortages, setTopShortages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [workOrders, setWorkOrders] = useState<any[]>([])
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<string>("all")

  useEffect(() => {
    loadMRPData()
    loadWorkOrders()
  }, [])

  const loadWorkOrders = async () => {
    try {
      const res = await fetch('/api/operations/work-orders?status=draft&status=ready&status=released&limit=100')
      if (res.ok) {
        const data = await res.json()
        setWorkOrders(data.work_orders || [])
      }
    } catch (error) {
      console.error('Failed to load work orders:', error)
    }
  }

  const loadMRPData = async () => {
    setLoading(true)
    try {
      // Load recent MRP runs
      const runsRes = await fetch('/api/operations/mrp/runs?limit=10')
      if (runsRes.ok) {
        const runsData = await runsRes.json()
        setMrpRuns(runsData.runs || [])
      }

      // Load current shortages and requirements
      const reqRes = await fetch('/api/operations/mrp/requirements?status=open&limit=100')
      if (reqRes.ok) {
        const reqData = await reqRes.json()
        setShortages(reqData.requirements || [])
        setStatistics(reqData.statistics)
        setTopShortages(reqData.top_shortages || [])
      }
    } catch (error) {
      console.error('Failed to load MRP data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMRPCalculation = async () => {
    setIsCalculating(true)
    try {
      const payload: any = {
        user_id: 1 // TODO: Get from auth context
      }

      if (selectedWorkOrder !== "all") {
        payload.work_order_id = parseInt(selectedWorkOrder)
      }

      const res = await fetch('/api/operations/mrp/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        alert(data.message)
        loadMRPData() // Reload data
      } else {
        const error = await res.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to run MRP calculation:', error)
      alert('Failed to run MRP calculation')
    } finally {
      setIsCalculating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID').format(value)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    } else if (status === 'running') {
      return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
    } else if (status === 'failed') {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>
    } else if (status === 'open') {
      return <Badge className="bg-yellow-100 text-yellow-800">Open</Badge>
    } else if (status === 'resolved') {
      return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === 'purchase') {
      return <Badge className="bg-purple-100 text-purple-800">Purchase</Badge>
    } else if (recommendation === 'transfer') {
      return <Badge className="bg-blue-100 text-blue-800">Transfer</Badge>
    } else if (recommendation === 'sufficient') {
      return <Badge className="bg-green-100 text-green-800">Sufficient</Badge>
    }
    return <Badge variant="secondary">{recommendation}</Badge>
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h1 className="text-lg font-semibold">MRP Dashboard</h1>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r bg-background">
          <OperationsNav />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* MRP Calculation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Run MRP Calculation</CardTitle>
              <CardDescription>
                Calculate material requirements and identify shortages for work orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Scope</Label>
                  <Select value={selectedWorkOrder} onValueChange={setSelectedWorkOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Open Work Orders</SelectItem>
                      {workOrders.map((wo) => (
                        <SelectItem key={wo.id} value={wo.id.toString()}>
                          {wo.wo_number} - {wo.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={runMRPCalculation} 
                    disabled={isCalculating}
                    className="w-full"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Run MRP Calculation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Shortages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statistics.open_shortages || 0}
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {statistics.resolved_shortages || 0} resolved
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Shortage Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {formatCurrency(parseFloat(statistics.total_shortage_value?.toString() || '0'))}
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Total material value short
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Products Affected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statistics.unique_products_short || 0}
                    </div>
                    <Package className="h-8 w-8 text-orange-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Unique products with shortages
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Work Orders Affected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {statistics.affected_work_orders || 0}
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Work orders with material issues
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Top Shortages Table */}
          {topShortages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Material Shortages</CardTitle>
                <CardDescription>
                  Products with highest shortage value requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Total Shortage</TableHead>
                      <TableHead className="text-right">Current Stock</TableHead>
                      <TableHead className="text-right">Shortage Value</TableHead>
                      <TableHead className="text-right">Affected WOs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topShortages.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product_code}</div>
                            <div className="text-sm text-muted-foreground">{item.product_name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatNumber(parseFloat(item.total_shortage))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(item.current_stock || 0)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(parseFloat(item.shortage_value) || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{item.affected_wos}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Current Shortages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Material Shortages</CardTitle>
              <CardDescription>
                Current open material shortages requiring action
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shortages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No material shortages found. All work orders have sufficient materials!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Required</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Shortage</TableHead>
                      <TableHead>Required Date</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortages.map((shortage) => (
                      <TableRow key={shortage.id}>
                        <TableCell>
                          <Badge variant="outline">{shortage.wo_number}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{shortage.product_code}</div>
                            <div className="text-sm text-muted-foreground">{shortage.product_name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(shortage.required_quantity)} {shortage.unit_of_measure}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(shortage.available_quantity)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatNumber(shortage.shortage_quantity)}
                        </TableCell>
                        <TableCell>
                          {shortage.required_date ? new Date(shortage.required_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {getRecommendationBadge(shortage.recommendation)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(shortage.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* MRP Calculation History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent MRP Calculations
              </CardTitle>
              <CardDescription>
                History of MRP calculation runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mrpRuns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2" />
                  <p>No MRP calculations yet. Run your first calculation above.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Run Date</TableHead>
                      <TableHead>Run By</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead className="text-right">Items Checked</TableHead>
                      <TableHead className="text-right">Shortages Found</TableHead>
                      <TableHead className="text-right">Execution Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mrpRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>
                          {new Date(run.run_date).toLocaleString()}
                        </TableCell>
                        <TableCell>{run.run_by_name || 'System'}</TableCell>
                        <TableCell>
                          {run.scope === 'all' ? 'All Work Orders' : `WO ${run.wo_number}`}
                        </TableCell>
                        <TableCell className="text-right">
                          {run.total_items_checked || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {run.total_shortages_found > 0 ? (
                            <span className="text-red-600 font-medium">
                              {run.total_shortages_found}
                            </span>
                          ) : (
                            <span className="text-green-600">0</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {run.execution_time_seconds ? `${run.execution_time_seconds.toFixed(2)}s` : '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(run.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </main>
      </div>
    </div>
  )
}
