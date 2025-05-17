import Link from "next/link"
import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/server"
import { z } from "zod"

import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { DocsBreadcrumb } from "@/components/docs-breadcrumb"
import { DocsTableOfContents } from "@/components/docs-toc"
import { OpenInV0Cta } from "@/components/open-in-v0-cta"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"

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

  if (!doc.title || !doc.description) {
    notFound()
  }

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: doc.title,
      description: doc.description,
      type: "article",
      url: absoluteUrl(page.url),
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

  // TODO: Revisit fumadocs types.
  const doc = z
    .object({
      title: z.string(),
      description: z.string(),
      body: z.any(),
      content: z.string(),
      toc: z.array(
        z.object({
          title: z.custom<React.ReactNode>(),
          url: z.string(),
          depth: z.number(),
        })
      ),
    })
    .parse(page.data)

  const MDX = doc.body
  const neighbours = await findNeighbour(source.pageTree, page.url)

  return (
    <div data-slot="docs" className="flex items-stretch text-[15px] xl:w-full">
      <div className="border-grid flex min-w-0 flex-1 flex-col border-r">
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-grid sticky top-[calc(var(--header-height)+1px)] z-10 flex h-12 items-center justify-between border-b px-2 backdrop-blur md:px-4">
          <div className="flex items-center gap-2">
            <DocsTableOfContents
              toc={doc.toc}
              variant="dropdown"
              className="xl:hidden"
            />
            <Separator orientation="vertical" className="mx-1 !h-4 lg:hidden" />
            <DocsBreadcrumb tree={source.pageTree} className="hidden lg:flex" />
          </div>
          <div className="flex items-center gap-2">
            {/* <DocsCopyPage page={doc.content} /> */}
            {/* <Separator orientation="vertical" className="mx-1 !h-4" /> */}
            {neighbours.previous && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 md:size-7"
                asChild
              >
                <Link href={neighbours.previous.url}>
                  <IconArrowLeft />
                  <span className="sr-only">Previous</span>
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button
                variant="outline"
                size="icon"
                className="size-8 md:size-7"
                asChild
              >
                <Link href={neighbours.next.url}>
                  <span className="sr-only">Next</span>
                  <IconArrowRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col gap-8 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
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
          <div className="w-full flex-1 *:data-[slot=alert]:first:mt-0">
            <MDX components={mdxComponents} />
          </div>
        </div>
        <div className="border-grid flex h-16 items-center gap-2 border-t px-4">
          {neighbours.previous && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={neighbours.previous.url}>
                <IconArrowLeft /> {neighbours.previous.name}
              </Link>
            </Button>
          )}
          {neighbours.next && (
            <Button variant="ghost" size="sm" className="ml-auto" asChild>
              <Link href={neighbours.next.url}>
                {neighbours.next.name} <IconArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </div>
      <div className="border-grid sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[calc(100svh-var(--header-height)-var(--footer-height))] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="border-grid h-12 shrink-0 border-b" />
        {doc.toc && (
          <div className="no-scrollbar border-grid overflow-y-auto border-b px-8">
            <DocsTableOfContents toc={doc.toc} />
            <div className="h-12" />
          </div>
        )}
        <div className="flex-1 px-6">
          <OpenInV0Cta />
        </div>
      </div>
    </div>
  )
}
