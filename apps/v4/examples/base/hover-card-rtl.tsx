"use client"

import * as React from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/examples/base/ui-rtl/avatar"
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
      trigger: "Hover Here",
      username: "@nextjs",
      description: "The React Framework – created and maintained by @vercel.",
      joined: "Joined December 2021",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "مرر هنا",
      username: "@nextjs",
      description: "إطار عمل React – تم إنشاؤه وصيانته بواسطة @vercel.",
      joined: "انضم في ديسمبر 2021",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "רחף כאן",
      username: "@nextjs",
      description: "מסגרת React – נוצרה ומתוחזקת על ידי @vercel.",
      joined: "הצטרף בדצמבר 2021",
    },
  },
}

export function HoverCardRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <HoverCard dir={dir}>
      <HoverCardTrigger
        delay={10}
        closeDelay={100}
        render={<Button variant="link" />}
      >
        {t.trigger}
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5" dir={dir}>
        <div className="font-semibold">{t.username}</div>
        <div>{t.description}</div>
        <div className="text-muted-foreground mt-1 text-xs">{t.joined}</div>
      </HoverCardContent>
    </HoverCard>
  )
}
