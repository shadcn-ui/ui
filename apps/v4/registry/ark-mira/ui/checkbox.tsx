"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"

import { cn } from "@/registry/ark-mira/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// --- Root ---

const Checkbox = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn("inline-flex items-center gap-2 data-[disabled]:opacity-50 group/checkbox", className)}
    {...props}
  />
))
Checkbox.displayName = "Checkbox"

// --- Control ---

const CheckboxControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CheckboxPrimitive.Control>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Control
    ref={ref}
    data-slot="checkbox-control"
    className={cn("border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary aria-invalid:aria-checked:border-primary aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 size-4 rounded-[4px] border transition-shadow group-has-disabled/field:opacity-50 focus-visible:ring-2 aria-invalid:ring-2 inline-flex shrink-0 items-center justify-center", className)}
    {...props}
  />
))
CheckboxControl.displayName = "CheckboxControl"

// --- Indicator ---

const CheckboxIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CheckboxPrimitive.Indicator>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Indicator
    ref={ref}
    data-slot="checkbox-indicator"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? (
      <IconPlaceholder
        lucide="CheckIcon"
        tabler="IconCheck"
        hugeicons="Tick02Icon"
        phosphor="CheckIcon"
        remixicon="RiCheckLine"
      />
    )}
  </CheckboxPrimitive.Indicator>
))
CheckboxIndicator.displayName = "CheckboxIndicator"

// --- Label ---

const CheckboxLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof CheckboxPrimitive.Label>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Label
    ref={ref}
    data-slot="checkbox-label"
    className={cn("text-sm font-medium leading-none select-none peer-disabled:opacity-50", className)}
    {...props}
  />
))
CheckboxLabel.displayName = "CheckboxLabel"

// --- HiddenInput ---

const CheckboxHiddenInput = CheckboxPrimitive.HiddenInput

// --- Group ---

const CheckboxGroup = CheckboxPrimitive.Group

// --- Context & RootProvider ---

const CheckboxContext = CheckboxPrimitive.Context
const CheckboxRootProvider = CheckboxPrimitive.RootProvider

export {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxHiddenInput,
  CheckboxGroup,
  CheckboxContext,
  CheckboxRootProvider,
}
export {
  useCheckbox,
  useCheckboxContext,
  type CheckboxCheckedChangeDetails,
} from "@ark-ui/react/checkbox"
