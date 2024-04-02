import { Metadata } from "next"
import { notFound } from "next/navigation"

import { siteConfig } from "@/config/site"
import { getAllBlockIds, getBlock } from "@/lib/blocks"
import { absoluteUrl, cn } from "@/lib/utils"
import { Style, styles } from "@/registry/styles"

import "@/styles/mdx.css"
import "public/registry/themes.css"
import { BlockChunk } from "@/components/block-chunk"
import { BlockComponent } from "@/components/block-component"
import { BlockWrapper } from "@/components/block-wrapper"
import { V0Button } from "@/components/v0-button"

export async function generateMetadata({
  params,
}: {
  params: {
    style: Style["name"]
    name: string
  }
}): Promise<Metadata> {
  const { name, style } = params
  const block = await getBlock(name, style)

  if (!block) {
    return {}
  }

  return {
    title: block.name,
    description: block.description,
    openGraph: {
      title: block.name,
      description: block.description,
      type: "article",
      url: absoluteUrl(`/blocks/${block.name}`),
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
      title: block.name,
      description: block.description,
      images: [siteConfig.ogImage],
      creator: "@shadcn",
    },
  }
}

export async function generateStaticParams() {
  const blockIds = await getAllBlockIds()
  return styles
    .map((style) =>
      blockIds.map((name) => ({
        style: style.name,
        name,
      }))
    )
    .flat()
}

export default async function BlockPage({
  params,
}: {
  params: {
    style: Style["name"]
    name: string
  }
}) {
  const { name, style } = params
  const block = await getBlock(name, style)

  if (!block) {
    return notFound()
  }

  const Component = block.component

  const chunks = block.chunks?.map((chunk) => ({ ...chunk }))

  delete block.component
  block.chunks?.map((chunk) => delete chunk.component)

  // "[&_[x-data-chunk]]:z-10 [&_[x-data-chunk]]:border-4 [&_[x-data-chunk]]:border-dashed [&_[x-data-chunk]]:border-gray-300 [&_[x-data-chunk]]:bg-gray-100 [&_[x-data-chunk]]:transition-all [&_[x-data-chunk]]:duration-300 [&_[x-data-chunk]]:animate-in [&_[x-data-chunk]]:slide-in-from-bottom-2",

  return (
    <div className={cn("", block.container?.className || "", "theme-zinc")}>
      {/* TODO: use a provider */}
      <BlockWrapper block={block}>
        <BlockComponent block={block}>
          <Component />
        </BlockComponent>
        {chunks?.map((chunk, index) => (
          <BlockChunk
            key={chunk.name}
            block={block}
            chunk={block.chunks?.[index]}
          >
            <chunk.component />
            <div x-data-chunk-toolbar={chunk.name} className="hidden">
              <V0Button
                name={chunk.name}
                code={block.code}
                description={chunk.description}
                style={block.style}
              />
            </div>
          </BlockChunk>
        ))}
      </BlockWrapper>
    </div>
  )
}
