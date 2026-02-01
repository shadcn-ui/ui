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
      title: "Dimensions",
      description: "Set the dimensions for the layer.",
      left: "Left",
      top: "Top",
      bottom: "Bottom",
      right: "Right",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      title: "الأبعاد",
      description: "تعيين الأبعاد للطبقة.",
      left: "يسار",
      top: "أعلى",
      bottom: "أسفل",
      right: "يمين",
    },
  },
  he: {
    dir: "rtl",
    values: {
      title: "מימדים",
      description: "הגדר את המימדים לשכבה.",
      left: "שמאל",
      top: "למעלה",
      bottom: "למטה",
      right: "ימין",
    },
  },
}

const physicalSides = ["left", "top", "bottom", "right"] as const

export function PopoverRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {physicalSides.map((side) => (
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline">{t[side]}</Button>
          </PopoverTrigger>
          <PopoverContent side={side} dir={dir}>
            <PopoverHeader>
              <PopoverTitle>{t.title}</PopoverTitle>
              <PopoverDescription>{t.description}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
