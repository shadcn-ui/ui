"use client"

import * as React from "react"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/examples/base/ui-rtl/progress"

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
    <Progress value={56} className="w-full max-w-sm" dir={dir}>
      <ProgressLabel>{t.label}</ProgressLabel>
      <ProgressValue>
        {(value) => (
          <span className="ms-auto">
            {formatNumber(parseFloat(value ?? "0"))}%
          </span>
        )}
      </ProgressValue>
    </Progress>
  )
}
