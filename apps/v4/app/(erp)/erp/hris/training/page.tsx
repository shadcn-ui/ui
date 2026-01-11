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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs";
import { GraduationCap, Plus, Edit, Trash2, Search, Eye, Users, Award } from "lucide-react";
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox";
import { toast } from "sonner";

interface TrainingProgram {
  id: number;
  program_name: string;
  description?: string;
  duration: number;
  capacity: number;
  start_date: string;
  end_date: string;
  trainer_name?: string;
  status: string;
  total_enrollments?: number;
  completed_enrollments?: number;
}

interface TrainingEnrollment {
  id: number;
  program_id: number;
  program_name?: string;
  employee_id: number;
  first_name?: string;
  last_name?: string;
  employee_number?: string;
  enrollment_date: string;
  completion_date?: string;
  status: string;
  score?: number;
  certificate_issued: boolean;
  notes?: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  employee_number: string;
}

export default function TrainingPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("programs");

  // Dialog states
  const [createProgramOpen, setCreateProgramOpen] = useState(false);
  const [editProgramOpen, setEditProgramOpen] = useState(false);
  const [viewProgramOpen, setViewProgramOpen] = useState(false);
  const [deleteProgramOpen, setDeleteProgramOpen] = useState(false);
  const [editEnrollmentOpen, setEditEnrollmentOpen] = useState(false);
  const [viewEnrollmentOpen, setViewEnrollmentOpen] = useState(false);
  
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<TrainingEnrollment | null>(null);

  // Form states
  const [programForm, setProgramForm] = useState({
    program_name: "",
    description: "",
    duration: "",
    capacity: "",
    start_date: "",
    end_date: "",
    trainer_name: "",
    status: "Draft",
  });

  const [enrollmentForm, setEnrollmentForm] = useState({
    enrollment_date: "",
    completion_date: "",
    status: "",
    score: "",
    certificate_issued: false,
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programsRes, enrollmentsRes, employeesRes] = await Promise.all([
        fetch("/api/hris/training/programs"),
        fetch("/api/hris/training/enrollments"),
        fetch("/api/hris/employees"),
      ]);

      const [programsData, enrollmentsData, employeesData] = await Promise.all([
        programsRes.json(),
        enrollmentsRes.json(),
        employeesRes.json(),
      ]);

      setPrograms(programsData.programs || programsData || []);
      setEnrollments(enrollmentsData.enrollments || enrollmentsData || []);
      setEmployees(employeesData.employees || employeesData || []);
    } catch (error) {
      toast.error("Failed to load training data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async () => {
    if (!programForm.program_name || !programForm.start_date || !programForm.end_date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/training/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...programForm,
          duration: parseInt(programForm.duration) || 0,
          capacity: parseInt(programForm.capacity) || 0,
        }),
      });

      if (response.ok) {
        toast.success("Training program created successfully");
        setCreateProgramOpen(false);
        resetProgramForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create program");
      }
    } catch (error) {
      toast.error("Failed to create program");
      console.error(error);
    }
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram || !programForm.program_name) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/training/programs/${selectedProgram.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...programForm,
          duration: parseInt(programForm.duration) || 0,
          capacity: parseInt(programForm.capacity) || 0,
        }),
      });

      if (response.ok) {
        toast.success("Training program updated successfully");
        setEditProgramOpen(false);
        setSelectedProgram(null);
        resetProgramForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update program");
      }
    } catch (error) {
      toast.error("Failed to update program");
      console.error(error);
    }
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return;

    try {
      const response = await fetch(`/api/hris/training/programs/${selectedProgram.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Training program deleted successfully");
        setDeleteProgramOpen(false);
        setSelectedProgram(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete program");
      }
    } catch (error) {
      toast.error("Failed to delete program");
      console.error(error);
    }
  };

  const handleUpdateEnrollment = async () => {
    if (!selectedEnrollment) return;

    try {
      const response = await fetch(`/api/hris/training/enrollments/${selectedEnrollment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enrollmentForm,
          score: enrollmentForm.score ? parseFloat(enrollmentForm.score) : null,
        }),
      });

      if (response.ok) {
        toast.success("Enrollment updated successfully");
        setEditEnrollmentOpen(false);
        setSelectedEnrollment(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update enrollment");
      }
    } catch (error) {
      toast.error("Failed to update enrollment");
      console.error(error);
    }
  };

  const openEditProgram = (program: TrainingProgram) => {
    setSelectedProgram(program);
    setProgramForm({
      program_name: program.program_name,
      description: program.description || "",
      duration: program.duration.toString(),
      capacity: program.capacity.toString(),
      start_date: program.start_date,
      end_date: program.end_date,
      trainer_name: program.trainer_name || "",
      status: program.status,
    });
    setEditProgramOpen(true);
  };

  const openEditEnrollment = (enrollment: TrainingEnrollment) => {
    setSelectedEnrollment(enrollment);
    setEnrollmentForm({
      enrollment_date: enrollment.enrollment_date,
      completion_date: enrollment.completion_date || "",
      status: enrollment.status,
      score: enrollment.score?.toString() || "",
      certificate_issued: enrollment.certificate_issued,
      notes: enrollment.notes || "",
    });
    setEditEnrollmentOpen(true);
  };

  const resetProgramForm = () => {
    setProgramForm({
      program_name: "",
      description: "",
      duration: "",
      capacity: "",
      start_date: "",
      end_date: "",
      trainer_name: "",
      status: "Draft",
    });
  };

  // Statistics
  const totalPrograms = programs.length;
  const activePrograms = programs.filter((p) => p.status === "Active").length;
  const totalEnrollments = enrollments.length;
  const completionRate =
    totalEnrollments > 0
      ? ((enrollments.filter((e) => e.status === "Completed").length / totalEnrollments) * 100).toFixed(1)
      : "0.0";

  // Filtered data
  const filteredPrograms = programs.filter((program) =>
    program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (program.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    program.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter((enrollment) =>
    (enrollment.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (enrollment.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (enrollment.program_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    enrollment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-gray-500",
      Active: "bg-green-500",
      Completed: "bg-blue-500",
      Cancelled: "bg-red-500",
      Enrolled: "bg-blue-500",
      "In Progress": "bg-yellow-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Training Management</h1>
          <p className="text-muted-foreground">Manage training programs and employee enrollments</p>
        </div>
        <Button onClick={() => setCreateProgramOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPrograms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrograms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
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
          <TabsTrigger value="programs">Training Programs</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="programs">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program Name</TableHead>
                    <TableHead>Duration (hrs)</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Enrollments</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredPrograms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">No programs found</TableCell>
                    </TableRow>
                  ) : (
                    filteredPrograms.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.program_name}</TableCell>
                        <TableCell>{program.duration}</TableCell>
                        <TableCell>
                          {program.capacity}
                          {program.total_enrollments && program.total_enrollments >= program.capacity && (
                            <Badge className="ml-2 bg-orange-500">Full</Badge>
                          )}
                        </TableCell>
                        <TableCell>{program.total_enrollments || 0}</TableCell>
                        <TableCell>{new Date(program.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(program.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{program.trainer_name || "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedProgram(program); setViewProgramOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditProgram(program)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedProgram(program); setDeleteProgramOpen(true); }}
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

        <TabsContent value="enrollments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Employee #</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Certificate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">No enrollments found</TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">
                          {enrollment.first_name} {enrollment.last_name}
                        </TableCell>
                        <TableCell>{enrollment.employee_number}</TableCell>
                        <TableCell>{enrollment.program_name}</TableCell>
                        <TableCell>{new Date(enrollment.enrollment_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {enrollment.completion_date
                            ? new Date(enrollment.completion_date).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{enrollment.score ? `${enrollment.score}%` : "-"}</TableCell>
                        <TableCell>
                          {enrollment.certificate_issued ? (
                            <Award className="h-4 w-4 text-green-600" />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(enrollment.status)}>{enrollment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedEnrollment(enrollment); setViewEnrollmentOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditEnrollment(enrollment)}>
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

      {/* Create Program Dialog */}
      <Dialog open={createProgramOpen} onOpenChange={setCreateProgramOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Training Program</DialogTitle>
            <DialogDescription>Add a new training program</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="program_name">Program Name *</Label>
              <Input
                id="program_name"
                value={programForm.program_name}
                onChange={(e) => setProgramForm({ ...programForm, program_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={programForm.capacity}
                  onChange={(e) => setProgramForm({ ...programForm, capacity: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={programForm.start_date}
                  onChange={(e) => setProgramForm({ ...programForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={programForm.end_date}
                  onChange={(e) => setProgramForm({ ...programForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="trainer_name">Trainer Name</Label>
              <Input
                id="trainer_name"
                value={programForm.trainer_name}
                onChange={(e) => setProgramForm({ ...programForm, trainer_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={programForm.status}
                onValueChange={(v) => setProgramForm({ ...programForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateProgramOpen(false); resetProgramForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateProgram}>Create Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog open={editProgramOpen} onOpenChange={setEditProgramOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Training Program</DialogTitle>
            <DialogDescription>Update program details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_program_name">Program Name *</Label>
              <Input
                id="edit_program_name"
                value={programForm.program_name}
                onChange={(e) => setProgramForm({ ...programForm, program_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Description</Label>
              <Textarea
                id="edit_description"
                value={programForm.description}
                onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_duration">Duration (hours)</Label>
                <Input
                  id="edit_duration"
                  type="number"
                  value={programForm.duration}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_capacity">Capacity</Label>
                <Input
                  id="edit_capacity"
                  type="number"
                  value={programForm.capacity}
                  onChange={(e) => setProgramForm({ ...programForm, capacity: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_start_date">Start Date *</Label>
                <Input
                  id="edit_start_date"
                  type="date"
                  value={programForm.start_date}
                  onChange={(e) => setProgramForm({ ...programForm, start_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_end_date">End Date *</Label>
                <Input
                  id="edit_end_date"
                  type="date"
                  value={programForm.end_date}
                  onChange={(e) => setProgramForm({ ...programForm, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_trainer_name">Trainer Name</Label>
              <Input
                id="edit_trainer_name"
                value={programForm.trainer_name}
                onChange={(e) => setProgramForm({ ...programForm, trainer_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={programForm.status}
                onValueChange={(v) => setProgramForm({ ...programForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditProgramOpen(false); setSelectedProgram(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgram}>Update Program</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Program Dialog */}
      <Dialog open={deleteProgramOpen} onOpenChange={setDeleteProgramOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this program?
              {selectedProgram && selectedProgram.total_enrollments && selectedProgram.total_enrollments > 0 && (
                <span className="block mt-2 text-orange-600">
                  Warning: This program has {selectedProgram.total_enrollments} enrollment(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteProgramOpen(false); setSelectedProgram(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Program Dialog */}
      <Dialog open={viewProgramOpen} onOpenChange={setViewProgramOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProgram?.program_name}</DialogTitle>
            <DialogDescription>Training program details</DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="grid gap-4">
              {selectedProgram.description && (
                <div>
                  <strong>Description:</strong>
                  <p className="mt-2 text-sm">{selectedProgram.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Duration:</strong> {selectedProgram.duration} hours</div>
                <div><strong>Capacity:</strong> {selectedProgram.capacity} participants</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Start Date:</strong> {new Date(selectedProgram.start_date).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(selectedProgram.end_date).toLocaleDateString()}</div>
              </div>
              {selectedProgram.trainer_name && (
                <div><strong>Trainer:</strong> {selectedProgram.trainer_name}</div>
              )}
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedProgram.status)}>{selectedProgram.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Enrollments:</strong> {selectedProgram.total_enrollments || 0}</div>
                <div><strong>Completed:</strong> {selectedProgram.completed_enrollments || 0}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewProgramOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Enrollment Dialog */}
      <Dialog open={editEnrollmentOpen} onOpenChange={setEditEnrollmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Enrollment</DialogTitle>
            <DialogDescription>
              {selectedEnrollment?.first_name} {selectedEnrollment?.last_name} - {selectedEnrollment?.program_name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="enrollment_status">Status</Label>
              <Select
                value={enrollmentForm.status}
                onValueChange={(v) => setEnrollmentForm({ ...enrollmentForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enrolled">Enrolled</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="enrollment_date">Enrollment Date</Label>
                <Input
                  id="enrollment_date"
                  type="date"
                  value={enrollmentForm.enrollment_date}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, enrollment_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="completion_date">Completion Date</Label>
                <Input
                  id="completion_date"
                  type="date"
                  value={enrollmentForm.completion_date}
                  onChange={(e) => setEnrollmentForm({ ...enrollmentForm, completion_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score (%)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={enrollmentForm.score}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, score: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="certificate_issued"
                checked={enrollmentForm.certificate_issued}
                onCheckedChange={(checked) =>
                  setEnrollmentForm({ ...enrollmentForm, certificate_issued: checked as boolean })
                }
              />
              <Label htmlFor="certificate_issued" className="cursor-pointer">
                Certificate Issued
              </Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enrollment_notes">Notes</Label>
              <Textarea
                id="enrollment_notes"
                value={enrollmentForm.notes}
                onChange={(e) => setEnrollmentForm({ ...enrollmentForm, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditEnrollmentOpen(false); setSelectedEnrollment(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEnrollment}>Update Enrollment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Enrollment Dialog */}
      <Dialog open={viewEnrollmentOpen} onOpenChange={setViewEnrollmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
            <DialogDescription>
              {selectedEnrollment?.first_name} {selectedEnrollment?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedEnrollment && (
            <div className="grid gap-4">
              <div><strong>Employee #:</strong> {selectedEnrollment.employee_number}</div>
              <div><strong>Program:</strong> {selectedEnrollment.program_name}</div>
              <div><strong>Enrollment Date:</strong> {new Date(selectedEnrollment.enrollment_date).toLocaleDateString()}</div>
              {selectedEnrollment.completion_date && (
                <div><strong>Completion Date:</strong> {new Date(selectedEnrollment.completion_date).toLocaleDateString()}</div>
              )}
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedEnrollment.status)}>{selectedEnrollment.status}</Badge>
              </div>
              {selectedEnrollment.score && (
                <div><strong>Score:</strong> {selectedEnrollment.score}%</div>
              )}
              <div className="flex items-center gap-2">
                <strong>Certificate:</strong>
                {selectedEnrollment.certificate_issued ? (
                  <Badge className="bg-green-500">Issued</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Not issued</span>
                )}
              </div>
              {selectedEnrollment.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-2 text-sm">{selectedEnrollment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewEnrollmentOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
