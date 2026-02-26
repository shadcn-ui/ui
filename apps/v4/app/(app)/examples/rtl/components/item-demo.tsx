"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/examples/base/ui-rtl/item"
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    twoFactor: "المصادقة الثنائية",
    twoFactorDescription: "التحقق عبر البريد الإلكتروني أو رقم الهاتف.",
    enable: "تفعيل",
    verified: "تم التحقق من ملفك الشخصي.",
  },
  he: {
    dir: "rtl" as const,
    twoFactor: "אימות דו-שלבי",
    twoFactorDescription: "אמת באמצעות אימייל או מספר טלפון.",
    enable: "הפעל",
    verified: "הפרופיל שלך אומת.",
  },
}

export function ItemDemo() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  return (
    <div dir={t.dir} className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{t.twoFactor}</ItemTitle>
          <ItemDescription className="text-pretty xl:hidden 2xl:block">
            {t.twoFactorDescription}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">{t.enable}</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia>
          <BadgeCheckIcon className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t.verified}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4 rtl:rotate-180" />
        </ItemActions>
      </Item>
    </div>
  )
}
