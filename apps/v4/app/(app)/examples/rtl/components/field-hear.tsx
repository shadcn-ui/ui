"use client"

import { Card, CardContent } from "@/examples/base/ui-rtl/card"
import { Checkbox } from "@/examples/base/ui-rtl/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/examples/base/ui-rtl/field"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    legend: "كيف سمعت عنا؟",
    description: "اختر الخيار الذي يصف أفضل طريقة سمعت عنا من خلالها.",
    socialMedia: "التواصل الاجتماعي",
    searchEngine: "البحث",
    referral: "إحالة",
    other: "أخرى",
  },
  he: {
    dir: "rtl" as const,
    legend: "איך שמעת עלינו?",
    description: "בחר את האפשרות שמתארת בצורה הטובה ביותר כיצד שמעת עלינו.",
    socialMedia: "חברתיות",
    searchEngine: "חיפוש",
    referral: "הפניה",
    other: "אחר",
  },
}

export function FieldHear() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  const options = [
    { label: t.socialMedia, value: "social-media" },
    { label: t.searchEngine, value: "search-engine" },
    { label: t.referral, value: "referral" },
    { label: t.other, value: "other" },
  ]

  return (
    <div dir={t.dir}>
      <Card className="border-0 py-4 shadow-none">
        <CardContent className="px-4">
          <form>
            <FieldGroup>
              <FieldSet className="gap-4">
                <FieldLegend>{t.legend}</FieldLegend>
                <FieldDescription className="line-clamp-1">
                  {t.description}
                </FieldDescription>
                <FieldGroup className="flex flex-row flex-wrap gap-2 [--radius:9999rem]">
                  {options.map((option) => (
                    <FieldLabel
                      htmlFor={`rtl-${option.value}`}
                      key={option.value}
                      className="w-fit!"
                    >
                      <Field
                        orientation="horizontal"
                        className="gap-1.5 overflow-hidden px-3! py-1.5! transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:px-2!"
                      >
                        <Checkbox
                          value={option.value}
                          id={`rtl-${option.value}`}
                          defaultChecked={option.value === "social-media"}
                          className="-ms-6 translate-x-1 rounded-full transition-all duration-100 ease-linear data-checked:ms-0 data-checked:translate-x-0"
                        />
                        <FieldTitle>{option.label}</FieldTitle>
                      </Field>
                    </FieldLabel>
                  ))}
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
