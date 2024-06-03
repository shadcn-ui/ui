import { Metadata } from "next"
import Link from "next/link"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york/ui/button"

export const metadata: Metadata = {
  title: "Beautiful Charts",
  description:
    "Built using Recharts. Copy and paste into your apps. Open Source.",
}

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative">
      <PageHeader className="max-w-3xl">
        <Announcement />
        <PageHeaderHeading className="text-balance">
          Beautiful Charts
        </PageHeaderHeading>
        <PageHeaderDescription>
          Built using Recharts. Copy and paste into your apps. Open Source.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <a href="#charts">Browse Charts</a>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs/charts">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <section id="charts" className="grid scroll-mt-24 gap-24 lg:gap-48">
        {children}
      </section>
    </div>
  )
}
