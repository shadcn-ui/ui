export const style = [
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
] as const

export type Style = (typeof style)[number]
