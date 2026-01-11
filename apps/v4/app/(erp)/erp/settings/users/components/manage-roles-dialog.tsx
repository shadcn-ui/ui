"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/registry/new-york-v4/ui/dialog"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Label } from "@/registry/new-york-v4/ui/label"
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { toast } from "sonner"
import { Loader2, Shield, Info } from "lucide-react"

interface Role {
  id: number
  name: string
  display_name: string
  description: string
}

interface UserRole extends Role {
  assigned_at: string
}

interface ManageRolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: number | null
  userName: string
  onSuccess: () => void
}

export function ManageRolesDialog({ open, onOpenChange, userId, userName, onSuccess }: ManageRolesDialogProps) {
  const [allRoles, setAllRoles] = useState<Role[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && userId) {
      fetchRoles()
    }
  }, [open, userId])

  const fetchRoles = async () => {
    if (!userId) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/roles?userId=${userId}`)
      const result = await response.json()

      if (result.success) {
        setAllRoles(result.data.allRoles)
        setSelectedRoleIds(result.data.userRoles.map((r: UserRole) => r.id))
      } else {
        throw new Error(result.error || 'Failed to fetch roles')
      }
    } catch (error: any) {
      console.error('Error fetching roles:', error)
      toast.error('Failed to fetch roles', {
        description: error.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleRole = (roleId: number) => {
    setSelectedRoleIds(prev => 
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  const handleSave = async () => {
    if (!userId) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/users/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          roleIds: selectedRoleIds,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update roles')
      }

      toast.success('Roles updated successfully', {
        description: `${userName} has been assigned ${selectedRoleIds.length} role(s). User must login again to see changes.`
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error updating roles:', error)
      toast.error('Failed to update roles', {
        description: error.message
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Roles for {userName}
          </DialogTitle>
          <DialogDescription>
            Select one or more roles to assign to this user. Users can have multiple roles with combined permissions.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-4">
                {allRoles.map((role) => {
                  const isSelected = selectedRoleIds.includes(role.id)
                  return (
                    <div
                      key={role.id}
                      className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleToggleRole(role.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={`role-${role.id}`}
                          className="flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          {role.display_name}
                          {isSelected && (
                            <Badge variant="default" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </Label>
                        {role.description && (
                          <p className="text-sm text-muted-foreground">
                            {role.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="flex items-start gap-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 text-sm">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> Users with multiple roles will have combined permissions from all assigned roles. 
                The user must logout and login again for changes to take effect.
              </div>
            </div>
          </>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
