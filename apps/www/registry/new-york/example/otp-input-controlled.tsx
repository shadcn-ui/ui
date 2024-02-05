import { OTPInput } from "@/registry/new-york/ui/otp-input";
import * as React from "react";

export default function OtpInputDemo() {

  const [otp, setOtp] = React.useState("123456")
  return (
    <div className="space-y-4">
      <OTPInput value={otp} onChange={setOtp} />
      <p>
        <strong>OTP Value: </strong>{otp}
      </p>
    </div>
  )
}