"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { Calendar, Clock, AlertCircle, CheckCircle, Factory, Users, Package } from "lucide-react"

interface ProductionSchedule {
  id: number
  work_order_number: string
  product_name: string
  quantity: number
  start_date: string
  end_date: string
  status: string
  progress: number
  assigned_to: string
  machine: string
  priority: string
}

export default function ProductionPlanningPage() {
  const [schedules, setSchedules] = useState<ProductionSchedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    setSchedules([
      {
        id: 1,
        work_order_number: "WO-2025-156",
        product_name: "Brightening Face Serum with Vitamin C & Niacinamide 30ml",
        quantity: 2500,
        start_date: "2025-12-12",
        end_date: "2025-12-15",
        status: "in_progress",
        progress: 78,
        assigned_to: "Production Line 1",
        machine: "Mixing Tank A",
        priority: "high"
      },
      {
        id: 2,
        work_order_number: "WO-2025-157",
        product_name: "Hydrating Day Cream with SPF 50 PA++++ 50ml",
        quantity: 1800,
        start_date: "2025-12-14",
        end_date: "2025-12-17",
        status: "in_progress",
        progress: 35,
        assigned_to: "Production Line 2",
        machine: "Mixing Tank B",
        priority: "high"
      },
      {
        id: 3,
        work_order_number: "WO-2025-158",
        product_name: "Anti-Aging Night Cream with Retinol 0.5% 40ml",
        quantity: 1200,
        start_date: "2025-12-15",
        end_date: "2025-12-18",
        status: "scheduled",
        progress: 0,
        assigned_to: "Production Line 1",
        machine: "Mixing Tank A",
        priority: "medium"
      },
      {
        id: 4,
        work_order_number: "WO-2025-159",
        product_name: "Acne Treatment Spot Gel with Salicylic Acid 15ml",
        quantity: 3000,
        start_date: "2025-12-16",
        end_date: "2025-12-19",
        status: "scheduled",
        progress: 0,
        assigned_to: "Production Line 3",
        machine: "Filling Line 1",
        priority: "high"
      },
      {
        id: 5,
        work_order_number: "WO-2025-160",
        product_name: "Gentle Foaming Cleanser with Green Tea Extract 100ml",
        quantity: 2200,
        start_date: "2025-12-17",
        end_date: "2025-12-20",
        status: "scheduled",
        progress: 0,
        assigned_to: "Production Line 2",
        machine: "Mixing Tank B",
        priority: "medium"
      }
    ])
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      in_progress: "default",
      scheduled: "secondary",
      completed: "outline",
      delayed: "destructive"
    }
    return <Badge variant={variants[status] || "secondary"}>{status.replace("_", " ")}</Badge>
  }

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      low: "text-green-600 bg-green-50 border-green-200"
    }
    return colors[priority] || ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading production schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      {/* Header */}
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
              <BreadcrumbLink href="/erp/operations">Operations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Production Planning</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button>
            <Package className="h-4 w-4 mr-2" />
            New Work Order
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Work Orders</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 in progress, 2 scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">3 of 4 lines active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-green-600">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delayed Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All on schedule</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Planning</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders Schedule</CardTitle>
              <CardDescription>Current and upcoming production work orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`p-4 border-2 rounded-lg ${getPriorityColor(schedule.priority)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{schedule.work_order_number}</h4>
                        <p className="text-sm text-gray-600">{schedule.product_name}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(schedule.status)}
                        <p className="text-xs text-gray-600 mt-1 uppercase">{schedule.priority} priority</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Quantity</p>
                        <p className="font-semibold">{schedule.quantity.toLocaleString()} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Start Date</p>
                        <p className="font-semibold">{new Date(schedule.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">End Date</p>
                        <p className="font-semibold">{new Date(schedule.end_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Progress</p>
                        <p className="font-semibold">{schedule.progress}%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Factory className="h-4 w-4" />
                        {schedule.machine}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {schedule.assigned_to}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${schedule.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity">
          <Card>
            <CardHeader>
              <CardTitle>Production Capacity Analysis</CardTitle>
              <CardDescription>Machine and resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Mixing Tank A</span>
                    <span className="text-sm text-gray-600">85% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Mixing Tank B</span>
                    <span className="text-sm text-gray-600">60% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Filling Line 1</span>
                    <span className="text-sm text-gray-600">92% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-600 h-3 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Filling Line 2</span>
                    <span className="text-sm text-gray-600">45% Utilized</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Production team and equipment assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Production Line 1</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Team Size</p>
                      <p className="font-semibold">5 operators</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Shift</p>
                      <p className="font-semibold">Day (07:00 - 15:00)</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-semibold text-green-600">96.8%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current WO</p>
                      <p className="font-semibold">WO-2025-001</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Production Line 2</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Team Size</p>
                      <p className="font-semibold">4 operators</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Shift</p>
                      <p className="font-semibold">Night (15:00 - 23:00)</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Efficiency</p>
                      <p className="font-semibold text-green-600">94.2%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current WO</p>
                      <p className="font-semibold">-</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
