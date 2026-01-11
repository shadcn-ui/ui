"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import { Button } from "@/registry/new-york-v4/ui/button";
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
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  X,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
}

interface BudgetLine {
  id?: number;
  account_id: number;
  account_code?: string;
  account_name?: string;
  budgeted_amount: number;
  actual_amount?: number;
  variance?: number;
  variance_percentage?: number;
}

interface Budget {
  id: number;
  name: string;
  fiscal_year: number;
  period: string;
  start_date: string;
  end_date: string;
  status: string;
  total_budgeted: number;
  total_actual?: number;
  created_at: string;
  lines?: BudgetLine[];
}

interface FormLine {
  tempId: string;
  account_id: number | null;
  budgeted_amount: string;
}

export default function BudgetManagementPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isVarianceDialogOpen, setIsVarianceDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [viewingBudget, setViewingBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    fiscal_year: new Date().getFullYear(),
    period: "annual",
    start_date: `${new Date().getFullYear()}-01-01`,
    end_date: `${new Date().getFullYear()}-12-31`,
  });
  const [formLines, setFormLines] = useState<FormLine[]>([
    {
      tempId: "line-1",
      account_id: null,
      budgeted_amount: "",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, accountsRes] = await Promise.all([
        fetch("/api/accounting/budgets"),
        fetch("/api/accounting/chart-of-accounts"),
      ]);

      if (budgetsRes.ok) {
        const budgetsData = await budgetsRes.json();
        // Handle both array and object response formats
        const budgetsArray = Array.isArray(budgetsData) 
          ? budgetsData 
          : (budgetsData.budgets || []);
        setBudgets(budgetsArray);
      }

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        // Handle both array and object response formats
        const accountsArray = Array.isArray(accountsData) 
          ? accountsData 
          : (accountsData.accounts || []);
        
        // Filter to only revenue and expense accounts for budgeting
        const budgetableAccounts = accountsArray.filter(
          (acc: Account) => acc.type === "Revenue" || acc.type === "Expense"
        );
        setAccounts(budgetableAccounts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setBudgets([]);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      draft: "secondary",
      active: "default",
      closed: "destructive",
    };
    const colors: Record<string, string> = {
      draft: "",
      active: "bg-green-600",
      closed: "bg-gray-600",
    };
    return (
      <Badge
        variant={variants[status.toLowerCase()] || "default"}
        className={colors[status.toLowerCase()]}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  const addLine = () => {
    setFormLines([
      ...formLines,
      {
        tempId: `line-${Date.now()}`,
        account_id: null,
        budgeted_amount: "",
      },
    ]);
  };

  const removeLine = (tempId: string) => {
    if (formLines.length > 1) {
      setFormLines(formLines.filter((line) => line.tempId !== tempId));
    }
  };

  const updateLine = (tempId: string, field: string, value: any) => {
    setFormLines(
      formLines.map((line) =>
        line.tempId === tempId ? { ...line, [field]: value } : line
      )
    );
  };

  const calculateTotal = () => {
    return formLines.reduce(
      (sum, line) => sum + (parseFloat(line.budgeted_amount) || 0),
      0
    );
  };

  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        name: budget.name,
        fiscal_year: budget.fiscal_year,
        period: budget.period,
        start_date: budget.start_date.split("T")[0],
        end_date: budget.end_date.split("T")[0],
      });

      if (budget.lines && budget.lines.length > 0) {
        setFormLines(
          budget.lines.map((line, index) => ({
            tempId: `line-${index}`,
            account_id: line.account_id,
            budgeted_amount: line.budgeted_amount.toString(),
          }))
        );
      }
    } else {
      setEditingBudget(null);
      setFormData({
        name: "",
        fiscal_year: new Date().getFullYear(),
        period: "annual",
        start_date: `${new Date().getFullYear()}-01-01`,
        end_date: `${new Date().getFullYear()}-12-31`,
      });
      setFormLines([
        {
          tempId: "line-1",
          account_id: null,
          budgeted_amount: "",
        },
      ]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const handleViewBudget = async (budgetId: number) => {
    try {
      const response = await fetch(`/api/accounting/budgets/${budgetId}`);
      if (response.ok) {
        const budget = await response.json();
        setViewingBudget(budget);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching budget details:", error);
    }
  };

  const handleViewVariance = async (budgetId: number) => {
    try {
      const response = await fetch(
        `/api/accounting/budgets/${budgetId}/variance`
      );
      if (response.ok) {
        const budget = await response.json();
        setViewingBudget(budget);
        setIsVarianceDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching variance analysis:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a budget name");
      return;
    }

    if (formLines.some((line) => !line.account_id)) {
      alert("Please select an account for all lines");
      return;
    }

    const lines = formLines.map((line) => ({
      account_id: line.account_id,
      budgeted_amount: parseFloat(line.budgeted_amount) || 0,
    }));

    const payload = {
      ...formData,
      lines,
    };

    try {
      const url = editingBudget
        ? `/api/accounting/budgets/${editingBudget.id}`
        : "/api/accounting/budgets";
      const method = editingBudget ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchData();
        handleCloseDialog();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to save budget"}`);
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Failed to save budget");
    }
  };

  const handleUpdateStatus = async (budgetId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/accounting/budgets/${budgetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (budgetId: number) => {
    if (!confirm("Delete this budget?")) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/budgets/${budgetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to delete budget"}`);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget");
    }
  };

  const filterBudgets = () => {
    return budgets.filter((budget) => {
      const matchesSearch = budget.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        budget.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesYear =
        yearFilter === "all" || budget.fiscal_year.toString() === yearFilter;

      return matchesSearch && matchesStatus && matchesYear;
    });
  };

  const filteredBudgets = filterBudgets();
  const years = Array.from(
    new Set(budgets.map((b) => b.fiscal_year))
  ).sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budget Management</h1>
          <p className="text-muted-foreground">
            Create and manage budgets with variance analysis
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          New Budget
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Budgets</CardTitle>
              <CardDescription>
                {filteredBudgets.length} budgets found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Budget Name</TableHead>
                <TableHead>Fiscal Year</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead className="text-right">Total Budgeted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No budgets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBudgets.map((budget) => (
                  <TableRow key={budget.id}>
                    <TableCell className="font-medium">{budget.name}</TableCell>
                    <TableCell>{budget.fiscal_year}</TableCell>
                    <TableCell className="capitalize">{budget.period}</TableCell>
                    <TableCell>
                      {formatDate(budget.start_date)} -{" "}
                      {formatDate(budget.end_date)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(budget.total_budgeted)}
                    </TableCell>
                    <TableCell>{getStatusBadge(budget.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewBudget(budget.id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {budget.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewVariance(budget.id)}
                            title="Variance Analysis"
                          >
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        {budget.status === "draft" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(budget)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(budget.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget" : "New Budget"}
            </DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Update the budget details and line items"
                : "Create a new budget with line items"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="name">Budget Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., FY2024 Operating Budget"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fiscal_year">Fiscal Year</Label>
                <Input
                  id="fiscal_year"
                  type="number"
                  value={formData.fiscal_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fiscal_year: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={(value) =>
                    setFormData({ ...formData, period: value })
                  }
                >
                  <SelectTrigger id="period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Budget Line Items</h3>
                <Button onClick={addLine} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Line
                </Button>
              </div>

              <div className="space-y-3">
                {formLines.map((line) => (
                  <div
                    key={line.tempId}
                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="col-span-7 space-y-1">
                      <Label className="text-xs">Account</Label>
                      <Select
                        value={line.account_id?.toString() || ""}
                        onValueChange={(value) =>
                          updateLine(line.tempId, "account_id", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={account.id.toString()}
                            >
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-4 space-y-1">
                      <Label className="text-xs">Budgeted Amount</Label>
                      <Input
                        type="number"
                        value={line.budgeted_amount}
                        onChange={(e) =>
                          updateLine(
                            line.tempId,
                            "budgeted_amount",
                            e.target.value
                          )
                        }
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-1 flex items-end justify-end">
                      {formLines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLine(line.tempId)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Budget:</span>
                  <span>{formatIDR(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingBudget ? "Update Budget" : "Create Budget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Budget Details</DialogTitle>
            <DialogDescription>{viewingBudget?.name}</DialogDescription>
          </DialogHeader>

          {viewingBudget && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fiscal Year: </span>
                  <span className="font-medium">{viewingBudget.fiscal_year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Period: </span>
                  <span className="font-medium capitalize">
                    {viewingBudget.period}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  {getStatusBadge(viewingBudget.status)}
                </div>
                <div>
                  <span className="text-muted-foreground">Date Range: </span>
                  <span className="font-medium">
                    {formatDate(viewingBudget.start_date)} -{" "}
                    {formatDate(viewingBudget.end_date)}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">
                        Budgeted Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingBudget.lines?.map((line, index) => (
                      <TableRow key={line.id || index}>
                        <TableCell>
                          <div className="font-medium">{line.account_code}</div>
                          <div className="text-sm text-muted-foreground">
                            {line.account_name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatIDR(line.budgeted_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatIDR(viewingBudget.total_budgeted)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {viewingBudget.status === "draft" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleUpdateStatus(viewingBudget.id, "active");
                      setIsViewDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    Activate Budget
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Variance Analysis Dialog */}
      <Dialog open={isVarianceDialogOpen} onOpenChange={setIsVarianceDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Budget Variance Analysis</DialogTitle>
            <DialogDescription>{viewingBudget?.name}</DialogDescription>
          </DialogHeader>

          {viewingBudget && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Budgeted</CardDescription>
                    <CardTitle className="text-2xl">
                      {formatIDR(viewingBudget.total_budgeted)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Actual</CardDescription>
                    <CardTitle className="text-2xl">
                      {formatIDR(viewingBudget.total_actual || 0)}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Overall Variance</CardDescription>
                    <CardTitle
                      className={`text-2xl ${
                        (viewingBudget.total_actual || 0) >
                        viewingBudget.total_budgeted
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatIDR(
                        viewingBudget.total_budgeted -
                          (viewingBudget.total_actual || 0)
                      )}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Budgeted</TableHead>
                      <TableHead className="text-right">Actual</TableHead>
                      <TableHead className="text-right">Variance</TableHead>
                      <TableHead className="text-right">Variance %</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingBudget.lines?.map((line, index) => {
                      const variance =
                        line.budgeted_amount - (line.actual_amount || 0);
                      const variancePercentage =
                        line.budgeted_amount > 0
                          ? (variance / line.budgeted_amount) * 100
                          : 0;
                      const isOverBudget = variance < 0;

                      return (
                        <TableRow key={line.id || index}>
                          <TableCell>
                            <div className="font-medium">
                              {line.account_code}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {line.account_name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatIDR(line.budgeted_amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatIDR(line.actual_amount || 0)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              isOverBudget ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {formatIDR(variance)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              isOverBudget ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            {variancePercentage.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-center">
                            {isOverBudget ? (
                              <Badge variant="destructive" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Over
                              </Badge>
                            ) : Math.abs(variancePercentage) < 5 ? (
                              <Badge className="bg-yellow-600 gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Near
                              </Badge>
                            ) : (
                              <Badge className="bg-green-600 gap-1">
                                <TrendingDown className="h-3 w-3" />
                                Under
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVarianceDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
