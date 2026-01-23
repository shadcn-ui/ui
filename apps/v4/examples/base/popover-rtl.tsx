"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/base/ui-rtl/popover"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      trigger: "Open Popover",
      title: "Dimensions",
      description: "Set the dimensions for the layer.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "فتح النافذة المنبثقة",
      title: "الأبعاد",
      description: "تعيين الأبعاد للطبقة.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "פתח חלון קופץ",
      title: "מימדים",
      description: "הגדר את המימדים לשכבה.",
    },
  },
}

export function PopoverRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" className="w-fit" />}>
        {t.trigger}
      </PopoverTrigger>
      <PopoverContent side="inline-end" dir={dir}>
        <PopoverHeader>
          <PopoverTitle>{t.title}</PopoverTitle>
          <PopoverDescription>{t.description}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
