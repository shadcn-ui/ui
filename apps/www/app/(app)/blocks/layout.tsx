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
  title: "Blocks",
  description:
    "Beautifully designed blocks that you can copy and paste into your apps.",
}

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative">
      <PageHeader className="max-w-2xl">
        <Announcement />
        <PageHeaderHeading className="hidden md:block">
          Building Blocks.
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">
          Headline Here
        </PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed blocks that you can copy and paste into your
          apps.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild>
            <a href="#blocks">Browse</a>
          </Button>
          <Button asChild variant="outline">
            <a
              href="https://github.com/shadcn-ui/ui/issues/new/choose"
              target="_blank"
            >
              Request a block
            </a>
          </Button>
        </PageActions>
      </PageHeader>
      <section id="blocks" className="grid scroll-mt-24 gap-24 lg:gap-32">
        {children}
      </section>
    </div>
  )
}
