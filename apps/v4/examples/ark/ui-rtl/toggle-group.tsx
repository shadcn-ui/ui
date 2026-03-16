"use client"

import * as React from "react"
import { ToggleGroup as ToggleGroupPrimitive } from "@ark-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/examples/ark/lib/utils"

const toggleGroupVariants = cva(
  "inline-flex items-center justify-center rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
      size: {
        default: "",
        sm: "",
        lg: "",
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
      className={cn(
        "group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg",
        className
      )}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants }
