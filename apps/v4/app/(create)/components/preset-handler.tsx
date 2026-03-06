"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { generateRandomPreset, isPresetCode } from "shadcn/preset"

import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function PresetHandler() {
  const router = useRouter()
  const [params, setParams] = useDesignSystemSearchParams()
  const hasConverted = React.useRef(false)

  React.useEffect(() => {
    if (params.preset === "random") {
      router.replace(`/create?preset=${generateRandomPreset()}`)
    }
  }, [params.preset, router])

  React.useEffect(() => {
    if (hasConverted.current) {
      return
    }
    hasConverted.current = true

    if (!params.preset || params.preset === "random") {
      return
    }

    if (isPresetCode(params.preset)) {
      return
    }

    setParams({ base: params.base })
  }, [params.preset, params.base, setParams])

  return null
}
