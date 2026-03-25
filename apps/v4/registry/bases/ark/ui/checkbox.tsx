"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// --- Checkbox (closed composition) ---

function Checkbox({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "inline-flex items-center gap-2 data-[disabled]:opacity-50 group/checkbox",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Control
        data-slot="checkbox-control"
        className="cn-checkbox inline-flex shrink-0 items-center justify-center"
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="cn-checkbox-indicator"
        >
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </CheckboxPrimitive.Indicator>
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="cn-checkbox-indicator"
          indeterminate
        >
          <IconPlaceholder
            lucide="MinusIcon"
            tabler="IconMinus"
            hugeicons="MinusSignIcon"
            phosphor="MinusIcon"
            remixicon="RiSubtractLine"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
      {children && (
        <CheckboxPrimitive.Label
          data-slot="checkbox-label"
          className="text-sm font-medium leading-none select-none peer-disabled:opacity-50"
        >
          {children}
        </CheckboxPrimitive.Label>
      )}
      <CheckboxPrimitive.HiddenInput />
    </CheckboxPrimitive.Root>
  )
}

// --- Sub-components for advanced composition ---

const CheckboxRoot = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      "inline-flex items-center gap-2 data-[disabled]:opacity-50 group/checkbox",
      className
    )}
    {...props}
  />
))
CheckboxRoot.displayName = "CheckboxRoot"

const CheckboxControl = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CheckboxPrimitive.Control>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Control
    ref={ref}
    data-slot="checkbox-control"
    className={cn(
      "cn-checkbox inline-flex shrink-0 items-center justify-center",
      className
    )}
    {...props}
  />
))
CheckboxControl.displayName = "CheckboxControl"

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

const CheckboxLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof CheckboxPrimitive.Label>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Label
    ref={ref}
    data-slot="checkbox-label"
    className={cn(
      "text-sm font-medium leading-none select-none peer-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
CheckboxLabel.displayName = "CheckboxLabel"

const CheckboxHiddenInput = CheckboxPrimitive.HiddenInput

const CheckboxGroup = CheckboxPrimitive.Group

const CheckboxContext = CheckboxPrimitive.Context
const CheckboxRootProvider = CheckboxPrimitive.RootProvider

export {
  Checkbox,
  CheckboxRoot,
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
