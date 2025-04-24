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
      <SidebarProvider className="container min-h-min flex-1 grid-cols-[var(--sidebar-width)_minmax(0,1fr)] items-start px-0 [--sidebar-width:220px] md:grid lg:[--sidebar-width:240px]">
        <DocsSidebar tree={source.pageTree} />
        <div className="border-border/40 h-full border-l">{children}</div>
      </SidebarProvider>
    </div>
  )
}
