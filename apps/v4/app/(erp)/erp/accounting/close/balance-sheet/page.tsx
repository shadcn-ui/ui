'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, FileText, Lock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Period {
  id: number;
  period_name: string;
  period_type: string;
  start_date: string;
  end_date: string;
  fiscal_year: number;
  status: string;
  pl_closed: boolean;
  pl_closed_at: string | null;
  bs_closed: boolean;
  bs_closed_at: string | null;
}

interface ValidationCheck {
  check_name: string;
  is_valid: boolean;
  message: string;
  details: any;
}

interface ValidationResult {
  canClose: boolean;
  period: Period;
  validationChecks: ValidationCheck[];
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    equation: string;
    isBalanced: boolean;
  };
  carryForward: {
    accountCount: number;
    estimatedLines: number;
  };
}

interface ClosingResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    periodId: number;
    periodName: string;
    carryForwardJournalId: string;
    closingJournalRecordId: number;
    accountsCarriedForward: number;
    summary: {
      totalAssets: number;
      totalLiabilities: number;
      totalEquity: number;
    };
    nextPeriod: {
      id: number;
      startDate: string;
    };
    lockedAccountTypes: string[];
  };
}

export default function BSClosingPage() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closingResult, setClosingResult] = useState<ClosingResult | null>(null);

  const [periodStatus, setPeriodStatus] = useState<any>(null);
  const [checkingPeriod, setCheckingPeriod] = useState(false);

  // Fetch periods on mount
  useEffect(() => {
    fetchPeriods();
  }, []);

  // Check period status when period selected
  useEffect(() => {
    if (selectedPeriodId) {
      const selectedPeriod = periods.find(p => String(p.id) === selectedPeriodId);
      if (selectedPeriod) {
        checkPeriodStatus(selectedPeriod.start_date);
      }
    }
  }, [selectedPeriodId, periods]);

  // Validate when period is selected
  useEffect(() => {
    if (selectedPeriodId) {
      validatePeriod(selectedPeriodId);
    }
  }, [selectedPeriodId]);

  async function checkPeriodStatus(date: string) {
    setCheckingPeriod(true);
    try {
      const response = await fetch(`/api/accounting/period-status?date=${date}`);
      const data = await response.json();
      if (data.success) {
        setPeriodStatus(data);
      }
    } catch (error) {
      console.error('Error checking period status:', error);
    } finally {
      setCheckingPeriod(false);
    }
  }

  const fetchPeriods = async () => {
    try {
      setIsLoadingPeriods(true);
      const response = await fetch('/api/accounting/periods?status=OPEN');
      const data = await response.json();
      setPeriods(data.periods || []);
      
      // Auto-select first period with P&L closed but BS not closed
      const eligiblePeriod = data.periods?.find(
        (p: Period) => p.pl_closed && !p.bs_closed
      );
      if (eligiblePeriod) {
        setSelectedPeriodId(eligiblePeriod.id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch periods:', error);
    } finally {
      setIsLoadingPeriods(false);
    }
  };

  const validatePeriod = async (periodId: string) => {
    try {
      setIsValidating(true);
      setValidation(null);
      setClosingResult(null);
      
      const response = await fetch(
        `/api/accounting/close/balance-sheet/validate?periodId=${periodId}`
      );
      const data = await response.json();
      
      if (response.ok) {
        setValidation(data);
      } else {
        console.error('Validation failed:', data.error);
      }
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClose = async () => {
    if (!selectedPeriodId || !validation?.canClose) return;

    if (!confirm(
      `Are you sure you want to close the Balance Sheet for ${validation.period.period_name}?\n\n` +
      `This will:\n` +
      `• Create ${validation.carryForward.estimatedLines} journal lines\n` +
      `• Lock all Asset, Liability, and Equity accounts\n` +
      `• Carry forward balances to the next period\n\n` +
      `This action cannot be undone.`
    )) {
      return;
    }

    try {
      setIsClosing(true);
      const response = await fetch('/api/accounting/close/balance-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodId: parseInt(selectedPeriodId),
          description: `Balance Sheet Closing for ${validation.period.period_name}`,
        }),
      });

      const data = await response.json();
      setClosingResult(data);

      if (data.success) {
        // Refresh periods list
        await fetchPeriods();
      }
    } catch (error) {
      console.error('Closing error:', error);
      setClosingResult({
        success: false,
        error: 'Failed to close Balance Sheet',
      });
    } finally {
      setIsClosing(false);
    }
  };

  const getCheckIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle2 className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if period is already closed
  const isClosed = validation?.period?.bs_closed;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Balance Sheet Closing</h1>
          <p className="text-muted-foreground mt-1">
            Close Balance Sheet periods and carry forward balances
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Phase D3: BS Closing
        </Badge>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Period</CardTitle>
          <CardDescription>
            Choose an accounting period to close the Balance Sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingPeriods ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a period..." />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id.toString()}>
                    {period.period_name} ({period.period_type}) -{' '}
                    {period.pl_closed ? '✓ P&L Closed' : '⚠ P&L Open'}
                    {period.bs_closed && ' - BS Closed'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {periods.length === 0 && !isLoadingPeriods && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No open periods found. Please create periods first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Validation Checks */}
      {isValidating && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Validating period...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {validation && !isClosed && (
        <>
          {/* Validation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Pre-Closing Validation</CardTitle>
              <CardDescription>
                All checks must pass before closing the Balance Sheet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {validation.validationChecks.map((check) => (
                  <div
                    key={check.check_name}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    {getCheckIcon(check.is_valid)}
                    <div className="flex-1">
                      <div className="font-medium">{check.message}</div>
                      {check.details && Object.keys(check.details).length > 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {JSON.stringify(check.details, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!validation.canClose && (
                <Alert className="mt-4" variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Cannot close Balance Sheet until all validation checks pass.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* BS Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet Summary</CardTitle>
              <CardDescription>
                Ending balances as of {formatDate(validation.period.end_date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Total Assets</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(validation.summary.totalAssets)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Total Liabilities</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(validation.summary.totalLiabilities)}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="text-sm text-muted-foreground">Total Equity</div>
                    <div className="text-2xl font-bold mt-1">
                      {formatCurrency(validation.summary.totalEquity)}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Balance Sheet Equation</span>
                    {validation.summary.isBalanced ? (
                      <Badge variant="default">Balanced</Badge>
                    ) : (
                      <Badge variant="destructive">Not Balanced</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {validation.summary.equation}
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="text-sm text-muted-foreground">Carry-Forward Impact</div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div>• {validation.carryForward.accountCount} accounts with balances</div>
                    <div>• {validation.carryForward.estimatedLines} journal entry lines</div>
                    <div>• Opening balances created in next period</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Already Closed Warning */}
          {periodStatus && validation?.period.bs_closed && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold">Period already closed for Balance Sheet</div>
                <div className="mt-1 text-sm">{periodStatus.human_message}</div>
                {periodStatus.suggested_next_action && (
                  <div className="mt-1 text-sm">→ {periodStatus.suggested_next_action}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Close Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleClose}
                disabled={!validation.canClose || isClosing || checkingPeriod || validation.period.bs_closed}
                size="lg"
                className="w-full"
              >
                {isClosing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Closing Balance Sheet...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Close Balance Sheet for {validation.period.period_name}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Closed State Display */}
      {validation && isClosed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Balance Sheet Closed
            </CardTitle>
            <CardDescription>
              This period's Balance Sheet was closed on{' '}
              {validation.period.bs_closed_at && formatDate(validation.period.bs_closed_at)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                The Balance Sheet for {validation.period.period_name} has been successfully closed.
                All Asset, Liability, and Equity accounts are now locked.
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 p-4 rounded-lg border">
              <div className="text-sm font-medium mb-2">Summary</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Assets: {formatCurrency(validation.summary.totalAssets)}</div>
                <div>Liabilities: {formatCurrency(validation.summary.totalLiabilities)}</div>
                <div>Equity: {formatCurrency(validation.summary.totalEquity)}</div>
                <div className="mt-2 pt-2 border-t">
                  {validation.carryForward.accountCount} accounts carried forward to next period
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Closing Result */}
      {closingResult && (
        <Card>
          <CardHeader>
            <CardTitle>
              {closingResult.success ? 'Success' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {closingResult.success ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{closingResult.message}</AlertDescription>
                </Alert>

                {closingResult.data && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border">
                      <div className="text-sm font-medium mb-2">Closing Details</div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Period: {closingResult.data.periodName}</div>
                        <div>Accounts Carried Forward: {closingResult.data.accountsCarriedForward}</div>
                        <div>Next Period ID: {closingResult.data.nextPeriod.id}</div>
                        <div>Next Period Start: {formatDate(closingResult.data.nextPeriod.startDate)}</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border">
                      <div className="text-sm font-medium mb-2">Locked Account Types</div>
                      <div className="flex gap-2 flex-wrap">
                        {closingResult.data.lockedAccountTypes.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button asChild variant="outline">
                        <Link href={`/erp/accounting/journal-entries/${closingResult.data.carryForwardJournalId}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Carry-Forward Journal
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/erp/accounting/general-ledger">
                          View General Ledger
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {closingResult.error || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
