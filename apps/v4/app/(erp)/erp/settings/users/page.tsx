"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import { SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/registry/new-york-v4/ui/alert-dialog"
import { 
  Users, 
  Search, 
  MoreHorizontal,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Loader2,
  RefreshCw,
  Key,
  Eye,
  EyeOff,
  Shuffle
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { UserFormDialog } from "./components/user-form-dialog"
import { ManageRolesDialog } from "./components/manage-roles-dialog"

interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string
  role: string | null
  roles: string | null
  role_count: number
  is_active: boolean
  total_leads: number
  created_at: string
  updated_at: string
}

interface Stats {
  total_users: number
  active_users: number
  inactive_users: number
  admin_users: number
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    admin_users: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [manualPassword, setManualPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string>('')
  const [isManageRolesDialogOpen, setIsManageRolesDialogOpen] = useState(false)
  const [userToManageRoles, setUserToManageRoles] = useState<User | null>(null)

  const fetchUsers = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }

      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/users?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data.users)
        setStats(result.data.stats)
      } else {
        throw new Error(result.error || 'Failed to fetch users')
      }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isLoading) {
        fetchUsers()
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const handleCreateUser = () => {
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleResetPasswordClick = (user: User) => {
    setUserToResetPassword(user)
    setIsResetPasswordDialogOpen(true)
    setNewPassword('')
    setManualPassword('')
    setPasswordError('')
    setShowPassword(false)
  }

  const handleManageRolesClick = (user: User) => {
    setUserToManageRoles(user)
    setIsManageRolesDialogOpen(true)
  }

  const generateRandomPassword = () => {
    const length = 16
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setManualPassword(password)
    setPasswordError('')
  }

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleResetPasswordConfirm = async () => {
    if (!userToResetPassword) return

    if (!validatePassword(manualPassword)) {
      return
    }

    setIsResettingPassword(true)
    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userToResetPassword.id,
          newPassword: manualPassword
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to reset password')
      }

      setNewPassword(manualPassword)
      
      toast.success('Password reset successfully', {
        description: `Password has been updated for ${userToResetPassword.full_name}.`
      })
    } catch (error: any) {
      console.error('Error resetting password:', error)
      toast.error('Failed to reset password', {
        description: error.message || 'An error occurred while resetting the password.'
      })
      setIsResetPasswordDialogOpen(false)
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword)
    toast.success('Password copied to clipboard')
  }

  const handleCloseResetPasswordDialog = () => {
    setIsResetPasswordDialogOpen(false)
    setUserToResetPassword(null)
    setNewPassword('')
    setManualPassword('')
    setPasswordError('')
    setShowPassword(false)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete user')
      }

      toast.success('User deactivated successfully', {
        description: result.warning || `${userToDelete.full_name} has been deactivated.`
      })

      fetchUsers()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user', {
        description: error.message
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleFormSuccess = () => {
    fetchUsers(true)
  }

  const filteredUsers = users

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  const getRoleBadge = (roles: string | null, roleCount: number) => {
    if (!roles || roleCount === 0) {
      return <Badge variant="outline">No Roles</Badge>
    }

    const rolesList = roles.split(', ')
    
    if (rolesList.length === 1) {
      return <Badge variant="secondary">{rolesList[0]}</Badge>
    }
    
    return (
      <div className="flex gap-1 flex-wrap">
        <Badge variant="secondary">{rolesList[0]}</Badge>
        {rolesList.length > 1 && (
          <Badge variant="outline">+{rolesList.length - 1}</Badge>
        )}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMs / 3600000)
    const diffInDays = Math.floor(diffInMs / 86400000)

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    
    return date.toLocaleDateString()
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Link 
            href="/erp/settings" 
            className="text-muted-foreground hover:text-foreground"
          >
            Settings
          </Link>
          <span className="text-muted-foreground">/</span>
          <h1 className="text-lg font-semibold">User Management</h1>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <Button onClick={handleCreateUser}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_users}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admin_users}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactive_users}</div>
              <p className="text-xs text-muted-foreground">Deactivated accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* User Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage your team members and their account permissions here
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(true)}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">No users found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first user'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                            {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{user.full_name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRoleBadge(user.roles, user.role_count)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.is_active)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.total_leads || 0} leads
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageRolesClick(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Manage Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPasswordClick(user)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deactivate User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Form Dialog */}
      <UserFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser ? {
          id: selectedUser.id,
          firstName: selectedUser.first_name,
          lastName: selectedUser.last_name,
          email: selectedUser.email,
          role: selectedUser.role || '',
          isActive: selectedUser.is_active
        } : null}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate {userToDelete?.full_name}. They will no longer appear in assignment lists.
              {userToDelete && userToDelete.total_leads > 0 && (
                <span className="block mt-2 font-semibold text-orange-600">
                  Warning: This user has {userToDelete.total_leads} assigned lead(s) that may need reassignment.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deactivate User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={isResetPasswordDialogOpen} onOpenChange={handleCloseResetPasswordDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newPassword ? 'Password Reset Complete' : 'Reset User Password'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              {newPassword ? (
                <div className="space-y-4">
                  <div>
                    Password has been updated for <span className="font-semibold">{userToResetPassword?.full_name}</span>.
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="text-xs text-muted-foreground mb-2">New Password:</div>
                    <code className="text-lg font-mono font-bold text-foreground break-all">{newPassword}</code>
                  </div>
                  <div className="text-sm text-orange-600 font-semibold">
                    ⚠️ Please copy this password and provide it to the user. It will not be shown again.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    Set a new password for <span className="font-semibold">{userToResetPassword?.full_name}</span>. 
                    Their current password will no longer work.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">
                      New Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          value={manualPassword}
                          onChange={(e) => {
                            setManualPassword(e.target.value)
                            setPasswordError('')
                          }}
                          placeholder="Enter password (min 8 characters)"
                          className={passwordError ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateRandomPassword}
                        title="Generate random password"
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                    {passwordError && (
                      <div className="text-sm text-red-500">{passwordError}</div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long. Click the shuffle icon to generate a random password.
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {newPassword ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCopyPassword}
                >
                  Copy Password
                </Button>
                <AlertDialogAction onClick={handleCloseResetPasswordDialog}>
                  Done
                </AlertDialogAction>
              </>
            ) : (
              <>
                <AlertDialogCancel disabled={isResettingPassword}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetPasswordConfirm}
                  disabled={isResettingPassword || !manualPassword}
                >
                  {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Roles Dialog */}
      <ManageRolesDialog
        open={isManageRolesDialogOpen}
        onOpenChange={setIsManageRolesDialogOpen}
        userId={userToManageRoles?.id || null}
        userName={userToManageRoles?.full_name || ''}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}