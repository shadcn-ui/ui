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
import { Briefcase, Plus, Edit, Trash2, Search, Users, Eye } from "lucide-react";
import { toast } from "sonner";

interface JobPosting {
  id: number;
  title: string;
  department_id: number;
  department_name?: string;
  position_id: number;
  position_title?: string;
  employment_type: string;
  location: string;
  salary_min: number;
  salary_max: number;
  openings: number;
  description: string;
  requirements: string;
  status: string;
  posted_date: string;
  closing_date: string;
  application_count?: number;
}

interface Application {
  id: number;
  job_posting_id: number;
  job_title?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  stage: string;
  rating: number;
  notes: string;
  applied_date: string;
  interview_date?: string;
  offer_date?: string;
  hired_date?: string;
  rejection_reason?: string;
}

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  title: string;
}

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");

  // Dialog states
  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [editJobOpen, setEditJobOpen] = useState(false);
  const [viewJobOpen, setViewJobOpen] = useState(false);
  const [deleteJobOpen, setDeleteJobOpen] = useState(false);
  const [editApplicationOpen, setEditApplicationOpen] = useState(false);
  const [viewApplicationOpen, setViewApplicationOpen] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Form states for job
  const [jobForm, setJobForm] = useState({
    title: "",
    department_id: "",
    position_id: "",
    employment_type: "Full-time",
    location: "",
    salary_min: "",
    salary_max: "",
    openings: "1",
    description: "",
    requirements: "",
    status: "Draft",
    posted_date: new Date().toISOString().split('T')[0],
    closing_date: "",
  });

  // Form state for application
  const [applicationForm, setApplicationForm] = useState({
    status: "",
    stage: "",
    rating: "",
    notes: "",
    interview_date: "",
    offer_date: "",
    hired_date: "",
    rejection_reason: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, deptsRes, posRes] = await Promise.all([
        fetch("/api/hris/recruitment/jobs"),
        fetch("/api/hris/recruitment/applications"),
        fetch("/api/hris/departments"),
        fetch("/api/hris/positions"),
      ]);

      const [jobsData, appsData, deptsData, posData] = await Promise.all([
        jobsRes.json(),
        appsRes.json(),
        deptsRes.json(),
        posRes.json(),
      ]);

      setJobs(jobsData);
      setApplications(appsData);
      setDepartments(deptsData);
      setPositions(posData);
    } catch (error) {
      toast.error("Failed to load recruitment data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async () => {
    if (!jobForm.title || !jobForm.department_id || !jobForm.position_id) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/recruitment/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          salary_min: parseFloat(jobForm.salary_min) || 0,
          salary_max: parseFloat(jobForm.salary_max) || 0,
          openings: parseInt(jobForm.openings) || 1,
        }),
      });

      if (response.ok) {
        toast.success("Job posting created successfully");
        setCreateJobOpen(false);
        resetJobForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create job posting");
      }
    } catch (error) {
      toast.error("Failed to create job posting");
      console.error(error);
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob || !jobForm.title) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/recruitment/jobs/${selectedJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          salary_min: parseFloat(jobForm.salary_min) || 0,
          salary_max: parseFloat(jobForm.salary_max) || 0,
          openings: parseInt(jobForm.openings) || 1,
        }),
      });

      if (response.ok) {
        toast.success("Job posting updated successfully");
        setEditJobOpen(false);
        setSelectedJob(null);
        resetJobForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update job posting");
      }
    } catch (error) {
      toast.error("Failed to update job posting");
      console.error(error);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      const response = await fetch(`/api/hris/recruitment/jobs/${selectedJob.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Job posting deleted successfully");
        setDeleteJobOpen(false);
        setSelectedJob(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete job posting");
      }
    } catch (error) {
      toast.error("Failed to delete job posting");
      console.error(error);
    }
  };

  const handleUpdateApplication = async () => {
    if (!selectedApplication) return;

    try {
      const response = await fetch(`/api/hris/recruitment/applications/${selectedApplication.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...applicationForm,
          rating: applicationForm.rating ? parseInt(applicationForm.rating) : null,
        }),
      });

      if (response.ok) {
        toast.success("Application updated successfully");
        setEditApplicationOpen(false);
        setSelectedApplication(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update application");
      }
    } catch (error) {
      toast.error("Failed to update application");
      console.error(error);
    }
  };

  const openEditJob = (job: JobPosting) => {
    setSelectedJob(job);
    setJobForm({
      title: job.title,
      department_id: job.department_id.toString(),
      position_id: job.position_id.toString(),
      employment_type: job.employment_type,
      location: job.location,
      salary_min: job.salary_min.toString(),
      salary_max: job.salary_max.toString(),
      openings: job.openings.toString(),
      description: job.description,
      requirements: job.requirements,
      status: job.status,
      posted_date: job.posted_date,
      closing_date: job.closing_date,
    });
    setEditJobOpen(true);
  };

  const openEditApplication = (app: Application) => {
    setSelectedApplication(app);
    setApplicationForm({
      status: app.status,
      stage: app.stage,
      rating: app.rating?.toString() || "",
      notes: app.notes || "",
      interview_date: app.interview_date || "",
      offer_date: app.offer_date || "",
      hired_date: app.hired_date || "",
      rejection_reason: app.rejection_reason || "",
    });
    setEditApplicationOpen(true);
  };

  const resetJobForm = () => {
    setJobForm({
      title: "",
      department_id: "",
      position_id: "",
      employment_type: "Full-time",
      location: "",
      salary_min: "",
      salary_max: "",
      openings: "1",
      description: "",
      requirements: "",
      status: "Draft",
      posted_date: new Date().toISOString().split('T')[0],
      closing_date: "",
    });
  };

  // Statistics
  const totalJobs = jobs.length;
  const publishedJobs = jobs.filter((j) => j.status === "Published").length;
  const totalApplications = applications.length;
  const newApplications = applications.filter((a) => a.status === "New").length;

  // Filtered data
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplications = applications.filter((app) =>
    app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-gray-500",
      Published: "bg-green-500",
      Closed: "bg-red-500",
      New: "bg-blue-500",
      Screening: "bg-yellow-500",
      Interview: "bg-purple-500",
      Offer: "bg-orange-500",
      Hired: "bg-green-500",
      Rejected: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and applications</p>
        </div>
        <Button onClick={() => setCreateJobOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Job Posting
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newApplications}</div>
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
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Openings</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">No jobs found</TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.department_name}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.openings}</TableCell>
                        <TableCell>{job.application_count || 0}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedJob(job); setViewJobOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditJob(job)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedJob(job); setDeleteJobOpen(true); }}
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

        <TabsContent value="applications">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">No applications found</TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{`${app.first_name} ${app.last_name}`}</TableCell>
                        <TableCell>{app.job_title}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.stage}</TableCell>
                        <TableCell>{app.rating ? `${app.rating}/5` : "-"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>{app.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(app.applied_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => { setSelectedApplication(app); setViewApplicationOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditApplication(app)}>
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

      {/* Create Job Dialog */}
      <Dialog open={createJobOpen} onOpenChange={setCreateJobOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Job Posting</DialogTitle>
            <DialogDescription>Add a new job opening</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={jobForm.department_id} onValueChange={(v) => setJobForm({ ...jobForm, department_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={jobForm.position_id} onValueChange={(v) => setJobForm({ ...jobForm, position_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id.toString()}>{pos.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Employment Type</Label>
                <Select value={jobForm.employment_type} onValueChange={(v) => setJobForm({ ...jobForm, employment_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Min Salary</Label>
                <Input
                  type="number"
                  value={jobForm.salary_min}
                  onChange={(e) => setJobForm({ ...jobForm, salary_min: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Salary</Label>
                <Input
                  type="number"
                  value={jobForm.salary_max}
                  onChange={(e) => setJobForm({ ...jobForm, salary_max: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Openings</Label>
                <Input
                  type="number"
                  value={jobForm.openings}
                  onChange={(e) => setJobForm({ ...jobForm, openings: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Posted Date</Label>
                <Input
                  type="date"
                  value={jobForm.posted_date}
                  onChange={(e) => setJobForm({ ...jobForm, posted_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Closing Date</Label>
                <Input
                  type="date"
                  value={jobForm.closing_date}
                  onChange={(e) => setJobForm({ ...jobForm, closing_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={jobForm.status} onValueChange={(v) => setJobForm({ ...jobForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Requirements</Label>
              <Textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateJobOpen(false); resetJobForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>Create Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog - Same as Create but with handleUpdateJob */}
      <Dialog open={editJobOpen} onOpenChange={setEditJobOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>Update job posting details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Same form fields as Create */}
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Job Title *</Label>
              <Input
                id="edit-title"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Department *</Label>
                <Select value={jobForm.department_id} onValueChange={(v) => setJobForm({ ...jobForm, department_id: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Position *</Label>
                <Select value={jobForm.position_id} onValueChange={(v) => setJobForm({ ...jobForm, position_id: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id.toString()}>{pos.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Employment Type</Label>
                <Select value={jobForm.employment_type} onValueChange={(v) => setJobForm({ ...jobForm, employment_type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Location</Label>
                <Input
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Min Salary</Label>
                <Input
                  type="number"
                  value={jobForm.salary_min}
                  onChange={(e) => setJobForm({ ...jobForm, salary_min: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Salary</Label>
                <Input
                  type="number"
                  value={jobForm.salary_max}
                  onChange={(e) => setJobForm({ ...jobForm, salary_max: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Openings</Label>
                <Input
                  type="number"
                  value={jobForm.openings}
                  onChange={(e) => setJobForm({ ...jobForm, openings: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Posted Date</Label>
                <Input
                  type="date"
                  value={jobForm.posted_date}
                  onChange={(e) => setJobForm({ ...jobForm, posted_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Closing Date</Label>
                <Input
                  type="date"
                  value={jobForm.closing_date}
                  onChange={(e) => setJobForm({ ...jobForm, closing_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={jobForm.status} onValueChange={(v) => setJobForm({ ...jobForm, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label>Requirements</Label>
              <Textarea
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditJobOpen(false); setSelectedJob(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateJob}>Update Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Job Dialog */}
      <Dialog open={deleteJobOpen} onOpenChange={setDeleteJobOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting?
              {selectedJob && selectedJob.application_count && selectedJob.application_count > 0 && (
                <span className="block mt-2 text-orange-600">
                  Note: This job has {selectedJob.application_count} application(s) and will be marked as Closed instead of deleted.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteJobOpen(false); setSelectedJob(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Application Dialog */}
      <Dialog open={editApplicationOpen} onOpenChange={setEditApplicationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application</DialogTitle>
            <DialogDescription>Update candidate application status and details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={applicationForm.status} onValueChange={(v) => setApplicationForm({ ...applicationForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Hired">Hired</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Stage</Label>
                <Select value={applicationForm.stage} onValueChange={(v) => setApplicationForm({ ...applicationForm, stage: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                    <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                    <SelectItem value="Final Interview">Final Interview</SelectItem>
                    <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={applicationForm.rating}
                onChange={(e) => setApplicationForm({ ...applicationForm, rating: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Interview Date</Label>
                <Input
                  type="date"
                  value={applicationForm.interview_date}
                  onChange={(e) => setApplicationForm({ ...applicationForm, interview_date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Offer Date</Label>
                <Input
                  type="date"
                  value={applicationForm.offer_date}
                  onChange={(e) => setApplicationForm({ ...applicationForm, offer_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Hired Date</Label>
              <Input
                type="date"
                value={applicationForm.hired_date}
                onChange={(e) => setApplicationForm({ ...applicationForm, hired_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Textarea
                value={applicationForm.notes}
                onChange={(e) => setApplicationForm({ ...applicationForm, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Rejection Reason</Label>
              <Input
                value={applicationForm.rejection_reason}
                onChange={(e) => setApplicationForm({ ...applicationForm, rejection_reason: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditApplicationOpen(false); setSelectedApplication(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateApplication}>Update Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Job Dialog */}
      <Dialog open={viewJobOpen} onOpenChange={setViewJobOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.department_name} - {selectedJob?.position_title}</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Employment Type:</strong> {selectedJob.employment_type}</div>
                <div><strong>Location:</strong> {selectedJob.location}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Salary Range:</strong> ${selectedJob.salary_min.toLocaleString()} - ${selectedJob.salary_max.toLocaleString()}</div>
                <div><strong>Openings:</strong> {selectedJob.openings}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Posted:</strong> {new Date(selectedJob.posted_date).toLocaleDateString()}</div>
                <div><strong>Closing:</strong> {new Date(selectedJob.closing_date).toLocaleDateString()}</div>
              </div>
              <div><strong>Applications:</strong> {selectedJob.application_count || 0}</div>
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedJob.status)}>{selectedJob.status}</Badge>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-2 text-sm">{selectedJob.description}</p>
              </div>
              <div>
                <strong>Requirements:</strong>
                <p className="mt-2 text-sm">{selectedJob.requirements}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewJobOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={viewApplicationOpen} onOpenChange={setViewApplicationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedApplication?.first_name} {selectedApplication?.last_name}</DialogTitle>
            <DialogDescription>{selectedApplication?.job_title}</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid gap-4">
              <div><strong>Email:</strong> {selectedApplication.email}</div>
              <div><strong>Phone:</strong> {selectedApplication.phone}</div>
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedApplication.status)}>{selectedApplication.status}</Badge>
              </div>
              <div><strong>Stage:</strong> {selectedApplication.stage}</div>
              <div><strong>Rating:</strong> {selectedApplication.rating ? `${selectedApplication.rating}/5` : "Not rated"}</div>
              <div><strong>Applied:</strong> {new Date(selectedApplication.applied_date).toLocaleDateString()}</div>
              {selectedApplication.interview_date && (
                <div><strong>Interview Date:</strong> {new Date(selectedApplication.interview_date).toLocaleDateString()}</div>
              )}
              {selectedApplication.offer_date && (
                <div><strong>Offer Date:</strong> {new Date(selectedApplication.offer_date).toLocaleDateString()}</div>
              )}
              {selectedApplication.hired_date && (
                <div><strong>Hired Date:</strong> {new Date(selectedApplication.hired_date).toLocaleDateString()}</div>
              )}
              {selectedApplication.notes && (
                <div>
                  <strong>Notes:</strong>
                  <p className="mt-2 text-sm">{selectedApplication.notes}</p>
                </div>
              )}
              {selectedApplication.rejection_reason && (
                <div>
                  <strong>Rejection Reason:</strong>
                  <p className="mt-2 text-sm">{selectedApplication.rejection_reason}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewApplicationOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
