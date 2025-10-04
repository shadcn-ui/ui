"use client"

import { Root as SeparatorPrimitive } from "@radix-ui/react-separator"
import React from "react"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.displayName

export { Separator }
