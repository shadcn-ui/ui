"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="sales">
      {children}
    </PermissionGuard>
  )
}
