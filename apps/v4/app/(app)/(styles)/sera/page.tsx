import { type Metadata } from "next"
import Link from "next/link"

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/styles/radix-sera/ui/button"

import { AudienceAnalytics } from "./audience-analytics"
import { LazyPreview } from "./components/lazy-preview"

import "./style.css"

import { ArrowRightIcon } from "lucide-react"

import { ImagePreview } from "./components/image-preview"

const title = "Introducing Sera"
const description =
  "Minimal. Editorial. Typographic. Underline Controls and Uppercase Headings. Shaped by Print Design Principles."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

export default function SeraPage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading className="font-(family-name:--font-playfair-display) text-[2.875rem] tracking-tight!">
          {title}
        </PageHeaderHeading>
        <PageHeaderDescription className="max-w-2xl text-pretty md:text-balance">
          {description}
        </PageHeaderDescription>
        <PageActions className="**:[.container]:justify-start">
          <Button asChild size="sm">
            <Link href="/create?preset=b4xFeBLg4O">
              Open in shadcn/create
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <ImagePreview />
      <div className="container-wrapper hidden flex-1 flex-col section-soft px-0 md:flex md:px-2 md:py-12">
        <div className="container flex flex-1 flex-col gap-10 px-0 3xl:max-w-[2000px] md:px-6">
          <AudienceAnalytics />
          <LazyPreview name="articleDirectory" />
          <LazyPreview name="emptyState" />
          <LazyPreview name="editArticle" />
          <LazyPreview name="mediaLibrary" />
          <LazyPreview name="mediaLibraryTable" />
        </div>
      </div>
      {/* <ThemeSwitcher /> */}
    </>
  )
}
