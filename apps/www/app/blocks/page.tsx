import { Metadata } from "next"
import { Index } from "@/__registry__"

import { Announcement } from "@/components/announcement"
import { BlockPreview } from "@/components/block-preview"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Beautifully designed blocks that you can copy and paste into your apps.",
}

export default function BlocksPage() {
  return (
    <div className="container relative">
      <PageHeader className="max-w-2xl">
        <Announcement />
        <PageHeaderHeading className="hidden md:block">
          Need a headline here
        </PageHeaderHeading>
        <PageHeaderHeading className="md:hidden">Examples</PageHeaderHeading>
        <PageHeaderDescription>
          Beautifully designed blocks that you can copy and paste into your
          apps.
        </PageHeaderDescription>
      </PageHeader>
      <section>
        <div className="grid gap-8">
          <BlockPreview name="card-share-this-document" />
          <BlockPreview name="dashboard-products-empty" />
          <BlockPreview name="card-create-account" />
        </div>
      </section>
    </div>
  )
}
