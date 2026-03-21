"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { PinInput } from "@ark-ui/react/pin-input"

import { cn } from "@/examples/ark/lib/utils"
import { MinusIcon } from "lucide-react"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof PinInput.Root>,
  React.ComponentPropsWithoutRef<typeof PinInput.Root>
>(({ className, children, ...props }, ref) => (
  <PinInput.Root
    ref={ref}
    data-slot="input-otp"
    className={cn("disabled:cursor-not-allowed", className)}
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
      "flex items-center rounded-lg has-disabled:opacity-50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
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
      "relative flex size-8 items-center justify-center border-y border-e border-input text-sm transition-all outline-none first:rounded-s-lg first:border-s last:rounded-e-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
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
    className="flex items-center [&_svg:not([class*='size-'])]:size-4"
    role="separator"
    {...props}
  >
    <MinusIcon
    />
  </ark.div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }

export {
  usePinInput,
  usePinInputContext,
  type PinInputValueChangeDetails,
} from "@ark-ui/react/pin-input"
