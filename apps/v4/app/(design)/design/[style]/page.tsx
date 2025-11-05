import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeSwitcher } from "@/components/mode-switcher"
import { getStyle } from "@/registry/legacy-styles"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { ConfigForm } from "@/app/(design)/components/config-form"
import { Preview } from "@/app/(design)/components/preview"
import { getRegistryItemsForStyle } from "@/app/(design)/lib/api"
import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
} from "@/app/(design)/lib/search-params"
import { designSystemStyles } from "@/app/(design)/lib/style"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>
}): Promise<Metadata> {
  const { style: styleName } = await params
  const style = getStyle(styleName)

  if (!style) {
    return {}
  }

  const title = style.title
  const description = "Design your custom components."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(`/new/${style.name}`),
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
  return designSystemStyles.map((style) => ({
    style: style.name,
  }))
}

export default async function NewPage({
  params,
  searchParams,
}: {
  params: Promise<{ style: string }>
  searchParams: Promise<SearchParams>
}) {
  const { style: styleName } = await params
  const style = designSystemStyles.find((s) => s.name === styleName)

  if (!style) {
    return notFound()
  }

  const [, , items] = await Promise.all([
    designSystemSearchParamsCache.parse(searchParams),
    canvaSearchParamsCache.parse(searchParams),
    getRegistryItemsForStyle(style.name),
  ])

  const filteredItems = items.filter((item) => item !== null)

  return (
    <div className="bg-muted/50 flex h-svh flex-1 flex-col">
      <header className="sticky top-0 z-50 w-full shrink-0">
        <div className="flex h-12 items-center gap-2 px-4">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <div className="flex-start p-t0 flex flex-1 gap-4 p-4">
        <div className="w-56">
          <ConfigForm items={filteredItems} />
        </div>
        <div className="bg-background flex flex-1 rounded-lg border">
          <Preview style={style.name} />
        </div>
      </div>
    </div>
  )
}
