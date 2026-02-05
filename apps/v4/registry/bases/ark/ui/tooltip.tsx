"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "@ark-ui/react/tooltip"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  sideOffset?: number
}) {
  return (
    <Portal>
      <TooltipPrimitive.Positioner>
        <TooltipPrimitive.Content
          data-slot="tooltip-content"
          className={cn("cn-tooltip-content", className)}
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </Portal>
  )
}

function TooltipArrow({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn("cn-tooltip-arrow", className)}
      {...props}
    >
      <TooltipPrimitive.ArrowTip className="cn-tooltip-arrow-tip" />
    </TooltipPrimitive.Arrow>
  )
}

export { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger }
