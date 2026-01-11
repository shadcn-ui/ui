'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Badge } from '@/registry/new-york-v4/ui/badge'
import { Input } from '@/registry/new-york-v4/ui/input'
import { Label } from '@/registry/new-york-v4/ui/label'
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
  DialogTrigger 
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
import { FileText, Plus, Search, Edit, Trash2, List, DollarSign } from 'lucide-react'

interface BOM {
  id: number
  product_name: string
  product_code?: string
  version: string
  status: string
  notes?: string
  total_cost: number
  item_count: number
  calculated_total_cost: number
  created_at: string
  updated_at: string
}

interface BOMItem {
  id: number
  bom_id: number
  component_name: string
  component_code?: string
  quantity: number
  unit: string
  unit_cost: number
  total_cost: number
  notes?: string
  created_at: string
}

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'active') {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
  } else if (statusLower === 'draft') {
    return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
  } else if (statusLower === 'obsolete') {
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Obsolete</Badge>
  }
  return <Badge variant="secondary">{status}</Badge>
}

export default function BillOfMaterialsPage() {
  const [boms, setBoms] = useState<BOM[]>([])
  const [bomItems, setBomItems] = useState<BOMItem[]>([])
  const [selectedBom, setSelectedBom] = useState<BOM | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingBom, setEditingBom] = useState<BOM | null>(null)
  const [editingItem, setEditingItem] = useState<BOMItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    product_name: '',
    product_code: '',
    version: '1.0',
    status: 'draft',
    notes: ''
  })

  const [itemFormData, setItemFormData] = useState({
    component_name: '',
    component_code: '',
    quantity: '1',
    unit: 'pcs',
    unit_cost: '0',
    notes: ''
  })

  useEffect(() => {
    loadBOMs()
  }, [])

  const loadBOMs = async () => {
    try {
      const res = await fetch('/api/operations/bom')
      if (res.ok) {
        const data = await res.json()
        setBoms(data)
      }
    } catch (error) {
      console.error('Error loading BOMs:', error)
    }
  }

  const loadBOMItems = async (bomId: number) => {
    try {
      const res = await fetch(`/api/operations/bom-items?bomId=${bomId}`)
      if (res.ok) {
        const data = await res.json()
        setBomItems(data)
      }
    } catch (error) {
      console.error('Error loading BOM items:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/operations/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        await loadBOMs()
        setIsDialogOpen(false)
        setFormData({
          product_name: '',
          product_code: '',
          version: '1.0',
          status: 'draft',
          notes: ''
        })
        setEditingBom(null)
      }
    } catch (error) {
      console.error('Error creating BOM:', error)
    }
  }

  const handleUpdate = async () => {
    if (!editingBom) return

    try {
      const res = await fetch('/api/operations/bom', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBom.id,
          ...formData
        })
      })
      
      if (res.ok) {
        await loadBOMs()
        setIsDialogOpen(false)
        setFormData({
          product_name: '',
          product_code: '',
          version: '1.0',
          status: 'draft',
          notes: ''
        })
        setEditingBom(null)
      }
    } catch (error) {
      console.error('Error updating BOM:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this BOM? All associated items will be deleted.')) return

    try {
      const res = await fetch(`/api/operations/bom?id=${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        await loadBOMs()
      }
    } catch (error) {
      console.error('Error deleting BOM:', error)
    }
  }

  const handleCreateItem = async () => {
    if (!selectedBom) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/operations/bom-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bom_id: selectedBom.id,
          ...itemFormData
        })
      })
      
      if (res.ok) {
        // Reset form immediately
        setItemFormData({
          component_name: '',
          component_code: '',
          quantity: '1',
          unit: 'pcs',
          unit_cost: '0',
          notes: ''
        })
        setEditingItem(null)
        
        // Close the component dialog
        setIsItemDialogOpen(false)
        
        // Reload items in the background to show the new component
        const itemsPromise = loadBOMItems(selectedBom.id)
        
        // Refresh BOMs to update total cost
        const bomsPromise = loadBOMs()
        
        // Wait for both to complete
        await Promise.all([itemsPromise, bomsPromise])
        
        // Update selectedBom with fresh data
        const updatedBoms = await fetch('/api/operations/bom').then(r => r.json())
        const updatedBom = updatedBoms.find((b: BOM) => b.id === selectedBom.id)
        if (updatedBom) {
          setSelectedBom(updatedBom)
        }
      }
    } catch (error) {
      console.error('Error creating BOM item:', error)
      alert('Failed to add component. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateItem = async () => {
    if (!editingItem || !selectedBom) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/operations/bom-items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          bom_id: selectedBom.id,
          ...itemFormData
        })
      })
      
      if (res.ok) {
        // Reset form immediately
        setItemFormData({
          component_name: '',
          component_code: '',
          quantity: '1',
          unit: 'pcs',
          unit_cost: '0',
          notes: ''
        })
        setEditingItem(null)
        
        // Close the component dialog
        setIsItemDialogOpen(false)
        
        // Reload items in the background to show the updated component
        const itemsPromise = loadBOMItems(selectedBom.id)
        
        // Refresh BOMs to update total cost
        const bomsPromise = loadBOMs()
        
        // Wait for both to complete
        await Promise.all([itemsPromise, bomsPromise])
        
        // Update selectedBom with fresh data
        const updatedBoms = await fetch('/api/operations/bom').then(r => r.json())
        const updatedBom = updatedBoms.find((b: BOM) => b.id === selectedBom.id)
        if (updatedBom) {
          setSelectedBom(updatedBom)
        }
      }
    } catch (error) {
      console.error('Error updating BOM item:', error)
      alert('Failed to update component. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedBom || !confirm('Are you sure you want to delete this component?')) return

    try {
      const res = await fetch(`/api/operations/bom-items?id=${itemId}&bomId=${selectedBom.id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        // Reload items to remove the deleted component from view
        await loadBOMItems(selectedBom.id)
        
        // Refresh BOMs to update total cost
        await loadBOMs()
        
        // Update selectedBom with fresh data
        const updatedBoms = await fetch('/api/operations/bom').then(r => r.json())
        const updatedBom = updatedBoms.find((b: BOM) => b.id === selectedBom.id)
        if (updatedBom) {
          setSelectedBom(updatedBom)
        }
      }
    } catch (error) {
      console.error('Error deleting BOM item:', error)
    }
  }

  const openEditDialog = (bom: BOM) => {
    setEditingBom(bom)
    setFormData({
      product_name: bom.product_name,
      product_code: bom.product_code || '',
      version: bom.version,
      status: bom.status,
      notes: bom.notes || ''
    })
    setIsDialogOpen(true)
  }

  const openItemEditDialog = (item: BOMItem) => {
    setEditingItem(item)
    setItemFormData({
      component_name: item.component_name,
      component_code: item.component_code || '',
      quantity: item.quantity.toString(),
      unit: item.unit,
      unit_cost: item.unit_cost.toString(),
      notes: item.notes || ''
    })
    setIsItemDialogOpen(true)
  }

  const openViewDialog = async (bom: BOM) => {
    setSelectedBom(bom)
    await loadBOMItems(bom.id)
    setIsViewDialogOpen(true)
  }

  const filteredBOMs = boms.filter((bom) =>
    bom.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bom.product_code && bom.product_code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Bill of Materials</h1>
      </header>

      <OperationsNav />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-primary" />
              Bill of Materials (BOM)
            </h2>
            <p className="text-muted-foreground mt-1">
              Manage product components and materials list
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingBom(null)
                setFormData({
                  product_name: '',
                  product_code: '',
                  version: '1.0',
                  status: 'draft',
                  notes: ''
                })
              }}>
                <Plus className="h-4 w-4 mr-2" />
                New BOM
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBom ? 'Edit BOM' : 'Create New BOM'}</DialogTitle>
                <DialogDescription>
                  {editingBom ? 'Update the bill of materials information' : 'Add a new bill of materials to the system'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name *</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="e.g., Office Chair Model X"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_code">Product Code</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, product_code: e.target.value })}
                      placeholder="e.g., PROD-001"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setFormData({ ...formData, version: e.target.value })}
                      placeholder="e.g., 1.0"
                    />
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
                        <SelectItem value="obsolete">Obsolete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                <Button onClick={editingBom ? handleUpdate : handleCreate}>
                  {editingBom ? 'Update' : 'Create'} BOM
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total BOMs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{boms.length}</div>
              <p className="text-xs text-muted-foreground">Product bill of materials</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active BOMs</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {boms.filter(b => b.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(boms.reduce((sum, b) => sum + Number(b.calculated_total_cost || 0), 0))}
              </div>
              <p className="text-xs text-muted-foreground">Sum of all BOM costs</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>BOM List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or code..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* BOM Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Components</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBOMs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No BOMs found. Create your first bill of materials.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBOMs.map((bom) => (
                      <TableRow key={bom.id}>
                        <TableCell className="font-medium">{bom.product_name}</TableCell>
                        <TableCell>{bom.product_code || '-'}</TableCell>
                        <TableCell>{bom.version}</TableCell>
                        <TableCell>{getStatusBadge(bom.status)}</TableCell>
                        <TableCell className="text-right">{bom.item_count}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(bom.calculated_total_cost || 0))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(bom)}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(bom)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(bom.id)}
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

        {/* View BOM Items Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedBom?.product_name} - Components
              </DialogTitle>
              <DialogDescription>
                Version {selectedBom?.version} | {getStatusBadge(selectedBom?.status || '')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Component List</h4>
                <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => {
                      setEditingItem(null)
                      setItemFormData({
                        component_name: '',
                        component_code: '',
                        quantity: '1',
                        unit: 'pcs',
                        unit_cost: '0',
                        notes: ''
                      })
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Component
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem ? 'Edit Component' : 'Add Component'}</DialogTitle>
                      <DialogDescription>
                        {editingItem ? 'Update component details' : 'Add a new component to this BOM'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="component_name">Component Name *</Label>
                          <Input
                            id="component_name"
                            value={itemFormData.component_name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setItemFormData({ ...itemFormData, component_name: e.target.value })}
                            placeholder="e.g., Steel Frame"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="component_code">Component Code</Label>
                          <Input
                            id="component_code"
                            value={itemFormData.component_code}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setItemFormData({ ...itemFormData, component_code: e.target.value })}
                            placeholder="e.g., COMP-001"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity *</Label>
                          <Input
                            id="quantity"
                            type="number"
                            step="0.001"
                            value={itemFormData.quantity}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setItemFormData({ ...itemFormData, quantity: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit">Unit</Label>
                          <Select
                            value={itemFormData.unit}
                            onValueChange={(value) => setItemFormData({ ...itemFormData, unit: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pcs">Pieces</SelectItem>
                              <SelectItem value="kg">Kilogram</SelectItem>
                              <SelectItem value="m">Meter</SelectItem>
                              <SelectItem value="m2">Square Meter</SelectItem>
                              <SelectItem value="l">Liter</SelectItem>
                              <SelectItem value="box">Box</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unit_cost">Unit Cost (IDR)</Label>
                          <Input
                            id="unit_cost"
                            type="number"
                            step="0.01"
                            value={itemFormData.unit_cost}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setItemFormData({ ...itemFormData, unit_cost: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="item_notes">Notes</Label>
                        <Input
                          id="item_notes"
                          value={itemFormData.notes}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            setItemFormData({ ...itemFormData, notes: e.target.value })}
                          placeholder="Additional notes"
                        />
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <div className="text-sm font-medium">Total Cost</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(Number(itemFormData.quantity || 0) * Number(itemFormData.unit_cost || 0))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsItemDialogOpen(false)} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={editingItem ? handleUpdateItem : handleCreateItem} disabled={isSaving}>
                        {isSaving ? 'Saving...' : editingItem ? 'Update' : 'Add'} {isSaving ? '' : 'Component'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No components added yet. Add your first component.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bomItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.component_name}</TableCell>
                          <TableCell>{item.component_code || '-'}</TableCell>
                          <TableCell className="text-right">{Number(item.quantity).toFixed(3)}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right">{formatCurrency(Number(item.unit_cost))}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Number(item.total_cost))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openItemEditDialog(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
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

              {bomItems.length > 0 && (
                <div className="flex justify-end">
                  <div className="bg-primary/10 p-4 rounded-md">
                    <div className="text-sm font-medium">Total BOM Cost</div>
                    <div className="text-3xl font-bold text-primary">
                      {formatCurrency(bomItems.reduce((sum, item) => sum + Number(item.total_cost), 0))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
