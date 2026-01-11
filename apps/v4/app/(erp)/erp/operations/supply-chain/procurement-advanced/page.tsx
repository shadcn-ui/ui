"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/new-york-v4/ui/dialog";
import { Label } from "@/registry/new-york-v4/ui/label";
import { Textarea } from "@/registry/new-york-v4/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table";
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { toast } from "sonner";
import { 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  ClipboardList, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Users, 
  BarChart3,
  Plus,
  Search,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  AlertCircle,
  Package,
  ChevronRight,
  Home
} from "lucide-react";

export default function ProcurementAdvancedPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  
  // Purchase Requisitions State
  const [prs, setPrs] = useState<any[]>([]);
  const [prDialog, setPrDialog] = useState(false);
  const [selectedPr, setSelectedPr] = useState<any>(null);
  const [prForm, setPrForm] = useState({
    department: "",
    purpose: "",
    priority: "medium",
    required_date: "",
    justification: "",
    notes: "",
    items: [] as any[]
  });
  
  // RFQ State
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [rfqDialog, setRfqDialog] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<any>(null);
  const [rfqForm, setRfqForm] = useState({
    pr_id: "",
    title: "",
    description: "",
    response_deadline: "",
    terms_and_conditions: "",
    notes: "",
    items: [] as any[],
    supplier_ids: [] as number[]
  });
  
  // Quotations State
  const [quotations, setQuotations] = useState<any[]>([]);
  const [quotationDialog, setQuotationDialog] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  
  // Purchase Orders State
  const [pos, setPos] = useState<any[]>([]);
  
  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Reference Data
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  
  // Filters
  const [prFilter, setPrFilter] = useState({ status: "", department: "" });
  const [rfqFilter, setRfqFilter] = useState({ status: "" });
  const [analyticsFilter, setAnalyticsFilter] = useState({ period: "30", department: "" });

  // Data loaded flags to prevent reloading
  const [dataLoaded, setDataLoaded] = useState({
    prs: false,
    rfqs: false,
    quotations: false,
    pos: false,
    analytics: false,
    products: false,
    suppliers: false
  });

  // Load reference data only once
  useEffect(() => {
    // Don't load products/suppliers on initial mount - load them when dialogs open
  }, []);

  // Load products when PR dialog opens
  useEffect(() => {
    if (prDialog && !dataLoaded.products) {
      loadProducts();
    }
  }, [prDialog]);

  // Load suppliers when RFQ dialog opens
  useEffect(() => {
    if (rfqDialog && !dataLoaded.suppliers) {
      loadSuppliers();
    }
  }, [rfqDialog]);

  // Optimized: Load data only when switching to specific tab and not already loaded
  useEffect(() => {
    if (activeTab === "prs" && !dataLoaded.prs) {
      loadPrs();
    } else if (activeTab === "rfqs" && !dataLoaded.rfqs) {
      loadRfqs();
    } else if (activeTab === "quotations" && !dataLoaded.quotations) {
      loadQuotations();
    } else if (activeTab === "pos" && !dataLoaded.pos) {
      loadPos();
    } else if (activeTab === "analytics" && !dataLoaded.analytics) {
      loadAnalytics();
    } else if (activeTab === "dashboard") {
      // For dashboard, load lightweight summary data
      if (!dataLoaded.prs) loadPrs(5); // Load only last 5
      if (!dataLoaded.analytics) loadAnalytics();
    }
  }, [activeTab]);

  // Reload data when filters change
  useEffect(() => {
    if (dataLoaded.prs && activeTab === "prs") loadPrs();
  }, [prFilter]);

  useEffect(() => {
    if (dataLoaded.rfqs && activeTab === "rfqs") loadRfqs();
  }, [rfqFilter]);

  useEffect(() => {
    if (dataLoaded.analytics && activeTab === "analytics") loadAnalytics();
  }, [analyticsFilter]);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100");
      const data = await response.json();
      setProducts(data.products || data || []);
      setDataLoaded(prev => ({ ...prev, products: true }));
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await fetch("/api/operations/suppliers?limit=100");
      const data = await response.json();
      setSuppliers(data || []);
      setDataLoaded(prev => ({ ...prev, suppliers: true }));
    } catch (error) {
      console.error("Error loading suppliers:", error);
    }
  };

  const loadPrs = async (limit?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (prFilter.status) params.append("status", prFilter.status);
      if (prFilter.department) params.append("department", prFilter.department);
      if (limit) params.append("limit", limit.toString());
      
      const response = await fetch(`/api/operations/purchase-requisitions?${params}`);
      const data = await response.json();
      setPrs(data);
      setDataLoaded(prev => ({ ...prev, prs: true }));
    } catch (error) {
      toast.error("Failed to load purchase requisitions");
    } finally {
      setLoading(false);
    }
  };

  const loadRfqs = async (limit?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (rfqFilter.status) params.append("status", rfqFilter.status);
      if (limit) params.append("limit", limit.toString());
      
      const response = await fetch(`/api/operations/rfq-requests?${params}`);
      const data = await response.json();
      setRfqs(data);
      setDataLoaded(prev => ({ ...prev, rfqs: true }));
    } catch (error) {
      toast.error("Failed to load RFQs");
    } finally {
      setLoading(false);
    }
  };

  const loadQuotations = async (limit?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      
      const response = await fetch(`/api/operations/quotations?${params}`);
      const data = await response.json();
      setQuotations(data);
      setDataLoaded(prev => ({ ...prev, quotations: true }));
    } catch (error) {
      toast.error("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  const loadPos = async (limit?: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      
      const response = await fetch(`/api/operations/purchase-orders?${params}`);
      const data = await response.json();
      setPos(data);
      setDataLoaded(prev => ({ ...prev, pos: true }));
    } catch (error) {
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (analyticsFilter.period) params.append("period", analyticsFilter.period);
      if (analyticsFilter.department) params.append("department", analyticsFilter.department);
      
      const response = await fetch(`/api/operations/procurement-analytics?${params}`);
      const data = await response.json();
      setAnalytics(data);
      setDataLoaded(prev => ({ ...prev, analytics: true }));
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const createPr = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/operations/purchase-requisitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prForm)
      });
      
      if (response.ok) {
        toast.success("Purchase requisition created successfully");
        setPrDialog(false);
        loadPrs();
        resetPrForm();
      } else {
        throw new Error("Failed to create PR");
      }
    } catch (error) {
      toast.error("Failed to create purchase requisition");
    } finally {
      setLoading(false);
    }
  };

  const approvePr = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/operations/purchase-requisitions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve", approved_by: 1, approval_level: 1, comments: "Approved" })
      });
      
      if (response.ok) {
        toast.success("Purchase requisition approved");
        loadPrs();
      }
    } catch (error) {
      toast.error("Failed to approve PR");
    } finally {
      setLoading(false);
    }
  };

  const createRfq = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/operations/rfq-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rfqForm)
      });
      
      if (response.ok) {
        toast.success("RFQ created successfully");
        setRfqDialog(false);
        loadRfqs();
        resetRfqForm();
      } else {
        throw new Error("Failed to create RFQ");
      }
    } catch (error) {
      toast.error("Failed to create RFQ");
    } finally {
      setLoading(false);
    }
  };

  const sendRfq = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/operations/rfq-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "send" })
      });
      
      if (response.ok) {
        toast.success("RFQ sent to suppliers");
        loadRfqs();
      }
    } catch (error) {
      toast.error("Failed to send RFQ");
    } finally {
      setLoading(false);
    }
  };

  const acceptQuotation = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/operations/quotations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "accept" })
      });
      
      if (response.ok) {
        toast.success("Quotation accepted successfully");
        loadQuotations();
        loadRfqs();
      }
    } catch (error) {
      toast.error("Failed to accept quotation");
    } finally {
      setLoading(false);
    }
  };

  const resetPrForm = () => {
    setPrForm({
      department: "",
      purpose: "",
      priority: "medium",
      required_date: "",
      justification: "",
      notes: "",
      items: []
    });
  };

  const resetRfqForm = () => {
    setRfqForm({
      pr_id: "",
      title: "",
      description: "",
      response_deadline: "",
      terms_and_conditions: "",
      notes: "",
      items: [],
      supplier_ids: []
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Draft" },
      pending_approval: { variant: "default", label: "Pending Approval" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
      sent: { variant: "default", label: "Sent" },
      receiving_quotes: { variant: "default", label: "Receiving Quotes" },
      evaluation: { variant: "default", label: "Under Evaluation" },
      completed: { variant: "default", label: "Completed" },
      cancelled: { variant: "secondary", label: "Cancelled" },
      received: { variant: "default", label: "Received" },
      under_review: { variant: "default", label: "Under Review" },
      accepted: { variant: "default", label: "Accepted" }
    };
    
    const config = statusConfig[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig: Record<string, { variant: any; label: string }> = {
      low: { variant: "secondary", label: "Low" },
      medium: { variant: "default", label: "Medium" },
      high: { variant: "default", label: "High" },
      urgent: { variant: "destructive", label: "Urgent" }
    };
    
    const config = priorityConfig[priority] || { variant: "secondary", label: priority };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/erp" className="hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/erp/operations" className="hover:text-foreground transition-colors">
          Operations
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/erp/operations/supply-chain" className="hover:text-foreground transition-colors">
          Supply Chain
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Procurement Advanced</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Procurement Management</h1>
          <p className="text-muted-foreground mt-2">
            Complete procurement workflow: PR → RFQ → Quotations → PO
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="prs">
            <ClipboardList className="h-4 w-4 mr-2" />
            Purchase Requisitions
          </TabsTrigger>
          <TabsTrigger value="rfqs">
            <MessageSquare className="h-4 w-4 mr-2" />
            RFQ Management
          </TabsTrigger>
          <TabsTrigger value="quotations">
            <FileText className="h-4 w-4 mr-2" />
            Quotations
          </TabsTrigger>
          <TabsTrigger value="pos">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {loading && !dataLoaded.analytics ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="space-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[60px]" />
                      <Skeleton className="h-3 w-[120px] mt-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Requisitions</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prs.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {prs.filter(pr => pr.status === 'pending_approval').length} pending approval
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rfqs.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {rfqs.filter(rfq => rfq.status === 'receiving_quotes').length} receiving quotes
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pos.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pos.filter(po => po.status === 'approved').length} approved
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spend (30d)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.summary?.total_po_value ? formatCurrency(parseInt(analytics.summary.total_po_value)) : formatCurrency(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.summary?.total_pos || 0} orders
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchase Requisitions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {prs.slice(0, 5).map((pr) => (
                      <div key={pr.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{pr.pr_number}</p>
                          <p className="text-sm text-muted-foreground">{pr.department}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(pr.status)}
                          <p className="text-sm mt-1">{formatCurrency(pr.total_estimated_cost || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active RFQs</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {rfqs.slice(0, 5).map((rfq) => (
                      <div key={rfq.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <p className="font-medium">{rfq.rfq_number}</p>
                          <p className="text-sm text-muted-foreground">{rfq.title}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(rfq.status)}
                          <p className="text-sm mt-1">{rfq.quotation_count || 0} quotes</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          </>
          )}
        </TabsContent>

        {/* Purchase Requisitions Tab */}
        <TabsContent value="prs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search PRs..."
                className="w-[300px]"
                onChange={(e) => {
                  // Implement search
                }}
              />
              <Select value={prFilter.status || "all"} onValueChange={(value) => setPrFilter({...prFilter, status: value === "all" ? "" : value})}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={prDialog} onOpenChange={setPrDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create PR
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Purchase Requisition</DialogTitle>
                  <DialogDescription>
                    Create a new purchase requisition for approval
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={prForm.department}
                        onChange={(e) => setPrForm({...prForm, department: e.target.value})}
                        placeholder="IT Department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={prForm.priority} onValueChange={(value) => setPrForm({...prForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Purpose</Label>
                    <Input
                      value={prForm.purpose}
                      onChange={(e) => setPrForm({...prForm, purpose: e.target.value})}
                      placeholder="Office Equipment Purchase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Required Date</Label>
                    <Input
                      type="date"
                      value={prForm.required_date}
                      onChange={(e) => setPrForm({...prForm, required_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Justification</Label>
                    <Textarea
                      value={prForm.justification}
                      onChange={(e) => setPrForm({...prForm, justification: e.target.value})}
                      placeholder="Explain why this purchase is needed..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={prForm.notes}
                      onChange={(e) => setPrForm({...prForm, notes: e.target.value})}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>

                  {/* Items Section */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Items to Purchase</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPrForm({
                            ...prForm,
                            items: [...prForm.items, {
                              product_id: "",
                              description: "",
                              quantity: 1,
                              unit: "pcs",
                              estimated_unit_price: 0,
                              notes: ""
                            }]
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    </div>

                    {prForm.items.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                        <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No items added yet</p>
                        <p className="text-sm">Click "Add Item" to add products to this requisition</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {prForm.items.map((item, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="grid gap-3">
                                <div className="flex items-start justify-between">
                                  <Label className="text-sm font-medium">Item #{index + 1}</Label>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      const newItems = prForm.items.filter((_, i) => i !== index);
                                      setPrForm({...prForm, items: newItems});
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-xs">Product</Label>
                                    <Select
                                      value={item.product_id?.toString() || ""}
                                      onValueChange={(value) => {
                                        const product = products.find(p => p.id.toString() === value);
                                        const newItems = [...prForm.items];
                                        newItems[index] = {
                                          ...newItems[index],
                                          product_id: value,
                                          description: product?.name || "",
                                          unit: product?.unit || "pcs",
                                          estimated_unit_price: product?.price || 0
                                        };
                                        setPrForm({...prForm, items: newItems});
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select product..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {products.map((product) => (
                                          <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.name} ({product.sku})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Description</Label>
                                    <Input
                                      value={item.description}
                                      onChange={(e) => {
                                        const newItems = [...prForm.items];
                                        newItems[index].description = e.target.value;
                                        setPrForm({...prForm, items: newItems});
                                      }}
                                      placeholder="Product description"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-xs">Quantity</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={item.quantity}
                                      onChange={(e) => {
                                        const newItems = [...prForm.items];
                                        newItems[index].quantity = parseFloat(e.target.value) || 0;
                                        setPrForm({...prForm, items: newItems});
                                      }}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Unit</Label>
                                    <Input
                                      value={item.unit}
                                      onChange={(e) => {
                                        const newItems = [...prForm.items];
                                        newItems[index].unit = e.target.value;
                                        setPrForm({...prForm, items: newItems});
                                      }}
                                      placeholder="pcs"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Est. Unit Price</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={item.estimated_unit_price}
                                      onChange={(e) => {
                                        const newItems = [...prForm.items];
                                        newItems[index].estimated_unit_price = parseFloat(e.target.value) || 0;
                                        setPrForm({...prForm, items: newItems});
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs">Item Notes (Optional)</Label>
                                  <Textarea
                                    value={item.notes || ""}
                                    onChange={(e) => {
                                      const newItems = [...prForm.items];
                                      newItems[index].notes = e.target.value;
                                      setPrForm({...prForm, items: newItems});
                                    }}
                                    placeholder="Special requirements or notes..."
                                    rows={2}
                                  />
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t">
                                  <span className="text-sm text-muted-foreground">Estimated Total:</span>
                                  <span className="font-semibold">
                                    {formatCurrency((item.quantity || 0) * (item.estimated_unit_price || 0))}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {prForm.items.length > 0 && (
                      <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="font-semibold">Total Estimated Cost:</span>
                        <span className="text-xl font-bold">
                          {formatCurrency(
                            prForm.items.reduce((sum, item) => 
                              sum + ((item.quantity || 0) * (item.estimated_unit_price || 0)), 0
                            )
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setPrDialog(false);
                    resetPrForm();
                  }}>Cancel</Button>
                  <Button onClick={createPr} disabled={loading || prForm.items.length === 0}>
                    {loading ? "Creating..." : `Create PR (${prForm.items.length} items)`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PR Number</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Est. Cost</TableHead>
                    <TableHead>Required Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && !dataLoaded.prs ? (
                    // Loading skeleton
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : prs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No purchase requisitions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    prs.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell className="font-medium">{pr.pr_number}</TableCell>
                      <TableCell>{pr.department}</TableCell>
                      <TableCell>{pr.purpose}</TableCell>
                      <TableCell>{getPriorityBadge(pr.priority)}</TableCell>
                      <TableCell>{getStatusBadge(pr.status)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(pr.total_estimated_cost || 0)}</TableCell>
                      <TableCell>{formatDate(pr.required_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {pr.status === 'pending_approval' && (
                            <Button size="sm" variant="ghost" onClick={() => approvePr(pr.id)}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RFQ Tab */}
        <TabsContent value="rfqs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search RFQs..."
                className="w-[300px]"
              />
              <Select value={rfqFilter.status || "all"} onValueChange={(value) => setRfqFilter({...rfqFilter, status: value === "all" ? "" : value})}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="receiving_quotes">Receiving Quotes</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog open={rfqDialog} onOpenChange={setRfqDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Request for Quotation</DialogTitle>
                  <DialogDescription>
                    Request quotations from multiple suppliers
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Link to PR (Optional)</Label>
                    <Select value={rfqForm.pr_id} onValueChange={(value) => setRfqForm({...rfqForm, pr_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approved PR..." />
                      </SelectTrigger>
                      <SelectContent>
                        {prs.filter(pr => pr.status === 'approved').map(pr => (
                          <SelectItem key={pr.id} value={pr.id.toString()}>
                            {pr.pr_number} - {pr.purpose}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={rfqForm.title}
                      onChange={(e) => setRfqForm({...rfqForm, title: e.target.value})}
                      placeholder="Office Equipment - IT Department"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={rfqForm.description}
                      onChange={(e) => setRfqForm({...rfqForm, description: e.target.value})}
                      placeholder="Request for quotation details..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Response Deadline</Label>
                    <Input
                      type="date"
                      value={rfqForm.response_deadline}
                      onChange={(e) => setRfqForm({...rfqForm, response_deadline: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Terms and Conditions</Label>
                    <Textarea
                      value={rfqForm.terms_and_conditions}
                      onChange={(e) => setRfqForm({...rfqForm, terms_and_conditions: e.target.value})}
                      placeholder="Payment terms, delivery requirements..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRfqDialog(false)}>Cancel</Button>
                  <Button onClick={createRfq} disabled={loading}>
                    {loading ? "Creating..." : "Create RFQ"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RFQ Number</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>PR Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Suppliers</TableHead>
                    <TableHead>Quotes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell className="font-medium">{rfq.rfq_number}</TableCell>
                      <TableCell>{rfq.title}</TableCell>
                      <TableCell>{rfq.pr_number || '-'}</TableCell>
                      <TableCell>{getStatusBadge(rfq.status)}</TableCell>
                      <TableCell>{formatDate(rfq.response_deadline)}</TableCell>
                      <TableCell>{rfq.supplier_count || 0}</TableCell>
                      <TableCell>{rfq.quotation_count || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {rfq.status === 'draft' && (
                            <Button size="sm" variant="ghost" onClick={() => sendRfq(rfq.id)}>
                              <Send className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quotations Tab */}
        <TabsContent value="quotations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Quotations Comparison</CardTitle>
              <CardDescription>
                Compare quotes from multiple suppliers side-by-side
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>RFQ</TableHead>
                    <TableHead>Quote Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Delivery Time</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quote_number}</TableCell>
                      <TableCell>{quote.supplier_name}</TableCell>
                      <TableCell>{quote.rfq_number}</TableCell>
                      <TableCell>{formatDate(quote.quote_date)}</TableCell>
                      <TableCell>{formatDate(quote.valid_until)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(quote.total_amount || 0)}</TableCell>
                      <TableCell>{quote.delivery_time}</TableCell>
                      <TableCell>
                        {quote.evaluation_score ? (
                          <Badge variant="outline">{quote.evaluation_score}/10</Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {quote.status === 'received' && (
                            <Button size="sm" variant="ghost" onClick={() => acceptQuotation(quote.id)}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="pos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
              <CardDescription>
                View all purchase orders created from accepted quotations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pos.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.po_number}</TableCell>
                      <TableCell>{po.supplier_name}</TableCell>
                      <TableCell>{formatDate(po.order_date)}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(po.total_amount || 0)}</TableCell>
                      <TableCell>{formatDate(po.delivery_date)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center gap-4">
            <Select 
              value={analyticsFilter.period} 
              onValueChange={(value) => setAnalyticsFilter({...analyticsFilter, period: value})}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {analytics && (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(parseInt(analytics.summary?.total_po_value || 0))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.summary?.total_pos || 0} purchase orders
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">PR Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.conversion?.conversion_rate || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.conversion?.converted_prs || 0} / {analytics.conversion?.total_prs || 0} PRs
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Cycle Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(analytics.cycleTime?.avg_pr_to_po_days || 0)} days
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      PR to PO conversion
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.topSuppliers?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      With orders in period
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Suppliers by Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {analytics.topSuppliers?.map((supplier: any) => (
                          <div key={supplier.id} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{supplier.company_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {supplier.po_count} orders • Rating: {parseFloat(supplier.avg_rating || 0).toFixed(1)}/10
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(parseInt(supplier.total_value || 0))}</p>
                              <p className="text-sm text-muted-foreground">
                                {parseFloat(supplier.on_time_rate || 0).toFixed(0)}% on-time
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Department Spending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {analytics.departmentSpending?.map((dept: any) => (
                          <div key={dept.department} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{dept.department}</p>
                              <p className="text-sm text-muted-foreground">{dept.pr_count} PRs</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatCurrency(parseInt(dept.actual_spend || 0))}</p>
                              <p className="text-sm text-muted-foreground">
                                Est: {formatCurrency(parseInt(dept.estimated_spend || 0))}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Total Budget</TableHead>
                        <TableHead className="text-right">Spent</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics.budgets?.map((budget: any) => (
                        <TableRow key={budget.budget_code}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{budget.budget_name}</p>
                              <p className="text-sm text-muted-foreground">{budget.budget_code}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(parseInt(budget.total_budget || 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(parseInt(budget.spent_amount || 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(parseInt(budget.available_amount || 0))}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={parseFloat(budget.utilization_percent) > 80 ? "destructive" : "default"}>
                              {parseFloat(budget.utilization_percent || 0).toFixed(1)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
