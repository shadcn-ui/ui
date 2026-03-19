"use client"

import type { ComponentProps } from "react"
import { Splitter } from "@ark-ui/react/splitter"

import { cn } from "@/examples/ark/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: ComponentProps<typeof Splitter.Root>) {
  return (
    <Splitter.Root
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: ComponentProps<typeof Splitter.Panel>) {
  return <Splitter.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ComponentProps<typeof Splitter.ResizeTrigger> & {
  withHandle?: boolean
}) {
  return (
    <Splitter.ResizeTrigger
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:start-1/2 after:w-1 after:-translate-x-1/2 rtl:after:translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:after:start-0 data-[orientation=horizontal]:after:h-1 data-[orientation=horizontal]:after:w-full data-[orientation=horizontal]:after:translate-x-0 rtl:data-[orientation=horizontal]:after:-translate-x-0 data-[orientation=horizontal]:after:-translate-y-1/2 [&[data-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <Splitter.ResizeTriggerIndicator>
          <div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
        </Splitter.ResizeTriggerIndicator>
      )}
    </Splitter.ResizeTrigger>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
