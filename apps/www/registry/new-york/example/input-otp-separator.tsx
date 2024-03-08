import React from "react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp"

export default function InputOTPWithSeparator() {
  return (
    <InputOTP
      maxLength={6}
      render={({ slots }) => (
        <InputOTPGroup className="gap-2">
          {slots.map((slot, index) => (
            <React.Fragment key={index}>
              <InputOTPSlot className="rounded-md border" {...slot} />
              {index !== slots.length - 1 && <InputOTPSeparator />}
            </React.Fragment>
          ))}{" "}
        </InputOTPGroup>
      )}
    />
  )
}
