"use client"

import * as React from "react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Field, FieldLabel } from "@/styles/radix-force-ui/ui-rtl/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/styles/radix-force-ui/ui-rtl/input-otp"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      verificationCode: "Verification code",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      verificationCode: "رمز التحقق",
    },
  },
  he: {
    dir: "rtl",
    values: {
      verificationCode: "קוד אימות",
    },
  },
}

export function InputOTPRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Field className="mx-auto max-w-xs">
      <FieldLabel htmlFor="input-otp-rtl">{t.verificationCode}</FieldLabel>
      <InputOTP
        maxLength={6}
        defaultValue="123456"
        dir={dir}
        id="input-otp-rtl"
      >
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
  )
}
