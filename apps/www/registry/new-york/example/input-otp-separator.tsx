import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york/ui/input-otp"

export default function InputOTPDemo() {
  return (
    <InputOTP
      maxLength={6}
      render={({ slots }) => (
        <InputOTPGroup className="gap-2">
          {slots.map((slot, index) => (
            <>
              <InputOTPSlot
                key={index}
                className="rounded-md border"
                {...slot}
              />
              {index !== slots.length - 1 && <InputOTPSeparator />}
            </>
          ))}{" "}
        </InputOTPGroup>
      )}
    />
  )
}
