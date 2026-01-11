"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/registry/new-york-v4/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { 
  Shield,
  FileText,
  Microscope,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Plus,
  Search,
  Edit,
  Download,
  Beaker,
  Activity,
  ClipboardCheck,
  Award
} from "lucide-react"

interface QualityTest {
  id: number
  batch_number: string
  formulation_name: string
  test_date: string
  test_type: string // microbiological, stability, ph, viscosity, appearance, safety
  test_parameter: string
  expected_value: string
  actual_value: string
  result: string // pass, fail, conditional
  tested_by: string
  approved_by?: string
  certificate_url?: string
  compliance_standards: string[] // BPOM, Halal, ISO, etc.
  notes?: string
  created_at: string
}

interface BatchRecord {
  id: number
  batch_number: string
  formulation_name: string
  production_date: string
  quantity_produced: number
  quality_status: string // pending, approved, rejected, conditional
  expiry_date: string
  test_results_count: number
  passed_tests: number
  failed_tests: number
  certificates_issued: string[]
  storage_location: string
  release_status: string // quarantine, released, recalled
}

interface ComplianceCertificate {
  id: number
  certificate_type: string // BPOM, Halal, ISO, etc.
  certificate_number: string
  batch_number: string
  formulation_name: string
  issued_date: string
  expiry_date: string
  status: string // valid, expired, revoked, pending
  issuing_authority: string
  certificate_url?: string
}

const getTestResultBadge = (result: string) => {
  switch (result?.toLowerCase()) {
    case 'pass':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Pass</Badge>
    case 'fail':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Fail</Badge>
    case 'conditional':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="w-3 h-3 mr-1" />Conditional</Badge>
    default:
      return <Badge variant="secondary">{result}</Badge>
  }
}

const getQualityStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><Award className="w-3 h-3 mr-1" />Approved</Badge>
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
    case 'conditional':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="w-3 h-3 mr-1" />Conditional</Badge>
    case 'pending':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100"><Activity className="w-3 h-3 mr-1" />Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getReleaseStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'released':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Released</Badge>
    case 'quarantine':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Quarantine</Badge>
    case 'recalled':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Recalled</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getCertificateStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'valid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Valid</Badge>
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    case 'revoked':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Revoked</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function SkincareQualityControlPage() {
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([])
  const [batchRecords, setBatchRecords] = useState<BatchRecord[]>([])
  const [certificates, setCertificates] = useState<ComplianceCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false)
  
  // Form state for quality tests
  const [testForm, setTestForm] = useState({
    batch_number: "",
    formulation_name: "",
    test_type: "",
    test_parameter: "",
    expected_value: "",
    actual_value: "",
    tested_by: "",
    compliance_standards: [] as string[],
    notes: ""
  })

  // Form state for certificates
  const [certificateForm, setCertificateForm] = useState({
    certificate_type: "",
    batch_number: "",
    formulation_name: "",
    issuing_authority: "",
    certificate_number: "",
    issued_date: "",
    expiry_date: "",
    certificate_url: ""
  })

  useEffect(() => {
    loadQualityData()
  }, [])

  const loadQualityData = async () => {
    setLoading(true)
    try {
      // Load quality tests
      const testsRes = await fetch('/api/operations/quality-tests')
      if (testsRes.ok) {
        const testsData = await testsRes.json()
        setQualityTests(testsData)
      }

      // Load batch records
      const batchesRes = await fetch('/api/operations/batch-records')
      if (batchesRes.ok) {
        const batchesData = await batchesRes.json()
        setBatchRecords(batchesData)
      }

      // Load certificates
      const certsRes = await fetch('/api/operations/compliance-certificates')
      if (certsRes.ok) {
        const certsData = await certsRes.json()
        setCertificates(certsData)
      }

    } catch (error) {
      console.error('Error loading quality data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async () => {
    try {
      const result = testForm.actual_value && testForm.expected_value 
        ? (testForm.actual_value === testForm.expected_value ? 'pass' : 'fail')
        : 'pending'

      const res = await fetch('/api/operations/quality-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...testForm,
          result,
          test_date: new Date().toISOString()
        })
      })
      
      if (res.ok) {
        await loadQualityData()
        setIsTestDialogOpen(false)
        resetTestForm()
      }
    } catch (error) {
      console.error('Error creating quality test:', error)
    }
  }

  const handleCreateCertificate = async () => {
    try {
      const res = await fetch('/api/operations/compliance-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...certificateForm,
          status: 'valid'
        })
      })
      
      if (res.ok) {
        await loadQualityData()
        setIsCertificateDialogOpen(false)
        resetCertificateForm()
      }
    } catch (error) {
      console.error('Error creating certificate:', error)
    }
  }

  const resetTestForm = () => {
    setTestForm({
      batch_number: "",
      formulation_name: "",
      test_type: "",
      test_parameter: "",
      expected_value: "",
      actual_value: "",
      tested_by: "",
      compliance_standards: [],
      notes: ""
    })
  }

  const resetCertificateForm = () => {
    setCertificateForm({
      certificate_type: "",
      batch_number: "",
      formulation_name: "",
      issuing_authority: "",
      certificate_number: "",
      issued_date: "",
      expiry_date: "",
      certificate_url: ""
    })
  }

  const filteredTests = qualityTests.filter(test => {
    const matchesSearch = test.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.formulation_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || test.result === statusFilter
    return matchesSearch && matchesStatus
  })

  const calculatePassRate = () => {
    if (qualityTests.length === 0) return 0
    const passedTests = qualityTests.filter(test => test.result === 'pass').length
    return (passedTests / qualityTests.length * 100).toFixed(1)
  }

  const getApprovedBatches = () => {
    return batchRecords.filter(batch => batch.quality_status === 'approved').length
  }

  const getValidCertificates = () => {
    return certificates.filter(cert => cert.status === 'valid').length
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/operations">Operations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Quality Control</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-green-500" />
              Skincare Quality Control
            </h2>
            <p className="text-muted-foreground">
              Comprehensive quality testing, batch tracking, and regulatory compliance management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetTestForm}>
                  <Microscope className="mr-2 h-4 w-4" />
                  New Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Quality Test</DialogTitle>
                  <DialogDescription>
                    Record a new quality test for batch validation and compliance
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="batch_number">Batch Number</Label>
                      <Input
                        id="batch_number"
                        value={testForm.batch_number}
                        onChange={(e) => setTestForm({...testForm, batch_number: e.target.value})}
                        placeholder="e.g., VCS001-20241128"
                      />
                    </div>
                    <div>
                      <Label htmlFor="formulation_name">Formulation</Label>
                      <Input
                        id="formulation_name"
                        value={testForm.formulation_name}
                        onChange={(e) => setTestForm({...testForm, formulation_name: e.target.value})}
                        placeholder="e.g., Vitamin C Serum"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="test_type">Test Type</Label>
                      <Select value={testForm.test_type} onValueChange={(value) => setTestForm({...testForm, test_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="microbiological">Microbiological</SelectItem>
                          <SelectItem value="stability">Stability Testing</SelectItem>
                          <SelectItem value="ph">pH Level</SelectItem>
                          <SelectItem value="viscosity">Viscosity</SelectItem>
                          <SelectItem value="appearance">Appearance</SelectItem>
                          <SelectItem value="safety">Safety Testing</SelectItem>
                          <SelectItem value="efficacy">Efficacy Testing</SelectItem>
                          <SelectItem value="preservation">Preservation Efficacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="test_parameter">Test Parameter</Label>
                      <Input
                        id="test_parameter"
                        value={testForm.test_parameter}
                        onChange={(e) => setTestForm({...testForm, test_parameter: e.target.value})}
                        placeholder="e.g., Total Bacteria Count"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expected_value">Expected Value</Label>
                      <Input
                        id="expected_value"
                        value={testForm.expected_value}
                        onChange={(e) => setTestForm({...testForm, expected_value: e.target.value})}
                        placeholder="e.g., < 100 CFU/g"
                      />
                    </div>
                    <div>
                      <Label htmlFor="actual_value">Actual Value</Label>
                      <Input
                        id="actual_value"
                        value={testForm.actual_value}
                        onChange={(e) => setTestForm({...testForm, actual_value: e.target.value})}
                        placeholder="e.g., 85 CFU/g"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tested_by">Tested By</Label>
                    <Input
                      id="tested_by"
                      value={testForm.tested_by}
                      onChange={(e) => setTestForm({...testForm, tested_by: e.target.value})}
                      placeholder="Quality control analyst name"
                    />
                  </div>

                  <div>
                    <Label>Compliance Standards</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['BPOM', 'Halal', 'ISO 22716', 'CPSR', 'FDA'].map((standard) => (
                        <label key={standard} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={testForm.compliance_standards.includes(standard)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTestForm({...testForm, compliance_standards: [...testForm.compliance_standards, standard]})
                              } else {
                                setTestForm({...testForm, compliance_standards: testForm.compliance_standards.filter(s => s !== standard)})
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{standard}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Test Notes</Label>
                    <Textarea
                      id="notes"
                      value={testForm.notes}
                      onChange={(e) => setTestForm({...testForm, notes: e.target.value})}
                      placeholder="Additional observations, conditions, or remarks..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateTest}>Create Test</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={resetCertificateForm}>
                  <Award className="mr-2 h-4 w-4" />
                  New Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Issue Compliance Certificate</DialogTitle>
                  <DialogDescription>
                    Record a new compliance certificate for regulatory tracking
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="certificate_type">Certificate Type</Label>
                      <Select value={certificateForm.certificate_type} onValueChange={(value) => setCertificateForm({...certificateForm, certificate_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BPOM">BPOM Registration</SelectItem>
                          <SelectItem value="Halal">Halal Certification</SelectItem>
                          <SelectItem value="ISO">ISO Certification</SelectItem>
                          <SelectItem value="CPSR">CPSR Report</SelectItem>
                          <SelectItem value="COA">Certificate of Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="certificate_number">Certificate Number</Label>
                      <Input
                        id="certificate_number"
                        value={certificateForm.certificate_number}
                        onChange={(e) => setCertificateForm({...certificateForm, certificate_number: e.target.value})}
                        placeholder="e.g., BPOM-NK-12345678"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cert_batch_number">Batch Number</Label>
                      <Input
                        id="cert_batch_number"
                        value={certificateForm.batch_number}
                        onChange={(e) => setCertificateForm({...certificateForm, batch_number: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cert_formulation_name">Formulation</Label>
                      <Input
                        id="cert_formulation_name"
                        value={certificateForm.formulation_name}
                        onChange={(e) => setCertificateForm({...certificateForm, formulation_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="issued_date">Issued Date</Label>
                      <Input
                        id="issued_date"
                        type="date"
                        value={certificateForm.issued_date}
                        onChange={(e) => setCertificateForm({...certificateForm, issued_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry_date">Expiry Date</Label>
                      <Input
                        id="expiry_date"
                        type="date"
                        value={certificateForm.expiry_date}
                        onChange={(e) => setCertificateForm({...certificateForm, expiry_date: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="issuing_authority">Issuing Authority</Label>
                    <Input
                      id="issuing_authority"
                      value={certificateForm.issuing_authority}
                      onChange={(e) => setCertificateForm({...certificateForm, issuing_authority: e.target.value})}
                      placeholder="e.g., Badan POM RI, MUI, BSN"
                    />
                  </div>

                  <div>
                    <Label htmlFor="certificate_url">Certificate URL (Optional)</Label>
                    <Input
                      id="certificate_url"
                      value={certificateForm.certificate_url}
                      onChange={(e) => setCertificateForm({...certificateForm, certificate_url: e.target.value})}
                      placeholder="Link to certificate document"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCertificateDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateCertificate}>Issue Certificate</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Key Quality Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test Pass Rate</CardTitle>
              <Microscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculatePassRate()}%</div>
              <p className="text-xs text-muted-foreground">
                {qualityTests.length} total tests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Batches</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getApprovedBatches()}</div>
              <p className="text-xs text-muted-foreground">
                {batchRecords.length} total batches
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valid Certificates</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getValidCertificates()}</div>
              <p className="text-xs text-muted-foreground">
                Active certifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                Overall compliance rate
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tests">Quality Tests</TabsTrigger>
            <TabsTrigger value="batches">Batch Records</TabsTrigger>
            <TabsTrigger value="certificates">Compliance Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="pass">Pass</SelectItem>
                  <SelectItem value="fail">Fail</SelectItem>
                  <SelectItem value="conditional">Conditional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Tests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Test Results</CardTitle>
                <CardDescription>
                  Comprehensive testing records for batch validation and compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Loading quality tests...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Formulation</TableHead>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Actual</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No quality tests found. Create your first test to start quality tracking.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTests.map((test) => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.batch_number}</TableCell>
                            <TableCell>{test.formulation_name}</TableCell>
                            <TableCell>{test.test_type}</TableCell>
                            <TableCell>{test.test_parameter}</TableCell>
                            <TableCell>{test.expected_value}</TableCell>
                            <TableCell>{test.actual_value}</TableCell>
                            <TableCell>{getTestResultBadge(test.result)}</TableCell>
                            <TableCell>{new Date(test.test_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Batch Quality Records</CardTitle>
                <CardDescription>
                  Comprehensive batch tracking with quality status and release management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Formulation</TableHead>
                      <TableHead>Production Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Quality Status</TableHead>
                      <TableHead>Test Results</TableHead>
                      <TableHead>Release Status</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No batch records available. Batch records are automatically created during production.
                        </TableCell>
                      </TableRow>
                    ) : (
                      batchRecords.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium">{batch.batch_number}</TableCell>
                          <TableCell>{batch.formulation_name}</TableCell>
                          <TableCell>{new Date(batch.production_date).toLocaleDateString()}</TableCell>
                          <TableCell>{batch.quantity_produced.toLocaleString()} units</TableCell>
                          <TableCell>{getQualityStatusBadge(batch.quality_status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-green-600">{batch.passed_tests} passed</span>
                              {batch.failed_tests > 0 && (
                                <span className="text-red-600"> / {batch.failed_tests} failed</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getReleaseStatusBadge(batch.release_status)}</TableCell>
                          <TableCell>{new Date(batch.expiry_date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Certificates</CardTitle>
                <CardDescription>
                  Regulatory certificates and compliance documentation management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Certificate Type</TableHead>
                      <TableHead>Certificate Number</TableHead>
                      <TableHead>Formulation</TableHead>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Issuing Authority</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No compliance certificates found. Issue certificates to track regulatory compliance.
                        </TableCell>
                      </TableRow>
                    ) : (
                      certificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">{cert.certificate_type}</TableCell>
                          <TableCell>{cert.certificate_number}</TableCell>
                          <TableCell>{cert.formulation_name}</TableCell>
                          <TableCell>{cert.batch_number}</TableCell>
                          <TableCell>{cert.issuing_authority}</TableCell>
                          <TableCell>{new Date(cert.issued_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(cert.expiry_date).toLocaleDateString()}</TableCell>
                          <TableCell>{getCertificateStatusBadge(cert.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
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
      </div>
    </>
  )
}