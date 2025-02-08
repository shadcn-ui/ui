import * as React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { registryItemSchema } from "shadcn/registry"
import { z } from "zod"

import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { absoluteUrl, cn } from "@/lib/utils"
import { siteConfig } from "@/www/config/site"

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    name: string
  }>
}): Promise<Metadata> {
  const { name } = await params
  const item = await getCachedRegistryItem(name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  return {
    title: `${item.name}${item.description ? ` - ${item.description}` : ""}`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/blocks/${item.name}`),
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

export const dynamicParams = false

export async function generateStaticParams() {
  const { Index } = await import("@/__registry__")
  const index = z.record(registryItemSchema).parse(Index)

  return Object.values(index)
    .filter((block) =>
      ["registry:block", "registry:component"].includes(block.type)
    )
    .map((block) => ({
      name: block.name,
    }))
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    name: string
  }>
}) {
  const { name } = await params
  const item = await getCachedRegistryItem(name)
  const Component = getRegistryComponent(name)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <>
      <div className={cn("themes-wrapper bg-background", item.meta?.container)}>
        <Component />
      </div>
    </>
  )
}
