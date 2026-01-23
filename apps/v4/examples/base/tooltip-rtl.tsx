"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui-rtl/tooltip"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      trigger: "Hover",
      content: "Add to library",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "مرر",
      content: "إضافة إلى المكتبة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "רחף",
      content: "הוסף לספרייה",
    },
  },
}

export function TooltipRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />} dir={dir}>
        {t.trigger}
      </TooltipTrigger>
      <TooltipContent dir={dir}>{t.content}</TooltipContent>
    </Tooltip>
  )
}
