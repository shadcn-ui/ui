"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@ark-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/ark/lib/utils"

const toggleVariants = cva(
  "cn-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-toggle-variant-default",
        outline: "cn-toggle-variant-outline",
      },
      size: {
        default: "cn-toggle-size-default",
        sm: "cn-toggle-size-sm",
        lg: "cn-toggle-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function ToggleIndicator({
  className,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Indicator>) {
  return (
    <TogglePrimitive.Indicator
      data-slot="toggle-indicator"
      className={cn("cn-toggle-indicator", className)}
      {...props}
    />
  )
}

const ToggleContext = TogglePrimitive.Context

export { Toggle, toggleVariants, ToggleContext, ToggleIndicator }
export { useToggle, useToggleContext } from "@ark-ui/react/toggle"
