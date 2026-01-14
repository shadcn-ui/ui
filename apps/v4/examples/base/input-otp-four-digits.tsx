import { Field, FieldDescription, FieldLabel } from "@/examples/base/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/examples/base/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

export function InputOTPFourDigits() {
  return (
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
  )
}
