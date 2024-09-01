import { AppSidebar } from "@/registry/new-york/block/sidebar-01/components/app-sidebar"
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/registry/new-york/block/sidebar-01/ui/sidebar"

export const iframeHeight = "870px"

export const containerClassName = "w-full h-full"

export default async function Page() {
  const { cookies } = await import("next/headers")
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
        </div>
      </main>
    </SidebarLayout>
  )
}
