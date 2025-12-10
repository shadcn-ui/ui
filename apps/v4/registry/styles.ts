export const STYLES = [
  {
    name: "vega",
    title: "Vega",
  },
  {
    name: "nova",
    title: "Nova",
  },
  {
    name: "lyra",
    title: "Lyra",
  },
] as const

export type Style = (typeof STYLES)[number]
