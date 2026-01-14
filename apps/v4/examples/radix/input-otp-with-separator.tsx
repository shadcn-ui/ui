"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/examples/radix/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/examples/radix/ui/input-otp"

export function InputOTPWithSeparator() {
  const [value, setValue] = React.useState("123456")

  return (
    <Field>
      <FieldLabel htmlFor="with-separator">With Separator</FieldLabel>
      <InputOTP
        id="with-separator"
        maxLength={6}
        value={value}
        onChange={setValue}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  )
}
