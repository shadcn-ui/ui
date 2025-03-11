export const THEMES = [
  {
    name: "Default",
    value: "default",
    colors: {
      light: "oklch(0.205 0 0)",
      dark: "oklch(0.922 0 0)",
    },
  },
  {
    name: "Blue",
    value: "blue",
    colors: {
      light: "oklch(0.488 0.243 264.376)",
      dark: "oklch(0.488 0.243 264.376)",
    },
  },
  {
    name: "Lime",
    value: "lime",
    colors: {
      light: "oklch(0.532 0.157 131.589)",
      dark: "oklch(0.532 0.157 131.589)",
    },
  },
]

export type Theme = (typeof THEMES)[number]
