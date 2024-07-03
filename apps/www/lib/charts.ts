export function themeColorsToCssVariables(
  colors: Record<string, string>
): Record<string, string> {
  return colors
    ? Object.fromEntries(
        Object.entries(colors).map(([name, value]) => {
          if (value === undefined) return []
          const cssName = themeColorNameToCssVariable(name)
          return [cssName, value]
        })
      )
    : {}
}

export function themeColorNameToCssVariable(name: string) {
  return `--${name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`
}
