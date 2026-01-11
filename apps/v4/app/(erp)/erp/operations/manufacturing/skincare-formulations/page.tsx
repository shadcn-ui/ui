"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/registry/new-york-v4/ui/dialog"
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  List, 
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Beaker,
  Leaf,
  Heart
} from "lucide-react"

interface SkincareFormulation {
  id: number
  product_name: string
  product_code: string
  version: string
  status: string
  formulation_type: string // serum, cream, cleanser, toner, etc.
  skin_type_target: string[] // dry, oily, sensitive, combination
  ph_level: number
  preservation_system: string
  regulatory_status: string // BPOM_approved, pending, halal_certified
  shelf_life_months: number
  batch_size: number
  total_cost: number
  item_count: number
  safety_rating: string // A, B, C based on ingredient safety
  created_at: string
  updated_at: string
  notes?: string
}

interface IngredientComponent {
  id: number
  bom_id: number
  ingredient_name: string
  inci_name: string // International Nomenclature of Cosmetic Ingredients
  cas_number?: string // Chemical Abstracts Service number
  function_type: string // active, emulsifier, preservative, fragrance, etc.
  percentage: number
  quantity_grams: number
  unit_cost: number
  total_cost: number
  supplier_name?: string
  safety_rating: string
  allergenic_potential: boolean
  pregnancy_safe: boolean
  halal_certified: boolean
  vegan_approved: boolean
  organic_certified: boolean
  notes?: string
}

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
    case 'testing':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Activity className="w-3 h-3 mr-1" />Testing</Badge>
    case 'draft':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><FileText className="w-3 h-3 mr-1" />Draft</Badge>
    case 'discontinued':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertTriangle className="w-3 h-3 mr-1" />Discontinued</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getSafetyBadge = (rating: string) => {
  switch (rating?.toUpperCase()) {
    case 'A':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Shield className="w-3 h-3 mr-1" />Excellent</Badge>
    case 'B':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Shield className="w-3 h-3 mr-1" />Good</Badge>
    case 'C':
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100"><AlertTriangle className="w-3 h-3 mr-1" />Caution</Badge>
    default:
      return <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" />{rating}</Badge>
  }
}

const getRegulatoryBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'bpom_approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />BPOM Approved</Badge>
    case 'halal_certified':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Heart className="w-3 h-3 mr-1" />Halal Certified</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Activity className="w-3 h-3 mr-1" />Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function SkincareFormulationPage() {
  const [formulations, setFormulations] = useState<SkincareFormulation[]>([])
  const [ingredients, setIngredients] = useState<IngredientComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false)
  const [selectedFormulation, setSelectedFormulation] = useState<SkincareFormulation | null>(null)
  const [editingFormulation, setEditingFormulation] = useState<SkincareFormulation | null>(null)

  // Form state for formulation
  const [formData, setFormData] = useState({
    product_name: '',
    product_code: '',
    version: '1.0',
    status: 'draft',
    formulation_type: '',
    skin_type_target: [] as string[],
    ph_level: 5.5,
    preservation_system: '',
    regulatory_status: 'pending',
    shelf_life_months: 24,
    batch_size: 1000,
    notes: ''
  })

  // Form state for ingredients
  const [ingredientForm, setIngredientForm] = useState({
    ingredient_name: '',
    inci_name: '',
    cas_number: '',
    function_type: '',
    percentage: 0,
    quantity_grams: 0,
    unit_cost: 0,
    supplier_name: '',
    safety_rating: 'B',
    allergenic_potential: false,
    pregnancy_safe: true,
    halal_certified: false,
    vegan_approved: false,
    organic_certified: false,
    notes: ''
  })

  useEffect(() => {
    loadFormulations()
  }, [])

  const loadFormulations = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/operations/skincare-formulations')
      if (res.ok) {
        const data = await res.json()
        setFormulations(data)
      }
    } catch (error) {
      console.error('Error loading formulations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadIngredients = async (formulationId: number) => {
    try {
      const res = await fetch(`/api/operations/skincare-ingredients?formulationId=${formulationId}`)
      if (res.ok) {
        const data = await res.json()
        setIngredients(data)
      }
    } catch (error) {
      console.error('Error loading ingredients:', error)
    }
  }

  const handleCreateFormulation = async () => {
    try {
      const res = await fetch('/api/operations/skincare-formulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        await loadFormulations()
        setIsDialogOpen(false)
        resetFormulationForm()
      }
    } catch (error) {
      console.error('Error creating formulation:', error)
    }
  }

  const handleCreateIngredient = async () => {
    if (!selectedFormulation) return

    try {
      const res = await fetch('/api/operations/skincare-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ingredientForm,
          formulation_id: selectedFormulation.id
        })
      })
      
      if (res.ok) {
        await loadIngredients(selectedFormulation.id)
        setIsIngredientDialogOpen(false)
        resetIngredientForm()
      }
    } catch (error) {
      console.error('Error adding ingredient:', error)
    }
  }

  const resetFormulationForm = () => {
    setFormData({
      product_name: '',
      product_code: '',
      version: '1.0',
      status: 'draft',
      formulation_type: '',
      skin_type_target: [],
      ph_level: 5.5,
      preservation_system: '',
      regulatory_status: 'pending',
      shelf_life_months: 24,
      batch_size: 1000,
      notes: ''
    })
    setEditingFormulation(null)
  }

  const resetIngredientForm = () => {
    setIngredientForm({
      ingredient_name: '',
      inci_name: '',
      cas_number: '',
      function_type: '',
      percentage: 0,
      quantity_grams: 0,
      unit_cost: 0,
      supplier_name: '',
      safety_rating: 'B',
      allergenic_potential: false,
      pregnancy_safe: true,
      halal_certified: false,
      vegan_approved: false,
      organic_certified: false,
      notes: ''
    })
  }

  const filteredFormulations = formulations.filter(formulation => {
    const matchesSearch = formulation.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formulation.product_code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || formulation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
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
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/operations/manufacturing">Manufacturing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Skincare Formulations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Beaker className="h-8 w-8 text-blue-500" />
              Skincare Formulations
            </h2>
            <p className="text-muted-foreground">
              Manage product recipes, ingredients, and regulatory compliance for skincare manufacturing
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetFormulationForm}>
                <Plus className="mr-2 h-4 w-4" />
                New Formulation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingFormulation ? 'Edit' : 'Create'} Skincare Formulation</DialogTitle>
                <DialogDescription>
                  Create a new skincare product formulation with ingredients and compliance tracking
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                      placeholder="e.g., Vitamin C Brightening Serum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product_code">Product Code</Label>
                    <Input
                      id="product_code"
                      value={formData.product_code}
                      onChange={(e) => setFormData({...formData, product_code: e.target.value})}
                      placeholder="e.g., VCS-001"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formulation_type">Formulation Type</Label>
                    <Select value={formData.formulation_type} onValueChange={(value) => setFormData({...formData, formulation_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serum">Serum</SelectItem>
                        <SelectItem value="cream">Cream</SelectItem>
                        <SelectItem value="cleanser">Cleanser</SelectItem>
                        <SelectItem value="toner">Toner</SelectItem>
                        <SelectItem value="mask">Mask</SelectItem>
                        <SelectItem value="oil">Oil</SelectItem>
                        <SelectItem value="essence">Essence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ph_level">pH Level</Label>
                    <Input
                      id="ph_level"
                      type="number"
                      step="0.1"
                      min="3"
                      max="9"
                      value={formData.ph_level}
                      onChange={(e) => setFormData({...formData, ph_level: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="regulatory_status">Regulatory Status</Label>
                    <Select value={formData.regulatory_status} onValueChange={(value) => setFormData({...formData, regulatory_status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="bpom_approved">BPOM Approved</SelectItem>
                        <SelectItem value="halal_certified">Halal Certified</SelectItem>
                        <SelectItem value="both_approved">Both Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shelf_life_months">Shelf Life (Months)</Label>
                    <Input
                      id="shelf_life_months"
                      type="number"
                      value={formData.shelf_life_months}
                      onChange={(e) => setFormData({...formData, shelf_life_months: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes about the formulation..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateFormulation}>
                  {editingFormulation ? 'Update' : 'Create'} Formulation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search formulations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Formulations List */}
        <Card>
          <CardHeader>
            <CardTitle>Product Formulations</CardTitle>
            <CardDescription>
              Manage your skincare product recipes and ingredient compositions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading formulations...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Regulatory</TableHead>
                    <TableHead>Safety</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFormulations.map((formulation) => (
                    <TableRow 
                      key={formulation.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedFormulation(formulation)
                        loadIngredients(formulation.id)
                      }}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{formulation.product_name}</div>
                          <div className="text-sm text-muted-foreground">{formulation.product_code}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formulation.formulation_type}</TableCell>
                      <TableCell>{formulation.version}</TableCell>
                      <TableCell>{getStatusBadge(formulation.status)}</TableCell>
                      <TableCell>{getRegulatoryBadge(formulation.regulatory_status)}</TableCell>
                      <TableCell>{getSafetyBadge(formulation.safety_rating)}</TableCell>
                      <TableCell>Rp {formulation.total_cost?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Selected Formulation Details */}
        {selectedFormulation && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5" />
                    {selectedFormulation.product_name} - Ingredients
                  </CardTitle>
                  <CardDescription>
                    Detailed ingredient composition for this formulation
                  </CardDescription>
                </div>
                <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={resetIngredientForm}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Ingredient
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add Ingredient</DialogTitle>
                      <DialogDescription>
                        Add a new ingredient to {selectedFormulation.product_name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ingredient_name">Ingredient Name</Label>
                          <Input
                            id="ingredient_name"
                            value={ingredientForm.ingredient_name}
                            onChange={(e) => setIngredientForm({...ingredientForm, ingredient_name: e.target.value})}
                            placeholder="e.g., Vitamin C (Magnesium Ascorbyl Phosphate)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inci_name">INCI Name</Label>
                          <Input
                            id="inci_name"
                            value={ingredientForm.inci_name}
                            onChange={(e) => setIngredientForm({...ingredientForm, inci_name: e.target.value})}
                            placeholder="e.g., Magnesium Ascorbyl Phosphate"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="function_type">Function</Label>
                          <Select value={ingredientForm.function_type} onValueChange={(value) => setIngredientForm({...ingredientForm, function_type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select function" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active Ingredient</SelectItem>
                              <SelectItem value="base">Base/Carrier</SelectItem>
                              <SelectItem value="emulsifier">Emulsifier</SelectItem>
                              <SelectItem value="preservative">Preservative</SelectItem>
                              <SelectItem value="fragrance">Fragrance</SelectItem>
                              <SelectItem value="colorant">Colorant</SelectItem>
                              <SelectItem value="stabilizer">Stabilizer</SelectItem>
                              <SelectItem value="humectant">Humectant</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="percentage">Percentage (%)</Label>
                          <Input
                            id="percentage"
                            type="number"
                            step="0.01"
                            value={ingredientForm.percentage}
                            onChange={(e) => setIngredientForm({...ingredientForm, percentage: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit_cost">Unit Cost (Rp/g)</Label>
                          <Input
                            id="unit_cost"
                            type="number"
                            value={ingredientForm.unit_cost}
                            onChange={(e) => setIngredientForm({...ingredientForm, unit_cost: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="safety_rating">Safety Rating</Label>
                          <Select value={ingredientForm.safety_rating} onValueChange={(value) => setIngredientForm({...ingredientForm, safety_rating: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A - Excellent Safety</SelectItem>
                              <SelectItem value="B">B - Good Safety</SelectItem>
                              <SelectItem value="C">C - Use with Caution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="supplier_name">Supplier</Label>
                          <Input
                            id="supplier_name"
                            value={ingredientForm.supplier_name}
                            onChange={(e) => setIngredientForm({...ingredientForm, supplier_name: e.target.value})}
                            placeholder="Supplier name"
                          />
                        </div>
                      </div>

                      {/* Certification checkboxes */}
                      <div className="space-y-3">
                        <Label>Certifications & Compliance</Label>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ingredientForm.halal_certified}
                              onChange={(e) => setIngredientForm({...ingredientForm, halal_certified: e.target.checked})}
                              className="rounded"
                            />
                            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Halal Certified</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ingredientForm.vegan_approved}
                              onChange={(e) => setIngredientForm({...ingredientForm, vegan_approved: e.target.checked})}
                              className="rounded"
                            />
                            <span className="flex items-center gap-1"><Leaf className="w-4 h-4" /> Vegan</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ingredientForm.pregnancy_safe}
                              onChange={(e) => setIngredientForm({...ingredientForm, pregnancy_safe: e.target.checked})}
                              className="rounded"
                            />
                            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Pregnancy Safe</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ingredientForm.allergenic_potential}
                              onChange={(e) => setIngredientForm({...ingredientForm, allergenic_potential: e.target.checked})}
                              className="rounded"
                            />
                            <span className="flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Allergenic</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsIngredientDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateIngredient}>Add Ingredient</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Function</TableHead>
                    <TableHead>%</TableHead>
                    <TableHead>Safety</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ingredient.ingredient_name}</div>
                          <div className="text-sm text-muted-foreground">{ingredient.inci_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ingredient.function_type}</Badge>
                      </TableCell>
                      <TableCell>{ingredient.percentage}%</TableCell>
                      <TableCell>{getSafetyBadge(ingredient.safety_rating)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {ingredient.halal_certified && <Badge variant="outline" className="text-xs"><Heart className="w-3 h-3" /></Badge>}
                          {ingredient.vegan_approved && <Badge variant="outline" className="text-xs"><Leaf className="w-3 h-3" /></Badge>}
                          {ingredient.pregnancy_safe && <Badge variant="outline" className="text-xs"><Shield className="w-3 h-3" /></Badge>}
                        </div>
                      </TableCell>
                      <TableCell>Rp {ingredient.total_cost?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}