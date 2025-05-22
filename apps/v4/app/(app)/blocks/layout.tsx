import { Metadata } from "next"
import Link from "next/link"

import { Announcement } from "@/components/announcement"
import { BlocksNav } from "@/components/blocks-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

const title = "Building Blocks for the Web"
const description =
  "Clean, modern building blocks. Copy and paste into your apps. Works with all React frameworks. Open Source. Free forever."

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

export default function BlocksLayout({
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
            <a href="#blocks">Browse Blocks</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/blocks">Add a block</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div id="blocks" className="scroll-mt-24">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between gap-4 py-4">
            <BlocksNav />
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="hidden translate-x-2 shadow-none lg:flex"
            >
              <Link href="/blocks/sidebar">Browse all blocks</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container-wrapper section-soft flex-1">{children}</div>
    </>
  )
}
