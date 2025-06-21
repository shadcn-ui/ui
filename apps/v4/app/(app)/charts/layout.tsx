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
import { PageNav } from "@/components/page-nav"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Beautiful Charts & Graphs"
const description =
  "A collection of ready-to-use chart components built with Recharts. From basic charts to rich data displays, copy and paste into your apps."

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
    <>
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
      <PageNav id="charts">
        <ChartsNav />
        <ThemeSelector className="mr-4 hidden md:flex" />
      </PageNav>
      <div className="container-wrapper section-soft flex-1">
        <div className="container pb-6">
          <section className="theme-container">{children}</section>
        </div>
      </div>
    </>
  )
}
