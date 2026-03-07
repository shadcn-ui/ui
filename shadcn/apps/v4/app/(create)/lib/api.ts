import "server-only"

import { registryItemSchema } from "shadcn/schema"

import { BASES, getThemesForBaseColor, type BaseName } from "@/registry/config"
import {
  ALLOWED_ITEM_TYPES,
  EXCLUDED_ITEMS,
} from "@/app/(create)/lib/constants"

export async function getItemsForBase(base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index) {
    return []
  }

  return Object.values(index).filter(
    (item) =>
      ALLOWED_ITEM_TYPES.includes(item.type) &&
      !EXCLUDED_ITEMS.includes(item.name)
  )
}

export async function getBaseItem(name: string, base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name] || EXCLUDED_ITEMS.includes(name)) {
    return null
  }

  return registryItemSchema.parse(index[name])
}

export async function getBaseComponent(name: string, base: BaseName) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name] || EXCLUDED_ITEMS.includes(name)) {
    return null
  }

  return index[name].component
}

export async function getAllItems() {
  const entries = await Promise.all(
    BASES.map(async (base) => {
      const items = await getItemsForBase(base.name as BaseName)
      const filtered: Pick<
        NonNullable<(typeof items)[number]>,
        "name" | "title" | "type"
      >[] = []
      for (const item of items) {
        if (item !== null && !/\d+$/.test(item.name)) {
          filtered.push({
            name: item.name,
            title: item.title,
            type: item.type,
          })
        }
      }
      return [base.name, filtered] as const
    })
  )
  return Object.fromEntries(entries)
}

// Re-export for server-side use.
export { getThemesForBaseColor }
