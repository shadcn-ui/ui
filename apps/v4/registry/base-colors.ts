import { THEMES } from "@/registry/themes"

export const BASE_COLORS = THEMES.filter((theme) =>
  ["zinc", "neutral", "stone", "gray"].includes(theme.name)
)

export type BaseColor = (typeof BASE_COLORS)[number]
