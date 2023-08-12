import { getCurrentUserSession, isProUser } from "@/lib/session"

import { Analytics } from "@/components/analytics"
import { Toaster as DefaultToaster } from "@/registry/default/ui/toaster"
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/providers"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { redirect } from "next/navigation"

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await getCurrentUserSession()
  const isPro = await isProUser()

  if (!user) {
    return redirect("/")
  }

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              {user ? <SiteHeader user={{ ...user, isPro }} /> : null}
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
            <TailwindIndicator />
          </ThemeProvider>
          <Analytics />
          <NewYorkToaster />
          <DefaultToaster />
        </body>
      </html>
    </>
  )
}
