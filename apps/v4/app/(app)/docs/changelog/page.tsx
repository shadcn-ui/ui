import fs from "fs"
import path from "path"
import fm from "front-matter"
import Link from "next/link"
import { mdxComponents } from "@/mdx-components"
import { IconRss } from "@tabler/icons-react"

import { source } from "@/lib/source"
import { absoluteUrl } from "@/lib/utils"
import { OpenInV0Cta } from "@/components/open-in-v0-cta"

export const revalidate = false
export const dynamic = "force-static"

export function generateMetadata() {
  return {
    title: "Changelog",
    description: "Latest updates and announcements.",
    openGraph: {
      title: "Changelog",
      description: "Latest updates and announcements.",
      type: "article",
      url: absoluteUrl("/docs/changelog"),
      images: [
        {
          url: `/og?title=${encodeURIComponent(
            "Changelog"
          )}&description=${encodeURIComponent(
            "Latest updates and announcements."
          )}`,
        },
      ],
    },
  }
}

function getDateFromFile(slugs: string[]): Date | null {
  const filePath = path.join(
    process.cwd(),
    "content/docs",
    ...slugs.slice(0, -1),
    `${slugs[slugs.length - 1]}.mdx`
  )
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const { attributes } = fm<{ date?: string | Date }>(content)
    if (attributes.date) {
      return new Date(attributes.date)
    }
  } catch {
    // File not found or parse error.
  }
  return null
}

export default async function ChangelogPage() {
  const rawPages = source.getPages()
  console.log("Raw pages sample:", JSON.stringify(rawPages[0], null, 2))

  const pages = rawPages
    .filter((page) => page.slugs[0] === "changelog" && page.slugs.length > 1)
    .map((page) => ({
      ...page,
      date: getDateFromFile(page.slugs),
    }))
    .sort((a, b) => {
      const dateA = a.date?.getTime() ?? 0
      const dateB = b.date?.getTime() ?? 0
      return dateB - dateA
    })

  const latestPages = pages.slice(0, 5)
  const olderPages = pages.slice(5)

  return (
    <div
      data-slot="docs"
      className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-[40rem] min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h1 className="scroll-m-24 text-4xl font-semibold tracking-tight sm:text-3xl">
                Changelog
              </h1>
              <Link
                href="/rss.xml"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
              >
                <IconRss className="size-4" />
                <span className="sr-only sm:not-sr-only">RSS</span>
              </Link>
            </div>
            <p className="text-muted-foreground text-[1.05rem] sm:text-base sm:text-balance md:max-w-[80%]">
              Latest updates and announcements.
            </p>
          </div>
          <div className="w-full flex-1 pb-16 sm:pb-0">
            {latestPages.map(async (page) => {
              const MDX = page.data.body
              const data = page.data as {
                title: string
                description?: string
              }

              return (
                <article
                  key={page.url}
                  className="border-b pb-12 last:border-b-0"
                >
                  <div className="mb-4 flex items-center gap-3">
                    {page.date && (
                      <time
                        dateTime={page.date.toISOString()}
                        className="text-muted-foreground text-sm"
                      >
                        {page.date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight">
                    <Link href={page.url} className="hover:underline">
                      {data.title}
                    </Link>
                  </h2>
                  {data.description && (
                    <p className="text-muted-foreground mt-2">
                      {data.description}
                    </p>
                  )}
                  <div className="prose-changelog mt-6 *:first:mt-0">
                    <MDX components={mdxComponents} />
                  </div>
                </article>
              )
            })}
            {olderPages.length > 0 && (
              <div id="more-updates" className="mt-12 pt-8 scroll-mt-24">
                <h2 className="font-heading mb-6 text-xl font-semibold tracking-tight">
                  More Updates
                </h2>
                <ul className="space-y-3">
                  {olderPages.map((page) => {
                    const data = page.data as {
                      title: string
                    }
                    return (
                      <li key={page.url} className="flex items-center gap-3">
                        {page.date && (
                          <time
                            dateTime={page.date.toISOString()}
                            className="text-muted-foreground w-28 shrink-0 text-sm"
                          >
                            {page.date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}
                        <Link
                          href={page.url}
                          className="font-medium hover:underline"
                        >
                          {data.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-72 flex-col gap-4 overflow-hidden overscroll-none pb-8 lg:flex">
        <div className="h-(--top-spacing) shrink-0"></div>
        <div className="no-scrollbar flex flex-col gap-8 overflow-y-auto px-8">
          <div className="flex flex-col gap-2 p-4 pt-0 text-sm">
            <p className="text-muted-foreground bg-background sticky top-0 h-6 text-xs font-medium">
              On This Page
            </p>
            {latestPages.map((page) => {
              const data = page.data as { title: string }
              return (
                <Link
                  key={page.url}
                  href={page.url}
                  className="text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors"
                >
                  {data.title}
                </Link>
              )
            })}
            {olderPages.length > 0 && (
              <a
                href="#more-updates"
                className="text-muted-foreground hover:text-foreground text-[0.8rem] no-underline transition-colors"
              >
                More Updates
              </a>
            )}
          </div>
        </div>
        <div className="hidden flex-1 flex-col gap-6 px-6 xl:flex">
          <OpenInV0Cta />
        </div>
      </div>
    </div>
  )
}
