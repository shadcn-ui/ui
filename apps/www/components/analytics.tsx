"use client"

import { Analytics as VercelAnalytics } from "@vercel/analytics/react"

import { VercelInternalAnalytics } from "./analytics-internal"

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <VercelInternalAnalytics />
    </>
  )
}
