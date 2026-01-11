"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { Button } from "@/registry/new-york-v4/ui/button";
import { Input } from "@/registry/new-york-v4/ui/input";
import { Label } from "@/registry/new-york-v4/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { Download, FileText, TrendingDown, TrendingUp } from "lucide-react";

interface PLAccount {
  account_code: string;
  account_name: string;
  amount: number;
  subtype: string;
}

interface PLData {
  revenue: PLAccount[];
  expenses: PLAccount[];
  total_revenue: number;
  total_expenses: number;
  net_income: number;
  period_start: string;
  period_end: string;
}

export default function ProfitLossPage() {
  const [loading, setLoading] = useState(false);
  const [plData, setPlData] = useState<PLData | null>(null);
  const [plPeriod, setPlPeriod] = useState("custom");
  const [plStartDate, setPlStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [plEndDate, setPlEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchPLReport();
  }, []);

  const formatIDR = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const groupedRevenue = useMemo(() => groupBySubtype(plData?.revenue || []), [plData]);
  const groupedExpenses = useMemo(() => groupBySubtype(plData?.expenses || []), [plData]);

  const handlePeriodChange = (period: string) => {
    setPlPeriod(period);
    const today = new Date();
    let startDate = new Date();

    switch (period) {
      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "last_month": {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        setPlStartDate(startDate.toISOString().split("T")[0]);
        setPlEndDate(lastMonthEnd.toISOString().split("T")[0]);
        return;
      }
      case "this_quarter": {
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      }
      case "this_year":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case "last_year": {
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        setPlStartDate(startDate.toISOString().split("T")[0]);
        setPlEndDate(lastYearEnd.toISOString().split("T")[0]);
        return;
      }
      default:
        return;
    }

    setPlStartDate(startDate.toISOString().split("T")[0]);
    setPlEndDate(today.toISOString().split("T")[0]);
  };

  const fetchPLReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/accounting/reports/profit-loss?start_date=${plStartDate}&end_date=${plEndDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setPlData(data);
      } else {
        setPlData(null);
      }
    } catch (error) {
      console.error("Error fetching P&L report:", error);
      setPlData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: string) => {
    alert(`Export to ${format.toUpperCase()} coming soon`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profit & Loss</h1>
          <p className="text-muted-foreground">Standalone P&L report (read-only)</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">OPEN</Badge>
          <Button variant="outline" onClick={() => exportReport("pdf")}>
            <Download className="mr-2 h-4 w-4" /> PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport("excel")}>
            <Download className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-5 w-5" />
                Profit & Loss Statement
              </CardTitle>
              <CardDescription>Income and expenses for selected period</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Select value={plPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchPLReport}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {plPeriod === "custom" && (
            <div className="flex gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <Label htmlFor="pl_start">Start Date</Label>
                <Input
                  id="pl_start"
                  type="date"
                  value={plStartDate}
                  onChange={(e) => setPlStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="pl_end">End Date</Label>
                <Input
                  id="pl_end"
                  type="date"
                  value={plEndDate}
                  onChange={(e) => setPlEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchPLReport}>Generate</Button>
              </div>
            </div>
          )}

          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : plData ? (
            <div className="space-y-6">
              <div className="text-center py-4 border-b">
                <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
                <p className="text-muted-foreground">
                  {formatDate(plData.period_start)} - {formatDate(plData.period_end)}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                  Revenue
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(groupedRevenue).map(([subtype, accounts]) => (
                      <>
                        <TableRow key={subtype} className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold capitalize">
                            {subtype.replace("_", " ")}
                          </TableCell>
                        </TableRow>
                        {accounts.map((account) => (
                          <TableRow key={account.account_code}>
                            <TableCell className="pl-8">
                              <div className="font-medium">{account.account_name}</div>
                              <div className="text-sm text-muted-foreground">{account.account_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatIDR(account.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="pl-8 font-semibold">
                            Total {subtype.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIDR(accounts.reduce((sum, acc) => sum + acc.amount, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-green-50 font-bold">
                      <TableCell>Total Revenue</TableCell>
                      <TableCell className="text-right text-green-700">
                        {formatIDR(plData.total_revenue)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-red-600" />
                  Expenses
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(groupedExpenses).map(([subtype, accounts]) => (
                      <>
                        <TableRow key={subtype} className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold capitalize">
                            {subtype.replace("_", " ")}
                          </TableCell>
                        </TableRow>
                        {accounts.map((account) => (
                          <TableRow key={account.account_code}>
                            <TableCell className="pl-8">
                              <div className="font-medium">{account.account_name}</div>
                              <div className="text-sm text-muted-foreground">{account.account_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatIDR(account.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="pl-8 font-semibold">
                            Total {subtype.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIDR(accounts.reduce((sum, acc) => sum + acc.amount, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-red-50 font-bold">
                      <TableCell>Total Expenses</TableCell>
                      <TableCell className="text-right text-red-700">
                        {formatIDR(plData.total_expenses)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted font-bold">
                      <TableCell>Net Income</TableCell>
                      <TableCell className="text-right">{formatIDR(plData.net_income)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-12 border rounded-lg">
              No P&L data available for the selected period
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function groupBySubtype(accounts: PLAccount[]) {
  const grouped: Record<string, PLAccount[]> = {};
  accounts.forEach((account) => {
    if (!grouped[account.subtype]) {
      grouped[account.subtype] = [];
    }
    grouped[account.subtype].push(account);
  });
  return grouped;
}
