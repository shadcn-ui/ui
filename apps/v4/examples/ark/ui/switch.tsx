"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch"

import { cn } from "@/examples/ark/lib/utils"

// --- Root ---

const Switch = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn(
      "shrink-0 rounded-full border border-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80",
      className
    )}
    {...props}
  />
))
Switch.displayName = "Switch"

// --- Control ---

const SwitchControl = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Control>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Control
    ref={ref}
    data-slot="switch-control"
    className={cn(className)}
    {...props}
  />
))
SwitchControl.displayName = "SwitchControl"

// --- Thumb ---

const SwitchThumb = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Thumb
    ref={ref}
    data-slot="switch-thumb"
    className={cn(
      "rounded-full bg-background group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground",
      className
    )}
    {...props}
  />
))
SwitchThumb.displayName = "SwitchThumb"

// --- Label ---

const SwitchLabel = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<typeof SwitchPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Label
    ref={ref}
    data-slot="switch-label"
    className={cn(className)}
    {...props}
  />
))
SwitchLabel.displayName = "SwitchLabel"

// --- HiddenInput ---

const SwitchHiddenInput = SwitchPrimitive.HiddenInput

// --- Context & RootProvider ---

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
