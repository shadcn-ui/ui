"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@ark-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/bases/ark/lib/utils"

const toggleGroupVariants = cva(
  "cn-toggle-group inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "cn-toggle-group-variant-default",
        outline: "cn-toggle-group-variant-outline",
      },
      size: {
        default: "cn-toggle-group-size-default",
        sm: "cn-toggle-group-size-sm",
        lg: "cn-toggle-group-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function ToggleGroup({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn("cn-toggle-group-item", className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
