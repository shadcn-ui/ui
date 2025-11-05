import { baseColorsV4 } from "@/registry/base-colors"

export const legacyThemes = Object.keys(baseColorsV4).map((color) => {
  return {
    name: `theme-${color}`,
    type: "registry:theme",
    cssVars: baseColorsV4[color as keyof typeof baseColorsV4],
  }
})

export const themes = [
  {
    name: "nova",
    title: "Nova",
  },
  {
    name: "lyra",
    title: "Lyra",
  },
] as const

export type Theme = (typeof themes)[number]
