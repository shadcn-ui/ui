"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Building2, Plus, Edit, Trash2, Search, Eye, Users, DollarSign, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar";
import { Separator } from "@/registry/new-york-v4/ui/separator";
import Link from "next/link";

interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  parent_department_id?: number;
  parent_department_name?: string;
  manager_id?: number;
  manager?: {
    first_name: string;
    last_name: string;
  };
  budget: number;
  employee_count: number;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Form state
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    code: "",
    description: "",
    parent_department_id: "",
    manager_id: "",
    budget: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptsRes, usersRes] = await Promise.all([
        fetch("/api/hris/settings/departments"),
        fetch("/api/users"),
      ]);

      const [deptsData, usersData] = await Promise.all([
        deptsRes.json(),
        usersRes.json(),
      ]);

      setDepartments(deptsData.departments || []);
      // Handle both response formats: direct array or nested in data.users
      const usersList = usersData.data?.users || usersData.users || usersData || [];
      setUsers(usersList);
    } catch (error) {
      toast.error("Failed to load departments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!departmentForm.name || !departmentForm.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/settings/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: departmentForm.name,
          code: departmentForm.code,
          description: departmentForm.description,
          parent_department_id: departmentForm.parent_department_id && departmentForm.parent_department_id !== "none" ? parseInt(departmentForm.parent_department_id) : null,
          manager_id: departmentForm.manager_id && departmentForm.manager_id !== "none" ? parseInt(departmentForm.manager_id) : null,
          budget: departmentForm.budget ? parseFloat(departmentForm.budget) : 0,
        }),
      });

      if (response.ok) {
        toast.success("Department created successfully");
        setCreateOpen(false);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create department");
      }
    } catch (error) {
      toast.error("Failed to create department");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedDepartment || !departmentForm.name || !departmentForm.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/settings/departments/${selectedDepartment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: departmentForm.name,
          code: departmentForm.code,
          description: departmentForm.description,
          parent_department_id: departmentForm.parent_department_id && departmentForm.parent_department_id !== "none" ? parseInt(departmentForm.parent_department_id) : null,
          manager_id: departmentForm.manager_id && departmentForm.manager_id !== "none" ? parseInt(departmentForm.manager_id) : null,
          budget: departmentForm.budget ? parseFloat(departmentForm.budget) : 0,
        }),
      });

      if (response.ok) {
        toast.success("Department updated successfully");
        setEditOpen(false);
        setSelectedDepartment(null);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update department");
      }
    } catch (error) {
      toast.error("Failed to update department");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedDepartment) return;

    try {
      const response = await fetch(`/api/hris/settings/departments/${selectedDepartment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Department deleted successfully");
        setDeleteOpen(false);
        setSelectedDepartment(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete department");
      }
    } catch (error) {
      toast.error("Failed to delete department");
      console.error(error);
    }
  };

  const openEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDepartmentForm({
      name: department.name,
      code: department.code,
      description: department.description || "",
      parent_department_id: department.parent_department_id ? department.parent_department_id.toString() : "none",
      manager_id: department.manager_id ? department.manager_id.toString() : "none",
      budget: department.budget.toString(),
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setDepartmentForm({
      name: "",
      code: "",
      description: "",
      parent_department_id: "none",
      manager_id: "none",
      budget: "",
    });
  };

  // Statistics
  const totalDepartments = departments.length;
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employee_count, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const departmentsWithManager = departments.filter((d) => d.manager_id).length;

  // Filtered data
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Link href="/erp/settings" className="text-muted-foreground hover:text-foreground">
            Settings
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/erp/settings/master-data" className="text-muted-foreground hover:text-foreground">
            Master Data
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">Departments</h1>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Departments</h1>
            <p className="text-muted-foreground">Manage organizational departments and hierarchy</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        {/* Statistics */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDepartments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalBudget)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Manager</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departmentsWithManager}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No departments found</TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-mono text-sm">{dept.code}</TableCell>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.parent_department_name || "-"}</TableCell>
                      <TableCell>
                        {dept.manager
                          ? `${dept.manager.first_name} ${dept.manager.last_name}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{dept.employee_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(dept.budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedDepartment(dept); setViewOpen(true); }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(dept)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedDepartment(dept); setDeleteOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>Add a new department to your organization</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={departmentForm.name}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                    placeholder="e.g. Sales & Marketing"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={departmentForm.code}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SALES"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the department"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="parent">Parent Department</Label>
                  <Select
                    value={departmentForm.parent_department_id}
                    onValueChange={(v) => setDepartmentForm({ ...departmentForm, parent_department_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="manager">Manager</Label>
                  <Select
                    value={departmentForm.manager_id}
                    onValueChange={(v) => setDepartmentForm({ ...departmentForm, manager_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="budget">Annual Budget (IDR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={departmentForm.budget}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, budget: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>Update department information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_name">Name *</Label>
                  <Input
                    id="edit_name"
                    value={departmentForm.name}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_code">Code *</Label>
                  <Input
                    id="edit_code"
                    value={departmentForm.code}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea
                  id="edit_description"
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_parent">Parent Department</Label>
                  <Select
                    value={departmentForm.parent_department_id}
                    onValueChange={(v) => setDepartmentForm({ ...departmentForm, parent_department_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {departments
                        .filter((dept) => dept.id !== selectedDepartment?.id)
                        .map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit_manager">Manager</Label>
                  <Select
                    value={departmentForm.manager_id}
                    onValueChange={(v) => setDepartmentForm({ ...departmentForm, manager_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Manager</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.first_name} {user.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_budget">Annual Budget (IDR)</Label>
                <Input
                  id="edit_budget"
                  type="number"
                  value={departmentForm.budget}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, budget: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setEditOpen(false); setSelectedDepartment(null); }}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Department</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Department Details</DialogTitle>
              <DialogDescription>{selectedDepartment?.name}</DialogDescription>
            </DialogHeader>
            {selectedDepartment && (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Code:</strong> {selectedDepartment.code}
                  </div>
                  <div>
                    <strong>Name:</strong> {selectedDepartment.name}
                  </div>
                </div>
                
                {selectedDepartment.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="mt-2 text-sm">{selectedDepartment.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Parent Department:</strong> {selectedDepartment.parent_department_name || "None"}
                  </div>
                  <div>
                    <strong>Manager:</strong>{" "}
                    {selectedDepartment.manager
                      ? `${selectedDepartment.manager.first_name} ${selectedDepartment.manager.last_name}`
                      : "None"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Total Employees:</strong> {selectedDepartment.employee_count}
                  </div>
                  <div>
                    <strong>Annual Budget:</strong>{" "}
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(selectedDepartment.budget)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Created:</strong> {new Date(selectedDepartment.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {new Date(selectedDepartment.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setViewOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Department</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDeleteOpen(false); setSelectedDepartment(null); }}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
