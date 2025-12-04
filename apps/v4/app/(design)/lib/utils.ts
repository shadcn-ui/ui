import { RegistryItem } from "shadcn/schema"

import { BASE_COLORS } from "@/registry/base-colors"
import { THEMES } from "@/registry/themes"

const mapping = {
  "registry:block": "Blocks",
  "registry:example": "Components",
}

export function groupItemsByType(
  items: Pick<RegistryItem, "name" | "title" | "type">[]
) {
  const grouped = items.reduce(
    (acc, item) => {
      acc[item.type] = [...(acc[item.type] || []), item]
      return acc
    },
    {} as Record<string, Pick<RegistryItem, "name" | "title" | "type">[]>
  )

  return Object.entries(grouped)
    .map(([type, items]) => ({
      type,
      title: mapping[type as keyof typeof mapping] || type,
      items,
    }))
    .sort((a, b) => {
      const aIndex = Object.keys(mapping).indexOf(a.type)
      const bIndex = Object.keys(mapping).indexOf(b.type)

      // If both are in mapping, sort by their order.
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      // If only a is in mapping, it comes first.
      if (aIndex !== -1) {
        return -1
      }
      // If only b is in mapping, it comes first.
      if (bIndex !== -1) {
        return 1
      }
      // If neither is in mapping, maintain original order.
      return 0
    })
}

export function getThemesForBaseColor(baseColorName: string) {
  const baseColorNames = BASE_COLORS.map((bc) => bc.name)

  return THEMES.filter((theme) => {
    // Include the base color itself (since it's also a theme).
    if (theme.name === baseColorName) {
      return true
    }
    // Include all themes that are not base colors (colored themes).
    return !baseColorNames.includes(theme.name)
  })
}
