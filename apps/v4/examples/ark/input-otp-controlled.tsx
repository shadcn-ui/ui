"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type PinInputValueChangeDetails,
} from "@/examples/ark/ui/input-otp"

export default function InputOTPControlled() {
  const [value, setValue] = React.useState<string[]>([])

  return (
    <div className="space-y-2">
      <InputOTP
        count={6}
        value={value}
        onValueChange={(details: PinInputValueChangeDetails) =>
          setValue(details.value)
        }
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
        {value.every((v) => v === "") || value.length === 0 ? (
          <>Enter your one-time password.</>
        ) : (
          <>You entered: {value.join("")}</>
        )}
      </div>
    </div>
  )
}
