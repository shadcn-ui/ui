"use client"

import * as React from "react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui-rtl/toggle-group"

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
    <ToggleGroup variant="outline" defaultSelectedKeys={["list"]} dir={dir}>
      <ToggleGroupItem id="list" aria-label={t.list}>
        {t.list}
      </ToggleGroupItem>
      <ToggleGroupItem id="grid" aria-label={t.grid}>
        {t.grid}
      </ToggleGroupItem>
      <ToggleGroupItem id="cards" aria-label={t.cards}>
        {t.cards}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
