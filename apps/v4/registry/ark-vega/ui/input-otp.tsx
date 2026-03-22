"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { PinInput } from "@ark-ui/react/pin-input"

import { cn } from "@/registry/ark-vega/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof PinInput.Root>,
  React.ComponentPropsWithoutRef<typeof PinInput.Root>
>(({ className, children, ...props }, ref) => (
  <PinInput.Root
    ref={ref}
    data-slot="input-otp"
    className={cn(
      "disabled:cursor-not-allowed",
      className
    )}
    {...props}
  >
    {children}
    <PinInput.HiddenInput />
  </PinInput.Root>
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<typeof PinInput.Control>,
  React.ComponentPropsWithoutRef<typeof PinInput.Control>
>(({ className, ...props }, ref) => (
  <PinInput.Control
    ref={ref}
    data-slot="input-otp-group"
    className={cn(
      "has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive rounded-md has-aria-invalid:ring-3 flex items-center has-disabled:opacity-50",
      className
    )}
    {...props}
  />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<typeof PinInput.Input>,
  React.ComponentPropsWithoutRef<typeof PinInput.Input>
>(({ className, ...props }, ref) => (
  <PinInput.Input
    ref={ref}
    data-slot="input-otp-slot"
    className={cn(
      "dark:bg-input/30 border-input data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive size-9 border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:ring-3 relative flex items-center justify-center data-[active=true]:z-10",
      className
    )}
    {...props}
  />
))
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <ark.div
    ref={ref}
    data-slot="input-otp-separator"
    className="[&_svg:not([class*='size-'])]:size-4 flex items-center"
    role="separator"
    {...props}
  >
    <IconPlaceholder
      lucide="MinusIcon"
      tabler="IconMinus"
      hugeicons="MinusSignIcon"
      phosphor="MinusIcon"
      remixicon="RiSubtractLine"
    />
  </ark.div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

const InputOTPLabel = React.forwardRef<
  React.ElementRef<typeof PinInput.Label>,
  React.ComponentPropsWithoutRef<typeof PinInput.Label>
>(({ className, ...props }, ref) => (
  <PinInput.Label
    ref={ref}
    data-slot="input-otp-label"
    className={cn(className)}
    {...props}
  />
))
InputOTPLabel.displayName = "InputOTPLabel"

const InputOTPContext = PinInput.Context
const InputOTPRootProvider = PinInput.RootProvider

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  InputOTPLabel,
  InputOTPContext,
  InputOTPRootProvider,
}

export {
  usePinInput,
  usePinInputContext,
  type PinInputValueChangeDetails,
} from "@ark-ui/react/pin-input"
