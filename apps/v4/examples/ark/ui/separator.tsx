"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { ark } from "@ark-ui/react/factory"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof ark.div> & {
  orientation?: "horizontal" | "vertical"
  decorative?: boolean
}) {
  return (
    <ark.div
      data-slot="separator"
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
