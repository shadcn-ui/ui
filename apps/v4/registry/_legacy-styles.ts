export const legacyStyles = [
  {
    name: "new-york-v4",
    title: "New York",
  },
  {
    name: "base-nova",
    title: "Base Nova",
  },
  {
    name: "radix-nova",
    title: "Radix Nova",
  },
] as const

export type Style = (typeof legacyStyles)[number]

export async function getActiveStyle() {
  // In the future, this can read from cookies, session, etc.
  return legacyStyles[0]
}

export function getStyle(name: string) {
  return legacyStyles.find((style) => style.name === name)
}
