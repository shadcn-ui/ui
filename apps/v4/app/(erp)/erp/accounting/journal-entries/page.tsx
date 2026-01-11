"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  X,
  AlertCircle,
  Lock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/registry/new-york-v4/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip";
import { usePeriodState } from "@/hooks/use-period-state";
import { isProductionMode } from "@/lib/runtime-flags-client";

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
}

interface JournalEntryLine {
  id?: number;
  account_id: number;
  account_code?: string;
  account_name?: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: number;
  entry_number: string;
  entry_date: string;
  description: string;
  status: string;
  total_debit: number;
  total_credit: number;
  created_at: string;
  period_id?: number;
  lines?: JournalEntryLine[];
}

interface FormLine {
  tempId: string;
  account_id: number | null;
  description: string;
  debit: string;
  credit: string;
}

export default function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formPeriodId, setFormPeriodId] = useState<string | null>(null);
  const [resolvingPeriod, setResolvingPeriod] = useState(false);
  const [periodResolveError, setPeriodResolveError] = useState<string | null>(null);
  const { state: periodState, loading: periodLoading } = usePeriodState(formPeriodId ?? undefined);
  const productionMode = useMemo(() => isProductionMode(), []);
  const productionTooltip = "Disabled in Production Mode";
  const productionHelper = "This action is locked because Ocean ERP is running in Production Mode.";

  // Form state
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [formLines, setFormLines] = useState<FormLine[]>([
    {
      tempId: "line-1",
      account_id: null,
      description: "",
      debit: "",
      credit: "",
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const resolvePeriodIdForDate = useCallback(async (date: string) => {
    if (!date) {
      setFormPeriodId(null);
      return;
    }

    setResolvingPeriod(true);
    setPeriodResolveError(null);
    try {
      const response = await fetch(`/api/accounting/period-status?date=${date}`);
      if (!response.ok) {
        throw new Error("Unable to resolve accounting period for this date.");
      }

      const data = await response.json();
      const nextPeriodId = data?.period?.id;
      if (nextPeriodId) {
        setFormPeriodId(String(nextPeriodId));
      } else {
        setFormPeriodId(null);
        setPeriodResolveError("Unable to resolve accounting period for this date.");
      }
    } catch (error) {
      console.error("Error resolving period id:", error);
      setFormPeriodId(null);
      setPeriodResolveError("Unable to resolve accounting period for this date.");
    } finally {
      setResolvingPeriod(false);
    }
  }, []);

  // Refresh period resolution when the entry date changes (fail-closed even before dialog opens)
  useEffect(() => {
    if (formData.entry_date) {
      resolvePeriodIdForDate(formData.entry_date);
    }
  }, [formData.entry_date, resolvePeriodIdForDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [entriesRes, accountsRes] = await Promise.all([
        fetch("/api/accounting/journal-entries"),
        fetch("/api/accounting/chart-of-accounts"),
      ]);

      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        // Handle both array and object response formats
        const entriesArray = Array.isArray(entriesData) 
          ? entriesData 
          : (entriesData.entries || []);
        setEntries(entriesArray);
      }

      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        // Handle both array and object response formats
        const accountsArray = Array.isArray(accountsData) 
          ? accountsData 
          : (accountsData.accounts || []);
        setAccounts(accountsArray);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setEntries([]);
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
      posted: "default",
    };
    return (
      <Badge variant={variants[status.toLowerCase()] || "default"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const calculateTotals = () => {
    const totalDebit = formLines.reduce(
      (sum, line) => sum + (parseFloat(line.debit) || 0),
      0
    );
    const totalCredit = formLines.reduce(
      (sum, line) => sum + (parseFloat(line.credit) || 0),
      0
    );
    const difference = totalDebit - totalCredit;
    return { totalDebit, totalCredit, difference };
  };

  const isBalanced = () => {
    const { difference } = calculateTotals();
    return Math.abs(difference) < 0.01;
  };

  const addLine = () => {
    setFormLines([
      ...formLines,
      {
        tempId: `line-${Date.now()}`,
        account_id: null,
        description: "",
        debit: "",
        credit: "",
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

  const handleOpenDialog = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        entry_date: entry.entry_date.split("T")[0],
        description: entry.description,
      });

      if (entry.lines && entry.lines.length > 0) {
        setFormLines(
          entry.lines.map((line, index) => ({
            tempId: `line-${index}`,
            account_id: line.account_id,
            description: line.description,
            debit: line.debit.toString(),
            credit: line.credit.toString(),
          }))
        );
      }
    } else {
      setEditingEntry(null);
      setFormData({
        entry_date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setFormLines([
        {
          tempId: "line-1",
          account_id: null,
          description: "",
          debit: "",
          credit: "",
        },
      ]);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingEntry(null);
  };

  const handleViewEntry = async (entryId: number) => {
    try {
      const response = await fetch(
        `/api/accounting/journal-entries/${entryId}`
      );
      if (response.ok) {
        const entry = await response.json();
        setViewingEntry(entry);
        setIsViewDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching entry details:", error);
    }
  };

  const handleSubmit = async () => {
    if (!isBalanced()) {
      alert("Entry is not balanced! Debits must equal credits.");
      return;
    }

    if (periodGuardActive) {
      alert(closedHelperText);
      return;
    }

    if (formLines.some((line) => !line.account_id)) {
      alert("Please select an account for all lines.");
      return;
    }

    const lines = formLines.map((line) => ({
      account_id: line.account_id,
      description: line.description,
      debit: parseFloat(line.debit) || 0,
      credit: parseFloat(line.credit) || 0,
    }));

    const payload = {
      ...formData,
      lines,
    };

    try {
      const url = editingEntry
        ? `/api/accounting/journal-entries/${editingEntry.id}`
        : "/api/accounting/journal-entries";
      const method = editingEntry ? "PUT" : "POST";

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
        alert(`Error: ${error.error || "Failed to save entry"}`);
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry");
    }
  };

  const handlePost = async (entryId: number) => {
    if (!confirm("Post this journal entry? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/accounting/journal-entries/${entryId}/post`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to post entry"}`);
      }
    } catch (error) {
      console.error("Error posting entry:", error);
      alert("Failed to post entry");
    }
  };

  const handleDelete = async (entryId: number) => {
    if (!confirm("Delete this journal entry?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/accounting/journal-entries/${entryId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to delete entry"}`);
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry");
    }
  };

  const filterEntries = () => {
    if (!Array.isArray(entries)) {
      return [];
    }
    
    return entries.filter((entry) => {
      const matchesSearch =
        entry.entry_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        entry.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  };

  const filteredEntries = filterEntries();
  const { totalDebit, totalCredit, difference } = calculateTotals();

  const closedHelperText =
    "This accounting period is closed. Adjustments must be posted in the next open period.";
  const closedBannerText =
    "This period is closed. Transactions are locked. Use the next open period for adjustments.";
  const periodGuardLoading = resolvingPeriod || periodLoading;
  const periodGuardActive =
    !formPeriodId ||
    !periodState.isOpen ||
    !periodState.canPostJournal ||
    periodState.status === "closed";
  const showClosedHelper =
    !!formPeriodId &&
    (periodState.status === "closed" || !periodState.isOpen || !periodState.canPostJournal);
  const showBanner = periodGuardActive || periodGuardLoading;
  const showProductionBanner = productionMode;

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 p-6">
        {showBanner && (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{closedBannerText}</p>
              <p className="text-xs text-amber-800">Buttons are disabled until an open period is selected.</p>
            </div>
          </div>
        )}
        {showProductionBanner && (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
            <Lock className="h-5 w-5 text-amber-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Ocean ERP is running in Production Mode.</p>
              <p className="text-xs text-amber-800">{productionHelper}</p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
            <p className="text-muted-foreground">
              Record and manage accounting journal entries
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => handleOpenDialog()} disabled={showBanner || productionMode}>
                <Plus className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </TooltipTrigger>
            {(showBanner || productionMode) && (
              <TooltipContent className="max-w-xs text-sm">
                {productionMode ? productionTooltip : periodGuardLoading
                  ? "Validating accounting period..."
                  : closedBannerText}
              </TooltipContent>
            )}
          </Tooltip>
        </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Journal Entries</CardTitle>
              <CardDescription>
                {filteredEntries.length} entries found
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="posted">Posted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No journal entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.entry_number}
                    </TableCell>
                    <TableCell>{formatDate(entry.entry_date)}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right">
                      {formatIDR(entry.total_debit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatIDR(entry.total_credit)}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewEntry(entry.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {entry.status.toLowerCase() === "draft" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(entry)}
                              disabled={productionMode}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <JournalPostButton entry={entry} onPost={handlePost} productionMode={productionMode} productionTooltip={productionTooltip} />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(entry.id)}
                              disabled={productionMode}
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
              {editingEntry ? "Edit Journal Entry" : "New Journal Entry"}
            </DialogTitle>
            <DialogDescription>
              {editingEntry
                ? "Update the journal entry details"
                : "Create a new journal entry with line items"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_date">Entry Date</Label>
                <Input
                  id="entry_date"
                  type="date"
                  value={formData.entry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, entry_date: e.target.value })
                  }
                  disabled={productionMode}
                />
                {productionMode && (
                  <p className="text-xs text-amber-800">{productionHelper}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Entry description"
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Line Items</h3>
                <Button onClick={addLine} size="sm" variant="outline" disabled={productionMode}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Line
                </Button>
              </div>

              <div className="space-y-3">
                {formLines.map((line, index) => (
                  <div
                    key={line.tempId}
                    className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="col-span-3 space-y-1">
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

                    <div className="col-span-3 space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={line.description}
                        onChange={(e) =>
                          updateLine(line.tempId, "description", e.target.value)
                        }
                        placeholder="Line description"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Debit</Label>
                      <Input
                        type="number"
                        value={line.debit}
                        onChange={(e) =>
                          updateLine(line.tempId, "debit", e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <Label className="text-xs">Credit</Label>
                      <Input
                        type="number"
                        value={line.credit}
                        onChange={(e) =>
                          updateLine(line.tempId, "credit", e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-span-2 flex items-end justify-end">
                      {formLines.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLine(line.tempId)}
                          className="text-red-600"
                          disabled={productionMode}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                  <div className="text-right">
                    <span className="text-muted-foreground">Total Debit: </span>
                    <span>{formatIDR(totalDebit)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">Total Credit: </span>
                    <span>{formatIDR(totalCredit)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">Difference: </span>
                    <span
                      className={
                        isBalanced() ? "text-green-600" : "text-red-600"
                      }
                    >
                      {formatIDR(Math.abs(difference))}
                    </span>
                  </div>
                </div>
                {!isBalanced() && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    ⚠️ Entry is not balanced! Debits must equal credits.
                  </p>
                )}

                {showClosedHelper && (
                  <Alert className="mt-4 border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-900">
                      <p className="font-medium">{closedHelperText}</p>
                    </AlertDescription>
                  </Alert>
                )}

                {periodResolveError && (
                  <p className="mt-2 text-sm text-amber-800">{periodResolveError}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSubmit}
                  disabled={productionMode || !isBalanced() || periodGuardLoading || periodGuardActive}
                >
                  {periodGuardLoading
                    ? "Checking period..."
                    : editingEntry
                      ? "Update Entry"
                      : "Create Entry"}
                </Button>
              </TooltipTrigger>
              {(productionMode || periodGuardActive || periodGuardLoading) && (
                <TooltipContent className="max-w-xs text-sm">
                  {productionMode
                    ? productionTooltip
                    : periodGuardLoading
                      ? "Validating accounting period..."
                      : closedHelperText}
                </TooltipContent>
              )}
            </Tooltip>
            {(showClosedHelper || productionMode) && (
              <p className="text-sm text-amber-800">{productionMode ? productionHelper : closedHelperText}</p>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Journal Entry Details</DialogTitle>
            <DialogDescription>
              {viewingEntry?.entry_number} - {viewingEntry?.description}
            </DialogDescription>
          </DialogHeader>

          {viewingEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-medium">
                    {formatDate(viewingEntry.entry_date)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  {getStatusBadge(viewingEntry.status)}
                </div>
                <div>
                  <span className="text-muted-foreground">Created: </span>
                  <span className="font-medium">
                    {formatDate(viewingEntry.created_at)}
                  </span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingEntry.lines?.map((line, index) => (
                      <TableRow key={line.id || index}>
                        <TableCell>
                          <div className="font-medium">{line.account_code}</div>
                          <div className="text-sm text-muted-foreground">
                            {line.account_name}
                          </div>
                        </TableCell>
                        <TableCell>{line.description}</TableCell>
                        <TableCell className="text-right">
                          {line.debit > 0 ? formatIDR(line.debit) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {line.credit > 0 ? formatIDR(line.credit) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {formatIDR(viewingEntry.total_debit)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatIDR(viewingEntry.total_credit)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
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
      </div>
    </TooltipProvider>
  );
}

function JournalPostButton({
  entry,
  onPost,
  productionMode,
  productionTooltip,
}: {
  entry: JournalEntry;
  onPost: (entryId: number) => void;
  productionMode: boolean;
  productionTooltip: string;
}) {
  const periodId = entry.period_id ?? null;
  const { state, loading } = usePeriodState(periodId ?? undefined);

  const closedHelperText =
    "This accounting period is closed. Adjustments must be posted in the next open period.";
  const guardActive =
    !periodId ||
    !state.isOpen ||
    !state.canPostJournal ||
    state.status === "closed";
  const disabled = loading || guardActive || productionMode;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPost(entry.id)}
          title="Post Entry"
          disabled={disabled}
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
        </Button>
      </TooltipTrigger>
      {(productionMode || guardActive || loading) && (
        <TooltipContent className="max-w-xs text-sm">
          {productionMode ? productionTooltip : loading ? "Checking period status..." : closedHelperText}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
