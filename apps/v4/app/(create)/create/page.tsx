import { type Metadata } from "next"
import type { SearchParams } from "nuqs/server"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { BASES } from "@/registry/config"
import { SidebarProvider } from "@/registry/new-york-v4/ui/sidebar"
import { Customizer } from "@/app/(create)/components/customizer"
import { PageHeader } from "@/app/(create)/components/page-header"
import { PresetHandler } from "@/app/(create)/components/preset-handler"
import { Preview } from "@/app/(create)/components/preview"
import { WelcomeDialog } from "@/app/(create)/components/welcome-dialog"
import { loadDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export const revalidate = false
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "New Project",
  description:
    "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
  openGraph: {
    title: "New Project",
    description:
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
    type: "website",
    url: absoluteUrl("/create"),
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
    title: "New Project",
    description:
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.",
    images: [siteConfig.ogImage],
    creator: "@shadcn",
  },
}

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await loadDesignSystemSearchParams(searchParams)
  const base = BASES.find((b) => b.name === params.base) ?? BASES[0]

  return (
    <div
      data-slot="layout"
      className="section-soft relative z-10 flex min-h-svh flex-col"
    >
      <main className="flex flex-1 flex-col pb-16 sm:pb-0">
        <SidebarProvider className="flex h-auto min-h-min flex-1 flex-col items-start overflow-hidden px-0">
          <div
            data-slot="designer"
            className="flex w-full flex-1 flex-col gap-2 p-6 pt-1 pb-4 sm:gap-2 sm:pt-6 md:flex-row md:pb-6 lg:gap-6"
          >
            <Customizer />
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border">
              <PageHeader baseName={base.name} />
              <Preview />
            </div>
          </div>
        </SidebarProvider>
        <PresetHandler />
        <WelcomeDialog />
      </main>
    </div>
  )
}
