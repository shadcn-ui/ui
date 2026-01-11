"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Receipt, Plus, Trash2, Search, Eye } from "lucide-react"
import { toast } from "sonner"
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
import { WorkflowApprovalCard } from "@/components/workflow/WorkflowApprovalCard"

interface ExpenseClaim {
  id: number
  claim_number: string
  employee_name: string
  employee_number: string
  department_name?: string
  claim_date: string
  submission_date: string
  total_amount: string
  status: string
  purpose?: string
  items_count?: number
}

interface ExpenseItem {
  expense_date: string
  category: string
  description: string
  amount: string
  receipt_number?: string
  notes?: string
}

const expenseCategories = [
  "Travel",
  "Meals",
  "Accommodation",
  "Transportation",
  "Office Supplies",
  "Client Entertainment",
  "Communication",
  "Other"
]

export default function ExpenseClaimsPage() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null)

  // Form state
  const [claimForm, setClaimForm] = useState({
    employee_id: "",
    department_id: "",
    claim_date: new Date().toISOString().split('T')[0],
    purpose: "",
    notes: "",
  })

  const [items, setItems] = useState<ExpenseItem[]>([])
  const [itemForm, setItemForm] = useState<ExpenseItem>({
    expense_date: new Date().toISOString().split('T')[0],
    category: "Travel",
    description: "",
    amount: "0",
    receipt_number: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [claimsRes, employeesRes] = await Promise.all([
        fetch("/api/hris/expense-claims"),
        fetch("/api/hris/employees"),
      ])

      const [claimsData, employeesData] = await Promise.all([
        claimsRes.json(),
        employeesRes.json(),
      ])

      setClaims(claimsData.claims || [])
      setEmployees(employeesData.employees || [])
    } catch (error) {
      toast.error("Failed to load expense claims")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!itemForm.description || !itemForm.amount) {
      toast.error("Please fill description and amount")
      return
    }
    setItems([...items, { ...itemForm }])
    setItemForm({
      expense_date: new Date().toISOString().split('T')[0],
      category: "Travel",
      description: "",
      amount: "0",
      receipt_number: "",
      notes: "",
    })
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleCreate = async () => {
    if (!claimForm.employee_id || items.length === 0) {
      toast.error("Please select employee and add at least one expense item")
      return
    }

    try {
      const response = await fetch("/api/hris/expense-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...claimForm,
          items,
          created_by: 1,
          status: "Submitted"
        }),
      })

      if (response.ok) {
        toast.success("Expense claim created successfully")
        setCreateOpen(false)
        fetchData()
        // Reset form
        setClaimForm({
          employee_id: "",
          department_id: "",
          claim_date: new Date().toISOString().split('T')[0],
          purpose: "",
          notes: "",
        })
        setItems([])
      } else {
        toast.error("Failed to create expense claim")
      }
    } catch (error) {
      toast.error("Failed to create expense claim")
      console.error(error)
    }
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "secondary"
      case "submitted":
      case "under review":
        return "default"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "paid":
        return "default"
      default:
        return "secondary"
    }
  }

  const filteredClaims = claims.filter(c => {
    const matchesSearch = 
      c.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.amount), 0)

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
              <BreadcrumbLink href="/erp/hris">HRIS</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Expense Claims</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Expense Claims</h2>
            <p className="text-sm text-muted-foreground">
              Manage employee expense claims and reimbursements
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Claim
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {claims.filter(c => c.status === "Submitted" || c.status === "Under Review").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(claims.reduce((sum, c) => sum + parseFloat(c.total_amount || "0"), 0))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {claims.filter(c => c.status === "Paid").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by claim number or employee..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No expense claims found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.claim_number}</TableCell>
                      <TableCell>
                        <div>{claim.employee_name}</div>
                        <div className="text-xs text-muted-foreground">{claim.employee_number}</div>
                      </TableCell>
                      <TableCell>{claim.department_name || "—"}</TableCell>
                      <TableCell>
                        {new Date(claim.claim_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{formatCurrency(claim.total_amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClaim(claim)
                            setViewOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Expense Claim</DialogTitle>
            <DialogDescription>
              Create a new expense claim for reimbursement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee *</Label>
                <Select
                  value={claimForm.employee_id}
                  onValueChange={(value) => setClaimForm({ ...claimForm, employee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.employee_id} value={emp.employee_id.toString()}>
                        {emp.first_name} {emp.last_name} ({emp.employee_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Claim Date</Label>
                <Input
                  type="date"
                  value={claimForm.claim_date}
                  onChange={(e) => setClaimForm({ ...claimForm, claim_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input
                placeholder="Purpose of expenses"
                value={claimForm.purpose}
                onChange={(e) => setClaimForm({ ...claimForm, purpose: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes"
                value={claimForm.notes}
                onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })}
              />
            </div>

            {/* Expense Items */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Expense Items</h3>
              
              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={itemForm.expense_date}
                    onChange={(e) => setItemForm({ ...itemForm, expense_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={itemForm.category}
                    onValueChange={(value) => setItemForm({ ...itemForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    placeholder="Expense description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Amount (Rp)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={itemForm.amount}
                    onChange={(e) => setItemForm({ ...itemForm, amount: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleAddItem} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              {items.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(item.expense_date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold text-right">Total:</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(totalAmount)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Submit Claim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Expense Claim {selectedClaim?.claim_number}</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <WorkflowApprovalCard 
                documentType="expense_claim" 
                documentId={selectedClaim.id} 
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Employee:</span> {selectedClaim.employee_name}
                </div>
                <div>
                  <span className="font-semibold">Department:</span> {selectedClaim.department_name || "—"}
                </div>
                <div>
                  <span className="font-semibold">Claim Date:</span> {new Date(selectedClaim.claim_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Total Amount:</span> {formatCurrency(selectedClaim.total_amount)}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <Badge variant={getStatusColor(selectedClaim.status)}>
                    {selectedClaim.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
