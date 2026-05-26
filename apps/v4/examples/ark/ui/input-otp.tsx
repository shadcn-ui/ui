"use client"

import * as React from "react"
import { cn } from "@/examples/ark/lib/utils"
import { ark } from "@ark-ui/react/factory"
import { PinInput } from "@ark-ui/react/pin-input"
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
    <PinInput.Control
      data-slot="input-otp-control"
      className="flex items-center has-disabled:opacity-50"
    >
      {children}
    </PinInput.Control>
    <PinInput.HiddenInput />
  </PinInput.Root>
))
InputOTP.displayName = "InputOTP"

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

const InputOTPSlot = React.forwardRef<
  React.ElementRef<typeof PinInput.Input>,
  React.ComponentPropsWithoutRef<typeof PinInput.Input>
>(({ className, ...props }, ref) => (
  <PinInput.Input
    ref={ref}
    data-slot="input-otp-slot"
    className={cn(
      "relative flex size-8 items-center justify-center border-y border-r border-input bg-transparent text-center text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:aria-invalid:border-destructive focus-visible:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:focus-visible:aria-invalid:ring-destructive/40",
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
    className="flex items-center px-1 [&_svg:not([class*='size-'])]:size-4"
    role="separator"
    {...props}
  >
    <MinusIcon />
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
