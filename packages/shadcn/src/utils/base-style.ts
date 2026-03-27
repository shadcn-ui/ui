export function applyBaseToStyle(style: string, base: "radix" | "base") {
  if (style.startsWith("radix-")) {
    return `${base}-${style.slice("radix-".length)}`
  }

  if (style.startsWith("base-")) {
    return `${base}-${style.slice("base-".length)}`
  }

  return style
}
