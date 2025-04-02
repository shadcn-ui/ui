"use client"

import { Suspense } from "react"

import { useTrackPageView } from "@/lib/analytics/use-track-page-view"

export function PageViewTracker() {
  return (
    <Suspense>
      <PageViewTrackerInternal />
    </Suspense>
  )
}

function PageViewTrackerInternal(): null {
  useTrackPageView()
  return null
}
