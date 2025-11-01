"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

interface ScrollAreaProps extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  /**
   * If true, renders the viewport as a child element without extra wrapping.
   * Useful for custom scroll area implementations requiring direct viewport manipulation.
<<<<<<< Updated upstream
=======
   * When true, the Viewport's className will be merged with the first child's className.
>>>>>>> Stashed changes
   */
  raw?: boolean
}

function ScrollArea({
  className,
  children,
  raw = false,
  ...props
}: ScrollAreaProps) {
<<<<<<< Updated upstream
=======
  const viewportClassName = "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
  
>>>>>>> Stashed changes
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
<<<<<<< Updated upstream
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        asChild={raw}
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
=======
      {raw ? (
        <ScrollAreaPrimitive.Viewport
          data-slot="scroll-area-viewport"
          asChild
          className={viewportClassName}
        >
          {React.isValidElement(children)
            ? React.cloneElement(children, {
                className: cn(
                  viewportClassName,
                  (children.props as { className?: string })?.className
                ),
              } as React.HTMLAttributes<HTMLElement>)
            : children}
        </ScrollAreaPrimitive.Viewport>
      ) : (
        <ScrollAreaPrimitive.Viewport
          data-slot="scroll-area-viewport"
          className={viewportClassName}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
      )}
>>>>>>> Stashed changes
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
