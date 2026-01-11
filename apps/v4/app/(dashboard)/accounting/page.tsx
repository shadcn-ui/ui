'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card'
import { Button } from '@/registry/new-york-v4/ui/button'
import { Skeleton } from '@/registry/new-york-v4/ui/skeleton'
import {
  BookOpen,
  FileText,
  Receipt,
  CreditCard,
  TrendingUp,
  Target,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Building2,
  Wallet,
  BarChart3
} from 'lucide-react'

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

export default function AccountingDashboard() {
  const [stats, setStats] = useState<AccountingStats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch chart of accounts for stats
      const coaResponse = await fetch('/api/accounting/chart-of-accounts')
      const coaData = await coaResponse.json()
      
      // Fetch recent journal entries
      const jeResponse = await fetch('/api/accounting/journal-entries?limit=5')
      const jeData = await jeResponse.json()
      
      // Calculate stats from COA
      const accounts = coaData.accounts || []
      const stats: AccountingStats = {
        totalAssets: accounts
          .filter((a: any) => a.account_type === 'Asset')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        totalLiabilities: accounts
          .filter((a: any) => a.account_type === 'Liability')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        totalEquity: accounts
          .filter((a: any) => a.account_type === 'Equity')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        totalRevenue: accounts
          .filter((a: any) => a.account_type === 'Revenue')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        totalExpenses: accounts
          .filter((a: any) => a.account_type === 'Expense')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        netIncome: 0,
        cashBalance: accounts
          .filter((a: any) => a.account_name.toLowerCase().includes('cash') || a.account_name.toLowerCase().includes('bank'))
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        accountsReceivable: accounts
          .filter((a: any) => a.account_name.toLowerCase().includes('receivable') || a.account_code.startsWith('1103'))
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0),
        accountsPayable: accounts
          .filter((a: any) => a.account_name.toLowerCase().includes('payable') && a.account_type === 'Liability')
          .reduce((sum: number, a: any) => sum + parseFloat(a.current_balance || 0), 0)
      }
      
      stats.netIncome = stats.totalRevenue - stats.totalExpenses
      
      setStats(stats)
      setRecentTransactions(jeData.entries || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      title: 'Chart of Accounts',
      description: 'Manage your account structure',
      icon: BookOpen,
      href: '/erp/accounting/chart-of-accounts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">Manage your financial operations</p>
        </div>
        
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Accounting</h1>
        <p className="text-muted-foreground">Manage your financial operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(stats?.totalAssets || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cash: {formatIDR(stats?.cashBalance || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(stats?.totalLiabilities || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              AP: {formatIDR(stats?.accountsPayable || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(stats?.totalEquity || 0)}</div>
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
            <div className={`text-2xl font-bold ${(stats?.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatIDR(stats?.netIncome || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue - Expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Position */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatIDR(stats?.totalRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatIDR(stats?.totalExpenses || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accounts Receivable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatIDR(stats?.accountsReceivable || 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accounting Modules</h2>
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

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest journal entries</CardDescription>
            </div>
            <Link href="/accounting/journal-entries">
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
    </div>
  )
}
