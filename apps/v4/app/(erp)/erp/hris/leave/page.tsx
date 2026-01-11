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
import { Calendar, Plus, Edit, Trash2, Search, Eye, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface LeaveRequest {
  id: number;
  employee_id: number;
  first_name?: string;
  last_name?: string;
  employee_number?: string;
  leave_type_id: number;
  leave_type_name?: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason?: string;
  status: string;
  approver_id?: number;
  approver_first_name?: string;
  approver_last_name?: string;
  approver_notes?: string;
  approved_date?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  employee_number: string;
}

interface LeaveType {
  id: number;
  name: string;
  days_per_year: number;
}

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approverNotes, setApproverNotes] = useState("");

  // Form state
  const [requestForm, setRequestForm] = useState({
    employee_id: "",
    leave_type_id: "",
    start_date: "",
    end_date: "",
    days_requested: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, employeesRes, typesRes] = await Promise.all([
        fetch("/api/hrm/leave-requests"),
        fetch("/api/hris/employees"),
        fetch("/api/hrm/leave-requests?types=true"),
      ]);

      const [requestsData, employeesData, typesData] = await Promise.all([
        requestsRes.json(),
        employeesRes.json(),
        typesRes.json(),
      ]);

      setRequests(requestsData.requests || requestsData || []);
      setEmployees(employeesData.employees || employeesData || []);
      setLeaveTypes(typesData.types || typesData || []);
    } catch (error) {
      toast.error("Failed to load leave data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  useEffect(() => {
    if (requestForm.start_date && requestForm.end_date) {
      const days = calculateDays(requestForm.start_date, requestForm.end_date);
      setRequestForm((prev) => ({ ...prev, days_requested: days.toString() }));
    }
  }, [requestForm.start_date, requestForm.end_date]);

  const handleCreate = async () => {
    if (!requestForm.employee_id || !requestForm.leave_type_id || !requestForm.start_date || !requestForm.end_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/leave/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestForm,
          employee_id: parseInt(requestForm.employee_id),
          leave_type_id: parseInt(requestForm.leave_type_id),
          days_requested: parseFloat(requestForm.days_requested),
        }),
      });

      if (response.ok) {
        toast.success("Leave request created successfully");
        setCreateOpen(false);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create leave request");
      }
    } catch (error) {
      toast.error("Failed to create leave request");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedRequest || !requestForm.start_date || !requestForm.end_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/leave/requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...requestForm,
          days_requested: parseFloat(requestForm.days_requested),
        }),
      });

      if (response.ok) {
        toast.success("Leave request updated successfully");
        setEditOpen(false);
        setSelectedRequest(null);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update leave request");
      }
    } catch (error) {
      toast.error("Failed to update leave request");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`/api/hris/leave/requests/${selectedRequest.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Leave request cancelled successfully");
        setDeleteOpen(false);
        setSelectedRequest(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to cancel leave request");
      }
    } catch (error) {
      toast.error("Failed to cancel leave request");
      console.error(error);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`/api/hris/leave/requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Approved",
          approver_notes: approverNotes,
          approved_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        toast.success("Leave request approved");
        setApproveOpen(false);
        setSelectedRequest(null);
        setApproverNotes("");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to approve request");
      }
    } catch (error) {
      toast.error("Failed to approve request");
      console.error(error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch(`/api/hris/leave/requests/${selectedRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Rejected",
          approver_notes: approverNotes,
          approved_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        toast.success("Leave request rejected");
        setRejectOpen(false);
        setSelectedRequest(null);
        setApproverNotes("");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to reject request");
      }
    } catch (error) {
      toast.error("Failed to reject request");
      console.error(error);
    }
  };

  const openEdit = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setRequestForm({
      employee_id: request.employee_id.toString(),
      leave_type_id: request.leave_type_id.toString(),
      start_date: request.start_date,
      end_date: request.end_date,
      days_requested: request.days_requested.toString(),
      reason: request.reason || "",
      status: request.status,
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setRequestForm({
      employee_id: "",
      leave_type_id: "",
      start_date: "",
      end_date: "",
      days_requested: "",
      reason: "",
      status: "Pending",
    });
  };

  // Statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "Pending").length;
  const approvedRequests = requests.filter((r) => r.status === "Approved").length;
  const rejectedRequests = requests.filter((r) => r.status === "Rejected").length;

  // Filtered data
  const filteredRequests = requests.filter((request) =>
    (request.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (request.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (request.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (request.leave_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    request.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Pending: "bg-yellow-500",
      Approved: "bg-green-500",
      Rejected: "bg-red-500",
      Cancelled: "bg-gray-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Leave Request
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leave requests..."
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
                <TableHead>Employee</TableHead>
                <TableHead>Employee #</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">No leave requests found</TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.first_name} {request.last_name}
                    </TableCell>
                    <TableCell>{request.employee_number}</TableCell>
                    <TableCell>{request.leave_type_name}</TableCell>
                    <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{request.days_requested}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.approver_first_name && request.approver_last_name
                        ? `${request.approver_first_name} ${request.approver_last_name}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setSelectedRequest(request); setApproveOpen(true); }}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setSelectedRequest(request); setRejectOpen(true); }}
                            >
                              <XCircle className="h-4 w-4 mr-1 text-red-600" />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedRequest(request); setViewOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(request)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedRequest(request); setDeleteOpen(true); }}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Leave Request</DialogTitle>
            <DialogDescription>Submit a new leave request</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={requestForm.employee_id}
                onValueChange={(v) => setRequestForm({ ...requestForm, employee_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.first_name} {emp.last_name} ({emp.employee_number})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="leave_type">Leave Type *</Label>
              <Select
                value={requestForm.leave_type_id}
                onValueChange={(v) => setRequestForm({ ...requestForm, leave_type_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name} ({type.days_per_year} days/year)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={requestForm.start_date}
                  onChange={(e) => setRequestForm({ ...requestForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={requestForm.end_date}
                  onChange={(e) => setRequestForm({ ...requestForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days_requested">Days Requested</Label>
              <Input
                id="days_requested"
                type="number"
                value={requestForm.days_requested}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={requestForm.reason}
                onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Leave Request</DialogTitle>
            <DialogDescription>Update leave request details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Employee</Label>
              <Input
                value={
                  selectedRequest
                    ? `${selectedRequest.first_name} ${selectedRequest.last_name} (${selectedRequest.employee_number})`
                    : ""
                }
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label>Leave Type</Label>
              <Input value={selectedRequest?.leave_type_name || ""} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_date">Start Date *</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={requestForm.start_date}
                  onChange={(e) => setRequestForm({ ...requestForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_date">End Date *</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={requestForm.end_date}
                  onChange={(e) => setRequestForm({ ...requestForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_days_requested">Days Requested</Label>
              <Input
                id="edit_days_requested"
                type="number"
                value={requestForm.days_requested}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_reason">Reason</Label>
              <Textarea
                id="edit_reason"
                value={requestForm.reason}
                onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setSelectedRequest(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this leave request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setSelectedRequest(null); }}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Yes, Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Approve leave request for {selectedRequest?.first_name} {selectedRequest?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="approver_notes">Notes (optional)</Label>
              <Textarea
                id="approver_notes"
                value={approverNotes}
                onChange={(e) => setApproverNotes(e.target.value)}
                rows={3}
                placeholder="Add any notes or conditions..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setApproveOpen(false); setSelectedRequest(null); setApproverNotes(""); }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Reject leave request for {selectedRequest?.first_name} {selectedRequest?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject_notes">Reason for Rejection</Label>
              <Textarea
                id="reject_notes"
                value={approverNotes}
                onChange={(e) => setApproverNotes(e.target.value)}
                rows={3}
                placeholder="Explain why this request is being rejected..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectOpen(false); setSelectedRequest(null); setApproverNotes(""); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              {selectedRequest?.first_name} {selectedRequest?.last_name} - {selectedRequest?.leave_type_name}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Employee:</strong> {selectedRequest.first_name} {selectedRequest.last_name}</div>
                <div><strong>Employee #:</strong> {selectedRequest.employee_number}</div>
              </div>
              <div><strong>Leave Type:</strong> {selectedRequest.leave_type_name}</div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Start Date:</strong> {new Date(selectedRequest.start_date).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(selectedRequest.end_date).toLocaleDateString()}</div>
              </div>
              <div><strong>Days Requested:</strong> {selectedRequest.days_requested}</div>
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
              </div>
              {selectedRequest.reason && (
                <div>
                  <strong>Reason:</strong>
                  <p className="mt-2 text-sm">{selectedRequest.reason}</p>
                </div>
              )}
              {selectedRequest.approver_first_name && selectedRequest.approver_last_name && (
                <div>
                  <strong>Approver:</strong> {selectedRequest.approver_first_name} {selectedRequest.approver_last_name}
                </div>
              )}
              {selectedRequest.approved_date && (
                <div><strong>Decision Date:</strong> {new Date(selectedRequest.approved_date).toLocaleDateString()}</div>
              )}
              {selectedRequest.approver_notes && (
                <div>
                  <strong>Approver Notes:</strong>
                  <p className="mt-2 text-sm">{selectedRequest.approver_notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
