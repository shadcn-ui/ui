"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Progress } from "@/registry/new-york-v4/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { 
  Play,
  Pause,
  CheckCircle,
  Clock,
  Package,
  AlertTriangle,
  TrendingUp,
  Users,
  Activity
} from "lucide-react"

interface WorkOrder {
  id: number
  work_order_number: string
  product_name: string
  quantity_planned: number
  quantity_produced: number
  status: 'pending' | 'in_progress' | 'completed' | 'paused'
  started_at?: string
  production_line: string
  progress_percentage: number
}

export default function MobileProductionTrackingPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")

  useEffect(() => {
    loadWorkOrders()
    // Refresh every 30 seconds
    const interval = setInterval(loadWorkOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadWorkOrders = async () => {
    try {
      const response = await fetch('/api/mobile/work-orders')
      if (response.ok) {
        const data = await response.json()
        setWorkOrders(data)
      }
    } catch (error) {
      console.error('Error loading work orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (workOrderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/mobile/work-orders/${workOrderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await loadWorkOrders()
      }
    } catch (error) {
      console.error('Error updating work order:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'paused': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const activeOrders = workOrders.filter(wo => wo.status === 'in_progress' || wo.status === 'paused')
  const pendingOrders = workOrders.filter(wo => wo.status === 'pending')
  const completedOrders = workOrders.filter(wo => wo.status === 'completed')

  const stats = {
    activeCount: activeOrders.length,
    pendingCount: pendingOrders.length,
    completedToday: completedOrders.filter(wo => 
      wo.started_at && new Date(wo.started_at).toDateString() === new Date().toDateString()
    ).length,
    avgProgress: activeOrders.length > 0
      ? activeOrders.reduce((sum, wo) => sum + wo.progress_percentage, 0) / activeOrders.length
      : 0
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Mobile-Optimized Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Production Tracking</h1>
        <p className="text-sm text-gray-600">Real-time production floor monitoring</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{stats.activeCount}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.avgProgress.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Orders */}
        <TabsContent value="active" className="space-y-3">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No active production jobs</p>
              </CardContent>
            </Card>
          ) : (
            activeOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <div className={`h-1 ${getStatusColor(order.status)}`} />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{order.work_order_number}</h3>
                        <p className="text-sm text-gray-600">{order.product_name}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Production Progress</span>
                        <span className="font-semibold">{order.progress_percentage}%</span>
                      </div>
                      <Progress value={order.progress_percentage} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{order.quantity_produced} / {order.quantity_planned} units</span>
                        <span>{order.quantity_planned - order.quantity_produced} remaining</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{order.production_line}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {order.started_at 
                            ? new Date(order.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : 'Not started'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {order.status === 'in_progress' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusChange(order.id, 'paused')}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusChange(order.id, 'completed')}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        </>
                      )}
                      {order.status === 'paused' && (
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handleStatusChange(order.id, 'in_progress')}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Resume Production
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Pending Orders */}
        <TabsContent value="pending" className="space-y-3">
          {pendingOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No pending orders</p>
              </CardContent>
            </Card>
          ) : (
            pendingOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.work_order_number}</h3>
                        <p className="text-sm text-gray-600">{order.product_name}</p>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span>{order.quantity_planned} units</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{order.production_line}</span>
                      </div>
                    </div>

                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleStatusChange(order.id, 'in_progress')}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Production
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Completed Orders */}
        <TabsContent value="completed" className="space-y-3">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No completed orders today</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.slice(0, 10).map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{order.work_order_number}</h3>
                      <p className="text-sm text-gray-600">{order.product_name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.quantity_produced} / {order.quantity_planned} units
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-500 mb-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                      {order.started_at && (
                        <p className="text-xs text-gray-400">
                          {new Date(order.started_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
