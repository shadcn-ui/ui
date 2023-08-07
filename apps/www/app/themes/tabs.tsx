"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { ThemeWrapper } from "@/components/theme-wrapper"
import CardsDefault from "@/registry/default/example/cards"
import CardsNewYork from "@/registry/new-york/example/cards"

export function ThemesTabs() {
  const [mounted, setMounted] = React.useState(false)
  const [config] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-8">
      {!mounted ? (
        <div>Loading</div>
      ) : (
        <ThemeWrapper>
          {config.style === "new-york" && <CardsNewYork />}
          {config.style === "default" && <CardsDefault />}
        </ThemeWrapper>
      )}
    </div>
  )
}
