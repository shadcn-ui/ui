"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"

import { cn } from "@/registry/bases/radix/lib/utils"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// [FORCE-UI] input-otp's OTPInputContext has no disabled field (it lives only on
// the native <input>), so InputOTPSlot has no way to know it's disabled — forward
// it ourselves for the .cn-input-otp-slot disabled fill.
const InputOTPDisabledContext = React.createContext(false)

function InputOTP({
  className,
  containerClassName,
  disabled,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <InputOTPDisabledContext.Provider value={!!disabled}>
      <OTPInput
        data-slot="input-otp"
        disabled={disabled}
        containerClassName={cn(
          "cn-input-otp flex items-center has-disabled:opacity-50",
          containerClassName
        )}
        spellCheck={false}
        className={cn(
          "cn-input-otp-input disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </InputOTPDisabledContext.Provider>
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
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}
  const disabled = React.useContext(InputOTPDisabledContext)

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-disabled={disabled}
      className={cn(
        "cn-input-otp-slot relative flex items-center justify-center data-[active=true]:z-10",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="cn-input-otp-caret-line" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="cn-input-otp-separator flex items-center"
      role="separator"
      aria-orientation="vertical" // [FORCE-UI] non-focusable separator defaults to horizontal per WAI-ARIA; this one divides groups left/right
      {...props}
    >
      <IconPlaceholder
        lucide="MinusIcon"
        materialSymbols="remove"
        tabler="IconMinus"
        hugeicons="MinusSignIcon"
        phosphor="MinusIcon"
        remixicon="RiSubtractLine"
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
