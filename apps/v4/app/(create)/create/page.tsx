import { type Metadata } from "next"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { SiteConfig } from "@/components/site-config"
import { BASES } from "@/registry/config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"
import { Customizer } from "@/app/(create)/components/customizer"
import { ItemExplorer } from "@/app/(create)/components/item-explorer"
import { ItemPicker } from "@/app/(create)/components/item-picker"
import { Preview } from "@/app/(create)/components/preview"
import { RandomButton } from "@/app/(create)/components/random-button"
import { ResetButton } from "@/app/(create)/components/reset-button"
import { ShareButton } from "@/app/(create)/components/share-button"
import { ToolbarControls } from "@/app/(create)/components/toolbar-controls"
import { V0Button } from "@/app/(create)/components/v0-button"
import { WelcomeDialog } from "@/app/(create)/components/welcome-dialog"
import { getItemsForBase } from "@/app/(create)/lib/api"
import { loadDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export const revalidate = false
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "New Project",
  description:
    "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
  openGraph: {
    title: "New Project",
    description:
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
    type: "website",
    url: absoluteUrl("/create"),
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
    title: "New Project",
    description:
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
    images: [siteConfig.ogImage],
    creator: "@shadcn",
  },
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await loadDesignSystemSearchParams(searchParams)
  const base = BASES.find((b) => b.name === params.base) ?? BASES[0]

  const pageTree = source.pageTree
  const items = await getItemsForBase(base.name)

  const filteredItems = items
    .filter((item) => item !== null)
    .map((item) => ({
      name: item.name,
      title: item.title,
      type: item.type,
    }))

  return (
    <div
      data-slot="layout"
      className="section-soft relative z-10 flex min-h-svh flex-col"
    >
      <header className="sticky top-0 z-50 w-full">
        <div className="container-wrapper 3xl:fixed:px-0 px-6">
          <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
            <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
              <MobileNav
                tree={pageTree}
                items={siteConfig.navItems}
                className="flex lg:hidden"
              />
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
              >
                <Link href="/">
                  <Icons.logo className="size-5" />
                  <span className="sr-only">{siteConfig.name}</span>
                </Link>
              </Button>
              <MainNav items={siteConfig.navItems} className="hidden lg:flex" />
            </div>
            <div className="fixed inset-x-0 bottom-0 ml-auto flex flex-1 items-center justify-end gap-2 px-4.5 pb-4 sm:static sm:p-0 lg:ml-0">
              <ItemPicker items={filteredItems} />
              <div className="items-center gap-0 sm:hidden">
                <RandomButton />
                <ResetButton />
              </div>
              <Separator orientation="vertical" className="mr-2 flex" />
            </div>
            <div className="ml-auto flex items-center gap-2 sm:ml-0 md:justify-end">
              <SiteConfig className="3xl:flex hidden" />
              <Separator orientation="vertical" className="3xl:flex hidden" />
              <ModeSwitcher />
              <Separator
                orientation="vertical"
                className="mr-0 -ml-2 sm:ml-0"
              />
              <ShareButton />
              <V0Button />
              <ToolbarControls />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col pb-16 sm:pb-0">
        <SidebarProvider className="flex h-auto min-h-min flex-1 flex-col items-start overflow-hidden px-0">
          <div
            data-slot="designer"
            className="3xl:fixed:container flex w-full flex-1 flex-col gap-2 p-6 pt-1 pb-4 [--sidebar-width:--spacing(40)] sm:gap-2 sm:pt-2 md:flex-row md:pb-6 2xl:gap-6"
          >
            <ItemExplorer base={base.name} items={filteredItems} />
            <Preview />
            <Customizer />
          </div>
        </SidebarProvider>
        <WelcomeDialog />
      </main>
    </div>
  )
}
