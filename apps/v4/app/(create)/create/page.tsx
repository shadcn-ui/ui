import { type Metadata } from "next"
import Link from "next/link"
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
import { ToolbarControls } from "@/app/(create)/components/toolbar-controls"
import { V0Button } from "@/app/(create)/components/v0-button"
import { getItemsForBase } from "@/app/(create)/lib/api"
import { designSystemSearchParamsCache } from "@/app/(create)/lib/search-params"

export const revalidate = false
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Create Project",
  description: "Design your own shadcn/ui.",
  openGraph: {
    title: "Create Project",
    description: "Design your own shadcn/ui.",
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
    title: "Create Project",
    description: "Design your own shadcn/ui.",
    images: [siteConfig.ogImage],
    creator: "@shadcn",
  },
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await designSystemSearchParamsCache.parse(searchParams)
  const base = BASES.find((b) => b.name === params.base) ?? BASES[0]

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
      className="bg-muted/50 dark:bg-muted/20 relative z-10 flex min-h-svh flex-col"
    >
      <header className="sticky top-0 z-50 w-full">
        <div className="container-wrapper 3xl:fixed:px-0 px-6">
          <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
            <div className="flex items-center xl:w-1/3">
              <MobileNav
                tree={source.pageTree}
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
            <div className="hidden flex-1 items-center justify-center gap-2 xl:flex">
              <ItemPicker items={filteredItems} />
            </div>
            <div className="ml-auto flex items-center gap-2 md:justify-end xl:w-1/3">
              <SiteConfig className="3xl:flex hidden" />
              <Separator orientation="vertical" className="3xl:flex hidden" />
              <ModeSwitcher />
              <Separator orientation="vertical" />
              <V0Button />
              <Separator orientation="vertical" />

              <ToolbarControls />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <SidebarProvider className="h-auto min-h-min flex-1 items-start overflow-hidden px-0">
          <div
            data-slot="designer"
            className="3xl:fixed:container flex flex-1 gap-4 p-6 pt-2 [--sidebar-width:--spacing(40)] 2xl:gap-6"
          >
            <ItemExplorer items={filteredItems} />
            <Preview />
            <Customizer />
          </div>
        </SidebarProvider>
      </main>
    </div>
  )
}
