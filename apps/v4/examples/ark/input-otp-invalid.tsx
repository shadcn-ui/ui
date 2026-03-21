"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  type PinInputValueChangeDetails,
} from "@/examples/ark/ui/input-otp"

export function InputOTPInvalid() {
  const [value, setValue] = React.useState(["0", "0", "0", "0", "0", "0"])

  return (
    <InputOTP
      count={6}
      value={value}
      onValueChange={(details: PinInputValueChangeDetails) =>
        setValue(details.value)
      }
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} aria-invalid />
        <InputOTPSlot index={1} aria-invalid />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} aria-invalid />
        <InputOTPSlot index={3} aria-invalid />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} aria-invalid />
        <InputOTPSlot index={5} aria-invalid />
      </InputOTPGroup>
    </InputOTP>
  )
}
