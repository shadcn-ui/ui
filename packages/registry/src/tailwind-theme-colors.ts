import { registryItemCssVarsSchema } from "@/src/registry/schema"
import { z } from "zod"

export function buildTailwindThemeColorsFromCssVars(
  cssVars: z.infer<typeof registryItemCssVarsSchema>
) {
  const result: Record<string, any> = {}

  for (const key of Object.keys(cssVars)) {
    const parts = key.split("-")
    const colorName = parts[0]
    const subType = parts.slice(1).join("-")

    if (subType === "") {
      if (typeof result[colorName] === "object") {
        result[colorName].DEFAULT = `hsl(var(--${key}))`
      } else {
        result[colorName] = `hsl(var(--${key}))`
      }
    } else {
      if (typeof result[colorName] !== "object") {
        result[colorName] = { DEFAULT: `hsl(var(--${colorName}))` }
      }
      result[colorName][subType] = `hsl(var(--${key}))`
    }
  }

  // Remove DEFAULT if it's not in the original cssVars
  for (const [colorName, value] of Object.entries(result)) {
    if (
      typeof value === "object" &&
      value.DEFAULT === `hsl(var(--${colorName}))` &&
      !(colorName in cssVars)
    ) {
      delete value.DEFAULT
    }
  }

  return result
}
