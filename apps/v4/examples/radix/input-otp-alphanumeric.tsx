import { Field, FieldDescription, FieldLabel } from "@/examples/radix/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/examples/radix/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

export function InputOTPAlphanumeric() {
  return (
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
  )
}
