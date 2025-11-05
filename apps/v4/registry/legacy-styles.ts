export const STYLES = [
  {
    name: "new-york-v4",
    title: "New York",
    componentLibrary: "radix",
  },
  {
    name: "radix-nova",
    title: "Nova",
    componentLibrary: "radix",
  },
  {
    name: "radix-lyra",
    title: "Lyra",
    componentLibrary: "radix",
  },
] as const

export type Style = (typeof STYLES)[number]

export async function getActiveStyle() {
  // In the future, this can read from cookies, session, etc.
  return STYLES[0]
}

export function getStyle(name: string) {
  return STYLES.find((style) => style.name === name)
}
