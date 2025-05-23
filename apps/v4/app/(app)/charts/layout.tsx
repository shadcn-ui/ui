import { Metadata } from "next"
import Link from "next/link"

import { Announcement } from "@/components/announcement"
import { ChartsNav } from "@/components/charts-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Beautiful Charts"
const description =
  "Built using Recharts. Copy and paste into your apps. Open Source."

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

export default function ChartsLayout({
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
            <a href="#charts">Browse Charts</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/components/chart">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="border-grid">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between py-4">
            <ChartsNav />
            <ThemeSelector className="hidden md:block" />
          </div>
        </div>
      </div>
      <div className="container-wrapper section-soft">
        <div className="container py-6">
          <section id="charts" className="theme-container scroll-mt-20">
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}
