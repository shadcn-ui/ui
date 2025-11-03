export const themes = [
  {
    name: "blue",
    title: "Blue",
  },
  {
    name: "green",
    title: "Green",
  },
  {
    name: "amber",
    title: "Amber",
  },
  {
    name: "mono",
    title: "Mono",
  },
] as const

export type Theme = (typeof themes)[number]
