"use client"

import * as React from "react"
import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/examples/base/ui/field"
import { Input } from "@/examples/base/ui/input"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/examples/base/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

export function InputOTPFields() {
  const [value, setValue] = useState("")
  const [pinValue, setPinValue] = useState("")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="otp-basic">Verification Code</FieldLabel>
        <InputOTP id="otp-basic" maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <Field>
        <FieldLabel htmlFor="otp-with-desc">Enter OTP</FieldLabel>
        <InputOTP
          id="otp-with-desc"
          maxLength={6}
          value={value}
          onChange={setValue}
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
        <FieldDescription>
          Enter the 6-digit code sent to your email.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="otp-separator">
          Two-Factor Authentication
        </FieldLabel>
        <InputOTP id="otp-separator" maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          Enter the code from your authenticator app.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="otp-pin">PIN Code</FieldLabel>
        <InputOTP
          id="otp-pin"
          maxLength={4}
          pattern={REGEXP_ONLY_DIGITS}
          value={pinValue}
          onChange={setPinValue}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          Enter your 4-digit PIN (numbers only).
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="otp-invalid">Invalid OTP</FieldLabel>
        <InputOTP id="otp-invalid" maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid />
            <InputOTPSlot index={1} aria-invalid />
            <InputOTPSlot index={2} aria-invalid />
            <InputOTPSlot index={3} aria-invalid />
            <InputOTPSlot index={4} aria-invalid />
            <InputOTPSlot index={5} aria-invalid />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          This OTP field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="otp-disabled-field">Disabled OTP</FieldLabel>
        <InputOTP id="otp-disabled-field" maxLength={6} disabled>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>
          This OTP field is currently disabled.
        </FieldDescription>
      </Field>
    </FieldGroup>
  )
}
