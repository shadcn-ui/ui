import { type Metadata } from "next"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { Customizer } from "@/app/(app)/create/components/customizer"
import { PresetHandler } from "@/app/(app)/create/components/preset-handler"
import { Preview } from "@/app/(app)/create/components/preview"
import { WelcomeDialog } from "@/app/(app)/create/components/welcome-dialog"
import { getAllItems } from "@/app/(app)/create/lib/api"

export const metadata: Metadata = {
  title: "New Project",
  description:
    "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of Force UI.",
  openGraph: {
    title: "New Project",
    description:
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of Force UI.",
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
      "Customize everything. Pick your component library, icons, base color, theme, fonts and create your own version of Force UI.",
    images: [siteConfig.ogImage],
    creator: "@lobiklukas",
  },
}

export default async function CreatePage() {
  const itemsByBase = await getAllItems()

  return (
    <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden section-soft [--customizer-width:--spacing(48)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(56)]">
      <div
        data-slot="designer"
        className="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse"
      >
        <Preview />
        <Customizer itemsByBase={itemsByBase} />
        <PresetHandler />
        <WelcomeDialog />
      </div>
    </div>
  )
}
