export const styles = [
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

export type Style = (typeof styles)[number]
