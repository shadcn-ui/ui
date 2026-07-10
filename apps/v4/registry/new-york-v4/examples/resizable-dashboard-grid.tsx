"use client"

import * as React from "react"
import { GridLayout, useContainerWidth, type Layout } from "@snapgridjs/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"

type DashboardWidget = {
  title: string
  description: string
  value: string
  content: React.ReactNode
}

const initialLayout: Layout = [
  { i: "revenue", x: 0, y: 0, w: 5, h: 4, minW: 3, minH: 3 },
  { i: "pipeline", x: 5, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "activity", x: 9, y: 0, w: 3, h: 7, minW: 3, minH: 4 },
  { i: "conversion", x: 0, y: 4, w: 4, h: 3, minW: 3, minH: 3 },
  { i: "performance", x: 4, y: 4, w: 5, h: 3, minW: 3, minH: 3 },
]

const widgets: Record<string, DashboardWidget> = {
  revenue: {
    title: "Revenue",
    description: "Monthly recurring revenue",
    value: "$84.3k",
    content: <BarChart />,
  },
  pipeline: {
    title: "Pipeline",
    description: "Qualified opportunities",
    value: "428",
    content: (
      <div className="grid h-full grid-cols-2 gap-3">
        <Metric label="Won" value="124" />
        <Metric label="Open" value="304" />
        <Metric label="ACV" value="$12.8k" />
        <Metric label="Cycle" value="18d" />
      </div>
    ),
  },
  activity: {
    title: "Activity",
    description: "Live system events",
    value: "24h",
    content: <ActivityList />,
  },
  conversion: {
    title: "Conversion",
    description: "Visitor to trial",
    value: "12.8%",
    content: (
      <div className="flex h-full items-end gap-2 rounded-lg border bg-background p-3">
        <div className="h-[42%] flex-1 rounded-sm bg-primary/20" />
        <div className="h-[68%] flex-1 rounded-sm bg-primary/40" />
        <div className="h-[54%] flex-1 rounded-sm bg-primary/60" />
        <div className="h-[82%] flex-1 rounded-sm bg-primary" />
      </div>
    ),
  },
  performance: {
    title: "Performance",
    description: "API and background jobs",
    value: "312ms",
    content: (
      <div className="grid h-full grid-cols-3 gap-3">
        <Metric label="P95" value="312ms" />
        <Metric label="Errors" value="0.03%" />
        <Metric label="Jobs" value="18k" />
      </div>
    ),
  },
}

export default function ResizableDashboardGrid() {
  const { containerRef, mounted, width } = useContainerWidth()
  const [layout, setLayout] = React.useState<Layout>(initialLayout)

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">Dashboard layout</h3>
        <p className="text-sm text-muted-foreground">
          Drag and resize widgets. snapgrid keeps every card aligned to the
          dashboard grid and repacks the layout after each interaction.
        </p>
      </div>
      <div ref={containerRef} className="min-h-[560px] w-full min-w-0">
        {mounted && (
          <GridLayout
            layout={layout}
            width={width}
            onLayoutChange={setLayout}
            gridConfig={{ cols: 12, rowHeight: 64, margin: [12, 12] }}
            dragConfig={{ handle: ".dashboard-grid-handle", snapToGrid: true }}
            resizeConfig={{ handles: ["se", "e", "s"] }}
            className="rounded-xl border bg-muted/30 p-3"
          >
            {layout.map((item) => (
              <DashboardWidget key={item.i} id={item.i} />
            ))}
          </GridLayout>
        )}
      </div>
    </div>
  )
}

function DashboardWidget({ id }: { id: string }) {
  const widget = widgets[id]

  if (!widget) {
    return null
  }

  return (
    <Card className="h-full overflow-hidden shadow-sm">
      <CardHeader className="dashboard-grid-handle cursor-move gap-1.5 select-none">
        <CardDescription>{widget.description}</CardDescription>
        <CardTitle className="flex items-baseline justify-between gap-4">
          <span>{widget.title}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {widget.value}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-5.5rem)]">
        {widget.content}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-20 flex-col justify-between rounded-lg border bg-background p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tracking-tight">{value}</span>
    </div>
  )
}

function BarChart() {
  return (
    <div className="flex h-full items-end gap-2 rounded-lg border bg-background p-4">
      {[
        "h-[38%]",
        "h-[54%]",
        "h-[47%]",
        "h-[72%]",
        "h-[64%]",
        "h-[88%]",
        "h-[80%]",
        "h-[96%]",
        "h-[76%]",
        "h-[92%]",
        "h-[86%]",
        "h-full",
      ].map((height, index) => (
        <div
          key={index}
          className="flex flex-1 items-end rounded-sm bg-primary/10"
        >
          <div className={`w-full rounded-sm bg-primary ${height}`} />
        </div>
      ))}
    </div>
  )
}

function ActivityList() {
  return (
    <div className="flex h-full flex-col justify-between rounded-lg border bg-background p-3 text-sm">
      {[
        ["Build completed", "2m ago"],
        ["New workspace", "8m ago"],
        ["Webhook retried", "14m ago"],
        ["Invoice paid", "22m ago"],
        ["Report exported", "28m ago"],
      ].map(([label, time]) => (
        <div key={label} className="flex items-center justify-between gap-3">
          <span>{label}</span>
          <span className="text-muted-foreground">{time}</span>
        </div>
      ))}
    </div>
  )
}
