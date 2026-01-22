"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/examples/base/ui-rtl/input-otp"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

export function InputOTPRtl() {
  const { dir } = useTranslation(translations, "ar")

  return (
    <InputOTP maxLength={6} defaultValue="123456" dir={dir}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}
