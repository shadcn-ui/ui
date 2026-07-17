"use client"

import * as React from "react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  Combobox,
  ComboboxChip,
  ComboboxChipList,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/styles/aria-nova/ui-rtl/combobox"
import { Field, FieldLabel } from "@/styles/aria-nova/ui-rtl/field"

const categories = [
  "technology",
  "design",
  "business",
  "marketing",
  "education",
  "health",
] as const

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Categories",
      placeholder: "Add categories",
      empty: "No categories found.",
      technology: "Technology",
      design: "Design",
      business: "Business",
      marketing: "Marketing",
      education: "Education",
      health: "Health",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "الفئات",
      placeholder: "أضف فئات",
      empty: "لم يتم العثور على فئات.",
      technology: "التكنولوجيا",
      design: "التصميم",
      business: "الأعمال",
      marketing: "التسويق",
      education: "التعليم",
      health: "الصحة",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "קטגוריות",
      placeholder: "הוסף קטגוריות",
      empty: "לא נמצאו קטגוריות.",
      technology: "טכנולוגיה",
      design: "עיצוב",
      business: "עסקים",
      marketing: "שיווק",
      education: "חינוך",
      health: "בריאות",
    },
  },
}

export function ComboboxRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")

  const categoryLabels: Record<string, string> = {
    technology: t.technology,
    design: t.design,
    business: t.business,
    marketing: t.marketing,
    education: t.education,
    health: t.health,
  }

  return (
    <Field className="mx-auto w-full max-w-xs">
      <FieldLabel>{t.label}</FieldLabel>
      <Combobox
        aria-label={t.label}
        selectionMode="multiple"
        defaultValue={[categories[0]]}
        allowsEmptyCollection
      >
        <ComboboxChips>
          <ComboboxChipList<{ name: string }>>
            {(value) => (
              <ComboboxChip id={value.name}>
                {categoryLabels[value.name] || value.name}
              </ComboboxChip>
            )}
          </ComboboxChipList>
          <ComboboxChipsInput placeholder={t.placeholder} />
        </ComboboxChips>
        <ComboboxContent
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <ComboboxList
            renderEmptyState={() => <ComboboxEmpty>{t.empty}</ComboboxEmpty>}
          >
            {categories.map((item) => (
              <ComboboxItem key={item} id={item} value={{ name: item }}>
                {categoryLabels[item] || item}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
