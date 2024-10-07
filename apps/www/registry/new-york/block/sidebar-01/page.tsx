import { cookies } from "next/headers"

import { AppSidebar } from "@/registry/new-york/block/sidebar-01/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/registry/new-york/block/sidebar-01/ui/sidebar"

export const iframeHeight = "870px"

export const containerClassName = "w-full h-full"

const SIDEBAR_STATE_COOKIE = "sidebar:state"

export default async function Page() {
  const sidebarState = cookies().get(SIDEBAR_STATE_COOKIE)?.value ?? "true"
  const isSidebarOpen = sidebarState === "true"

  return (
    <SidebarLayout defaultOpen={isSidebarOpen}>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
        </div>
      </main>
    </SidebarLayout>
  )
}
