"use client"

import * as React from "react"
import {
  Tooltip as TooltipPrimitive,
  useTooltip,
  useTooltipContext,
  type TooltipOpenChangeDetails,
} from "@ark-ui/react/tooltip"

import { cn } from "@/examples/ark/lib/utils"

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({
  side,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      {...(side ? { positioning: { placement: side, ...props.positioning } } : {})}
      {...props}
    />
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipPositioner({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Positioner>) {
  return (
    <TooltipPrimitive.Positioner data-slot="tooltip-positioner" {...props} />
  )
}

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TooltipPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Positioner>
    <TooltipPrimitive.Content
      ref={ref}
      data-slot="tooltip-content"
      className={cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Positioner>
))
TooltipContent.displayName = "TooltipContent"

function TooltipArrow({
  className,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
  return (
    <TooltipPrimitive.Arrow
      data-slot="tooltip-arrow"
      className={cn(
        "size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]",
        className
      )}
      {...props}
    >
      <TooltipPrimitive.ArrowTip className="" />
    </TooltipPrimitive.Arrow>
  )
}

const TooltipContext = TooltipPrimitive.Context
const TooltipRootProvider = TooltipPrimitive.RootProvider

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipContext,
  TooltipPositioner,
  TooltipProvider,
  TooltipRootProvider,
  TooltipTrigger,
  useTooltip,
  useTooltipContext,
  type TooltipOpenChangeDetails,
}
