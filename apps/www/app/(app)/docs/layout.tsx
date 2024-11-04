import { docsConfig } from "@/config/docs"
import { DocsSidebarNav } from "@/components/sidebar-nav"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"

interface DocsLayoutProps {
  children: React.ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="border-b border-border/40 dark:border-border">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r border-border/40 dark:border-border">
          <div className="h-full py-6 px-6 lg:py-7 overflow-auto no-scrollbar">
            <DocsSidebarNav config={docsConfig} />
          </div>
        </aside>
        {children}
      </div>
    </div>
  )
}
