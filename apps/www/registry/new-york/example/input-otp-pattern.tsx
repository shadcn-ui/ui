import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp"

export default function InputOTPPattern() {
  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      render={({ slots }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <InputOTPSlot key={index} {...slot} />
          ))}{" "}
        </InputOTPGroup>
      )}
    />
  )
}
