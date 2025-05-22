import { Metadata } from "next"
import Link from "next/link"

import { Announcement } from "@/components/announcement"
import { ColorsNav } from "@/components/colors-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Tailwind Colors. Every Format."
const description =
  "Here you'll find all the colors in all formats. Click to copy to your project."

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
      <div className="border-grid hidden">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between gap-8 py-4">
            <ColorsNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
          </div>
        </div>
      </div>
      <div className="container-wrapper">
        <div className="container py-6">
          <section id="colors" className="scroll-mt-20">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
