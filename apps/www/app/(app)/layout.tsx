import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div data-wrapper="" className="border-grid">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
