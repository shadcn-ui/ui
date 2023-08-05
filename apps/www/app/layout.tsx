import "@/styles/globals.css"

import { Analytics } from "@/components/analytics"
import { Toaster as DefaultToaster } from "@/registry/default/ui/toaster"
import { Metadata } from "next"
import { Toaster as NewYorkToaster } from "@/registry/new-york/ui/toaster"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/providers"
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"
import { getCurrentUserSession } from "@/lib/session"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Mezcal UI",
  ],
  authors: [
    {
      name: "Armando",
      url: "https://armando.mx",
    },
    {
      name: "Rafael",
      url: "guzbarraf.com",
    },
  ],
  creator: "mezcal-ui",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mezcalui",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUserSession()
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
              {user ? <SiteHeader /> : null}
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
