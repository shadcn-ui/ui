import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/examples/ark/ui/input-otp"

export function InputOTPDemo() {
  return (
    <InputOTP count={6} defaultValue={["1", "2", "3", "4", "5", "6"]}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
