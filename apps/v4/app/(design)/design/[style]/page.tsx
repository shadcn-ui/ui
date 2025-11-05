import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import { getStyle } from "@/registry/styles"
import { CommandMenu } from "@/app/(design)/components/command-menu"
import { ConfigForm } from "@/app/(design)/components/config-form"
import { Preview } from "@/app/(design)/components/preview"
import {
  canvaSearchParamsCache,
  designSystemSearchParamsCache,
} from "@/app/(design)/lib/search-params"
import { designSystemStyles } from "@/app/(design)/lib/style"

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

  const title = style.title
  const description = "Design your custom components."

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
    <div className="bg-muted/50 flex h-svh flex-1 flex-col">
      <header className="sticky top-0 z-50 w-full shrink-0">
        <div className="flex h-12 items-center gap-2 px-4">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{siteConfig.name}</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4!" />
          <CommandMenu style={style.name} />
          <div className="ml-auto flex items-center gap-2">
            <ConfigForm />
            <Separator orientation="vertical" className="h-4!" />
            <ModeSwitcher />
          </div>
        </div>
      </header>
      <div className="flex flex-1 p-4 pt-0">
        <div className="bg-background flex flex-1 rounded-lg border">
          <Preview style={style.name} />
        </div>
      </div>
    </div>
  )
}
