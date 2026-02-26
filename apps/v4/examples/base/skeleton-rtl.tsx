"use client"

import * as React from "react"
import { Skeleton } from "@/examples/base/ui-rtl/skeleton"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {},
  },
  ar: {
    dir: "rtl",
    values: {},
  },
  he: {
    dir: "rtl",
    values: {},
  },
}

export function SkeletonRtl() {
  const { dir } = useTranslation(translations, "ar")

  return (
    <div className="flex items-center gap-4" dir={dir}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
