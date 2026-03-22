"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch"

import { cn } from "@/registry/bases/ark/lib/utils"

const Switch = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "inline-flex items-center gap-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
Switch.displayName = "Switch"

const SwitchControl = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Control>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Control
    ref={ref}
    data-slot="switch-control"
    className={cn(
      "inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent p-0.5 transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-2 focus-visible:outline-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20 dark:data-[invalid]:border-destructive/50 dark:data-[invalid]:ring-destructive/40",
      className
    )}
    {...props}
  />
))
SwitchControl.displayName = "SwitchControl"


const SwitchThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    data-slot="switch-thumb"
    className={cn(
      "pointer-events-none block size-5 rounded-full bg-background shadow-xs ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
      className
    )}
    {...props}
  />
))
SwitchThumb.displayName = "SwitchThumb"

const SwitchLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Label
    ref={ref}
    data-slot="switch-label"
    className={cn("text-sm font-medium leading-none select-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50", className)}
    {...props}
  />
))
SwitchLabel.displayName = "SwitchLabel"

const SwitchHiddenInput = SwitchPrimitive.HiddenInput

const SwitchContext = SwitchPrimitive.Context
const SwitchRootProvider = SwitchPrimitive.RootProvider

export {
  Switch,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchContext,
  SwitchRootProvider,
}
export {
  useSwitch,
  useSwitchContext,
  type SwitchCheckedChangeDetails,
} from "@ark-ui/react/switch"
