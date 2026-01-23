"use client"

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
  const { t } = useTranslation(translations, "ar")

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </TooltipTrigger>
      <TooltipContent>
        {t.content}
      </TooltipContent>
    </Tooltip>
  )
}
