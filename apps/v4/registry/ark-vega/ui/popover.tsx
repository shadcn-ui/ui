"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import {
  Popover as PopoverPrimitive,
  usePopover,
  usePopoverContext,
  type PopoverOpenChangeDetails,
} from "@ark-ui/react/popover"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/ark-vega/lib/utils"

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

function PopoverPositioner({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Positioner>) {
  return (
    <PopoverPrimitive.Positioner
      data-slot="popover-positioner"
      {...props}
    />
  )
}

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
  <Portal>
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Content
        ref={ref}
        data-slot="popover-content"
        className={cn("bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 flex flex-col gap-4 rounded-md p-4 text-sm shadow-md ring-1 duration-100", className)}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  </Portal>
))
PopoverContent.displayName = "PopoverContent"

function PopoverCloseTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.CloseTrigger>) {
  return (
    <PopoverPrimitive.CloseTrigger
      data-slot="popover-close-trigger"
      className={cn(className)}
      {...props}
    />
  )
}

function PopoverArrow({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
  return (
    <PopoverPrimitive.Arrow
      data-slot="popover-arrow"
      className={cn(className)}
      {...props}
    >
      <PopoverPrimitive.ArrowTip className="" />
    </PopoverPrimitive.Arrow>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="popover-title"
      className={cn("font-medium", className)}
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
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

const PopoverContext = PopoverPrimitive.Context
const PopoverRootProvider = PopoverPrimitive.RootProvider

export {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverContext,
  PopoverDescription,
  PopoverHeader,
  PopoverPositioner,
  PopoverRootProvider,
  PopoverTitle,
  PopoverTrigger,
  usePopover,
  usePopoverContext,
  type PopoverOpenChangeDetails,
}
