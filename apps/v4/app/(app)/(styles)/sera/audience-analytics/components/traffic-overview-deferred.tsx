"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/base-sera/ui/card"

const TrafficOverviewContent = dynamic(
  () => import("./traffic-overview").then((mod) => mod.TrafficOverview),
  {
    ssr: false,
    loading: () => <TrafficOverviewFallback />,
  }
)

export function TrafficOverviewDeferred({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <div className={className}>
      <TrafficOverviewContent {...props} />
    </div>
  )
}

function TrafficOverviewFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Traffic Overview</CardTitle>
        <CardDescription>
          Traffic for the last 30 days has increased by 12.4% compared to the
          previous period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          aria-hidden="true"
          className="flex h-82 w-full flex-col justify-end gap-6 overflow-hidden bg-muted/40 p-5"
        >
          <div className="h-px w-full bg-border" />
          <div className="h-px w-full bg-border" />
          <div className="h-px w-full bg-border" />
          <div className="h-px w-full bg-border" />
          <div className="h-px w-full bg-border" />
        </div>
      </CardContent>
    </Card>
  )
}
