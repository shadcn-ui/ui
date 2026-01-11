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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Download,
  Calendar,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface SupplierPerformance {
  id: number
  supplier_code: string
  company_name: string
  contact_person: string
  email: string
  status: string
  rating: number
  total_orders: number
  total_purchase_value: number
  avg_order_value: number
  completed_orders: number
  on_time_deliveries: number
  on_time_delivery_rate: number
  last_order_date: string
}

interface PerformanceMetrics {
  totalSuppliers: number
  avgRating: number
  avgOnTimeRate: number
  totalPurchaseValue: number
  topPerformer: string
  worstPerformer: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function SupplierPerformancePage() {
  const [suppliers, setSuppliers] = useState<SupplierPerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")
  const [sortBy, setSortBy] = useState("rating")

  const fetchSupplierPerformance = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ summary: "true" })
      const response = await fetch(`/api/suppliers?${params.toString()}`)
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setSuppliers(data)
      } else {
        console.error("API error:", data.error)
        setSuppliers([])
      }
    } catch (error) {
      console.error("Error fetching supplier performance:", error)
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSupplierPerformance()
  }, [timeRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  // Calculate metrics
  const metrics: PerformanceMetrics = {
    totalSuppliers: suppliers.length,
    avgRating: suppliers.length > 0 
      ? suppliers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / suppliers.length 
      : 0,
    avgOnTimeRate: suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + Number(s.on_time_delivery_rate || 0), 0) / suppliers.length
      : 0,
    totalPurchaseValue: suppliers.reduce((sum, s) => sum + Number(s.total_purchase_value || 0), 0),
    topPerformer: suppliers.length > 0
      ? suppliers.sort((a, b) => Number(b.rating) - Number(a.rating))[0]?.company_name || "N/A"
      : "N/A",
    worstPerformer: suppliers.length > 0
      ? suppliers.sort((a, b) => Number(a.rating) - Number(b.rating))[0]?.company_name || "N/A"
      : "N/A",
  }

  // Sort suppliers
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return Number(b.rating) - Number(a.rating)
      case "on_time":
        return Number(b.on_time_delivery_rate) - Number(a.on_time_delivery_rate)
      case "value":
        return Number(b.total_purchase_value) - Number(a.total_purchase_value)
      case "orders":
        return Number(b.total_orders) - Number(a.total_orders)
      default:
        return 0
    }
  })

  // Prepare chart data
  const topSuppliersData = sortedSuppliers.slice(0, 10).map(s => ({
    name: s.company_name.length > 20 ? s.company_name.substring(0, 20) + "..." : s.company_name,
    rating: Number(s.rating),
    onTime: Number(s.on_time_delivery_rate),
    orders: Number(s.total_orders),
    value: Number(s.total_purchase_value) / 1000, // in thousands
  }))

  const ratingDistribution = [
    { name: "5 Stars", value: suppliers.filter(s => Number(s.rating) >= 4.5).length },
    { name: "4 Stars", value: suppliers.filter(s => Number(s.rating) >= 3.5 && Number(s.rating) < 4.5).length },
    { name: "3 Stars", value: suppliers.filter(s => Number(s.rating) >= 2.5 && Number(s.rating) < 3.5).length },
    { name: "2 Stars", value: suppliers.filter(s => Number(s.rating) >= 1.5 && Number(s.rating) < 2.5).length },
    { name: "1 Star", value: suppliers.filter(s => Number(s.rating) < 1.5).length },
  ].filter(item => item.value > 0)

  const deliveryPerformance = sortedSuppliers.slice(0, 8).map(s => ({
    name: s.company_name.length > 15 ? s.company_name.substring(0, 15) + "..." : s.company_name,
    onTimeRate: Number(s.on_time_delivery_rate),
    totalOrders: Number(s.total_orders),
  }))

  // Radar chart data for top 5 suppliers
  const radarData = sortedSuppliers.slice(0, 5).map(s => ({
    subject: s.company_name.length > 12 ? s.company_name.substring(0, 12) + "..." : s.company_name,
    rating: Number(s.rating) * 20, // Scale to 100
    onTime: Number(s.on_time_delivery_rate),
    volume: Math.min(100, (Number(s.total_orders) / 10) * 10), // Scale orders to 100
  }))

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

  const getDeliveryBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (rate >= 85) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>
  }

  const exportToCSV = () => {
    // Prepare CSV data
    const headers = [
      "Rank",
      "Supplier Code",
      "Company Name",
      "Contact Person",
      "Email",
      "Rating",
      "On-Time Delivery Rate (%)",
      "Total Orders",
      "Completed Orders",
      "Total Purchase Value",
      "Avg Order Value",
      "Status"
    ]

    const rows = sortedSuppliers.map((supplier, index) => [
      index + 1,
      supplier.supplier_code,
      supplier.company_name,
      supplier.contact_person,
      supplier.email,
      Number(supplier.rating).toFixed(2),
      Number(supplier.on_time_delivery_rate).toFixed(2),
      supplier.total_orders,
      supplier.completed_orders,
      Number(supplier.total_purchase_value).toFixed(2),
      Number(supplier.avg_order_value).toFixed(2),
      supplier.status
    ])

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `supplier-performance-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 animate-pulse text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading supplier performance data...</p>
        </div>
      </div>
    )
  }

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
              <BreadcrumbPage>Performance</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Supplier Performance</h1>
            <p className="text-muted-foreground">
              Comprehensive supplier analytics and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/erp/product/suppliers/performance/compare">
                Compare Suppliers
              </a>
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">
                Active supplier base
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgRating.toFixed(2)}/5.0</div>
              <p className="text-xs text-muted-foreground">
                Overall supplier quality
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgOnTimeRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Average delivery performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchase Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics.totalPurchaseValue)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime spend
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Suppliers by Rating */}
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Top Suppliers - Rating vs On-Time Delivery</CardTitle>
              <CardDescription>Performance comparison of top 10 suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSuppliersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" name="Rating (out of 5)" />
                  <Bar dataKey="onTime" fill="#82ca9d" name="On-Time Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>Supplier quality breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delivery Performance Trend */}
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Delivery Performance Analysis</CardTitle>
              <CardDescription>On-time delivery rate and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={deliveryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="onTimeRate"
                    stroke="#8884d8"
                    name="On-Time Rate %"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="#82ca9d"
                    name="Total Orders"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Supplier Performance Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Supplier Performance Radar</CardTitle>
              <CardDescription>Multi-metric comparison of top 5 suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" fontSize={12} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Rating" dataKey="rating" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="On-Time %" dataKey="onTime" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Radar name="Volume" dataKey="volume" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Supplier Performance Details</CardTitle>
                <CardDescription>Comprehensive metrics for all suppliers</CardDescription>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="on_time">On-Time Delivery</SelectItem>
                  <SelectItem value="value">Purchase Value</SelectItem>
                  <SelectItem value="orders">Total Orders</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>On-Time Delivery</TableHead>
                    <TableHead className="text-right">Total Orders</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Purchase Value</TableHead>
                    <TableHead className="text-right">Avg Order Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSuppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertTriangle className="mb-2 h-8 w-8" />
                          <p>No supplier performance data available</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedSuppliers.map((supplier, index) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                          {index === 0 && <Star className="ml-1 inline h-4 w-4 text-yellow-500" />}
                        </TableCell>
                        <TableCell>
                          <a 
                            href={`/erp/product/suppliers/performance/detail?id=${supplier.id}`}
                            className="hover:underline"
                          >
                            <div className="font-medium text-blue-600 hover:text-blue-800">
                              {supplier.company_name}
                            </div>
                            <div className="text-xs text-muted-foreground">{supplier.contact_person}</div>
                          </a>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-xs">{supplier.supplier_code}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getRatingColor(Number(supplier.rating))}`}>
                              {Number(supplier.rating).toFixed(1)}
                            </span>
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {getRatingBadge(Number(supplier.rating))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{Number(supplier.on_time_delivery_rate).toFixed(1)}%</span>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={`h-full ${
                                    Number(supplier.on_time_delivery_rate) >= 95
                                      ? "bg-green-500"
                                      : Number(supplier.on_time_delivery_rate) >= 85
                                      ? "bg-blue-500"
                                      : Number(supplier.on_time_delivery_rate) >= 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${Math.min(100, Number(supplier.on_time_delivery_rate))}%` }}
                                />
                              </div>
                            </div>
                            {getDeliveryBadge(Number(supplier.on_time_delivery_rate))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatNumber(Number(supplier.total_orders))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {formatNumber(Number(supplier.completed_orders))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(supplier.total_purchase_value))}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatCurrency(Number(supplier.avg_order_value))}
                        </TableCell>
                        <TableCell>
                          <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                            {supplier.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.topPerformer}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Highest rated supplier with consistent delivery performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Needs Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.worstPerformer}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Requires attention for quality and delivery improvements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Excellent (4.5+)</span>
                  <span className="font-medium">
                    {suppliers.filter(s => Number(s.rating) >= 4.5).length} suppliers
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Good (3.5-4.5)</span>
                  <span className="font-medium">
                    {suppliers.filter(s => Number(s.rating) >= 3.5 && Number(s.rating) < 4.5).length} suppliers
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Below Average (&lt;3.5)</span>
                  <span className="font-medium">
                    {suppliers.filter(s => Number(s.rating) < 3.5).length} suppliers
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
