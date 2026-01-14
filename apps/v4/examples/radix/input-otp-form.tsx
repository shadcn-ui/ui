import { Button } from "@/examples/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/examples/radix/ui/card"
import { Field, FieldDescription, FieldLabel } from "@/examples/radix/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/examples/radix/ui/input-otp"
import { RefreshCwIcon } from "lucide-react"

export function InputOTPForm() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span className="font-medium">m@example.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="otp-verification">
                Verification code
              </FieldLabel>
              <Button variant="outline" size="xs">
                <RefreshCwIcon />
                Resend Code
              </Button>
            </div>
            <InputOTP maxLength={6} id="otp-verification" required>
              <InputOTPGroup className="style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-vega:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-mira:*:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-vega:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-mira:*:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              <a href="#">I no longer have access to this email address.</a>
            </FieldDescription>
          </Field>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Verify
        </Button>
        <div className="text-muted-foreground text-sm">
          Having trouble signing in?{" "}
          <a
            href="#"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Contact support
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
