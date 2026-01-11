'use client'

import { useEffect, useState } from 'react'
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york-v4/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/new-york-v4/ui/dialog"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Skeleton } from "@/registry/new-york-v4/ui/skeleton"
import { Plus, Search, Filter, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react"

interface Account {
  id: number
  account_code: string
  account_name: string
  account_type: string
  account_subtype: string
  parent_account_id: number | null
  current_balance: string
  is_active: boolean
  children?: Account[]
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())
  
  const [formData, setFormData] = useState({
    account_code: '',
    account_name: '',
    account_type: 'Asset',
    account_subtype: '',
    parent_account_id: '',
    opening_balance: '0',
    description: ''
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    filterAccounts()
  }, [accounts, searchTerm, filterType])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/accounting/chart-of-accounts')
      const data = await response.json()
      
      // Handle both success object and direct array response
      let accountsArray = []
      if (data.success) {
        accountsArray = data.accounts || []
      } else if (Array.isArray(data)) {
        accountsArray = data
      } else if (data.accounts) {
        accountsArray = data.accounts
      }
      
      setAccounts(accountsArray)
    } catch (error) {
      console.error('Error fetching accounts:', error)
      setAccounts([])
    } finally {
      setLoading(false)
    }
  }

  const filterAccounts = () => {
    if (!Array.isArray(accounts)) {
      setFilteredAccounts([])
      return
    }
    
    let filtered = accounts

    if (filterType !== 'all') {
      filtered = filtered.filter(acc => acc.account_type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(acc =>
        acc.account_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.account_code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAccounts(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAccount
        ? `/api/accounting/chart-of-accounts/${editingAccount.id}`
        : '/api/accounting/chart-of-accounts'
      
      const method = editingAccount ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parent_account_id: formData.parent_account_id ? parseInt(formData.parent_account_id) : null,
          opening_balance: parseFloat(formData.opening_balance || '0')
        })
      })

      const data = await response.json()
      if (data.success) {
        setIsDialogOpen(false)
        resetForm()
        fetchAccounts()
      } else {
        alert(data.error || 'Failed to save account')
      }
    } catch (error) {
      console.error('Error saving account:', error)
      alert('Failed to save account')
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: account.account_type,
      account_subtype: account.account_subtype || '',
      parent_account_id: account.parent_account_id?.toString() || '',
      opening_balance: account.current_balance || '0',
      description: ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return

    try {
      const response = await fetch(`/api/accounting/chart-of-accounts/${accountId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        fetchAccounts()
      } else {
        alert(data.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account')
    }
  }

  const resetForm = () => {
    setFormData({
      account_code: '',
      account_name: '',
      account_type: 'Asset',
      account_subtype: '',
      parent_account_id: '',
      opening_balance: '0',
      description: ''
    })
    setEditingAccount(null)
  }

  const formatIDR = (amount: string | number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  const toggleNode = (accountId: number) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId)
    } else {
      newExpanded.add(accountId)
    }
    setExpandedNodes(newExpanded)
  }

  const buildTree = (accounts: Account[]): Account[] => {
    const accountMap = new Map<number, Account>()
    const roots: Account[] = []

    // First pass: create map
    accounts.forEach(acc => {
      accountMap.set(acc.id, { ...acc, children: [] })
    })

    // Second pass: build tree
    accounts.forEach(acc => {
      const account = accountMap.get(acc.id)!
      if (acc.parent_account_id && accountMap.has(acc.parent_account_id)) {
        const parent = accountMap.get(acc.parent_account_id)!
        parent.children!.push(account)
      } else {
        roots.push(account)
      }
    })

    return roots
  }

  const renderAccountRow = (account: Account, level: number = 0): JSX.Element[] => {
    const hasChildren = account.children && account.children.length > 0
    const isExpanded = expandedNodes.has(account.id)
    const rows: JSX.Element[] = []

    rows.push(
      <TableRow key={account.id}>
        <TableCell>
          <div style={{ paddingLeft: `${level * 24}px` }} className="flex items-center gap-2">
            {hasChildren && (
              <button
                onClick={() => toggleNode(account.id)}
                className="hover:bg-gray-100 p-1 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <span className="w-6" />}
            <span className="font-mono text-sm">{account.account_code}</span>
          </div>
        </TableCell>
        <TableCell className="font-medium">{account.account_name}</TableCell>
        <TableCell>
          <Badge variant="outline">{account.account_type}</Badge>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{account.account_subtype || '-'}</TableCell>
        <TableCell className="text-right font-mono">{formatIDR(account.current_balance)}</TableCell>
        <TableCell>
          <Badge variant={account.is_active ? "default" : "secondary"}>
            {account.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(account)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(account.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )

    if (isExpanded && hasChildren) {
      account.children!.forEach(child => {
        rows.push(...renderAccountRow(child, level + 1))
      })
    }

    return rows
  }

  const treeData = buildTree(filteredAccounts)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/erp">ERP</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/erp/accounting">Accounting</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chart of Accounts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 p-4 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
            <p className="text-muted-foreground">Manage your account structure and balances</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Subtype</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treeData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No accounts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    treeData.map(account => renderAccountRow(account))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update account information' : 'Create a new account in your chart of accounts'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account_code">Account Code *</Label>
                  <Input
                    id="account_code"
                    value={formData.account_code}
                    onChange={(e) => setFormData({ ...formData, account_code: e.target.value })}
                    placeholder="1101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_type">Account Type *</Label>
                  <Select
                    value={formData.account_type}
                    onValueChange={(value) => setFormData({ ...formData, account_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Revenue">Revenue</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name *</Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                  placeholder="Cash in Bank"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_subtype">Account Subtype</Label>
                <Input
                  id="account_subtype"
                  value={formData.account_subtype}
                  onChange={(e) => setFormData({ ...formData, account_subtype: e.target.value })}
                  placeholder="Current Asset"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parent_account_id">Parent Account</Label>
                  <Select
                    value={formData.parent_account_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_account_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (Root)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Root Account)</SelectItem>
                      {accounts
                        .filter(acc => acc.id !== editingAccount?.id)
                        .map(acc => (
                          <SelectItem key={acc.id} value={acc.id.toString()}>
                            {acc.account_code} - {acc.account_name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opening_balance">Opening Balance</Label>
                  <Input
                    id="opening_balance"
                    type="number"
                    step="0.01"
                    value={formData.opening_balance}
                    onChange={(e) => setFormData({ ...formData, opening_balance: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Account description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAccount ? 'Update Account' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
