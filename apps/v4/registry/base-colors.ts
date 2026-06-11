import { THEMES } from "@/registry/themes"

export const BASE_COLORS = THEMES.filter((theme) =>
  ["neutral", "stone", "zinc", "mauve", "olive", "mist", "taupe"].includes(
    theme.name
  )
)

export type BaseColor = (typeof BASE_COLORS)[number]
