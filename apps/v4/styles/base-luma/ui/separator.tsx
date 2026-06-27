"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 box-border data-horizontal:w-full data-horizontal:border-t data-horizontal:border-border data-vertical:h-full data-vertical:w-px data-vertical:bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
