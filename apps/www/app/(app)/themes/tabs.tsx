import * as React from "react"

import { ThemeWrapper } from "@/components/theme-wrapper"
import CardsNewYork from "@/registry/new-york/example/cards"

export function ThemesTabs() {
  return (
    <div className="space-y-8">
      <ThemeWrapper>
        <CardsNewYork />
      </ThemeWrapper>
    </div>
  )
}
