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
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface SupplierPerformance {
  id: number
  supplier_code: string
  company_name: string
  rating: number
  total_orders: number
  total_purchase_value: number
  avg_order_value: number
  on_time_delivery_rate: number
  payment_completion_rate: number
  avg_lead_time_days: number
  status: string
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']

export default function SupplierComparisonPage() {
  const [suppliers, setSuppliers] = useState<SupplierPerformance[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/suppliers/performance?metrics=comparison')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        setSuppliers(data)
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSupplier = (id: number) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter(s => s !== id))
    } else if (selectedSuppliers.length < 4) {
      setSelectedSuppliers([...selectedSuppliers, id])
    } else {
      alert("You can compare up to 4 suppliers at once")
    }
  }

  const comparedSuppliers = suppliers.filter(s => selectedSuppliers.includes(s.id))

  // Prepare radar chart data
  const radarData = [
    {
      metric: "Rating",
      ...Object.fromEntries(
        comparedSuppliers.map(s => [
          s.company_name,
          Number(s.rating) * 20 // Scale to 100
        ])
      )
    },
    {
      metric: "On-Time",
      ...Object.fromEntries(
        comparedSuppliers.map(s => [
          s.company_name,
          Number(s.on_time_delivery_rate)
        ])
      )
    },
    {
      metric: "Payment",
      ...Object.fromEntries(
        comparedSuppliers.map(s => [
          s.company_name,
          Number(s.payment_completion_rate || 0)
        ])
      )
    },
    {
      metric: "Volume",
      ...Object.fromEntries(
        comparedSuppliers.map(s => [
          s.company_name,
          Math.min(100, (Number(s.total_orders) / 50) * 100) // Scale orders to 100
        ])
      )
    },
    {
      metric: "Lead Time",
      ...Object.fromEntries(
        comparedSuppliers.map(s => [
          s.company_name,
          Math.max(0, 100 - Number(s.avg_lead_time_days || 0) * 2) // Lower is better, scale to 100
        ])
      )
    },
  ]

  // Prepare bar chart data
  const barChartData = comparedSuppliers.map(s => ({
    name: s.company_name.length > 15 ? s.company_name.substring(0, 15) + "..." : s.company_name,
    "Total Orders": Number(s.total_orders),
    "Purchase Value ($K)": Number(s.total_purchase_value) / 1000,
    "Avg Order ($K)": Number(s.avg_order_value) / 1000,
  }))

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

  const getComparisonIcon = (values: number[], index: number) => {
    const value = values[index]
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    if (value === max && max !== min) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (value === min && max !== min) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
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
              <BreadcrumbLink href="/erp/product/suppliers/performance">Performance</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Compare</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/erp/product/suppliers/performance">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Compare Suppliers</h1>
              <p className="text-muted-foreground">
                Select up to 4 suppliers to compare their performance metrics
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {selectedSuppliers.length} / 4 Selected
          </Badge>
        </div>

        {/* Supplier Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Suppliers</CardTitle>
            <CardDescription>Choose suppliers to compare (up to 4)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              {suppliers.map(supplier => (
                <Button
                  key={supplier.id}
                  variant={selectedSuppliers.includes(supplier.id) ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => toggleSupplier(supplier.id)}
                  disabled={selectedSuppliers.length >= 4 && !selectedSuppliers.includes(supplier.id)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{supplier.company_name}</span>
                    <span className="text-xs opacity-70">{supplier.supplier_code}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {comparedSuppliers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No suppliers selected</p>
              <p className="text-sm text-muted-foreground">Select at least one supplier to start comparing</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Visual Comparison Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Metric Comparison</CardTitle>
                  <CardDescription>Normalized performance across key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      {comparedSuppliers.map((supplier, index) => (
                        <Radar
                          key={supplier.id}
                          name={supplier.company_name}
                          dataKey={supplier.company_name}
                          stroke={COLORS[index]}
                          fill={COLORS[index]}
                          fillOpacity={0.6}
                        />
                      ))}
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume & Value Comparison</CardTitle>
                  <CardDescription>Orders and purchase values side-by-side</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total Orders" fill="#8884d8" />
                      <Bar dataKey="Purchase Value ($K)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>Side-by-side metric breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-medium">Metric</th>
                        {comparedSuppliers.map((supplier, index) => (
                          <th key={supplier.id} className="py-3 px-4 text-center font-medium">
                            <div className="flex flex-col items-center">
                              <span className="font-bold">{supplier.company_name}</span>
                              <span className="text-xs text-muted-foreground">{supplier.supplier_code}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Rating */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Rating</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.rating)),
                                index
                              )}
                              <span className={`text-lg font-bold ${getRatingColor(Number(supplier.rating))}`}>
                                {Number(supplier.rating).toFixed(1)}
                              </span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* On-Time Delivery */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">On-Time Delivery Rate</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.on_time_delivery_rate)),
                                index
                              )}
                              <span className="font-semibold">{Number(supplier.on_time_delivery_rate).toFixed(1)}%</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Total Orders */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Total Orders</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.total_orders)),
                                index
                              )}
                              <span className="font-semibold">{Number(supplier.total_orders).toLocaleString()}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Purchase Value */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Total Purchase Value</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.total_purchase_value)),
                                index
                              )}
                              <span className="font-semibold">{formatCurrency(Number(supplier.total_purchase_value))}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Avg Order Value */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Avg Order Value</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.avg_order_value)),
                                index
                              )}
                              <span className="font-semibold">{formatCurrency(Number(supplier.avg_order_value))}</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Lead Time */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Avg Lead Time</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => -Number(s.avg_lead_time_days || 0)), // Negative for lower is better
                                index
                              )}
                              <span className="font-semibold">{Number(supplier.avg_lead_time_days || 0).toFixed(1)} days</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Payment Completion */}
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Payment Completion Rate</td>
                        {comparedSuppliers.map((supplier, index) => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getComparisonIcon(
                                comparedSuppliers.map(s => Number(s.payment_completion_rate || 0)),
                                index
                              )}
                              <span className="font-semibold">{Number(supplier.payment_completion_rate || 0).toFixed(1)}%</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Status */}
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">Status</td>
                        {comparedSuppliers.map(supplier => (
                          <td key={supplier.id} className="py-3 px-4 text-center">
                            <Badge variant={supplier.status === "Active" ? "default" : "secondary"}>
                              {supplier.status}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Winner Analysis */}
            {comparedSuppliers.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Winner Analysis</CardTitle>
                  <CardDescription>Best performer in each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Highest Rating</p>
                      <p className="text-lg font-bold">
                        {comparedSuppliers.reduce((max, s) => Number(s.rating) > Number(max.rating) ? s : max).company_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Best On-Time Delivery</p>
                      <p className="text-lg font-bold">
                        {comparedSuppliers.reduce((max, s) => Number(s.on_time_delivery_rate) > Number(max.on_time_delivery_rate) ? s : max).company_name}
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">Fastest Lead Time</p>
                      <p className="text-lg font-bold">
                        {comparedSuppliers.reduce((min, s) => Number(s.avg_lead_time_days || 999) < Number(min.avg_lead_time_days || 999) ? s : min).company_name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}
