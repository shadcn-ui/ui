import { registryItemSchema, type RegistryItem } from "shadcn/schema"

import { BASE_COLORS, THEMES } from "@/registry/config"

export function buildTheme(baseColorName: string, themeName: string) {
  const baseColor = BASE_COLORS.find((c) => c.name === baseColorName)
  const theme = THEMES.find((t) => t.name === themeName)

  if (!baseColor || !theme) {
    throw new Error(
      `Base color "${baseColorName}" or theme "${themeName}" not found`
    )
  }

  const mergedTheme: RegistryItem = {
    name: `${baseColor.name}-${theme.name}`,
    title: `${baseColor.title} ${theme.title}`,
    type: "registry:theme",
    cssVars: {
      light: {
        ...baseColor.cssVars?.light,
        ...theme.cssVars?.light,
      },
      dark: {
        ...baseColor.cssVars?.dark,
        ...theme.cssVars?.dark,
      },
    },
  }

  return registryItemSchema.parse(mergedTheme)
}
