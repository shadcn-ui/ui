"use client"

import * as React from "react"
import { encodePreset, isPresetCode } from "shadcn/preset"

import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

// Returns the current preset code derived from search params.
export function usePresetCode() {
  const [params] = useDesignSystemSearchParams()

  return React.useMemo(() => {
    // If preset is already in the URL, return it.
    if (params.preset && isPresetCode(params.preset)) {
      return params.preset
    }

    // Otherwise encode current params (e.g. on initial load before first interaction).
    return encodePreset({
      style: params.style ?? undefined,
      baseColor: params.baseColor ?? undefined,
      theme: params.theme ?? undefined,
      iconLibrary: params.iconLibrary ?? undefined,
      font: params.font ?? undefined,
      radius: params.radius ?? undefined,
      menuAccent: params.menuAccent ?? undefined,
      menuColor: params.menuColor ?? undefined,
    } as Parameters<typeof encodePreset>[0])
  }, [
    params.preset,
    params.style,
    params.baseColor,
    params.theme,
    params.iconLibrary,
    params.font,
    params.radius,
    params.menuAccent,
    params.menuColor,
  ])
}
