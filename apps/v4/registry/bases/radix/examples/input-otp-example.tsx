"use client"

import * as React from "react"
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import { CanvaFrame } from "@/components/canva"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/radix/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/bases/radix/ui/input-otp"

export default function InputOTPExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <InputOTPSimple />
        <InputOTPPattern />
        <InputOTPAlphanumeric />
        <InputOTPWithSeparator />
        <InputOTPWithSpacing />
        <InputOTPDisabled />
        <InputOTPError />
        <InputOTPFourDigits />
      </div>
    </div>
  )
}

function InputOTPSimple() {
  return (
    <CanvaFrame title="Simple">
      <Field>
        <FieldLabel htmlFor="simple">Simple</FieldLabel>
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
      </Field>
    </CanvaFrame>
  )
}

function InputOTPPattern() {
  return (
    <CanvaFrame title="Digits Only">
      <Field>
        <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
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
      </Field>
    </CanvaFrame>
  )
}

function InputOTPWithSeparator() {
  const [value, setValue] = React.useState("123456")

  return (
    <CanvaFrame title="With Separator">
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
    </CanvaFrame>
  )
}

function InputOTPWithSpacing() {
  return (
    <CanvaFrame title="With Spacing">
      <Field>
        <FieldLabel htmlFor="with-spacing">With Spacing</FieldLabel>
        <InputOTP id="with-spacing" maxLength={6}>
          <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </CanvaFrame>
  )
}

function InputOTPAlphanumeric() {
  return (
    <CanvaFrame title="Alphanumeric">
      <Field>
        <FieldLabel htmlFor="alphanumeric">Alphanumeric</FieldLabel>
        <FieldDescription>Accepts both letters and numbers.</FieldDescription>
        <InputOTP
          id="alphanumeric"
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
        >
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
      </Field>
    </CanvaFrame>
  )
}

function InputOTPDisabled() {
  return (
    <CanvaFrame title="Disabled">
      <Field>
        <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
        <InputOTP id="disabled" maxLength={6} disabled value="123456">
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
      </Field>
    </CanvaFrame>
  )
}

function InputOTPError() {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (value.length === 6) {
      setError(value !== "123456")
    } else {
      setError(false)
    }
  }, [value])

  return (
    <CanvaFrame title="With Validation">
      <Field>
        <FieldLabel htmlFor="error">With Validation</FieldLabel>
        <InputOTP id="error" maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              aria-invalid={error && value.length === 6}
            />
            <InputOTPSlot
              index={1}
              aria-invalid={error && value.length === 6}
            />
            <InputOTPSlot
              index={2}
              aria-invalid={error && value.length === 6}
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={3}
              aria-invalid={error && value.length === 6}
            />
            <InputOTPSlot
              index={4}
              aria-invalid={error && value.length === 6}
            />
            <InputOTPSlot
              index={5}
              aria-invalid={error && value.length === 6}
            />
          </InputOTPGroup>
        </InputOTP>
        {error ? (
          <FieldError
            errors={[{ message: "Invalid code. Please try again." }]}
          />
        ) : (
          <FieldDescription>
            Enter 123456 to see success state.
          </FieldDescription>
        )}
      </Field>
    </CanvaFrame>
  )
}

function InputOTPFourDigits() {
  return (
    <CanvaFrame title="4 Digits">
      <Field>
        <FieldLabel htmlFor="four-digits">4 Digits</FieldLabel>
        <FieldDescription>Common pattern for PIN codes.</FieldDescription>
        <InputOTP id="four-digits" maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </CanvaFrame>
  )
}
