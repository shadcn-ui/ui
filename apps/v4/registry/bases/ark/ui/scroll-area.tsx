"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@ark-ui/react/scroll-area"

import { cn } from "@/registry/bases/ark/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("cn-scroll-area relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "cn-scroll-area-scrollbar flex touch-none p-px transition-colors select-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="cn-scroll-area-thumb relative flex-1 bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

// --- Context & RootProvider re-exports ---

const ScrollAreaContext = ScrollAreaPrimitive.Context
const ScrollAreaRootProvider = ScrollAreaPrimitive.RootProvider

export { ScrollArea, ScrollBar, ScrollAreaContext, ScrollAreaRootProvider }

export { useScrollArea, useScrollAreaContext } from "@ark-ui/react/scroll-area"
