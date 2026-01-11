"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="products">
      {children}
    </PermissionGuard>
  )
}
