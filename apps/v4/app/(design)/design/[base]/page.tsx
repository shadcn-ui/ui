import { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { BASES } from "@/registry/bases"
import { Customizer } from "@/app/(design)/design/components/customizer"
import { Preview } from "@/app/(design)/design/components/preview"
import { Toolbar } from "@/app/(design)/design/components/toolbar"
import { getItemsForBase } from "@/app/(design)/design/lib/api"
import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
} from "@/app/(design)/design/lib/search-params"

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

  const [, , items] = await Promise.all([
    designSystemSearchParamsCache.parse(searchParams),
    canvaSearchParamsCache.parse(searchParams),
    getItemsForBase(base.name),
  ])

  const filteredItems = items
    .filter((item) => item !== null)
    .map((item) => ({
      name: item.name,
      title: item.title,
    }))

  return (
    <div
      data-slot="designer"
      className="bg-muted/50 flex h-screen flex-1 flex-col"
    >
      <Toolbar items={filteredItems} />
      <Preview base={base.name} />
      <Customizer />
    </div>
  )
}
