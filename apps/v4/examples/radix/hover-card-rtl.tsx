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
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "سماعات لاسلكية",
      name: "سماعات لاسلكية",
      price: "٩٩.٩٩ $",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "אוזניות אלחוטיות",
      name: "אוזניות אלחוטיות",
      price: "99.99 $",
    },
  },
}

export function HoverCardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link">{t.trigger}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-1" dir={dir}>
        <div className="font-semibold">{t.name}</div>
        <div className="text-muted-foreground text-sm">{t.price}</div>
      </HoverCardContent>
    </HoverCard>
  )
}
