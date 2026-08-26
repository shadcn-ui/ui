"use client"

import * as React from "react"
import { Portal } from "@ark-ui/react/portal"
import {
  Tooltip as TooltipPrimitive,
  useTooltip,
  useTooltipContext,
  type TooltipOpenChangeDetails,
} from "@ark-ui/react/tooltip"

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
  <Portal>
    <TooltipPrimitive.Positioner>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        className={cn(
          "cn-tooltip-content z-50 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background",
          className
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Positioner>
  </Portal>
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
        "cn-tooltip-arrow [--arrow-background:var(--color-foreground)] [--arrow-size:0.625rem]",
        className
      )}
      {...props}
    >
      <TooltipPrimitive.ArrowTip className="cn-tooltip-arrow-tip" />
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
