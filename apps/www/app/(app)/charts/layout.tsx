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
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Beautiful Charts</PageHeaderHeading>
        <PageHeaderDescription>
          Built using Recharts. Copy and paste into your apps. Open Source.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#charts">Browse Charts</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/components/chart">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <section id="charts" className="scroll-mt-20">
        {children}
      </section>
    </div>
  )
}
