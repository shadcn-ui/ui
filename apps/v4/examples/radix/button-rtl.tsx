"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui-rtl/button"
import { ArrowUpIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      button: "Button",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      button: "زر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      button: "כפתור",
    },
  },
}

export function ButtonRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row" dir={dir}>
      <Button variant="outline">{t.button}</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
