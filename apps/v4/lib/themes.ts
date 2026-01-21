import { baseColors } from "@/registry/_legacy-base-colors"

export const THEMES = baseColors
  .filter((theme) => !["slate", "stone", "gray", "zinc"].includes(theme.name))
  .sort((a, b) => a.name.localeCompare(b.name))
