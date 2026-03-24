"use client"

import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
} from "@/examples/ark/ui-rtl/checkbox"
import { Label } from "@/examples/ark/ui-rtl/label"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Accept terms and conditions",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "قبول الشروط والأحكام",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "קבל תנאים והגבלות",
    },
  },
}

export function LabelRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="flex gap-2" dir={dir}>
      <Checkbox id="terms-rtl">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxHiddenInput />
      </Checkbox>
      <Label htmlFor="terms-rtl">
        {t.label}
      </Label>
    </div>
  )
}
