"use client"

import { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { badgeVariants } from "@/registry/new-york/ui/badge"
import { useParams } from "next/navigation"
import { Mdx } from "@/components/mdx-components"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { DashboardTableOfContents } from "@/components/toc"
import { ChevronRightIcon } from "lucide-react"
import Balancer from "react-wrap-balancer"
import { DocsPager } from "@/components/pager"
import { Doc } from "@/.contentlayer/generated"
import { getTableOfContents } from "@/lib/toc"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Components built on top of Shadcn-UI & Radix UI primitives.",
}

type Data = {
    name: string // "calendar"
    description: string
    dependencies?: string[] // ["react-day-picker", "date-fns"]
    registryDependencies?: string[] // ["button"]
    files: {
      name: `${string}.tsx` // "calendar.tsx"
      dir: `${string}` // "components/ui"
      content: string // "use client"\n\n  ${string}\n
    }[]
    type: "ui" | "addons"
  }

  const data:Data =  {
    name: "name",
    description: "Description",
    type: "addons",
    dependencies: ["asdfghjk"],
    files: [{
        content: "",
        dir: "hi",
        name: "name.tsx"
    }]
  }


export default function MarketplaceCard() {
    const param = useParams()
    const doc:Doc =  {
      _id: "zsxdcfvgbhjnlm",
      _raw: {
        contentType: "markdown",
        flattenedPath:"zsxdcfvgbhjnlm",
        sourceFileDir: "zsxdcfvgbhjnlm",
        sourceFileName: "zsxdcfvgbhjnlm",
        sourceFilePath: "zsxdcfvgbhjnlm"

      },
      component: false,
      featured: false,
      published: false,
      slug: "zsxdcfvgbhjnlm",
      slugAsParams: "zsxdcfvgbhjnlm",
      type: "Doc",

      title: "zsxdcfvgbhjnlm",
      description: "zsxdcfvgbhjnlm",
      radix: {
        link: "zsxdcfvgbhjnlm",
        api:"zsxdcfvgbhjnlm",
        _id: "zsxdcfvgbhjnlm",
        _raw: {
          contentType: "markdown",
          flattenedPath:"zsxdcfvgbhjnlm",
          sourceFileDir: "zsxdcfvgbhjnlm",
          sourceFileName: "zsxdcfvgbhjnlm",
          sourceFilePath: "zsxdcfvgbhjnlm"

        },
        type: "RadixProperties"
      },
      body: {
        code:"asdcfvgbjhnjlmk",
        raw: "zsxdcfvgbhjnlm"
      },
      toc: false

    }

    // const toc = use(getTableOfContents(doc.body.raw))
  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Docs
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight")}>
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{doc.description}</Balancer>
            </p>
          )}
        </div>
        {doc.radix ? (
          <div className="flex items-center space-x-2 pt-4">
            {doc.radix?.link && (
              <Link
                href={doc.radix.link}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }))}
              >
                <Icons.radix className="mr-1 h-3 w-3" />
                Radix UI
              </Link>
            )}
            {doc.radix?.api && (
              <Link
                href={doc.radix.api}
                target="_blank"
                rel="noreferrer"
                className={cn(badgeVariants({ variant: "secondary" }))}
              >
                API Reference
              </Link>
            )}
          </div>
        ) : null}
        <div className="pb-12 pt-8">
          {/* <Mdx code={doc.body.code} /> */}
        </div>
      </div>
      {doc.toc && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={{}} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </main>

  )
}
