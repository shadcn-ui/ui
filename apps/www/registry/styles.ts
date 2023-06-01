export const styles = {
  default: {
    name: "Default",
  },
  "new-york": {
    name: "New York",
  },
} as const

export type Style = keyof typeof styles
