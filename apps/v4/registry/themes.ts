export const themes = [
  {
    name: "neutral",
    title: "Neutral",
  },
  {
    name: "blue",
    title: "Blue",
  },
  {
    name: "red",
    title: "Red",
  },
] as const

export type Theme = (typeof themes)[number]
