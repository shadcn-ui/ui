"use client"

import { Button } from "@/examples/base/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/base/ui/tooltip"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      content: "Add to library",
      "inline-start": "Inline Start",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      "inline-end": "Inline End",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      content: "إضافة إلى المكتبة",
      "inline-start": "بداية السطر",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      "inline-end": "نهاية السطر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      content: "הוסף לספרייה",
      "inline-start": "תחילת השורה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      "inline-end": "סוף השורה",
    },
  },
}

const sides = [
  "inline-start",
  "left",
  "top",
  "bottom",
  "right",
  "inline-end",
] as const

export function TooltipRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex flex-wrap gap-2" dir="rtl">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>
            {t[side]}
          </TooltipTrigger>
          <TooltipContent side={side} dir={dir}>{t.content}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
