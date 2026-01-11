"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePermissions } from '@/lib/hooks/use-permissions'
import { Loader2 } from 'lucide-react'

interface PermissionGuardProps {
  children: React.ReactNode
  requiredModule?: string
}

export function PermissionGuard({ children, requiredModule }: PermissionGuardProps) {
  const { modules, isLoading, checkRouteAccess } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Check if route access is allowed
      const hasAccess = checkRouteAccess()
      
      // If specific module is required, check that too
      if (requiredModule && !modules.includes(requiredModule)) {
        router.push('/erp/access-denied')
        return
      }
      
      if (!hasAccess) {
        router.push('/erp/access-denied')
      }
    }
  }, [isLoading, modules, requiredModule, router, checkRouteAccess])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
