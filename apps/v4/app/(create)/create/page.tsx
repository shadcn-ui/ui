import { type Metadata } from "next"
import { Agentation } from "agentation"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { BASES, type BaseName } from "@/registry/config"
import { Customizer } from "@/app/(create)/components/customizer"
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
      className="group/layout relative z-10 flex h-screen flex-col overflow-hidden section-soft [--customizer-width:--spacing(56)] [--gap:--spacing(6)]"
    >
      <SiteHeader />
      <main
        data-slot="designer"
        className="flex min-h-0 w-full flex-1 flex-row gap-(--gap) p-(--gap) pt-3 group-data-reversed/layout:flex-row-reverse"
      >
        <Customizer itemsByBase={itemsByBase} />
        <Preview />
        <PresetHandler />
        <WelcomeDialog />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </main>
    </div>
  )
}
