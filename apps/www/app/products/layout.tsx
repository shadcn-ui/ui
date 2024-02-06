import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

interface RootLayoutProps {
    children: React.ReactNode
  }

export default function RootLayout({ children }: RootLayoutProps) {
    return (
      <>
      <SiteHeader />
      <main className="relative flex min-h-screen">{children}</main>
      <SiteFooter />
          </>
  )
}