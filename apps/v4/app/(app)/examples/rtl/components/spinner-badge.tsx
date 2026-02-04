"use client"

import { Badge } from "@/examples/base/ui-rtl/badge"
import { Spinner } from "@/examples/base/ui-rtl/spinner"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    syncing: "جارٍ المزامنة",
    updating: "جارٍ التحديث",
    loading: "جارٍ التحميل",
  },
  he: {
    dir: "rtl" as const,
    syncing: "מסנכרן",
    updating: "מעדכן",
    loading: "טוען",
  },
  fa: {
    dir: "rtl" as const,
    syncing: "در حال همگام‌سازی",
    updating: "در حال بروزرسانی",
    loading: "در حال بارگذاری",
  },
}

export function SpinnerBadge() {
  const context = useLanguageContext()
  const lang = (['ar', 'he', 'fa'] as const).includes(
    context?.language as any
  )
    ? (context?.language as 'ar' | 'he' | 'fa')
    : 'ar'
  const t = translations[lang]

  return (
    <div dir={t.dir} className="flex items-center gap-2">
      <Badge>
        <Spinner />
        {t.syncing}
      </Badge>
      <Badge variant="secondary">
        <Spinner />
        {t.updating}
      </Badge>
      <Badge variant="outline">
        <Spinner />
        {t.loading}
      </Badge>
    </div>
  )
}
