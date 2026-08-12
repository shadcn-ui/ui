"use client"

import {
  Popover as PopoverPrimitive,
  PreviewTrigger as PreviewTriggerPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  type PreviewTriggerProps,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

function HoverCardTrigger({ children, ...props }: PreviewTriggerProps) {
  return (
    <PreviewTriggerPrimitive data-slot="hover-card-trigger" {...props}>
      {children}
    </PreviewTriggerPrimitive>
  )
}

function HoverCard({
  className,
  placement = "bottom",
  offset = 4,
  crossOffset = 0,
  ...props
}: Omit<PopoverPrimitiveProps, "className"> & {
  className?: string
}) {
  return (
    <PopoverPrimitive
      data-slot="hover-card-content"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      className={cn(
        "cn-hover-card-content-aria z-50 origin-(--trigger-anchor-point) outline-hidden",
        className
      )}
      {...props}
    />
  )
}

export { HoverCard, HoverCardTrigger }
