import * as React from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Script from "next/script"

import { siteConfig } from "@/lib/config"
import { getRegistryComponent, getRegistryItem } from "@/lib/registry"
import { absoluteUrl } from "@/lib/utils"
import { COMPONENT_LIBRARIES } from "@/registry/component-libraries"
import { FontProvider } from "@/app/(app)/design/components/font-provider"
import { StyleProvider } from "@/app/(app)/design/components/style-provider"
import { ThemeProvider } from "@/app/(app)/design/components/theme-provider"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const getCachedRegistryItem = React.cache(
  async (name: string, library: any) => {
    return await getRegistryItem(name, library)
  }
)

const getCachedRegistryComponent = React.cache(
  async (name: string, library: any) => {
    return await getRegistryComponent(name, library)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    library: string
    name: string
  }>
}): Promise<Metadata> {
  const paramBag = await params
  const library = COMPONENT_LIBRARIES.find((l) => l.name === paramBag.library)

  if (!library) {
    return {}
  }
  const item = await getCachedRegistryItem(paramBag.name, library.name)

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
      url: absoluteUrl(`/preview/${library.name}/${item.name}`),
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
  const params: Array<{ library: string; name: string }> = []

  for (const library of COMPONENT_LIBRARIES) {
    if (!Index[library.name]) {
      continue
    }

    const styleIndex = Index[library.name]
    for (const itemName in styleIndex) {
      const item = styleIndex[itemName]
      if (["registry:example"].includes(item.type)) {
        params.push({
          library: library.name,
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
    library: string
    name: string
  }>
}) {
  const paramBag = await params
  const library = COMPONENT_LIBRARIES.find((l) => l.name === paramBag.library)

  if (!library) {
    return notFound()
  }

  const item = await getCachedRegistryItem(paramBag.name, library.name)
  const Component = await getCachedRegistryComponent(
    paramBag.name,
    library.name
  )

  if (!item || !Component) {
    return notFound()
  }

  return (
    <>
      <Script
        id="design-system-listener"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({
                    type: 'cmd-p-forward'
                  }, '*');
                }
              }
            });
          `,
        }}
      />
      <StyleProvider>
        <ThemeProvider>
          <FontProvider>
            <Component />
          </FontProvider>
        </ThemeProvider>
      </StyleProvider>
    </>
  )
}
