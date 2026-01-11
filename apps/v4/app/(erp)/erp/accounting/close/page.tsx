"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle2, ExternalLink, Lock, XCircle } from "lucide-react"
import { usePeriodState } from "@/hooks/use-period-state"

interface PeriodRow {
  id: number
  period_name: string
  start_date: string
  end_date: string
  fiscal_year: number
  status: string
  pl_closed: boolean
  pl_closed_at?: string | null
  pl_closed_by_name?: string | null
  bs_closed: boolean
  bs_closed_at?: string | null
  bs_closed_by_name?: string | null
  inventory_closed?: boolean
  inventory_closed_at?: string | null
  inventory_closed_by_name?: string | null
}

type ModuleKey = "cash" | "ar" | "ap" | "inventory" | "pl" | "bs"

type ModuleStatus = {
  key: ModuleKey
  label: string
  status: "CLOSED" | "OPEN" | "NOT_TRACKED"
  closedAt?: string | null
  closedBy?: string | null
  dependencies?: string[]
  dependencyWarnings?: string[]
}

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
})

function formatDate(value?: string | null) {
  if (!value) return "—"
  return formatter.format(new Date(value))
}

function StatusBadge({ status }: { status: ModuleStatus["status"] }) {
  if (status === "CLOSED") {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        CLOSED
      </Badge>
    )
  }

  if (status === "OPEN") {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        OPEN
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <AlertTriangle className="h-3 w-3" />
      NOT TRACKED
    </Badge>
  )
}

export default function PeriodClosingSummaryPage() {
  const [periods, setPeriods] = useState<PeriodRow[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const { state: periodState, loading: periodStateLoading } = usePeriodState(
    selectedPeriodId ? selectedPeriodId : undefined
  )

  useEffect(() => {
    async function fetchPeriods() {
      try {
        setLoading(true)
        const response = await fetch("/api/accounting/periods")
        const data = await response.json()

        if (data?.periods) {
          setPeriods(data.periods)

          const today = new Date()
          const current = data.periods.find((p: PeriodRow) => {
            const start = new Date(p.start_date)
            const end = new Date(p.end_date)
            return today >= start && today <= end
          })

          const defaultId = (current || data.periods[0])?.id
          if (defaultId) {
            setSelectedPeriodId(String(defaultId))
          }
        }
      } catch (error) {
        console.error("Error loading periods", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPeriods()
  }, [])

  const selectedPeriod = useMemo(
    () => periods.find((p) => String(p.id) === selectedPeriodId),
    [periods, selectedPeriodId]
  )

  const moduleStatuses: ModuleStatus[] = useMemo(() => {
    if (!selectedPeriod) return []

    const plClosed = Boolean(selectedPeriod.pl_closed)
    const invClosed = Boolean(selectedPeriod.inventory_closed)
    const bsClosed = Boolean(selectedPeriod.bs_closed)

    const inventoryDeps: string[] = []
    if (!plClosed) inventoryDeps.push("Requires P&L closed")

    const bsDeps: string[] = []
    if (!plClosed) bsDeps.push("Requires P&L closed")
    if (!invClosed) bsDeps.push("Requires Inventory closed")

    return [
      {
        key: "cash",
        label: "Cash & Bank",
        status: "NOT_TRACKED",
        dependencyWarnings: ["Closing workflow not configured"],
      },
      {
        key: "ar",
        label: "Accounts Receivable",
        status: "NOT_TRACKED",
        dependencyWarnings: ["Closing workflow not configured"],
      },
      {
        key: "ap",
        label: "Accounts Payable",
        status: "NOT_TRACKED",
        dependencyWarnings: ["Closing workflow not configured"],
      },
      {
        key: "inventory",
        label: "Inventory",
        status: invClosed ? "CLOSED" : "OPEN",
        closedAt: selectedPeriod.inventory_closed_at,
        closedBy: selectedPeriod.inventory_closed_by_name,
        dependencyWarnings: inventoryDeps,
      },
      {
        key: "pl",
        label: "Profit & Loss",
        status: plClosed ? "CLOSED" : "OPEN",
        closedAt: selectedPeriod.pl_closed_at,
        closedBy: selectedPeriod.pl_closed_by_name,
      },
      {
        key: "bs",
        label: "Balance Sheet",
        status: bsClosed ? "CLOSED" : "OPEN",
        closedAt: selectedPeriod.bs_closed_at,
        closedBy: selectedPeriod.bs_closed_by_name,
        dependencyWarnings: bsDeps,
      },
    ]
  }, [selectedPeriod])

  const bannerActive =
    !selectedPeriodId ||
    periodStateLoading ||
    !periodState.isOpen ||
    periodState.status === "closed" ||
    periodState.inventoryClosed;

  const navLinks = useMemo(() => {
    const plClosed = Boolean(selectedPeriod?.pl_closed)
    const invClosed = Boolean(selectedPeriod?.inventory_closed)
    const periodClosed = periodState.status === "closed" || !periodState.isOpen || periodState.inventoryClosed

    return [
      {
        label: "Close Cash/Bank",
        href: "/erp/accounting/close/cash-bank",
        enabled: false,
        reason: "Not configured yet",
      },
      {
        label: "Close Inventory",
        href: "/erp/inventory/close",
        enabled: plClosed && !periodClosed,
        reason: plClosed ? (periodClosed ? "Current period closed" : undefined) : "Requires P&L closed",
      },
      {
        label: "Close P&L",
        href: "/erp/accounting/close/pl",
        enabled: !periodClosed,
        reason: periodClosed ? "Current period closed" : undefined,
      },
      {
        label: "Close Balance Sheet",
        href: "/erp/accounting/close/balance-sheet",
        enabled: plClosed && invClosed && !periodClosed,
        reason: periodClosed
          ? "Current period closed"
          : plClosed && invClosed
            ? undefined
            : "Requires P&L and Inventory closed",
      },
    ]
  }, [selectedPeriod, periodState])

  if (loading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Period Closing Summary</h1>
        <p className="text-muted-foreground">
          One read-only view to confirm if a period is safe for financial reporting.
        </p>
      </div>

      <Alert>
        <Lock className="h-4 w-4" />
        <AlertDescription>
          This page is a checkpoint only. No closing actions are available here.
        </AlertDescription>
      </Alert>

        {bannerActive && (
          <Alert className="border-amber-300 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="space-y-1">
              <p className="text-sm font-medium">This period is closed. Transactions are locked. Use the next open period for adjustments.</p>
              <p className="text-xs text-amber-800">Closing links are disabled for closed or unverifiable periods.</p>
            </AlertDescription>
          </Alert>
        )}
      <Card>
        <CardHeader>
          <CardTitle>Period Selector</CardTitle>
          <CardDescription>Choose the accounting period to inspect</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={String(period.id)}>
                  <div className="flex items-center justify-between gap-3">
                    <span>{period.period_name}</span>
                    <Badge variant={period.pl_closed ? "secondary" : "outline"}>
                      {period.pl_closed ? "PL CLOSED" : period.status}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPeriod && (
        <Card>
          <CardHeader>
            <CardTitle>Closing Status Matrix</CardTitle>
            <CardDescription>Module-by-module readiness for this period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {moduleStatuses.map((module) => (
                <div key={module.key} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{module.label}</span>
                        {module.dependencyWarnings && module.dependencyWarnings.length > 0 && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {module.status === "CLOSED"
                          ? "Locked for posting"
                          : module.status === "OPEN"
                            ? "Still open for posting"
                            : "Status not tracked in system"}
                      </div>
                    </div>
                    <StatusBadge status={module.status} />
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Closed at</span>
                      <span className="font-medium text-foreground">{formatDate(module.closedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Closed by</span>
                      <span className="font-medium text-foreground">{module.closedBy || "—"}</span>
                    </div>
                  </div>

                  {module.dependencyWarnings && module.dependencyWarnings.length > 0 && (
                    <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5" />
                      <div className="space-y-1">
                        {module.dependencyWarnings.map((warning) => (
                          <div key={warning}>{warning}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dependency Rules</CardTitle>
          <CardDescription>Visual cues for mandatory sequencing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Inventory cannot close unless P&L is closed.
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Balance Sheet cannot close unless P&L and Inventory are both closed.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Shortcuts</CardTitle>
          <CardDescription>Jump to the appropriate closing workflow</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              asChild
              variant="outline"
              className={`justify-between ${!link.enabled ? "pointer-events-none opacity-60" : ""}`}
            >
              <Link
                href={link.href}
                aria-disabled={!link.enabled}
                prefetch={false}
                tabIndex={link.enabled ? 0 : -1}
              >
                <span>{link.label}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {link.reason && <span>{link.reason}</span>}
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
