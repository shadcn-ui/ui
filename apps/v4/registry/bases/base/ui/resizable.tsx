"use client"

import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/registry/bases/base/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ResizablePrimitive.GroupProps) {
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      className={cn(
        "cn-resizable-panel-group flex h-full w-full data-[panel-group-direction=vertical]:flex-col", // [FORCE-UI] aria-orientation is only valid on separator/slider/tablist roles — this plain div had none (axe-core aria-allowed-attr)
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      aria-label="Resize panels" // [FORCE-UI] default accessible name; consumers can still override via props
      className={cn(
        // [FORCE-UI] ring-3/ring-ring/50 + transition-colors matches button/input/slider/switch focus treatment; dropped dead ring-offset-background (no ring-offset-* ever applied); cursor-col-resize/row-resize + touch-none for interaction affordance
        "cn-resizable-handle relative flex w-px cursor-col-resize touch-none items-center justify-center bg-border transition-colors after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:cursor-row-resize aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 motion-reduce:transition-none [&[aria-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="cn-resizable-handle-icon z-10 flex shrink-0" />
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
