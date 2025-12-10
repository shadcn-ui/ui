"use client"

import { useState } from "react"
import Link from "next/link"
import {
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Alert, AlertDescription } from "@/registry/new-york-v4/ui/alert"
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft 
} from "lucide-react"

interface LeadData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  website: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  source: string
  status: string
  assignedTo: string
  estimatedValue: string
  notes: string
  isValid: boolean
  errors: string[]
}

export default function ImportLeadsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<LeadData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<string[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      parseCSV(selectedFile)
    }
  }

  const parseCSV = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const data: LeadData[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue
        
        const values = line.split(',').map(v => v.trim())
        const leadData: LeadData = {
          firstName: getValue(values, headers, 'firstname') || getValue(values, headers, 'first_name') || '',
          lastName: getValue(values, headers, 'lastname') || getValue(values, headers, 'last_name') || '',
          email: getValue(values, headers, 'email') || '',
          phone: getValue(values, headers, 'phone') || '',
          company: getValue(values, headers, 'company') || '',
          jobTitle: getValue(values, headers, 'jobtitle') || getValue(values, headers, 'job_title') || '',
          website: getValue(values, headers, 'website') || '',
          address: getValue(values, headers, 'address') || '',
          city: getValue(values, headers, 'city') || '',
          state: getValue(values, headers, 'state') || '',
          zipCode: getValue(values, headers, 'zipcode') || getValue(values, headers, 'zip_code') || getValue(values, headers, 'zip') || '',
          country: getValue(values, headers, 'country') || '',
          source: getValue(values, headers, 'source') || '',
          status: getValue(values, headers, 'status') || '',
          assignedTo: getValue(values, headers, 'assignedto') || getValue(values, headers, 'assigned_to') || '',
          estimatedValue: getValue(values, headers, 'estimatedvalue') || getValue(values, headers, 'estimated_value') || getValue(values, headers, 'value') || '',
          notes: getValue(values, headers, 'notes') || '',
          isValid: true,
          errors: []
        }
        
        // Validate required fields
        if (!leadData.firstName) leadData.errors.push('First name is required')
        if (!leadData.lastName) leadData.errors.push('Last name is required')
        if (!leadData.email) leadData.errors.push('Email is required')
        if (leadData.email && !isValidEmail(leadData.email)) leadData.errors.push('Invalid email format')
        
        leadData.isValid = leadData.errors.length === 0
        data.push(leadData)
      }
      
      setCsvData(data)
    }
    reader.readAsText(file)
  }

  const getValue = (values: string[], headers: string[], field: string): string => {
    const index = headers.indexOf(field)
    return index >= 0 ? values[index] || '' : ''
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleImport = async () => {
    const validLeads = csvData.filter(lead => lead.isValid)
    
    if (validLeads.length === 0) {
      setErrors(['No valid leads to import'])
      return
    }

    setIsUploading(true)
    setErrors([])

    try {
      const response = await fetch('/api/leads/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: validLeads }),
      })

      if (response.ok) {
        setUploadStatus('success')
        setCsvData([])
        setFile(null)
      } else {
        const errorData = await response.json()
        setErrors([errorData.error || 'Failed to import leads'])
        setUploadStatus('error')
      }
    } catch (error) {
      setErrors(['Network error occurred during import'])
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,phone,company,jobTitle,website,address,city,state,zipCode,country,source,status,assignedTo,estimatedValue,notes
John,Smith,john.smith@example.com,+1-555-0123,Example Corp,CEO,https://example.com,123 Main St,San Francisco,CA,94105,US,Website,New,Admin User,50000,Interested in our enterprise solution
Jane,Doe,jane.doe@testcorp.com,+1-555-0456,Test Corp,CTO,https://testcorp.com,456 Test Ave,Austin,TX,78701,US,Referral,Qualified,Sarah Johnson,75000,Highly qualified prospect from partner referral`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'leads_import_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validLeadsCount = csvData.filter(lead => lead.isValid).length
  const invalidLeadsCount = csvData.filter(lead => !lead.isValid).length

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
              <BreadcrumbLink href="/erp/sales">Sales</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp/sales/leads">Leads</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Import</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Import Leads</h2>
            <p className="text-muted-foreground">
              Upload a CSV file to import multiple leads at once
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/erp/sales/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Link>
          </Button>
        </div>

        {/* Upload Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Select a CSV file containing lead information to import
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="csvFile">CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              
              {file && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Download Template
              </CardTitle>
              <CardDescription>
                Get a sample CSV file with the correct format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadTemplate} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV Template
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Required fields: firstName, lastName, email
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        {uploadStatus === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Leads imported successfully! You can now view them in the leads list.
            </AlertDescription>
          </Alert>
        )}

        {errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Preview Section */}
        {csvData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Import Preview
                  </CardTitle>
                  <CardDescription>
                    Review the data before importing
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {validLeadsCount} Valid
                  </Badge>
                  {invalidLeadsCount > 0 && (
                    <Badge variant="destructive">
                      {invalidLeadsCount} Invalid
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvData.map((lead, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {lead.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell>
                          {lead.errors.length > 0 && (
                            <div className="text-xs text-red-500">
                              {lead.errors.join(', ')}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {validLeadsCount} of {csvData.length} leads are valid and ready to import
                </div>
                <Button 
                  onClick={handleImport} 
                  disabled={validLeadsCount === 0 || isUploading}
                  className="w-32"
                >
                  {isUploading ? 'Importing...' : `Import ${validLeadsCount} Leads`}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}