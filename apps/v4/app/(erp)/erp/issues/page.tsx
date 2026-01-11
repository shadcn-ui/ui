"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/new-york-v4/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import { AlertCircle, Filter, GitBranch, ListChecks } from "lucide-react"

interface IssueRow {
  id: string
  created_at: string
  type: "EVENT" | "JOURNAL" | "INVENTORY"
  reference_id: string
  error_code: string
  human_message: string
  suggested_next_action: string
  status: string
  period_id?: number
  trace_path?: string
}

const ERROR_CODES = [
  "PERIOD_CLOSED",
  "INVENTORY_CLOSED",
  "PL_CLOSED",
  "INVALID_SEQUENCE",
  "MISSING_DEPENDENCY",
  "DUPLICATE_EVENT",
  "INSUFFICIENT_STOCK",
  "INVALID_PAYLOAD",
]

const TYPES = [
  { value: "", label: "All" },
  { value: "EVENT", label: "Event" },
  { value: "JOURNAL", label: "Journal" },
  { value: "INVENTORY", label: "Inventory" },
]

const STATUS = [
  { value: "", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "RESOLVED", label: "Resolved" },
]

export default function IssuesPage() {
  const [issues, setIssues] = useState<IssueRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState({
    period_id: "",
    error_code: "",
    type: "",
    status: "OPEN",
  })

  async function loadIssues() {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (filters.period_id) params.set("period_id", filters.period_id)
    if (filters.error_code) params.set("error_code", filters.error_code)
    if (filters.type) params.set("type", filters.type)
    if (filters.status) params.set("status", filters.status)

    try {
      const res = await fetch(`/api/issues?${params.toString()}`)
      if (!res.ok) throw new Error("Unable to load issues")
      const data = await res.json()
      setIssues(data.issues || [])
    } catch (err: any) {
      setError(err.message || "Unable to load issues")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIssues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredLabel = useMemo(() => {
    const parts = []
    if (filters.status) parts.push(filters.status)
    if (filters.type) parts.push(filters.type)
    if (filters.error_code) parts.push(filters.error_code)
    return parts.join(" • ") || "All"
  }, [filters])

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Issues & Blocks</h1>
          <p className="text-muted-foreground">Finance and Ops view of every blocked event, journal, or inventory move.</p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="outline" className="gap-1">
              <GitBranch className="h-4 w-4" />
              Trace-first navigation
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <ListChecks className="h-4 w-4" />
              No silent failures
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          {filteredLabel}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Make issues explainable and actionable for non-technical users</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters((f) => ({ ...f, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Type</span>
            <Select value={filters.type} onValueChange={(value) => setFilters((f) => ({ ...f, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Error code</span>
            <Select
              value={filters.error_code}
              onValueChange={(value) => setFilters((f) => ({ ...f, error_code: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Error code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {ERROR_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Period ID</span>
            <Input
              placeholder="optional"
              value={filters.period_id}
              onChange={(e) => setFilters((f) => ({ ...f, period_id: e.target.value }))}
            />
          </div>
          <div className="md:col-span-4 flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setFilters({ period_id: "", error_code: "", type: "", status: "OPEN" })}>
              Reset
            </Button>
            <Button onClick={loadIssues}>Apply</Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-72 w-full" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Could not load issues</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Open blocks</CardTitle>
            <CardDescription>Click any issue to jump into Trace and resolve</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Explanation</TableHead>
                  <TableHead>Suggested action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No issues found for this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  issues.map((issue) => (
                    <TableRow
                      key={issue.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => issue.trace_path && window.location.assign(issue.trace_path)}
                    >
                      <TableCell>
                        <Badge variant="outline">{issue.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[160px]">
                        {issue.trace_path ? (
                          <Link href={issue.trace_path} className="text-primary hover:underline">
                            {issue.reference_id}
                          </Link>
                        ) : (
                          issue.reference_id
                        )}
                        {issue.period_id && (
                          <div className="text-xs text-muted-foreground">Period {issue.period_id}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={issue.error_code.includes("CLOSED") ? "destructive" : "secondary"}>
                          {issue.error_code}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[260px] whitespace-pre-wrap text-sm text-foreground">
                        {issue.human_message}
                      </TableCell>
                      <TableCell className="max-w-[260px] whitespace-pre-wrap text-sm text-muted-foreground">
                        {issue.suggested_next_action}
                      </TableCell>
                      <TableCell>
                        <Badge variant={issue.status === "RESOLVED" ? "secondary" : "outline"}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(issue.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
