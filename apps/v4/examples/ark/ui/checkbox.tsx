"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"

import { cn } from "@/examples/ark/lib/utils"
import { CheckIcon } from "lucide-react"

// --- Root ---

const Checkbox = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "group/checkbox flex size-4 items-center justify-center rounded-[4px] border border-input transition-colors group-has-disabled/field:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
      className
    )}
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
    className={cn(className)}
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
      <CheckIcon
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
    className={cn(className)}
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
