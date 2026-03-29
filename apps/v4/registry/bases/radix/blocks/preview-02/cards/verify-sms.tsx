"use client"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/bases/radix/ui/input-otp"

export function VerifySms() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>We just sent you an SMS</CardTitle>
        <CardDescription>
          Enter the 6-digit security code we sent to *******0680. The code
          expires in 10 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <Button variant="link" className="h-auto p-0">
            Resend in 42s
          </Button>
        </p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Verify</Button>
        <Button variant="ghost" className="w-full">
          Try another way
        </Button>
      </CardFooter>
    </Card>
  )
}
