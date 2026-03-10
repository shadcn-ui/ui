"use client"

import * as React from "react"
import { Field, FieldLabel } from "@/examples/radix/ui-rtl/field"
import { Progress } from "@/examples/radix/ui-rtl/progress"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Upload progress",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "تقدم الرفع",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "התקדמות העלאה",
    },
  },
}

function toArabicNumerals(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumerals[parseInt(digit, 10)])
    .join("")
}

export function ProgressRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")

  const formatNumber = (num: number): string => {
    if (language === "ar") {
      return toArabicNumerals(num)
    }
    return num.toString()
  }

  return (
    <Field className="w-full max-w-sm" dir={dir}>
      <FieldLabel htmlFor="progress-upload">
        <span>{t.label}</span>
        <span className="ms-auto">{formatNumber(66)}%</span>
      </FieldLabel>
      <Progress value={66} id="progress-upload" className="rtl:rotate-180" />
    </Field>
  )
}
