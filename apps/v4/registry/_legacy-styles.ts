export const legacyStyles = [
  {
    name: "radix-force-ui", // [FORCE-UI]
    title: "Force UI",
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
