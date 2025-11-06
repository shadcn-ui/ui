import { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { COMPONENT_LIBRARIES } from "@/registry/component-libraries"
import { ConfigForm } from "@/app/(app)/design/components/config-form"
import { Preview } from "@/app/(app)/design/components/preview"
import { getRegistryItemsForLibrary } from "@/app/(app)/design/lib/api"
import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
} from "@/app/(app)/design/lib/search-params"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ library: string }>
}): Promise<Metadata> {
  const paramBag = await params
  const library = COMPONENT_LIBRARIES.find((l) => l.name === paramBag.library)

  if (!library) {
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
      url: absoluteUrl(`/design/${library.name}`),
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
  return COMPONENT_LIBRARIES.map((library) => ({
    library: library.name,
  }))
}

export default async function NewPage({
  params,
  searchParams,
}: {
  params: Promise<{ library: string }>
  searchParams: Promise<SearchParams>
}) {
  const paramBag = await params
  const library = COMPONENT_LIBRARIES.find((l) => l.name === paramBag.library)

  if (!library) {
    return notFound()
  }

  const [, , items] = await Promise.all([
    designSystemSearchParamsCache.parse(searchParams),
    canvaSearchParamsCache.parse(searchParams),
    getRegistryItemsForLibrary(library.name),
  ])

  const filteredItems = items.filter((item) => item !== null)

  return (
    <div
      data-slot="designer"
      className="container-wrapper section-soft fixed:px-0 flex flex-1 flex-col px-2"
    >
      <div className="3xl:fixed:container 3xl:pt-2 3xl:fixed:pt-0 flex flex-1 flex-col px-6 pb-6">
        <div className="flex-start flex flex-1 gap-4">
          <div className="w-56">
            <ConfigForm items={filteredItems} />
          </div>
          <div className="bg-background flex flex-1">
            <Preview library={library.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
