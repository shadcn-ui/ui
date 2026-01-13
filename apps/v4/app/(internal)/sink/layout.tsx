import localFont from "next/font/local"

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

const inter = localFont({
  src: "../../../public/fonts/inter/inter-v20-latin-regular.woff2",
  variable: "--font-inter",
  display: "swap",
})

const notoSans = localFont({
  src: "../../../public/fonts/noto-sans/noto-sans-v42-latin-regular.woff2",
  variable: "--font-noto-sans",
  display: "swap",
})

const nunitoSans = localFont({
  src: "../../../public/fonts/nunito-sans/nunito-sans-v19-latin-regular.woff2",
  variable: "--font-nunito-sans",
  display: "swap",
})

const figtree = localFont({
  src: "../../../public/fonts/figtree/figtree-v9-latin-regular.woff2",
  variable: "--font-figtree",
  display: "swap",
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
