"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { Checkbox as CheckboxPrimitive } from "@ark-ui/react/checkbox"
import { CheckIcon, MinusIcon } from "lucide-react"

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
        "group/checkbox inline-flex items-center gap-2 data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Control
        data-slot="checkbox-control"
        className="inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors group-has-disabled/field:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary"
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="[&>svg]:size-3.5"
        >
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="[&>svg]:size-3.5"
          indeterminate
        >
          <MinusIcon />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
      {children && (
        <CheckboxPrimitive.Label
          data-slot="checkbox-label"
          className="text-sm leading-none font-medium select-none peer-disabled:opacity-50"
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
      "group/checkbox inline-flex items-center gap-2 data-[disabled]:opacity-50",
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
      "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors group-has-disabled/field:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
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
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <CheckIcon />}
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
      "text-sm leading-none font-medium select-none peer-disabled:opacity-50",
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
