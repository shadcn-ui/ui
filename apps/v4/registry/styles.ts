export const STYLES = [
  {
    name: "vega",
    title: "Vega",
  },
  // {
  //   name: "nova",
  //   title: "Nova",
  // },
  // {
  //   name: "lyra",
  //   title: "Lyra",
  // },
  // {
  //   name: "maia",
  //   title: "Maia",
  // },
] as const

export type Style = (typeof STYLES)[number]
