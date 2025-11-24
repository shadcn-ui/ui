import { Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/lib/config"
import { getRegistryComponent, getRegistryItems } from "@/lib/registry"
import { absoluteUrl, cn } from "@/lib/utils"
import { getStyle, STYLES } from "@/registry/styles"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

const allowedTypes = ["registry:example"]

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    style: string
  }>
}): Promise<Metadata> {
  const { style: styleName } = await params
  const style = getStyle(styleName)

  if (!style) {
    return {}
  }

  const title = style.title

  return {
    title,
    openGraph: {
      title,
      type: "article",
      url: absoluteUrl(`/sandbox/${style.name}`),
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
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  }
}

export async function generateStaticParams() {
  return STYLES.map((style) => ({
    style: style.name,
  }))
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{
    style: string
  }>
}) {
  const { style: styleName } = await params
  const style = getStyle(styleName)

  if (!style) {
    return notFound()
  }

  const items = await getRegistryItems(style.name, (item) =>
    allowedTypes.includes(item.type)
  )

  if (items.length === 0) {
    return notFound()
  }

  return (
    <>
      <div className={cn("grid gap-6")}>
        {items
          .filter((item) => item !== null)
          .map((item) => {
            const Component = getRegistryComponent(item.name, style.name)
            if (!Component) {
              return null
            }
            return (
              <div
                key={item.name}
                className={cn("bg-background", item.meta?.container)}
              >
                <Component />
              </div>
            )
          })}
      </div>
    </>
  )
}
