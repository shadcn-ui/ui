import * as React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getAllBlockIds } from "@/lib/blocks"
import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { absoluteUrl, cn } from "@/lib/utils"
import { siteConfig } from "@/www/config/site"

const getCachedRegistryItem = React.cache(async (name: string) => {
  return await getRegistryItem(name)
})

export const dynamicParams = false

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

export async function generateStaticParams() {
  const blockIds = await getAllBlockIds()
  return blockIds.map((name) => ({
    name,
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
