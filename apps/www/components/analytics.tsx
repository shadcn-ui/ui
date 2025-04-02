"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

import { PageViewTracker } from "./page-view-tracker"

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <PageViewTracker />
    </>
  )
}
