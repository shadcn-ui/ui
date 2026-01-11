"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Wallet, Plus, Clock, CheckCircle, XCircle, AlertCircle, TrendingDown } from "lucide-react"

interface PettyCashFund {
  id: number
  fund_name: string
  custodian: string
  balance: number
  limit: number
  status: string
}

interface PettyCashTransaction {
  id: number
  transaction_number: string
  transaction_date: string
  description: string
  amount: number
  category: string
  status: string
  requested_by: string
  approved_by?: string
}

export default function PettyCashPage() {
  const [funds, setFunds] = useState<PettyCashFund[]>([])
  const [transactions, setTransactions] = useState<PettyCashTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data
    setFunds([
      {
        id: 1,
        fund_name: "Office & Admin Petty Cash",
        custodian: "Dewi Lestari - Finance",
        balance: 3250000,
        limit: 5000000,
        status: "active"
      },
      {
        id: 2,
        fund_name: "Production Floor Petty Cash",
        custodian: "Ahmad Hidayat - Production Manager",
        balance: 2100000,
        limit: 4000000,
        status: "active"
      },
      {
        id: 3,
        fund_name: "Laboratory & QC Petty Cash",
        custodian: "Dr. Siti Rahmawati - QC Manager",
        balance: 1850000,
        limit: 3000000,
        status: "active"
      }
    ])

    setTransactions([
      {
        id: 1,
        transaction_number: "PC-2025-247",
        transaction_date: "2025-12-14",
        description: "pH test strips and litmus paper for QC laboratory",
        amount: 285000,
        category: "Lab Supplies",
        status: "approved",
        requested_by: "Dr. Siti Rahmawati",
        approved_by: "Dewi Lestari"
      },
      {
        id: 2,
        transaction_number: "PC-2025-248",
        transaction_date: "2025-12-14",
        description: "Emergency courier for BPOM sample submission",
        amount: 150000,
        category: "Transportation",
        status: "approved",
        requested_by: "Budi Santoso",
        approved_by: "Ahmad Hidayat"
      },
      {
        id: 3,
        transaction_number: "PC-2025-249",
        transaction_date: "2025-12-13",
        description: "Production floor cleaning supplies - disinfectant & sanitizer",
        amount: 425000,
        category: "Cleaning Supplies",
        status: "approved",
        requested_by: "Ahmad Hidayat",
        approved_by: "Dewi Lestari"
      },
      {
        id: 4,
        transaction_number: "PC-2025-250",
        transaction_date: "2025-12-13",
        description: "Lunch for production team overtime shift",
        amount: 380000,
        category: "Meals",
        status: "approved",
        requested_by: "Ahmad Hidayat",
        approved_by: "Dewi Lestari"
      },
      {
        id: 5,
        transaction_number: "PC-2025-251",
        transaction_date: "2025-12-12",
        description: "Printer toner and office stationery",
        amount: 320000,
        category: "Office Supplies",
        status: "approved",
        requested_by: "Lisa Santoso",
        approved_by: "Dewi Lestari"
      },
      {
        id: 6,
        transaction_number: "PC-2025-252",
        transaction_date: "2025-12-12",
        description: "Minor repair for mixing tank temperature sensor",
        amount: 650000,
        category: "Maintenance",
        status: "pending",
        requested_by: "Ahmad Hidayat"
      },
      {
        id: 7,
        transaction_number: "PC-2025-253",
        transaction_date: "2025-12-11",
        description: "Sample bottles for R&D new product testing",
        amount: 275000,
        category: "Lab Supplies",
        status: "approved",
        requested_by: "Dr. Siti Rahmawati",
        approved_by: "Dewi Lestari"
      },
      {
        id: 8,
        transaction_number: "PC-2025-254",
        transaction_date: "2025-12-10",
        description: "Taxi for urgent ingredient delivery pickup",
        amount: 185000,
        category: "Transportation",
        status: "approved",
        requested_by: "Budi Santoso",
        approved_by: "Ahmad Hidayat"
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

  const getStatusBadge = (status: string) => {
    const config: { [key: string]: { variant: any; icon: any } } = {
      approved: { variant: "default" as any, icon: CheckCircle },
      pending: { variant: "secondary" as any, icon: Clock },
      rejected: { variant: "destructive" as any, icon: XCircle }
    }
    const { variant, icon: Icon } = config[status] || config.pending
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading petty cash data...</p>
        </div>
      </div>
    )
  }

  const totalBalance = funds.reduce((sum, f) => sum + f.balance, 0)
  const totalLimit = funds.reduce((sum, f) => sum + f.limit, 0)
  const totalSpent = transactions
    .filter(t => t.status === "approved")
    .reduce((sum, t) => sum + t.amount, 0)
  const pendingRequests = transactions.filter(t => t.status === "pending").length

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-8 w-8" />
            Petty Cash Management
          </h1>
          <p className="text-gray-600 mt-1">Manage petty cash funds, requests, and reimbursements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Cash Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalBalance / totalLimit) * 100).toFixed(1)}% of limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Limit</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalLimit)}</div>
            <p className="text-xs text-muted-foreground">Maximum authorized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-orange-600">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="funds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funds">Cash Funds</TabsTrigger>
          <TabsTrigger value="requests">Cash Requests</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="funds">
          <Card>
            <CardHeader>
              <CardTitle>Petty Cash Funds</CardTitle>
              <CardDescription>Active petty cash funds and balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funds.map((fund) => (
                  <div key={fund.id} className="p-4 border-2 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{fund.fund_name}</h4>
                        <p className="text-sm text-gray-600">Custodian: {fund.custodian}</p>
                      </div>
                      <Badge variant={fund.status === "active" ? "default" : "secondary"}>
                        {fund.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Current Balance</p>
                        <p className="text-xl font-bold">{formatCurrency(fund.balance)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Fund Limit</p>
                        <p className="text-xl font-bold">{formatCurrency(fund.limit)}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Utilization</span>
                        <span className="font-semibold">
                          {((fund.balance / fund.limit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (fund.balance / fund.limit) * 100 > 80
                              ? 'bg-green-600'
                              : (fund.balance / fund.limit) * 100 > 50
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${(fund.balance / fund.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Cash Requests</CardTitle>
              <CardDescription>Petty cash reimbursement requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{transaction.transaction_number}</h4>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Amount</p>
                        <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Date</p>
                        <p className="font-semibold">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Category</p>
                        <p className="font-semibold">{transaction.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Requested By</p>
                        <p className="font-semibold">{transaction.requested_by}</p>
                      </div>
                    </div>

                    {transaction.approved_by && (
                      <div className="text-sm text-gray-600">
                        {transaction.status === "approved" ? "Approved" : "Reviewed"} by:{" "}
                        <span className="font-semibold">{transaction.approved_by}</span>
                      </div>
                    )}

                    {transaction.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="default">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Petty Cash Reconciliation</CardTitle>
              <CardDescription>Monthly reconciliation and replenishment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <h4 className="font-semibold mb-4">December 2025 Reconciliation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Opening Balance</span>
                      <span className="font-semibold">{formatCurrency(5000000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Disbursements</span>
                      <span className="font-semibold text-red-600">
                        -{formatCurrency(totalSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Replenishments</span>
                      <span className="font-semibold text-green-600">
                        +{formatCurrency(1200000)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Current Balance</span>
                      <span>{formatCurrency(totalBalance)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Spending by Category</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Office Supplies</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "43%" }} />
                        </div>
                        <span className="text-sm font-semibold w-24 text-right">
                          {formatCurrency(150000)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-sm">Meals</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "57%" }} />
                        </div>
                        <span className="text-sm font-semibold w-24 text-right">
                          {formatCurrency(200000)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
