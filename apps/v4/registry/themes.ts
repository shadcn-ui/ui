import { type Registry } from "shadcn/schema"

import { baseColorsV4 } from "@/registry/base-colors"

// Create a theme for each color in the base colors.
export const themes: Registry["items"] = Object.keys(baseColorsV4).map(
  (color) => {
    return {
      name: `theme-${color}`,
      type: "registry:theme",
      cssVars: baseColorsV4[color as keyof typeof baseColorsV4],
    }
  }
)
