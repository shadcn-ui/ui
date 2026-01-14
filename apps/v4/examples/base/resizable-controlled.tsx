"use client"

import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/base/ui/resizable"

export function ResizableControlled() {
  const [sizes, setSizes] = React.useState([30, 70])

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] rounded-lg border"
      onLayout={(newSizes) => {
        setSizes(newSizes)
      }}
    >
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
          <span className="font-semibold">{Math.round(sizes[0] ?? 30)}%</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} minSize={30}>
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
          <span className="font-semibold">{Math.round(sizes[1] ?? 70)}%</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
