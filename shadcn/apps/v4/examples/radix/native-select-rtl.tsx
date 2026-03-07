"use client"

import * as React from "react"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/examples/radix/ui-rtl/native-select"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      placeholder: "Select status",
      todo: "Todo",
      inProgress: "In Progress",
      done: "Done",
      cancelled: "Cancelled",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      placeholder: "اختر الحالة",
      todo: "مهام",
      inProgress: "قيد التنفيذ",
      done: "منجز",
      cancelled: "ملغي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      placeholder: "בחר סטטוס",
      todo: "לעשות",
      inProgress: "בתהליך",
      done: "הושלם",
      cancelled: "בוטל",
    },
  },
}

export function NativeSelectRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <NativeSelect dir={dir}>
      <NativeSelectOption value="">{t.placeholder}</NativeSelectOption>
      <NativeSelectOption value="todo">{t.todo}</NativeSelectOption>
      <NativeSelectOption value="in-progress">
        {t.inProgress}
      </NativeSelectOption>
      <NativeSelectOption value="done">{t.done}</NativeSelectOption>
      <NativeSelectOption value="cancelled">{t.cancelled}</NativeSelectOption>
    </NativeSelect>
  )
}
