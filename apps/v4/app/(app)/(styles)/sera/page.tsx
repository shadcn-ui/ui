import { type Metadata } from "next"
import Link from "next/link"

import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/registry/new-york-v4/ui/button"

import { ArticleDirectory } from "./article-directory"
import { AudienceAnalytics } from "./audience-analytics"
import { ThemeSwitcher } from "./components/theme-switcher"
import { EditArticle } from "./edit-article"
import { EmptyState } from "./empty-state"
import { MediaLibrary } from "./media-library"
import { MediaLibraryTable } from "./media-library-table"

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
        <PageActions className="**:[.container]:justify-start">
          <Button asChild size="sm">
            <Link href="/create?preset=b4xFeBLg4O">New Project</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/create?preset=b4xFeBLg4O">Explore Sera</Link>
          </Button>
        </PageActions>
      </PageHeader>
      <div className="container-wrapper flex flex-1 flex-col section-soft px-0 md:px-2 md:py-12">
        <div className="container flex flex-1 flex-col gap-10 px-0 3xl:max-w-[2000px] md:px-6">
          <AudienceAnalytics />
          <ArticleDirectory />
          <EmptyState />
          <EditArticle />
          <MediaLibrary />
          <MediaLibraryTable />
        </div>
      </div>
      <ThemeSwitcher />
    </>
  )
}
