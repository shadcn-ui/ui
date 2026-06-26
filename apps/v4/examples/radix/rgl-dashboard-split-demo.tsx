"use client"

import * as React from "react"
import type { Layout } from "react-grid-layout"

import { DashboardGrid } from "@/styles/radix-nova/ui/rgl-dashboard-grid"
import { TileByWidget } from "@/styles/radix-nova/ui/rgl-dashboard-tile"

const initial: Layout[] = [
  { i: "kpi", x: 0, y: 0, w: 6, h: 4 },
  { i: "chart", x: 6, y: 0, w: 6, h: 5 },
]

export default function RglDashboardSplitDemo() {
  const [layout, setLayout] = React.useState(initial)

  return (
    <div className="w-full min-w-0">
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        isDraggable
        isResizable
        className="min-h-[320px]"
      >
        {layout.map((item) => (
          <div
            key={item.i}
            className="relative h-full overflow-hidden rounded-lg border-2 border-dotted border-primary"
          >
            <TileByWidget id={item.i} type={item.i === "kpi" ? "kpi" : "chart"} />
          </div>
        ))}
      </DashboardGrid>
    </div>
  )
}
