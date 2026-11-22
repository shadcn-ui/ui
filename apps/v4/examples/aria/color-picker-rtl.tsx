"use client"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerHue,
  ColorPickerInput,
  ColorPickerSwatch,
} from "@/styles/aria-nova/ui-rtl/color-picker"
import { Field, FieldLabel } from "@/styles/aria-nova/ui-rtl/field"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      label: "Brand color",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      label: "لون العلامة التجارية",
    },
  },
  he: {
    dir: "rtl",
    values: {
      label: "צבע המותג",
    },
  },
}

export function ColorPickerRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Field className="max-w-64" dir={dir}>
      <FieldLabel htmlFor="color-picker-rtl">{t.label}</FieldLabel>
      <ColorPicker defaultValue="#3b82f6" dir={dir}>
        <ColorPickerArea />
        <ColorPickerHue />
        <div className="flex items-center gap-2">
          <ColorPickerSwatch />
          <ColorPickerInput id="color-picker-rtl" />
        </div>
      </ColorPicker>
    </Field>
  )
}
