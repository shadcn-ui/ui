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
  {
    name: "base-nova",
    title: "Nova",
    componentLibrary: "base",
  },
  {
    name: "base-lyra",
    title: "Lyra",
    componentLibrary: "base",
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
