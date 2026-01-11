'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Label } from '@/registry/new-york-v4/ui/label'
import { Textarea } from '@/registry/new-york-v4/ui/textarea'
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
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Package,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Eye
} from 'lucide-react'

interface PurchaseOrder {
  id: number
  po_number: string
  supplier_id: number
  supplier_name: string
  supplier_code: string
  order_date: string
  expected_delivery_date: string
  actual_delivery_date?: string
  status: string
  currency: string
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_terms: string
  payment_status: string
  shipping_method?: string
  tracking_number?: string
  notes?: string
  item_count: number
}

interface PurchaseOrderItem {
  id: number
  purchase_order_id: number
  product_id: number
  product_name: string
  sku: string
  unit: string
  quantity_ordered: number
  quantity_received: number
  quantity_pending: number
  unit_price: number
  discount_percent: number
  discount_amount: number
  tax_percent: number
  tax_amount: number
  notes?: string
}

interface Supplier {
  id: number
  supplier_code: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  payment_terms: string
  status: string
}

interface Product {
  id: number
  sku: string
  product_name: string
  unit: string
  unit_price: number
  status: string
}

export default function ProcurementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [poItems, setPOItems] = useState<PurchaseOrderItem[]>([])
  
  // Form states
  const [formData, setFormData] = useState({
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    status: 'Draft',
    payment_terms: 'Net 30',
    shipping_method: '',
    shipping_address: '',
    notes: '',
  })

  const [itemFormData, setItemFormData] = useState({
    product_id: '',
    quantity_ordered: '',
    unit_price: '',
    tax_percent: '11',
    notes: '',
  })

  useEffect(() => {
    fetchPurchaseOrders()
    fetchSuppliers()
    fetchProducts()
  }, [])

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch('/api/operations/purchase-orders')
      const data = await response.json()
      setPurchaseOrders(data)
    } catch (error) {
      console.error('Error fetching purchase orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/operations/suppliers')
      const data = await response.json()
      // Handle both array and object responses
      setSuppliers(Array.isArray(data) ? data : (data.suppliers || []))
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setSuppliers([])
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      // Handle response that has products property
      setProducts(data.products || data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    }
  }

  const fetchPOItems = async (poId: number) => {
    try {
      const response = await fetch(`/api/operations/purchase-order-items?po_id=${poId}`)
      const data = await response.json()
      setPOItems(data)
    } catch (error) {
      console.error('Error fetching PO items:', error)
    }
  }

  const handleCreatePO = async () => {
    try {
      const response = await fetch('/api/operations/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, currency: 'IDR' }),
      })
      
      if (response.ok) {
        setIsCreateDialogOpen(false)
        fetchPurchaseOrders()
        resetForm()
      }
    } catch (error) {
      console.error('Error creating purchase order:', error)
    }
  }

  const handleUpdatePO = async () => {
    if (!selectedPO) return
    
    try {
      const response = await fetch('/api/operations/purchase-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedPO.id, ...formData }),
      })
      
      if (response.ok) {
        setIsEditDialogOpen(false)
        fetchPurchaseOrders()
        setSelectedPO(null)
      }
    } catch (error) {
      console.error('Error updating purchase order:', error)
    }
  }

  const handleDeletePO = async (id: number) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) return
    
    try {
      const response = await fetch(`/api/operations/purchase-orders?id=${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchPurchaseOrders()
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error)
    }
  }

  const handleAddItem = async () => {
    if (!selectedPO) return
    
    try {
      const response = await fetch('/api/operations/purchase-order-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchase_order_id: selectedPO.id,
          ...itemFormData,
        }),
      })
      
      if (response.ok) {
        fetchPOItems(selectedPO.id)
        fetchPurchaseOrders()
        resetItemForm()
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedPO) return
    
    try {
      const response = await fetch(`/api/operations/purchase-order-items?id=${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchPOItems(selectedPO.id)
        fetchPurchaseOrders()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      supplier_id: '',
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: '',
      status: 'Draft',
      payment_terms: 'Net 30',
      shipping_method: '',
      shipping_address: '',
      notes: '',
    })
  }

  const resetItemForm = () => {
    setItemFormData({
      product_id: '',
      quantity_ordered: '',
      unit_price: '',
      tax_percent: '11',
      notes: '',
    })
  }

  const openEditDialog = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setFormData({
      supplier_id: po.supplier_id.toString(),
      order_date: po.order_date,
      expected_delivery_date: po.expected_delivery_date || '',
      status: po.status,
      payment_terms: po.payment_terms,
      shipping_method: po.shipping_method || '',
      shipping_address: '',
      notes: po.notes || '',
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (po: PurchaseOrder) => {
    setSelectedPO(po)
    fetchPOItems(po.id)
    setIsViewDialogOpen(true)
  }

  const openItemsDialog = (po: PurchaseOrder) => {
    setSelectedPO(po)
    fetchPOItems(po.id)
    setIsItemsDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      'Draft': { variant: 'secondary', icon: Clock },
      'Pending Approval': { variant: 'outline', icon: Clock },
      'Approved': { variant: 'default', icon: CheckCircle2 },
      'Sent': { variant: 'default', icon: Package },
      'Partially Received': { variant: 'outline', icon: TrendingUp },
      'Received': { variant: 'default', icon: CheckCircle2 },
      'Cancelled': { variant: 'destructive', icon: XCircle },
      'Closed': { variant: 'secondary', icon: CheckCircle2 },
    }
    
    const config = variants[status] || { variant: 'secondary', icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant as any} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Filter purchase orders
  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = 
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistics
  const stats = {
    totalPOs: purchaseOrders.length,
    draftPOs: purchaseOrders.filter(po => po.status === 'Draft').length,
    approvedPOs: purchaseOrders.filter(po => po.status === 'Approved' || po.status === 'Sent').length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + Number(po.total_amount), 0),
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Procurement</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-primary" />
              Procurement Management
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage purchase orders and procurement process
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Order</DialogTitle>
                <DialogDescription>
                  Create a new purchase order for procurement
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier *</Label>
                    <Select 
                      value={formData.supplier_id} 
                      onValueChange={(value) => setFormData({...formData, supplier_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.company_name} ({supplier.supplier_code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Order Date *</Label>
                    <Input
                      type="date"
                      value={formData.order_date}
                      onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Delivery</Label>
                    <Input
                      type="date"
                      value={formData.expected_delivery_date}
                      onChange={(e) => setFormData({...formData, expected_delivery_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select 
                      value={formData.payment_terms} 
                      onValueChange={(value) => setFormData({...formData, payment_terms: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 45">Net 45</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="COD">Cash on Delivery</SelectItem>
                        <SelectItem value="Advance">Advance Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping Method</Label>
                    <Input
                      placeholder="e.g., Express Delivery"
                      value={formData.shipping_method}
                      onChange={(e) => setFormData({...formData, shipping_method: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePO}>Create Purchase Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total POs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPOs}</div>
              <p className="text-xs text-muted-foreground">All purchase orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft POs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draftPOs}</div>
              <p className="text-xs text-muted-foreground">Pending submission</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active POs</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedPOs}</div>
              <p className="text-xs text-muted-foreground">Approved & sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
              <p className="text-xs text-muted-foreground">All POs combined</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Purchase Orders</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search PO..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No purchase orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.po_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{po.supplier_name}</div>
                          <div className="text-sm text-muted-foreground">{po.supplier_code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(po.order_date)}</TableCell>
                      <TableCell>
                        {po.expected_delivery_date ? formatDate(po.expected_delivery_date) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openItemsDialog(po)}
                        >
                          <Package className="h-4 w-4 mr-1" />
                          {po.item_count} items
                        </Button>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(po.total_amount))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(po)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(po)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {(po.status === 'Draft' || po.status === 'Cancelled') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePO(po.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit PO Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Purchase Order</DialogTitle>
              <DialogDescription>
                Update purchase order details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expected Delivery</Label>
                  <Input
                    type="date"
                    value={formData.expected_delivery_date}
                    onChange={(e) => setFormData({...formData, expected_delivery_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipping Method</Label>
                <Input
                  value={formData.shipping_method}
                  onChange={(e) => setFormData({...formData, shipping_method: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePO}>Update Purchase Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View PO Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Purchase Order Details</DialogTitle>
              <DialogDescription>
                {selectedPO?.po_number}
              </DialogDescription>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Supplier</Label>
                    <p className="font-medium">{selectedPO.supplier_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedPO.status)}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Order Date</Label>
                    <p>{formatDate(selectedPO.order_date)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Expected Delivery</Label>
                    <p>{selectedPO.expected_delivery_date ? formatDate(selectedPO.expected_delivery_date) : '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Terms</Label>
                    <p>{selectedPO.payment_terms}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Payment Status</Label>
                    <p>{selectedPO.payment_status}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty Ordered</TableHead>
                        <TableHead className="text-right">Qty Received</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Tax</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product_name}</div>
                              <div className="text-sm text-muted-foreground">{item.sku}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{item.quantity_ordered} {item.unit}</TableCell>
                          <TableCell className="text-right">{item.quantity_received} {item.unit}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(item.unit_price))}</TableCell>
                          <TableCell className="text-right">{item.tax_percent}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(Number(selectedPO.subtotal))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">{formatCurrency(Number(selectedPO.tax_amount))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">{formatCurrency(Number(selectedPO.total_amount))}</span>
                  </div>
                </div>

                {selectedPO.notes && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground">Notes</Label>
                      <p className="mt-1">{selectedPO.notes}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Manage Items Dialog */}
        <Dialog open={isItemsDialogOpen} onOpenChange={setIsItemsDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Purchase Order Items</DialogTitle>
              <DialogDescription>
                {selectedPO?.po_number} - {selectedPO?.supplier_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Add Item Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add New Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-2">
                      <Select 
                        value={itemFormData.product_id} 
                        onValueChange={(value) => {
                          const product = products.find(p => p.id === parseInt(value))
                          setItemFormData({
                            ...itemFormData, 
                            product_id: value,
                            unit_price: product?.unit_price?.toString() || ''
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.status === 'Active').map(product => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.product_name} ({product.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={itemFormData.quantity_ordered}
                      onChange={(e) => setItemFormData({...itemFormData, quantity_ordered: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Unit Price"
                      value={itemFormData.unit_price}
                      onChange={(e) => setItemFormData({...itemFormData, unit_price: e.target.value})}
                    />
                    <Button onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Ordered</TableHead>
                    <TableHead className="text-right">Received</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {poItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No items added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    poItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-sm text-muted-foreground">{item.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity_ordered} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.quantity_received} {item.unit}</TableCell>
                        <TableCell className="text-right">{item.quantity_pending} {item.unit}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Number(item.unit_price))}</TableCell>
                        <TableCell className="text-right">{item.tax_percent}%</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
