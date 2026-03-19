"use client"

import * as React from "react"
import { HoverCard as HoverCardPrimitive } from "@ark-ui/react/hover-card"
import { Portal } from "@ark-ui/react/portal"

import { cn } from "@/registry/bases/ark/lib/utils"

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
        className={cn("cn-hover-card-content", className)}
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
      className={cn("cn-hover-card-arrow", className)}
      {...props}
    >
      <HoverCardPrimitive.ArrowTip className="cn-hover-card-arrow-tip" />
    </HoverCardPrimitive.Arrow>
  )
}

export { HoverCard, HoverCardArrow, HoverCardContent, HoverCardTrigger }
