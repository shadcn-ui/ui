"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/examples/base/ui-rtl/hover-card"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      trigger: "Wireless Headphones",
      name: "Wireless Headphones",
      price: "$99.99",
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
      trigger: "سماعات لاسلكية",
      name: "سماعات لاسلكية",
      price: "٩٩.٩٩ $",
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
      trigger: "אוזניות אלחוטיות",
      name: "אוזניות אלחוטיות",
      price: "99.99 $",
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

export function HoverCardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {physicalSides.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger
              delay={10}
              closeDelay={100}
              render={<Button variant="outline" />}
            >
              {t[side]}
            </HoverCardTrigger>
            <HoverCardContent
              side={side}
              className="flex w-64 flex-col gap-1"
              dir={dir}
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.price}</div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {logicalSides.map((side) => (
          <HoverCard key={side}>
            <HoverCardTrigger
              delay={10}
              closeDelay={100}
              render={<Button variant="outline" />}
            >
              {t[side]}
            </HoverCardTrigger>
            <HoverCardContent
              side={side}
              className="flex w-64 flex-col gap-1"
              dir={dir}
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.price}</div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  )
}
