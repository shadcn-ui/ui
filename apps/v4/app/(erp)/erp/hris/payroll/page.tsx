"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs";
import { 
  DollarSign, Plus, Edit, Trash2, Search, Eye, 
  CheckCircle2, Calculator, Send, Users 
} from "lucide-react";
import { toast } from "sonner";

interface PayrollPeriod {
  id: number;
  period_name: string;
  start_date: string;
  end_date: string;
  payment_date: string;
  status: string;
  total_employees?: number;
  total_gross?: number;
  total_deductions?: number;
  total_net?: number;
  created_at?: string;
}

interface PayrollRecord {
  id: number;
  period_id: number;
  period_name?: string;
  employee_id: number;
  employee_number?: string;
  first_name?: string;
  last_name?: string;
  basic_salary: number;
  allowances: number;
  overtime_pay: number;
  deductions: number;
  tax: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  notes?: string;
  payment_date?: string;
}

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("periods");

  // Dialog states
  const [createPeriodOpen, setCreatePeriodOpen] = useState(false);
  const [editPeriodOpen, setEditPeriodOpen] = useState(false);
  const [viewPeriodOpen, setViewPeriodOpen] = useState(false);
  const [deletePeriodOpen, setDeletePeriodOpen] = useState(false);
  const [editRecordOpen, setEditRecordOpen] = useState(false);
  const [viewRecordOpen, setViewRecordOpen] = useState(false);
  
  const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);

  // Form states
  const [periodForm, setPeriodForm] = useState({
    period_name: "",
    start_date: "",
    end_date: "",
    payment_date: "",
    status: "Draft",
  });

  const [recordForm, setRecordForm] = useState({
    basic_salary: "",
    allowances: "",
    overtime_pay: "",
    deductions: "",
    tax: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [periodsRes, recordsRes] = await Promise.all([
        fetch("/api/hris/payroll/periods"),
        fetch("/api/hris/payroll/records"),
      ]);

      const [periodsData, recordsData] = await Promise.all([
        periodsRes.json(),
        recordsRes.json(),
      ]);

      setPeriods(periodsData.periods || periodsData || []);
      setRecords(recordsData.records || recordsData || []);
    } catch (error) {
      toast.error("Failed to load payroll data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePeriod = async () => {
    if (!periodForm.period_name || !periodForm.start_date || !periodForm.end_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/payroll/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(periodForm),
      });

      if (response.ok) {
        toast.success("Payroll period created successfully");
        setCreatePeriodOpen(false);
        resetPeriodForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create payroll period");
      }
    } catch (error) {
      toast.error("Failed to create payroll period");
      console.error(error);
    }
  };

  const handleUpdatePeriod = async () => {
    if (!selectedPeriod || !periodForm.period_name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/payroll/periods/${selectedPeriod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(periodForm),
      });

      if (response.ok) {
        toast.success("Payroll period updated successfully");
        setEditPeriodOpen(false);
        setSelectedPeriod(null);
        resetPeriodForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update payroll period");
      }
    } catch (error) {
      toast.error("Failed to update payroll period");
      console.error(error);
    }
  };

  const handleDeletePeriod = async () => {
    if (!selectedPeriod) return;

    try {
      const response = await fetch(`/api/hris/payroll/periods/${selectedPeriod.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Payroll period deleted successfully");
        setDeletePeriodOpen(false);
        setSelectedPeriod(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete payroll period");
      }
    } catch (error) {
      toast.error("Failed to delete payroll period");
      console.error(error);
    }
  };

  const handleUpdatePeriodStatus = async (period: PayrollPeriod, newStatus: string) => {
    try {
      const response = await fetch(`/api/hris/payroll/periods/${period.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Period status updated to ${newStatus}`);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update period status");
      }
    } catch (error) {
      toast.error("Failed to update period status");
      console.error(error);
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;

    try {
      const response = await fetch(`/api/hris/payroll/records/${selectedRecord.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basic_salary: parseFloat(recordForm.basic_salary) || 0,
          allowances: parseFloat(recordForm.allowances) || 0,
          overtime_pay: parseFloat(recordForm.overtime_pay) || 0,
          deductions: parseFloat(recordForm.deductions) || 0,
          tax: parseFloat(recordForm.tax) || 0,
          notes: recordForm.notes,
        }),
      });

      if (response.ok) {
        toast.success("Payroll record updated successfully");
        setEditRecordOpen(false);
        setSelectedRecord(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update payroll record");
      }
    } catch (error) {
      toast.error("Failed to update payroll record");
      console.error(error);
    }
  };

  const openEditPeriod = (period: PayrollPeriod) => {
    setSelectedPeriod(period);
    setPeriodForm({
      period_name: period.period_name,
      start_date: period.start_date,
      end_date: period.end_date,
      payment_date: period.payment_date,
      status: period.status,
    });
    setEditPeriodOpen(true);
  };

  const openEditRecord = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setRecordForm({
      basic_salary: record.basic_salary.toString(),
      allowances: record.allowances.toString(),
      overtime_pay: record.overtime_pay.toString(),
      deductions: record.deductions.toString(),
      tax: record.tax.toString(),
      notes: record.notes || "",
    });
    setEditRecordOpen(true);
  };

  const resetPeriodForm = () => {
    setPeriodForm({
      period_name: "",
      start_date: "",
      end_date: "",
      payment_date: "",
      status: "Draft",
    });
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const workflow: Record<string, string> = {
      "Draft": "Calculated",
      "Calculated": "Approved",
      "Approved": "Paid",
    };
    return workflow[currentStatus] || null;
  };

  const getStatusButtonLabel = (status: string): string => {
    const labels: Record<string, string> = {
      "Draft": "Calculate",
      "Calculated": "Approve",
      "Approved": "Mark as Paid",
    };
    return labels[status] || "";
  };

  // Statistics
  const totalPeriods = periods.length;
  const processedPeriods = periods.filter(
    (p) => p.status === "Approved" || p.status === "Paid"
  ).length;
  const totalGross = periods.reduce((sum, p) => sum + (p.total_gross || 0), 0);
  const totalNet = periods.reduce((sum, p) => sum + (p.total_net || 0), 0);

  // Filtered data
  const filteredPeriods = periods.filter((period) =>
    period.period_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    period.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecords = records.filter((record) =>
    (record.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (record.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (record.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-gray-500",
      Calculated: "bg-blue-500",
      Approved: "bg-purple-500",
      Paid: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage payroll periods and employee records</p>
        </div>
        <Button onClick={() => setCreatePeriodOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Payroll Period
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Periods</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPeriods}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed Periods</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedPeriods}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGross)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalNet)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="periods">Payroll Periods</TabsTrigger>
          <TabsTrigger value="records">Payroll Records</TabsTrigger>
        </TabsList>

        <TabsContent value="periods">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredPeriods.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">No periods found</TableCell>
                    </TableRow>
                  ) : (
                    filteredPeriods.map((period) => (
                      <TableRow key={period.id}>
                        <TableCell className="font-medium">{period.period_name}</TableCell>
                        <TableCell>{new Date(period.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(period.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(period.payment_date).toLocaleDateString()}</TableCell>
                        <TableCell>{period.total_employees || 0}</TableCell>
                        <TableCell>{formatCurrency(period.total_gross || 0)}</TableCell>
                        <TableCell>{formatCurrency(period.total_net || 0)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(period.status)}>{period.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {getNextStatus(period.status) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdatePeriodStatus(period, getNextStatus(period.status)!)}
                              >
                                {getStatusButtonLabel(period.status)}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedPeriod(period); setViewPeriodOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditPeriod(period)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedPeriod(period); setDeletePeriodOpen(true); }}
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
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee #</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center">No records found</TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.first_name} {record.last_name}
                        </TableCell>
                        <TableCell>{record.employee_number}</TableCell>
                        <TableCell>{record.period_name}</TableCell>
                        <TableCell>{formatCurrency(record.basic_salary)}</TableCell>
                        <TableCell>{formatCurrency(record.allowances)}</TableCell>
                        <TableCell>{formatCurrency(record.overtime_pay)}</TableCell>
                        <TableCell>{formatCurrency(record.deductions)}</TableCell>
                        <TableCell>{formatCurrency(record.tax)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.gross_salary)}</TableCell>
                        <TableCell className="font-medium text-green-600">
                          {formatCurrency(record.net_salary)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedRecord(record); setViewRecordOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditRecord(record)}>
                              <Edit className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Create Period Dialog */}
      <Dialog open={createPeriodOpen} onOpenChange={setCreatePeriodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payroll Period</DialogTitle>
            <DialogDescription>Add a new payroll period</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="period_name">Period Name *</Label>
              <Input
                id="period_name"
                placeholder="e.g., January 2024"
                value={periodForm.period_name}
                onChange={(e) => setPeriodForm({ ...periodForm, period_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={periodForm.start_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={periodForm.end_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="payment_date">Payment Date</Label>
              <Input
                id="payment_date"
                type="date"
                value={periodForm.payment_date}
                onChange={(e) => setPeriodForm({ ...periodForm, payment_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={periodForm.status}
                onValueChange={(v) => setPeriodForm({ ...periodForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Calculated">Calculated</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreatePeriodOpen(false); resetPeriodForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreatePeriod}>Create Period</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Period Dialog */}
      <Dialog open={editPeriodOpen} onOpenChange={setEditPeriodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payroll Period</DialogTitle>
            <DialogDescription>Update payroll period details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_period_name">Period Name *</Label>
              <Input
                id="edit_period_name"
                value={periodForm.period_name}
                onChange={(e) => setPeriodForm({ ...periodForm, period_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_date">Start Date *</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={periodForm.start_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_date">End Date *</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={periodForm.end_date}
                  onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_payment_date">Payment Date</Label>
              <Input
                id="edit_payment_date"
                type="date"
                value={periodForm.payment_date}
                onChange={(e) => setPeriodForm({ ...periodForm, payment_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={periodForm.status}
                onValueChange={(v) => setPeriodForm({ ...periodForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Calculated">Calculated</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditPeriodOpen(false); setSelectedPeriod(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePeriod}>Update Period</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Period Dialog */}
      <Dialog open={deletePeriodOpen} onOpenChange={setDeletePeriodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Payroll Period</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payroll period? This action cannot be undone.
              {selectedPeriod && selectedPeriod.total_employees && selectedPeriod.total_employees > 0 && (
                <span className="block mt-2 text-orange-600">
                  Warning: This period has {selectedPeriod.total_employees} payroll records.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeletePeriodOpen(false); setSelectedPeriod(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePeriod}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Period Dialog */}
      <Dialog open={viewPeriodOpen} onOpenChange={setViewPeriodOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPeriod?.period_name}</DialogTitle>
            <DialogDescription>Payroll period details</DialogDescription>
          </DialogHeader>
          {selectedPeriod && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Start Date:</strong> {new Date(selectedPeriod.start_date).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(selectedPeriod.end_date).toLocaleDateString()}</div>
              </div>
              <div><strong>Payment Date:</strong> {new Date(selectedPeriod.payment_date).toLocaleDateString()}</div>
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedPeriod.status)}>{selectedPeriod.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Total Employees:</strong> {selectedPeriod.total_employees || 0}</div>
                <div><strong>Total Gross:</strong> {formatCurrency(selectedPeriod.total_gross || 0)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Total Deductions:</strong> {formatCurrency(selectedPeriod.total_deductions || 0)}</div>
                <div><strong>Total Net:</strong> {formatCurrency(selectedPeriod.total_net || 0)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewPeriodOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Record Dialog */}
      <Dialog open={editRecordOpen} onOpenChange={setEditRecordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payroll Record</DialogTitle>
            <DialogDescription>
              Update salary components for {selectedRecord?.first_name} {selectedRecord?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="basic_salary">Basic Salary</Label>
              <Input
                id="basic_salary"
                type="number"
                step="0.01"
                value={recordForm.basic_salary}
                onChange={(e) => setRecordForm({ ...recordForm, basic_salary: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="allowances">Allowances</Label>
                <Input
                  id="allowances"
                  type="number"
                  step="0.01"
                  value={recordForm.allowances}
                  onChange={(e) => setRecordForm({ ...recordForm, allowances: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="overtime_pay">Overtime Pay</Label>
                <Input
                  id="overtime_pay"
                  type="number"
                  step="0.01"
                  value={recordForm.overtime_pay}
                  onChange={(e) => setRecordForm({ ...recordForm, overtime_pay: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="deductions">Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  step="0.01"
                  value={recordForm.deductions}
                  onChange={(e) => setRecordForm({ ...recordForm, deductions: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tax">Tax</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={recordForm.tax}
                  onChange={(e) => setRecordForm({ ...recordForm, tax: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={recordForm.notes}
                onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
              />
            </div>
            {selectedRecord && (
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm font-medium mb-2">Calculated Values:</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Gross Salary:</div>
                  <div className="font-medium">
                    {formatCurrency(
                      (parseFloat(recordForm.basic_salary) || 0) +
                      (parseFloat(recordForm.allowances) || 0) +
                      (parseFloat(recordForm.overtime_pay) || 0)
                    )}
                  </div>
                  <div>Total Deductions:</div>
                  <div className="font-medium">
                    {formatCurrency(
                      (parseFloat(recordForm.deductions) || 0) +
                      (parseFloat(recordForm.tax) || 0)
                    )}
                  </div>
                  <div>Net Salary:</div>
                  <div className="font-medium text-green-600">
                    {formatCurrency(
                      (parseFloat(recordForm.basic_salary) || 0) +
                      (parseFloat(recordForm.allowances) || 0) +
                      (parseFloat(recordForm.overtime_pay) || 0) -
                      (parseFloat(recordForm.deductions) || 0) -
                      (parseFloat(recordForm.tax) || 0)
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditRecordOpen(false); setSelectedRecord(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRecord}>Update Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Record Dialog */}
      <Dialog open={viewRecordOpen} onOpenChange={setViewRecordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRecord?.first_name} {selectedRecord?.last_name}
            </DialogTitle>
            <DialogDescription>
              Employee #{selectedRecord?.employee_number} - {selectedRecord?.period_name}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Basic Salary:</strong> {formatCurrency(selectedRecord.basic_salary)}</div>
                <div><strong>Allowances:</strong> {formatCurrency(selectedRecord.allowances)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Overtime Pay:</strong> {formatCurrency(selectedRecord.overtime_pay)}</div>
                <div><strong>Gross Salary:</strong> {formatCurrency(selectedRecord.gross_salary)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Deductions:</strong> {formatCurrency(selectedRecord.deductions)}</div>
                <div><strong>Tax:</strong> {formatCurrency(selectedRecord.tax)}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Total Deductions:</strong> {formatCurrency(selectedRecord.total_deductions)}</div>
                <div><strong>Net Salary:</strong> <span className="text-green-600 font-medium">{formatCurrency(selectedRecord.net_salary)}</span></div>
              </div>
              {selectedRecord.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-2 text-sm">{selectedRecord.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewRecordOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
