"use client"

import * as React from "react"
import { Textarea } from "@/examples/radix/ui-rtl/textarea"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Type your message here.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اكتب رسالتك هنا.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "הקלד את ההודעה שלך כאן.",
    },
  },
}

export function TextareaRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return <Textarea placeholder={t.placeholder} dir={dir} />
}
