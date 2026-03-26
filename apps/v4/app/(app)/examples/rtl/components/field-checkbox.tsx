"use client"

import { Checkbox } from "@/examples/base/ui-rtl/checkbox"
import { Field, FieldLabel } from "@/examples/base/ui-rtl/field"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    terms: "أوافق على الشروط والأحكام",
  },
  he: {
    dir: "rtl" as const,
    terms: "אני מסכים לתנאים וההגבלות",
  },
}

export function FieldCheckbox() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const { dir, terms } = translations[lang]

  return (
    <div dir={dir}>
      <FieldLabel htmlFor="checkbox-demo-rtl">
        <Field orientation="horizontal">
          <Checkbox id="checkbox-demo-rtl" defaultChecked />
          <FieldLabel htmlFor="checkbox-demo-rtl" className="line-clamp-1">
            {terms}
          </FieldLabel>
        </Field>
      </FieldLabel>
    </div>
  )
}
