import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/default/ui/input-otp"

export default function InputOTPDemo() {
  return (
    <InputOTP
      maxLength={6}
      render={({ slots }) => (
        <>
          <InputOTPGroup>
            {slots.slice(0, 3).map((slot, index) => (
              <InputOTPSlot key={index} {...slot} />
            ))}{" "}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {slots.slice(3).map((slot, index) => (
              <InputOTPSlot key={index + 3} {...slot} />
            ))}
          </InputOTPGroup>
        </>
      )}
    />
  )
}
