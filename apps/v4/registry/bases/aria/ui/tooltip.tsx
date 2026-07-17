"use client"

import * as React from "react"
import {
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components"

import { cn } from "@/registry/bases/aria/lib/utils"

function TooltipTrigger({
  delay = 0,
  ...props
}: React.ComponentProps<typeof TooltipTriggerPrimitive>) {
  return (
    <TooltipTriggerPrimitive
      data-slot="tooltip-trigger"
      delay={delay}
      {...props}
    />
  )
}

function Tooltip({
  className,
  placement = "top",
  offset = 4,
  crossOffset = 0,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipPrimitive>,
  "children" | "className"
> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <TooltipPrimitive
      data-slot="tooltip-content"
      placement={placement}
      offset={offset}
      crossOffset={crossOffset}
      render={(props, { placement, isExiting }) => (
        <div
          {...props}
          data-side={placement}
          data-open={!isExiting}
          data-closed={isExiting}
        />
      )}
      className={cn(
        "cn-tooltip-content cn-tooltip-content-logical z-50 w-fit max-w-xs origin-(--trigger-anchor-point) bg-foreground text-background",
        className
      )}
      {...props}
    >
      {children}
      <OverlayArrow
        className="cn-tooltip-arrow cn-tooltip-arrow-logical z-50 bg-foreground fill-foreground"
        style={({ placement, defaultStyle }) => ({
          ...defaultStyle,
          rotate: "0deg",
          translate: "0 0",
          transform:
            placement === "bottom"
              ? "translate(-50%, calc(50% + 2px)) rotate(45deg)"
              : placement === "top"
                ? "translate(-50%, calc(-50% - 2px)) rotate(45deg)"
                : placement === "left"
                  ? "translate(calc(-50% - 2px), -50%) rotate(45deg)"
                  : "translate(calc(50% + 2px), -50%) rotate(45deg)",
        })}
        render={(props, { placement }) => (
          <div {...props} data-side={placement} />
        )}
      />
    </TooltipPrimitive>
  )
}

export { Tooltip, TooltipTrigger }
