import { cookies } from "next/headers"

import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
import { AppSidebar } from "@/app/(examples)/dashboard-02/components/app-sidebar"

import "./theme.css"
import { IconExternalLink } from "@tabler/icons-react"

import { Button } from "@/registry/new-york-v4/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="theme-custom font-sans"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-2 px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-lg font-semibold">Documents</h1>
            <div className="ml-auto">
              <Button variant="link" asChild size="sm">
                <a
                  href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard-02"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconExternalLink />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
