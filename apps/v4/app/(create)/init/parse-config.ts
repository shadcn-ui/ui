import { decodePreset, isPresetCode } from "shadcn/preset"

import {
  designSystemConfigSchema,
  type DesignSystemConfig,
} from "@/registry/config"

// Parses design system config from URL search params.
export function parseDesignSystemConfig(searchParams: URLSearchParams) {
  let configInput: Record<string, unknown>
  const presetParam = searchParams.get("preset")

  if (presetParam && isPresetCode(presetParam)) {
    const decoded = decodePreset(presetParam)
    if (!decoded) {
      return { success: false as const, error: "Invalid preset code" }
    }
    configInput = {
      ...decoded,
      base: searchParams.get("base") ?? "radix",
      template: searchParams.get("template") ?? undefined,
      rtl: searchParams.get("rtl") === "true",
    }
  } else {
    configInput = {
      base: searchParams.get("base"),
      style: searchParams.get("style"),
      iconLibrary: searchParams.get("iconLibrary"),
      baseColor: searchParams.get("baseColor"),
      theme: searchParams.get("theme"),
      font: searchParams.get("font"),
      menuAccent: searchParams.get("menuAccent"),
      menuColor: searchParams.get("menuColor"),
      radius: searchParams.get("radius"),
      template: searchParams.get("template") ?? undefined,
      rtl: searchParams.get("rtl") === "true",
    }
  }

  const result = designSystemConfigSchema.safeParse(configInput)

  if (!result.success) {
    return { success: false as const, error: result.error.issues[0].message }
  }

  return { success: true as const, data: result.data as DesignSystemConfig }
}
