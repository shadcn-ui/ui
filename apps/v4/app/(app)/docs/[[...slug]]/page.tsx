import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/server"

import { source } from "@/lib/docs"
import { absoluteUrl } from "@/lib/utils"
import { DocsBreadcrumb } from "@/components/docs-breadcrumb"
import { DocsTableOfContents } from "@/components/docs-toc"
import { mdxComponents } from "@/components/mdx-components"
import { Button } from "@/registry/new-york-v4/ui/button"

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  const doc = page.data

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(doc.slug),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            doc.title
          )}&description=${encodeURIComponent(doc.description)}`,
        },
      ],
      creator: "@shadcn",
    },
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = page.data.body
  const neighbours = await findNeighbour(source.pageTree, page.url)

  return (
    <div
      data-slot="docs"
      className="flex items-start gap-12 px-6 py-6 text-[15px] lg:py-8 xl:w-full"
    >
      <div className="flex-1">
        <div className="mx-auto flex max-w-2xl min-w-0 flex-1 flex-col gap-8 text-neutral-800 dark:text-neutral-300">
          <div className="mdx flex flex-col gap-2">
            <DocsBreadcrumb tree={source.pageTree} />
            <div className="flex flex-col gap-1">
              <h1 className="scroll-m-20 text-3xl font-semibold">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-muted-foreground text-base text-balance">
                  {doc.description}
                </p>
              )}
            </div>
          </div>
          <div>
            <MDX components={mdxComponents} />
          </div>
          <div className="flex items-center gap-2">
            {neighbours.previous && (
              <Button variant="outline" size="sm" asChild>
                <Link href={neighbours.previous.url}>
                  <IconArrowLeft /> {neighbours.previous.name}
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href={neighbours.next.url}>
                  {neighbours.next.name} <IconArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="sticky top-24 ml-auto hidden w-72 xl:block">
        <DocsTableOfContents toc={page.data.toc} />
      </div>
    </div>
  )
}
