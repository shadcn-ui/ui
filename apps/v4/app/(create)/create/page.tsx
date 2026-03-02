import { type Metadata } from "next"
import { SidebarProvider } from "@/examples/base/ui/sidebar"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { BASES, type BaseName } from "@/registry/config"
import { Customizer } from "@/app/(create)/components/customizer"
import { PageHeader } from "@/app/(create)/components/page-header"
import { PresetHandler } from "@/app/(create)/components/preset-handler"
import { Preview } from "@/app/(create)/components/preview"
import { WelcomeDialog } from "@/app/(create)/components/welcome-dialog"
import { getItemsForBase } from "@/app/(create)/lib/api"

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

async function getAllItems() {
  const entries = await Promise.all(
    BASES.map(async (base) => {
      const items = await getItemsForBase(base.name as BaseName)
      const filtered: Pick<
        NonNullable<(typeof items)[number]>,
        "name" | "title" | "type"
      >[] = []
      for (const item of items) {
        if (item !== null && !/\d+$/.test(item.name)) {
          filtered.push({
            name: item.name,
            title: item.title,
            type: item.type,
          })
        }
      }
      return [base.name, filtered] as const
    })
  )
  return Object.fromEntries(entries)
}

export default async function CreatePage() {
  const itemsByBase = await getAllItems()

  return (
    <div
      data-slot="layout"
      className="relative z-10 flex min-h-svh flex-col section-soft"
    >
      <main className="flex flex-1 flex-col pb-16 sm:pb-0">
        <SidebarProvider className="flex h-auto min-h-min flex-1 flex-col items-start overflow-hidden px-0">
          <div
            data-slot="designer"
            className="flex w-full flex-1 flex-col gap-2 p-4 sm:gap-2 md:flex-row lg:gap-4"
          >
            <Customizer itemsByBase={itemsByBase} />
            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border">
              <PageHeader itemsByBase={itemsByBase} />
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
