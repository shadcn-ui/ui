"use client"

import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldTitle,
} from "@/examples/base/ui-rtl/field"
import { Slider } from "@/examples/base/ui-rtl/slider"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    locale: "ar-SA",
    title: "نطاق السعر",
    description: "حدد نطاق ميزانيتك",
    ariaLabel: "نطاق السعر",
    currency: "﷼",
  },
  he: {
    dir: "rtl" as const,
    locale: "he-IL",
    title: "טווח מחירים",
    description: "הגדר את טווח התקציב שלך",
    ariaLabel: "טווח מחירים",
    currency: "₪",
  },
}

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale).format(value)
}

export function FieldSlider() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]
  const [value, setValue] = useState([200, 800])

  return (
    <Field dir={t.dir}>
      <FieldTitle>{t.title}</FieldTitle>
      <FieldDescription>
        {t.description} ({t.currency}
        <span className="font-medium tabular-nums">
          {formatNumber(value[0], t.locale)}
        </span>{" "}
        -{" "}
        <span className="font-medium tabular-nums">
          {formatNumber(value[1], t.locale)}
        </span>
        ).
      </FieldDescription>
      <Slider
        value={value}
        onValueChange={(value) => setValue(value as [number, number])}
        max={1000}
        min={0}
        step={10}
        className="mt-2 w-full"
        aria-label={t.ariaLabel}
      />
    </Field>
  )
}
