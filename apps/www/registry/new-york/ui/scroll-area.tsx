"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = (
  {
    ref,
    className,
    children,
    ...props
  }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    ref: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.Root>>;
  }
) => (<ScrollAreaPrimitive.Root
  ref={ref}
  className={cn("relative overflow-hidden", className)}
  {...props}
>
  <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
    {children}
  </ScrollAreaPrimitive.Viewport>
  <ScrollBar />
  <ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>)
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = (
  {
    ref,
    className,
    orientation = "vertical",
    ...props
  }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    ref: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>;
  }
) => (<ScrollAreaPrimitive.ScrollAreaScrollbar
  ref={ref}
  orientation={orientation}
  className={cn(
    "flex touch-none select-none transition-colors",
    orientation === "vertical" &&
      "h-full w-2.5 border-l border-l-transparent p-[1px]",
    orientation === "horizontal" &&
      "h-2.5 flex-col border-t border-t-transparent p-[1px]",
    className
  )}
  {...props}
>
  <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
</ScrollAreaPrimitive.ScrollAreaScrollbar>)
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
