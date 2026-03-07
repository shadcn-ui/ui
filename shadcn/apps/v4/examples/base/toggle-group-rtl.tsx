"use client"

import * as React from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/examples/base/ui-rtl/toggle-group"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      list: "List",
      grid: "Grid",
      cards: "Cards",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      list: "قائمة",
      grid: "شبكة",
      cards: "بطاقات",
    },
  },
  he: {
    dir: "rtl",
    values: {
      list: "רשימה",
      grid: "רשת",
      cards: "כרטיסים",
    },
  },
}

export function ToggleGroupRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <ToggleGroup variant="outline" defaultValue={["list"]} dir={dir}>
      <ToggleGroupItem value="list" aria-label={t.list}>
        {t.list}
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label={t.grid}>
        {t.grid}
      </ToggleGroupItem>
      <ToggleGroupItem value="cards" aria-label={t.cards}>
        {t.cards}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
