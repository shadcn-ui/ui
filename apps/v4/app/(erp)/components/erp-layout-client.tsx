"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/registry/new-york-v4/ui/sidebar"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { ERPSidebar } from "@/app/(erp)/erp/components/erp-sidebar"
import { UserProfileDropdown } from "@/app/(erp)/erp/components/user-profile-dropdown"
import { DynamicBreadcrumb } from "@/app/(erp)/erp/components/dynamic-breadcrumb"
import NotificationBadge from "@/components/NotificationBadge"
import { OCEAN_PRODUCTION_MODE, OCEAN_PRODUCTION_BANNER } from "@/lib/runtime-flags-client"

export function ERPLayoutClient({
  children,
  defaultOpen,
}: {
  children: React.ReactNode
  defaultOpen: boolean
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <ERPSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DynamicBreadcrumb />
          <div className="ml-auto flex items-center gap-2">
            <NotificationBadge />
            <UserProfileDropdown />
          </div>
        </header>
        {OCEAN_PRODUCTION_MODE && (
          <div className="bg-amber-100 text-amber-900 border-b border-amber-300 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
            {OCEAN_PRODUCTION_BANNER}
          </div>
        )}
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
