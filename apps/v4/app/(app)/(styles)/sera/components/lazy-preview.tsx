"use client"

import * as React from "react"
import dynamic from "next/dynamic"

type LazyPreviewName =
  | "articleDirectory"
  | "emptyState"
  | "editArticle"
  | "mediaLibrary"
  | "mediaLibraryTable"

const PREVIEW_MIN_HEIGHTS: Record<LazyPreviewName, number> = {
  articleDirectory: 760,
  emptyState: 560,
  editArticle: 980,
  mediaLibrary: 880,
  mediaLibraryTable: 980,
}

const ArticleDirectoryPreview = dynamic(
  () => import("../article-directory").then((mod) => mod.ArticleDirectory),
  {
    ssr: false,
    loading: () => (
      <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS.articleDirectory} />
    ),
  }
)

const EmptyStatePreview = dynamic(
  () => import("../empty-state").then((mod) => mod.EmptyState),
  {
    ssr: false,
    loading: () => (
      <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS.emptyState} />
    ),
  }
)

const EditArticlePreview = dynamic(
  () => import("../edit-article").then((mod) => mod.EditArticle),
  {
    ssr: false,
    loading: () => (
      <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS.editArticle} />
    ),
  }
)

const MediaLibraryPreview = dynamic(
  () => import("../media-library").then((mod) => mod.MediaLibrary),
  {
    ssr: false,
    loading: () => (
      <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS.mediaLibrary} />
    ),
  }
)

const MediaLibraryTablePreview = dynamic(
  () => import("../media-library-table").then((mod) => mod.MediaLibraryTable),
  {
    ssr: false,
    loading: () => (
      <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS.mediaLibraryTable} />
    ),
  }
)

const PREVIEW_COMPONENTS: Record<LazyPreviewName, React.ComponentType> = {
  articleDirectory: ArticleDirectoryPreview,
  emptyState: EmptyStatePreview,
  editArticle: EditArticlePreview,
  mediaLibrary: MediaLibraryPreview,
  mediaLibraryTable: MediaLibraryTablePreview,
}

export function LazyPreview({ name }: { name: LazyPreviewName }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = React.useState(false)
  const PreviewComponent = PREVIEW_COMPONENTS[name]

  React.useEffect(() => {
    if (shouldRender) {
      return
    }

    const container = containerRef.current

    if (!container || !("IntersectionObserver" in window)) {
      setShouldRender(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return
        }

        setShouldRender(true)
        observer.disconnect()
      },
      {
        rootMargin: "800px 0px",
      }
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [shouldRender])

  return (
    <div ref={containerRef}>
      {shouldRender ? (
        <PreviewComponent />
      ) : (
        <PreviewPlaceholder minHeight={PREVIEW_MIN_HEIGHTS[name]} />
      )}
    </div>
  )
}

function PreviewPlaceholder({ minHeight }: { minHeight: number }) {
  return (
    <div
      aria-hidden="true"
      className="preview theme-taupe @container/preview w-full flex-1 bg-muted p-4 font-sans ring-1 ring-foreground/5 [--gap:--spacing(4)] sm:p-6 md:[--gap:--spacing(6)] xl:[--gap:--spacing(8)]"
      style={{ minHeight }}
    >
      <div className="container flex flex-col gap-(--gap) py-(--gap)">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="h-5 w-44 bg-background/80" />
            <div className="h-3 w-56 max-w-full bg-background/60" />
          </div>
          <div className="hidden h-8 w-28 bg-background/70 sm:block" />
        </div>
        <div className="grid grid-cols-1 gap-(--gap) md:grid-cols-3">
          <div className="min-h-48 bg-background/70 md:col-span-2" />
          <div className="min-h-48 bg-background/70" />
        </div>
      </div>
    </div>
  )
}
