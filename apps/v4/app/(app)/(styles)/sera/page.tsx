import { type Metadata } from "next"
import Link from "next/link"

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

import { ThemeSwitcher } from "./components/theme-switcher"
import { Preview01 } from "./preview-01"
import { Preview02 } from "./preview-02"
import { Preview03 } from "./preview-03"
import { Preview04 } from "./preview-04"
import { Preview05 } from "./preview-05"

import "./style.css"

const title = "Introducing Sera"
const description =
  "Minimal and editorial. Underline controls, uppercase headings, and wide tracking for a refined typographic hierarchy."

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

export default function SeraPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>{title}</PageHeaderHeading>
        <PageHeaderDescription>{description}</PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/create?preset=b8B4SWmbWi">New Project</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/create?preset=b8B4SWmbWi">Explore Sera</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper flex flex-1 flex-col section-soft px-0 md:px-2 md:py-12">
        <div className="container flex flex-1 flex-col gap-10 px-0 md:px-6">
          <Preview01 />
          <Preview02 />
          <Preview03 />
          <Preview04 />
          <Preview05 />
        </div>
      </div>
      <ThemeSwitcher />
    </>
  )
}
