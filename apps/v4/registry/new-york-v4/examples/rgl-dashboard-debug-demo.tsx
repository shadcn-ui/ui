"use client"

import * as React from "react"
import type { Layout } from "react-grid-layout"

import { DashboardGrid } from "@/registry/new-york-v4/ui/rgl-dashboard-grid"
import { TileByWidget } from "@/registry/new-york-v4/ui/rgl-dashboard-tile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/new-york-v4/ui/card"
import { Separator } from "@/registry/new-york-v4/ui/separator"
import type { WidgetType } from "@/registry/new-york-v4/lib/rgl-dashboard-types"

const INITIAL_LAYOUT: Layout[] = [
  { i: "tile-kpi", x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
  { i: "tile-chart", x: 4, y: 0, w: 8, h: 5, minW: 4, minH: 3 },
]

const WIDGETS: Record<string, { type: WidgetType }> = {
  "tile-kpi": { type: "kpi" },
  "tile-chart": { type: "chart" },
}

export default function RglDashboardDebugDemo() {
  const [layout, setLayout] = React.useState<Layout[]>(INITIAL_LAYOUT)

  const state = {
    dashboard: {
      id: "demo",
      name: "Main",
      layout,
      widgets: WIDGETS,
    },
  }

  return (
    <div className="w-full space-y-4 p-4">
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        isDraggable
        isResizable
        className="min-h-[280px]"
      >
        {layout.map((item) => (
          <div key={item.i} className="relative h-full overflow-hidden rounded-lg border border-border">
            <TileByWidget id={item.i} type={WIDGETS[item.i]?.type ?? "kpi"} />
          </div>
        ))}
      </DashboardGrid>

      <Separator />

      <Card className="border-dashed bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Live layout state</CardTitle>
          <CardDescription className="text-xs">
            Drag or resize tiles above — <code className="rounded bg-muted px-1 font-mono">layout[].x/y/w/h</code> updates in real time. This is the same shape passed to <code className="rounded bg-muted px-1 font-mono">onLayoutChange</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[220px] overflow-auto rounded-lg border border-border bg-background p-3 text-xs leading-relaxed">
            {JSON.stringify(state, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
