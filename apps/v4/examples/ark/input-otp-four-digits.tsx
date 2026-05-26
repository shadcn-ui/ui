import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/examples/ark/ui/input-otp"

export function InputOTPFourDigits() {
  return (
    <InputOTP count={4} type="numeric">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  )
}
