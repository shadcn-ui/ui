export const STYLES = [
  { name: "new-york-v4" as const, title: "New York" },
] as const

export const DEFAULT_STYLE = STYLES[0]

export type Style = (typeof STYLES)[number]

export function getStyle(name: string) {
  return STYLES.find((style) => style.name === name)
}
