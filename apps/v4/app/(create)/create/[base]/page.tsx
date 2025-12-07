import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { GitHubLink } from "@/components/github-link"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { SiteConfig } from "@/components/site-config"
import { BASES } from "@/registry/config"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"
import { CreateProjectDialog } from "@/app/(create)/components/create-project-dialog"
import { Customizer } from "@/app/(create)/components/customizer"
import { ItemExplorer } from "@/app/(create)/components/item-explorer"
import { ItemPicker } from "@/app/(create)/components/item-picker"
import { Preview } from "@/app/(create)/components/preview"
import { getItemsForBase } from "@/app/(create)/lib/api"
import { designSystemSearchParamsCache } from "@/app/(create)/lib/search-params"

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
      url: absoluteUrl(`/create/${base.name}`),
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
            <div className="flex w-1/3 items-center">
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
              <Separator orientation="vertical" className="mx-2" />
              <Button asChild size="sm" variant="ghost">
                <Link href="/">Home</Link>
              </Button>
              <Separator orientation="vertical" className="mr-4 ml-2" />
              <span className="text-muted-foreground text-sm font-medium">
                New Project
              </span>
            </div>
            <div className="flex flex-1 items-center justify-center gap-2">
              <ItemPicker items={filteredItems} />
            </div>
            <div className="flex w-1/3 items-center gap-2 md:justify-end">
              <SiteConfig className="3xl:flex hidden" />
              <Separator orientation="vertical" className="3xl:flex hidden" />
              <ModeSwitcher />
              <Separator orientation="vertical" className="mr-2" />
              <CreateProjectDialog />
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
            <Customizer base={base.name} />
          </div>
        </SidebarProvider>
      </main>
    </div>
  )
}
