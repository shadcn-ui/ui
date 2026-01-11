"use client"

import { PermissionGuard } from "@/components/permission-guard"

export default function HRISLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PermissionGuard requiredModule="hris">
      {children}
    </PermissionGuard>
  )
}
