"use client"

import { Button } from "@/examples/base/ui-rtl/button"
import { ButtonGroup } from "@/examples/base/ui-rtl/button-group"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { useLanguageContext } from "@/components/language-selector"

const translations = {
  ar: {
    dir: "rtl" as const,
    previous: "السابق",
    next: "التالي",
  },
  he: {
    dir: "rtl" as const,
    previous: "הקודם",
    next: "הבא",
  },
}

export function ButtonGroupNested() {
  const context = useLanguageContext()
  const lang = context?.language === "he" ? "he" : "ar"
  const t = translations[lang]

  return (
    <ButtonGroup dir={t.dir}>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label={t.previous}>
          <ArrowLeftIcon className="rtl:rotate-180" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label={t.next}>
          <ArrowRightIcon className="rtl:rotate-180" />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}
