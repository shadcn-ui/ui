export const STYLES = [
  {
    name: "vega",
    title: "Vega",
  },
  {
    name: "nova",
    title: "Nova",
  },
] as const

export type Style = (typeof STYLES)[number]
