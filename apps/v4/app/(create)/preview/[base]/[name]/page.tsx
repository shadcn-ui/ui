import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { DarkModeScript } from "@/components/mode-switcher"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { BASES, type Base } from "@/registry/config"
import { DesignSystemProvider } from "@/app/(create)/components/design-system-provider"
import { ItemPickerScript } from "@/app/(create)/components/item-picker"
import { PreviewStyle } from "@/app/(create)/components/preview-style"
import { RandomizeScript } from "@/app/(create)/components/random-button"
import { getBaseComponent, getBaseItem } from "@/app/(create)/lib/api"
import { ALLOWED_ITEM_TYPES } from "@/app/(create)/lib/constants"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCacheRegistryItem = React.cache(
  async (name: string, base: Base["name"]) => {
    return await getBaseItem(name, base)
  }
)

const getCachedRegistryComponent = React.cache(
  async (name: string, base: Base["name"]) => {
    return await getBaseComponent(name, base)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    base: string
    name: string
  }>
}): Promise<Metadata> {
  const paramBag = await params
  const base = BASES.find((l) => l.name === paramBag.base)

  if (!base) {
    return {}
  }
  const item = await getBaseItem(paramBag.name, base.name)

  if (!item) {
    return {}
  }

  const title = item.name
  const description = item.description

  return {
    title: item.name,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: absoluteUrl(`/preview/${base.name}/${item.name}`),
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
  const { Index } = await import("@/registry/bases/__index__")
  const params: Array<{ base: string; name: string }> = []

  for (const base of BASES) {
    if (!Index[base.name]) {
      continue
    }

    const styleIndex = Index[base.name]
    for (const itemName in styleIndex) {
      const item = styleIndex[itemName]
      if (ALLOWED_ITEM_TYPES.includes(item.type)) {
        params.push({
          base: base.name,
          name: item.name,
        })
      }
    }
  }

  return params
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    base: string
    name: string
  }>
}) {
  const paramBag = await params
  const base = BASES.find((l) => l.name === paramBag.base)

  if (!base) {
    return notFound()
  }

  const [item, Component] = await Promise.all([
    getCacheRegistryItem(paramBag.name, base.name),
    getCachedRegistryComponent(paramBag.name, base.name),
  ])

  if (!item || !Component) {
    return notFound()
  }

  return (
    <div className="relative">
      <PreviewStyle />
      <ItemPickerScript />
      <RandomizeScript />
      <DarkModeScript />
      <DesignSystemProvider>
        <Component />
      </DesignSystemProvider>
      <TailwindIndicator forceMount />
    </div>
  )
}
