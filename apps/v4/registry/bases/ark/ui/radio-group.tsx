"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@ark-ui/react/radio-group"

import { cn } from "@/registry/bases/ark/lib/utils"

// --- Root ---

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    data-slot="radio-group"
    className={cn("cn-radio-group", className)}
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
    className={cn("cn-radio-group-item relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", className)}
    {...props}
  >
    <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground opacity-0 transition-opacity [[data-state=checked]_&]:opacity-100" />
  </RadioGroupPrimitive.ItemControl>
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
    className={cn("cn-radio-group-item-indicator", className)}
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
