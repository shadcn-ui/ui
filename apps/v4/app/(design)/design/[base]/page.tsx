import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { GitHubLink } from "@/components/github-link"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { SiteConfig } from "@/components/site-config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"
import { Customizer } from "@/app/(design)/components/customizer"
import { InstallDialog } from "@/app/(design)/components/install-dialog"
import { ItemExplorer } from "@/app/(design)/components/item-explorer"
import { ItemPicker } from "@/app/(design)/components/item-picker"
import { Preview } from "@/app/(design)/components/preview"
import { getItemsForBase } from "@/app/(design)/lib/api"
import { BASES } from "@/app/(design)/lib/config"
import { designSystemSearchParamsCache } from "@/app/(design)/lib/search-params"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ base: string }>
}): Promise<Metadata> {
  const paramBag = await params
  const base = BASES.find((l) => l.name === paramBag.base)

  if (!base) {
    return notFound()
  }

  const title = "Design"
  const description = "Design your custom components."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(`/design/${base.name}`),
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
      title,
      description,
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  }
}

export async function generateStaticParams() {
  return BASES.map((base) => ({
    base: base.name,
  }))
}

export default async function NewPage({
  params,
  searchParams,
}: {
  params: Promise<{ base: string }>
  searchParams: Promise<SearchParams>
}) {
  const paramBag = await params
  const base = BASES.find((l) => l.name === paramBag.base)

  if (!base) {
    return notFound()
  }

  const [items] = await Promise.all([
    getItemsForBase(base.name),
    designSystemSearchParamsCache.parse(searchParams),
  ])

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
      className="bg-background relative z-10 flex min-h-svh flex-col"
    >
      <header className="bg-background sticky top-0 z-50 w-full">
        <div className="container-wrapper 3xl:fixed:px-0 px-6">
          <div className="3xl:fixed:container flex h-(--header-height) items-center **:data-[slot=separator]:!h-4">
            <div className="flex items-center">
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
              <MainNav items={siteConfig.navItems} />
            </div>
            <div className="flex flex-1 items-center gap-2 md:justify-end">
              <ItemPicker items={filteredItems} />
              <Separator orientation="vertical" className="mx-2" />
              <GitHubLink />
              <Separator orientation="vertical" className="3xl:flex hidden" />
              <SiteConfig className="3xl:flex hidden" />
              <Separator orientation="vertical" />
              <ModeSwitcher />
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <SidebarProvider className="h-auto min-h-min flex-1 items-start overflow-hidden px-0">
          <div
            data-slot="designer"
            className="3xl:fixed:container section-soft flex flex-1 gap-4 p-6 pt-2 [--sidebar-width:--spacing(40)] 2xl:gap-6"
          >
            <ItemExplorer items={filteredItems} />
            <Preview base={base.name} />
            <Customizer items={filteredItems} />
          </div>
        </SidebarProvider>
      </main>
    </div>
  )
}
