"use client"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Button } from "@/styles/aria-nova/ui-rtl/button"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui-rtl/tooltip"

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

const physicalSides = ["left", "top", "bottom", "right"] as const
const logicalSides = ["inline-start", "inline-end"] as const

export function TooltipRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {physicalSides.map((side) => (
          <TooltipTrigger key={side}>
            <Button variant="outline">{t[side]}</Button>
            <Tooltip side={side} dir={dir}>
              {t.content}
            </Tooltip>
          </TooltipTrigger>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {logicalSides.map((side) => (
          <TooltipTrigger key={side}>
            <Button variant="outline">{t[side]}</Button>
            <Tooltip side={side} dir={dir}>
              {t.content}
            </Tooltip>
          </TooltipTrigger>
        ))}
      </div>
    </div>
  )
}
