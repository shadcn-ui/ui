"use client"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import { Button } from "@/styles/aria-nova/ui-rtl/button"
import {
  HoverCard,
  HoverCardTrigger,
} from "@/styles/aria-nova/ui-rtl/hover-card"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      name: "Wireless Headphones",
      price: "$99.99",
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
      name: "سماعات لاسلكية",
      price: "٩٩.٩٩ $",
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
      name: "אוזניות אלחוטיות",
      price: "99.99 $",
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

export function HoverCardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {physicalSides.map((side) => (
          <HoverCardTrigger key={side} delay={10} closeDelay={100}>
            <Button variant="outline">{t[side]}</Button>
            <HoverCard
              placement={side}
              dir={dir}
              className="flex w-64 flex-col gap-1"
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.price}</div>
            </HoverCard>
          </HoverCardTrigger>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {logicalPlacements.map((placement) => (
          <HoverCardTrigger key={placement} delay={10} closeDelay={100}>
            <Button variant="outline">{t[placement]}</Button>
            <HoverCard
              placement={placement}
              dir={dir}
              className="flex w-64 flex-col gap-1"
            >
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.price}</div>
            </HoverCard>
          </HoverCardTrigger>
        ))}
      </div>
    </div>
  )
}
