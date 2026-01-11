'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/new-york-v4/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Target,
  Package,
  Percent,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'

interface KPIs {
  total_revenue_all_time?: number | string
  total_orders?: number | string
  avg_order_value?: number | string
  total_customers?: number | string
  lead_to_order_conversion_rate?: number | string
  orders_this_month?: number | string
  revenue_this_month?: number | string
  new_customers_this_month?: number | string
}

interface StatusData {
  status: string
  count: number | string
  total_amount: number | string
}

interface CustomerPerformance {
  customer_id: number
  customer_name: string
  total_orders: number | string
  total_revenue: number | string
  avg_order_value: number | string
}

interface MonthlyTrend {
  month: string
  revenue: number | string
  orders: number | string
}

interface FunnelData {
  stage: string
  count: number | string
  conversion_rate?: number | string
}

interface PipelineData {
  stage: string
  count: number | string
  total_value: number | string
  avg_probability: number | string
}

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<KPIs>({})
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [paymentData, setPaymentData] = useState<StatusData[]>([])
  const [topCustomers, setTopCustomers] = useState<CustomerPerformance[]>([])
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([])
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [pipelineData, setPipelineData] = useState<PipelineData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch KPIs
      const kpisRes = await fetch('/api/analytics?type=kpis')
      if (kpisRes.ok) {
        const data = await kpisRes.json()
        setKpis(data.kpis || {})
      }

      // Fetch status breakdown
      const statusRes = await fetch('/api/analytics?type=status')
      if (statusRes.ok) {
        const data = await statusRes.json()
        setStatusData(data.data || [])
      }

      // Fetch payment status
      const paymentRes = await fetch('/api/analytics?type=payment')
      if (paymentRes.ok) {
        const data = await paymentRes.json()
        setPaymentData(data.data || [])
      }

      // Fetch top customers
      const customersRes = await fetch('/api/analytics?type=top-customers')
      if (customersRes.ok) {
        const data = await customersRes.json()
        setTopCustomers(data.data || [])
      }

      // Fetch monthly trends
      const trendsRes = await fetch('/api/analytics?type=monthly')
      if (trendsRes.ok) {
        const data = await trendsRes.json()
        setMonthlyTrends(data.data || [])
      }

      // Fetch funnel
      const funnelRes = await fetch('/api/analytics?type=funnel')
      if (funnelRes.ok) {
        const data = await funnelRes.json()
        setFunnelData(data.data || [])
      }

      // Fetch pipeline
      const pipelineRes = await fetch('/api/analytics?type=pipeline')
      if (pipelineRes.ok) {
        const data = await pipelineRes.json()
        setPipelineData(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount?: number | string) => {
    if (!amount) return 'Rp0'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return 'Rp0'
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(num)
  }

  const formatPercent = (value?: number | string) => {
    if (!value) return '0%'
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '0%'
    return `${num.toFixed(1)}%`
  }

  const toNumber = (value?: number | string): number => {
    if (!value) return 0
    const num = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(num) ? 0 : num
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Analytics</h1>
        <p className="text-muted-foreground">Overview of your sales performance and metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.total_revenue_all_time)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Total Orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_orders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Avg Order Value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.avg_order_value)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total_customers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Conversion Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(kpis.lead_to_order_conversion_rate)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="customers">
            <Users className="mr-2 h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="pipeline">
            <Target className="mr-2 h-4 w-4" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Orders by Status */}
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
                <CardDescription>Breakdown of orders by current status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {statusData.map((item) => (
                  <div key={item.status} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.status}</Badge>
                      <span className="text-sm text-muted-foreground">{item.count} orders</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.total_amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Orders by Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Breakdown of orders by payment status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {paymentData.map((item) => (
                  <div key={item.status} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.status}</Badge>
                      <span className="text-sm text-muted-foreground">{item.count} orders</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(item.total_amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Lead Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Conversion Funnel</CardTitle>
              <CardDescription>Track leads through the sales pipeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelData.map((stage, idx) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stage.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{stage.count}</span>
                        {stage.conversion_rate !== undefined && (
                          <Badge variant="secondary">{formatPercent(stage.conversion_rate)}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-8 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-2"
                        style={{ width: `${Math.min(100, (toNumber(stage.count) / (toNumber(funnelData[0]?.count) || 1)) * 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {Math.round((toNumber(stage.count) / (toNumber(funnelData[0]?.count) || 1)) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers by Revenue</CardTitle>
              <CardDescription>Your highest value customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {topCustomers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No customer data available</p>
                ) : (
                  topCustomers.map((customer, idx) => (
                    <div key={customer.customer_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-medium">{customer.customer_name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">
                            {customer.total_orders} orders • Avg: {formatCurrency(customer.avg_order_value)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(customer.total_revenue)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Pipeline</CardTitle>
              <CardDescription>Active opportunities by stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipelineData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No pipeline data available</p>
                ) : (
                  pipelineData.map((stage) => (
                    <div key={stage.stage} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{stage.count} opportunities</span>
                          <Badge variant="secondary">{formatPercent(stage.avg_probability)}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-end px-2"
                            style={{ width: `${Math.min(100, (toNumber(stage.total_value) / (toNumber(pipelineData[0]?.total_value) || 1)) * 100)}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {formatCurrency(stage.total_value)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Trends</CardTitle>
              <CardDescription>Revenue and order trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthlyTrends.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No trend data available</p>
                ) : (
                  monthlyTrends.map((month) => (
                    <div key={month.month} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-sm text-muted-foreground">{month.orders} orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{formatCurrency(month.revenue)}</span>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
