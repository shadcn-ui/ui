"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@ark-ui/react/radio-group"

import { cn } from "@/registry/ark-nova/lib/utils"

// --- Root ---

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    data-slot="radio-group"
    className={cn("grid gap-2", className)}
    {...props}
  />
))
RadioGroup.displayName = "RadioGroup"

// --- Label ---

const RadioGroupLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof RadioGroupPrimitive.Label>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Label
    ref={ref}
    data-slot="radio-group-label"
    className={cn("text-sm font-medium leading-none select-none", className)}
    {...props}
  />
))
RadioGroupLabel.displayName = "RadioGroupLabel"

// --- Item ---

const RadioGroupItem = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    data-slot="radio-group-item"
    className={cn("inline-flex items-center gap-2 data-[disabled]:opacity-50", className)}
    {...props}
  />
))
RadioGroupItem.displayName = "RadioGroupItem"

// --- ItemControl ---

const RadioGroupItemControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadioGroupPrimitive.ItemControl>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.ItemControl
    ref={ref}
    data-slot="radio-group-item-control"
    className={cn("border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 size-4 rounded-full focus-visible:ring-3 aria-invalid:ring-3 inline-flex shrink-0 items-center justify-center", className)}
    {...props}
  />
))
RadioGroupItemControl.displayName = "RadioGroupItemControl"

// --- ItemText ---

const RadioGroupItemText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof RadioGroupPrimitive.ItemText>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.ItemText
    ref={ref}
    data-slot="radio-group-item-text"
    className={cn("text-sm leading-none select-none", className)}
    {...props}
  />
))
RadioGroupItemText.displayName = "RadioGroupItemText"

// --- ItemHiddenInput ---

const RadioGroupItemHiddenInput = RadioGroupPrimitive.ItemHiddenInput

// --- Indicator ---

const RadioGroupIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Indicator
    ref={ref}
    data-slot="radio-group-indicator"
    className={cn(className)}
    {...props}
  />
))
RadioGroupIndicator.displayName = "RadioGroupIndicator"

// --- Context & RootProvider ---

const RadioGroupContext = RadioGroupPrimitive.Context
const RadioGroupRootProvider = RadioGroupPrimitive.RootProvider

export {
  RadioGroup,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  RadioGroupIndicator,
  RadioGroupContext,
  RadioGroupRootProvider,
}
export {
  useRadioGroup,
  useRadioGroupContext,
  type RadioGroupValueChangeDetails,
} from "@ark-ui/react/radio-group"
