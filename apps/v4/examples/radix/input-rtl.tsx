"use client"

import * as React from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/examples/radix/ui-rtl/field"
import { Input } from "@/examples/radix/ui-rtl/input"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      apiKey: "API Key",
      placeholder: "sk-...",
      description: "Your API key is encrypted and stored securely.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      apiKey: "مفتاح API",
      placeholder: "sk-...",
      description: "مفتاح API الخاص بك مشفر ومخزن بأمان.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      apiKey: "מפתח API",
      placeholder: "sk-...",
      description: "מפתח ה-API שלך מוצפן ונשמר בצורה מאובטחת.",
    },
  },
}

export function InputRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Field dir={dir}>
      <FieldLabel htmlFor="input-rtl-api-key">{t.apiKey}</FieldLabel>
      <Input
        id="input-rtl-api-key"
        type="password"
        placeholder={t.placeholder}
        dir={dir}
      />
      <FieldDescription>{t.description}</FieldDescription>
    </Field>
  )
}
