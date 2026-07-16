"use client"

import * as React from "react"
import {
  DialogTrigger,
  Heading,
  Popover as PopoverPrimitive,
  type DialogTriggerProps,
  type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components"

import {
  cn,
  getPlacement,
  type PlacementAlign,
  type PlacementSide,
} from "@/registry/bases/aria/lib/utils"

function PopoverTrigger({ children, ...props }: DialogTriggerProps) {
  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

function Popover({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: Omit<PopoverPrimitiveProps, "className" | "children" | "placement"> & {
  className?: string
  children?: React.ReactNode
  align?: PlacementAlign
  alignOffset?: number
  side?: PlacementSide
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive
      data-slot="popover-content"
      placement={getPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      render={(props, { placement, isExiting }) => (
        // compatibility with existing themes
        <div
          {...props}
          data-side={placement}
          data-open={!isExiting}
          data-closed={isExiting}
        />
      )}
      className={cn(
        "cn-popover-content cn-popover-content-logical z-50 w-72 origin-(--trigger-anchor-point) outline-hidden",
        className
      )}
      {...props}
    />
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("cn-popover-header", className)}
      {...props}
    />
  )
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      data-slot="popover-title"
      className={cn("cn-popover-title", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("cn-popover-description", className)} {...props} />
}

export {
  Popover,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
