export const STYLES = [
  {
    name: "default",
    title: "Default",
  },
  {
    name: "nova",
    title: "Nova",
  },
  {
    name: "lyra",
    title: "Lyra",
  },
  {
    name: "maia",
    title: "Maia",
  },
] as const

export type Style = (typeof STYLES)[number]
