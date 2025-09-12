import { cn } from "@/registry/new-york-v4/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/registry/new-york-v4/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/new-york-v4/ui/input-otp"
import { Label } from "@/registry/new-york-v4/ui/label"

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Enter verification code</h1>
            <p className="text-muted-foreground text-sm text-balance">
              We sent a 6-digit code to your email.
            </p>
          </div>
          <Field>
            <Label htmlFor="otp" className="sr-only">
              Verification code
            </Label>
            <InputOTP maxLength={6} id="otp" required>
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your email.
            </FieldDescription>
          </Field>
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <FieldDescription className="text-center">
            Didn&apos;t receive the code?{" "}
            <a href="#" className="underline underline-offset-4">
              Resend
            </a>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
