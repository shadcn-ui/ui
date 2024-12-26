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
  title: "Tailwind Colors",
  description: "All colors in all formats.",
}

export default function ColorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Tailwind Colors</PageHeaderHeading>
        <PageHeaderDescription>
          Tailwind CSS colors in HSL, RGB, and HEX formats.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#colors">Browse Colors</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/theming">Documentation</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper">
        <div className="container py-6">
          <section id="colors" className="scroll-mt-20">
            {children}
          </section>
        </div>
      </div>
    </>
  )
}
