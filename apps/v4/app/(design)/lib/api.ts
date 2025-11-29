import "server-only"

import { RegistryItem, registryItemSchema } from "shadcn/schema"

import { Base } from "@/registry/bases"
import { ALLOWED_ITEM_TYPES } from "@/app/(design)/lib/constants"
import { getThemesForBaseColor } from "@/app/(design)/lib/utils"

export async function getItemsForBase(base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index) {
    return []
  }

  return Object.values(index).filter((item) =>
    ALLOWED_ITEM_TYPES.includes(item.type)
  )
}

export async function getBaseItem(name: string, base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return registryItemSchema.parse(index[name])
}

export async function getBaseComponent(name: string, base: Base["name"]) {
  const { Index } = await import("@/registry/bases/__index__")
  const index = Index[base]

  if (!index?.[name]) {
    return null
  }

  return index[name].component
}

// Re-export for server-side use.
export { getThemesForBaseColor }
