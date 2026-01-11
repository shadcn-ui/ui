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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/new-york-v4/ui/table"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarClock,
  GitBranch,
  Layers,
  LinkIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import type { TimelineItem } from "@/lib/trace"

interface TraceData {
  success: boolean
  context: Record<string, any>
  order?: any
  order_items?: any[]
  stock_movements: any[]
  journal_entries: any[]
  payments: any[]
  returns: any[]
  timeline: TimelineItem[]
  error?: string
}

interface TraceViewProps {
  resourceLabel: string
  resourceId: string
  apiPath: string
  subtitle: string
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function Pill({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${muted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
      {label}
    </span>
  )
}

function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/30 p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
          <span>No downstream impact traced yet.</span>
        </div>
        <Badge variant="secondary">Awaiting activity</Badge>
      </div>
    )
  }

  return (
    <div className="relative ml-1 flex flex-col gap-6">
      <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-primary/60 via-muted to-transparent" />
      {items.map((item) => (
        <div key={`${item.type}-${item.id}`} className="relative pl-8">
          <div className="absolute left-1.5 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-primary/30 bg-background shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {item.type}
                </Badge>
                {item.source_event_id && (
                  <Pill label={`Anchor ${item.source_event_id.slice(0, 8)}`} muted />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold leading-tight">{item.label}</span>
                {item.meta?.reference_number && (
                  <Badge variant="secondary">Ref {item.meta.reference_number}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{item.description || "Linked artifact"}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>{formatDate(item.timestamp || undefined)}</span>
                {item.period && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Period: {item.period.status || "Unknown"}</span>
                    {typeof item.period.pl_closed === "boolean" && (
                      <Badge variant={item.period.pl_closed ? "destructive" : "secondary"}>
                        P&L {item.period.pl_closed ? "Closed" : "Open"}
                      </Badge>
                    )}
                    {typeof item.period.inventory_closed === "boolean" && (
                      <Badge variant={item.period.inventory_closed ? "destructive" : "secondary"}>
                        Inventory {item.period.inventory_closed ? "Closed" : "Open"}
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {item.href && (
                <Link href={item.href} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                  Jump to view
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function InfoCard({ title, value, description, badge }: { title: string; value: string; description?: string; badge?: string }) {
  return (
    <Card className="border-none bg-gradient-to-br from-background to-muted/40 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {badge && <Badge variant="secondary">{badge}</Badge>}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

export function TraceView({ resourceLabel, resourceId, apiPath, subtitle }: TraceViewProps) {
  const [data, setData] = useState<TraceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(apiPath)
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || `Unable to load ${resourceLabel} trace`)
        }
        const body: TraceData = await res.json()
        if (isMounted) setData(body)
      } catch (err: any) {
        if (isMounted) setError(err.message || "Unexpected error")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [apiPath, resourceLabel])

  const periodLockText = useMemo(() => {
    const period = data?.context?.period
    if (!period) return "No period context"
    const pl = period.pl_closed ? "P&L Closed" : "P&L Open"
    const inv = period.inventory_closed ? "Inventory Closed" : "Inventory Open"
    return `${pl} • ${inv}`
  }, [data?.context?.period])

  const downstreamCount = useMemo(() => {
    if (!data) return 0
    return (data.stock_movements?.length || 0) + (data.journal_entries?.length || 0)
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="space-y-4 p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Trace failed</AlertTitle>
          <AlertDescription>{error || "Unable to load trace"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const anchorEvents = data.context?.anchor_event_ids || (data.context?.anchor_event_id ? [data.context.anchor_event_id] : [])

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Transaction Trace</h1>
          <p className="text-muted-foreground">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Badge variant="outline" className="gap-1">
              <GitBranch className="h-4 w-4" />
              Read-only lineage
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <ShieldCheck className="h-4 w-4" />
              Period aware
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {anchorEvents.map((ev: string) => (
            <Badge key={ev} variant="secondary" className="gap-1">
              <LinkIcon className="h-3.5 w-3.5" />
              Anchor {ev.slice(0, 8)}
            </Badge>
          ))}
          <Badge>{resourceLabel} {resourceId}</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Trace Coverage"
          value={`${downstreamCount}`}
          badge={`${data.timeline.length} timeline points`}
          description="Sum of inventory moves and journal entries connected to this source"
        />
        <InfoCard
          title="Period Locks"
          value={periodLockText}
          description="Derived from accounting periods tied to each artifact"
        />
        <InfoCard
          title="Payments & Returns"
          value={`${(data.payments?.length || 0) + (data.returns?.length || 0)}`}
          badge={`${data.payments?.length || 0} payments / ${data.returns?.length || 0} returns`}
          description="Receipts, refunds, and return movements linked to the source"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
          <CardDescription>Ordered lineage from origin to downstream artifacts</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline items={data.timeline} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Inventory Movements
            </CardTitle>
            <CardDescription>Shipments and returns driven by Anchor events</CardDescription>
          </CardHeader>
          <CardContent>
            {data.stock_movements?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movement</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.stock_movements.map((sm) => (
                    <TableRow key={sm.id}>
                      <TableCell>
                        <div className="font-medium capitalize">{sm.movement_type?.toLowerCase()}</div>
                        <div className="text-xs text-muted-foreground">{sm.notes}</div>
                      </TableCell>
                      <TableCell>{sm.warehouse_id || "—"}</TableCell>
                      <TableCell>{sm.quantity ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(sm.movement_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <span>No inventory movement captured.</span>
                <Badge variant="outline">No downstream impact</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Journal Entries
            </CardTitle>
            <CardDescription>Posted accounting impact per Anchor event</CardDescription>
          </CardHeader>
          <CardContent>
            {data.journal_entries?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entry</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.journal_entries.map((je) => (
                    <TableRow key={je.id}>
                      <TableCell>
                        <div className="font-medium">{je.entry_number}</div>
                        <div className="text-xs text-muted-foreground">Ref {je.reference_number || "—"}</div>
                      </TableCell>
                      <TableCell className="capitalize">{je.entry_type}</TableCell>
                      <TableCell>
                        <Badge variant={je.status === "Posted" ? "secondary" : "outline"}>{je.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(je.entry_date || je.posted_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                <span>No journal entries found.</span>
                <Badge variant="outline">No downstream impact</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Payments & Returns
          </CardTitle>
          <CardDescription>Receipts, refunds, and return movements attached to this source</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Payments</span>
                <Badge variant="secondary">{data.payments?.length || 0}</Badge>
              </div>
              {data.payments?.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {data.payments.map((p) => (
                    <li key={p.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                      <div>
                        <div className="font-medium">{p.entry_type}</div>
                        <div className="text-xs text-muted-foreground">{p.entry_number}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(p.entry_date || p.posted_at)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No payments linked.</p>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Returns</span>
                <Badge variant="secondary">{data.returns?.length || 0}</Badge>
              </div>
              {data.returns?.length ? (
                <ul className="mt-3 space-y-2 text-sm">
                  {data.returns.map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                      <div>
                        <div className="font-medium">{r.movement_type}</div>
                        <div className="text-xs text-muted-foreground">{r.reference_number || "No ref"}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(r.movement_date)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No returns recorded.</p>
              )}
            </div>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Read-only</AlertTitle>
            <AlertDescription>
              This view is purpose-built for investigation. Use linked artifacts to jump into other trace modes
              without altering source data.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
