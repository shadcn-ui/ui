import * as React from "react"

import { OTPInput } from "@/registry/default/ui/otp-input"

export default function OtpInputDemo() {
  const [otp, setOtp] = React.useState("123456")
  return (
    <div className="space-y-4">
      <OTPInput value={otp} onChange={setOtp} />
      <p>
        <strong>OTP Value: </strong>
        {otp}
      </p>
    </div>
  )
}
