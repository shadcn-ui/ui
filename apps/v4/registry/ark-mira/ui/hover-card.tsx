"use client"

import * as React from "react"
import {
  HoverCard as HoverCardPrimitive,
  useHoverCard,
  useHoverCardContext,
  type HoverCardOpenChangeDetails,
} from "@ark-ui/react/hover-card"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/ark-mira/lib/utils"

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof HoverCardPrimitive.Content>
>(({ className, ...props }, ref) => (
  <Portal>
    <HoverCardPrimitive.Positioner>
      <HoverCardPrimitive.Content
        ref={ref}
        data-slot="hover-card-content"
        className={cn("data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 bg-popover text-popover-foreground w-72 rounded-lg p-2.5 text-xs/relaxed shadow-md ring-1 duration-100", className)}
        {...props}
      />
    </HoverCardPrimitive.Positioner>
  </Portal>
))
HoverCardContent.displayName = "HoverCardContent"

function HoverCardArrow({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Arrow>) {
  return (
    <HoverCardPrimitive.Arrow
      data-slot="hover-card-arrow"
      className={cn(className)}
      {...props}
    >
      <HoverCardPrimitive.ArrowTip className="" />
    </HoverCardPrimitive.Arrow>
  )
}

const HoverCardContext = HoverCardPrimitive.Context
const HoverCardRootProvider = HoverCardPrimitive.RootProvider

export {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardContext,
  HoverCardRootProvider,
  HoverCardTrigger,
  useHoverCard,
  useHoverCardContext,
  type HoverCardOpenChangeDetails,
}
