"use client"

import * as React from "react"
import type { Layout } from "react-grid-layout"

import { DashboardGrid } from "@/styles/base-nova/ui/rgl-dashboard-grid"
import { TileByWidget } from "@/styles/base-nova/ui/rgl-dashboard-tile"

const initial: Layout[] = [
  { i: "kpi", x: 0, y: 0, w: 12, h: 3 },
  { i: "bar", x: 0, y: 3, w: 12, h: 4 },
]

export default function RglDashboardStaticDemo() {
  const [layout, setLayout] = React.useState(initial)

  return (
    <div className="w-full min-w-0">
      <DashboardGrid
        layout={layout}
        onLayoutChange={setLayout}
        isDraggable={false}
        isResizable={false}
        className="min-h-[340px]"
      >
        {layout.map((item) => (
          <div key={item.i} className="relative h-full overflow-hidden rounded-lg border border-border">
            <TileByWidget id={item.i} type={item.i === "kpi" ? "kpi" : "bar"} />
          </div>
        ))}
      </DashboardGrid>
    </div>
  )
}
