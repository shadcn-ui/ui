/* eslint-disable react-hooks/static-components */
import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import {
  getDemoItem,
  getRegistryComponent,
  getRegistryItem,
} from "@/lib/registry"
import { absoluteUrl } from "@/lib/utils"
import { getStyle, legacyStyles, type Style } from "@/registry/_legacy-styles"

import "@/styles/legacy-themes.css"

import { ComponentPreview } from "./component-preview"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(
  async (name: string, styleName: Style["name"]) => {
    // Try registry item first, then fallback to demo item (for examples).
    const item = await getRegistryItem(name, styleName)
    if (item) {
      return item
    }
    return await getDemoItem(name, styleName)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    style: string
    name: string
  }>
}): Promise<Metadata> {
  const { style: styleName, name } = await params
  const style = getStyle(styleName)

  if (!style) {
    return {}
  }

  const item = await getCachedRegistryItem(name, style.name)

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
      url: absoluteUrl(`/view/${style.name}/${item.name}`),
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
  const { Index } = await import("@/registry/__index__")
  // const { Index: BasesIndex } = await import("@/registry/bases/__index__")
  const { ExamplesIndex } = await import("@/examples/__index__")
  const params: Array<{ style: string; name: string }> = []

  for (const style of legacyStyles) {
    // Check if this is a base-prefixed style (e.g., base-nova, radix-nova).
    const baseMatch = style.name.match(/^(base|radix)-/)
    if (baseMatch) {
      const baseName = baseMatch[1]

      // Add examples from ExamplesIndex.
      const examples = ExamplesIndex[baseName]
      if (examples) {
        for (const exampleName of Object.keys(examples)) {
          if (exampleName.startsWith("sidebar-")) {
            params.push({
              style: style.name,
              name: exampleName,
            })
          }
        }
      }

      // // Add UI components from BasesIndex.
      // const baseIndex = BasesIndex[baseName]
      // if (baseIndex) {
      //   for (const itemName in baseIndex) {
      //     const item = baseIndex[itemName]
      //     if (
      //       [
      //         "registry:block",
      //         "registry:component",
      //         "registry:example",
      //         "registry:internal",
      //       ].includes(item.type)
      //     ) {
      //       params.push({
      //         style: style.name,
      //         name: item.name,
      //       })
      //     }
      //   }
      // }

      continue
    }

    // Handle legacy styles (e.g., new-york-v4).
    if (!Index[style.name]) {
      continue
    }

    const styleIndex = Index[style.name]
    for (const itemName in styleIndex) {
      const item = styleIndex[itemName]
      if (
        [
          "registry:block",
          "registry:component",
          "registry:example",
          "registry:internal",
        ].includes(item.type)
      ) {
        params.push({
          style: style.name,
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
    style: string
    name: string
  }>
}) {
  const { style: styleName, name } = await params
  const style = getStyle(styleName)

  if (!style) {
    return notFound()
  }

  const item = await getCachedRegistryItem(name, style.name)
  const Component = getRegistryComponent(name, style.name)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <ComponentPreview>
      <Component />
    </ComponentPreview>
  )
}
