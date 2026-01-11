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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table";
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton";
import { Calendar, Download, TrendingDown, TrendingUp } from "lucide-react";

interface BalanceSheetAccount {
  account_code: string;
  account_name: string;
  balance: number;
  type: string;
}

interface BalanceSheetData {
  assets: BalanceSheetAccount[];
  liabilities: BalanceSheetAccount[];
  equity: BalanceSheetAccount[];
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  as_of_date: string;
}

export default function BalanceSheetPage() {
  const [loading, setLoading] = useState(false);
  const [bsData, setBsData] = useState<BalanceSheetData | null>(null);
  const [bsDate, setBsDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchBalanceSheet();
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

  const assetsByType = useMemo(() => groupByType(bsData?.assets || []), [bsData]);
  const liabilitiesByType = useMemo(
    () => groupByType(bsData?.liabilities || []),
    [bsData]
  );
  const equityByType = useMemo(() => groupByType(bsData?.equity || []), [bsData]);

  const fetchBalanceSheet = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/accounting/reports/balance-sheet?as_of_date=${bsDate}`);
      if (response.ok) {
        const data = await response.json();
        setBsData(data);
      } else {
        setBsData(null);
      }
    } catch (error) {
      console.error("Error fetching balance sheet:", error);
      setBsData(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Balance Sheet</h1>
          <p className="text-muted-foreground">Standalone Balance Sheet (read-only)</p>
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
                <TrendingUp className="h-5 w-5" />
                Balance Sheet
              </CardTitle>
              <CardDescription>Assets, liabilities, and equity as of date</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={bsDate}
                onChange={(e) => setBsDate(e.target.value)}
                className="w-48"
              />
              <Button onClick={fetchBalanceSheet}>Refresh</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : bsData ? (
            <div className="space-y-6">
              <div className="text-center py-4 border-b">
                <h2 className="text-2xl font-bold">Balance Sheet</h2>
                <p className="text-muted-foreground">As of {formatDate(bsData.as_of_date)}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  Assets
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(assetsByType).map(([type, accounts]) => (
                      <>
                        <TableRow key={type} className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold capitalize">
                            {type.replace("_", " ")}
                          </TableCell>
                        </TableRow>
                        {accounts.map((account) => (
                          <TableRow key={account.account_code}>
                            <TableCell className="pl-8">
                              <div className="font-medium">{account.account_name}</div>
                              <div className="text-sm text-muted-foreground">{account.account_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatIDR(account.balance)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="pl-8 font-semibold">
                            Total {type.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIDR(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-blue-50 font-bold">
                      <TableCell>Total Assets</TableCell>
                      <TableCell className="text-right text-blue-700">
                        {formatIDR(bsData.total_assets)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-amber-600" />
                  Liabilities
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(liabilitiesByType).map(([type, accounts]) => (
                      <>
                        <TableRow key={type} className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold capitalize">
                            {type.replace("_", " ")}
                          </TableCell>
                        </TableRow>
                        {accounts.map((account) => (
                          <TableRow key={account.account_code}>
                            <TableCell className="pl-8">
                              <div className="font-medium">{account.account_name}</div>
                              <div className="text-sm text-muted-foreground">{account.account_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatIDR(account.balance)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="pl-8 font-semibold">
                            Total {type.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIDR(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-amber-50 font-bold">
                      <TableCell>Total Liabilities</TableCell>
                      <TableCell className="text-right text-amber-700">
                        {formatIDR(bsData.total_liabilities)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-emerald-600" />
                  Equity
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(equityByType).map(([type, accounts]) => (
                      <>
                        <TableRow key={type} className="bg-muted/50">
                          <TableCell colSpan={2} className="font-semibold capitalize">
                            {type.replace("_", " ")}
                          </TableCell>
                        </TableRow>
                        {accounts.map((account) => (
                          <TableRow key={account.account_code}>
                            <TableCell className="pl-8">
                              <div className="font-medium">{account.account_name}</div>
                              <div className="text-sm text-muted-foreground">{account.account_code}</div>
                            </TableCell>
                            <TableCell className="text-right">{formatIDR(account.balance)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="pl-8 font-semibold">
                            Total {type.replace("_", " ")}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatIDR(accounts.reduce((sum, acc) => sum + acc.balance, 0))}
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                    <TableRow className="bg-emerald-50 font-bold">
                      <TableCell>Total Equity</TableCell>
                      <TableCell className="text-right text-emerald-700">
                        {formatIDR(bsData.total_equity)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-muted font-bold">
                      <TableCell>Total Liabilities & Equity</TableCell>
                      <TableCell className="text-right">
                        {formatIDR(bsData.total_liabilities + bsData.total_equity)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-12 border rounded-lg">
              No balance sheet data available for the selected date
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function groupByType(accounts: BalanceSheetAccount[]) {
  const grouped: Record<string, BalanceSheetAccount[]> = {};
  accounts.forEach((account) => {
    if (!grouped[account.type]) {
      grouped[account.type] = [];
    }
    grouped[account.type].push(account);
  });
  return grouped;
}
