export const styles = [
  {
    name: "default",
    label: "Default",
  },
  {
    name: "new-york",
    label: "New York",
  },
  {
    name: "tui",
    label: "Tailwind UI",
  },
] as const

export type Style = (typeof styles)[number]
