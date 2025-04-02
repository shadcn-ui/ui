import { cookies } from "next/headers"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeSwitcher } from "@/components/mode-switcher"
import { NavHeader } from "@/components/nav-header"
import { ThemeSelector } from "@/components/theme-selector"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
          <div className="flex h-14 w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1.5" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <NavHeader />
            <div className="ml-auto flex items-center gap-2">
              <ThemeSelector />
              <ModeSwitcher />
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
