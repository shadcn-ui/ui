"use client"

import {
  Pagination,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/examples/ark/ui-rtl/pagination"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      previous: "Previous",
      next: "Next",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      previous: "السابق",
      next: "التالي",
    },
  },
  he: {
    dir: "rtl",
    values: {
      previous: "הקודם",
      next: "הבא",
    },
  },
}

export function PaginationRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Pagination dir={dir} count={100} pageSize={10} siblingCount={1}>
      <PaginationPrevious text={t.previous} />
      <PaginationContext>
        {(api) =>
          api.pages.map((page, index) =>
            page.type === "page" ? (
              <PaginationItem key={index} {...page}>
                {page.value}
              </PaginationItem>
            ) : (
              <PaginationEllipsis key={index} index={index}>
                &#8230;
              </PaginationEllipsis>
            )
          )
        }
      </PaginationContext>
      <PaginationNext text={t.next} />
    </Pagination>
  )
}
