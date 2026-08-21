"use client"

import * as React from "react"

import { useLocks } from "@/app/(app)/(typeset)/hooks/use-locks"
import { FONTS } from "@/app/(app)/(typeset)/lib/fonts"
import {
  TYPESET_FLOWS,
  TYPESET_LEADINGS,
  TYPESET_MEASURES,
  TYPESET_SIZES,
  useTypesetSearchParams,
  type TypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

function randomItem<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export function useShuffle() {
  const { locks } = useLocks()
  const [, setParams] = useTypesetSearchParams()

  // Randomize the type design (fonts + size/measure/rhythm). Leaves item (the
  // specimen) alone; locked params keep their current value.
  const shuffle = React.useCallback(() => {
    const bodyFonts = FONTS.filter((font) => font.type !== "mono").map(
      (font) => font.id
    )
    const monoFonts = FONTS.filter((font) => font.type === "mono").map(
      (font) => font.id
    )
    const next: Partial<TypesetSearchParams> = {
      body: randomItem(bodyFonts),
      heading: randomItem(["inherit", ...bodyFonts]),
      mono: randomItem(monoFonts),
      scale: randomItem(TYPESET_SIZES.map((option) => option.value)),
      measure: randomItem(TYPESET_MEASURES.map((option) => option.value)),
      leading: randomItem(TYPESET_LEADINGS.map((option) => option.value)),
      flow: randomItem(TYPESET_FLOWS.map((option) => option.value)),
    }

    for (const param of locks) {
      delete next[param]
    }

    setParams(next, { history: "replace" })
  }, [setParams, locks])

  // null clears every managed key back to its default.
  const reset = React.useCallback(() => {
    setParams(null, { history: "replace" })
  }, [setParams])

  return { shuffle, reset }
}
