<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example, ExampleWrapper } from "@/components/example"
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/ui/input-otp"

const value1 = ref("123456")
const value2 = ref("000000")
</script>

<template>
  <ExampleWrapper>
    <Example title="Simple">
      <Field>
        <FieldLabel html-for="simple">
          Simple
        </FieldLabel>
        <InputOTP id="simple" :maxlength="6">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>

    <Example title="With Separator">
      <Field>
        <FieldLabel html-for="with-separator">
          With Separator
        </FieldLabel>
        <InputOTP
          id="with-separator"
          v-model="value1"
          :maxlength="6"
        >
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="2" />
            <InputOTPSlot :index="3" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>

    <Example title="Disabled">
      <Field>
        <FieldLabel html-for="disabled">
          Disabled
        </FieldLabel>
        <InputOTP id="disabled" :maxlength="6" :disabled="true" value="123456">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="3" />
            <InputOTPSlot :index="4" />
            <InputOTPSlot :index="5" />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>

    <Example title="4 Digits">
      <Field>
        <FieldLabel html-for="four-digits">
          4 Digits
        </FieldLabel>
        <FieldDescription>Common pattern for PIN codes.</FieldDescription>
        <InputOTP id="four-digits" :maxlength="4">
          <InputOTPGroup>
            <InputOTPSlot :index="0" />
            <InputOTPSlot :index="1" />
            <InputOTPSlot :index="2" />
            <InputOTPSlot :index="3" />
          </InputOTPGroup>
        </InputOTP>
      </Field>
    </Example>

    <Example title="Invalid State">
      <Field>
        <FieldLabel html-for="invalid">
          Invalid State
        </FieldLabel>
        <FieldDescription>
          Example showing the invalid error state.
        </FieldDescription>
        <InputOTP id="invalid" v-model="value2" :maxlength="6">
          <InputOTPGroup>
            <InputOTPSlot :index="0" :aria-invalid="true" />
            <InputOTPSlot :index="1" :aria-invalid="true" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="2" :aria-invalid="true" />
            <InputOTPSlot :index="3" :aria-invalid="true" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot :index="4" :aria-invalid="true" />
            <InputOTPSlot :index="5" :aria-invalid="true" />
          </InputOTPGroup>
        </InputOTP>
        <FieldError :errors="[{ message: 'Invalid code. Please try again.' }]" />
      </Field>
    </Example>

    <Example title="Form">
      <Card class="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Verify your login</CardTitle>
          <CardDescription>
            Enter the verification code we sent to your email address:
            <span class="font-medium">m@example.com</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Field>
              <div class="flex items-center justify-between">
                <FieldLabel html-for="otp-verification">
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
              <InputOTP id="otp-verification" :maxlength="6" :required="true">
                <InputOTPGroup>
                  <InputOTPSlot :index="0" />
                  <InputOTPSlot :index="1" />
                  <InputOTPSlot :index="2" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot :index="3" />
                  <InputOTPSlot :index="4" />
                  <InputOTPSlot :index="5" />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                <a href="#">I no longer have access to this email address.</a>
              </FieldDescription>
            </Field>
          </form>
        </CardContent>
        <CardFooter class="flex-col gap-2">
          <Button type="submit" class="w-full">
            Verify
          </Button>
          <div class="text-muted-foreground text-sm">
            Having trouble signing in?
            <a
              href="#"
              class="hover:text-primary underline underline-offset-4 transition-colors"
            >
              Contact support
            </a>
          </div>
        </CardFooter>
      </Card>
    </Example>
  </ExampleWrapper>
</template>
