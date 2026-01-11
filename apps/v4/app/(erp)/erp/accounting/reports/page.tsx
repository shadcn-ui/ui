"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card";
import { Badge } from "@/registry/new-york-v4/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, TrendingUp } from "lucide-react";

export default function FinancialReportsLandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "pl") {
      router.replace("/erp/accounting/reports/profit-loss");
    } else if (tab === "bs") {
      router.replace("/erp/accounting/reports/balance-sheet");
    }
  }, [router, searchParams]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Navigate to Profit & Loss and Balance Sheet</p>
        </div>
        <Badge variant="secondary">Reports Landing</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/erp/accounting/reports/profit-loss" className="block">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="h-5 w-5" />
                  Profit & Loss
                </CardTitle>
                <Badge>Read-only</Badge>
              </div>
              <CardDescription>View period P&L with period context and export</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Go to standalone Profit & Loss report page
            </CardContent>
          </Card>
        </Link>

        <Link href="/erp/accounting/reports/balance-sheet" className="block">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5" />
                  Balance Sheet
                </CardTitle>
                <Badge>Read-only</Badge>
              </div>
              <CardDescription>View Balance Sheet as-of date with export</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Go to standalone Balance Sheet report page
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
