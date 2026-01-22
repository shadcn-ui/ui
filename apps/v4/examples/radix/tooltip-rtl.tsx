"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui-rtl/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui-rtl/tooltip"

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
    <Tooltip dir={dir}>
      <TooltipTrigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </TooltipTrigger>
      <TooltipContent dir={dir}>
        <p>{t.content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
