import { Metadata } from "next"

import { Announcement } from "@/components/announcement"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york/ui/button"

export const metadata: Metadata = {
  title: "Building Blocks.",
  description:
    "Beautifully designed. Copy and paste into your apps. Open Source.",
}

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative">
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Building Blocks for the Web</PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed. Copy and paste into your apps. Open Source.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <a href="#blocks">Browse Blocks</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a
              href="https://github.com/shadcn-ui/ui/discussions/new?category=blocks-request"
              target="_blank"
            >
              Request a block
            </a>
          </Button>
        </PageActions>
      </PageHeader>
      <section id="blocks" className="scroll-mt-24">
        {children}
      </section>
    </div>
  )
}
