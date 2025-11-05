import { baseColorsV4 } from "@/registry/base-colors"

export const themes = Object.keys(baseColorsV4).map((color) => {
  return {
    name: `theme-${color}`,
    type: "registry:theme",
    cssVars: baseColorsV4[color as keyof typeof baseColorsV4],
  }
})
