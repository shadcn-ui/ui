"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york-v4/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"

interface ValidationCheck {
  pass: boolean
  message: string
  details: any
}

interface Validation {
  revenueJournalsPosted: ValidationCheck
  expenseJournalsPosted: ValidationCheck
  cogsPostingsCompleted: ValidationCheck
  noOpenApprovals: ValidationCheck
  accrualsPosted: ValidationCheck
  journalsBalanced: ValidationCheck
  periodOpen: ValidationCheck
}

interface PeriodInfo {
  id: number
  periodName: string
  periodType: string
  startDate: string
  endDate: string
  fiscalYear: number
  status: string
  plClosed: boolean
}

interface Summary {
  totalRevenue: number
  totalExpense: number
  totalCogs: number
  netResult: number
  netResultType: string
}

interface Period {
  id: number
  period_name: string
  start_date: string
  end_date: string
  fiscal_year: number
  status: string
  pl_closed: boolean
  closing_entry_number?: string
}

export default function PLClosingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialPeriodId = searchParams.get("period_id")

  const [periods, setPeriods] = useState<Period[]>([])
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(initialPeriodId || "")
  const [loading, setLoading] = useState(true)
  const [validating, setValidating] = useState(false)
  const [closing, setClosing] = useState(false)

  const [validation, setValidation] = useState<Validation | null>(null)
  const [canClose, setCanClose] = useState(false)
  const [periodInfo, setPeriodInfo] = useState<PeriodInfo | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)

  const [closingResult, setClosingResult] = useState<any>(null)

  const [periodStatus, setPeriodStatus] = useState<any>(null)
  const [checkingPeriod, setCheckingPeriod] = useState(false)

  // Fetch periods
  useEffect(() => {
    async function fetchPeriods() {
      try {
        const response = await fetch("/api/accounting/periods?fiscal_year=2026")
        const data = await response.json()
        if (data.success) {
          setPeriods(data.periods)
          // Auto-select first open period if none selected
          if (!selectedPeriodId && data.periods.length > 0) {
            const firstOpen = data.periods.find((p: Period) => !p.pl_closed)
            if (firstOpen) {
              setSelectedPeriodId(String(firstOpen.id))
            }
          }
        }
      } catch (error) {
        console.error("Error fetching periods:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPeriods()
  }, [])

  // Check period status when period selected
  useEffect(() => {
    if (selectedPeriodId) {
      const selectedPeriod = periods.find(p => String(p.id) === selectedPeriodId)
      if (selectedPeriod) {
        checkPeriodStatus(selectedPeriod.start_date)
      }
    }
  }, [selectedPeriodId, periods])

  // Validate when period selected
  useEffect(() => {
    if (selectedPeriodId) {
      validatePeriod()
    }
  }, [selectedPeriodId])

  async function checkPeriodStatus(date: string) {
    setCheckingPeriod(true)
    try {
      const response = await fetch(`/api/accounting/period-status?date=${date}`)
      const data = await response.json()
      if (data.success) {
        setPeriodStatus(data)
      }
    } catch (error) {
      console.error("Error checking period status:", error)
    } finally {
      setCheckingPeriod(false)
    }
  }

  async function validatePeriod() {
    if (!selectedPeriodId) return

    setValidating(true)
    try {
      const response = await fetch(
        `/api/accounting/close/validate?period_id=${selectedPeriodId}`
      )
      const data = await response.json()

      if (data.success) {
        setValidation(data.validation)
        setCanClose(data.canClose)
        setPeriodInfo(data.periodInfo)
        setSummary(data.summary)
        setClosingResult(null) // Clear any previous closing result
      }
    } catch (error) {
      console.error("Error validating period:", error)
    } finally {
      setValidating(false)
    }
  }

  async function handleClose() {
    if (!selectedPeriodId || !canClose) return

    setClosing(true)
    try {
      const response = await fetch("/api/accounting/close/pl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodId: parseInt(selectedPeriodId),
            // userId: 1, // TODO: Get from session
        }),
      })

      const data = await response.json()

      if (data.success) {
        setClosingResult(data)
        // Refresh periods to show closed status
        const periodsResponse = await fetch("/api/accounting/periods?fiscal_year=2026")
        const periodsData = await periodsResponse.json()
        if (periodsData.success) {
          setPeriods(periodsData.periods)
        }
        // Revalidate to show closed state
        await validatePeriod()
      } else {
        alert(`Failed to close period: ${data.error}`)
      }
    } catch (error) {
      console.error("Error closing period:", error)
      alert("An error occurred while closing the period")
    } finally {
      setClosing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">P&L Period Closing</h1>
          <p className="text-muted-foreground">
            Close Profit & Loss accounts and transfer to Retained Earnings
          </p>
        </div>
        {periodInfo?.plClosed && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            CLOSED
          </Badge>
        )}
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
          <CardDescription>Choose the accounting period to close</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select period..." />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={String(period.id)}>
                  <div className="flex items-center justify-between gap-4">
                    <span>{period.period_name}</span>
                    {period.pl_closed && (
                      <Badge variant="outline" className="ml-2">
                        CLOSED
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Period Info */}
      {periodInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Period Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Period:</span>
              <span className="font-semibold">{periodInfo.periodName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date Range:</span>
              <span className="font-semibold">
                {new Date(periodInfo.startDate).toLocaleDateString()} -{" "}
                {new Date(periodInfo.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fiscal Year:</span>
              <span className="font-semibold">{periodInfo.fiscalYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={periodInfo.plClosed ? "secondary" : "default"}>
                {periodInfo.plClosed ? "CLOSED" : periodInfo.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* P&L Summary */}
      {summary && !periodInfo?.plClosed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              P&L Summary
            </CardTitle>
            <CardDescription>Financial results for closing period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Revenue:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(summary.totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Expense:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(summary.totalExpense)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total COGS:</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(summary.totalCogs)}
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-semibold">Net Result:</span>
              <div className="flex items-center gap-2">
                {summary.netResult >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
                <span
                  className={`text-lg font-bold ${
                    summary.netResult >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(Math.abs(summary.netResult))} {summary.netResultType}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Checklist */}
      {validation && !periodInfo?.plClosed && (
        <Card>
          <CardHeader>
            <CardTitle>Pre-Close Validation</CardTitle>
            <CardDescription>
              All checks must pass before closing can proceed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(validation).map(([key, check]) => (
              <div
                key={key}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                {check.pass ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      check.pass ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {check.message}
                  </p>
                  {!check.pass && check.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {JSON.stringify(check.details)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Period Already Closed Warning */}
      {periodStatus && periodInfo?.plClosed && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold">Period already closed for P&L</div>
            <div className="mt-1 text-sm">{periodStatus.human_message}</div>
            {periodStatus.suggested_next_action && (
              <div className="mt-1 text-sm">→ {periodStatus.suggested_next_action}</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {!periodInfo?.plClosed && (
        <div className="flex gap-3">
          <Button
            onClick={validatePeriod}
            variant="outline"
            disabled={validating || !selectedPeriodId}
          >
            {validating ? "Validating..." : "Re-validate"}
          </Button>
          <Button
            onClick={handleClose}
            disabled={!canClose || closing || !selectedPeriodId || checkingPeriod || periodInfo?.plClosed}
            className="bg-red-600 hover:bg-red-700"
          >
            {closing ? "Closing Period..." : "Close Period"}
          </Button>
        </div>
      )}

      {/* Closing Result */}
      {closingResult && (
        <Alert className="border-green-600 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Period Closed Successfully</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
            <p>{closingResult.message}</p>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>
                Closing Journal: <strong>{closingResult.data.entryNumber}</strong>
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() =>
                router.push(
                  `/erp/accounting/journal-entries?id=${closingResult.data.journalId}`
                )
              }
            >
              View Closing Journal
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Closed Period Info */}
      {periodInfo?.plClosed && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertTitle>Period Already Closed</AlertTitle>
          <AlertDescription>
            This period has been closed. P&L accounts are locked. Any corrections must be
            made as adjusting entries in the next open period.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
