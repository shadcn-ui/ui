export const styles = [
  {
    name: "new-york",
    label: "New York",
  },
  {
    name: "default",
    label: "Default",
  },
] as const

export type Style = (typeof styles)[number]
