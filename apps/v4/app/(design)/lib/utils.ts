import { RegistryItem } from "shadcn/schema"

const mapping = {
  "registry:block": "Blocks",
  "registry:example": "Examples",
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

  return Object.entries(grouped).map(([type, items]) => ({
    type,
    title: mapping[type as keyof typeof mapping] || type,
    items,
  }))
}
