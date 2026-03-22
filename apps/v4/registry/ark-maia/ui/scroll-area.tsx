"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@ark-ui/react/scroll-area"

import { cn } from "@/registry/ark-maia/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
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
        "data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent flex touch-none p-px transition-colors select-none",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="rounded-full relative flex-1 bg-border"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

const ScrollAreaViewport = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    data-slot="scroll-area-viewport"
    className={cn(className)}
    {...props}
  />
))
ScrollAreaViewport.displayName = "ScrollAreaViewport"

const ScrollAreaContent = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Content
    ref={ref}
    data-slot="scroll-area-content"
    className={cn(className)}
    {...props}
  />
))
ScrollAreaContent.displayName = "ScrollAreaContent"

function ScrollAreaCorner({
  className,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Corner>) {
  return (
    <ScrollAreaPrimitive.Corner
      data-slot="scroll-area-corner"
      className={cn(className)}
      {...props}
    />
  )
}

const ScrollAreaThumb = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    data-slot="scroll-area-thumb"
    className={cn("rounded-full", className)}
    {...props}
  />
))
ScrollAreaThumb.displayName = "ScrollAreaThumb"

// --- Context & RootProvider re-exports ---

const ScrollAreaContext = ScrollAreaPrimitive.Context
const ScrollAreaRootProvider = ScrollAreaPrimitive.RootProvider

export {
  ScrollArea,
  ScrollBar,
  ScrollAreaContent,
  ScrollAreaContext,
  ScrollAreaCorner,
  ScrollAreaRootProvider,
  ScrollAreaThumb,
  ScrollAreaViewport,
}

export { useScrollArea, useScrollAreaContext } from "@ark-ui/react/scroll-area"
