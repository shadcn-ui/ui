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
      start: "Start",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
      end: "End",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      content: "إضافة إلى المكتبة",
      start: "بداية السطر",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
      end: "نهاية السطر",
    },
  },
  he: {
    dir: "rtl",
    values: {
      content: "הוסף לספרייה",
      start: "תחילת השורה",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
      end: "סוף השורה",
    },
  },
}

const physicalSides = ["left", "top", "bottom", "right"] as const
const logicalPlacements = ["start", "end"] as const

export function TooltipRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {physicalSides.map((side) => (
          <TooltipTrigger key={side}>
            <Button variant="outline">{t[side]}</Button>
            <Tooltip placement={side} dir={dir}>
              {t.content}
            </Tooltip>
          </TooltipTrigger>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {logicalPlacements.map((placement) => (
          <TooltipTrigger key={placement}>
            <Button variant="outline">{t[placement]}</Button>
            <Tooltip placement={placement} dir={dir}>
              {t.content}
            </Tooltip>
          </TooltipTrigger>
        ))}
      </div>
    </div>
  )
}
