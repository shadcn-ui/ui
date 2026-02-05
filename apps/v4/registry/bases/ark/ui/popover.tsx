"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@ark-ui/react/popover"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  align?: "start" | "center" | "end"
  sideOffset?: number
}) {
  return (
    <Portal>
      <PopoverPrimitive.Positioner>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          className={cn("cn-popover-content", className)}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </Portal>
  )
}

function PopoverArrow({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn("cn-popover-arrow", className)}
      {...props}
    >
      <PopoverPrimitive.ArrowTip className="cn-popover-arrow-tip" />
    </PopoverPrimitive.Arrow>
  )
}

export { Popover, PopoverAnchor, PopoverArrow, PopoverContent, PopoverTrigger }
