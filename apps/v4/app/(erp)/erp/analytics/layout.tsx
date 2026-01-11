"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="analytics">
      {children}
    </PermissionGuard>
  )
}
