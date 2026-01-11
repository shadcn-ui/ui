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
  Factory, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  FileText
} from "lucide-react"

interface WorkOrder {
  id: number
  work_order_number: string
  product_name: string
  quantity: number
  status: string
  priority: string
  start_date: string
  due_date: string
  progress: number
  created_at: string
}

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'completed') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">✓ Completed</Badge>
  } else if (statusLower === 'in_progress') {
    return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">▶ In Progress</Badge>
  } else if (statusLower === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">⏸ Pending</Badge>
  } else if (statusLower === 'cancelled') {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">✕ Cancelled</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

const getPriorityBadge = (priority: string) => {
  const priorityLower = priority.toLowerCase()
  if (priorityLower === 'high') {
    return <Badge variant="destructive">High</Badge>
  } else if (priorityLower === 'medium') {
    return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Medium</Badge>
  }
  return <Badge variant="secondary">Low</Badge>
}

export default function ManufacturingPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    product_id: "",
    quantity_to_produce: "1",
    priority: "normal",
    planned_start_date: new Date().toISOString().split('T')[0],
    planned_end_date: ""
  })

  useEffect(() => {
    loadWorkOrders()
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=1000')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const loadWorkOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/operations/work-orders')
      if (res.ok) {
        const data = await res.json()
        setWorkOrders(data.workOrders || [])
      }
    } catch (error) {
      console.error('Failed to load work orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      // Validate product selection
      if (!formData.product_id) {
        alert('Please select a product')
        return
      }

      const res = await fetch('/api/operations/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: parseInt(formData.product_id),
          quantity_to_produce: parseInt(formData.quantity_to_produce),
          priority: formData.priority,
          planned_start_date: formData.planned_start_date,
          planned_end_date: formData.planned_end_date || null
        })
      })
      
      if (res.ok) {
        const data = await res.json()
        await loadWorkOrders()
        setIsDialogOpen(false)
        setFormData({
          product_id: "",
          quantity_to_produce: "1",
          priority: "normal",
          planned_start_date: new Date().toISOString().split('T')[0],
          planned_end_date: ""
        })
        setSelectedProduct(null)
        
        // Show success message with details
        const hasBom = data.items && data.items.length > 0
        if (hasBom) {
          alert(`✅ Work Order created successfully!\n\nWO Number: ${data.wo_number}\nProduct: ${data.product_name}\nQuantity: ${data.quantity_to_produce}\nMaterials loaded: ${data.items.length} items from BOM`)
        } else {
          alert(`✅ Work Order created successfully!\n\nWO Number: ${data.wo_number}\nProduct: ${data.product_name}\nQuantity: ${data.quantity_to_produce}\n\n⚠️ No BOM found for this product. You'll need to add materials manually.`)
        }
      } else {
        const error = await res.json()
        console.error('Failed to create work order:', error)
        alert(`❌ Failed to create work order:\n\n${error.error || 'Unknown error'}\n\n${error.details || ''}`)
      }
    } catch (error) {
      console.error('Failed to create work order:', error)
      alert('❌ Failed to create work order. Please check your connection and try again.')
    }
  }

  const handleProductChange = async (productId: string) => {
    setFormData({...formData, product_id: productId})
    
    // Find and set selected product
    const product = products.find(p => p.id.toString() === productId)
    setSelectedProduct(product)
    
    // Check if BOM exists for this product
    if (product) {
      try {
        const res = await fetch(`/api/operations/bom?product_code=${product.sku}`)
        if (res.ok) {
          const boms = await res.json()
          const activeBom = boms.find((b: any) => b.status === 'active')
          if (activeBom) {
            console.log('✅ Active BOM found:', activeBom)
          } else {
            console.log('⚠️ No active BOM found for this product')
          }
        }
      } catch (error) {
        console.error('Error checking BOM:', error)
      }
    }
  }

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/operations/work-orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (res.ok) {
        await loadWorkOrders()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this work order?')) return
    
    try {
      const res = await fetch(`/api/operations/work-orders/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await loadWorkOrders()
      }
    } catch (error) {
      console.error('Failed to delete work order:', error)
    }
  }

  const filteredOrders = workOrders.filter(wo => {
    const matchesSearch = wo.work_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || wo.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: workOrders.length,
    inProgress: workOrders.filter(wo => wo.status.toLowerCase() === 'in_progress').length,
    pending: workOrders.filter(wo => wo.status.toLowerCase() === 'pending').length,
    completed: workOrders.filter(wo => wo.status.toLowerCase() === 'completed').length
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Manufacturing</h1>
      </header>

      <OperationsNav />

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Work Orders</h2>
            <p className="text-muted-foreground">
              Manage production work orders and manufacturing processes
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Work Order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Work Order</DialogTitle>
                <DialogDescription>
                  Add a new manufacturing work order to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_id">Product *</Label>
                  <Select value={formData.product_id} onValueChange={handleProductChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product to manufacture" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProduct && (
                    <p className="text-sm text-muted-foreground">
                      📦 SKU: {selectedProduct.sku} | Unit: {selectedProduct.unit_of_measure || 'pcs'}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity_to_produce">Quantity to Produce</Label>
                    <Input
                      id="quantity_to_produce"
                      type="number"
                      value={formData.quantity_to_produce}
                      onChange={(e) => setFormData({...formData, quantity_to_produce: e.target.value})}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planned_start_date">Planned Start Date</Label>
                    <Input
                      id="planned_start_date"
                      type="date"
                      value={formData.planned_start_date}
                      onChange={(e) => setFormData({...formData, planned_start_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planned_end_date">Planned End Date</Label>
                    <Input
                      id="planned_end_date"
                      type="date"
                      value={formData.planned_end_date}
                      onChange={(e) => setFormData({...formData, planned_end_date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create Work Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Play className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search work orders..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Work Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Work Orders List</CardTitle>
            <CardDescription>
              Showing {filteredOrders.length} of {workOrders.length} work orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No work orders found. Create your first work order to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>WO Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((wo) => (
                      <TableRow key={wo.id}>
                        <TableCell className="font-medium">{wo.work_order_number}</TableCell>
                        <TableCell>{wo.product_name}</TableCell>
                        <TableCell className="text-center">{wo.quantity}</TableCell>
                        <TableCell>{getStatusBadge(wo.status)}</TableCell>
                        <TableCell>{getPriorityBadge(wo.priority)}</TableCell>
                        <TableCell>{new Date(wo.start_date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>{wo.due_date ? new Date(wo.due_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {wo.status.toLowerCase() === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(wo.id, 'In Progress')}
                              >
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            {wo.status.toLowerCase() === 'in_progress' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(wo.id, 'Completed')}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(wo.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
