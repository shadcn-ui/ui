export const styles = [
  {
    name: "new-york",
    label: "New York (Recommended)",
  },
  {
    name: "default",
    label: "Default",
  },
] as const

export type Style = (typeof styles)[number]
