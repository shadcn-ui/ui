"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Popover as PopoverPrimitive } from "@ark-ui/react/popover"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
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

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PopoverPrimitive.Content> & {
    align?: "start" | "center" | "end"
    sideOffset?: number
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <Portal>
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        className={cn("cn-popover-content", className)}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </Portal>
))
PopoverContent.displayName = "PopoverContent"

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

function PopoverHeader({ className, ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="popover-header"
      className={cn("cn-popover-header", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="popover-title"
      className={cn("cn-popover-title", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof ark.p>) {
  return (
    <ark.p
      data-slot="popover-description"
      className={cn("cn-popover-description", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
