import { OTPInput } from "@/registry/default/ui/otp-input"

export default function OtpInputDemo() {
  return (
    <OTPInput
      onPaste={(e) => {
        e.preventDefault()
        const clipboardData = e.clipboardData
        const pastedData = clipboardData.getData("text")
        alert(`Pasted data: ${pastedData}`)
      }}
    />
  )
}
