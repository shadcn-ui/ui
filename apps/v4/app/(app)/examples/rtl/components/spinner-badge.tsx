"use client"

import { useLanguageContext } from "@/components/language-selector"
import { Badge } from "@/styles/base-force-ui/ui-rtl/badge"
import { Spinner } from "@/styles/base-force-ui/ui-rtl/spinner"

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
}

export function SpinnerBadge() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
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
