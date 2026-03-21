"use client"

import * as React from "react"
import {
  Checkbox,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/examples/ark/ui-rtl/checkbox"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      acceptTerms: "Accept terms and conditions",
      acceptTermsDescription:
        "By clicking this checkbox, you agree to the terms.",
      enableNotifications: "Enable notifications",
      enableNotificationsDescription:
        "You can enable or disable notifications at any time.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      acceptTerms: "قبول الشروط والأحكام",
      acceptTermsDescription: "بالنقر على هذا المربع، فإنك توافق على الشروط.",
      enableNotifications: "تفعيل الإشعارات",
      enableNotificationsDescription:
        "يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      acceptTerms: "קבל תנאים והגבלות",
      acceptTermsDescription:
        "על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.",
      enableNotifications: "הפעל התראות",
      enableNotificationsDescription:
        "אתה יכול להפעיל או להשבית התראות בכל עת.",
    },
  },
}

export function CheckboxRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div className="max-w-sm space-y-4" dir={dir}>
      <Checkbox id="terms-checkbox-rtl" name="terms-checkbox">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>{t.acceptTerms}</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox
        id="terms-checkbox-2-rtl"
        name="terms-checkbox-2"
        defaultChecked
      >
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>{t.acceptTerms}</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled>
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>{t.enableNotifications}</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
      <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2">
        <CheckboxControl>
          <CheckboxIndicator />
        </CheckboxControl>
        <CheckboxLabel>{t.enableNotifications}</CheckboxLabel>
        <CheckboxHiddenInput />
      </Checkbox>
    </div>
  )
}
