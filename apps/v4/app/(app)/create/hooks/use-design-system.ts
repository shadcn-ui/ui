"use client"

import { getAppUrl } from "@/lib/utils"
import { getPresetCode } from "@/app/(app)/create/lib/preset-code"
import { useDesignSystemSearchParams } from "@/app/(app)/create/lib/search-params"

const ORIGIN = getAppUrl()

// Returns the canonical preset code derived from the current search params.
export function usePresetCode() {
  const [params] = useDesignSystemSearchParams()

  return getPresetCode(params)
}

// Returns a full /init URL for use in CLI commands.
// This bypasses preset code encoding so the official shadcn CLI can
// resolve custom themes (like force-ui) directly from the server.
export function useInitUrl() {
  const [params] = useDesignSystemSearchParams()

  const url = new URL("/init", ORIGIN)
  url.searchParams.set("base", params.base)
  url.searchParams.set("style", params.style)
  url.searchParams.set("baseColor", params.baseColor)
  url.searchParams.set("theme", params.theme)
  url.searchParams.set("chartColor", params.chartColor)
  url.searchParams.set("iconLibrary", params.iconLibrary)
  url.searchParams.set("font", params.font)
  if (params.fontHeading && params.fontHeading !== "inherit") {
    url.searchParams.set("fontHeading", params.fontHeading)
  }
  url.searchParams.set("menuAccent", params.menuAccent)
  url.searchParams.set("menuColor", params.menuColor)
  url.searchParams.set("radius", params.radius)
  if (params.rtl) {
    url.searchParams.set("rtl", "true")
  }

  return url.toString()
}
