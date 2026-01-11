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
import { Star, Plus, Edit, Trash2, Search, Eye, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface PerformanceReview {
  id: number;
  employee_id: number;
  first_name?: string;
  last_name?: string;
  employee_number?: string;
  department_name?: string;
  position_title?: string;
  review_period: string;
  review_date: string;
  rating: number;
  reviewer_id?: number;
  reviewer_first_name?: string;
  reviewer_last_name?: string;
  goals_achieved?: string;
  areas_for_improvement?: string;
  comments?: string;
  status: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  employee_number: string;
}

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  // Form state
  const [reviewForm, setReviewForm] = useState({
    employee_id: "",
    review_period: "",
    review_date: new Date().toISOString().split('T')[0],
    rating: "3",
    reviewer_id: "",
    goals_achieved: "",
    areas_for_improvement: "",
    comments: "",
    status: "Draft",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, employeesRes] = await Promise.all([
        fetch("/api/hris/performance/reviews"),
        fetch("/api/hris/employees"),
      ]);

      const [reviewsData, employeesData] = await Promise.all([
        reviewsRes.json(),
        employeesRes.json(),
      ]);

      setReviews(reviewsData.reviews || reviewsData || []);
      setEmployees(employeesData.employees || employeesData || []);
    } catch (error) {
      toast.error("Failed to load performance data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!reviewForm.employee_id || !reviewForm.review_period || !reviewForm.rating) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("/api/hris/performance/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          employee_id: parseInt(reviewForm.employee_id),
          rating: parseInt(reviewForm.rating),
          reviewer_id: reviewForm.reviewer_id ? parseInt(reviewForm.reviewer_id) : null,
        }),
      });

      if (response.ok) {
        toast.success("Performance review created successfully");
        setCreateOpen(false);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create review");
      }
    } catch (error) {
      toast.error("Failed to create review");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedReview || !reviewForm.review_period || !reviewForm.rating) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/hris/performance/reviews/${selectedReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewForm,
          rating: parseInt(reviewForm.rating),
          reviewer_id: reviewForm.reviewer_id ? parseInt(reviewForm.reviewer_id) : null,
        }),
      });

      if (response.ok) {
        toast.success("Performance review updated successfully");
        setEditOpen(false);
        setSelectedReview(null);
        resetForm();
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update review");
      }
    } catch (error) {
      toast.error("Failed to update review");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      const response = await fetch(`/api/hris/performance/reviews/${selectedReview.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Performance review deleted successfully");
        setDeleteOpen(false);
        setSelectedReview(null);
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to delete review");
      }
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  };

  const openEdit = (review: PerformanceReview) => {
    setSelectedReview(review);
    setReviewForm({
      employee_id: review.employee_id.toString(),
      review_period: review.review_period,
      review_date: review.review_date,
      rating: review.rating.toString(),
      reviewer_id: review.reviewer_id?.toString() || "",
      goals_achieved: review.goals_achieved || "",
      areas_for_improvement: review.areas_for_improvement || "",
      comments: review.comments || "",
      status: review.status,
    });
    setEditOpen(true);
  };

  const resetForm = () => {
    setReviewForm({
      employee_id: "",
      review_period: "",
      review_date: new Date().toISOString().split('T')[0],
      rating: "3",
      reviewer_id: "",
      goals_achieved: "",
      areas_for_improvement: "",
      comments: "",
      status: "Draft",
    });
  };

  // Statistics
  const totalReviews = reviews.length;
  const completedReviews = reviews.filter((r) => r.status === "Completed").length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const pendingReviews = reviews.filter((r) => r.status === "Draft").length;

  // Filtered data
  const filteredReviews = reviews.filter((review) =>
    (review.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (review.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (review.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    review.review_period.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Draft: "bg-gray-500",
      Completed: "bg-green-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const StarRatingInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 cursor-pointer transition-colors ${
                i < value ? "fill-yellow-500 text-yellow-500" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">({value}/5)</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Reviews</h1>
          <p className="text-muted-foreground">Manage employee performance evaluations</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Review
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}/5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
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
                <TableHead>Department</TableHead>
                <TableHead>Review Period</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">No reviews found</TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {review.first_name} {review.last_name}
                    </TableCell>
                    <TableCell>{review.employee_number}</TableCell>
                    <TableCell>{review.department_name}</TableCell>
                    <TableCell>{review.review_period}</TableCell>
                    <TableCell>{new Date(review.review_date).toLocaleDateString()}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>
                      {review.reviewer_first_name && review.reviewer_last_name
                        ? `${review.reviewer_first_name} ${review.reviewer_last_name}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedReview(review); setViewOpen(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(review)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedReview(review); setDeleteOpen(true); }}
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>Add a new performance evaluation</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={reviewForm.employee_id}
                onValueChange={(v) => setReviewForm({ ...reviewForm, employee_id: v })}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="review_period">Review Period *</Label>
                <Select
                  value={reviewForm.review_period}
                  onValueChange={(v) => setReviewForm({ ...reviewForm, review_period: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                    <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                    <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                    <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                    <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                    <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                    <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                    <SelectItem value="Annual 2024">Annual 2024</SelectItem>
                    <SelectItem value="Annual 2025">Annual 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="review_date">Review Date</Label>
                <Input
                  id="review_date"
                  type="date"
                  value={reviewForm.review_date}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Rating *</Label>
              <StarRatingInput
                value={parseInt(reviewForm.rating)}
                onChange={(v) => setReviewForm({ ...reviewForm, rating: v.toString() })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select
                value={reviewForm.reviewer_id}
                onValueChange={(v) => setReviewForm({ ...reviewForm, reviewer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="goals_achieved">Goals Achieved</Label>
              <Textarea
                id="goals_achieved"
                value={reviewForm.goals_achieved}
                onChange={(e) => setReviewForm({ ...reviewForm, goals_achieved: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="areas_for_improvement">Areas for Improvement</Label>
              <Textarea
                id="areas_for_improvement"
                value={reviewForm.areas_for_improvement}
                onChange={(e) => setReviewForm({ ...reviewForm, areas_for_improvement: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={reviewForm.comments}
                onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={reviewForm.status}
                onValueChange={(v) => setReviewForm({ ...reviewForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar to Create */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Performance Review</DialogTitle>
            <DialogDescription>Update performance evaluation</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Employee</Label>
              <Input
                value={
                  selectedReview
                    ? `${selectedReview.first_name} ${selectedReview.last_name} (${selectedReview.employee_number})`
                    : ""
                }
                disabled
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_review_period">Review Period *</Label>
                <Select
                  value={reviewForm.review_period}
                  onValueChange={(v) => setReviewForm({ ...reviewForm, review_period: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                    <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                    <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                    <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                    <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                    <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                    <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                    <SelectItem value="Annual 2024">Annual 2024</SelectItem>
                    <SelectItem value="Annual 2025">Annual 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_review_date">Review Date</Label>
                <Input
                  id="edit_review_date"
                  type="date"
                  value={reviewForm.review_date}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Rating *</Label>
              <StarRatingInput
                value={parseInt(reviewForm.rating)}
                onChange={(v) => setReviewForm({ ...reviewForm, rating: v.toString() })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_reviewer">Reviewer</Label>
              <Select
                value={reviewForm.reviewer_id}
                onValueChange={(v) => setReviewForm({ ...reviewForm, reviewer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reviewer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_goals_achieved">Goals Achieved</Label>
              <Textarea
                id="edit_goals_achieved"
                value={reviewForm.goals_achieved}
                onChange={(e) => setReviewForm({ ...reviewForm, goals_achieved: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_areas_for_improvement">Areas for Improvement</Label>
              <Textarea
                id="edit_areas_for_improvement"
                value={reviewForm.areas_for_improvement}
                onChange={(e) => setReviewForm({ ...reviewForm, areas_for_improvement: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_comments">Comments</Label>
              <Textarea
                id="edit_comments"
                value={reviewForm.comments}
                onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={reviewForm.status}
                onValueChange={(v) => setReviewForm({ ...reviewForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditOpen(false); setSelectedReview(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Performance Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setSelectedReview(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
            <DialogDescription>
              {selectedReview?.first_name} {selectedReview?.last_name} - {selectedReview?.review_period}
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Employee:</strong> {selectedReview.first_name} {selectedReview.last_name}</div>
                <div><strong>Employee #:</strong> {selectedReview.employee_number}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Department:</strong> {selectedReview.department_name}</div>
                <div><strong>Position:</strong> {selectedReview.position_title}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Review Period:</strong> {selectedReview.review_period}</div>
                <div><strong>Review Date:</strong> {new Date(selectedReview.review_date).toLocaleDateString()}</div>
              </div>
              <div>
                <strong>Rating:</strong>
                <div className="mt-2">{renderStars(selectedReview.rating)}</div>
              </div>
              <div>
                <strong>Reviewer:</strong>{" "}
                {selectedReview.reviewer_first_name && selectedReview.reviewer_last_name
                  ? `${selectedReview.reviewer_first_name} ${selectedReview.reviewer_last_name}`
                  : "Not assigned"}
              </div>
              <div>
                <strong>Status:</strong> <Badge className={getStatusColor(selectedReview.status)}>{selectedReview.status}</Badge>
              </div>
              {selectedReview.goals_achieved && (
                <div>
                  <strong>Goals Achieved:</strong>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{selectedReview.goals_achieved}</p>
                </div>
              )}
              {selectedReview.areas_for_improvement && (
                <div>
                  <strong>Areas for Improvement:</strong>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{selectedReview.areas_for_improvement}</p>
                </div>
              )}
              {selectedReview.comments && (
                <div>
                  <strong>Comments:</strong>
                  <p className="mt-2 text-sm whitespace-pre-wrap">{selectedReview.comments}</p>
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
