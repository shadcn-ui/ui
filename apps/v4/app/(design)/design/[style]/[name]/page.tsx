import * as React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"

import { siteConfig } from "@/lib/config"
import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { absoluteUrl } from "@/lib/utils"
import { getStyle, STYLES, type Style } from "@/registry/styles"
import { ThemeProvider } from "@/app/(design)/components/theme-provider"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(
  async (name: string, styleName: Style["name"]) => {
    return await getRegistryItem(name, styleName)
  }
)

const getCachedRegistryComponent = React.cache(
  async (name: string, styleName: Style["name"]) => {
    return await getRegistryComponent(name, styleName)
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
      url: absoluteUrl(`/new/${style.name}/${item.name}`),
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
  const params: Array<{ style: string; name: string }> = []

  for (const style of STYLES) {
    if (!Index[style.name]) {
      continue
    }

    const styleIndex = Index[style.name]
    for (const itemName in styleIndex) {
      const item = styleIndex[itemName]
      if (["registry:example"].includes(item.type)) {
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
  const Component = await getCachedRegistryComponent(name, style.name)

  if (!item || !Component) {
    return notFound()
  }

  return (
    <>
      <Script
        id="design-system-params-listener"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              window.__DESIGN_SYSTEM_PARAMS__ = null;
              window.addEventListener('message', function(event) {
                if (event.data.type === 'design-system-params' && event.data.params) {
                  window.__DESIGN_SYSTEM_PARAMS__ = event.data.params;
                }
              });
            })();
          `,
        }}
      />
      <ThemeProvider>
        <Component />
      </ThemeProvider>
    </>
  )
}
