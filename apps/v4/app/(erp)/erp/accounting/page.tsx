'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import {
  BookOpen,
  FileText,
  Receipt,
  CreditCard,
  TrendingUp,
  Target,
  AlertCircle,
  ArrowRight,
  Building2,
  Wallet,
  BarChart3
} from "lucide-react"

interface AccountingStats {
  totalAssets: number
  totalLiabilities: number
  totalEquity: number
  totalRevenue: number
  totalExpenses: number
  netIncome: number
  cashBalance: number
  accountsReceivable: number
  accountsPayable: number
}

interface RecentTransaction {
  id: number
  entry_number: string
  entry_date: string
  entry_type: string
  description: string
  total_amount: number
  status: string
}

export default function AccountingPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Mock data - Ocean Cosmetics Indonesia skincare business
  const stats: AccountingStats = {
    totalAssets: 5835000000, // IDR 5.84 Billion
    totalLiabilities: 1015000000, // IDR 1.02 Billion
    totalEquity: 4850000000, // IDR 4.85 Billion
    totalRevenue: 4750000000, // IDR 4.75 Billion
    totalExpenses: 2815000000, // IDR 2.82 Billion (COGS + Salaries + Marketing + Utilities)
    netIncome: 1935000000, // IDR 1.94 Billion
    cashBalance: 485000000, // IDR 485 Million
    accountsReceivable: 1250000000, // IDR 1.25 Billion
    accountsPayable: 890000000 // IDR 890 Million
  }

  const recentTransactions: RecentTransaction[] = [
    {
      id: 1,
      entry_number: 'JE-2025-142',
      entry_date: '2025-12-10',
      entry_type: 'Sales',
      description: 'Product sales to Guardian Pharmacy - Dec batch',
      total_amount: 285000000,
      status: 'Posted'
    },
    {
      id: 2,
      entry_number: 'JE-2025-143',
      entry_date: '2025-12-11',
      entry_type: 'Purchase',
      description: 'Raw materials purchase from PT Kimia Farma',
      total_amount: 145000000,
      status: 'Posted'
    },
    {
      id: 3,
      entry_number: 'JE-2025-144',
      entry_date: '2025-12-12',
      entry_type: 'Payroll',
      description: 'Monthly salary payment - Production staff',
      total_amount: 125000000,
      status: 'Posted'
    },
    {
      id: 4,
      entry_number: 'JE-2025-145',
      entry_date: '2025-12-12',
      entry_type: 'Payment',
      description: 'Supplier payment - PT Chemindo Ingredients',
      total_amount: 98000000,
      status: 'Posted'
    },
    {
      id: 5,
      entry_number: 'JE-2025-146',
      entry_date: '2025-12-13',
      entry_type: 'Sales',
      description: 'E-commerce sales via Sociolla platform',
      total_amount: 198000000,
      status: 'Posted'
    }
  ]

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const modules = [
    {
      title: 'General Ledger',
      description: 'View all accounts and balances',
      icon: BookOpen,
      href: '/erp/accounting/general-ledger',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Chart of Accounts',
      description: 'Manage your account structure',
      icon: BookOpen,
      href: '/erp/accounting/chart-of-accounts',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50'
    },
    {
      title: 'Journal Entries',
      description: 'Record financial transactions',
      icon: FileText,
      href: '/erp/accounting/journal-entries',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Accounts Payable',
      description: 'Manage supplier bills & payments',
      icon: Receipt,
      href: '/erp/accounting/accounts-payable',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Accounts Receivable',
      description: 'Track customer invoices',
      icon: CreditCard,
      href: '/erp/accounting/accounts-receivable',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Financial Reports',
      description: 'P&L, Balance Sheet, and more',
      icon: BarChart3,
      href: '/erp/accounting/reports',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Budgets',
      description: 'Plan and track budgets',
      icon: Target,
      href: '/erp/accounting/budgets',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    }
  ]

  return (
    <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Accounting & Finance</h2>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatIDR(stats.totalAssets)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cash: {formatIDR(stats.cashBalance)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatIDR(stats.totalLiabilities)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    AP: {formatIDR(stats.accountsPayable)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatIDR(stats.totalEquity)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Owner's capital
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatIDR(stats.netIncome)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Revenue - Expenses
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatIDR(stats.totalRevenue)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatIDR(stats.totalExpenses)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatIDR(stats.accountsReceivable)}</div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Accounting Modules</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                  <Link key={module.href} href={module.href}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-2`}>
                          <module.icon className={`h-6 w-6 ${module.color}`} />
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="ghost" className="w-full justify-between">
                          Open
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Latest journal entries</CardDescription>
                  </div>
                  <Link href="/erp/accounting/journal-entries">
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No recent transactions
                    </p>
                  ) : (
                    recentTransactions.map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{txn.entry_number}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              txn.status === 'Posted' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {txn.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(txn.entry_date).toLocaleDateString('id-ID')} • {txn.entry_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatIDR(txn.total_amount || 0)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
    </div>
  )
}
