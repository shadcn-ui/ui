"use client"

import * as React from "react"
import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectPositioner,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectValueChangeDetails,
} from "@/examples/ark/ui-rtl/select"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      selectFruit: "Select a fruit",
      fruits: "Fruits",
      apple: "Apple",
      banana: "Banana",
      blueberry: "Blueberry",
      grapes: "Grapes",
      pineapple: "Pineapple",
      vegetables: "Vegetables",
      carrot: "Carrot",
      broccoli: "Broccoli",
      spinach: "Spinach",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      selectFruit: "اختر فاكهة",
      fruits: "الفواكه",
      apple: "تفاح",
      banana: "موز",
      blueberry: "توت أزرق",
      grapes: "عنب",
      pineapple: "أناناس",
      vegetables: "الخضروات",
      carrot: "جزر",
      broccoli: "بروكلي",
      spinach: "سبانخ",
    },
  },
  he: {
    dir: "rtl",
    values: {
      selectFruit: "בחר פרי",
      fruits: "פירות",
      apple: "תפוח",
      banana: "בננה",
      blueberry: "אוכמניה",
      grapes: "ענבים",
      pineapple: "אננס",
      vegetables: "ירקות",
      carrot: "גזר",
      broccoli: "ברוקולי",
      spinach: "תרד",
    },
  },
}

export function SelectRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")
  const [selectedFruit, setSelectedFruit] = React.useState<string[]>([])

  const fruits = React.useMemo(
    () => [
      { label: t.apple, value: "apple" },
      { label: t.banana, value: "banana" },
      { label: t.blueberry, value: "blueberry" },
      { label: t.grapes, value: "grapes" },
      { label: t.pineapple, value: "pineapple" },
    ],
    [t]
  )

  const vegetables = React.useMemo(
    () => [
      { label: t.carrot, value: "carrot" },
      { label: t.broccoli, value: "broccoli" },
      { label: t.spinach, value: "spinach" },
    ],
    [t]
  )

  const collection = React.useMemo(
    () =>
      createListCollection({
        items: [...fruits, ...vegetables],
      }),
    [fruits, vegetables]
  )

  return (
    <Select
      collection={collection}
      value={selectedFruit}
      onValueChange={(details: SelectValueChangeDetails) =>
        setSelectedFruit(details.value)
      }
      className="w-32"
    >
      <SelectHiddenSelect />
      <SelectControl dir={dir}>
        <SelectTrigger>
          <SelectValue placeholder={t.selectFruit} />
        </SelectTrigger>
        <SelectIndicatorGroup>
          <SelectIndicator />
        </SelectIndicatorGroup>
      </SelectControl>
      
        <SelectPositioner>
          <SelectContent
            dir={dir}
            data-lang={dir === "rtl" ? language : undefined}
          >
            <SelectItemGroup>
              <SelectItemGroupLabel>{t.fruits}</SelectItemGroupLabel>
              {fruits.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
            <SelectSeparator />
            <SelectItemGroup>
              <SelectItemGroupLabel>{t.vegetables}</SelectItemGroupLabel>
              {vegetables.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator />
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </SelectPositioner>
      
    </Select>
  )
}
