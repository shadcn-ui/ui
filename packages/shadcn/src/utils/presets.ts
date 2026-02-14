import { REGISTRY_URL } from "@/src/registry/constants"
import { type Preset } from "@/src/schema"

const SHADCN_URL = REGISTRY_URL.replace(/\/r\/?$/, "")

export const DEFAULT_PRESETS = {
  "radix-nova": {
    name: "radix-nova",
    title: "Radix",
    description: "Nova / Lucide / Geist",
    base: "radix",
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "geist",
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    rtl: false,
  },
  "base-nova": {
    name: "base-nova",
    title: "Base",
    description: "Nova / Lucide / Geist",
    base: "base",
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    iconLibrary: "lucide",
    font: "geist",
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    rtl: false,
  },
} satisfies Record<string, Preset>

export function resolveCreateUrl(
  searchParams?: Partial<{
    command: "create" | "init"
    template: string
    rtl: boolean
    base: string
  }>
) {
  const url = new URL(`${SHADCN_URL}/create`)
  const { rtl, ...params } = searchParams ?? {}

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }

  // Do not set rtl if it's false.
  if (rtl) {
    url.searchParams.set("rtl", "true")
  }

  return url.toString()
}

export function resolveInitUrl(
  preset: Omit<Preset, "name" | "title" | "description">
) {
  const params = new URLSearchParams({
    base: preset.base,
    style: preset.style,
    baseColor: preset.baseColor,
    theme: preset.theme,
    iconLibrary: preset.iconLibrary,
    font: preset.font,
    rtl: String(preset.rtl ?? false),
    menuAccent: preset.menuAccent,
    menuColor: preset.menuColor,
    radius: preset.radius,
  })

  return `${SHADCN_URL}/init?${params.toString()}`
}
