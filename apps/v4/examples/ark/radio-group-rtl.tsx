"use client"

import * as React from "react"
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
} from "@/examples/ark/ui-rtl/radio-group"
import {
  FieldContent,
  FieldDescription,
} from "@/examples/ark/ui-rtl/field"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      default: "Default",
      defaultDescription: "Standard spacing for most use cases.",
      comfortable: "Comfortable",
      comfortableDescription: "More space between elements.",
      compact: "Compact",
      compactDescription: "Minimal spacing for dense layouts.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      default: "افتراضي",
      defaultDescription: "تباعد قياسي لمعظم حالات الاستخدام.",
      comfortable: "مريح",
      comfortableDescription: "مساحة أكبر بين العناصر.",
      compact: "مضغوط",
      compactDescription: "تباعد أدنى للتخطيطات الكثيفة.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      default: "ברירת מחדל",
      defaultDescription: "ריווח סטנדרטי לרוב מקרי השימוש.",
      comfortable: "נוח",
      comfortableDescription: "יותר מקום בין האלמנטים.",
      compact: "קומפקטי",
      compactDescription: "ריווח מינימלי לפריסות צפופות.",
    },
  },
}

export function RadioGroupRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <RadioGroup defaultValue="comfortable" className="w-fit" dir={dir}>
      <RadioGroupItem value="default" dir={dir}>
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText dir={dir}>{t.default}</RadioGroupItemText>
          <FieldDescription dir={dir}>{t.defaultDescription}</FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="comfortable" dir={dir}>
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText dir={dir}>{t.comfortable}</RadioGroupItemText>
          <FieldDescription dir={dir}>
            {t.comfortableDescription}
          </FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
      <RadioGroupItem value="compact" dir={dir}>
        <RadioGroupItemControl />
        <FieldContent>
          <RadioGroupItemText dir={dir}>{t.compact}</RadioGroupItemText>
          <FieldDescription dir={dir}>{t.compactDescription}</FieldDescription>
        </FieldContent>
        <RadioGroupItemHiddenInput />
      </RadioGroupItem>
    </RadioGroup>
  )
}
