"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="operations">
      {children}
    </PermissionGuard>
  )
}
