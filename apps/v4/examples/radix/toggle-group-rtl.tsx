"use client"

import * as React from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/examples/radix/ui-rtl/toggle-group"
import { Bold, Italic, Underline } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

export function ToggleGroupRtl() {
  const { dir } = useTranslation(translations, "ar")

  return (
    <ToggleGroup variant="outline" multiple dir={dir}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
