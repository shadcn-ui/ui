import { source } from "@/lib/docs"
import { DocsSidebar } from "@/components/docs-sidebar"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container-wrapper flex flex-1 flex-col">
      <SidebarProvider className="min-h-min flex-1">
        <div className="container flex-1 items-start px-0 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <DocsSidebar tree={source.pageTree} />
          <div>{children}</div>
        </div>
      </SidebarProvider>
    </div>
  )
}
