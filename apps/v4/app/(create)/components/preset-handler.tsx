"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { generateRandomPreset, isPresetCode } from "shadcn/preset"

import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

// Handles ?preset=random and converts bare URLs to use ?preset=CODE.
export function PresetHandler() {
  const router = useRouter()
  const [params, setParams] = useDesignSystemSearchParams()
  const hasConverted = React.useRef(false)

  // Handle ?preset=random.
  React.useEffect(() => {
    if (params.preset === "random") {
      router.replace(`/create?preset=${generateRandomPreset()}`)
    }
  }, [params.preset, router])

  // On initial load, if there's no preset in URL, encode current params to preset.
  React.useEffect(() => {
    if (hasConverted.current) return
    hasConverted.current = true

    if (!params.preset || params.preset === "random") return
    if (isPresetCode(params.preset)) return

    // Trigger encoding by setting a DS param to its current value.
    setParams({ base: params.base })
  }, [params.preset, params.base, setParams])

  return null
}
