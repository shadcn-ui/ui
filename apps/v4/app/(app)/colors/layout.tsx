import { Metadata } from "next"
import Link from "next/link"

import { getColors } from "@/lib/colors"
import { Announcement } from "@/components/announcement"
import { ColorFormatSelector } from "@/components/color-format-selector"
import { ColorsNav } from "@/components/colors-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Color Library"
const description =
  "Tailwind CSS colors in HSL, RGB, HEX, OKLCH, and CSS variables. Click to copy to your project."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function ColorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const colors = getColors()

  return (
    <div>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#colors">Browse Colors</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="border-grid border-b">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between gap-8 py-4">
            <ColorsNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
            <ColorFormatSelector
              color={colors[0].colors[0]}
              className="hidden -translate-x-2 lg:flex"
            />
          </div>
        </div>
      </div>
      <div className="container-wrapper bg-muted/50 dark:bg-background">
        <div className="container py-6">
          <section id="colors" className="scroll-mt-20">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
