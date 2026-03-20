"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { PinInput } from "@ark-ui/react/pin-input"

import { cn } from "@/examples/ark/lib/utils"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  maxLength,
  disabled,
  value,
  onChange,
  children,
  ...props
}: {
  className?: string
  containerClassName?: string
  maxLength: number
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  children?: React.ReactNode
} & Omit<
  React.ComponentProps<typeof PinInput.Root>,
  "count" | "onValueChange" | "value"
>) {
  return (
    <PinInput.Root
      data-slot="input-otp"
      count={maxLength}
      disabled={disabled}
      value={value ? value.split("") : undefined}
      onValueChange={(details) => onChange?.(details.value.join(""))}
      otp
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    >
      <PinInput.Control
        className={cn(
          "flex items-center gap-2 has-disabled:opacity-50",
          containerClassName
        )}
      >
        {children}
      </PinInput.Control>
      <PinInput.HiddenInput />
    </PinInput.Root>
  )
}

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: Omit<React.ComponentProps<typeof PinInput.Input>, "index"> & {
  index: number
  className?: string
}) {
  return (
    <PinInput.Input
      data-slot="input-otp-slot"
      index={index}
      className={cn(
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<typeof ark.div>) {
  return (
    <ark.div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </ark.div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
