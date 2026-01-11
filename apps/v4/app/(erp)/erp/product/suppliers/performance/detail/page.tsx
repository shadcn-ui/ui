"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface SupplierDetail {
  id: number
  supplier_code: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  country: string
  status: string
  rating: number
  payment_terms: string
  currency: string
  credit_limit: number
}

interface PerformanceMetrics {
  total_orders: number
  total_purchase_value: number
  avg_order_value: number
  completed_orders: number
  on_time_deliveries: number
  on_time_delivery_rate: number
  avg_lead_time_days: number
  paid_orders: number
  payment_completion_rate: number
}

interface MonthlyTrend {
  month: string
  orders_count: number
  total_value: number
  avg_order_value: number
  on_time_rate: number
}

export default function SupplierDetailPerformancePage() {
  const searchParams = useSearchParams()
  const supplierId = searchParams.get("id")
  
  const [supplier, setSupplier] = useState<SupplierDetail | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [trends, setTrends] = useState<MonthlyTrend[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("year")
  const [editRating, setEditRating] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [performanceNotes, setPerformanceNotes] = useState("")

  useEffect(() => {
    if (supplierId) {
      fetchSupplierDetails()
      fetchPerformanceMetrics()
      fetchTrends()
    }
  }, [supplierId, timeRange])

  const fetchSupplierDetails = async () => {
    try {
      const response = await fetch(`/api/suppliers/${supplierId}`)
      const data = await response.json()
      if (!data.error) {
        setSupplier(data)
        setNewRating(Number(data.rating || 0))
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error)
    }
  }

  const fetchPerformanceMetrics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        supplier_id: supplierId!,
        time_range: timeRange,
        metrics: "comparison"
      })
      const response = await fetch(`/api/suppliers/performance?${params.toString()}`)
      const data = await response.json()
      
      if (!data.error && data.length > 0) {
        setMetrics(data[0])
      }
    } catch (error) {
      console.error("Error fetching performance metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTrends = async () => {
    try {
      const params = new URLSearchParams({
        supplier_id: supplierId!,
        time_range: timeRange,
        metrics: "trends"
      })
      const response = await fetch(`/api/suppliers/performance?${params.toString()}`)
      const data = await response.json()
      
      if (!data.error && Array.isArray(data)) {
        const formattedTrends = data
          .filter(item => item.month)
          .map(item => ({
            month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            orders_count: Number(item.orders_count || 0),
            total_value: Number(item.total_value || 0) / 1000, // in thousands
            avg_order_value: Number(item.avg_order_value || 0),
            on_time_rate: Number(item.on_time_rate || 0)
          }))
          .reverse()
        setTrends(formattedTrends)
      }
    } catch (error) {
      console.error("Error fetching trends:", error)
    }
  }

  const handleUpdateRating = async () => {
    try {
      const response = await fetch('/api/suppliers/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: supplierId,
          rating: newRating,
          performance_notes: performanceNotes || undefined,
          updated_by: 1 // TODO: Get from session
        })
      })
      
      if (response.ok) {
        setEditRating(false)
        setPerformanceNotes("")
        fetchSupplierDetails()
        alert("Rating updated successfully!")
      }
    } catch (error) {
      console.error("Error updating rating:", error)
      alert("Failed to update rating")
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 3.5) return "text-blue-600"
    if (rating >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rating >= 3.5) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (rating >= 2.5) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const getPerformanceTrend = () => {
    if (trends.length < 2) return null
    const latest = trends[trends.length - 1]
    const previous = trends[trends.length - 2]
    
    const ratingTrend = latest.on_time_rate - previous.on_time_rate
    const valueTrend = ((latest.total_value - previous.total_value) / previous.total_value) * 100
    
    return { ratingTrend, valueTrend }
  }

  if (loading && !supplier) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading supplier details...</p>
        </div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-4 text-sm text-muted-foreground">Supplier not found</p>
          <Button asChild className="mt-4">
            <a href="/erp/product/suppliers/performance">Back to Performance</a>
          </Button>
        </div>
      </div>
    )
  }

  const trend = getPerformanceTrend()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp/product">Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp/product/suppliers">Suppliers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp/product/suppliers/performance">Performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{supplier.company_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/erp/product/suppliers/performance">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{supplier.company_name}</h1>
                <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Supplier Code: <code className="rounded bg-muted px-2 py-1">{supplier.supplier_code}</code>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Supplier Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{supplier.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{supplier.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {supplier.address ? `${supplier.address}, ${supplier.city}, ${supplier.state}, ${supplier.country}` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Payment Terms</p>
                  <p className="text-sm text-muted-foreground">{supplier.payment_terms || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Credit Limit</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(supplier.credit_limit || 0))}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Supplier Rating</CardTitle>
                <CardDescription>Overall quality and performance score</CardDescription>
              </div>
              <Dialog open={editRating} onOpenChange={setEditRating}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Update Rating
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Supplier Rating</DialogTitle>
                    <DialogDescription>
                      Adjust the supplier rating and add performance notes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={newRating}
                        onChange={(e) => setNewRating(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Performance Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes about this rating change..."
                        value={performanceNotes}
                        onChange={(e) => setPerformanceNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditRating(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateRating}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Rating
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getRatingColor(Number(supplier.rating))}`}>
                  {Number(supplier.rating).toFixed(1)}
                </div>
                <div className="mt-2 flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Number(supplier.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2">{getRatingBadge(Number(supplier.rating))}</div>
              </div>
              
              {trend && (
                <div className="flex-1 space-y-3 border-l pl-6">
                  <div>
                    <p className="text-sm font-medium">Recent Trend</p>
                    <div className="mt-1 flex items-center gap-2">
                      {trend.ratingTrend >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={trend.ratingTrend >= 0 ? "text-green-600" : "text-red-600"}>
                        {trend.ratingTrend >= 0 ? "+" : ""}{trend.ratingTrend.toFixed(1)}% delivery rate
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Purchase Trend</p>
                    <div className="mt-1 flex items-center gap-2">
                      {trend.valueTrend >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <span className={trend.valueTrend >= 0 ? "text-green-600" : "text-red-600"}>
                        {trend.valueTrend >= 0 ? "+" : ""}{trend.valueTrend.toFixed(1)}% from last month
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics KPIs */}
        {metrics && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.total_orders}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.completed_orders} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(metrics.total_purchase_value))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: {formatCurrency(Number(metrics.avg_order_value))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Number(metrics.on_time_delivery_rate).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.on_time_deliveries} / {metrics.total_orders} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Number(metrics.avg_lead_time_days || 0).toFixed(1)} days
                </div>
                <p className="text-xs text-muted-foreground">
                  From order to delivery
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trend Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Order Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Order Volume Trend</CardTitle>
              <CardDescription>Monthly order count and value</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders_count" fill="#8884d8" name="Orders" />
                  <Bar yAxisId="right" dataKey="total_value" fill="#82ca9d" name="Value ($K)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delivery Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance Trend</CardTitle>
              <CardDescription>On-time delivery rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="on_time_rate"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="On-Time Rate %"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average Order Value Trend */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Average Order Value Trend</CardTitle>
              <CardDescription>Mean purchase order size over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="avg_order_value"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.6}
                    name="Avg Order Value ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Key insights for {timeRange === "all" ? "all time" : `the selected ${timeRange}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Strengths</h4>
                    <ul className="space-y-1 text-sm">
                      {Number(metrics.on_time_delivery_rate) >= 95 && (
                        <li className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Excellent on-time delivery rate
                        </li>
                      )}
                      {Number(metrics.payment_completion_rate) >= 95 && (
                        <li className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Strong payment completion rate
                        </li>
                      )}
                      {Number(metrics.avg_lead_time_days) <= 14 && (
                        <li className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Fast average lead time
                        </li>
                      )}
                      {Number(supplier.rating) >= 4.5 && (
                        <li className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Top-tier quality rating
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Areas for Improvement</h4>
                    <ul className="space-y-1 text-sm">
                      {Number(metrics.on_time_delivery_rate) < 85 && (
                        <li className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Delivery reliability needs improvement
                        </li>
                      )}
                      {Number(metrics.avg_lead_time_days) > 21 && (
                        <li className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Lead time longer than target
                        </li>
                      )}
                      {Number(supplier.rating) < 3.5 && (
                        <li className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Quality rating below standards
                        </li>
                      )}
                      {Number(metrics.payment_completion_rate) < 90 && (
                        <li className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4" />
                          Payment completion rate needs attention
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
