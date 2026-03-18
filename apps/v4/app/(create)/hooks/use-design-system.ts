"use client"

import { encodePreset } from "shadcn/preset"

import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

// Returns the canonical preset code derived from the current search params.
export function usePresetCode() {
  const [params] = useDesignSystemSearchParams()

  return encodePreset({
    style: params.style,
    baseColor: params.baseColor,
    theme: params.theme,
    chartColor: params.chartColor,
    iconLibrary: params.iconLibrary,
    font: params.font,
    fontHeading: params.fontHeading,
    radius: params.radius,
    menuAccent: params.menuAccent,
    menuColor: params.menuColor,
  } as Parameters<typeof encodePreset>[0])
}
