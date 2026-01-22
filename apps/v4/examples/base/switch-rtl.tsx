"use client"

import * as React from "react"
import { Label } from "@/examples/base/ui-rtl/label"
import { Switch } from "@/examples/base/ui-rtl/switch"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Airplane Mode",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "وضع الطيران",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "מצב טיסה",
    },
  },
}

export function SwitchRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex items-center space-x-2" dir={dir}>
      <Switch id="airplane-mode-rtl" dir={dir} />
      <Label htmlFor="airplane-mode-rtl" dir={dir}>
        {t.label}
      </Label>
    </div>
  )
}
