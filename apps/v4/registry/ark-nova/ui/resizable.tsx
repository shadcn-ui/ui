"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Splitter } from "@ark-ui/react/splitter"

import { cn } from "@/registry/ark-nova/lib/utils"

const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof Splitter.Root>,
  React.ComponentPropsWithoutRef<typeof Splitter.Root>
>(({ className, ...props }, ref) => (
  <Splitter.Root
    ref={ref}
    data-slot="resizable-panel-group"
    className={cn(
      "flex h-full w-full data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof Splitter.Panel>,
  React.ComponentPropsWithoutRef<typeof Splitter.Panel>
>(({ className, ...props }, ref) => (
  <Splitter.Panel
    ref={ref}
    data-slot="resizable-panel"
    className={className}
    {...props}
  />
))
ResizablePanel.displayName = "ResizablePanel"

const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof Splitter.ResizeTrigger>,
  React.ComponentPropsWithoutRef<typeof Splitter.ResizeTrigger> & {
    withHandle?: boolean
  }
>(({ withHandle, className, ...props }, ref) => (
  <Splitter.ResizeTrigger
    ref={ref}
    data-slot="resizable-handle"
    className={cn(
      "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:after:left-0 data-[orientation=horizontal]:after:h-1 data-[orientation=horizontal]:after:w-full data-[orientation=horizontal]:after:translate-x-0 data-[orientation=horizontal]:after:-translate-y-1/2 [&[data-orientation=horizontal]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <Splitter.ResizeTriggerIndicator>
        <ark.div className="bg-border h-6 w-1 rounded-lg z-10 flex shrink-0" />
      </Splitter.ResizeTriggerIndicator>
    )}
  </Splitter.ResizeTrigger>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

export {
  useSplitter,
  useSplitterContext,
} from "@ark-ui/react/splitter"
