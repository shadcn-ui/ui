"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/examples/radix/ui-rtl/select"

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
  const [selectedFruit, setSelectedFruit] = React.useState<string>("")

  const fruits = [
    { label: t.apple, value: "apple" },
    { label: t.banana, value: "banana" },
    { label: t.blueberry, value: "blueberry" },
    { label: t.grapes, value: "grapes" },
    { label: t.pineapple, value: "pineapple" },
  ]

  const vegetables = [
    { label: t.carrot, value: "carrot" },
    { label: t.broccoli, value: "broccoli" },
    { label: t.spinach, value: "spinach" },
  ]

  return (
    <Select value={selectedFruit} onValueChange={setSelectedFruit}>
      <SelectTrigger className="w-32" dir={dir}>
        <SelectValue placeholder={t.selectFruit} />
      </SelectTrigger>
      <SelectContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
        <SelectGroup>
          <SelectLabel>{t.fruits}</SelectLabel>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>{t.vegetables}</SelectLabel>
          {vegetables.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
