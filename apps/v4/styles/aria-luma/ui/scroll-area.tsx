"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  // Use native scrollbar-width and scrollbar-color to customize the scrollbar.
  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "relative [scrollbar-width:thin] [scrollbar-color:var(--color-border)_transparent] overflow-auto outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ScrollArea }
