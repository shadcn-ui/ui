import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { SkipToContent } from "@/components/skip-to-content"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="layout"
      className="group/layout relative z-10 flex min-h-svh flex-col bg-background has-data-[slot=designer]:h-svh has-data-[slot=designer]:overflow-hidden"
    >
      <SkipToContent />
      <SiteHeader />
      <main
        id="content"
        tabIndex={-1}
        className="flex min-h-0 flex-1 flex-col outline-none"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
