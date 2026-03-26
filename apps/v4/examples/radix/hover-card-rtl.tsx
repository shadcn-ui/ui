"use client"

import { Button } from "@/examples/radix/ui-rtl/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/examples/radix/ui-rtl/hover-card"

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
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "سماعات لاسلكية",
      name: "سماعات لاسلكية",
      price: "٩٩.٩٩ $",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "אוזניות אלחוטיות",
      name: "אוזניות אלחוטיות",
      price: "99.99 $",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
    },
  },
}

const physicalSides: Array<"left" | "top" | "bottom" | "right"> = [
  "left",
  "top",
  "bottom",
  "right",
]

export function HoverCardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {physicalSides.map((side) => (
        <HoverCard key={side} openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline">{t[side]}</Button>
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
  )
}
