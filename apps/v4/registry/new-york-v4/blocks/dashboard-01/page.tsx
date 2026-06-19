import { AppSidebar } from "@/registry/new-york-v4/blocks/dashboard-01/components/app-sidebar"
import { ChartAreaInteractive } from "@/registry/new-york-v4/blocks/dashboard-01/components/chart-area-interactive"
import { DataTable } from "@/registry/new-york-v4/blocks/dashboard-01/components/data-table"
import { SectionCards } from "@/registry/new-york-v4/blocks/dashboard-01/components/section-cards"
import { SiteHeader } from "@/registry/new-york-v4/blocks/dashboard-01/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/registry/new-york-v4/ui/sidebar"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
