"use client"

import { usePathname } from "next/navigation"
import { PermissionGuard } from "@/components/permission-guard"

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Allow all users to access profile and security pages
  const isPublicSettingsPage = pathname === '/erp/settings/profile' || pathname === '/erp/settings/security'
  
  if (isPublicSettingsPage) {
    return <>{children}</>
  }
  
  // All other settings pages require the settings module permission
  return (
    <PermissionGuard requiredModule="settings">
      {children}
    </PermissionGuard>
  )
}
