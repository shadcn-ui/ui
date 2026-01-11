"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface Permission {
  module: string
  resource: string
  action: string
}

interface UsePermissionsReturn {
  permissions: Permission[]
  modules: string[]
  isLoading: boolean
  hasModule: (module: string) => boolean
  hasPermission: (module: string, resource: string, action: string) => boolean
  checkRouteAccess: () => boolean
}

// Map routes to required modules
const routeModuleMap: Record<string, string> = {
  '/erp/sales': 'sales',
  '/erp/product': 'products',
  '/erp/products': 'products',
  '/erp/customers': 'sales',
  '/erp/accounting': 'accounting',
  '/erp/hris': 'hris',
  '/erp/operations': 'operations',
  '/erp/analytics': 'analytics',
  '/erp/dashboard': 'dashboard',
  '/erp/reports': 'reports',
  '/erp/settings': 'settings',
  '/erp/integrations': 'settings',
}

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [modules, setModules] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const data = await response.json()
          if (data.user?.permissions) {
            setPermissions(data.user.permissions)
            const uniqueModules = [...new Set(data.user.permissions.map((p: Permission) => p.module))] as string[]
            console.log('User permissions loaded:', uniqueModules)
            setModules(uniqueModules)
          }
        } else {
          // Session invalid, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching permissions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPermissions()
  }, [router])

  const hasModule = (module: string): boolean => {
    return modules.includes(module)
  }

  const hasPermission = (module: string, resource: string, action: string): boolean => {
    return permissions.some(
      p => p.module === module && p.resource === resource && p.action === action
    )
  }

  const checkRouteAccess = (): boolean => {
    if (isLoading) return true // Don't block while loading

    // Find required module for current route
    const requiredModule = Object.entries(routeModuleMap).find(([route]) =>
      pathname.startsWith(route)
    )?.[1]

    // If no specific module required or it's the main dashboard, allow
    if (!requiredModule || pathname === '/erp') return true

    // Check if user has the required module
    return hasModule(requiredModule)
  }

  return {
    permissions,
    modules,
    isLoading,
    hasModule,
    hasPermission,
    checkRouteAccess,
  }
}
