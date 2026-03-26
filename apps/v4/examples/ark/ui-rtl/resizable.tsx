"use client"

import * as React from "react"
import { Splitter } from "@ark-ui/react/splitter"

import { cn } from "@/examples/ark/lib/utils"

// --- Root ---

const SplitterRoot = React.forwardRef<
  React.ComponentRef<typeof Splitter.Root>,
  React.ComponentProps<typeof Splitter.Root>
>(({ className, ...props }, ref) => (
  <Splitter.Root
    ref={ref}
    data-slot="splitter"
    className={cn(
      "flex h-full w-full data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
SplitterRoot.displayName = "SplitterRoot"

// --- Panel ---

const SplitterPanel = React.forwardRef<
  React.ComponentRef<typeof Splitter.Panel>,
  React.ComponentProps<typeof Splitter.Panel>
>(({ className, ...props }, ref) => (
  <Splitter.Panel
    ref={ref}
    data-slot="splitter-panel"
    className={cn("overflow-hidden", className)}
    {...props}
  />
))
SplitterPanel.displayName = "SplitterPanel"

// --- ResizeTrigger ---

const SplitterResizeTrigger = React.forwardRef<
  React.ComponentRef<typeof Splitter.ResizeTrigger>,
  React.ComponentProps<typeof Splitter.ResizeTrigger> & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => (
  <Splitter.ResizeTrigger
    ref={ref}
    data-slot="splitter-resize-trigger"
    className={cn(
      "relative grid place-items-center bg-transparent outline-none",
      "before:absolute before:bg-border",
      "data-[orientation=vertical]:-my-1 data-[orientation=vertical]:min-h-2 data-[orientation=vertical]:cursor-row-resize",
      "data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:top-auto data-[orientation=vertical]:before:bottom-1 data-[orientation=vertical]:before:h-px",
      "data-[orientation=horizontal]:-mx-1 data-[orientation=horizontal]:min-w-2 data-[orientation=horizontal]:cursor-col-resize",
      "data-[orientation=horizontal]:before:inset-y-0 data-[orientation=horizontal]:before:end-1 data-[orientation=horizontal]:before:start-auto data-[orientation=horizontal]:before:w-px",
      "focus-visible:ring-1 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div
        className={cn(
          "relative z-10 h-6 w-1 rounded-full border bg-background shadow-xs",
          "[[data-orientation=horizontal]>&]:h-6 [[data-orientation=horizontal]>&]:w-full",
          "[[data-orientation=vertical]>&]:h-full [[data-orientation=vertical]>&]:w-6"
        )}
      />
    )}
  </Splitter.ResizeTrigger>
))
SplitterResizeTrigger.displayName = "SplitterResizeTrigger"

export { SplitterRoot, SplitterPanel, SplitterResizeTrigger }

export { useSplitter, useSplitterContext } from "@ark-ui/react/splitter"
