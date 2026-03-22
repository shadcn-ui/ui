"use client"

import * as React from "react"
import { Toggle as TogglePrimitive } from "@ark-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/ark-maia/lib/utils"

const toggleVariants = cva(
  "hover:text-foreground aria-pressed:bg-muted focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive gap-1 rounded-4xl text-sm font-medium transition-colors [&_svg:not([class*='size-'])]:size-4 group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-input hover:bg-muted border bg-transparent",
      },
      size: {
        default: "h-9 min-w-9 rounded-[min(var(--radius-2xl),12px)] px-2.5",
        sm: "h-8 min-w-8 px-3",
        lg: "h-10 min-w-10 px-2.5",
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
      className={cn(className)}
      {...props}
    />
  )
}

const ToggleContext = TogglePrimitive.Context

export { Toggle, toggleVariants, ToggleContext, ToggleIndicator }
export { useToggle, useToggleContext } from "@ark-ui/react/toggle"
