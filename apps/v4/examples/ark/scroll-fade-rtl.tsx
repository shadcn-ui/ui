"use client"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      design: "Design",
      engineering: "Engineering",
      marketing: "Marketing",
      product: "Product",
      research: "Research",
      sales: "Sales",
      support: "Support",
      operations: "Operations",
      finance: "Finance",
      legal: "Legal",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      design: "تصميم",
      engineering: "هندسة",
      marketing: "تسويق",
      product: "منتج",
      research: "أبحاث",
      sales: "مبيعات",
      support: "دعم",
      operations: "عمليات",
      finance: "مالية",
      legal: "قانوني",
    },
  },
  he: {
    dir: "rtl",
    values: {
      design: "עיצוב",
      engineering: "הנדסה",
      marketing: "שיווק",
      product: "מוצר",
      research: "מחקר",
      sales: "מכירות",
      support: "תמיכה",
      operations: "תפעול",
      finance: "כספים",
      legal: "משפטי",
    },
  },
}

export function ScrollFadeRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <div
      className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border"
      dir={dir}
    >
      <div className="scroll-fade-x scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-1.5 p-1.5">
          {Object.values(t).map((tag) => (
            <div
              key={tag}
              className="shrink-0 rounded-lg bg-muted px-3 py-2.5 text-sm"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
