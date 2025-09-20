import { Metadata } from "next"
import Link from "next/link"

import { Announcement } from "@/components/announcement"
import { ExamplesNav } from "@/components/examples-nav"
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PageNav } from "@/components/page-nav"
import { ThemeSelector } from "@/components/theme-selector"
import { Button } from "@/registry/new-york-v4/ui/button"

export const dynamic = "force-static"
export const revalidate = false

const title = "Examples"
const description = "Check out some examples app built using the components."

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

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader>
        <Announcement />
        <PageHeaderHeading>Build your Component Library</PageHeaderHeading>
        <PageHeaderDescription>
          A set of beautifully-designed, accessible components and a code
          distribution platform. Works with your favorite frameworks. Open
          Source. Open Code.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/blocks">Browse Blocks</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <PageNav id="examples">
        <ExamplesNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
        <ThemeSelector className="mr-4 hidden md:block" />
      </PageNav>
      <div className="container-wrapper section-soft flex flex-1 flex-col pb-6">
        <div className="theme-container container flex flex-1 scroll-mt-20 flex-col">
          <div className="bg-background flex flex-col overflow-hidden rounded-lg border bg-clip-padding md:flex-1 xl:rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
