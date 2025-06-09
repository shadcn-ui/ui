"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york-v4/ui/input-otp"
import { Label } from "@/registry/new-york-v4/ui/label"

export function InputOTPDemo() {
  return (
    <div className="flex flex-col flex-wrap gap-6 md:flex-row">
      <InputOTPSimple />
      <InputOTPPattern />
      <InputOTPWithSeparator />
      <InputOTPWithSpacing />
    </div>
  )
}

function InputOTPSimple() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="simple">Simple</Label>
      <InputOTP id="simple" maxLength={6}>
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
    </div>
  )
}

function InputOTPPattern() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="digits-only">Digits Only</Label>
      <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}

function InputOTPWithSeparator() {
  const [value, setValue] = React.useState("123456")

  return (
    <div className="grid gap-2">
      <Label htmlFor="with-separator">With Separator</Label>
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
    </div>
  )
}

function InputOTPWithSpacing() {
  return (
    <div className="grid gap-2">
      <Label htmlFor="with-spacing">With Spacing</Label>
      <InputOTP id="with-spacing" maxLength={6}>
        <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
          <InputOTPSlot index={0} aria-invalid="true" />
          <InputOTPSlot index={1} aria-invalid="true" />
          <InputOTPSlot index={2} aria-invalid="true" />
          <InputOTPSlot index={3} aria-invalid="true" />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
