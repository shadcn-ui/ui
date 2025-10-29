import { OTPForm } from "@/registry/new-york-v4/blocks/otp-05/components/otp-form"

export default function OTPPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm />
      </div>
    </div>
  )
}
