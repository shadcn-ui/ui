import { RegistryItem, registryItemSchema } from "shadcn/schema"

import { BASE_COLORS, themes } from "@/registry/themes"

export function buildTheme(
  baseColorName: string,
  themeName: string
): RegistryItem {
  console.log({
    baseColorName,
    themeName,
  })
  const baseColor = BASE_COLORS.find((c) => c.name === baseColorName)
  const theme = themes.find((t) => t.name === themeName)

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
