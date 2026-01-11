"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { ArrowRightLeft, Plus, Search, Eye } from "lucide-react"
import { toast } from "sonner"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import { WorkflowApprovalCard } from "@/components/workflow/WorkflowApprovalCard"

interface AssetTransfer {
  transfer_id: number
  transfer_number: string
  asset_name: string
  asset_code: string
  from_location_name?: string
  to_location_name: string
  from_employee_name?: string
  to_employee_name?: string
  from_department_name?: string
  to_department_name?: string
  requested_by_name: string
  requested_date: string
  transfer_status: string
  transfer_reason?: string
}

interface Asset {
  asset_id: number
  asset_name: string
  asset_code: string
}

interface Location {
  location_id: number
  location_name: string
  location_code: string
}

export default function AssetTransfersPage() {
  const [transfers, setTransfers] = useState<AssetTransfer[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<AssetTransfer | null>(null)

  // Form state
  const [transferForm, setTransferForm] = useState({
    asset_id: "",
    from_location_id: "",
    to_location_id: "",
    to_employee_id: "",
    to_department_id: "",
    transfer_reason: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [transfersRes, assetsRes, locationsRes] = await Promise.all([
        fetch("/api/asset-management/transfers"),
        fetch("/api/asset-management/assets"),
        fetch("/api/asset-management/locations"),
      ])

      const [transfersData, assetsData, locationsData] = await Promise.all([
        transfersRes.json(),
        assetsRes.json(),
        locationsData.json(),
      ])

      setTransfers(transfersData.transfers || [])
      setAssets(assetsData.assets || assetsData || [])
      setLocations(locationsData.locations || locationsData || [])
    } catch (error) {
      toast.error("Failed to load asset transfers")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!transferForm.asset_id || !transferForm.to_location_id) {
      toast.error("Please select asset and destination location")
      return
    }

    try {
      const response = await fetch("/api/asset-management/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transferForm,
          requested_by: 1,
          created_by: 1
        }),
      })

      if (response.ok) {
        toast.success("Asset transfer created successfully")
        setCreateOpen(false)
        fetchData()
        // Reset form
        setTransferForm({
          asset_id: "",
          from_location_id: "",
          to_location_id: "",
          to_employee_id: "",
          to_department_id: "",
          transfer_reason: "",
          notes: "",
        })
      } else {
        toast.error("Failed to create asset transfer")
      }
    } catch (error) {
      toast.error("Failed to create asset transfer")
      console.error(error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary"
      case "approved":
        return "default"
      case "in_transit":
        return "default"
      case "completed":
        return "default"
      case "rejected":
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = 
      t.transfer_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.asset_code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || t.transfer_status === statusFilter
    return matchesSearch && matchesStatus
  })

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
              <BreadcrumbLink href="/erp/asset-management">Asset Management</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Asset Transfers</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Asset Transfers</h2>
            <p className="text-sm text-muted-foreground">
              Manage asset location and ownership transfers
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Transfer
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transfers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transfers.filter(t => t.transfer_status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transfers.filter(t => t.transfer_status === "in_transit").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {transfers.filter(t => t.transfer_status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by transfer number or asset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transfers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transfer #</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredTransfers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No asset transfers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.transfer_id}>
                      <TableCell className="font-medium">{transfer.transfer_number}</TableCell>
                      <TableCell>
                        <div>{transfer.asset_name}</div>
                        <div className="text-xs text-muted-foreground">{transfer.asset_code}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {transfer.from_location_name || "—"}
                          {transfer.from_department_name && (
                            <div className="text-muted-foreground">{transfer.from_department_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          {transfer.to_location_name}
                          {transfer.to_department_name && (
                            <div className="text-muted-foreground">{transfer.to_department_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{transfer.requested_by_name}</TableCell>
                      <TableCell>
                        {new Date(transfer.requested_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(transfer.transfer_status)}>
                          {transfer.transfer_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTransfer(transfer)
                            setViewOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Asset Transfer</DialogTitle>
            <DialogDescription>
              Request to transfer an asset to a new location
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Asset *</Label>
              <Select
                value={transferForm.asset_id}
                onValueChange={(value) => setTransferForm({ ...transferForm, asset_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets.map((asset) => (
                    <SelectItem key={asset.asset_id} value={asset.asset_id.toString()}>
                      {asset.asset_name} ({asset.asset_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select
                  value={transferForm.from_location_id}
                  onValueChange={(value) => setTransferForm({ ...transferForm, from_location_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Current location (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.location_id} value={loc.location_id.toString()}>
                        {loc.location_name} ({loc.location_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>To Location *</Label>
                <Select
                  value={transferForm.to_location_id}
                  onValueChange={(value) => setTransferForm({ ...transferForm, to_location_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.location_id} value={loc.location_id.toString()}>
                        {loc.location_name} ({loc.location_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Transfer Reason</Label>
              <Input
                placeholder="Reason for transfer"
                value={transferForm.transfer_reason}
                onChange={(e) => setTransferForm({ ...transferForm, transfer_reason: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes"
                value={transferForm.notes}
                onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Submit Transfer Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Asset Transfer {selectedTransfer?.transfer_number}</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <WorkflowApprovalCard 
                documentType="asset_transfer" 
                documentId={selectedTransfer.transfer_id} 
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Asset:</span> {selectedTransfer.asset_name} ({selectedTransfer.asset_code})
                </div>
                <div>
                  <span className="font-semibold">From:</span> {selectedTransfer.from_location_name || "—"}
                </div>
                <div>
                  <span className="font-semibold">To:</span> {selectedTransfer.to_location_name}
                </div>
                <div>
                  <span className="font-semibold">Requested By:</span> {selectedTransfer.requested_by_name}
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {new Date(selectedTransfer.requested_date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <Badge variant={getStatusColor(selectedTransfer.transfer_status)}>
                    {selectedTransfer.transfer_status}
                  </Badge>
                </div>
                {selectedTransfer.transfer_reason && (
                  <div className="col-span-2">
                    <span className="font-semibold">Reason:</span> {selectedTransfer.transfer_reason}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
