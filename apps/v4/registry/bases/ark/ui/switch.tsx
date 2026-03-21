"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "@ark-ui/react/switch"

import { cn } from "@/registry/bases/ark/lib/utils"

// --- Root ---

const Switch = React.forwardRef<
  HTMLLabelElement,
  React.ComponentProps<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    data-slot="switch"
    className={cn("cn-switch", className)}
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
    className={cn("cn-switch-control", className)}
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
    className={cn("cn-switch-thumb", className)}
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
    className={cn("cn-switch-label", className)}
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
