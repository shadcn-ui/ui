import { type Metadata } from "next"
import { cookies, headers } from "next/headers"

import { siteConfig } from "@/lib/config"
import { absoluteUrl } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header"
import { Customizer } from "@/app/(create)/components/customizer"
import { PresetHandler } from "@/app/(create)/components/preset-handler"
import { Preview } from "@/app/(create)/components/preview"
import { WelcomeDialog } from "@/app/(create)/components/welcome-dialog"
import { getAllItems } from "@/app/(create)/lib/api"
import {
  CUSTOMIZER_POSITION_COOKIE_NAME,
  CUSTOMIZER_STATE_COOKIE_NAME,
  parseCustomizerPosition,
} from "@/app/(create)/lib/customizer"

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

export default async function CreatePage() {
  const cookieStore = await cookies()
  const headersList = await headers()
  const itemsByBase = await getAllItems()
  const defaultCollapsed =
    cookieStore.get(CUSTOMIZER_STATE_COOKIE_NAME)?.value === "true"
  const defaultPosition = parseCustomizerPosition(
    cookieStore.get(CUSTOMIZER_POSITION_COOKIE_NAME)?.value
  )
  const defaultIsMobile =
    headersList.get("sec-ch-ua-mobile") === "?1" ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      headersList.get("user-agent") ?? ""
    )

  return (
    <div
      data-slot="layout"
      data-customizer-position={defaultPosition}
      className="group/layout relative z-10 flex h-svh flex-col overflow-hidden section-soft [--customizer-width:--spacing(56)] [--gap:--spacing(4)] md:[--gap:--spacing(6)]"
    >
      <SiteHeader />
      <main
        data-slot="designer"
        data-customizer-position={defaultPosition}
        className="flex min-h-0 flex-1 flex-col gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row data-[customizer-position=left]:md:flex-row-reverse"
      >
        <Preview />
        <Customizer
          itemsByBase={itemsByBase}
          defaultCollapsed={defaultCollapsed}
          defaultIsMobile={defaultIsMobile}
          defaultPosition={defaultPosition}
        />
        <PresetHandler />
        <WelcomeDialog />
      </main>
    </div>
  )
}
