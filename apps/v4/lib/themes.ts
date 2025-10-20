import { baseColors } from "@/registry/registry-base-colors"

export const THEMES = baseColors.filter(
  (theme) => !["slate", "stone", "gray", "zinc"].includes(theme.name)
)
