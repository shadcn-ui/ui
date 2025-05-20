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
        <PageHeaderHeading>Build your component library</PageHeaderHeading>
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
      <div className="border-grid border-b">
        <div className="container-wrapper">
          <div className="container flex items-center justify-between gap-4 py-4">
            <ExamplesNav className="[&>a:first-child]:text-primary flex-1 overflow-hidden" />
            <ThemeSelector className="hidden md:block" />
          </div>
        </div>
      </div>
      <div className="container-wrapper bg-muted/50 dark:bg-background flex-1">
        <div className="container py-6">
          <section className="theme-container scroll-mt-20">
            <div className="bg-background overflow-hidden rounded-lg border bg-clip-padding">
              {children}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
