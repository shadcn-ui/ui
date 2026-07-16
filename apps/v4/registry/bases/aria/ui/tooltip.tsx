"use client"

import * as React from "react"
import {
  OverlayArrow,
  Tooltip as TooltipPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "react-aria-components"

import {
  cn,
  getPlacement,
  type PlacementAlign,
  type PlacementSide,
} from "@/registry/bases/aria/lib/utils"

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipTriggerPrimitive>) {
  return <TooltipTriggerPrimitive {...props} />
}

function Tooltip({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof TooltipPrimitive>,
  "children" | "className" | "placement" | "offset" | "crossOffset"
> & {
  className?: string
  children?: React.ReactNode
  side?: PlacementSide
  sideOffset?: number
  align?: PlacementAlign
  alignOffset?: number
}) {
  return (
    <TooltipPrimitive
      data-slot="tooltip-content"
      placement={getPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
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
