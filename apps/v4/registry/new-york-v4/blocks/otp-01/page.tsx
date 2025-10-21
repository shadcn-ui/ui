import { OTPForm } from "@/registry/new-york-v4/blocks/otp-01/components/otp-form"

export default function OTPPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <OTPForm />
      </div>
    </div>
  )
}
