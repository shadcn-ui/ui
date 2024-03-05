import { cn } from "@/lib/utils"
import { OTPInput } from "@/registry/default/ui/otp-input"

export default function OtpInputCustomStyleDemo() {
  const roundedLeftByIndex = [0, 3]
  const roundedRightByIndex = [2, 5]
  return (
    <div>
      <OTPInput
        styles={{
          container: "group flex items-center gap-0",
          input: (index) =>
            cn(
              "relative w-14 h-14 text-[2rem]",
              "flex items-center justify-center",
              "rounded-none",
              roundedLeftByIndex.includes(index) &&
                "rounded-l-md rounded-r-none",
              roundedRightByIndex.includes(index) &&
                "rounded-r-md rounded-l-none"
            ),
        }}
        renderSeparator={(index) => {
          if (index === 2) {
            return <span className="mx-2 text-[2rem]">-</span>
          }
        }}
        placeholder=""
      />
    </div>
  )
}
