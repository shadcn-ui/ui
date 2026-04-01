import gray from "@/public/r/colors/gray.json"
import slate from "@/public/r/colors/slate.json"
import { THEMES } from "@/registry/themes"

const MISSING_BASE_COLORS = [
  {
    name: "slate",
    title: "Slate",
    cssVars: slate.cssVars,
  },
  {
    name: "gray",
    title: "Gray",
    cssVars: gray.cssVars,
  },
] as const

const EXISTING_BASE_COLOR_NAMES = [
  "neutral",
  "stone",
  "zinc",
  "mauve",
  "olive",
  "mist",
  "taupe",
] as const

export const BASE_COLORS = [
  ...MISSING_BASE_COLORS,
  ...THEMES.filter((theme) =>
    (EXISTING_BASE_COLOR_NAMES as readonly string[]).includes(theme.name)
  ),
]

export type BaseColor = (typeof BASE_COLORS)[number]
