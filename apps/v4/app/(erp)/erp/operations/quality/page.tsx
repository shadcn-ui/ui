'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/new-york-v4/ui/dialog'
import { Label } from '@/registry/new-york-v4/ui/label'
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
import { SidebarTrigger } from '@/registry/new-york-v4/ui/sidebar'
import { Separator } from '@/registry/new-york-v4/ui/separator'
import { OperationsNav } from '@/components/operations-nav'
import { ShieldCheck, Plus, Search, Trash2, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react'
import { WorkflowApprovalCard } from '@/components/workflow/WorkflowApprovalCard'

interface QualityInspection {
  id: number
  inspection_number: string
  work_order_id?: number
  product_name: string
  inspection_date: string
  inspector_name: string
  status: 'pending' | 'in_progress' | 'completed'
  result?: 'pass' | 'fail' | 'conditional'
  pass_quantity?: number
  fail_quantity?: number
  notes?: string
  created_at: string
}

export default function QualityControlPage() {
  const [inspections, setInspections] = useState<QualityInspection[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    product_name: '',
    inspection_date: new Date().toISOString().split('T')[0],
    inspector_name: '',
    pass_quantity: '',
    fail_quantity: '',
    notes: '',
  })

  useEffect(() => {
    fetchInspections()
  }, [])

  const fetchInspections = async () => {
    try {
      const response = await fetch('/api/operations/quality-inspections')
      const data = await response.json()
      setInspections(data.inspections || [])
    } catch (error) {
      console.error('Error fetching inspections:', error)
    }
  }

  const handleCreateInspection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/operations/quality-inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          pass_quantity: formData.pass_quantity ? parseInt(formData.pass_quantity) : 0,
          fail_quantity: formData.fail_quantity ? parseInt(formData.fail_quantity) : 0,
        }),
      })

      if (response.ok) {
        await fetchInspections()
        setIsDialogOpen(false)
        setFormData({
          product_name: '',
          inspection_date: new Date().toISOString().split('T')[0],
          inspector_name: '',
          pass_quantity: '',
          fail_quantity: '',
          notes: '',
        })
      }
    } catch (error) {
      console.error('Error creating inspection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: string, result?: string) => {
    try {
      const response = await fetch(`/api/operations/quality-inspections/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, result }),
      })

      if (response.ok) {
        await fetchInspections()
      }
    } catch (error) {
      console.error('Error updating inspection:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this inspection?')) {
      try {
        const response = await fetch(`/api/operations/quality-inspections/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await fetchInspections()
        }
      } catch (error) {
        console.error('Error deleting inspection:', error)
      }
    }
  }

  const filteredInspections = inspections.filter((inspection) => {
    const matchesSearch = inspection.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspection_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: inspections.length,
    pending: inspections.filter((i) => i.status === 'pending').length,
    inProgress: inspections.filter((i) => i.status === 'in_progress').length,
    completed: inspections.filter((i) => i.status === 'completed').length,
    passed: inspections.filter((i) => i.result === 'pass').length,
    failed: inspections.filter((i) => i.result === 'fail').length,
  }

  const passRate = stats.completed > 0 
    ? ((stats.passed / stats.completed) * 100).toFixed(1) 
    : '0.0'

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      in_progress: { variant: 'default', label: 'In Progress' },
      completed: { variant: 'outline', label: 'Completed' },
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getResultBadge = (result?: string) => {
    if (!result) return <Badge variant="secondary">Not Set</Badge>
    
    const variants: Record<string, { icon: any, className: string, label: string }> = {
      pass: { icon: CheckCircle2, className: 'bg-green-100 text-green-800', label: 'Pass' },
      fail: { icon: XCircle, className: 'bg-red-100 text-red-800', label: 'Fail' },
      conditional: { icon: AlertTriangle, className: 'bg-yellow-100 text-yellow-800', label: 'Conditional' },
    }
    const config = variants[result] || variants.pass
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Quality Control</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Quality Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage quality inspections and test results
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Quality Inspection</DialogTitle>
              <DialogDescription>
                Record a new quality inspection for a product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  placeholder="Enter product name"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspection_date">Inspection Date</Label>
                <Input
                  id="inspection_date"
                  type="date"
                  value={formData.inspection_date}
                  onChange={(e) => setFormData({ ...formData, inspection_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inspector_name">Inspector Name</Label>
                <Input
                  id="inspector_name"
                  placeholder="Enter inspector name"
                  value={formData.inspector_name}
                  onChange={(e) => setFormData({ ...formData, inspector_name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pass_quantity">Pass Quantity</Label>
                  <Input
                    id="pass_quantity"
                    type="number"
                    placeholder="0"
                    value={formData.pass_quantity}
                    onChange={(e) => setFormData({ ...formData, pass_quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fail_quantity">Fail Quantity</Label>
                  <Input
                    id="fail_quantity"
                    type="number"
                    placeholder="0"
                    value={formData.fail_quantity}
                    onChange={(e) => setFormData({ ...formData, fail_quantity: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes (optional)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInspection} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Inspection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{passRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product, inspection number, or inspector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inspections Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Pass/Fail</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInspections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No inspections found. Create your first inspection to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell className="font-medium">{inspection.inspection_number}</TableCell>
                      <TableCell>{inspection.product_name}</TableCell>
                      <TableCell>{inspection.inspector_name}</TableCell>
                      <TableCell>
                        {new Date(inspection.inspection_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-semibold">{inspection.pass_quantity || 0}</span>
                        {' / '}
                        <span className="text-red-600 font-semibold">{inspection.fail_quantity || 0}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(inspection.status)}</TableCell>
                      <TableCell>{getResultBadge(inspection.result)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedInspection(inspection)
                              setIsViewOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {inspection.status === 'completed' && !inspection.result && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600"
                                onClick={() => handleUpdateStatus(inspection.id, 'completed', 'pass')}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600"
                                onClick={() => handleUpdateStatus(inspection.id, 'completed', 'fail')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {inspection.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(inspection.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                          {inspection.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(inspection.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(inspection.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* View Inspection Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Quality Inspection {selectedInspection?.inspection_number}</DialogTitle>
          </DialogHeader>
          {selectedInspection && (
            <div className="space-y-4">
              <WorkflowApprovalCard 
                documentType="quality_inspection" 
                documentId={selectedInspection.id} 
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Product:</span> {selectedInspection.product_name}
                </div>
                <div>
                  <span className="font-semibold">Inspector:</span> {selectedInspection.inspector_name}
                </div>
                <div>
                  <span className="font-semibold">Inspection Date:</span>{" "}
                  {new Date(selectedInspection.inspection_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> {getStatusBadge(selectedInspection.status)}
                </div>
                <div>
                  <span className="font-semibold">Pass Quantity:</span> {selectedInspection.pass_quantity || 0}
                </div>
                <div>
                  <span className="font-semibold">Fail Quantity:</span> {selectedInspection.fail_quantity || 0}
                </div>
                {selectedInspection.result && (
                  <div>
                    <span className="font-semibold">Result:</span> {getResultBadge(selectedInspection.result)}
                  </div>
                )}
                {selectedInspection.notes && (
                  <div className="col-span-2">
                    <span className="font-semibold">Notes:</span> {selectedInspection.notes}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}