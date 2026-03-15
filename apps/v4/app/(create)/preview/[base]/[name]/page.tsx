import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { BASES, type Base, type BaseName } from "@/registry/config"
import { ActionMenuScript } from "@/app/(create)/components/action-menu"
import { DesignSystemProvider } from "@/app/(create)/components/design-system-provider"
import { HistoryScript } from "@/app/(create)/components/history-buttons"
import { DarkModeScript } from "@/app/(create)/components/mode-switcher"
import { PreviewStyle } from "@/app/(create)/components/preview-style"
import { RandomizeScript } from "@/app/(create)/components/random-button"
import {
  getBaseComponent,
  getBaseItem,
  getItemsForBase,
} from "@/app/(create)/lib/api"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

function PreventScrollOnFocusScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){var f=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(o){f.call(this,Object.assign({},o,{preventScroll:true}))};})();`,
      }}
    />
  )
}

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
  const params: Array<{ base: string; name: string }> = []

  for (const base of BASES) {
    const items = await getItemsForBase(base.name as BaseName)
    for (const item of items) {
      params.push({
        base: base.name,
        name: item.name,
      })
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
    <div className="relative bg-background">
      <PreventScrollOnFocusScript />
      <PreviewStyle />
      <ActionMenuScript />
      <RandomizeScript />
      <HistoryScript />
      <DarkModeScript />
      <DesignSystemProvider>
        <Component />
      </DesignSystemProvider>
      <TailwindIndicator forceMount />
    </div>
  )
}
