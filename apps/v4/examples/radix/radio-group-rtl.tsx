"use client"

import * as React from "react"
import { Label } from "@/examples/radix/ui-rtl/label"
import { RadioGroup, RadioGroupItem } from "@/examples/radix/ui-rtl/radio-group"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      default: "Default",
      comfortable: "Comfortable",
      compact: "Compact",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      default: "افتراضي",
      comfortable: "مريح",
      compact: "مضغوط",
    },
  },
  he: {
    dir: "rtl",
    values: {
      default: "ברירת מחדל",
      comfortable: "נוח",
      compact: "קומפקטי",
    },
  },
}

export function RadioGroupRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <RadioGroup defaultValue="comfortable" className="w-fit" dir={dir}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="r1-rtl" dir={dir} />
        <Label htmlFor="r1-rtl" dir={dir}>
          {t.default}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="r2-rtl" dir={dir} />
        <Label htmlFor="r2-rtl" dir={dir}>
          {t.comfortable}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="r3-rtl" dir={dir} />
        <Label htmlFor="r3-rtl" dir={dir}>
          {t.compact}
        </Label>
      </div>
    </RadioGroup>
  )
}
