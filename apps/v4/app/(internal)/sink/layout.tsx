import { Figtree, Inter, Noto_Sans, Nunito_Sans } from "next/font/google"

import { cn } from "@/lib/utils"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/registry/new-york-v4/ui/sidebar"
import { AppBreadcrumbs } from "@/app/(internal)/sink/components/app-breadcrumbs"
import { AppSidebar } from "@/app/(internal)/sink/components/app-sidebar"
import { ThemeSelector } from "@/app/(internal)/sink/components/theme-selector"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

export default async function SinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      defaultOpen={true}
      className={cn(
        "theme-container",
        inter.variable,
        notoSans.variable,
        nunitoSans.variable,
        figtree.variable
      )}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 flex h-14 items-center border-b p-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-4 ml-2 !h-4" />
          <AppBreadcrumbs />
          <div className="ml-auto flex items-center gap-2">
            <ModeSwitcher />
            <ThemeSelector />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
