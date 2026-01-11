"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { 
  BookOpen, 
  Plus, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  AlertCircle
} from "lucide-react"

interface Account {
  id: number
  account_code: string
  account_name: string
  account_type: string
  balance: number
  debit_total: number
  credit_total: number
}

interface JournalEntry {
  id: number
  entry_number: string
  entry_date: string
  description: string
  total_debit: number
  total_credit: number
  status: string
}

export default function GeneralLedgerPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setAccounts([
      {
        id: 1,
        account_code: "1000",
        account_name: "Cash in Bank - BCA",
        account_type: "Asset",
        balance: 485000000,
        debit_total: 5850000000,
        credit_total: 5365000000
      },
      {
        id: 2,
        account_code: "1100",
        account_name: "Accounts Receivable - Wholesale",
        account_type: "Asset",
        balance: 1250000000,
        debit_total: 2850000000,
        credit_total: 1600000000
      },
      {
        id: 3,
        account_code: "1200",
        account_name: "Raw Materials Inventory - Ingredients",
        account_type: "Asset",
        balance: 680000000,
        debit_total: 1450000000,
        credit_total: 770000000
      },
      {
        id: 4,
        account_code: "1210",
        account_name: "Finished Goods Inventory - Skincare Products",
        account_type: "Asset",
        balance: 920000000,
        debit_total: 2100000000,
        credit_total: 1180000000
      },
      {
        id: 5,
        account_code: "1500",
        account_name: "Production Equipment - Machinery",
        account_type: "Asset",
        balance: 2500000000,
        debit_total: 2500000000,
        credit_total: 0
      },
      {
        id: 6,
        account_code: "2000",
        account_name: "Accounts Payable - Suppliers",
        account_type: "Liability",
        balance: 890000000,
        debit_total: 450000000,
        credit_total: 1340000000
      },
      {
        id: 7,
        account_code: "2100",
        account_name: "Salaries Payable",
        account_type: "Liability",
        balance: 125000000,
        debit_total: 875000000,
        credit_total: 1000000000
      },
      {
        id: 8,
        account_code: "3000",
        account_name: "Share Capital",
        account_type: "Equity",
        balance: 3000000000,
        debit_total: 0,
        credit_total: 3000000000
      },
      {
        id: 9,
        account_code: "3100",
        account_name: "Retained Earnings",
        account_type: "Equity",
        balance: 1850000000,
        debit_total: 0,
        credit_total: 1850000000
      },
      {
        id: 10,
        account_code: "4000",
        account_name: "Sales Revenue - Skincare Products",
        account_type: "Revenue",
        balance: 4750000000,
        debit_total: 0,
        credit_total: 4750000000
      },
      {
        id: 11,
        account_code: "5000",
        account_name: "Cost of Goods Sold - Production",
        account_type: "Expense",
        balance: 1900000000,
        debit_total: 1900000000,
        credit_total: 0
      },
      {
        id: 12,
        account_code: "5100",
        account_name: "Salaries Expense - Production Staff",
        account_type: "Expense",
        balance: 450000000,
        debit_total: 450000000,
        credit_total: 0
      },
      {
        id: 13,
        account_code: "5200",
        account_name: "Marketing & Advertising Expense",
        account_type: "Expense",
        balance: 380000000,
        debit_total: 380000000,
        credit_total: 0
      },
      {
        id: 14,
        account_code: "5300",
        account_name: "Utilities - Factory",
        account_type: "Expense",
        balance: 85000000,
        debit_total: 85000000,
        credit_total: 0
      }
    ])

    setJournalEntries([
      {
        id: 1,
        entry_number: "JE-2025-1547",
        entry_date: "2025-12-14",
        description: "Sales - Brightening Serum wholesale to Guardian Pharmacy",
        total_debit: 285000000,
        total_credit: 285000000,
        status: "posted"
      },
      {
        id: 2,
        entry_number: "JE-2025-1548",
        entry_date: "2025-12-14",
        description: "Purchase raw materials - Vitamin C & Niacinamide from PT Kimia Farma",
        total_debit: 145000000,
        total_credit: 145000000,
        status: "posted"
      },
      {
        id: 3,
        entry_number: "JE-2025-1549",
        entry_date: "2025-12-13",
        description: "Monthly salary payment - Production staff",
        total_debit: 125000000,
        total_credit: 125000000,
        status: "posted"
      },
      {
        id: 4,
        entry_number: "JE-2025-1550",
        entry_date: "2025-12-13",
        description: "Payment to supplier - PT Aroma Nusantara for essential oils",
        total_debit: 87000000,
        total_credit: 87000000,
        status: "posted"
      },
      {
        id: 5,
        entry_number: "JE-2025-1551",
        entry_date: "2025-12-12",
        description: "Sales - SPF Day Cream to Sociolla (online marketplace)",
        total_debit: 198000000,
        total_credit: 198000000,
        status: "posted"
      },
      {
        id: 6,
        entry_number: "JE-2025-1552",
        entry_date: "2025-12-15",
        description: "Marketing campaign - Instagram & TikTok ads",
        total_debit: 45000000,
        total_credit: 45000000,
        status: "draft"
      }
    ])

    setLoading(false)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Asset: "bg-blue-50 text-blue-700 border-blue-200",
      Liability: "bg-red-50 text-red-700 border-red-200",
      Equity: "bg-purple-50 text-purple-700 border-purple-200",
      Revenue: "bg-green-50 text-green-700 border-green-200",
      Expense: "bg-orange-50 text-orange-700 border-orange-200"
    }
    return colors[type] || "bg-gray-50 text-gray-700 border-gray-200"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading general ledger...</p>
        </div>
      </div>
    )
  }

  const totalAssets = accounts
    .filter(a => a.account_type === "Asset")
    .reduce((sum, a) => sum + a.balance, 0)
  
  const totalLiabilities = accounts
    .filter(a => a.account_type === "Liability")
    .reduce((sum, a) => sum + a.balance, 0)
  
  const totalEquity = accounts
    .filter(a => a.account_type === "Equity")
    .reduce((sum, a) => sum + a.balance, 0)
  
  const totalRevenue = accounts
    .filter(a => a.account_type === "Revenue")
    .reduce((sum, a) => sum + a.balance, 0)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            General Ledger
          </h1>
          <p className="text-gray-600 mt-1">Chart of accounts, journal entries, and trial balance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Journal Entry
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAssets)}</div>
            <p className="text-xs text-muted-foreground">Current book value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground">Outstanding obligations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equity</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalEquity)}</div>
            <p className="text-xs text-muted-foreground">Owner's equity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-green-600">Year to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>All accounts in the general ledger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={`p-4 border-2 rounded-lg ${getAccountTypeColor(account.account_type)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {account.account_code} - {account.account_name}
                        </h4>
                        <p className="text-sm">{account.account_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{formatCurrency(account.balance)}</p>
                        <p className="text-xs">Current Balance</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-xs opacity-75">Total Debits</p>
                        <p className="font-semibold">{formatCurrency(account.debit_total)}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Total Credits</p>
                        <p className="font-semibold">{formatCurrency(account.credit_total)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Journal Entries</CardTitle>
              <CardDescription>All accounting journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journalEntries.map((entry) => (
                  <div key={entry.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{entry.entry_number}</h4>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                      </div>
                      <Badge variant={entry.status === "posted" ? "default" : "secondary"}>
                        {entry.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-600">Entry Date</p>
                        <p className="font-semibold">
                          {new Date(entry.entry_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Debit</p>
                        <p className="font-semibold">{formatCurrency(entry.total_debit)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Credit</p>
                        <p className="font-semibold">{formatCurrency(entry.total_credit)}</p>
                      </div>
                    </div>
                    {entry.total_debit !== entry.total_credit && (
                      <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Entry not balanced!</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance</CardTitle>
              <CardDescription>Summary of all account balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Code
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Name
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Debit
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accounts.map((account) => (
                        <tr key={account.id}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {account.account_code}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {account.account_name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {account.debit_total > 0 ? formatCurrency(account.debit_total) : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {account.credit_total > 0 ? formatCurrency(account.credit_total) : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={2} className="px-4 py-3 text-sm text-gray-900">
                          TOTAL
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(accounts.reduce((sum, a) => sum + a.debit_total, 0))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {formatCurrency(accounts.reduce((sum, a) => sum + a.credit_total, 0))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
