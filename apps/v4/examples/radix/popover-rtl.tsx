"use client"

import { Button } from "@/examples/radix/ui-rtl/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/examples/radix/ui-rtl/popover"

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
      <PopoverTrigger asChild>
        <Button variant="outline">{t.trigger}</Button>
      </PopoverTrigger>
      <PopoverContent align="start" dir={dir}>
        <PopoverHeader>
          <PopoverTitle>{t.title}</PopoverTitle>
          <PopoverDescription>{t.description}</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
