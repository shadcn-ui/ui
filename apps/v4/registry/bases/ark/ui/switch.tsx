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
      "cn-switch inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
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
      "cn-switch-thumb pointer-events-none block rounded-full bg-background shadow-xs ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0 dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
      "size-4",
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
    className={cn("cn-switch-label", className)}
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
