'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Label } from '@/registry/new-york-v4/ui/label'
import { Progress } from '@/registry/new-york-v4/ui/progress'
import { SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar'
import { Separator } from '@/registry/new-york-v4/ui/separator'
import { OperationsNav } from '@/components/operations-nav'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/new-york-v4/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/new-york-v4/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/new-york-v4/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/new-york-v4/ui/tabs'
import {
  BarChart3,
  Plus,
  Search,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Target,
  Zap,
  Users,
  Box,
  Factory
} from 'lucide-react'

interface CapacityPlan {
  id: number
  plan_name: string
  plan_code: string
  planning_period: string
  start_date: string
  end_date: string
  status: string
  notes?: string
  resource_count: number
  demand_count: number
  bottleneck_count: number
  total_capacity: number
  total_effective_capacity: number
  total_demand: number
  utilization_rate: number
  created_at: string
}

interface Resource {
  id: number
  capacity_plan_id: number
  resource_type: string
  resource_name: string
  available_capacity: number
  capacity_unit: string
  efficiency_rate: number
  effective_capacity: number
  cost_per_unit: number
  notes?: string
}

interface Demand {
  id: number
  capacity_plan_id: number
  product_name: string
  product_code?: string
  forecasted_demand: number
  demand_unit: string
  priority: string
  required_capacity: number
  notes?: string
}

interface Bottleneck {
  id: number
  capacity_plan_id: number
  resource_name: string
  bottleneck_type: string
  severity: string
  impact_description?: string
  recommended_action?: string
  status: string
  identified_date: string
  resolved_date?: string
}

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
  } else if (statusLower === 'draft') {
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
  } else if (statusLower === 'completed') {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
  } else if (statusLower === 'archived') {
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

const getPriorityBadge = (priority: string) => {
  const priorityLower = priority.toLowerCase()
  if (priorityLower === 'critical') {
    return <Badge variant="destructive">Critical</Badge>
  } else if (priorityLower === 'high') {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
  } else if (priorityLower === 'medium') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
  } else if (priorityLower === 'low') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
  }
  return <Badge variant="secondary">{priority}</Badge>
}

const getSeverityBadge = (severity: string) => {
  const severityLower = severity.toLowerCase()
  if (severityLower === 'critical') {
    return <Badge variant="destructive">Critical</Badge>
  } else if (severityLower === 'high') {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
  } else if (severityLower === 'medium') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
  } else if (severityLower === 'low') {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>
  }
  return <Badge variant="secondary">{severity}</Badge>
}

const getUtilizationColor = (rate: number) => {
  if (rate >= 90) return 'text-red-600'
  if (rate >= 70) return 'text-orange-600'
  if (rate >= 50) return 'text-yellow-600'
  return 'text-green-600'
}

export default function CapacityPlanningPage() {
  const [plans, setPlans] = useState<CapacityPlan[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [demands, setDemands] = useState<Demand[]>([])
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([])
  const [selectedPlan, setSelectedPlan] = useState<CapacityPlan | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<CapacityPlan | null>(null)

  const [formData, setFormData] = useState({
    plan_name: '',
    plan_code: '',
    planning_period: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    status: 'draft',
    notes: ''
  })

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      const res = await fetch('/api/operations/capacity-plans')
      if (res.ok) {
        const data = await res.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error loading capacity plans:', error)
    }
  }

  const loadPlanDetails = async (planId: number) => {
    try {
      const [resourcesRes, demandsRes, bottlenecksRes] = await Promise.all([
        fetch(`/api/operations/resource-capacity?planId=${planId}`),
        fetch(`/api/operations/demand-forecasts?planId=${planId}`),
        fetch(`/api/operations/bottleneck-analysis?planId=${planId}`)
      ])

      if (resourcesRes.ok) setResources(await resourcesRes.json())
      if (demandsRes.ok) setDemands(await demandsRes.json())
      if (bottlenecksRes.ok) setBottlenecks(await bottlenecksRes.json())
    } catch (error) {
      console.error('Error loading plan details:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/operations/capacity-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        await loadPlans()
        setIsDialogOpen(false)
        setFormData({
          plan_name: '',
          plan_code: '',
          planning_period: 'monthly',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          status: 'draft',
          notes: ''
        })
        setEditingPlan(null)
      }
    } catch (error) {
      console.error('Error creating capacity plan:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingPlan) return

    try {
      const res = await fetch('/api/operations/capacity-plans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPlan.id,
          ...formData
        })
      })

      if (res.ok) {
        await loadPlans()
        setIsDialogOpen(false)
        setFormData({
          plan_name: '',
          plan_code: '',
          planning_period: 'monthly',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          status: 'draft',
          notes: ''
        })
        setEditingPlan(null)
      }
    } catch (error) {
      console.error('Error updating capacity plan:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this capacity plan?')) return

    try {
      const res = await fetch(`/api/operations/capacity-plans?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await loadPlans()
      }
    } catch (error) {
      console.error('Error deleting capacity plan:', error)
    }
  }

  const openEditDialog = (plan: CapacityPlan) => {
    setEditingPlan(plan)
    setFormData({
      plan_name: plan.plan_name,
      plan_code: plan.plan_code,
      planning_period: plan.planning_period,
      start_date: plan.start_date,
      end_date: plan.end_date,
      status: plan.status,
      notes: plan.notes || ''
    })
    setIsDialogOpen(true)
  }

  const openDetailDialog = async (plan: CapacityPlan) => {
    setSelectedPlan(plan)
    await loadPlanDetails(plan.id)
    setIsDetailDialogOpen(true)
  }

  const filteredPlans = plans.filter((plan) =>
    plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.plan_code && plan.plan_code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value)
  }

  // Calculate summary statistics
  const totalCapacity = plans.reduce((sum, p) => sum + Number(p.total_effective_capacity || 0), 0)
  const totalDemand = plans.reduce((sum, p) => sum + Number(p.total_demand || 0), 0)
  const avgUtilization = plans.length > 0
    ? plans.reduce((sum, p) => sum + Number(p.utilization_rate || 0), 0) / plans.length
    : 0
  const criticalBottlenecks = plans.reduce((sum, p) => sum + Number(p.bottleneck_count || 0), 0)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Capacity Planning</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Capacity Planning
            </h2>
            <p className="text-muted-foreground mt-1">
              Analyze and optimize production capacity
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPlan(null)
                setFormData({
                  plan_name: '',
                  plan_code: '',
                  planning_period: 'monthly',
                  start_date: new Date().toISOString().split('T')[0],
                  end_date: '',
                  status: 'draft',
                  notes: ''
                })
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New Capacity Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPlan ? 'Edit Capacity Plan' : 'Create New Capacity Plan'}</DialogTitle>
                <DialogDescription>
                  {editingPlan ? 'Update the capacity plan information' : 'Create a new capacity planning analysis'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan_name">Plan Name *</Label>
                    <Input
                      id="plan_name"
                      value={formData.plan_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, plan_name: e.target.value })}
                      placeholder="e.g., Q1 2025 Capacity Plan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plan_code">Plan Code</Label>
                    <Input
                      id="plan_code"
                      value={formData.plan_code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, plan_code: e.target.value })}
                      placeholder="e.g., CP-Q1-2025"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planning_period">Planning Period</Label>
                    <Select
                      value={formData.planning_period}
                      onValueChange={(value) => setFormData({ ...formData, planning_period: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingPlan ? handleUpdate : handleCreate}>
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalCapacity)}</div>
              <p className="text-xs text-muted-foreground">Effective capacity units</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Demand</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalDemand)}</div>
              <p className="text-xs text-muted-foreground">Forecasted demand</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizationColor(avgUtilization)}`}>
                {formatNumber(avgUtilization)}%
              </div>
              <Progress value={avgUtilization} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bottlenecks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{criticalBottlenecks}</div>
              <p className="text-xs text-muted-foreground">Issues identified</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Capacity Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by plan name or code..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Plans Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Resources</TableHead>
                    <TableHead className="text-right">Utilization</TableHead>
                    <TableHead className="text-right">Bottlenecks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No capacity plans found. Create your first plan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPlans.map((plan) => {
                      const utilizationRate = Number(plan.utilization_rate || 0)
                      return (
                        <TableRow key={plan.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{plan.plan_name}</div>
                              {plan.plan_code && (
                                <div className="text-sm text-muted-foreground">{plan.plan_code}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{plan.planning_period}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(plan.status)}</TableCell>
                          <TableCell className="text-right">{plan.resource_count}</TableCell>
                          <TableCell className="text-right">
                            <div className={`font-medium ${getUtilizationColor(utilizationRate)}`}>
                              {formatNumber(utilizationRate)}%
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {plan.bottleneck_count > 0 ? (
                              <Badge variant="destructive">{plan.bottleneck_count}</Badge>
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-green-600 inline" />
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDetailDialog(plan)}
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(plan)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(plan.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed View Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {selectedPlan?.plan_name}
              </DialogTitle>
              <DialogDescription>
                {selectedPlan && (
                  <div className="flex items-center gap-4 mt-2">
                    <span>Code: {selectedPlan.plan_code}</span>
                    <span>•</span>
                    <span>Period: {selectedPlan.planning_period}</span>
                    <span>•</span>
                    <span>{formatDate(selectedPlan.start_date)} - {formatDate(selectedPlan.end_date)}</span>
                    <span>•</span>
                    {getStatusBadge(selectedPlan.status)}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="demand">Demand</TabsTrigger>
                <TabsTrigger value="bottlenecks">Bottlenecks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Capacity vs Demand
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span className="font-bold">{formatNumber(Number(selectedPlan?.total_effective_capacity || 0))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Demand:</span>
                          <span className="font-bold">{formatNumber(Number(selectedPlan?.total_demand || 0))}</span>
                        </div>
                        <Progress
                          value={Math.min(
                            (Number(selectedPlan?.total_demand || 0) / Number(selectedPlan?.total_effective_capacity || 1)) * 100,
                            100
                          )}
                          className="mt-2"
                        />
                        <div className={`text-2xl font-bold text-center ${getUtilizationColor(Number(selectedPlan?.utilization_rate || 0))}`}>
                          {formatNumber(Number(selectedPlan?.utilization_rate || 0))}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Resource Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Resources:</span>
                          <span className="font-bold">{selectedPlan?.resource_count || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Production Lines:</span>
                          <span className="font-bold">{resources.filter(r => r.resource_type === 'production_line').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Workforce:</span>
                          <span className="font-bold">{resources.filter(r => r.resource_type === 'workforce').length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Equipment:</span>
                          <span className="font-bold">{resources.filter(r => r.resource_type === 'equipment').length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Bottlenecks:</span>
                          <span className="font-bold text-orange-600">{bottlenecks.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Critical:</span>
                          <span className="font-bold text-red-600">
                            {bottlenecks.filter(b => b.severity === 'critical').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Resolved:</span>
                          <span className="font-bold text-green-600">
                            {bottlenecks.filter(b => b.status === 'resolved').length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pending:</span>
                          <span className="font-bold">
                            {bottlenecks.filter(b => b.status !== 'resolved').length}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource Type</TableHead>
                        <TableHead>Resource Name</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead className="text-right">Efficiency</TableHead>
                        <TableHead className="text-right">Effective</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No resources defined
                          </TableCell>
                        </TableRow>
                      ) : (
                        resources.map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell className="capitalize">{resource.resource_type.replace('_', ' ')}</TableCell>
                            <TableCell className="font-medium">{resource.resource_name}</TableCell>
                            <TableCell className="text-right">{formatNumber(Number(resource.available_capacity))}</TableCell>
                            <TableCell>{resource.capacity_unit}</TableCell>
                            <TableCell className="text-right">{formatNumber(Number(resource.efficiency_rate))}%</TableCell>
                            <TableCell className="text-right font-bold">{formatNumber(Number(resource.effective_capacity))}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="demand" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Forecast</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Required Capacity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demands.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No demand forecasts defined
                          </TableCell>
                        </TableRow>
                      ) : (
                        demands.map((demand) => (
                          <TableRow key={demand.id}>
                            <TableCell className="font-medium">{demand.product_name}</TableCell>
                            <TableCell>{demand.product_code || '-'}</TableCell>
                            <TableCell className="text-right">{formatNumber(Number(demand.forecasted_demand))}</TableCell>
                            <TableCell>{demand.demand_unit}</TableCell>
                            <TableCell>{getPriorityBadge(demand.priority)}</TableCell>
                            <TableCell className="text-right font-bold">{formatNumber(Number(demand.required_capacity))}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="bottlenecks" className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Resource</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead>Recommended Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bottlenecks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            <CheckCircle2 className="h-8 w-8 mx-auto text-green-600 mb-2" />
                            <div>No bottlenecks identified</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        bottlenecks.map((bottleneck) => (
                          <TableRow key={bottleneck.id}>
                            <TableCell className="font-medium">{bottleneck.resource_name}</TableCell>
                            <TableCell className="capitalize">{bottleneck.bottleneck_type.replace('_', ' ')}</TableCell>
                            <TableCell>{getSeverityBadge(bottleneck.severity)}</TableCell>
                            <TableCell>
                              {bottleneck.status === 'resolved' ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 capitalize">{bottleneck.status}</Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{bottleneck.impact_description || '-'}</TableCell>
                            <TableCell className="max-w-xs truncate">{bottleneck.recommended_action || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
