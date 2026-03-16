"use client"

import * as React from "react"
import { PinInput } from "@ark-ui/react/pin-input"

import { cn } from "@/registry/bases/ark/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

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
      className={cn(
        "cn-input-otp-input disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      <PinInput.Control
        className={cn(
          "cn-input-otp flex items-center has-disabled:opacity-50",
          containerClassName
        )}
      >
        {children}
      </PinInput.Control>
      <PinInput.HiddenInput />
    </PinInput.Root>
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("cn-input-otp-group flex items-center", className)}
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
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        className
      )}
      {...props}
    />
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
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
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
