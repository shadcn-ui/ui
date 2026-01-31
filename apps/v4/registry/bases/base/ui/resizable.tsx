"use client"

import * as React from "react"
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from "react-resizable-panels";

import { cn } from "@/registry/bases/base/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof GroupProps>) {
  return (
    <Group
      data-slot="resizable-panel-group"
      className={cn(
        "cn-resizable-panel-group flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof PanelProps>) {
  return <Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: SeparatorProps & { withHandle?: boolean }) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
        "aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:bg-transparent aria-[orientation=horizontal]:border-t aria-[orientation=horizontal]:border-border",
        "aria-[orientation=horizontal]:focus-visible:ring-0",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border" />
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
