import { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { BASES } from "@/registry/bases"
import { Panel } from "@/app/(design)/components/panel"
import { Preview } from "@/app/(design)/components/preview"
import { Toolbar } from "@/app/(design)/components/toolbar"
import { getItemsForBase } from "@/app/(design)/lib/api"
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
    <>
      <Toolbar items={filteredItems} />
      <main className="flex flex-1 flex-col">
        <div className="3xl:fixed:container flex flex-1 gap-6 p-6">
          <Panel items={filteredItems} />
          <div className="flex flex-1 flex-col">
            <Preview base={base.name} />
          </div>
        </div>
      </main>
    </>
  )
}
