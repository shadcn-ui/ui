"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Users, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2,
  Download, Building2, Calendar, Mail, CheckCircle2, XCircle, Clock, Save, X,
} from "lucide-react"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/registry/new-york-v4/ui/alert-dialog"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { toast } from "sonner"

interface Employee {
  id: number
  employee_number: string
  user: { first_name: string; last_name: string; email: string }
  department: { id?: number; name: string }
  position: { id?: number; title: string }
  employment_type: string
  employment_status: string
  hire_date: string
  phone: string
  salary: number
}

export default function EmployeesPage() {
  const router = useRouter()
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [departments, setDepartments] = React.useState<any[]>([])
  const [positions, setPositions] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [formData, setFormData] = React.useState({
    first_name: "", last_name: "", email: "", department_id: "", position_id: "",
    employment_type: "Full-time", employment_status: "Probation",
    hire_date: new Date().toISOString().split("T")[0], phone: "", salary: "",
  })
  const [stats, setStats] = React.useState({ total: 0, active: 0, probation: 0, inactive: 0 })

  React.useEffect(() => {
    fetchEmployees()
    fetchDepartments()
    fetchPositions()
  }, [statusFilter])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      const response = await fetch(`/api/hris/employees?${params}`)
      const data = await response.json()
      if (response.ok) {
        setEmployees(data.employees || [])
        setStats(data.stats || { total: 0, active: 0, probation: 0, inactive: 0 })
      }
    } catch (error) {
      toast.error("Failed to fetch employees")
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/hris/departments")
      const data = await response.json()
      if (response.ok) setDepartments(data.departments || [])
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/hris/positions")
      const data = await response.json()
      if (response.ok) setPositions(data.positions || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
    }
  }

  const handleCreate = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Please fill in all required fields (First Name, Last Name, Email)")
      return
    }
    try {
      setSubmitting(true)
      const response = await fetch("/api/hris/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          position_id: formData.position_id ? parseInt(formData.position_id) : null,
          salary: formData.salary ? parseFloat(formData.salary) : 0,
        }),
      })
      if (response.ok) {
        toast.success("Employee created successfully")
        setCreateDialogOpen(false)
        resetForm()
        fetchEmployees()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to create employee")
      }
    } catch (error) {
      toast.error("Failed to create employee")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedEmployee) return
    try {
      setSubmitting(true)
      const response = await fetch(`/api/hris/employees/${selectedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department_id: formData.department_id ? parseInt(formData.department_id) : null,
          position_id: formData.position_id ? parseInt(formData.position_id) : null,
          salary: formData.salary ? parseFloat(formData.salary) : 0,
        }),
      })
      if (response.ok) {
        toast.success("Employee updated successfully")
        setEditDialogOpen(false)
        resetForm()
        fetchEmployees()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to update employee")
      }
    } catch (error) {
      toast.error("Failed to update employee")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEmployee) return
    try {
      setSubmitting(true)
      const response = await fetch(`/api/hris/employees/${selectedEmployee.id}`, { method: "DELETE" })
      if (response.ok) {
        toast.success("Employee terminated successfully")
        setDeleteDialogOpen(false)
        setSelectedEmployee(null)
        fetchEmployees()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to terminate employee")
      }
    } catch (error) {
      toast.error("Failed to terminate employee")
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setFormData({
      first_name: employee.user?.first_name || "",
      last_name: employee.user?.last_name || "",
      email: employee.user?.email || "",
      department_id: employee.department?.id?.toString() || "",
      position_id: employee.position?.id?.toString() || "",
      employment_type: employee.employment_type || "Full-time",
      employment_status: employee.employment_status || "Active",
      hire_date: employee.hire_date || "",
      phone: employee.phone || "",
      salary: employee.salary?.toString() || "",
    })
    setEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      first_name: "", last_name: "", email: "", department_id: "", position_id: "",
      employment_type: "Full-time", employment_status: "Probation",
      hire_date: new Date().toISOString().split("T")[0], phone: "", salary: "",
    })
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = searchQuery === "" ||
      employee.employee_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${employee.user?.first_name} ${employee.user?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const config: any = {
      Active: { variant: "default", label: "Active" },
      Probation: { variant: "secondary", label: "Probation" },
      Notice: { variant: "outline", label: "Notice Period" },
      Terminated: { variant: "destructive", label: "Terminated" },
      Resigned: { variant: "destructive", label: "Resigned" },
    }
    const c = config[status] || { variant: "outline", label: status }
    return <Badge variant={c.variant}>{c.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage employee information and records</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Employee</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Probation</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.probation}</div>
            <p className="text-xs text-muted-foreground">On probation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Terminated/Resigned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search employees..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Notice">Notice Period</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                  <SelectItem value="Resigned">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-10">Loading...</TableCell></TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No employees found</p>
                      <Button size="sm" onClick={() => setCreateDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add First Employee</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employee_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{employee.user?.first_name} {employee.user?.last_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />{employee.user?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {employee.department?.name || "-"}
                      </div>
                    </TableCell>
                    <TableCell>{employee.position?.title || "-"}</TableCell>
                    <TableCell><Badge variant="outline">{employee.employment_type}</Badge></TableCell>
                    <TableCell>{getStatusBadge(employee.employment_status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />{formatDate(employee.hire_date)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedEmployee(employee); setDialogOpen(true) }}>
                            <Eye className="mr-2 h-4 w-4" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(employee)}>
                            <Edit className="mr-2 h-4 w-4" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => { setSelectedEmployee(employee); setDeleteDialogOpen(true) }}>
                            <Trash2 className="mr-2 h-4 w-4" />Terminate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>Complete information about {selectedEmployee?.user?.first_name} {selectedEmployee?.user?.last_name}</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <Tabs defaultValue="personal">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Employee Number</Label><p className="font-medium">{selectedEmployee.employee_number}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Full Name</Label><p className="font-medium">{selectedEmployee.user?.first_name} {selectedEmployee.user?.last_name}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{selectedEmployee.user?.email}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{selectedEmployee.phone || "-"}</p></div>
                </div>
              </TabsContent>
              <TabsContent value="employment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Department</Label><p className="font-medium">{selectedEmployee.department?.name || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Position</Label><p className="font-medium">{selectedEmployee.position?.title || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Employment Type</Label><p className="font-medium">{selectedEmployee.employment_type}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Status</Label><div className="mt-1">{getStatusBadge(selectedEmployee.employment_status)}</div></div>
                  <div><Label className="text-xs text-muted-foreground">Hire Date</Label><p className="font-medium">{formatDate(selectedEmployee.hire_date)}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Monthly Salary</Label><p className="font-medium text-lg">{formatCurrency(selectedEmployee.salary || 0)}</p></div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
            <Button onClick={() => { if (selectedEmployee) { openEditDialog(selectedEmployee); setDialogOpen(false) } }}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={createDialogOpen || editDialogOpen} onOpenChange={(open) => { if (!open) { setCreateDialogOpen(false); setEditDialogOpen(false); resetForm() } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editDialogOpen ? "Edit Employee" : "Add New Employee"}</DialogTitle>
            <DialogDescription>{editDialogOpen ? "Update employee information" : "Create a new employee record"}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name *</Label><Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} /></div>
            <div><Label>Last Name *</Label><Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} /></div>
            <div><Label>Email *</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
            <div>
              <Label>Department</Label>
              <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{departments.map((d) => (<SelectItem key={d.id} value={d.id.toString()}>{d.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Position</Label>
              <Select value={formData.position_id} onValueChange={(value) => setFormData({ ...formData, position_id: value })}>
                <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                <SelectContent>{positions.map((p) => (<SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Employment Type</Label>
              <Select value={formData.employment_type} onValueChange={(value) => setFormData({ ...formData, employment_type: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Employment Status</Label>
              <Select value={formData.employment_status} onValueChange={(value) => setFormData({ ...formData, employment_status: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Probation">Probation</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Notice">Notice Period</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                  <SelectItem value="Resigned">Resigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Hire Date</Label><Input type="date" value={formData.hire_date} onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })} /></div>
            <div><Label>Monthly Salary (IDR)</Label><Input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="5000000" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateDialogOpen(false); setEditDialogOpen(false); resetForm() }} disabled={submitting}>
              <X className="mr-2 h-4 w-4" />Cancel
            </Button>
            <Button onClick={editDialogOpen ? handleUpdate : handleCreate} disabled={submitting}>
              <Save className="mr-2 h-4 w-4" />{submitting ? (editDialogOpen ? "Updating..." : "Creating...") : (editDialogOpen ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change the employment status of <strong>{selectedEmployee?.user?.first_name} {selectedEmployee?.user?.last_name}</strong> to "Terminated".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={submitting} className="bg-red-600 hover:bg-red-700">
              {submitting ? "Terminating..." : "Terminate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
