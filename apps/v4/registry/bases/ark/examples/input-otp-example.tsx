"use client"

import * as React from "react"


import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/ark/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/bases/ark/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/registry/bases/ark/ui/input-otp"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function InputOTPExample() {
  return (
    <ExampleWrapper>
      <InputOTPForm />
      <InputOTPSimple />
      <InputOTPPattern />
      <InputOTPWithSeparator />
      <InputOTPAlphanumeric />
      <InputOTPDisabled />
      <InputOTPFourDigits />
      <InputOTPInvalid />
    </ExampleWrapper>
  )
}

function InputOTPSimple() {
  return (
    <Example title="Simple">
      <Field>
        <FieldLabel htmlFor="simple">Simple</FieldLabel>
        <InputOTP id="simple" count={6}>
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
      </Field>
    </Example>
  )
}

function InputOTPPattern() {
  return (
    <Example title="Digits Only">
      <Field>
        <FieldLabel htmlFor="digits-only">Digits Only</FieldLabel>
        <InputOTP id="digits-only" count={6} type="numeric">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPWithSeparator() {
  const [value, setValue] = React.useState(["1","2","3","4","5","6"])

  return (
    <Example title="With Separator">
      <Field>
        <FieldLabel htmlFor="with-separator">With Separator</FieldLabel>
        <InputOTP
          id="with-separator"
          count={6}
          value={value}
          onValueChange={(details) => setValue(details.value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPAlphanumeric() {
  return (
    <Example title="Alphanumeric">
      <Field>
        <FieldLabel htmlFor="alphanumeric">Alphanumeric</FieldLabel>
        <FieldDescription>Accepts both letters and numbers.</FieldDescription>
        <InputOTP
          id="alphanumeric"
          count={6}
          type="alphanumeric"
        >
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
      </Field>
    </Example>
  )
}

function InputOTPDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
        <InputOTP id="disabled" count={6} disabled value={["1","2","3","4","5","6"]}>
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
      </Field>
    </Example>
  )
}

function InputOTPFourDigits() {
  return (
    <Example title="4 Digits">
      <Field>
        <FieldLabel htmlFor="four-digits">4 Digits</FieldLabel>
        <FieldDescription>Common pattern for PIN codes.</FieldDescription>
        <InputOTP id="four-digits" count={4} type="numeric">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>
  )
}

function InputOTPInvalid() {
  const [value, setValue] = React.useState(["0","0","0","0","0","0"])

  return (
    <Example title="Invalid State">
      <Field>
        <FieldLabel htmlFor="invalid">Invalid State</FieldLabel>
        <FieldDescription>
          Example showing the invalid error state.
        </FieldDescription>
        <InputOTP id="invalid" count={6} value={value} onValueChange={(details) => setValue(details.value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid />
            <InputOTPSlot index={1} aria-invalid />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={2} aria-invalid />
            <InputOTPSlot index={3} aria-invalid />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} aria-invalid />
            <InputOTPSlot index={5} aria-invalid />
          </InputOTPGroup>
        </InputOTP>
        <FieldError errors={[{ message: "Invalid code. Please try again." }]} />
      </Field>
    </Example>
  )
}

function InputOTPForm() {
  return (
    <Example title="Form">
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
                  <IconPlaceholder
                    lucide="RefreshCwIcon"
                    hugeicons="RefreshIcon"
                    tabler="IconRefresh"
                    phosphor="ArrowClockwiseIcon"
                    remixicon="RiRefreshLine"
                    data-icon="inline-start"
                  />
                  Resend Code
                </Button>
              </div>
              <InputOTP count={6} id="otp-verification" required>
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:text-xl style-vega:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-mira:*:data-[slot=input-otp-slot]:w-11">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="*:data-[slot=input-otp-slot]:text-xl style-vega:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-mira:*:data-[slot=input-otp-slot]:w-11">
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
          <div className="text-sm text-muted-foreground">
            Having trouble signing in?{" "}
            <a
              href="#"
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Contact support
            </a>
          </div>
        </CardFooter>
      </Card>
    </Example>
  )
}
