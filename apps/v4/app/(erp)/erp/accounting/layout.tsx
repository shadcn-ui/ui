"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="accounting">
      {children}
    </PermissionGuard>
  )
}
