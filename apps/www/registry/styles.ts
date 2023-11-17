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
    name: "material",
    label: "Material",
  },
] as const

export type Style = (typeof styles)[number]
