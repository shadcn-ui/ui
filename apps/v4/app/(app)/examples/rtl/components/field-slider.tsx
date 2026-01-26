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
    title: "نطاق السعر",
    description: "حدد نطاق ميزانيتك",
    ariaLabel: "نطاق السعر",
  },
  he: {
    dir: "rtl" as const,
    title: "טווח מחירים",
    description: "הגדר את טווח התקציב שלך",
    ariaLabel: "טווח מחירים",
  },
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
        {t.description} ($
        <span className="font-medium tabular-nums">{value[0]}</span> -{" "}
        <span className="font-medium tabular-nums">{value[1]}</span>).
      </FieldDescription>
      <Slider
        value={value}
        onValueChange={(value) => setValue(value as [number, number])}
        max={1000}
        min={0}
        step={10}
        className="mt-2 w-full"
        aria-label={t.ariaLabel}
        dir={t.dir}
      />
    </Field>
  )
}
