import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp"

export default function InputOTPDisabled() {
  return (
    <InputOTP
      maxLength={6}
      disabled
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
