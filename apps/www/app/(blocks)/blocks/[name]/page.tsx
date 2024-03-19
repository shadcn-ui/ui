import { siteConfig } from "@/config/site"
import { getAllBlockIds, getBlock } from "@/lib/blocks"
import { absoluteUrl } from "@/lib/utils"

import "@/styles/mdx.css"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: {
    name: string
  }
}): Promise<Metadata> {
  const block = await getBlock(params.name)

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
  return blockIds.map((name) => ({ name }))
}

export default async function BlockPage({
  params,
}: {
  params: {
    name: string
  }
}) {
  const { name } = params
  const block = await getBlock(name)

  if (!block) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-red-100">
        <p className="text-sm text-muted-foreground">
          Block{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      </div>
    )
  }

  const Component = block.component

  return (
    <div className={block.container?.className}>
      <Component />
    </div>
  )
}
