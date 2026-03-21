"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { PinInput } from "@ark-ui/react/pin-input"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof PinInput.Root>,
  React.ComponentPropsWithoutRef<typeof PinInput.Root>
>(({ className, children, ...props }, ref) => (
  <PinInput.Root
    ref={ref}
    data-slot="input-otp"
    className={cn(
      "cn-input-otp-input disabled:cursor-not-allowed",
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
      "cn-input-otp-group flex items-center has-disabled:opacity-50",
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
      "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
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
    className="cn-input-otp-separator flex items-center"
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
    className={cn("cn-input-otp-label", className)}
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
