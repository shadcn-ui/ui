"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// --- Root ---

const Checkbox = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn("cn-checkbox group/checkbox", className)}
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
    className={cn("cn-checkbox-control", className)}
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
    className={cn("cn-checkbox-indicator", className)}
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
    className={cn("cn-checkbox-label", className)}
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
