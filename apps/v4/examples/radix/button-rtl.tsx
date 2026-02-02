"use client"

import { Button } from "@/examples/radix/ui-rtl/button"
import { Spinner } from "@/examples/radix/ui-rtl/spinner"
import { ArrowRightIcon, PlusIcon } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      button: "Button",
      submit: "Submit",
      delete: "Delete",
      loading: "Loading",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      button: "زر",
      submit: "إرسال",
      delete: "حذف",
      loading: "جاري التحميل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      button: "כפתור",
      submit: "שלח",
      delete: "מחק",
      loading: "טוען",
    },
  },
}

export function ButtonRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row" dir={dir}>
      <Button variant="outline">{t.button}</Button>
      <Button variant="destructive">{t.delete}</Button>
      <Button variant="outline">
        {t.submit}{" "}
        <ArrowRightIcon className="rtl:rotate-180" data-icon="inline-end" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
      <Button variant="secondary" disabled>
        <Spinner data-icon="inline-start" /> {t.loading}
      </Button>
    </div>
  )
}
