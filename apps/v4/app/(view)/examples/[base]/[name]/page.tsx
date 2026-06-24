import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { ExamplesComponents } from "@/examples/__components__"
import { ExamplesIndex } from "@/examples/__index__"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"

export const dynamicParams = true
export const revalidate = 3600

function getExample(base: string, name: string) {
  const item = ExamplesIndex[base]?.[name]
  const Component = ExamplesComponents[base]?.[name]
  if (!item || !Component) {
    return null
  }
  return { item, Component }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ base: string; name: string }>
}): Promise<Metadata> {
  const { base, name } = await params
  const example = getExample(base, name)

  if (!example) {
    return {}
  }

  const title = example.item.name

  return {
    title,
    openGraph: {
      title,
      type: "article",
      url: absoluteUrl(`/examples/${base}/${title}`),
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

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ base: string; name: string }>
}) {
  const { base, name } = await params
  const example = getExample(base, name)

  if (!example) {
    return notFound()
  }

  const { Component } = example

  return <Component />
}
