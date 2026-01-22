"use client"

import * as React from "react"
import { Button } from "@/examples/base/ui-rtl/button"
import { Input } from "@/examples/base/ui-rtl/input"
import { Label } from "@/examples/base/ui-rtl/label"
import {
  Popover,
  PopoverContent,
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
      trigger: "Open popover",
      title: "Dimensions",
      description: "Set the dimensions for the layer.",
      width: "Width",
      maxWidth: "Max. width",
      height: "Height",
      maxHeight: "Max. height",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      trigger: "فتح النافذة المنبثقة",
      title: "الأبعاد",
      description: "تعيين الأبعاد للطبقة.",
      width: "العرض",
      maxWidth: "الحد الأقصى للعرض",
      height: "الارتفاع",
      maxHeight: "الحد الأقصى للارتفاع",
    },
  },
  he: {
    dir: "rtl",
    values: {
      trigger: "פתח חלון קופץ",
      title: "מימדים",
      description: "הגדר את המימדים לשכבה.",
      width: "רוחב",
      maxWidth: "רוחב מקסימלי",
      height: "גובה",
      maxHeight: "גובה מקסימלי",
    },
  },
}

export function PopoverRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Popover dir={dir}>
      <PopoverTrigger render={<Button variant="outline" />}>
        {t.trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80" dir={dir}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">{t.title}</h4>
            <p className="text-muted-foreground text-sm">{t.description}</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width-rtl">{t.width}</Label>
              <Input
                id="width-rtl"
                defaultValue="100%"
                className="col-span-2 h-8"
                dir={dir}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth-rtl">{t.maxWidth}</Label>
              <Input
                id="maxWidth-rtl"
                defaultValue="300px"
                className="col-span-2 h-8"
                dir={dir}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height-rtl">{t.height}</Label>
              <Input
                id="height-rtl"
                defaultValue="25px"
                className="col-span-2 h-8"
                dir={dir}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight-rtl">{t.maxHeight}</Label>
              <Input
                id="maxHeight-rtl"
                defaultValue="none"
                className="col-span-2 h-8"
                dir={dir}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
