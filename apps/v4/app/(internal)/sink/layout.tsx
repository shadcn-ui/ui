import { ModeSwitcher } from "@/components/mode-switcher"
import { ThemeSelector } from "@/components/theme-selector"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
import { AppBreadcrumbs } from "@/app/(internal)/sink/components/app-breadcrumbs"
import { AppSidebar } from "@/app/(internal)/sink/components/app-sidebar"

export default async function SinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true} className="theme-container">
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-4 ml-2 !h-4" />
          <AppBreadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <ModeSwitcher />
            <ThemeSelector />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
