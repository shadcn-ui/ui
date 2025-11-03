import { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { CommandMenu } from "@/app/(new)/components/command-menu"
import { ConfigForm } from "@/app/(new)/components/config-form"
import { Preview } from "@/app/(new)/components/preview"

import "@/styles/themes.css"

import Link from "next/link"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { getStyle } from "@/registry/styles"
import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
} from "@/app/(new)/lib/search-params"
import { designSystemStyles } from "@/app/(new)/lib/style"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>
}): Promise<Metadata> {
  const { style: styleName } = await params
  const style = getStyle(styleName)

  if (!style) {
    return {}
  }

  const title = `New - ${style.title}`
  const description = `Create components with the ${style.title} style`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(`/new/${style.name}`),
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
  return designSystemStyles.map((style) => ({
    style: style.name,
  }))
}

export default async function NewPage({
  params,
  searchParams,
}: {
  params: Promise<{ style: string }>
  searchParams: Promise<SearchParams>
}) {
  const { style: styleName } = await params
  const style = designSystemStyles.find((s) => s.name === styleName)

  if (!style) {
    return notFound()
  }

  await Promise.all([
    designSystemSearchParamsCache.parse(searchParams),
    canvaSearchParamsCache.parse(searchParams),
  ])

  return (
    <div className="bg-muted/30 flex h-svh flex-1 flex-col">
      <header className="bg-background sticky top-0 z-50 w-full shrink-0">
        <div className="container-wrapper 3xl:fixed:px-0 flex h-12 items-center px-4">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden size-8 lg:flex"
          >
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <CommandMenu style={style.name} />
        </div>
      </header>
      <div className="flex flex-1">
        <div className="z-10 w-64 shrink-0 p-4">
          <ConfigForm />
        </div>
        <div className="flex-1 p-6">
          <Preview style={style.name} />
        </div>
      </div>
    </div>
  )
}
