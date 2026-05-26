"use client"

import * as React from "react"
import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui-rtl/switch"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Share across devices",
      description:
        "Focus is shared across devices, and turns off when you leave the app.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "المشاركة عبر الأجهزة",
      description:
        "يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "שיתוף בין מכשירים",
      description: "המיקוד משותף בין מכשירים, וכבה כשאתה עוזב את האפליקציה.",
    },
  },
}

export function SwitchRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Switch id="switch-focus-mode-rtl" dir={dir} className="max-w-sm">
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel dir={dir}>{t.label}</SwitchLabel>
      <SwitchHiddenInput />
    </Switch>
  )
}
