"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxList,
  ComboboxTrigger,
  useFilter,
  useListCollection,
} from "@/examples/ark/ui-rtl/combobox"
import { Field, FieldLabel } from "@/examples/ark/ui-rtl/field"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

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

  const categoryItems = React.useMemo(
    () =>
      categories.map((cat) => ({
        label: categoryLabels[cat] || cat,
        value: cat,
      })),
    [categoryLabels]
  )

  const { contains } = useFilter({ sensitivity: "base" })
  const { collection, filter, set } = useListCollection({
    initialItems: categoryItems,
    filter: contains,
  })

  React.useEffect(() => {
    set(categoryItems)
  }, [categoryItems, set])

  return (
    <Field className="mx-auto w-full max-w-xs">
      <FieldLabel>{t.label}</FieldLabel>
      <Combobox
        collection={collection}
        onInputValueChange={(details) => filter(details.inputValue)}
        multiple
        defaultValue={[categories[0]]}
      >
        <ComboboxControl>
          <ComboboxInput placeholder={t.placeholder} />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <ComboboxList>
            {collection.items.map((item) => (
              <ComboboxItem key={item.value} item={item}>
                <ComboboxItemText>{item.label}</ComboboxItemText>
                <ComboboxItemIndicator />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
