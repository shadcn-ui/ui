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
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <Portal>
      <HoverCardPrimitive.Positioner>
        <HoverCardPrimitive.Content
          data-slot="hover-card-content"
          className={cn("cn-hover-card-content", className)}
          {...props}
        />
      </HoverCardPrimitive.Positioner>
    </Portal>
  )
}

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
